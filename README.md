
# ランダムチーム分けアプリ（React + Vite + MUI）

チーム分けからミーティング進行まで一貫してサポートするWebアプリケーションです。名簿からランダムにチーム分けを行い、その後のミーティング進行を5ステップのワークフローでガイドします。

## 🎯 主な機能

### 1. 認証機能 🔐
- **Firebase Authentication**: セキュアなユーザー認証
- **メール・パスワード認証**: 標準的なログイン方式
- **Google OAuth**: ワンクリックでの簡単ログイン
- **パスキー対応**: 将来的な生体認証・WebAuthn対応（準備済み）
- **パスワード強度チェック**: リアルタイムパスワード強度表示
- **メール確認**: 新規登録時のメール確認プロセス
- **レスポンシブ認証UI**: 美しいグラデーション背景の認証画面

### 2. チーム分け機能
- **メンバー登録**: 直感的なUI でメンバーを追加・編集・削除
- **社員選択**: 社員管理から登録済み社員を選択してチーム分けに追加
- **ランダムチーム分け**: Fisher-Yates アルゴリズムによる公正なチーム分け
- **チーム管理**: 保存済みチームの作成・編集・削除・読み込み機能
- **チーム保存**: 現在のメンバーリストやチーム分け結果を保存
- **タブ切り替え**: 「ランダム生成」と「チーム管理」の2つのモード
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

### 4. 勤怠管理機能
- **出勤・退勤登録 / 休暇登録**: 日付と時間、または休暇理由を入力して記録
- **履歴表示**: 登録済みの勤怠を表形式で一覧
- **編集**: 一覧から登録済みの勤怠を更新
- **削除**: 誤登録の削除に対応

### 5. 備品管理機能
- **備品登録**: 名称・カテゴリ・在庫数・備考を管理
- **在庫調整**: 一覧から数量を増減
- **編集・削除**: 既存備品の更新と削除

### 6. 🆕 統一ログシステム
- **マルチレベルログ**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- **React統合**: useLogger Hook による簡単な導入
- **PII自動マスキング**: 個人情報（メール、クレジットカード等）の自動保護
- **マルチトランスポート**: Console、LocalStorage、HTTP API への同時出力
- **エラー統合**: 既存 Error Boundary との自動連携
- **パフォーマンス配慮**: 非同期処理、バッファリング、最小限のオーバーヘッド

### 7. UI/UX機能
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

# テスト実行
npm run test
```

## 📋 ログシステムの使用方法

### 基本的な使い方

```tsx
import { useLogger } from './logging';

const MyComponent = () => {
  const logger = useLogger();
  
  const handleSubmit = async () => {
    logger.info('フォーム送信開始', { formId: 'user-profile' });
    
    try {
      await submitForm();
      logger.info('フォーム送信成功');
    } catch (error) {
      logger.logError(error, { context: 'form-submission' });
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

### ログレベル

- **TRACE**: 詳細なデバッグ情報
- **DEBUG**: 開発時の状態情報
- **INFO**: 一般的な動作情報
- **WARN**: 警告・非推奨使用
- **ERROR**: エラー発生
- **FATAL**: 重大な障害

### PII保護

個人情報は自動的にマスクされます：

```tsx
logger.info('ユーザー情報', {
  email: 'user@example.com',    // → 'u***@example.com'
  password: 'secret123',        // → '***MASKED***'
  creditCard: '1234-5678-9012-3456'  // → '****-****-****-3456'
});
```

詳細な使用方法は [docs/LOGGING_GUIDE.md](docs/LOGGING_GUIDE.md) を参照してください。

## 🛠 技術スタック

### フロントエンド
- **React 19.1.0** - UIライブラリ（Hooks + TypeScript）
- **TypeScript** - 型安全性の確保
- **Vite 6.3.5** - 高速ビルドツール
- **Material-UI (MUI) 7.1.2** - UIコンポーネントライブラリ
- **Firebase** - 認証・データベース・クラウド機能
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
├── auth/                # 認証機能
│   ├── components/              # 認証関連UI
│   │   ├── LoginForm.tsx        # ログインフォーム
│   │   ├── RegisterForm.tsx     # 新規登録フォーム
│   │   └── AuthPage.tsx         # 認証メインページ
│   ├── hooks/                   # 認証関連フック
│   │   ├── useLogin.ts          # ログイン処理
│   │   └── useRegister.ts       # 新規登録処理
│   ├── stores/                  # 認証状態管理
│   │   └── useAuthStore.ts      # 認証ストア
│   ├── firebase.ts              # Firebase設定
│   ├── context.tsx              # 認証コンテキスト
│   ├── passkey.ts               # パスキー処理
│   ├── types.ts                 # 型定義
│   └── index.ts                 # エクスポート統合
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
│   └── teamManagement/          # チーム管理機能
│       ├── TeamManagement.tsx   # メイン画面
│       ├── EnhancedTeamList.tsx # チーム一覧表示
│       ├── stores/
│       │   ├── useTeamStore.ts  # チームデータストア
│       │   └── useTeamFormStore.ts # フォーム状態ストア
│       ├── components/          # UI コンポーネント
│       ├── hooks/               # カスタムフック
│       └── constants/           # 定数定義
│   └── timecard/                # 勤怠管理機能
│       ├── Timecard.tsx         # 一覧・登録画面
│       ├── TimecardForm.tsx     # 勤怠登録フォーム
│       ├── TimecardList.tsx     # 勤怠履歴
│       └── useTimecardStore.ts  # Zustandストア
├── hooks/               # カスタムHooks
│   └── useResponsive.ts         # レスポンシブ対応Hook
├── logging/             # 🆕 統一ログシステム
│   ├── Logger.ts                # ログメインクラス
│   ├── LogProvider.tsx          # React Context
│   ├── types.ts                 # 型定義
│   ├── transports/              # ログ出力先
│   │   ├── Console.ts           # コンソール出力
│   │   ├── Storage.ts           # ローカルストレージ
│   │   └── Http.ts              # HTTP API送信
│   └── utils/
│       └── maskPII.ts           # 個人情報マスキング
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

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Material-UI](https://mui.com/) - 美しいUIコンポーネント
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [React](https://reactjs.org/) - 柔軟なUIライブラリct + Vite）

このWebアプリは、名簿（名前リスト）からランダムにチームを作成するツールです。

## 使い方
1. テキストエリアに1行ずつ名前を入力します。
2. チーム数を指定します。
3. 「チーム分け」ボタンを押すと、ランダムにチーム分け結果が表示されます。

### 勤怠管理
1. 「勤怠管理」タブを選択します。
2. 日付と出勤/退勤時間を入力、または休暇を選択して理由を入力し「登録」を押します。
3. 下の表に履歴が追加されます。
4. 編集アイコンから登録済みの勤怠を更新できます。

## 開発・起動方法
```sh
npm install
npm run dev
```

## 技術スタック
- React
- Vite
