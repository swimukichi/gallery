#!/usr/bin/env node
// note のサムネ（1280x670）を作る。Higgsfield の背景画に、既存の小説サムネと同じ文字組みを重ねる
//
// 使い方:
//   node scripts/note-thumb.js content/novel/zakuro/thumb.json
//   npm run note-thumb -- content/novel/zakuro/thumb.json
//
// 設定JSON:
//   {
//     "background": "content/assets/novel-zakuro/thumb-bg.webp",  // 省略時は既存と同じ無地
//     "label": "LONG HORROR",
//     "title": "柘榴",
//     "hook": "一行目\n二行目",
//     "chapter": "第一章　小菊",   // 省略可。章ごとのサムネにするとき
//     "out": "_out/thumbs/zakuro.png"
//   }

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1280;
const H = 670;
const ROOT = path.resolve(__dirname, '..');
const SERIF = "'Shippori Mincho B1', 'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN', 'IPAMincho', serif";

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function overlaySvg(c) {
  const x = 96;
  const hook = String(c.hook || '').split('\n').slice(0, 2);
  const titleSize = [...c.title].length > 4 ? 88 : 112;
  const hookY = 438;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${SERIF}">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#101318" stop-opacity="0.94"/>
        <stop offset="0.42" stop-color="#101318" stop-opacity="0.80"/>
        <stop offset="0.75" stop-color="#101318" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#101318" stop-opacity="0.10"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#fade)"/>
    <line x1="${x}" y1="155" x2="${x + 96}" y2="155" stroke="#b9bec6" stroke-width="2"/>
    <text x="${x}" y="218" font-size="22" letter-spacing="6" fill="#aeb4bd">${esc(c.label || 'LONG HORROR')}</text>
    <text x="${x}" y="${hookY - 78}" font-size="${titleSize}" font-weight="700" fill="#f2f2f0">${esc(c.title)}</text>
    ${hook.map((l, i) => `<text x="${x}" y="${hookY + i * 46}" font-size="26" fill="#d9dce0">${esc(l)}</text>`).join('')}
    ${c.chapter ? `<text x="${x}" y="${H - 72}" font-size="24" fill="#aeb4bd">${esc(c.chapter)}</text>` : ''}
    <text x="${W - 90}" y="${H - 72}" text-anchor="end" font-size="20" letter-spacing="5" fill="#aeb4bd">NAO</text>
  </svg>`;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('設定JSONを指定してください: node scripts/note-thumb.js <json>');
    process.exit(1);
  }
  const c = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!c.title) throw new Error('title がありません');

  let base;
  const bg = c.background && path.resolve(ROOT, c.background);
  if (bg && fs.existsSync(bg)) {
    // 人物や顔が右側に来る構図を想定し、右寄せで切り抜く
    base = sharp(bg).resize(W, H, { fit: 'cover', position: c.position || 'right' });
  } else {
    if (c.background) console.warn(`背景が見つかりません: ${c.background}（無地で続行）`);
    base = sharp({ create: { width: W, height: H, channels: 4, background: '#14171d' } });
  }

  const out = path.resolve(ROOT, c.out || `_out/thumbs/${path.basename(path.dirname(file))}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(await base.png().toBuffer())
    .composite([{ input: Buffer.from(overlaySvg(c)) }])
    .png()
    .toFile(out);
  console.log(`完成: ${path.relative(ROOT, out)}（${W}x${H}）`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
