# Firebase エミュレーター設定ガイド

## エミュレーターを正しく使用する方法

### 1. Firebase プロジェクトの初期化
```bash
npx firebase init
```

### 2. エミュレーター用のユーザー作成スクリプト
```bash
# Firebaseエミュレーターを起動
npx firebase emulators:start --only auth,firestore

# 別のターミナルで開発サーバーを起動
npm run dev
```

### 3. エミュレーター用の認証設定
```typescript
// src/auth/firebase.ts
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  // エミュレーター用のテストユーザーを作成
  const createTestUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'admin@example.com', 
        'password123'
      );
      console.log('テストユーザーを作成しました:', userCredential.user);
    } catch (error) {
      console.log('テストユーザーは既に存在します');
    }
  };
  
  // アプリ起動時にテストユーザーを作成
  createTestUser();
}
```

### 4. エミュレーター用のログイン画面
```typescript
// 開発環境でのクイックログイン
const quickLogin = async () => {
  await signInWithEmailAndPassword(auth, 'admin@example.com', 'password123');
};
```

## 現在の推奨設定

開発を簡単にするため、認証バイパスを使用することをお勧めします：

```env
VITE_USE_FIREBASE_EMULATORS=false
VITE_DEV_AUTH_BYPASS=true
```

これにより、すぐにユーザー管理機能をテストできます。
