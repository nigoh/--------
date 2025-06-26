# フェーズ 0: 準備フェーズ設計書

**期間**: 6/25–7/1  
**マイルストーン**: GitHub OAuth & Firebase 初期設定完了

---

## 1. 目標

- Firebase プロジェクトセットアップ完了
- GitHub OAuth アプリケーション登録完了
- 開発環境構築完了
- 基本的な認証フロー動作確認完了

---

## 2. タスク詳細

### 2.1 Firebase プロジェクト初期設定

#### 2.1.1 Firebase プロジェクト作成
```bash
# Firebase CLI インストール
npm install -g firebase-tools

# Firebase ログイン
firebase login

# プロジェクト作成
firebase projects:create timecard-app-2025
```

#### 2.1.2 Firebase サービス有効化
- **Authentication**: GitHub プロバイダー有効化
- **Firestore Database**: asia-northeast1 リージョンで作成
- **Cloud Functions**: Node.js 18 ランタイム設定
- **Hosting**: SPA 設定
- **Cloud Storage**: 月次レポート格納用バケット作成

#### 2.1.3 Firebase 設定ファイル生成
```javascript
// firebase.config.ts
export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "timecard-app-2025.firebaseapp.com",
  projectId: "timecard-app-2025",
  storageBucket: "timecard-app-2025.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 2.2 GitHub OAuth アプリケーション設定

#### 2.2.1 GitHub OAuth App 登録
1. GitHub Developer Settings → OAuth Apps → New OAuth App
2. **Application name**: Timecard App
3. **Homepage URL**: `https://timecard-app-2025.web.app`
4. **Authorization callback URL**: `https://timecard-app-2025.firebaseapp.com/__/auth/handler`
5. **Scope**: `read:user user:email`

#### 2.2.2 Firebase Authentication 設定
```javascript
// Authentication → Sign-in method → GitHub
const githubProvider = new GoogleAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');
```

### 2.3 開発環境構築

#### 2.3.1 プロジェクト初期化
```bash
# Vite + React + TypeScript プロジェクト作成
npm create vite@latest timecard-app -- --template react-ts

# 依存関係インストール
cd timecard-app
npm install

# Firebase SDK インストール
npm install firebase

# MUI インストール
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-data-grid
npm install @mui/x-date-pickers

# 追加ライブラリ
npm install zustand  # 状態管理
npm install react-router-dom  # ルーティング
npm install react-hook-form  # フォーム管理
npm install zod  # バリデーション
npm install date-fns  # 日付操作

# 開発ツール
npm install -D @types/node
npm install -D eslint-plugin-react-hooks
npm install -D @typescript-eslint/eslint-plugin
```

#### 2.3.2 プロジェクト構造作成
```
src/
├── components/          # 共通コンポーネント
│   ├── auth/           # 認証関連
│   ├── layout/         # レイアウト
│   └── ui/            # UI コンポーネント
├── features/           # 機能別
│   ├── attendance/     # 勤怠管理
│   ├── overtime/       # 残業申請
│   ├── vacation/       # 休暇申請
│   └── admin/         # 管理機能
├── hooks/              # カスタムフック
├── services/           # Firebase サービス
├── stores/             # Zustand ストア
├── types/              # TypeScript 型定義
├── utils/              # ユーティリティ
└── constants/          # 定数定義
```

### 2.4 基本認証実装

#### 2.4.1 Firebase 初期化
```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { firebaseConfig } from '../config/firebase.config';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-northeast1');
export default app;
```

#### 2.4.2 認証ストア作成
```typescript
// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));
```

#### 2.4.3 GitHub認証コンポーネント
```typescript
// src/components/auth/GitHubLoginButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../../services/firebase';

export const GitHubLoginButton: React.FC = () => {
  const handleLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      provider.addScope('user:email');
      
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<GitHub />}
      onClick={handleLogin}
      size="large"
      sx={{
        backgroundColor: '#24292e',
        '&:hover': {
          backgroundColor: '#1a1e22',
        },
      }}
    >
      GitHubでログイン
    </Button>
  );
};
```

### 2.5 Cloud Functions 基本設定

#### 2.5.1 Functions プロジェクト初期化
```bash
# Functions 初期化
firebase init functions

# TypeScript 選択
# ESLint 有効化
# 依存関係インストール実行
```

#### 2.5.2 ユーザー作成関数
```typescript
// functions/src/index.ts
import { onAuthUserCreated } from 'firebase-functions/v2/identity';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore();

export const setupUser = onAuthUserCreated(async (event) => {
  const { uid, email, displayName } = event.data;
  
  await db.collection('users').doc(uid).set({
    name: displayName || email?.split('@')[0] || 'Unknown',
    email: email || '',
    role: 'employee',
    team: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});
```

---

## 3. 検証項目

### 3.1 Firebase 接続確認
- [ ] Firebase プロジェクトが正常に作成されている
- [ ] Authentication でGitHubプロバイダーが有効
- [ ] Firestore データベースがasia-northeast1に作成済み
- [ ] Cloud Functions がデプロイ可能

### 3.2 認証フロー確認
- [ ] GitHub OAuth アプリが正常に登録されている
- [ ] ログインボタンクリックで GitHub 認証画面が表示
- [ ] 認証完了後、Firebase Authentication にユーザー登録
- [ ] setupUser 関数が実行され、users コレクションにユーザー作成

### 3.3 開発環境確認
- [ ] `npm run dev` でローカル開発サーバーが起動
- [ ] TypeScript エラーなし
- [ ] ESLint エラーなし
- [ ] 基本的な MUI コンポーネントが表示される

---

## 4. 環境変数設定

### 4.1 開発環境 (.env.local)
```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=timecard-app-2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=timecard-app-2025
VITE_FIREBASE_STORAGE_BUCKET=timecard-app-2025.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4.2 本番環境
Firebase Hosting の環境変数として同様の値を設定

---

## 5. 完了条件

1. GitHub から Firebase Authentication でログイン可能
2. ログイン時に users コレクションにユーザー情報が自動作成
3. ローカル開発環境で基本的な React + MUI アプリが動作
4. Firebase Functions のデプロイが成功
5. 認証状態がブラウザリロード後も保持される

---

## 6. 次フェーズへの引き継ぎ

- Firebase プロジェクト設定情報
- GitHub OAuth アプリ設定情報
- 開発環境セットアップ手順書
- 基本認証フローの動作確認結果
- セキュリティルールの初期設定案
