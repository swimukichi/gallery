# 数字の置き場所

| ファイル | 中身 | 更新方法 |
|---|---|---|
| `note-posts.csv` | note 全記事のスキ・コメント。公開から 1・3・7・30 日時点のスキ数 | 毎日 23:30 に GitHub Actions が自動更新（無料） |
| `views.csv` | 閲覧数（PV・再生数・リーチ）。note / アメブロ / Instagram / Threads / X / TikTok | 各サイトの分析画面のスクショをスマホから送る → `/stats` で記録 |
| `reports/YYYY-Www.md` | 週次レポート | 日曜に `/stats` |

閲覧数は各サイトとも公開データに無いため、スクショからの記録になる。

## views.csv の列
- `period`：`d1`（公開翌日）/ `d3` / `d7` / `week`（週の合計）/ `total`
- `key_or_url`：note は記事キー（`n` で始まる英数字）、ほかは投稿 URL か投稿日＋タイトル
- `source`：`screenshot` / `manual`
