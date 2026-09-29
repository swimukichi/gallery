# 怖話工房（一般公開版）

GitHub Pages（フロント）＋ Cloudflare Worker（API）＋ Claude API。
プロンプトは `worker/src/prompts.js` に固定。フロントは選択肢IDだけを送る。

## ローカルで試す（APIキー不要・課金なし）
```
cd horror-maker/worker
node test/dev-server.mjs      # 画面 http://localhost:8000 / API http://localhost:8787
node test/run.mjs             # 自動テスト
```
`MOCK=1` のダミー生成。画面フロー・token・回数制限・SSE表示を確認できる。
（`wrangler dev` でも動く：`cp .dev.vars.example .dev.vars` → `npx wrangler dev`）

## 公開までの手作業
1. Anthropic Console でAPIキーを作り、月の上限額（Spend limit）を設定
2. `cd worker && npx wrangler login`
3. `npx wrangler kv namespace create RATE_KV` → 出た id を `wrangler.toml` に貼る
4. `npx wrangler secret put ANTHROPIC_API_KEY` / `npx wrangler secret put HMAC_SECRET`
   （HMAC_SECRET は `openssl rand -base64 32` などで作った長い乱数）
5. `npx wrangler deploy` → 出た URL を `app.js` の `WORKER_URL` に設定
6. 公開用リポジトリ swimukichi/horror-maker に `index.html app.js style.css terms.html worker/` を置き、Pages を有効化

## コストを抑える設定
- モデル：`wrangler.toml` の `MODEL`（安くするなら `claude-haiku-4-5`）
- 上限：IPごと1日3回・全体1日100回（`worker/src/index.js` 冒頭の定数）
- 章の本文は `max_tokens = 章あたり文字数 × 2`
