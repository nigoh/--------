/**
 * 権限管理機能の定数
 */

// 部門データ
export const DEPARTMENTS = [
  { id: 'dev', name: '開発部' },
  { id: 'sales', name: '営業部' },
  { id: 'hr', name: '人事部' },
  { id: 'finance', name: '経理部' },
  { id: 'management', name: '経営企画部' }
] as const;

export type DepartmentId = typeof DEPARTMENTS[number]['id'];

// テーブル表示設定
export const TABLE_COLUMNS = [
  { id: 'user', label: 'ユーザー', sortable: true },
  { id: 'email', label: 'メールアドレス', sortable: true },
  { id: 'roles', label: 'ロール', sortable: false },
  { id: 'department', label: '部門', sortable: true },
  { id: 'position', label: '役職', sortable: true },
  { id: 'permissions', label: '権限', sortable: false },
  { id: 'actions', label: '操作', sortable: false },
] as const;

// ページングのデフォルト値
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// ソート方向
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type SortDirection = typeof SORT_DIRECTIONS[number];

// フィルターのデフォルト値
export const DEFAULT_FILTERS = {
  searchQuery: '',
  roles: [],
  departments: [],
  lastLoginDays: undefined,
};

// 権限カテゴリマッピング
export const PERMISSION_CATEGORIES: Record<string, string> = {
  'employee': '従業員管理',
  'timecard': 'タイムカード',
  'team': 'チーム管理',
  'expense': '経費精算',
  'equipment': '機器管理',
  'meeting': '会議室予約',
  'system': 'システム設定',
  'user': 'システム設定',
  'role': 'システム設定',
};

// 権限アクションマッピング
export const PERMISSION_ACTIONS: Record<string, string> = {
  'view': '閲覧',
  'create': '作成',
  'edit': '編集',
  'delete': '削除',
  'approve': '承認',
  'assign': '割り当て',
  'all': '全て',
  'settings': '設定',
  'management': '管理',
};
