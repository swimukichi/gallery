#!/usr/bin/env node
// 長編の各話を、note にそのまま貼れるテキストファイルにする
//
// 使い方: node scripts/novel-note.js content/novel/zakuro
// 出力: <dir>/note/NN.txt（1 行目がタイトル、2 行目から本文）と <dir>/note/予約表.md
// マガジンと各話の note URL は <dir>/note-urls.json に書くと、本文の末尾に入る
//   { "mag": "https://note.com/swi0801/m/...", "1": "https://note.com/swi0801/n/...", ... }

const fs = require('fs');
const path = require('path');
const { makeNovelFormat, loadNovel } = require('./lib/novel-format');

const dir = path.resolve(process.argv[2] || '');
const { meta, chapters } = loadNovel(dir);
const urlFile = path.join(dir, 'note-urls.json');
const urls = fs.existsSync(urlFile) ? JSON.parse(fs.readFileSync(urlFile, 'utf8')) : {};
const F = makeNovelFormat(meta, chapters, (no) => urls[no] || '');

const out = path.join(dir, 'note');
fs.mkdirSync(out, { recursive: true });
const rows = [];
for (const c of chapters) {
  const name = String(c.no).padStart(2, '0') + '.txt';
  fs.writeFileSync(path.join(out, name), F.noteTitle(c) + '\n\n' + F.noteBody(c) + '\n');
  rows.push(`| ${c.no} | ${c.date} ${meta.time} | ${F.noteTitle(c)} | note/${name} |`);
}
fs.writeFileSync(path.join(out, '予約表.md'), [
  `# 『${meta.title}』note 予約表`,
  '',
  `サムネ：全話共通（\`thumb.png\`）／ハッシュタグ：本文末尾と同じ 10 個を公開設定でも入れる`,
  '',
  '| 話 | 予約日時 | タイトル | ファイル |',
  '|---|---|---|---|',
  ...rows,
  '',
].join('\n'));
console.log(`完成: ${path.relative(process.cwd(), out)}/（${chapters.length} 話＋予約表）`);
