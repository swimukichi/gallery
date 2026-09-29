// wrangler なしのローカル確認用（MOCK=1 固定・課金なし）
// 使い方: node worker/test/dev-server.mjs   → 画面 http://localhost:8000 / API http://localhost:8787
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import worker from "../src/index.js";
import { FakeKV } from "./fake-kv.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const env = {
  MOCK: "1",
  HMAC_SECRET: "local-dev-secret",
  ALLOWED_ORIGINS: "http://localhost:8000,http://127.0.0.1:8000",
  RATE_KV: new FakeKV(),
};
const ctx = { waitUntil() {} };

http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = new Request("http://localhost:8787" + req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
  });
  const out = await worker.fetch(r, env, ctx);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  if (out.body) Readable.fromWeb(out.body).pipe(res); else res.end();
}).listen(8787, () => console.log("API  http://localhost:8787 (MOCK)"));

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root) || f.includes(path.sep + "worker" + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end("not found");
  }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}).listen(8000, () => console.log("画面 http://localhost:8000"));
