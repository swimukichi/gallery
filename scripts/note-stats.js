#!/usr/bin/env node
// note の公開データ（スキ・コメント）を集めて content/stats/note-posts.csv を更新する
//
// 使い方: node scripts/note-stats.js
// GitHub Actions（.github/workflows/note-stats.yml）で毎日自動実行する
//
// - 1記事 = 1行。公開から 1日・3日・7日・30日 経った時点のスキ数を記録する
// - 閲覧数（PV）は note の公開データに無いので、ダッシュボードのスクショから
//   content/stats/views.csv に記録する（/stats スキル）

const fs = require('fs');
const path = require('path');

const USER = 'swi0801';
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'stats', 'note-posts.csv');
const MILESTONES = [1, 3, 7, 30];
const COLUMNS = [
  'key', 'publishAt', 'category', 'series', 'title',
  ...MILESTONES.map((d) => `likes_d${d}`),
  'likes_now', 'comments_now', 'updatedAt',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 gallery-stats' } });
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
    } catch (e) {
      // 通信エラーは少し待って再試行
    }
    await sleep(1000 * (i + 1));
  }
  return null;
}

function categorize(title) {
  if (/侵食図鑑|myth×|biomechanical|^《/i.test(title)) return 'zukan';
  if (/台湾|中国語|という字を教わった|｜[一-龥]{2,4}$/.test(title)) return 'taiwan';
  if (/【ホラー|第.{1,4}[章話]|[0-9０-９一二三四五六七八九十]+章|最終話|（完）/.test(title)) return 'novel';
  return 'other';
}

// 「【ホラー長編】名簿　第一章　春の点検」→「名簿」
function seriesOf(title, category) {
  if (category === 'zukan') return '神話キャラクタ侵食図鑑';
  if (category !== 'novel') return '';
  const s = title.replace(/^【[^】]*】/, '').trim();
  return s.split(/[　 ]+(?=第|[0-9０-９一二三四五六七八九十]+章|最終話)|：/)[0].trim();
}

function csvCell(v) {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function loadExisting() {
  if (!fs.existsSync(OUT)) return new Map();
  const [head, ...rows] = parseCsv(fs.readFileSync(OUT, 'utf8'));
  const map = new Map();
  for (const r of rows) {
    if (!r[0]) continue;
    const o = {};
    head.forEach((h, i) => { o[h] = r[i] || ''; });
    map.set(o.key, o);
  }
  return map;
}

// 一覧 API（最新 600 件まで）
async function fetchListed() {
  const posts = [];
  for (let page = 1; page <= 100; page++) {
    const j = await getJson(`https://note.com/api/v2/creators/${USER}/contents?kind=note&page=${page}`);
    if (!j || !j.data) break;
    for (const c of j.data.contents) {
      posts.push({ key: c.key, title: c.name, publishAt: c.publishAt, likes: c.likeCount, comments: c.commentCount });
    }
    if (j.data.isLastPage) break;
    await sleep(250);
  }
  return posts;
}

// 一覧に出ない古い記事（works-data.js にリンクがある図鑑記事など）は 1 件ずつ取る
async function fetchByKey(key) {
  const j = await getJson(`https://note.com/api/v3/notes/${key}`);
  if (!j || !j.data) return null;
  const d = j.data;
  return { key, title: d.name, publishAt: d.publish_at, likes: d.like_count, comments: d.comment_count };
}

function galleryKeys() {
  const src = fs.readFileSync(path.join(ROOT, 'works-data.js'), 'utf8');
  const keys = new Set();
  for (const m of src.matchAll(/note\.com\/swi0801\/n\/(n[0-9a-f]+)/g)) keys.add(m[1]);
  return keys;
}

async function main() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const existing = loadExisting();

  const listed = await fetchListed();
  const seen = new Set(listed.map((p) => p.key));
  const extraKeys = new Set([...galleryKeys(), ...existing.keys()].filter((k) => !seen.has(k)));
  for (const key of extraKeys) {
    const p = await fetchByKey(key);
    if (p) listed.push(p);
    await sleep(250);
  }

  for (const p of listed) {
    const row = existing.get(p.key) || { key: p.key };
    const category = categorize(p.title);
    row.publishAt = p.publishAt;
    row.category = category;
    row.series = seriesOf(p.title, category);
    row.title = p.title;
    row.likes_now = p.likes;
    row.comments_now = p.comments;
    row.updatedAt = today;
    // 公開から N 日経った最初の実行で、その時点のスキ数を残す（2日以上過ぎていたら空欄のまま）
    const age = (now - new Date(p.publishAt)) / 86400000;
    for (const d of MILESTONES) {
      const col = `likes_d${d}`;
      if (!row[col] && age >= d && age < d + 2) row[col] = p.likes;
    }
    existing.set(p.key, row);
  }

  const rows = [...existing.values()].sort((a, b) => (a.publishAt < b.publishAt ? 1 : -1));
  const text = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text);

  const byCat = {};
  for (const r of rows) {
    const c = (byCat[r.category] ||= { n: 0, likes: 0 });
    c.n++;
    c.likes += Number(r.likes_now) || 0;
  }
  console.log(`更新: ${path.relative(ROOT, OUT)}（${rows.length} 記事）`);
  for (const [k, v] of Object.entries(byCat)) console.log(`  ${k}: ${v.n} 記事・平均スキ ${(v.likes / v.n).toFixed(2)}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
