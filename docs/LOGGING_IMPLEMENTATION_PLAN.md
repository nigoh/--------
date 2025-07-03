# ロギング実装計画

## 🎯 概要

既存の各機能（認証、チーム管理、社員管理、勤怠管理、備品管理、MFA、パスキー等）に包括的なロギング処理を段階的に実装する計画。

## 📋 実装対象機能

### 1. 認証機能 (auth/)
- **ログイン/ログアウト**: ユーザーアクション、成功/失敗
- **新規登録**: アカウント作成プロセス
- **パスワードリセット**: セキュリティ関連アクション
- **MFA設定**: 多要素認証の設定変更
- **パスキー管理**: 生体認証の登録/削除

### 2. チーム管理機能 (features/teamManagement/)
- **チーム作成/編集/削除**: CRUD操作
- **メンバー追加/削除**: チーム構成変更
- **検索/フィルタリング**: データアクセスパターン
- **チーム分け実行**: アルゴリズム実行とパフォーマンス

### 3. 社員管理機能 (features/employeeRegister/)
- **社員登録/更新/削除**: 人事データ操作
- **検索/フィルタリング**: データ検索パターン
- **ステータス変更**: 雇用状態変更
- **CSVエクスポート**: データ出力処理

### 4. 勤怠管理機能 (features/timecard/)
- **出勤/退勤登録**: 日常的な打刻操作
- **休暇申請**: 申請プロセス
- **勤怠データ編集**: 修正操作
- **集計処理**: レポート生成

### 5. 備品管理機能 (features/equipment/)
- **備品登録/更新**: 資産管理操作
- **在庫調整**: 数量変更
- **検索/フィルタリング**: 備品検索

### 6. 経費管理機能 (features/expense/)
- **経費登録/承認**: 申請プロセス
- **ステータス管理**: 承認フロー
- **レポート生成**: 集計処理

## 🏗️ 実装段階

## ✅ フェーズ1: 基盤整備（完了）

### 🎯 共通ロギングフック作成

#### ✅ `src/hooks/logging/useFeatureLogger.ts` (完了)
- **機能**: フィーチャー別ロギングのメイン機能
- **用途**: ユーザー操作、フォーム操作、ナビゲーション、セキュリティイベント、パフォーマンス計測
- **特徴**: 既存LogProviderとの統合、自動コンテキスト付与、型安全性

#### ✅ `src/hooks/logging/useCRUDLogger.ts` (完了)
- **機能**: CRUD操作専用ロギング
- **用途**: 作成、読取、更新、削除操作の詳細ログ、バリデーションエラー、楽観的更新の追跡
- **特徴**: 操作複雑度計算、データ変更追跡、エラーパターン分析

#### ✅ `src/hooks/logging/useSearchLogger.ts` (完了)  
- **機能**: 検索・フィルター操作ロギング
- **用途**: 検索実行、フィルター適用、ソート操作、結果分析、パフォーマンス監視
- **特徴**: 検索効率評価、フィルター複雑度分析、結果品質測定

#### ✅ `src/hooks/logging/useExportLogger.ts` (完了)
- **機能**: エクスポート操作専用ロギング  
- **用途**: CSVエクスポート、データダウンロード、セキュリティ監視、パフォーマンス追跡
- **特徴**: エクスポート複雑度計算、リスク評価、データアクセス監視

#### ✅ `src/hooks/logging/index.ts` (完了)
- **機能**: 統一エクスポートと便利関数
- **用途**: useUnifiedLoggers、認証・管理・業務機能向け専用ロガー
- **特徴**: 機能別プリセット、統一設定インターフェース

### 🔧 使用例

#### 統一ロガー作成
```typescript
const { featureLogger, crudLogger, searchLogger, exportLogger } = useUnifiedLoggers({
  featureName: 'EmployeeManagement',
  enablePerformanceLogging: true,
  context: { module: 'hr' }
});
```

#### 機能別プリセット
```typescript
// 認証機能向け（セキュリティ重視）
const authLoggers = useAuthLoggers();

// 管理機能向け（全機能有効）  
const mgmtLoggers = useManagementLoggers('TeamManagement');

// 業務機能向け（データ追跡重視）
const bizLoggers = useBusinessLoggers('TimeCard');
```

