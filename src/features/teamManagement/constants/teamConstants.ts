// チーム管理機能の定数定義

// チームロール選択肢
export const TEAM_ROLES = [
  'リーダー',
  'サブリーダー',
  'メンバー',
  'アドバイザー',
] as const;

export type TeamRole = typeof TEAM_ROLES[number];

// チームステータス
export const TEAM_STATUS = [
  'アクティブ',
  '休止中',
  '完了',
] as const;

export type TeamStatus = typeof TEAM_STATUS[number];

// チームタイプ
export const TEAM_TYPES = [
  'プロジェクトチーム',
  '常設チーム',
  'タスクフォース',
  '委員会',
] as const;

export type TeamType = typeof TEAM_TYPES[number];

// メンバーソース
export const MEMBER_SOURCES = [
  'employee', // 社員名簿から
  'manual',   // 手動追加
] as const;

export type MemberSource = typeof MEMBER_SOURCES[number];

// フィルター選択肢
export const FILTER_OPTIONS = {
  status: TEAM_STATUS,
  type: TEAM_TYPES,
} as const;

// テーブルカラム定義
export const TABLE_COLUMNS = [
  { id: 'name', label: 'チーム名', sortable: true },
  { id: 'type', label: 'タイプ', sortable: true },
  { id: 'status', label: 'ステータス', sortable: true },
  { id: 'memberCount', label: 'メンバー数', sortable: true },
  { id: 'createdAt', label: '作成日', sortable: true },
  { id: 'actions', label: '操作', sortable: false },
] as const;

export type TableColumn = typeof TABLE_COLUMNS[number];
