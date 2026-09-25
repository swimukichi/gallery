---
name: site-add
description: note に公開した作品をギャラリーサイト（works-data.js）に追加し、タイトル・genre・説明文を整える。「/site-add <note URL>」で使う。
---

# サイトに作品を追加

1. `node add-work.js --note "<URL>"` を実行（note.com と assets.st-note.com への通信が必要）
   - 通信が拒否されたら、環境設定で両ドメインを許可するよう伝え、代わりに画像を `_import/images/` に置いて `npm run import:works` を使う手順を案内する
2. 追加された項目を確認して直す
   - title：改行・前後の空白・「｜NAO」「神話キャラクタ侵食図鑑｜」を除き《神名｜造語》の形に
   - genre：神話 → `myth×biomechanical`、植物 → `plants×biomechanical`、日用品 → `domestic×mutation`
   - description / description_en を 1 文ずつ入れる（記事冒頭から要約）
3. add-work.js が自動で commit・push した場合も、修正分を追加コミットして作業ブランチへ push
4. 追加した id・タイトル・サイト URL を返す
