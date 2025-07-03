# ユーザー管理機能統合 - 移行ガイド

## 📋 移行概要
`employeeRegister` と `roleManagement` 機能を統合して `userManagement` 機能を作成しました。

## 🔄 移行手順

### 1. **既存機能の無効化**
以下のファイルを段階的に移行または削除：

#### Employee Register 機能
```
src/features/employeeRegister/
├── EmployeeRegister.tsx
├── EnhancedEmployeeList.tsx
├── useEmployeeStore.ts
├── components/
├── stores/
├── hooks/
└── constants/
```

#### Role Management 機能
```
src/features/roleManagement/
├── RoleManagement.tsx
├── EnhancedRoleManagementList.tsx
├── stores/useRoleManagementStore.ts
├── components/
├── hooks/
└── constants/
```

### 2. **ナビゲーション更新**
メインナビゲーションでのルーティングを更新：

```typescript
// Before
{ path: '/employee-register', component: EmployeeRegister }
{ path: '/role-management', component: RoleManagement }

// After
{ path: '/user-management', component: UserManagement }
```

### 3. **既存データの移行**
LocalStorageやZustandストアのデータをFirestoreに移行：

```typescript
// 移行スクリプト例
const migrateExistingData = async () => {
  // 既存の従業員データを取得
  const existingEmployees = useEmployeeStore.getState().employees;
  
  // Firestoreに移行
  for (const employee of existingEmployees) {
    const userData: CreateUserInput = {
      email: employee.email,
      displayName: employee.name,
      employeeId: employee.id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      joinDate: employee.joinDate,
      skills: employee.skills,
      roles: [UserRole.EMPLOYEE], // デフォルトロール
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.EMPLOYEE],
      isActive: employee.isActive,
      notes: employee.notes,
    };
    
    await createUser(userData);
  }
};
```

## 🚀 新機能の利用開始

### 1. **アプリへの統合**
```typescript
// App.tsx または ルーターファイルに追加
import { UserManagement } from './features/userManagement';

// ルート定義
{
  path: '/user-management',
  element: <UserManagement />,
  meta: {
    title: 'ユーザー管理',
    requiresAuth: true,
    requiredPermission: Permission.EMPLOYEE_VIEW,
  }
}
```

### 2. **メニュー項目の更新**
```typescript
// ナビゲーションメニュー
{
  icon: <PersonIcon />,
  label: 'ユーザー管理',
  path: '/user-management',
  requiredPermission: Permission.EMPLOYEE_VIEW,
  subItems: [
    {
      label: 'ユーザー一覧',
      path: '/user-management',
    },
    {
      label: 'ユーザー統計',
      path: '/user-management/stats',
      requiredPermission: Permission.USER_MANAGEMENT,
    }
  ]
}
```

### 3. **Firebase設定**
```bash
# Firebase CLI をインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化（既存プロジェクトの場合）
firebase use your-project-id

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules

# インデックスをデプロイ
firebase deploy --only firestore:indexes
```

### 4. **開発環境でのテスト**
```bash
# Firebaseエミュレーターを起動
firebase emulators:start

# 開発サーバーを起動
npm run dev
```

## 🔧 追加設定

### Firebase Functions（オプション）
カスタムクレーム（roles, permissions）をFirebase Authに設定するCloud Functions:

```typescript
// functions/src/index.ts
import { onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';

export const setUserClaims = onCall(async (request) => {
  const { uid, roles, permissions } = request.data;
  
  await getAuth().setCustomUserClaims(uid, {
    roles,
    permissions,
  });
  
  return { success: true };
});
```

### Firebase Security Rules テスト
```bash
# セキュリティルールのテストを実行
firebase emulators:exec --only firestore "npm run test:firestore"
```

## 📊 機能比較

| 機能 | Employee Register | Role Management | User Management (統合後) |
|------|------------------|-----------------|---------------------------|
| 社員情報管理 | ✅ | ❌ | ✅ |
| 権限・ロール管理 | ❌ | ✅ | ✅ |
| Firebase連携 | ❌ | ❌ | ✅ |
| リアルタイム同期 | ❌ | ❌ | ✅ |
| 高度なフィルタリング | ⚠️ | ⚠️ | ✅ |
| 統計ダッシュボード | ❌ | ❌ | ✅ |
| CSVエクスポート | ❌ | ❌ | 🔄 (実装予定) |
| 監査ログ | ❌ | ❌ | ✅ |

## ⚠️ 注意事項

1. **データバックアップ**: 移行前に既存データのバックアップを取ること
2. **段階的移行**: 一度にすべてを切り替えるのではなく、段階的に移行すること
3. **ユーザートレーニング**: UIが変わるため、ユーザーへの操作説明が必要
4. **権限設定**: 新しい権限システムに合わせてユーザーの権限を再設定すること

## 🎯 今後の拡張予定

- [ ] CSVインポート/エクスポート機能
- [ ] 一括操作機能
- [ ] 高度な検索・フィルター
- [ ] ユーザーアクティビティログ
- [ ] 組織図表示
- [ ] レポート機能
