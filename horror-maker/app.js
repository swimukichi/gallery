// 怖話工房 フロント。プロンプトは持たず、選択肢IDだけをWorkerに送る。
// ローカル確認: http://localhost:8787 / 公開時は wrangler deploy で出たURLに変える
const WORKER_URL = "http://localhost:8787";

// <options> 表示名とIDのみ（内容の定義は worker/src/prompts.js）
const GROUPS = [
  { key: "world", label: "世界観", items: [["real", "現実"], ["shinshoku", "侵食（バイオメカニカル）"]] },
  { key: "genre", label: "ホラーの種類", items: [["kaidan", "怪談"], ["shinrei", "心霊"], ["hitokowa", "人怖"], ["shinri", "心理ホラー"], ["inshu", "因習村"], ["netto", "ネット怪談"], ["toshi", "都市伝説"], ["mokyu", "モキュメンタリー"], ["sf", "SFホラー"], ["body", "ボディホラー"], ["fujori", "不条理"]] },
  { key: "setting", label: "舞台", items: [["town", "現代日本の街"], ["school", "学校"], ["apartment", "マンション・団地"], ["hospital", "病院"], ["village", "田舎の集落"], ["office", "職場"], ["mountain_sea", "山・海"]] },
  { key: "hero", label: "主人公", items: [["man_worker", "男性・社会人"], ["woman_worker", "女性・社会人"], ["boy_student", "男子学生"], ["girl_student", "女子学生"], ["child", "子ども"], ["elder", "高齢者"]] },
  { key: "pov", label: "語り方", items: [["first", "一人称"], ["third", "三人称"]] },
  { key: "style", label: "文章", items: [["tantan", "淡々"], ["bungaku", "文学的"], ["yomiyasui", "読みやすい"], ["namanamashii", "生々しい"]] },
  { key: "fear", label: "怖さの方向", items: [["jiwajiwa", "じわじわ"], ["shogeki", "衝撃系"], ["bukimi", "不気味"], ["atoaji", "後味が悪い"]] },
  { key: "ending", label: "結末", items: [["salvation", "救いあり"], ["no_salvation", "救いなし"], ["meaning", "意味が分かると怖い"], ["interpret", "解釈を残す"]] },
  { key: "length", label: "文字数", items: [["2000", "2000字"], ["4000", "4000字"], ["6000", "6000字"]] },
  { key: "chapters", label: "章数", items: [["1", "1章"], ["3", "3章"], ["5", "5章"]] },
];
const THEMES = [["none", "指定なし"], ["conbini", "深夜のコンビニ"], ["danchi", "古い団地"], ["unknown_call", "知らない番号からの着信"], ["akazu", "祖母の家の開かずの間"], ["chat_read", "社内チャットの既読"], ["closed_school", "閉校した小学校"], ["family_photo", "家族写真に写る他人"], ["night_bus", "夜行バス"], ["elevator", "止まるはずのない階に止まるエレベーター"], ["tunnel", "旧道のトンネル"], ["hotel_404", "ビジネスホテルの404号室"], ["neighbor_noise", "隣人の生活音"], ["smart_speaker", "スマートスピーカーの独り言"], ["delivery", "身に覚えのない宅配便"], ["last_train", "終電の一つ前の車両"], ["mirror", "実家の姿見"], ["cram_school", "夜の学習塾"], ["night_ward", "夜勤の病棟"], ["hokora", "山道の小さな祠"], ["tsuya", "通夜の晩"], ["jiko_bukken", "格安の事故物件"], ["school_trip", "修学旅行の夜"], ["cctv", "防犯カメラの映像"], ["matching", "マッチングアプリの相手"], ["dead_friend_dm", "亡くなった友人からのDM"], ["video_tape", "押し入れから出てきたビデオテープ"], ["empty_room", "引っ越し前夜の空き部屋"], ["old_well", "村外れの古井戸"], ["sento", "深夜の銭湯"]];
const REVISIONS = [["no_ghost", "幽霊を出さない"], ["realistic", "もっと現実的に"], ["nastier", "結末をもっと嫌に"], ["scarier", "怖さを強める"], ["faster", "テンポを上げる"]];
// </options>

const state = { cond: {}, themeId: "none", plot: null, token: null, revLeft: 3, story: null, ctl: null };
const $ = (id) => document.getElementById(id);
const labelOf = (g, v) => (g.items.find((x) => x[0] === v) || [])[1] || v;

