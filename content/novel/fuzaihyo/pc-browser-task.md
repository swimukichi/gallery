# 『不在票』PC のブラウザ作業（Claude Code × Claude in Chrome 用）

PC で `claude --chrome` を起動した Claude Code が読んで実行する手順書。ユーザーの Chrome（note・小説家になろう・エブリスタ・Higgsfield にログイン済み）を操作する。
今回は**作品の器を作るところまで**（本文はまだ無い）。各話の下書き・予約は、本文ができてから『柘榴』の手順書（`content/novel/zakuro/pc-browser-task.md` ステップ 3〜5）と同じ流れで行う。

## 守ること
- 公開ボタンは押さない。作品は「非公開」「下書き」で止める
- 各ステップの最後に画面のスクショを撮って報告し、ユーザーの OK をもらってから次へ
- ログイン画面や CAPTCHA が出たら止めて、ユーザーに操作してもらう
- 既存の作品・記事・マガジンは編集も削除もしない（読むだけ）
- カクヨムは対象外（ユーザーが行う）
- 文面はリポジトリのファイルからそのまま使い、書き換えない

## 使うファイル
- 作品情報：`content/novel/fuzaihyo/meta.json`（catchcopy・intro・synopsis・magazineDescription・siteTags・noteTags）
- 設定の表：`content/novel/fuzaihyo/posting.md`
- サムネ：`content/novel/fuzaihyo/thumb.png`（無地版、作成済み）、`thumb.json`

## ステップ 1：（任意）Higgsfield で写真版のサムネ
1. `posting.md`「サムネ」のすぐ使う版のプロンプトで 16:9 を生成し、候補をユーザーに選んでもらう
2. 選んだ画像を `content/assets/novel-fuzaihyo/thumb-bg.webp` に保存（sharp で webp・横 1920px・品質 85）
3. `npm run note-thumb -- content/novel/fuzaihyo/thumb.json` で `thumb.png` を作り直し、ユーザーに見せる
- 写真版を使わないなら、このステップは飛ばす

## ステップ 2：note でマガジンを作る
1. https://note.com/swi0801 でマガジンを新しく作る
   - 名前：`不在票（全13章）`
   - 説明文：`meta.json` の `magazineDescription`
   - 見出し画像：`content/novel/fuzaihyo/thumb.png`
   - 無料マガジン
2. URL を `content/novel/fuzaihyo/note-urls.json` に `{ "mag": "https://note.com/swi0801/m/..." }` で保存

## ステップ 3：小説家になろう
1. 『柘榴』の作品設定を開いて読むだけにし、同じ形で新しい作品を作る（非公開・下書き）
   - 作品名：`不在票`
   - あらすじ：`meta.json` の `synopsis`
   - キーワード：`siteTags` の 8 個
   - ジャンル・残酷描写・生成 AI の表記：『柘榴』と同じ
2. 作品ページの URL を `note-urls.json` に `"narou"` で保存

## ステップ 4：エブリスタ
1. 『柘榴』の作品設定を読むだけにし、同じ形で新しい作品を作る（非公開・下書き）
   - 作品名：`不在票`
   - キャッチコピー：`catchcopy`
   - あらすじ：`synopsis`
   - タグ：`siteTags`
   - ジャンル・年齢制限・生成 AI の表記：『柘榴』と同じ
2. 作品ページの URL を `note-urls.json` に `"estar"` で保存
- 文字数が上限を超えると言われたら、`intro`（短い版）に差し替えてユーザーに伝える

## 最後に
- `note-urls.json`・`thumb.png` などの変更をコミットして push
- 作った一覧（サイト・作品名・状態・URL）を報告する