2. **ロギング設定の統一**
   - 各機能共通の設定
   - 環境別ログレベル調整
   - PII マスキングルール拡張

### ✅ フェーズ2: 認証機能ログ統合（完了）

#### 🎯 認証機能への包括的ロギング実装

**✅ `src/auth/hooks/useLogin.ts` (完了)**
- ログイン試行（メール/Google/パスキー別）
- ログイン成功/失敗（ユーザー情報、エラーコード）
- MFA要求・セキュリティイベント記録
- パスワードリセット処理

**✅ `src/auth/hooks/useRegister.ts` (完了)**  
- 新規登録試行・成功・失敗
- バリデーションエラー追跡
- メール確認再送信処理
- アカウント作成セキュリティイベント

**✅ `src/features/mfa/hooks/useMFAForm.ts` (完了)**
- MFA設定読み込み・削除・追加
- セキュリティイベント（要因追加/削除）

### ✅ フェーズ3: データ管理機能ログ統合（完了）

#### 🎯 チーム管理・社員管理機能への包括的ロギング実装

**✅ `src/features/teamManagement/hooks/useTeamForm.ts` (完了)**
- チーム作成・更新・削除（CRUD操作、バリデーション）
- メンバー管理（追加、削除、ロール更新）
- ダイアログ操作（作成・編集ダイアログ開始）

**✅ `src/features/employeeRegister/hooks/useEmployeeForm.ts` (完了)**  
- 社員登録・更新（CRUD操作、バリデーション）
- フォーム初期化・保存処理
- エラーハンドリング・成功通知

**✅ `src/features/employeeRegister/EnhancedEmployeeList.tsx` (完了)**
- 検索機能（検索クエリ、結果分析）
- フィルター機能（部署、ステータス、クリア）
- ソート機能（フィールド、方向切り替え）
- CSVエクスポート（要求、完了、エラー、ダウンロード）

#### 🔧 実装された機能パターン

**CRUD操作ロギング**
```typescript
await crudLogger.logCreate('employee', newEmployee, {
  department: formData.department,
  hasSkills: formData.skills.length > 0
});
```

**検索・フィルターロギング**
```typescript
searchLogger.logSearch(newQuery, {
  hasFilters: !!(departmentFilter || statusFilter),
  totalEmployees: employees.length
});
```

**エクスポートロギング**
```typescript
await exportLogger.logExportRequest(exportRequest, {
  totalEmployees: employees.length,
  filteredCount: filteredAndSortedEmployees.length
});
```

**バリデーションエラー追跡**
```typescript
crudLogger.logValidationError(newErrors, {
  mode: mode,
  employeeId: employee?.id
});
```

2. **社員管理**
   ```tsx
   // features/employeeRegister/hooks/useEmployeeLogger.ts
   // EmployeeRegister.tsx, EnhancedEmployeeList.tsx 更新
   ```

### ✅ フェーズ4: 業務機能ログ統合（完了）

#### 🎯 勤怠管理・備品管理・経費管理機能への包括的ロギング実装

**✅ `src/features/timecard/hooks/useTimecardForm.ts` (完了)**
- 勤怠登録（出勤・退勤・休暇）の包括的ロギング
- 勤怠更新・削除操作の詳細追跡
- 休暇申請プロセスの記録
- 集計処理とレポート生成の監視

**✅ `src/features/timecard/TimecardForm.tsx` (完了)**
- 勤怠登録フォームへのロギング統合
- フォーム送信の成功・失敗追跡
- バリデーションエラーの記録

**✅ `src/features/timecard/TimecardList.tsx` (完了)**
- 勤怠履歴の編集・削除操作にロギング統合
- ユーザー操作の詳細記録

**✅ `src/features/equipment/hooks/useEquipmentForm.ts` (完了)**
- 備品登録・更新・削除のCRUD操作ロギング
- 在庫調整の詳細追跡（理由、数量変更）
- 備品検索機能の利用状況記録
- 低在庫アラートの監視

**✅ `src/features/equipment/EnhancedEquipmentList.tsx` (完了)**
- 備品管理画面へのロギング統合
- 在庫調整操作の詳細記録
- 削除操作の安全性向上

**✅ `src/features/equipment/StockAdjustmentDialog.tsx` (完了)**
- 在庫調整ダイアログに理由フィールド追加
- 調整操作の詳細情報記録

