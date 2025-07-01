# Firebase認証機能実装ガイド

## 🔐 概要

WorkAppにFirebase Authentication v10を使用した認証機能を実装しました。メール/パスワード認証、Google OAuth、将来的なパスキー対応を含む包括的な認証システムです。

## 📋 実装内容

### 1. 認証機能
- **メール・パスワード認証**: `signInWithEmailAndPassword`
- **Google OAuth**: `signInWithPopup`
- **新規登録**: `createUserWithEmailAndPassword`
- **パスワード再設定**: `sendPasswordResetEmail`
- **メール確認**: `sendEmailVerification`
- **パスキー準備**: WebAuthn API対応（実装準備済み）

### 2. UI/UX
- **レスポンシブ認証画面**: グラデーション背景の美しいデザイン
- **リアルタイムバリデーション**: パスワード強度チェック
- **ローディング状態**: ボタンのローディングアニメーション
- **エラーハンドリング**: 日本語でのわかりやすいエラーメッセージ

### 3. 状態管理
- **Zustand**: 認証状態の統一管理
- **React Context**: アプリ全体での認証状態共有
- **永続化**: ブラウザリロード時の状態維持

## 🏗️ アーキテクチャ

### ディレクトリ構造
```
src/auth/
├── components/          # UI コンポーネント
│   ├── LoginForm.tsx    # ログインフォーム
│   ├── RegisterForm.tsx # 新規登録フォーム
│   └── AuthPage.tsx     # 認証ページ統合
├── hooks/               # カスタムフック
│   ├── useLogin.ts      # ログイン処理
│   └── useRegister.ts   # 新規登録処理
├── stores/              # 状態管理
│   └── useAuthStore.ts  # 認証ストア（Zustand）
├── firebase.ts          # Firebase設定・初期化
├── context.tsx          # 認証コンテキスト
├── passkey.ts           # WebAuthn/パスキー処理
├── types.ts             # 型定義
└── index.ts             # エクスポート統合
```

### データフロー
1. **初期化**: `firebase.ts` でFirebase初期化
2. **状態監視**: `context.tsx` で認証状態を監視
3. **状態管理**: `useAuthStore.ts` でZustandストア管理
4. **UI操作**: コンポーネントからフックを使用
5. **永続化**: Firebase Authの自動セッション管理

## 🔧 設定

### 環境変数
`.env.local` ファイルに以下を設定：

```bash
# Firebase設定
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# エミュレーター設定（開発環境）
VITE_USE_FIREBASE_EMULATORS=true
```

### Firebase コンソール設定
1. **Authentication** → **Sign-in method** で以下を有効化：
   - Email/Password
   - Google
2. **承認済みドメイン**に `localhost` を追加
3. **Identity Platform** （MFA用）の有効化（オプション）

## 🚀 使用方法

### 基本的な認証フロー

```tsx
import { AuthProvider, useAuth } from './auth';

// App.tsx での設定
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// コンポーネントでの使用
function YourComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  return (
    <div>
      <p>ようこそ、{user?.displayName}さん</p>
      <button onClick={signOut}>ログアウト</button>
    </div>
  );
}
```

### カスタムフックの使用

```tsx
import { useLogin, useRegister } from './auth';

function LoginComponent() {
  const { loginWithEmail, loginWithGoogle, isLoading, error } = useLogin();
  
  const handleEmailLogin = async () => {
    const success = await loginWithEmail({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
    
    if (success) {
      console.log('ログイン成功');
    }
  };
  
  // UI実装...
}
```

## 🔒 セキュリティ

### 実装済みのセキュリティ機能
- **Firebase Authentication**: Googleの堅牢な認証基盤
- **HTTPS強制**: 本番環境でのセキュア通信
- **CSRFプロテクション**: Firebase内蔵の保護機能
- **パスワード強度チェック**: クライアントサイドバリデーション
- **入力サニタイゼーション**: MUIコンポーネントの自動保護

### セキュリティベストプラクティス
1. **環境変数**: 機密情報の適切な管理
2. **Firestore Rules**: データアクセス制御
3. **App Check**: 本番環境でのアプリ認証
4. **定期的な依存関係更新**: セキュリティパッチの適用

## 🛠️ 今後の実装予定

### 1. MFA（多要素認証）
```typescript
// MFA実装例（準備済み）
import { multiFactor, PhoneAuthProvider } from 'firebase/auth';

const setupMFA = async (user: User, phoneNumber: string) => {
  const session = await multiFactor(user).getSession();
  // 実装詳細...
};
```

### 2. パスキー（WebAuthn）
```typescript
// パスキー実装（準備済み）
import { registerPasskey, authenticateWithPasskey } from './auth';

const handlePasskeyLogin = async () => {
  const credential = await authenticateWithPasskey(challengeData);
  // Firebase認証と連携...
};
```

### 3. 権限管理
```typescript
// Firestore Rulesでの権限制御
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

## 📊 モニタリング・ログ

### 認証イベントの監視
- **ログイン成功/失敗**: コンソールログ出力
- **エラー追跡**: エラーメッセージの日本語化
- **パフォーマンス**: Firebase Analytics連携（今後）

### デバッグ
```typescript
// 開発環境でのデバッグ
if (import.meta.env.DEV) {
  console.log('🔧 認証状態:', { user, isAuthenticated, isLoading });
}
```

## 🧪 テスト

### 今後のテスト実装予定
1. **Unit Test**: カスタムフックのテスト
2. **Integration Test**: Firebase Emulatorとの連携テスト
3. **E2E Test**: Playwrightでの認証フローテスト

```typescript
// テスト例（準備）
import { renderHook } from '@testing-library/react';
import { useLogin } from './auth';

test('ログイン機能のテスト', async () => {
  const { result } = renderHook(() => useLogin());
  // テスト実装...
});
```

## 📈 パフォーマンス最適化

### 実装済み最適化
- **Code Splitting**: 認証コンポーネントの遅延読み込み
- **メモ化**: React.useCallbackでのハンドラー最適化
- **バンドル最適化**: Firebase必要機能のみインポート

### 今後の最適化
- **Service Worker**: オフライン対応
- **Pre-loading**: 予測的な認証状態取得

## 🔧 トラブルシューティング

### よくある問題と解決方法

1. **エミュレーター接続エラー**
   ```bash
   # Firebase Emulatorの起動
   firebase emulators:start --only auth,firestore,functions
   ```

2. **認証状態が保持されない**
   - ブラウザの設定確認
   - `setPersistence` の設定確認

3. **Google OAuth エラー**
   - 承認済みドメインの確認
   - OAuth同意画面の設定確認

## 📞 サポート

実装に関する質問やバグ報告は、プロジェクトのIssueまたは開発チームまでお問い合わせください。