// --- 条件UI ---
const groupsEl = $("groups");
GROUPS.forEach((g) => {
  const fs = document.createElement("fieldset");
  const lg = document.createElement("legend");
  lg.textContent = g.label;
  fs.append(lg);
  const box = document.createElement("div");
  box.className = "chips";
  box.setAttribute("role", "group");
  g.items.forEach(([id, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.dataset.v = id;
    b.setAttribute("aria-pressed", "false");
    b.onclick = () => pick(g.key, id);
    box.append(b);
  });
  fs.append(box);
  fs.dataset.key = g.key;
  groupsEl.append(fs);
});
function pick(key, v) {
  const g = GROUPS.find((x) => x.key === key);
  if (!g || !g.items.some((x) => x[0] === v)) return;
  state.cond[key] = v;
  groupsEl.querySelectorAll(`fieldset[data-key="${key}"] .chip`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
}
THEMES.forEach(([id, label]) => {
  const o = document.createElement("option");
  o.value = id;
  o.textContent = label;
  $("theme").append(o);
});
const DEFAULTS = { world: "real", genre: "shinri", setting: "apartment", hero: "woman_worker", pov: "first", style: "tantan", fear: "jiwajiwa", ending: "no_salvation", length: "4000", chapters: "3" };
Object.entries(DEFAULTS).forEach(([k, v]) => pick(k, v));
$("random").onclick = () => {
  GROUPS.forEach((g) => {
    if (g.key === "length" || g.key === "chapters") return;
    pick(g.key, g.items[Math.floor(Math.random() * g.items.length)][0]);
  });
  $("theme").value = THEMES[Math.floor(Math.random() * THEMES.length)][0];
};

// --- Worker 呼び出し ---
function errText(e) {
  if (e && e.message && e.code !== "cancelled") return e.message;
  const c = e && e.code;
  return ({
    cancelled: "止めました。",
    network: "通信できませんでした。電波の良い場所でもう一度押してください。",
  })[c] || "生成に失敗しました。もう一度押してください。";
}
async function api(path, body, signal) {
  let res;
  try {
    res = await fetch(WORKER_URL + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal });
  } catch (e) {
    throw { code: e && e.name === "AbortError" ? "cancelled" : "network" };
  }
  if (!res.ok) {
    let j = null;
    try { j = await res.json(); } catch (_) {}
    throw { code: (j && j.error) || "failed", message: j && j.message };
  }
  return res;
}

// --- プロット ---
async function makePlot() {
  const st = $("st1");
  state.themeId = $("theme").value;
  const btn = $("makePlot");
  btn.disabled = true;
  st.textContent = "プロットを考えています…（数十秒かかります）";
  try {
    const res = await api("/api/plot", { options: state.cond, themeId: state.themeId });
    const j = await res.json();
    if (!j || !j.plot || !j.token) throw { code: "invalid_json" };
    state.plot = j.plot;
    state.token = j.token;
    state.revLeft = 3;
    renderPlot();
    $("write").disabled = false;
    st.textContent = "";
    $("s2").hidden = false;
    $("s3").hidden = true;
    $("s2").scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    st.textContent = errText(e);
  } finally {
    btn.disabled = false;
  }
}
$("makePlot").onclick = makePlot;

function renderPlot() {
  const p = state.plot, el = $("plot");
  el.textContent = "";
  const h = document.createElement("h3");
  h.textContent = p.title;
  const l = document.createElement("p");
  l.className = "logline";
  l.textContent = p.logline || "";
  const dl = document.createElement("dl");
  [["導入", "intro"], ["展開", "development"], ["転換", "twist"], ["真相", "truth"], ["結末", "ending"]].forEach(([k, f]) => {
    if (!p[f]) return;
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = p[f];
    dl.append(dt, dd);
  });
  const ol = document.createElement("ol");
  p.chapters.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.title}：${c.summary}`;
    ol.append(li);
  });
  el.append(h, l, dl, ol);
  $("revLeft").textContent = `残り${state.revLeft}回`;
  setRevDisabled(false);
}
const revEl = $("revs");
REVISIONS.forEach(([id, label]) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = label;
  b.dataset.v = id;
  b.onclick = () => revise(id);
  revEl.append(b);
});
function setRevDisabled(busy) {
  revEl.querySelectorAll(".chip").forEach((b) => (b.disabled = busy || state.revLeft <= 0 || !state.token));
}
async function revise(revisionId) {
  const st = $("st2");
  setRevDisabled(true);
  $("write").disabled = true;
  st.textContent = "プロットを直しています…";
  try {
    const res = await api("/api/revise", { token: state.token, revisionId });
    const j = await res.json();
    if (!j || !j.plot || !j.token) throw { code: "invalid_json" };
    state.plot = j.plot;
    state.token = j.token;
    state.revLeft--;
    renderPlot();
    st.textContent = "直しました。";
  } catch (e) {
    st.textContent = errText(e);
  } finally {
    setRevDisabled(false);
    $("write").disabled = false;
  }
}

// --- 本文 ---
function paint() {
  const r = $("reader");
  r.textContent = "";
  const h = document.createElement("h3");
  h.textContent = state.story.title;
  r.append(h);
  const multi = state.story.chapters.length > 1 || Number(state.cond.chapters) > 1;
  state.story.chapters.forEach((t, i) => {
    if (multi) {
      const h4 = document.createElement("h4");
      h4.textContent = `第${i + 1}章　${(state.plot.chapters[i] || {}).title || ""}`;
      r.append(h4);
    }
    t.split(/\n/).forEach((line) => {
      if (!line.trim()) {
        const b = document.createElement("div");
        b.className = "blank";
        r.append(b);
        return;
      }
      const p = document.createElement("p");
      p.textContent = line.trim();
      r.append(p);
    });
  });
}
// SSE を読んで onText に本文を流す。戻り値: { token, truncated }
async function readChapter(res, onText) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "", token = null, truncated = false;
  for (;;) {
    let chunk;
    try {
      chunk = await reader.read();
    } catch (e) {
      throw { code: e && e.name === "AbortError" ? "cancelled" : "network" };
    }
    if (chunk.done) break;
    buf += dec.decode(chunk.value, { stream: true }).replace(/\r\n/g, "\n");
    let idx;
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const block = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const line = block.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      let ev;
      try { ev = JSON.parse(line.slice(5).trim()); } catch (_) { continue; }
      if (ev.type === "content_block_delta" && ev.delta && ev.delta.text) onText(ev.delta.text);
      else if (ev.type === "message_delta" && ev.delta && ev.delta.stop_reason === "max_tokens") truncated = true;
      else if (ev.token) { token = ev.token; truncated = truncated || !!ev.truncated; }
      else if (ev.error) throw { code: ev.error, message: ev.message };
    }
  }
  if (!token) throw { code: "generation_failed" };
  return { token, truncated };
}
async function write() {
  const st = $("st3"), n = state.plot.chapters.length;
  state.story = { title: state.plot.title, chapters: [] };
  $("s3").hidden = false;
  $("doneActions").hidden = true;
  $("stop").hidden = false;
  $("write").disabled = true;
  setRevDisabled(true);
  paint();
  $("s3").scrollIntoView({ behavior: "smooth" });
  for (let i = 0; i < n; i++) {
    st.textContent = `第${i + 1}章を書いています（全${n}章）…`;
    state.story.chapters[i] = "";
    state.ctl = new AbortController();
    $("reader").classList.add("cursor");
    try {
      const res = await api("/api/chapter", { token: state.token, chapterNo: i + 1 }, state.ctl.signal);
      const { token, truncated } = await readChapter(res, (t) => {
        state.story.chapters[i] += t;
        paint();
      });
      state.token = token;
      paint();
      if (truncated) st.textContent = `第${i + 1}章が途中で切れました。`;
    } catch (e) {
      paint();
      st.textContent = errText(e);
      finish(false);
      return;
    }
  }
  st.textContent = "書き上がりました。";
  finish(true);
}
function finish(ok) {
  $("reader").classList.remove("cursor");
  $("stop").hidden = true;
  $("write").disabled = false;
  $("doneActions").hidden = false;
  setRevDisabled(false);
  try { localStorage.setItem("horror:last", JSON.stringify({ cond: state.cond, themeId: state.themeId, plot: state.plot, story: state.story })); } catch (_) {}
}
$("write").onclick = write;
$("stop").onclick = () => state.ctl && state.ctl.abort();
$("toggleDir").onclick = () => {
  const t = $("reader").classList.toggle("tate");
  $("toggleDir").textContent = t ? "横書きにする" : "縦書きにする";
};

function plain() {
  const s = state.story;
  if (!s) return "";
  return s.title + "\n\n" + s.chapters.map((t, i) => (s.chapters.length > 1 ? `第${i + 1}章　${(state.plot.chapters[i] || {}).title || ""}\n\n` : "") + t.trim()).join("\n\n") + "\n";
}
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(plain());
    $("st3").textContent = "コピーしました。";
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = plain();
    document.body.append(ta);
    ta.select();
    try {
      document.execCommand("copy");
      $("st3").textContent = "コピーしました。";
    } catch (__) {
      $("st3").textContent = "コピーできませんでした。本文を選択してコピーしてください。";
    }
    ta.remove();
  }
};
$("save").onclick = () => {
  try {
    const name = (state.story.title || "horror").replace(/[\\/:*?"<>|\s]/g, "_").slice(0, 40) + ".txt";
    const url = URL.createObjectURL(new Blob([plain()], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("st3").textContent = "保存しました。";
  } catch (_) {
    $("st3").textContent = "保存できませんでした。コピーを使ってください。";
  }
};
$("restart").onclick = () => {
  $("s2").hidden = true;
  $("s3").hidden = true;
  state.token = null;
  $("s1").scrollIntoView({ behavior: "smooth" });
};

// 前回の作品を復元（tokenは持たないので、プロット修正・書き直しはできない）
try {
  const last = JSON.parse(localStorage.getItem("horror:last") || "null");
  if (last && last.story && last.plot) {
    Object.entries(last.cond || {}).forEach(([k, v]) => pick(k, v));
    if (THEMES.some((t) => t[0] === last.themeId)) $("theme").value = last.themeId;
    state.themeId = $("theme").value;
    state.plot = last.plot;
    state.story = last.story;
    state.revLeft = 0;
    renderPlot();
    $("s2").hidden = false;
    $("s3").hidden = false;
    $("write").disabled = true;
    paint();
    $("doneActions").hidden = false;
    $("st3").textContent = "前回の作品を表示しています。";
  }
} catch (_) {}