**✅ `src/features/expense/hooks/useExpenseForm.ts` (完了)**
- 経費登録・更新の包括的ロギング
- ステータス管理（承認フロー）の詳細追跡
- 領収書アップロード機能の監視
- 経費検索・フィルター機能の利用記録
- レポート生成の詳細監視

#### 🔧 実装された機能パターン

**勤怠管理ロギング**
```typescript
await crudLogger.logCreate('timecard_entry', newEntry, {
  type: entryData.isAbsence ? 'absence' : 'attendance',
  date: entryData.date,
  workHours: calculateWorkHours(entryData.startTime, entryData.endTime)
});
```

**備品管理ロギング**
```typescript
await crudLogger.logUpdate('equipment_stock', equipment.id, {
  quantity: equipment.quantity + delta
}, {
  adjustmentType: delta > 0 ? 'increase' : 'decrease',
  delta: Math.abs(delta),
  reason: reason
});
```

**経費管理ロギング**
```typescript
await crudLogger.logUpdate('expense_status', expense.id, {
  status: newStatus
}, {
  statusFlow: `${expense.status} → ${newStatus}`,
  amount: expense.amount,
  isApproval: newStatus === 'approved'
});
```

**レポート生成ロギング**
```typescript
await exportLogger.logExportRequest(exportRequest, {
  totalExpenses: expenses.length,
  totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
  format: format
});
```

### フェーズ5: 統合・最適化（3日）
1. **パフォーマンス分析**
2. **ログ集計・監視設定**
3. **ドキュメント更新**

## 🔧 技術的実装詳細

### 1. 共通フック設計

#### useFeatureLogger
```tsx
export const useFeatureLogger = (featureName: string, options?: {
  enablePerformanceLogging?: boolean;
  enableUserTracking?: boolean;
  enableErrorTracking?: boolean;
}) => {
  const log = useComponentLogger(featureName);
  const actionLogger = useActionLogger();
  const perfLogger = usePerformanceLogger();

  return {
    logFeatureAccess: (context?) => {},
    logUserAction: (action, data?, context?) => {},
    logPerformance: (operation, fn, context?) => {},
    logError: (error, context?) => {},
    logDataOperation: (operation, entityType, entityId?, context?) => {}
  };
};
```

#### useCRUDLogger
```tsx
export const useCRUDLogger = (entityType: string) => {
  const featureLogger = useFeatureLogger(`${entityType}CRUD`);

  return {
    logCreate: (entityData, context?) => {},
    logRead: (query, resultCount?, context?) => {},
    logUpdate: (entityId, changes, context?) => {},
    logDelete: (entityId, context?) => {},
    logBulkOperation: (operation, count, context?) => {}
  };
};
```

### 2. ログイベント標準化

#### 認証イベント
```tsx
interface AuthLogEvents {
  'auth.login.attempt': { email: string; method: 'email' | 'google' };
  'auth.login.success': { userId: string; method: string };
  'auth.login.failure': { email: string; reason: string };
  'auth.logout': { userId: string; sessionDuration: number };
  'auth.register.attempt': { email: string };
  'auth.register.success': { userId: string };
  'auth.mfa.setup': { userId: string; method: string };
  'auth.passkey.register': { userId: string; deviceType: string };
}
```

#### データ操作イベント
```tsx
interface DataLogEvents {
  'team.create': { teamId: string; memberCount: number };
  'team.update': { teamId: string; changes: string[] };
  'team.delete': { teamId: string };
  'team.search': { query: string; resultCount: number };
  
  'employee.create': { employeeId: string; department: string };
  'employee.update': { employeeId: string; changes: string[] };
  'employee.status_change': { employeeId: string; from: string; to: string };
  
  'timecard.punch_in': { employeeId: string; timestamp: string };
  'timecard.punch_out': { employeeId: string; duration: number };
  'timecard.vacation_request': { employeeId: string; type: string; days: number };
}
```

### 3. パフォーマンス監視

