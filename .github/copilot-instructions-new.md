<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ワークアプリケーション開発ガイド

React + TypeScript + Viteで作成された**業務支援アプリケーション**です。社員管理機能をリファレンス実装として、統一されたアーキテクチャで機能開発を行います。

## ディレクトリ構造（必須）

```txt
src/features/{機能名}/
├── {機能名}.tsx                    # メインページ
├── Enhanced{機能名}List.tsx        # 一覧（検索・フィルタ・ソート）
├── components/                     # UIコンポーネント
│   ├── {機能名}Dialogs.tsx         # CRUD用モーダル
│   ├── {機能名}FilterDialog.tsx    # フィルタ設定
│   ├── {機能名}Filters.tsx         # フィルタ表示
│   ├── {機能名}ListTable.tsx       # データテーブル
│   └── SearchField.tsx             # 検索フィールド
├── hooks/                          # ビジネスロジック
│   └── use{機能名}Form.ts          # フォーム管理
├── stores/                         # Zustand状態管理
│   ├── use{機能名}Store.ts         # メインデータ
│   └── use{機能名}FormStore.ts     # フォーム状態
├── constants/                      # 定数・マスタデータ
│   └── {機能名}Constants.ts        
└── index.ts                        # エクスポート統一
```

**技術スタック**: React 19 + TypeScript 5 + Vite 6 + MUI v6 + Zustand 5

## 実装必須要件

### 1. Zustand状態管理（統一必須）

```typescript
// 状態とアクションの分離
export interface FeatureState {
  items: Feature[];
  loading: boolean;
  error: string | null;
}

export interface FeatureActions {
  addItem: (item: Feature) => void;
  updateItem: (id: string, item: Partial<Feature>) => void;
  deleteItem: (id: string) => void;
}

// 無限ループ防止
updateField: (field, value) => {
  const state = get();
  if (state.formData[field] === value) return;
  set((state) => ({ formData: { ...state.formData, [field]: value } }));
}
```

### 2. 必須機能セット

- **検索・フィルター・ソート**: 全カラム対応
- **CRUD操作**: モーダルベース、バリデーション付き
- **CSVエクスポート**: フィルター条件反映
- **レスポンシブ対応**: 320px〜対応
- **エラーハンドリング**: 楽観的更新、ロールバック対応

### 3. 定数管理システム

```typescript
// constants/{機能名}Constants.ts
export const OPTIONS = ['選択肢1', '選択肢2'] as const;
export type OptionType = typeof OPTIONS[number];

// 使用時
import { DEPARTMENTS, Department } from '../constants/employeeFormConstants';
```

### 4. useCallback必須

```typescript
const handleSave = useCallback(async () => {
  // 処理内容
}, [適切な依存配列]);
```

## 禁止事項

- ❌ **Zustand以外の状態管理**（React useStateとの混在禁止）
- ❌ **propsバケツリレー**での状態共有
- ❌ **100行超え**のコンポーネント
- ❌ **コンポーネント内**でのAPI直接呼び出し
- ❌ **重複定数定義**（各ファイルでの個別定義）
- ❌ **useCallbackなし**の重い処理
- ❌ **MUI v6非対応**のProps使用（PaperProps等）

## 推奨パターン

### コンポーネント分離

```typescript
const FeatureManager = () => (
  <FeatureLayout>
    <FeatureHeader />    {/* ヘッダーのみ */}
    <FeatureFilters />   {/* フィルターのみ */}
    <FeatureList />      {/* 一覧のみ */}
    <FeatureModals />    {/* モーダルのみ */}
  </FeatureLayout>
);
```

### エラーハンドリング

```typescript
const handleSave = useCallback(async () => {
  try {
    setSubmitting(true);
    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }
    await saveData();
    toast.success('保存しました');
  } catch (error) {
    toast.error('保存に失敗しました');
  } finally {
    setSubmitting(false);
  }
}, [validateForm, saveData]);
```

### MUI v6 対応

```typescript
// ✅ 推奨
<TextField slotProps={{ input: { startAdornment: <SearchIcon /> } }} />

// ❌ 非推奨
<TextField InputProps={{ startAdornment: <SearchIcon /> }} />
```

## 品質チェックリスト

新機能実装完了時の確認項目：

### 📋 必須チェック

- [ ] 社員管理機能と同じディレクトリ構造
- [ ] Zustandストア（メイン + フォーム）による状態管理
- [ ] 検索・フィルター・ソート機能完備
- [ ] CRUD操作の完全実装（モーダル）
- [ ] CSVエクスポート機能
- [ ] レスポンシブ対応（320px〜）
- [ ] エラーハンドリング（楽観的更新）
- [ ] useCallbackによる最適化
- [ ] 定数の一元管理（constantsフォルダー）
- [ ] MUI v6対応（slotProps使用）
- [ ] TypeScript型定義完備
- [ ] 100行以内のコンポーネント分割

## リファレンス

### 🔗 必須参照ファイル

- `src/features/employeeRegister/` - 全体アーキテクチャ
- `src/features/employeeRegister/useEmployeeStore.ts` - Zustandパターン
- `src/features/employeeRegister/hooks/useEmployeeForm.ts` - フォーム管理
- `src/features/employeeRegister/components/EmployeeDialogs.tsx` - CRUD UI
- `src/features/employeeRegister/EnhancedEmployeeList.tsx` - 一覧機能
- `src/features/employeeRegister/constants/employeeFormConstants.ts` - 定数管理

**このリファレンス実装に従うことで、一貫性のある高品質な機能を効率的に開発できます。**
