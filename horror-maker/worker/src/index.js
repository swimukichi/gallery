// 怖話工房 Cloudflare Worker
// POST /api/plot | /api/revise | /api/chapter
import {
  MAX_REVISIONS,
  buildChapterPrompt,
  buildPlotPrompt,
  buildRevisePrompt,
  chapterChars,
  normalizePlot,
  validRevisionId,
  validThemeId,
  validateOptions,
} from "./prompts.js";

const API_URL = "https://api.anthropic.com/v1/messages";
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const IP_LIMIT = 3;
const ALL_LIMIT = 100;
const CHAPTER_MAX_RUNS = 2; // 初回 + 再生成1回
const MAX_BODY = 64 * 1024;
const TAIL_CHARS = 500;

const enc = new TextEncoder();
const dec = new TextDecoder();

// ---------- 共通 ----------
class HttpError extends Error {
  constructor(status, code, message) {
    super(code);
    this.status = status;
    this.code = code;
    this.userMessage = message;
  }
}
const E = {
  badRequest: () => new HttpError(400, "bad_request", "入力が正しくありません。ページを読み込み直してください。"),
  badToken: () => new HttpError(401, "invalid_token", "この作品の続きは作れません。最初から作り直してください。"),
  expired: () => new HttpError(401, "expired", "時間が経ちすぎました。最初から作り直してください。"),
  rate: () => new HttpError(429, "rate_limited", "本日の上限に達しました。明日また来てください。"),
  reviseLimit: () => new HttpError(429, "revise_limit", `プロットを直せるのは${MAX_REVISIONS}回までです。`),
  chapterLimit: () => new HttpError(429, "chapter_limit", "この章はこれ以上書き直せません。"),
  order: () => new HttpError(400, "chapter_order", "前の章から順に書いてください。"),
  busy: () => new HttpError(503, "busy", "混み合っています。少し待ってからもう一度押してください。"),
  upstream: () => new HttpError(502, "generation_failed", "生成に失敗しました。もう一度押してください。"),
  badJson: () => new HttpError(502, "invalid_json", "プロットの形式が崩れました。もう一度押してください。"),
};

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "https://swimukichi.github.io")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function corsHeaders(req, env) {
  const origin = req.headers.get("Origin");
  if (origin && allowedOrigins(env).includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
  }
  return { Vary: "Origin" };
}
function jsonResponse(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors },
  });
}
function errorResponse(e, cors) {
  if (e instanceof HttpError) return jsonResponse({ error: e.code, message: e.userMessage }, e.status, cors);
  console.error("unexpected", e && e.stack ? e.stack : String(e));
  return jsonResponse({ error: "internal", message: "生成に失敗しました。もう一度押してください。" }, 500, cors);
}

async function readBody(req) {
  const text = await req.text();
  if (text.length > MAX_BODY) throw E.badRequest();
  let body;
  try {
    body = JSON.parse(text);
  } catch (_) {
    throw E.badRequest();
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw E.badRequest();
  return body;
}

// ---------- token ----------
function b64e(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function b64d(str) {
  const s = atob(str);
  const u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}
async function hmacKey(env) {
  if (!env.HMAC_SECRET) throw new Error("HMAC_SECRET is not set");
  return crypto.subtle.importKey("raw", enc.encode(env.HMAC_SECRET), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}
async function signToken(env, payload) {
  const p = b64e(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(env), enc.encode(p));
  return p + "." + b64e(new Uint8Array(sig));
}
async function verifyToken(env, token) {
  if (typeof token !== "string" || token.length > 60000) throw E.badToken();
  const parts = token.split(".");
  if (parts.length !== 2) throw E.badToken();
  let payload;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(env), b64d(parts[1]), enc.encode(parts[0]));
    if (!ok) throw E.badToken();
    payload = JSON.parse(dec.decode(b64d(parts[0])));
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw E.badToken();
  }
  const age = Date.now() - payload.issuedAt;
  if (!Number.isFinite(age) || age < -60000) throw E.badToken();
  if (age > TOKEN_TTL_MS) throw E.expired();
  return payload;
}

// ---------- KV ----------
function jstDate() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10).replaceAll("-", "");
}
// /api/plot だけカウント。IPごと1日3回・全体1日100回（日本時間0時リセット）
async function takeRateLimit(env, ip) {
  const d = jstDate();
  const kIp = `rl:ip:${d}:${ip}`;
  const kAll = `rl:all:${d}`;
  const [a, b] = await Promise.all([env.RATE_KV.get(kIp), env.RATE_KV.get(kAll)]);
  const nIp = Number(a) || 0;
  const nAll = Number(b) || 0;
  if (nIp >= IP_LIMIT || nAll >= ALL_LIMIT) throw E.rate();
  const opt = { expirationTtl: 3 * 86400 };
  await Promise.all([env.RATE_KV.put(kIp, String(nIp + 1), opt), env.RATE_KV.put(kAll, String(nAll + 1), opt)]);
  // 生成に失敗したときの返却用
  return async () => {
    const [a2, b2] = await Promise.all([env.RATE_KV.get(kIp), env.RATE_KV.get(kAll)]);
    await Promise.all([
      env.RATE_KV.put(kIp, String(Math.max(0, (Number(a2) || 0) - 1)), opt),
      env.RATE_KV.put(kAll, String(Math.max(0, (Number(b2) || 0) - 1)), opt),
    ]);
  };
}
// token の使い回し（リプレイ）対策：作品ID(sid)ごとの使用量をKVにも持つ
async function getSess(env, sid) {
  const v = await env.RATE_KV.get(`sess:${sid}`, "json");
  return v && typeof v === "object" ? { rev: Number(v.rev) || 0, ch: v.ch && typeof v.ch === "object" ? v.ch : {} } : { rev: 0, ch: {} };
}
const putSess = (env, sid, s) => env.RATE_KV.put(`sess:${sid}`, JSON.stringify(s), { expirationTtl: 2 * 3600 + 600 });

