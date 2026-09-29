---
name: proto-app
description: claude.ai 上で動くプロトタイプ（window.claude で生成する HTML）を、GitHub Pages ＋ Cloudflare Worker ＋ Claude API の一般公開版に作り替える。APIキーなしでも動くローカル版とテストまで作る。「このプロトタイプを公開版に」「/proto-app」などで使う。
---

# プロトタイプ → 公開版

手本：怖話工房 `horror-maker/`（README.md に手順、`worker/test/run.mjs` にテスト）。

## 0. プロトタイプを受け取る
- スマホのチャット添付はこの環境に届かない。GitHub の master の `_import/` に Upload files で置いてもらい、`git fetch origin master && git merge origin/master` で取り込む

## 1. 構成
`<slug>/index.html app.js style.css terms.html`、`<slug>/worker/src/index.js prompts.js`、`wrangler.toml`、`worker/test/`、`tools/build-preview.mjs`
- 見た目・画面の流れ・文言はプロトタイプのまま。CSS は抜き出して移す

## 2. 守ること
- プロンプト本文と内部の設計文は `prompts.js` だけに置く。フロントは選択肢の表示名と ID だけ（`// <options>` 〜 `// </options>` で囲み、テストで Worker と一致を確認）
- 自由入力は廃止してプリセットかボタンにする。Worker は ID をホワイトリスト照合し、不正は 400（`__proto__` なども弾く）
- 状態は HMAC 付き token（base64(payload).HMAC）。plot・options は token の値だけを使う。期限 2 時間
- token の使い回し対策に、作品 ID ごとの使用回数を KV にも持つ
- 利用制限は KV：生成の入口だけ数える（IP ごと・全体、日本時間 0 時リセット）。失敗したら回数を返す。全体上限は `wrangler.toml` の `DAILY_LIMIT`
- CORS は許可オリジンのみ。API の生エラーはフロントに返さない
- 本文は SSE をそのまま中継し、最後に新しい token を送る

## 3. Claude API（費用は本人持ち。必ず説明する）
- 料金は claude-api スキルで確認してから答える（記憶で答えない）
- モデルは `MODEL` で切り替え。費用を抑えるなら `claude-haiku-4-5`
- Sonnet 5.5 は既定で思考が入り、出力として課金され max_tokens も食う → `thinking: {type: "between_tools"}` で止める（Haiku は不要）
- 1 本あたりと「毎日上限まで使われた最悪の月額」を表で出し、Anthropic Console の月の上限額設定を最優先で勧める

## 4. キーなしで確認
- Worker に `MOCK=1`（ダミーのプロット・本文を SSE で返す）。`node worker/test/dev-server.mjs` で画面 :8000・API :8787
- `node worker/test/run.mjs`：ID 一致・不正 ID・CORS・回数制限・改ざん/期限切れ token・章の順番と再生成上限・fetch を差し替えた実 API 形式・エラー秘匿
- Playwright で画面を通しで操作し、幅 400px で横スクロールが無いか見る（縦書きの読み枠は `width:100%` を付けないとページが横に伸びる）

## 5. 最後に本人へ
- 変更ファイル一覧と、本人が手でやること（キー取得・上限額設定・wrangler login・KV 作成・secret 登録・deploy・WORKER_URL 設定・Pages 公開・通しテスト）を箇条書き
- 公開前のお披露目は `/showcase` へ
