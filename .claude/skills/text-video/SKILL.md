---
name: text-video
description: 投稿済みの記事（note URL・貼り付けた本文・content/ 内の md）から文字ベースの縦動画（1080x1920 mp4）を作ってスマホに送る。「/text-video <URL>」「この記事を動画に」などで使う。
---

# 文字ベース動画

## 手順
1. 入力を読む
   - `zukan-<slug>` / `novel-<slug>` の形なら、`content/<series>/*-<slug>.md` と既存の台本 JSON を使う
   - note URL：WebFetch で本文を取る。取れなければ本文の貼り付けを頼む
   - `content/zukan/*.md` / `content/novel/*.md`：そのまま読む
   - チャットに画像が添付されていたら、CLAUDE.md の「Higgsfield 素材の受け渡し」に従って `content/assets/<series>-<slug>/` に保存する
2. 台本 JSON を `content/text-videos/<series>-<slug>.json` に書く（形式は `_sample-zukan.json` / `_sample-novel.json`）
   - 5〜7 枚、合計 15〜30 秒、1 枚全角 40 字以内
   - 1 枚目は 2 秒で分かるフック、最後はプロフィール・note への誘導
   - 背景は `content/assets/<series>-<slug>/` の素材を使う。動くカット（clip-*.mp4）は 1 枚目とフックに、背景画（bg-*.webp）は本文スライドに割り当てる
   - 素材が無ければ図鑑は `images/` の作品画像、小説は無地
   - 引数に「2案」とあれば、すぐ使う版（淡々と要約）と少し凝った版（問いかけ始まり・引用中心）の 2 本を作る
3. `npm run text-video -- <json>` で生成（`_out/text-videos/` に出る）
4. SendUserFile で mp4 を送る（display: attach）。キャプションに秒数と投稿先・予約時刻の目安
5. 台本 JSON と保存した素材をコミットして push（mp4 の出力は git 管理外）

BGM を使うときは `bgm` に音源パスを入れる。音源は本人が TikTok / IG 内で付けてもよい。
