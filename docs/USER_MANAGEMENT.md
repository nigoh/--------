# 🔐 Firebase ユーザー管理システム 実装ガイド

## 📋 概要

`employeeRegister` と `roleManagement` 機能を統合し、Firebase Firestoreベースの包括的なユーザー管理システムを構築しました。

## 🏗 アーキテクチャ

### データ構造
```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;                  // メールアドレス
  displayName: string;            // 表示名
  
  // 社員情報
  employeeId: string;             // 社員番号
  name: string;                   // 氏名
  department: string;             // 部署
  position: string;               // 役職
  joinDate: string;               // 入社日
  skills: string[];               // スキル
  
  // 権限情報
  roles: UserRole[];              // ロール
  permissions: Permission[];       // 権限
  isActive: boolean;              // アクティブ状態
  
  // システム情報
  createdAt: Date;                // 作成日時
  updatedAt: Date;                // 更新日時
}
```

### Firebase セキュリティルール
```javascript
// 読み取り: employee:view 権限が必要
allow read: if hasPermission('employee:view');

// 作成・更新・削除: user:management 権限が必要
allow write: if hasPermission('user:management');

// 自分のプロフィール更新: 基本情報のみ
allow update: if request.auth.uid == userId 
  && !('roles' in request.resource.data);
```

## 🔧 主要機能

### 1. ユーザー一覧表示
- ページネーション対応
- ソート機能
- リアルタイム更新

### 2. 高度なフィルタリング
- テキスト検索（名前、メール、社員番号）
- ロール・部署・役職フィルター
- スキル・ステータスフィルター
- 最終ログイン日フィルター

### 3. CRUD操作
- ユーザー作成・編集・削除
- バリデーション機能
- 重複チェック（社員番号）

### 4. 統計ダッシュボード
- 総ユーザー数・アクティブ率
- ロール別・部署別統計
- 最近の入社動向

### 5. 権限管理
- ロールベースアクセス制御
- 細かい権限設定
- 権限の自動付与

## 🚀 セットアップ手順

### 1. 依存パッケージインストール
```bash
npm install @mui/x-date-pickers date-fns zustand
```

### 2. 環境変数設定
`.env.local` ファイルにFirebase設定を追加：
```env
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_USE_FIREBASE_EMULATORS=true  # 開発時
```

### 3. Firebase設定
```bash
# Firebase CLI インストール
npm install -g firebase-tools

# プロジェクト初期化
firebase init firestore

# セキュリティルールデプロイ
firebase deploy --only firestore:rules
```

### 4. アプリ統合
```typescript
// ルーター設定
import { UserManagement } from './features/userManagement';

{
  path: '/user-management',
  element: <UserManagement />,
  meta: { requiresAuth: true }
}
```

## 📊 使用方法

### 基本操作
1. **ユーザー一覧**: 全ユーザーの表示・検索
2. **ユーザー追加**: 新規ユーザーの作成
3. **ユーザー編集**: 既存ユーザー情報の更新
4. **ステータス変更**: アクティブ/非アクティブの切り替え

### フィルタリング
- **検索**: 名前、メール、社員番号で検索
- **部署フィルター**: 特定部署のユーザーを表示
- **ロールフィルター**: 管理者、マネージャーなど
- **アクティブフィルター**: アクティブ/非アクティブ

### 権限管理
- **ロール設定**: ユーザーにロールを割り当て
- **権限確認**: ユーザーの詳細権限を表示
- **一括権限変更**: 複数ユーザーの権限を同時変更

## 🔒 セキュリティ

### Firebase セキュリティルール
- 読み取り: `employee:view` 権限必須
- 書き込み: `user:management` 権限必須
- 自己更新: 基本情報のみ（権限は変更不可）

### データバリデーション
- メールアドレス形式チェック
- 社員番号重複チェック
- 必須フィールド検証
- ロール・部署の有効性チェック

### 監査ログ
- 作成者・更新者の記録
- 作成日時・更新日時の自動記録
- 操作履歴の追跡

## 🎯 今後の拡張計画

### Phase 1: 基本機能拡張
- [ ] CSVエクスポート/インポート
- [ ] 一括操作機能
- [ ] ユーザープロフィール画像アップロード

### Phase 2: 高度な機能
- [ ] 組織図表示
- [ ] ユーザーアクティビティダッシュボード
- [ ] 詳細レポート機能

### Phase 3: 統合機能
- [ ] タイムカード連携
- [ ] 経費精算連携
- [ ] 会議室予約連携

## 🐛 トラブルシューティング

### よくある問題

#### Firebase接続エラー
```bash
# エミュレーター起動
firebase emulators:start

# 環境変数確認
echo $VITE_USE_FIREBASE_EMULATORS
```

#### 権限エラー
- Firebase Authのカスタムクレーム設定を確認
- セキュリティルールの権限設定を確認

#### パフォーマンス問題
- Firestoreインデックス設定を確認
- ページネーションサイズを調整

## 📚 関連ドキュメント

- [Firebase Firestore ドキュメント](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [MUI Components](https://mui.com/components/)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. テストを追加
4. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は LICENSE ファイルを参照