// ---------- Claude API ----------
class UpstreamError extends Error {
  constructor(status) {
    super("upstream " + status);
    this.status = status;
  }
}
function callClaude(env, body) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: env.MODEL || "claude-sonnet-5-5", ...body }),
  });
}
function upstreamToHttp(e) {
  if (e instanceof HttpError) return e;
  if (e instanceof UpstreamError && (e.status === 429 || e.status === 529 || e.status >= 500)) return E.busy();
  return E.upstream();
}
function parseJsonText(text) {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(text.slice(a, b + 1));
  } catch (_) {
    return null;
  }
}
// プロットをJSONで生成。失敗時は1回だけ再試行
async function generatePlot(env, prompt, chapters) {
  if (env.MOCK === "1") return mockPlot(chapters);
  let last = E.badJson();
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await callClaude(env, { max_tokens: 2000, messages: [{ role: "user", content: prompt }] });
      if (!res.ok) {
        console.error("anthropic status", res.status);
        throw new UpstreamError(res.status);
      }
      const data = await res.json();
      const text = (data.content || []).map((c) => (c && c.type === "text" ? c.text : "")).join("");
      const plot = normalizePlot(parseJsonText(text), chapters);
      if (!plot) {
        last = E.badJson();
        continue;
      }
      return plot;
    } catch (e) {
      last = upstreamToHttp(e);
      if (e instanceof UpstreamError && [400, 401, 403, 404].includes(e.status)) throw last;
    }
  }
  throw last;
}

// Anthropic の SSE を {text} / {stop} / {error} に分解する
async function* parseUpstream(res) {
  const reader = res.body.getReader();
  let buf = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let idx;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const block = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        const line = block.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let ev;
        try {
          ev = JSON.parse(line.slice(5).trim());
        } catch (_) {
          continue;
        }
        if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") yield { text: ev.delta.text };
        else if (ev.type === "message_delta" && ev.delta && ev.delta.stop_reason) yield { stop: ev.delta.stop_reason };
        else if (ev.type === "error") yield { error: true };
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch (_) {}
  }
}

// ---------- MOCK（APIキーなし・課金なしの動作確認用。MOCK=1 のときだけ） ----------
function mockPlot(n) {
  return {
    title: "（モック）開かない扉",
    logline: "これはAPIを呼ばないダミーのプロットです。",
    intro: "導入のダミー。主人公は違和感を覚える。",
    development: "展開のダミー。違和感は少しずつ強まる。",
    twist: "転換のダミー。前提が裏返る。",
    truth: "真相のダミー。最初から仕込まれていた。",
    ending: "結末のダミー。",
    chapters: Array.from({ length: n }, (_, i) => ({
      no: i + 1,
      title: `ダミー章${i + 1}`,
      summary: `第${i + 1}章で起きることのダミー。二文目もダミー。`,
    })),
  };
}
async function* mockChapter(chapterNo, per) {
  const para = `第${chapterNo}章のダミー本文です。廊下の奥で、誰かが静かに扉を閉める音がした。わたしは振り返らなかった。`;
  const lines = [];
  for (let len = 0; len < Math.min(per, 400); len += para.length) lines.push(para, "");
  const text = lines.join("\n");
  for (let i = 0; i < text.length; i += 12) {
    await new Promise((r) => setTimeout(r, 15));
    yield { text: text.slice(i, i + 12) };
  }
  yield { stop: "end_turn" };
}

