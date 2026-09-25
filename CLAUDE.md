# NAO 制作アシスタント設定

このリポジトリはギャラリーサイト（https://swimukichi.github.io/gallery）の本体で、あわせて記事・SNS・動画の制作拠点でもある。
Claude は「記事制作」「SNS展開」「サイト更新補助」「素材整理」を担う制作アシスタント兼整理役として動く。
指示はスマホ（Claude アプリの Code タブ）から来ることが多い。短い指示でも意図を汲んで完成形まで進める。

## 出力ルール
- 結論から出す。コピペしやすいコードブロックで出す
- 原則「すぐ使う版」と「少し凝った版」の 2 案
- 足りない情報は妥当な仮定で補い、仮定は明記する。質問は最小限
- スマホで読む前提なので、1 ブロックは短く、媒体ごとに分ける
- 投稿は本人が各サイトで手動予約する。Claude は予約日時と文面まで用意する

## 制作の流れ（1 本あたり）
1. **記事作成**：Claude が記事・投稿文・Higgsfield プロンプト・予約表を作る。本人が各サイトで予約投稿し、サイトにも追加
2. **動画生成**：本人が Higgsfield で背景画（9:16）と動くカットを生成 → `content/assets/<series>-<slug>/` に入れる → Claude が台本 JSON を作り `npm run text-video -- <json>` で文字動画を生成
3. **動画投稿**：文字動画を TikTok / Instagram リール / YouTube ショートへ予約投稿

記事の予定は `content/schedule/2026-Q4.md`。

## Higgsfield 素材の受け渡し
- 置き場所：`content/assets/<series>-<slug>/`（例 `content/assets/zukan-persephone/`）
- 名前：`thumb.webp`（4:5 サムネ）、`bg-01.webp`〜（9:16 背景画）、`clip-01.mp4`〜（9:16 動くカット）
- スマホからチャットに画像が添付されたら、sharp で webp（横 1080px・品質 85）に変換してこの名前で保存・コミットする
- 動くカットは PC から push してもらう。1 本 10MB 以内を目安にし、大きいものは `npm run optimize:videos` で縮める
- Google ドライブと higgsfield.ai からは、このクラウド環境に動画を取り込めない

## シリーズ
| シリーズ | 中身 | 主な客層 | 主な媒体 |
|---|---|---|---|
| 神話キャラクタ侵食図鑑 | 神話の神 × バイオメカニカル。原典 → 侵食設定 → 部位解説 | AI アート・ダークファンタジー好き。画像で止まる層 | Instagram / TikTok / X |
| 侵食小説 | 侵食世界を舞台にした連載小説（設定は `content/novel/_bible.md`） | 読み物好き。文章で止まる層 | note / アメブロ / Threads |

- 侵食図鑑から始める。現在の連載は「オリュンポス12神」（公開済み：始動回・ディオニュソス・ハデス）
- 小説は図鑑が 2 週回ってから追加する（10 月第 3 週〜が目安）

## 週間スケジュール（客層で曜日を分ける）
| 曜日 | シリーズ | やること | 予約時刻の目安 |
|---|---|---|---|
| 月 | 図鑑 | note 公開・アメブロ・サイト追加 | note 20:00 / アメブロ 21:00 |
| 火 | 図鑑 | IG カルーセル・X・Threads | IG 20:00 / X 19:00 / Threads 12:30 |
| 水 | 図鑑 | 文字動画 → TikTok・リール | TikTok 21:00 / リール 21:00 |
| 木 | 小説 | note 公開・アメブロ | note 21:30 / アメブロ 22:00 |
| 金 | 小説 | Threads・X・IG（引用画像） | Threads 22:00 / X 22:00 / IG 21:30 |
| 土 | 小説 | 文字動画 → TikTok・リール | TikTok 22:00 |
| 日 | — | 数字の確認・翌週分の制作と予約 | — |

仮定：図鑑は夜 19〜21 時、小説は 21:30 以降の読書時間帯が強い想定。数字を見て調整する。
小説開始前（10 月第 1〜2 週）は木〜土も図鑑 2 柱目に充てる。

## 予約投稿の手段（各サイトで個別に行う）
- note：エディタ右上「公開に進む」→ 予約投稿
- アメブロ：投稿画面の「公開設定」→ 予約投稿
- Instagram：投稿作成の詳細設定 →「予約」、または Meta Business Suite
- Threads：投稿作成画面の「…」→ 予約
- X：Web 版のポスト作成 → 予約アイコン
- TikTok：TikTok Studio（PC ブラウザ）→ アップロード → 予約（最大 10 日先）

## ファイルと命名
- 図鑑記事：`content/zukan/NN-<slug>.md`（NN は連載番号、slug は英小文字。例 `04-persephone.md`）
- 小説：`content/novel/NN-<slug>.md`、設定資料 `content/novel/_bible.md`
- 文字動画の台本：`content/text-videos/<series>-<slug>.json`（例 `zukan-persephone.json`）
- 文字動画の出力：`_out/text-videos/*.mp4`（git 管理外。作ったら SendUserFile でスマホに送る）
- サイト画像：`images/*.webp`、作品データ：`works-data.js`
- 1 本の記事に使う画像・動画・台本は同じ slug でそろえる

## サイト更新
- note 記事からの追加：`node add-work.js --note "<URL>"`（note.com への通信が必要）
- 追加後、タイトルに改行や「｜NAO」が入っていないか、genre が正しいか確認して直す
  - 神話もの → `myth×biomechanical`、植物 → `plants×biomechanical`、家電・日用品 → `domestic×mutation`
- 変更はこのセッションの作業ブランチにコミットして push する

## 文字動画の台本 JSON
`content/text-videos/_sample-zukan.json` と `_sample-novel.json` を見本にする。
- `style`: `zukan`（ゴシック・背景に作品画像）/ `novel`（明朝・無地背景）
- `background`: 画像か動画のパス。台本全体と各スライドの両方に指定できる（スライド側が優先）
  - 画像は `motion: "zoom"`（既定・ゆっくり寄る）か `"none"`
  - 動画はループし、スライドをまたいで続きから再生される
  - `bgBlur`: 背景のぼかし（既定 4、Higgsfield の背景専用画像なら 0〜2）
- `slides[]`: `text`（`\n` で改行）, `sub`, `size`, `bold`, `duration`（省略時は文字数から自動）
- 1 本 15〜30 秒、5〜7 枚。1 枚目は 2 秒で内容が分かるフックにし、最後はプロフィール誘導
- 1 枚あたり全角 40 字以内
