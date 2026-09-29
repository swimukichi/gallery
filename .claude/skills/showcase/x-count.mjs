// X の文字数チェック（全角2・半角1、上限280＝全角140字）
// 使い方: node .claude/skills/showcase/x-count.mjs <md ファイル>
// ``` で囲まれたブロックを 1 投稿として数える
import fs from "node:fs";
const s = fs.readFileSync(process.argv[2], "utf8");
const blocks = [...s.matchAll(/```\n([\s\S]*?)\n```/g)].map((m) => m[1]);
const w = (t) =>
  [...t.replace(/https?:\/\/\S+/g, "x".repeat(23))].reduce((n, ch) => {
    const o = ch.codePointAt(0);
    return n + (o <= 0x10ff || (o >= 0x2000 && o <= 0x200d) || (o >= 0x2010 && o <= 0x201f) || (o >= 0x2032 && o <= 0x2037) ? 1 : 2);
  }, 0);
let over = 0;
blocks.forEach((b, i) => {
  const n = w(b);
  if (n > 280) over++;
  console.log(`${String(i).padStart(2)} ${String(n).padStart(3)}/280 ${n > 280 ? "OVER " : ""}${b.split("\n")[0].slice(0, 24)}`);
});
process.exitCode = over ? 1 : 0;
