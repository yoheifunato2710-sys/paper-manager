# 論文マネージャー

論文をフォルダごとに管理し、決まった形式の文書を貼り付けると以下を自動抽出して保存するアプリです。

- ① 英語論文タイトル
- ② 日本語論文タイトル
- ③ Reference (参考文献書式)
- ④ Abstract (要旨)
- ⑤ Introduction & Purpose (Full Translation)
- ⑥ Methods: Analysis Process
- ⑦ Results (Corresponding to Purpose)

## 使い方

### Electron でデスクトップアプリとして起動（推奨）

1. **インストール**: `npm install` のあと `npm run electron` で起動
2. **データフォルダ**: 起動後、左サイドバー上部の「📂 データフォルダを選択」で、論文データとPDFを保存・参照するフォルダを選ぶ
3. データはそのフォルダ内の `data.json` と `pdfs/` に保存されます（他のPCと共有したりバックアップしやすい）

### ブラウザで使う場合

1. **起動**: `npm run dev` で開発サーバーを起動し、ブラウザで http://localhost:5173/ を開く（または `index.html` を直接開く）
2. データはブラウザの localStorage に保存されます

### 共通の操作

- **フォルダ**: 左の「＋」でフォルダを作成。フォルダをクリックで選択、✕で削除
- **論文の追加**: フォルダ選択後「＋ 論文を追加」→ テキストを貼り付けまたはPDFをドロップ → 「抽出する」
- **閲覧**: 論文をクリックすると右側に詳細が表示。「PDFを開く」で添付PDFを開けます（Electron では既定のPDFアプリで開く）

## ビルド

```bash
npm run build
```

生成された `dist` を任意の Web サーバーで配信できます。

## 技術スタック

- Vite + React 18 + TypeScript
- 永続化: localStorage
