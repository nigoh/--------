# 認証システム (Authentication System)

## 概要

このプロジェクトではFirebase Authentication v10を基盤とした、モダンで安全な認証システムを実装しています。

## 主要機能

### ✅ 実装済み機能

1. **基本認証**
   - メール/パスワード認証（登録・ログイン）
   - Googleソーシャルログイン
   - パスワード強度チェック
   - フォームバリデーション

2. **パスキー (WebAuthn)**
   - パスワードレス認証
   - 生体認証対応
   - プラットフォーム認証器サポート

3. **セキュリティ機能**
   - 認証状態の永続化
   - セキュアなトークン管理
   - エラーハンドリング

4. **UI/UX**
   - Material Design 3準拠のデザイン
   - ダークモード・ハイコントラスト対応
   - レスポンシブデザイン
   - アクセシビリティ配慮

5. **状態管理**
   - Zustandを使用した効率的な状態管理
   - 関心の分離に基づく設計
   - TypeScript完全対応

### 🚧 実装予定機能

1. **多要素認証 (MFA)**
   - TOTP (Google Authenticator等)
   - SMS認証
   - バックアップコード

2. **追加機能**
   - メール確認ワークフロー
   - パスワードリセット
   - アカウント管理

## アーキテクチャ

### ディレクトリ構成

```
src/features/auth/
├── components/          # UIコンポーネント
│   ├── AuthLayout.tsx   # 認証画面レイアウト
│   ├── AuthPage.tsx     # メイン認証ページ
│   ├── LoginForm.tsx    # ログインフォーム
│   ├── RegisterForm.tsx # 登録フォーム
│   ├── SocialButtons.tsx# ソーシャルログインボタン
│   ├── PasskeyButton.tsx# パスキーボタン
│   ├── OtpInput.tsx     # OTP入力コンポーネント
│   ├── AuthContext.tsx  # 認証コンテキスト
│   └── ProtectedRoute.tsx# 保護されたルート
├── hooks/               # カスタムフック
│   ├── useAuth.ts       # メイン認証フック
│   ├── useLogin.ts      # ログイン専用フック
│   ├── useRegister.ts   # 登録専用フック
│   ├── useMFA.ts        # MFA機能フック
│   └── usePasskey.ts    # パスキー機能フック
├── services/            # 外部サービス
│   ├── firebase.ts      # Firebase設定
│   ├── authService.ts   # 認証サービス
│   ├── mfaService.ts    # MFA関連サービス
│   └── passkeyService.ts# パスキー関連サービス
├── stores/              # 状態管理
│   └── useAuthStore.ts  # 認証ストア
├── types/               # 型定義
│   └── authTypes.ts     # 認証関連型
├── constants/           # 定数
│   └── authConstants.ts # 認証定数・エラーメッセージ
├── utils/               # ユーティリティ
│   └── authUtils.ts     # 認証関連ユーティリティ
└── index.ts             # エクスポート
```

### 設計原則

1. **関心の分離**: UI、ビジネスロジック、データアクセス層を明確に分離
2. **型安全性**: TypeScriptによる厳密な型定義
3. **再利用性**: コンポーネントとフックの適切な分離
4. **テスタビリティ**: モックしやすい設計
5. **アクセシビリティ**: WCAG準拠のUI実装

## 使用方法

### 1. アプリケーションへの統合

```typescript
// App.tsx
import { AuthProvider, ProtectedRoute } from './features/auth';

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
```

### 2. 認証状態の利用

```typescript
// 任意のコンポーネント内で
import { useAuth } from './features/auth';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.displayName}</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};
```

### 3. カスタムログインフォーム

```typescript
import { useLogin } from './features/auth';

const CustomLoginForm = () => {
  const {
    email,
    password,
    errors,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
};
```

## 環境設定

### Firebase設定

1. `.env.local`ファイルを作成
2. 以下の環境変数を設定：

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID

# 開発環境でエミュレーターを使用する場合
VITE_USE_FIREBASE_EMULATORS=true
```

## テスト

```bash
# 認証関連テストの実行
npm test -- --run src/test/authStore.test.ts src/test/authUtils.test.ts

# すべてのテスト実行
npm test
```

## セキュリティ考慮事項

1. **パスワード要件**: 8文字以上、英大小文字・数字を含む
2. **セッション管理**: Firebase Auth SDKによる自動管理
3. **CSRF保護**: Firebase App Check連携（本番環境）
4. **XSS対策**: React/TypeScriptによる自動エスケープ
5. **通信暗号化**: HTTPS必須

## パフォーマンス

- 認証コンポーネントの遅延読み込み対応
- Zustandによる効率的な状態管理
- Firebase SDKの最適化設定

## 今後の拡張予定

1. **Identity Platform機能**
   - カスタム認証プロバイダー
   - 高度なセキュリティルール
   - 監査ログ

2. **エンタープライズ機能**
   - SAML/OIDC認証
   - ディレクトリ統合
   - シングルサインオン (SSO)

3. **国際化対応**
   - 多言語サポート拡張
   - 地域別設定

## トラブルシューティング

### よくある問題

1. **Firebase Emulator接続エラー**
   - エミュレーターが起動していることを確認
   - ポート設定を確認 (Auth: 9099, Firestore: 8080)

2. **パスキーが動作しない**
   - HTTPS環境での実行を確認
   - ブラウザサポート状況を確認

3. **Google認証エラー**
   - Firebase Consoleでドメイン設定を確認
   - APIキーの権限設定を確認

## ライセンス

このプロジェクトのライセンスに従います。