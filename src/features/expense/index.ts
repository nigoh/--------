/**
 * 経費管理機能のエクスポートインデックス（リファクタリング後）
 * 
 * 関心の分離後のコンポーネント、フック、定数を統一的にエクスポート
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

// カスタムフック
export { useExpenseListFilter } from './hooks/useExpenseListFilter';
export { useExpenseListActions } from './hooks/useExpenseListActions';

// ストア
export { useExpenseStore } from './useExpenseStore';
export type {
  ExpenseEntry,
  ExpenseState,
  ExpenseActions,
  ExpenseStore,
  ExpenseStatus,
  ExpenseReceipt,
} from './useExpenseStore';

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

// 型定義
export type { 
  SortField, 
  SortDirection, 
  SortConfig, 
  ExpenseFilters as ExpenseFiltersType 
} from './hooks/useExpenseListFilter';
