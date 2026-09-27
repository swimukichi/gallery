# 『柘榴』PC のブラウザ作業（Claude Code × Claude in Chrome 用）

このファイルは、PC で `claude --chrome` を起動した Claude Code が読んで実行するための手順書。
ユーザーの Chrome（note・小説家になろう・エブリスタ・Higgsfield にログイン済み）を操作する。

## 守ること
- 公開ボタンは押さない。note・なろう・エブリスタはすべて「予約」か「下書き保存」で止める
- 各ステップの最後に、画面のスクショを撮って結果を報告し、ユーザーの OK をもらってから次へ進む
- ログイン画面や CAPTCHA が出たら止めて、ユーザーに操作してもらう
- 既存の作品・記事・マガジンは編集も削除もしない（読むだけ）
- カクヨムは対象外（ユーザーが別に行う）
- 文面は必ずリポジトリのファイルからそのまま使い、自分で書き換えない

## 使うファイル
- 作品情報：`content/novel/zakuro/meta.json`（あらすじ・マガジン説明文・タグ・開始日 2026-09-28・時刻 21:30）
- note 原稿：`content/novel/zakuro/note/01.txt`〜`13.txt`（1 行目がタイトル、3 行目から本文）、予約表 `note/予約表.md`
- 他サイト用の本文：`content/novel/zakuro/01.md`〜`13.md`（1 行目が「# 第一章　小菊」、2 行目以降が本文）
- 投稿設定と決定事項：`content/novel/zakuro/posting.md`
- サムネの設定：`content/novel/zakuro/thumb.json`

---

## ステップ 1：Higgsfield でサムネの背景を作る
1. https://higgsfield.ai/ja を開き、画像生成（16:9）で次のプロンプトを使う
```
Photorealistic cinematic photograph of a rooftop garden on an old eight-story concrete building in a Japanese regional city at dusk: one small pomegranate tree with twisted trunk, several ripe red-brown pomegranates hanging, one split open showing red seeds, wooden deck and a plain bench, wire fence, distant railway tracks and low mountains behind, overcast sky. Tree placed in the right third, left side dark and empty, eye-level, 35mm, quiet and uneasy, realistic, fine film grain, 16:9.
```
   ネガティブ：`text, letters, watermark, logo, people, gore, blood, fantasy, anime, cartoon, oversaturated`
2. 生成された候補をユーザーに見せて 1 枚選んでもらう
3. 選んだ画像をダウンロードし、`content/assets/novel-zakuro/thumb-bg.webp` として保存（sharp で webp・横 1920px・品質 85）
4. `npm run note-thumb -- content/novel/zakuro/thumb.json` を実行して `content/novel/zakuro/thumb.png`（1280x670）を作り、ユーザーに見せる

## ステップ 2：note でマガジンを作る
1. https://note.com/swi0801 で、マガジンを新しく作る
   - 名前：`柘榴（全13章）`
   - 説明文：`meta.json` の `magazineDescription`
   - 見出し画像：`content/novel/zakuro/thumb.png`
   - 無料マガジン
2. 作ったマガジンの URL を `content/novel/zakuro/note-urls.json` の `"mag"` に書く（ファイルが無ければ作る）
   ```json
   { "mag": "https://note.com/swi0801/m/..." }
   ```

## ステップ 3：note で 13 話の下書きを作る
1. `note/01.txt`〜`13.txt` の順に、新しいテキスト記事を作る
   - タイトル：ファイルの 1 行目
   - 本文：3 行目以降をそのまま貼る
   - 見出し画像：`content/novel/zakuro/thumb.png`
   - 下書き保存する（公開しない）
2. 各下書きの URL（`https://note.com/swi0801/n/...`）を `note-urls.json` に `"1"`〜`"13"` で書く
3. `node scripts/novel-note.js content/novel/zakuro` を実行して、末尾の前回・次回の記事とマガジン URL が入った原稿を作り直す
4. 作り直した本文で、13 本の下書きの本文を上書きする

## ステップ 4：note で予約する
各下書きの公開設定で、次のとおり予約する（`note/予約表.md` と同じ）
- ハッシュタグ：`meta.json` の `noteTags` の 10 個
- マガジン：`柘榴（全13章）` に追加
- 予約日時：第一章 2026-09-28 21:30 から、1 日 1 話ずつ、第十三章 2026-10-10 21:30 まで
- 1 本ごとに、予約日時・マガジン・タグの画面をスクショして報告

## ステップ 5：小説家になろう・エブリスタ
1. まず既存作（『善き隣人』『名簿』など）の作品設定を開いて読むだけにする。作品名の付け方、あらすじ、キーワード・タグ、ジャンル、年齢制限・残酷描写の設定、生成 AI の表記をメモし、`posting.md` の「カクヨム・小説家になろう・エブリスタ」に書き足してユーザーに見せる
2. ユーザーの OK が出たら、既存作と同じ形で新しい作品『柘榴』を作る（あらすじは `meta.json` の `synopsis`、キャッチコピーは `catchcopy`）
3. 第一章〜第十三章を、各サイトの予約機能で note と同じ日時（毎日 21:30）に予約する
   - 話のタイトル：`01.md` 1 行目の「第一章　小菊」の形（最終話は「第十三章　発注書（完）」）
   - 本文：`01.md` の 2 行目以降。最終話だけ末尾に「（了）／最後までお読みいただき、ありがとうございました。」
   - 予約機能が無い場合は下書き保存で止めて、ユーザーに伝える

## ステップ 6：侵食図鑑｜番外編ペルセポネ（全 3 回）を note で予約
1. Higgsfield で `content/zukan/04-persephone-1.md` 末尾のプロンプトからサムネ（4:5）3 枚と本文用の画像を生成し、候補をユーザーに選ばせる
2. `content/zukan/04-persephone-1.md`〜`-3.md` の「note 記事」の本文をそのまま使い、3 本の下書きを作る
   - タイトルは「すぐ使う版」
   - 本文中の `[画像①：…]` の行は、その内容に合う生成画像に置き換える
   - 【】で囲んだ部分（侵食ラボの内容、各 URL）はユーザーに確認してから埋める
3. 予約：①9/28 20:00、②9/30 20:00、③10/2 20:00。ハッシュタグは本文末尾の 10 個
4. アメブロ・Instagram・X・Threads は、各ファイルの予約表と投稿文のとおり（ユーザーの OK を取ってから）

## 最後に
- `note-urls.json`、`thumb.png`、`posting.md` などの変更をコミットして push する
- 予約した一覧（サイト・話・日時・URL）を報告する
