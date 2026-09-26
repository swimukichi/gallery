#!/usr/bin/env node
// 長編の全話を、各サイトへの予約投稿用にまとめた 1 枚の HTML を作る（スマホでコピーして貼るため）
//
// 使い方: node scripts/novel-pack.js content/novel/zakuro [出力先.html]
// 入力: <dir>/meta.json と <dir>/01.md〜NN.md（1 行目が「# 第一章　章題」）
// 出力: 既定は _out/novel/<slug>.html

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const dir = path.resolve(ROOT, process.argv[2] || '');
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
const out = path.resolve(ROOT, process.argv[3] || `_out/novel/${meta.slug}.html`);

const files = fs.readdirSync(dir).filter((f) => /^\d+\.md$/.test(f)).sort();
const chapters = files.map((f, i) => {
  const [head, ...rest] = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  const heading = head.replace(/^#\s*/, '').trim();
  // 端末のタイムゾーンに左右されないよう UTC で日付だけを数える
  const [y, m, day] = meta.start.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, day + i));
  const date = `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${'日月火水木金土'[d.getUTCDay()]}）`;
  return { no: i + 1, heading, date, body: rest.join('\n').trim() };
});

const data = JSON.stringify({ meta, chapters }).replace(/</g, '\\u003c');

const html = `<title>${meta.title} 予約パック</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
:root{
  --ground:#eef0ee; --paper:#fbfbfa; --ink:#15181d; --muted:#5b616a; --line:#cfd3d6;
  --accent:#9b2f2d; --accent-soft:#f1dcda; --done:#2f6b4f; --done-soft:#dcebe2;
  --serif:"Shippori Mincho B1","Yu Mincho","Hiragino Mincho ProN",serif;
  --sans:"Zen Kaku Gothic New","Hiragino Sans","Yu Gothic",system-ui,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){color-scheme:dark;
    --ground:#111317; --paper:#181b21; --ink:#e5e7ea; --muted:#9aa1ab; --line:#2d323a;
    --accent:#e0756c; --accent-soft:#3a2221; --done:#7fc4a0; --done-soft:#1d3228;}
}
:root[data-theme="dark"]{color-scheme:dark;
  --ground:#111317; --paper:#181b21; --ink:#e5e7ea; --muted:#9aa1ab; --line:#2d323a;
  --accent:#e0756c; --accent-soft:#3a2221; --done:#7fc4a0; --done-soft:#1d3228;}
body{background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.7}
.wrap{max-width:760px;margin:0 auto;padding-inline:16px;padding-block:28px 64px}
h1{font-family:var(--serif);font-weight:800;font-size:40px;line-height:1.2;margin:4px 0 6px;text-wrap:balance}
h2{font-family:var(--serif);font-weight:800;font-size:21px;margin:0;text-wrap:balance}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.lead{color:var(--muted);margin:0 0 18px}
.progress{font-family:var(--mono);font-size:13px;color:var(--muted);margin-bottom:22px}
.progress b{color:var(--ink)}
section{margin-top:26px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:16px;display:grid;gap:12px}
.card.all{border-color:var(--done)}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.when{font-family:var(--mono);font-size:13px;color:var(--accent);font-variant-numeric:tabular-nums}
.tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid var(--line)}
.tab{font:inherit;font-size:13px;background:none;border:0;border-bottom:2px solid transparent;color:var(--muted);padding:6px 10px;cursor:pointer}
.tab[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--accent);font-weight:700}
.tab .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--line);margin-left:6px;vertical-align:1px}
.tab.ok .dot{background:var(--done)}
button.copy{font:inherit;font-size:13px;background:var(--ground);color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:7px 12px;cursor:pointer}
button.copy:active{transform:translateY(1px)}
button.copy.did{background:var(--done-soft);border-color:var(--done);color:var(--done)}
label.check{display:inline-flex;gap:6px;align-items:center;font-size:13px;margin-left:auto;cursor:pointer}
label.check input{width:18px;height:18px;accent-color:var(--done)}
.meta{font-size:13px;color:var(--muted)}
details summary{cursor:pointer;font-size:13px;color:var(--muted)}
pre.body{white-space:pre-wrap;font-family:var(--serif);font-size:15px;line-height:1.9;background:var(--ground);border-radius:6px;padding:12px;max-height:340px;overflow:auto;margin:8px 0 0}
input.url{font:inherit;font-size:13px;width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--ground);color:var(--ink)}
.setup dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:0}
.setup dt{font-size:12px;color:var(--muted)}
.setup dd{margin:0;display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap}
.setup dd span{flex:1;min-width:0}
.note{font-size:12.5px;color:var(--muted)}
#fallback{position:fixed;inset:auto 0 0 0;background:var(--paper);border-top:1px solid var(--line);padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));display:grid;gap:8px}
#fallback textarea{width:100%;height:30vh;font:inherit;font-size:13px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
</style>

<div class="wrap">
  <div class="eyebrow">Long horror · reservation pack</div>
  <h1>『${meta.title}』</h1>
  <p class="lead">全${chapters.length}話・${chapters[0].date}〜${chapters[chapters.length - 1].date} 毎日 ${meta.time}。各話を note・カクヨム・小説家になろう・エブリスタで予約したら、チェックを入れてください（この端末に保存されます）。</p>
  <div class="progress" id="progress"></div>

  <section class="card setup" aria-labelledby="setup-h">
    <h2 id="setup-h">最初に1回：作品の登録</h2>
    <p class="note">カクヨム・小説家になろう・エブリスタでは、先に作品（連載）を作ってから、各話を予約します。</p>
    <dl id="setup"></dl>
  </section>

  <section class="card" aria-labelledby="url-h">
    <h2 id="url-h">note の「次回の記事」リンク</h2>
    <p class="note">note で全話の下書きを先に作ると、URL が決まります。ここに貼ると、前の話の本文の末尾が、そのURLに置き換わります。空欄のあいだは「○/○ ${meta.time} 公開」と入ります。</p>
    <div id="urls" style="display:grid;gap:6px"></div>
  </section>

  <section id="list" style="display:grid;gap:14px"></section>
</div>
<div id="fallback" hidden>
  <div class="row"><strong style="font-size:13px">自動コピーできませんでした。下の文字を長押しでコピーしてください。</strong><button class="copy" type="button" id="fb-close">閉じる</button></div>
  <textarea id="fb-text" readonly></textarea>
</div>

<script>
const DATA = ${data};
const SITES = [
  {id:'note', name:'note'},
  {id:'kakuyomu', name:'カクヨム'},
  {id:'narou', name:'なろう'},
  {id:'estar', name:'エブリスタ'}
];
const KEY = 'novel-pack-' + DATA.meta.slug;
let state = {done:{}, urls:{}, tab:{}};
try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

const M = DATA.meta, CH = DATA.chapters, BAR = '━━━';
const last = CH.length;
function noteTitle(c){ return '【' + M.genreLabel + '】' + M.title + '　' + c.heading + (c.no === last ? '（完）' : ''); }
function siteTitle(c){ return c.heading + (c.no === last ? '（完）' : ''); }
function nextLine(c){
  if (c.no === last) return M.lastExtra;
  const n = CH[c.no];
  const url = (state.urls[n.no] || '').trim();
  return '次回の記事\\n' + (url || n.date + ' ' + M.time + ' 公開');
}
function noteBody(c){
  const parts = [
    BAR + '\\n長編ホラー『' + M.title + '』全' + last + '話\\n' + M.hook.join('\\n') + '\\n' + BAR,
    c.heading + (c.no === last ? '（完）' : '') + '\\n' + c.body,
    BAR + '\\n' + nextLine(c) + (c.no === 1 && M.firstExtra ? '\\n\\n' + M.firstExtra : ''),
    BAR + '\\n' + M.crossPost + '\\n' + M.aiNote,
    BAR + '\\n' + M.noteTags.map(t => '#' + t).join(' ')
  ];
  return parts.join('\\n');
}
function siteBody(c){
  let s = c.body;
  if (c.no === last) s += '\\n\\n' + BAR + '\\n' + M.lastExtra;
  return s;
}

function copy(text, btn){
  const ok = () => { btn.classList.add('did'); const t = btn.textContent; btn.textContent = 'コピーしました'; setTimeout(() => { btn.textContent = t; btn.classList.remove('did'); }, 1400); };
  const fail = () => { const fb = document.getElementById('fallback'); const ta = document.getElementById('fb-text'); ta.value = text; fb.hidden = false; ta.focus(); ta.select(); };
  try { navigator.clipboard.writeText(text).then(ok, fail); } catch (e) { fail(); }
}
document.getElementById('fb-close').addEventListener('click', () => { document.getElementById('fallback').hidden = true; });

function btn(label, getText){
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'copy'; b.textContent = label;
  b.addEventListener('click', () => copy(getText(), b));
  return b;
}

// 作品の登録
const setupRows = [
  ['作品名', M.title],
  ['キャッチコピー', M.catchcopy],
  ['あらすじ・紹介文', M.synopsis + '\\n\\n' + M.aiNote.replace(/^なお、/, '')],
  ['タグ（カクヨム・エブリスタ）', M.siteTags.join(' ')],
  ['キーワード（なろう）', M.siteTags.filter(t => t !== 'AI本文利用').join(' ')],
  ['ジャンル', 'ホラー'],
];
const dl = document.getElementById('setup');
setupRows.forEach(([k, v]) => {
  const dt = document.createElement('dt'); dt.textContent = k;
  const dd = document.createElement('dd');
  const sp = document.createElement('span'); sp.textContent = v.length > 60 ? v.slice(0, 60) + '…' : v;
  dd.append(sp, btn('コピー', () => v));
  dl.append(dt, dd);
});

// note URL
const urls = document.getElementById('urls');
CH.forEach(c => {
  const inp = document.createElement('input');
  inp.className = 'url'; inp.id = 'url-' + c.no; inp.type = 'url';
  inp.placeholder = c.heading + ' の note URL';
  inp.setAttribute('aria-label', c.heading + ' の note URL');
  inp.value = state.urls[c.no] || '';
  inp.addEventListener('input', () => { state.urls[c.no] = inp.value; save(); });
  urls.append(inp);
});

function renderProgress(){
  const total = CH.length * SITES.length;
  let n = 0; CH.forEach(c => SITES.forEach(s => { if (state.done[c.no + s.id]) n++; }));
  document.getElementById('progress').innerHTML = '予約済み <b>' + n + '</b> / ' + total;
}

const list = document.getElementById('list');
CH.forEach(c => {
  const card = document.createElement('article');
  card.className = 'card';
  const head = document.createElement('div');
  head.innerHTML = '<div class="when">第' + c.no + '話 · ' + c.date + ' ' + M.time + '</div>';
  const h = document.createElement('h2'); h.textContent = c.heading + (c.no === last ? '（完）' : '');
  head.append(h);

  const tabs = document.createElement('div'); tabs.className = 'tabs'; tabs.setAttribute('role', 'tablist');
  const panel = document.createElement('div'); panel.style.display = 'grid'; panel.style.gap = '10px';

  function markCard(){
    const all = SITES.every(s => state.done[c.no + s.id]);
    card.classList.toggle('all', all);
    [...tabs.children].forEach((t, i) => t.classList.toggle('ok', !!state.done[c.no + SITES[i].id]));
  }
  function show(siteId){
    state.tab[c.no] = siteId; save();
    [...tabs.children].forEach((t, i) => t.setAttribute('aria-selected', SITES[i].id === siteId ? 'true' : 'false'));
    panel.innerHTML = '';
    const isNote = siteId === 'note';
    const title = () => isNote ? noteTitle(c) : siteTitle(c);
    const body = () => isNote ? noteBody(c) : siteBody(c);
    const row = document.createElement('div'); row.className = 'row';
    row.append(btn('タイトル', title), btn('本文', body));
    if (isNote) row.append(btn('ハッシュタグ', () => M.noteTags.map(t => '#' + t).join(' ')));
    const lab = document.createElement('label'); lab.className = 'check';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = 'done-' + c.no + '-' + siteId;
    cb.checked = !!state.done[c.no + siteId];
    cb.addEventListener('change', () => { state.done[c.no + siteId] = cb.checked; save(); markCard(); renderProgress(); });
    lab.append(cb, document.createTextNode('予約した'));
    row.append(lab);
    const info = document.createElement('div'); info.className = 'meta';
    info.textContent = '予約日時：' + c.date + ' ' + M.time + (isNote ? '　／　サムネ：作品共通（thumb.png）' : '');
    const det = document.createElement('details');
    const sum = document.createElement('summary'); sum.textContent = '本文を確認する';
    const pre = document.createElement('pre'); pre.className = 'body';
    det.addEventListener('toggle', () => { if (det.open) pre.textContent = body(); });
    det.append(sum, pre);
    panel.append(row, info, det);
  }
  SITES.forEach(s => {
    const t = document.createElement('button');
    t.type = 'button'; t.className = 'tab'; t.setAttribute('role', 'tab');
    t.innerHTML = s.name + '<span class="dot" aria-hidden="true"></span>';
    t.addEventListener('click', () => show(s.id));
    tabs.append(t);
  });
  card.append(head, tabs, panel);
  list.append(card);
  show(state.tab[c.no] || 'note');
  markCard();
});
renderProgress();
</script>
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`完成: ${path.relative(ROOT, out)}（${chapters.length} 話）`);