// ---------- ハンドラ ----------
async function handlePlot(req, env, cors) {
  const body = await readBody(req);
  const options = validateOptions(body.options);
  if (!options || !validThemeId(body.themeId)) throw E.badRequest();
  const themeId = body.themeId;

  const ip = req.headers.get("CF-Connecting-IP") || "local";
  const refund = await takeRateLimit(env, ip);
  let plot;
  try {
    plot = await generatePlot(env, buildPlotPrompt(options, themeId), Number(options.chapters));
  } catch (e) {
    await refund().catch(() => {});
    throw e;
  }
  const payload = {
    sid: crypto.randomUUID(),
    options,
    themeId,
    plot,
    revLeft: MAX_REVISIONS,
    issuedAt: Date.now(),
    doneChapters: {},
    tails: {},
  };
  return jsonResponse({ plot, token: await signToken(env, payload) }, 200, cors);
}

async function handleRevise(req, env, cors) {
  const body = await readBody(req);
  if (!validRevisionId(body.revisionId)) throw E.badRequest();
  const p = await verifyToken(env, body.token);
  const sess = await getSess(env, p.sid);
  if (!(p.revLeft > 0) || sess.rev >= MAX_REVISIONS) throw E.reviseLimit();

  const plot = await generatePlot(
    env,
    buildRevisePrompt(p.options, p.themeId, p.plot, body.revisionId),
    Number(p.options.chapters),
  );
  sess.rev += 1;
  await putSess(env, p.sid, sess);
  // プロットが変わるので、書き終えた章の情報は引き継がない
  const next = { ...p, plot, revLeft: p.revLeft - 1, doneChapters: {}, tails: {} };
  return jsonResponse({ plot, token: await signToken(env, next) }, 200, cors);
}

async function handleChapter(req, env, cors, ctx) {
  const body = await readBody(req);
  const p = await verifyToken(env, body.token);
  const n = p.plot.chapters.length;
  const no = body.chapterNo;
  if (!Number.isInteger(no) || no < 1 || no > n) throw E.badRequest();
  if (no > 1 && typeof p.tails[no - 1] !== "string") throw E.order();

  const sess = await getSess(env, p.sid);
  const used = Math.max(Number(sess.ch[no]) || 0, Number(p.doneChapters[no]) || 0);
  if (used >= CHAPTER_MAX_RUNS) throw E.chapterLimit();
  sess.ch[no] = used + 1;
  await putSess(env, p.sid, sess);

  let source;
  if (env.MOCK === "1") {
    source = mockChapter(no, chapterChars(p.options));
  } else {
    const prompt = buildChapterPrompt(p.options, p.themeId, p.plot, no, no > 1 ? p.tails[no - 1] : "");
    let up;
    try {
      up = await callClaude(env, {
        max_tokens: chapterChars(p.options) * 2,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (e) {
      sess.ch[no] = used;
      await putSess(env, p.sid, sess).catch(() => {});
      throw E.upstream();
    }
    if (!up.ok || !up.body) {
      console.error("anthropic status", up.status);
      sess.ch[no] = used;
      await putSess(env, p.sid, sess).catch(() => {});
      throw upstreamToHttp(new UpstreamError(up.status));
    }
    source = parseUpstream(up);
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const send = (event, data) => writer.write(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  const pump = (async () => {
    let text = "";
    let stop = "";
    let failed = false;
    try {
      for await (const ev of source) {
        if (ev.text) {
          text += ev.text;
          await send("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: ev.text } });
        } else if (ev.stop) stop = ev.stop;
        else if (ev.error) failed = true;
      }
    } catch (e) {
      console.error("stream error", e && e.message);
      failed = true;
    }
    try {
      if (failed || !text) {
        await send("error", { error: "generation_failed", message: "生成に失敗しました。もう一度押してください。" });
      } else {
        const next = {
          ...p,
          doneChapters: { ...p.doneChapters, [no]: used + 1 },
          tails: { ...p.tails, [no]: text.slice(-TAIL_CHARS) },
        };
        await send("message_delta", { type: "message_delta", delta: { stop_reason: stop || "end_turn" } });
        await send("hb_done", { token: await signToken(env, next), truncated: stop === "max_tokens" });
      }
      await writer.close();
    } catch (_) {
      try {
        await writer.abort();
      } catch (__) {}
    }
  })();
  if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(pump);

  return new Response(readable, {
    status: 200,
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store", ...cors },
  });
}

const ROUTES = { "/api/plot": handlePlot, "/api/revise": handleRevise, "/api/chapter": handleChapter };

export default {
  async fetch(req, env, ctx) {
    const cors = corsHeaders(req, env);
    const origin = req.headers.get("Origin");
    if (origin && !cors["Access-Control-Allow-Origin"]) {
      return jsonResponse({ error: "forbidden", message: "このサイトからは使えません。" }, 403, cors);
    }
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const handler = ROUTES[new URL(req.url).pathname];
    if (!handler) return jsonResponse({ error: "not_found", message: "見つかりません。" }, 404, cors);
    if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", message: "使えないメソッドです。" }, 405, cors);
    try {
      return await handler(req, env, cors, ctx);
    } catch (e) {
      return errorResponse(e, cors);
    }
  },
};