#### 重要操作の計測
```tsx
// 検索性能
const logSearchPerformance = async (searchFn, query) => {
  const timer = perfLogger.startTimer('search_operation');
  try {
    const results = await searchFn(query);
    timer.end({
      query,
      resultCount: results.length,
      queryComplexity: calculateComplexity(query)
    });
    return results;
  } catch (error) {
    timer.end({ query, error: error.message, success: false });
    throw error;
  }
};

// データ操作性能
const logDataOperationPerformance = async (operation, fn, context) => {
  const timer = perfLogger.startTimer(`data_${operation}`);
  try {
    const result = await fn();
    timer.end({ operation, success: true, ...context });
    return result;
  } catch (error) {
    timer.end({ operation, success: false, error: error.message, ...context });
    throw error;
  }
};
```

## 📊 ログ分析・監視

### 1. 重要メトリクス

#### ユーザー行動分析
- 機能別アクセス頻度
- 操作完了率
- エラー発生率
- セッション時間

#### パフォーマンス分析
- API レスポンス時間
- 検索クエリ性能
- データ操作時間
- UI レンダリング時間

#### セキュリティ監視
- ログイン試行パターン
- 失敗ログイン頻度
- 異常なアクセスパターン
- MFA 使用状況

### 2. ダッシュボード設計

#### 開発者向けダッシュボード
```tsx
// components/LoggingDashboard.tsx
const LoggingDashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <MetricsCard title="API パフォーマンス" />
      </Grid>
      <Grid item xs={12} md={6}>
        <MetricsCard title="エラー率" />
      </Grid>
      <Grid item xs={12}>
        <UserActivityChart />
      </Grid>
      <Grid item xs={12}>
        <FeatureUsageTable />
      </Grid>
    </Grid>
  );
};
```

## 🛡️ プライバシー・セキュリティ

### 1. PII マスキング拡張

#### カスタムマスキングルール
```tsx
const extendedPIIMasks = {
  // 社員ID: 部分表示
  employeeId: (id: string) => `${id.slice(0, 3)}***`,
  
  // 部署情報: 一般化
  department: (dept: string) => dept.includes('人事') ? '[HR部門]' : dept,
  
  // 金額情報: 範囲表示
  amount: (amount: number) => {
    if (amount < 10000) return '< 1万円';
    if (amount < 100000) return '1-10万円';
    return '> 10万円';
  }
};
```

### 2. ログレベル制御

#### 環境別設定
```tsx
const getLoggingConfig = () => {
  if (import.meta.env.PROD) {
    return {
      enabledLevels: ['warn', 'error', 'fatal'],
      enablePIILogging: false,
      enablePerformanceLogging: true,
      maxRetentionDays: 30
    };
  }
  
  return {
    enabledLevels: ['debug', 'info', 'warn', 'error', 'fatal'],
    enablePIILogging: true,
    enablePerformanceLogging: true,
    maxRetentionDays: 7
  };
};
```

## 📋 実装チェックリスト

### ✅ フェーズ1: 基盤整備
- [x] `useFeatureLogger` フック作成
- [x] `useCRUDLogger` フック作成
- [x] `useSearchLogger` フック作成
- [x] `useExportLogger` フック作成
- [x] 拡張PIIマスキングルール
- [x] 環境別設定ファイル
- [x] ログイベント型定義

### ✅ フェーズ2: 認証機能
- [x] `useAuthLogger` 作成
- [x] LoginFormログ追加
- [x] RegisterFormログ追加
- [x] MFAログ追加
- [x] Passkeyログ追加
- [x] セキュリティイベント監視

### ✅ フェーズ3: データ管理機能
- [x] TeamManagementログ追加
- [x] EmployeeRegisterログ追加
- [x] 検索性能監視
- [x] CRUD操作追跡
- [x] エクスポート機能ログ

### ✅ フェーズ4: 業務機能
- [x] Timecardログ追加
- [x] Equipmentログ追加
- [x] Expenseログ追加
- [x] 業務フロー追跡
- [x] レポート生成監視

### ✅ フェーズ5: 統合・最適化
- [ ] ダッシュボード作成
- [ ] パフォーマンス分析
- [ ] ログ集計機能
- [ ] アラート設定
- [ ] ドキュメント更新

## 🔄 継続的改善

### 1. 定期レビュー
- 週次: ログ品質チェック
- 月次: パフォーマンス分析
- 四半期: 機能改善提案

### 2. 自動化
- ログローテーション
- 異常検知アラート
- パフォーマンス レポート自動生成

この計画により、全機能に統一されたロギング処理を段階的に実装し、アプリケーションの監視・改善・デバッグ能力を大幅に向上させることができます。
