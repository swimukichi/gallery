# Gallery Optimizer

このリポジトリには、元画像・元動画を専用フォルダに置いてサイト用に自動最適化するためのスクリプトが追加されています。

## 追加・変更したファイル
- `package.json`
- `scripts/optimize-images.js`
- `scripts/optimize-videos.js`
- `README.md`
- `_original/images/`
- `_original/videos/`

## 使い方

### 事前準備
1. ルートにある `_original/images/` に元の画像ファイルを置きます。
2. `_original/videos/` に元の動画ファイルを置きます。
3. `images/` と `Videos/` は出力先としてそのまま使います。

### インストール
最初に依存関係をインストールします。

```bash
npm install
```

### 画像を最適化する
```bash
npm run optimize:images
```

- 入力: `_original/images/`
- 出力: `images/`
- 形式: `webp`
- 横幅最大: 1600px
- 品質: 80
- ファイル名は英数字・ハイフン中心に整形されます

### 動画を最適化する
```bash
npm run optimize:videos
```

- 入力: `_original/videos/`
- 出力: `Videos/`
- 形式: `mp4`
- 1080p を超える場合は縮小
- Web 表示向けの軽量化設定
- `--mute` オプションをつけると音声を削除できます

例:
```bash
npm run optimize:videos -- --mute
```

### 画像と動画をまとめて最適化する
```bash
npm run optimize
```

## works-data.js への反映手順
1. `npm run optimize:images` で `_original/images/` の画像を `images/` に出力します。
2. 生成された `images/xxxx.webp` のパスを `works-data.js` の `thumbnail` フィールドに書きます。
   - 例: `thumbnail: "images/hf_example.webp"`
3. `noteUrl` には note 記事の URL を書きます。
   - 例: `noteUrl: "https://note.com/xxx"`
4. `noteUrl` が空の場合はサイト上でリンクボタンは表示されません。

## 注意点
- `thumbnail` は必ず `images/` フォルダ内のローカル画像パスを指定してください。
- `noteUrl` は note へのリンクであり、画像ではありません。
- 既存の `index.html` / `works-data.js` / `style.css` の表示ロジックは変更していません。
- `ffmpeg-static` を使うため、システムに別途 ffmpeg をインストールする必要はありません。

## note イラストのギャラリー追加手順

### 1. Googleフォトから画像をダウンロードする
- note に投稿したイラスト画像を Googleフォトからダウンロードします。
- ファイル名はわかりやすいものに変更してください（例: `arch-333.png`）。

### 2. _import/images/ に入れる
- ダウンロードした画像を `_import/images/` フォルダに置きます。

### 3. _import/import-list.json に note 記事 URL と画像ファイル名を書く
- `_import/import-list.json` を編集して、以下の形式で情報を追加します。
```json
[
  {
    "title": "作品タイトル",
    "series": "domestic×mutation",
    "category": "illustration",
    "noteUrl": "https://note.com/swi0801/n/記事ID",
    "sourceImage": "arch-333.png",
    "createdAt": "2026-05-08"
  }
]
```

### 4. npm run import:works を実行する
```bash
npm run import:works
```
- このコマンドで、未登録の作品だけを自動で WebP 化し、`works-data.js` に追加します。
- 既存の noteUrl と重複する場合はスキップされます。

### 5. works-data.js に自動追加されたか確認する
- `works-data.js` を開いて、新しい作品データが追加されているか確認します。

### 6. localhost で表示確認する
- ローカルサーバーでサイトを表示し、LATEST WORKS に新しい作品が表示されているか確認します。

### 7. 問題なければ git commit / git push する
- 問題がなければ、変更をコミットしてプッシュします。
- `_import/images/` の元画像は `.gitignore` で除外されているのでコミットされません。

## note 記事から自動でイラストを追加（add-work.js）

`node add-work.js` を使うと、note 記事から自動でイラストを取得し、WebP化・リサイズ・JSON追加・git pushを実行します。

### 使い方①：記事1件を追加
```bash
node add-work.js --note "https://note.com/swi0801/n/xxxx"
```

スクリプトが自動で以下を実行します：
- note 記事から画像を抽出（assets.st-note.com のみ対応）
- タイトルを og:title または h1 から取得
- 本文中の《》内テキストを作品名として抽出
- ハッシュタグからシリーズを判定（myth/plants/domestic）
- WebP変換・横幅1500px以下にリサイズ
- `images/` に保存
- `works-data.js` に追加（重複チェック付き）
- git自動化

### 使い方②：マガジン全件を一括追加（実験的）
```bash
node add-work.js --magazine "https://note.com/swi0801/m/xxxx"
```

**注意**: note.com のマガジンページは JavaScript で動的にレンダリングされるため、このオプションは現在 0 件となります。
将来的には Puppeteer などのヘッドレスブラウザを使用して対応する予定です。

**現在の対応方法**:
- マガジンの全記事を手動で確認して、各記事の URL を取得
- 各記事について `--note` オプションで個別に実行

例：
```bash
node add-work.js --note "https://note.com/swi0801/n/xxxx1"
node add-work.js --note "https://note.com/swi0801/n/xxxx2"
node add-work.js --note "https://note.com/swi0801/n/xxxx3"
```
| タイトル | og:title メタタグまたは h1 要素 |
| 作品名（《》内）| 本文中の《日本語テキスト》 |
| シリーズ | ハッシュタグとタイトル |
| 画像 | assets.st-note.com で始まる URL（最初の1枚を使用） |
| 記事URL | link フィールドに自動保存 |

### 使用例

単一記事を追加：
```bash
node add-work.js --note "https://note.com/swi0801/n/nb4054b787398"
```

複数記事を順番に追加：
```bash
node add-work.js --note "https://note.com/swi0801/n/n1a2b3c4d5e6f"
node add-work.js --note "https://note.com/swi0801/n/n1a2b3c4d5e6g"
node add-work.js --note "https://note.com/swi0801/n/n1a2b3c4d5e6h"
```

### 重複チェック
- works-data.js に同じ link URL が存在する場合は、自動的にスキップされます
- 既存データとの競合は発生しません

### シリーズ判定ロジック
- ハッシュタグに `myth`, `北欧神話`, `ギリシャ神話` → **myth**
- ハッシュタグに `plants`, `観葉植物` → **plants**
- その他 → **domestic**

### 注意点
- ネットワーク接続が必要です
- note の記事が公開状態である必要があります
- HTML 構造が変更された場合、抽出に失敗する可能性があります

