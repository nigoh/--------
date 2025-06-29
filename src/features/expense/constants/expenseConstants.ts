/**
 * 経費管理機能の定数定義
 * 
 * カテゴリ、ステータス、その他の設定値を一元管理
 */

/**
 * 経費カテゴリの選択肢
 */
export const EXPENSE_CATEGORIES = [
  '交通費',
  '宿泊費',
  '飲食費',
  '書籍・研修費',
  '通信費',
  '事務用品',
  '会議費',
  '接待費',
  'その他',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

/**
 * 経費ステータスの表示設定
 */
export const STATUS_CONFIG = {
  pending: { label: '申請中', color: 'warning' as const },
  approved: { label: '承認済み', color: 'success' as const },
  rejected: { label: '却下', color: 'error' as const },
  settled: { label: '清算済み', color: 'info' as const },
} as const;

/**
 * ページネーションの設定
 */
export const PAGINATION_OPTIONS = [5, 10, 25, 50] as const;

/**
 * デフォルトのページサイズ
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * CSVエクスポート用のヘッダー
 */
export const CSV_HEADERS = {
  date: '日付',
  category: 'カテゴリ',
  amount: '金額',
  note: '備考',
  status: 'ステータス',
  submittedDate: '申請日',
  approvedDate: '承認日',
  settledDate: '清算日',
} as const;

/**
 * フォームバリデーションのメッセージ
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_DATE: '日付は必須です',
  REQUIRED_CATEGORY: 'カテゴリは必須です',
  REQUIRED_AMOUNT: '金額は必須です',
  INVALID_AMOUNT: '金額は正の数値を入力してください',
  AMOUNT_TOO_LARGE: '金額が大きすぎます（上限: 1,000,000円）',
  NOTE_TOO_LONG: '備考は500文字以内で入力してください',
} as const;

/**
 * 金額の制限
 */
export const AMOUNT_LIMITS = {
  MIN: 1,
  MAX: 1000000,
} as const;

/**
 * テキストフィールドの制限
 */
export const TEXT_LIMITS = {
  NOTE_MAX_LENGTH: 500,
} as const;
