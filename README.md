
# ランダムチーム分けアプリ（React + Vite + MUI）

チーム分けからミーティング進行まで一貫してサポートするWebアプリケーションです。名簿からランダムにチーム分けを行い、その後のミーティング進行を5ステップのワークフローでガイドします。

## 🎯 主な機能

### 1. チーム分け機能
- **メンバー登録**: 直感的なUI でメンバーを追加・編集・削除
- **社員選択**: 社員管理から登録済み社員を選択してチーム分けに追加
- **ランダムチーム分け**: Fisher-Yates アルゴリズムによる公正なチーム分け
- **アニメーション**: 美しいアニメーションとコンフェッティエフェクト
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

### 2. 社員管理機能
- **社員登録**: 基本情報・部署・役職・スキル・連絡先を管理
- **検索・フィルタリング**: 名前・部署・スキルによる高速検索
- **CRUD操作**: 社員情報の追加・編集・削除・ステータス管理
- **ページネーション**: 大量データの効率的な表示
- **エクスポート機能**: 社員データの一括管理

### 3. ミーティング進行機能
- **5ステップワークフロー**: 
  1. 一人で考える（5分）
  2. ペアで共有（10分）
  3. グループで議論（15分）
  4. 全体で発表・統合（10分）
  5. 優先順位をつける（10分）
- **タイマー機能**: 各ステップの時間管理
- **進行ガイド**: 詳細な進行手順とコツをMarkdown形式で表示
- **レスポンシブナビゲーション**: デスクトップは2カラム、モバイルはドロワー形式

### 3. UI/UX機能
- **ダークモード**: 目に優しいダークテーマ
- **ハイコントラストモード**: アクセシビリティ対応
- **フォントサイズ調整**: 見やすさの個人設定
- **アニメーション**: 控えめで洗練されたアニメーション
- **エラーハンドリング**: Error Boundary による安全なエラー処理

## 🚀 開発・起動方法

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# ESLint実行
npm run lint
```

## 🛠 技術スタック

### フロントエンド
- **React 19.1.0** - UIライブラリ（Hooks + TypeScript）
- **TypeScript** - 型安全性の確保
- **Vite 6.3.5** - 高速ビルドツール
- **Material-UI (MUI) 7.1.2** - UIコンポーネントライブラリ
- **Emotion** - CSS-in-JS スタイリング

### 追加ライブラリ
- **react-markdown** - Markdown レンダリング
- **remark-gfm** - GitHub Flavored Markdown サポート

### 開発ツール
- **ESLint** - コード品質チェック
- **Vite Plugin React** - React最適化

## 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── AnimatedBackground.tsx    # アニメーション背景
│   ├── ConfettiCanvas.tsx       # 紙吹雪エフェクト
│   ├── ErrorBoundary.tsx        # エラー境界
│   ├── LoadingSpinner.tsx       # ローディング表示
│   ├── SettingsPanel.tsx        # 設定パネル
│   ├── Timer.tsx                # タイマーコンポーネント
│   └── TipsPanel.tsx            # ヒント表示パネル
├── contexts/            # React Context
│   └── ThemeContext.tsx         # テーマ状態管理
├── features/            # 機能別コンポーネント
│   ├── meetingFlow/             # ミーティング進行機能
│   │   ├── MeetingFlow.tsx      # メイン画面
│   │   ├── StepNavigator.tsx    # ステップナビゲーション
│   │   ├── StepPanel.tsx        # ステップ表示パネル
│   │   ├── TipsSidePanel.tsx    # コツ表示サイドパネル
│   │   ├── meetingFlowData.ts   # ステップデータ定義
│   │   └── tipsLoader.ts        # ヒント読み込み
│   └── teamShuffle/             # チーム分け機能
│       ├── TeamShuffle.tsx      # メイン画面
│       ├── MemberRegister.tsx   # メンバー登録
│       ├── TeamCard.tsx         # チーム表示カード
│       ├── TeamResultPanel.tsx  # 結果表示パネル
│       ├── useMemberList.ts     # メンバーリスト管理Hook
│       ├── useTeamShuffleForm.ts # フォーム状態管理Hook
│       └── utils.ts             # ユーティリティ関数
├── hooks/               # カスタムHooks
│   └── useResponsive.ts         # レスポンシブ対応Hook
├── theme/               # テーマ定義
│   └── modernTheme.ts           # MUIテーマ設定
└── utils/               # ユーティリティ
    └── accessibility.ts         # アクセシビリティ設定
```

## 🎨 デザインシステム

### カラーパレット
- **プライマリー**: グラデーション（#667eea → #764ba2）
- **アクセント**: 控えめなグレー系統
- **背景**: 半透明オーバーレイ + blur効果

### アニメーション
- **入場**: fade + slide + scale の組み合わせ
- **ホバー**: 軽微な transform + shadow
- **コンフェッティ**: Canvas による物理シミュレーション

## 🔧 設定・カスタマイズ

### 環境設定
- TypeScript strict モード有効
- ESLint + React Hooks Plugin
- Vite による高速HMR

### コーディング規約
- **コンポーネント**: パスカルケース（例：`TeamCard.tsx`）
- **Hook**: `use` プレフィックス（例：`useMemberList.ts`）
- **型定義**: インターフェース優先
- **スタイル**: MUI の `sx` プロパティ使用

## 📱 対応ブラウザ・デバイス

- **デスクトップ**: Chrome, Firefox, Safari, Edge (最新版)
- **モバイル**: iOS Safari 15+, Chrome Mobile 90+
- **タブレット**: iPad, Android タブレット
- **画面サイズ**: 320px ~ 1920px+ 対応

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'Add amazing feature'`
4. ブランチにプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は `LICENSE` ファイルを参照してください。

## 🙏 謝辞

- [Material-UI](https://mui.com/) - 美しいUIコンポーネント
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [React](https://reactjs.org/) - 柔軟なUIライブラリct + Vite）

このWebアプリは、名簿（名前リスト）からランダムにチームを作成するツールです。

## 使い方
1. テキストエリアに1行ずつ名前を入力します。
2. チーム数を指定します。
3. 「チーム分け」ボタンを押すと、ランダムにチーム分け結果が表示されます。

## 開発・起動方法
```sh
npm install
npm run dev
```

## 技術スタック
- React
- Vite
