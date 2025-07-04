# Firebase Authentication Super Admin セットアップガイド

## 📋 概要

Firebase Authenticationでsuper_admin権限を持つアカウントを作成する方法とその管理について説明します。

## 🚀 方法1: 開発環境での直接作成（最も簡単）

### ステップ1: 管理者作成コンポーネントの使用

1. 開発サーバーを起動
```bash
npm run dev
```

2. ブラウザで管理者作成ページにアクセス
```
http://localhost:5175/admin/create
```

3. `AdminUserCreator` コンポーネントを使用して管理者を作成

### ステップ2: Firestoreでの権限設定

`createSuperAdminUser` 関数により以下が自動設定されます：

```typescript
{
  roles: ['super_admin', 'admin'],
  permissions: [...DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN],
  isSuperAdmin: true,
  isSystemUser: true,
  isActive: true
}
```

### ステップ3: Custom Claims の設定

Firebase Functions または Admin SDK で実行：

```javascript
// Firebase Functions
const admin = require('firebase-admin');

await admin.auth().setCustomUserClaims(uid, {
  roles: ['super_admin', 'admin'],
  permissions: ['*'],
  isSuperAdmin: true,
  isSystemUser: true
});
```

## 🔧 方法2: Firebase Functions 経由

### functions/index.js に追加

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createSuperAdmin = functions.https.onCall(async (data, context) => {
  // セキュリティチェック
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  const { email, password, displayName } = data;

  try {
    // ユーザー作成
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: true
    });

    // Custom Claims 設定
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      roles: ['super_admin', 'admin'],
      permissions: ['*'],
      isSuperAdmin: true
    });

    // Firestore に保存
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name: displayName,
      roles: ['super_admin', 'admin'],
      permissions: [...ALL_PERMISSIONS],
      isSuperAdmin: true,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### クライアントから呼び出し

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createSuperAdmin = httpsCallable(functions, 'createSuperAdmin');

const result = await createSuperAdmin({
  email: 'admin@company.com',
  password: 'SecurePassword123!',
  displayName: 'システム管理者'
});
```

## 🛠️ 方法3: Firebase CLI + Admin SDK

### セットアップスクリプト実行

```bash
# Firebase Admin SDK用の設定
npm install firebase-admin

# スクリプト実行
node scripts/setup-admin-claims.js
```

### 対話式でSuper Admin作成

```javascript
// scripts/create-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createSuperAdmin() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'admin@company.com',
      password: 'SecurePassword123!',
      displayName: 'システム管理者',
      emailVerified: true
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      roles: ['super_admin', 'admin'],
      permissions: ['*'],
      isSuperAdmin: true
    });

    console.log('✅ Super Admin作成完了:', userRecord.uid);
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

createSuperAdmin();
```

## 🔐 方法4: Firebase Console + Manual Setup

### 手順

1. **Firebase Console でユーザー作成**
   - Authentication → Users → Add user

2. **Firestore でユーザードキュメント作成**
```json
{
  "uid": "user-uid-here",
  "email": "admin@company.com",
  "name": "システム管理者",
  "roles": ["super_admin", "admin"],
  "permissions": ["*"],
  "isSuperAdmin": true,
  "isActive": true,
  "createdAt": "2025-01-07T12:00:00Z"
}
```

3. **Custom Claims 設定**（Firebase Functions必要）

## 🎯 推奨フロー

### 開発環境
1. `AdminUserCreator` コンポーネントでGUIベース作成
2. Firebase Functions でCustom Claims設定

### 本番環境
1. Firebase Functions経由で安全に作成
2. サービスアカウントキーでAdmin SDK使用
3. 監査ログの記録

## ✅ 検証方法

### Custom Claims確認
```typescript
import { getIdTokenResult } from 'firebase/auth';

const user = auth.currentUser;
const tokenResult = await getIdTokenResult(user, true);
console.log('Custom Claims:', tokenResult.claims);
```

### 権限テスト
```typescript
import { hasRole, isAdmin } from '../auth/permissions';

const adminCheck = await isAdmin(); // true
const superAdminCheck = await hasRole(UserRole.SUPER_ADMIN); // true
```

## ⚠️ セキュリティ考慮事項

1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **監査ログ**: 権限変更のログ記録
3. **定期レビュー**: 管理者権限の定期的な見直し
4. **MFA必須**: 管理者アカウントには必ずMFA設定
5. **アクセス制限**: IP制限、時間制限の検討

## 📚 関連ファイル

- `src/auth/admin/createAdminUser.ts` - 管理者作成ユーティリティ
- `src/auth/components/AdminUserCreator.tsx` - 管理者作成UI
- `src/auth/permissions.ts` - 権限チェック関数
- `scripts/setup-admin-claims.js` - Admin SDK スクリプト

## 🔧 トラブルシューティング

### よくある問題

1. **Custom Claims が反映されない**
   - IDトークンの強制リフレッシュが必要
   ```typescript
   await getIdTokenResult(user, true); // true で強制リフレッシュ
   ```

2. **権限チェックが失敗する**
   - Firestoreの権限とCustom Claimsの同期確認
   - ユーザーのisActiveフラグ確認

3. **Admin SDK初期化エラー**
   - サービスアカウントキーの配置確認
   - 環境変数の設定確認

これで安全かつ確実にSuper Admin権限を持つアカウントを作成・管理できます！
