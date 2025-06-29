/**
 * 経費管理機能のエクスポートインデックス（Zustand統一後）
 * 
 * Zustandストア、カスタムフック、コンポーネントを統一的にエクスポート
 */

// メインコンポーネント
export { default as Expense } from './Expense';
export { ExpenseRegister } from './ExpenseRegister';
export { EnhancedExpenseList } from './EnhancedExpenseList';
export { ExpenseModal } from './ExpenseModal';
export { ExpenseForm } from './ExpenseForm';
export { ReceiptUpload } from './ReceiptUpload';
export { StatusManager } from './StatusManager';

// UIコンポーネント
export { ExpenseListHeader } from './components/ExpenseListHeader';
export { ExpenseFilters } from './components/ExpenseFilters';

// Zustandストア（統一）
export { useExpenseStore } from './useExpenseStore';
export { useExpenseFormStore } from './stores/useExpenseFormStore';

// Zustandカスタムフック（推奨）
export { useExpenseForm, useExpenseList } from './hooks/useExpenseForm';

// レガシーカスタムフック（後で削除予定）
export { useExpenseListFilter } from './hooks/useExpenseListFilter';
export { useExpenseListActions } from './hooks/useExpenseListActions';

// 型定義
export type {
  ExpenseEntry,
  ExpenseState,
  ExpenseActions,
  ExpenseStore,
  ExpenseStatus,
  ExpenseReceipt,
} from './useExpenseStore';

export type {
  ExpenseFormData,
  ExpenseFormErrors,
  ExpenseFormState,
  ExpenseFormActions,
  ExpenseFormStore
} from './stores/useExpenseFormStore';

// 定数
export {
  EXPENSE_CATEGORIES,
  STATUS_CONFIG,
  PAGINATION_OPTIONS,
  DEFAULT_PAGE_SIZE,
  CSV_HEADERS,
  VALIDATION_MESSAGES,
  AMOUNT_LIMITS,
  TEXT_LIMITS,
} from './constants/expenseConstants';
export type { ExpenseCategory } from './constants/expenseConstants';

// レガシー型定義（後で削除予定）
export type { 
  SortField, 
  SortDirection, 
  SortConfig, 
  ExpenseFilters as ExpenseFiltersType 
} from './hooks/useExpenseListFilter';
