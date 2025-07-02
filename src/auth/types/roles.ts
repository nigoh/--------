/**
 * 権限管理システムの型定義
 * ロールとパーミッションの基本定義
 */

/**
 * ユーザーロール定義
 * システム内のユーザー権限レベルを表す
 */
export enum UserRole {
  ADMIN = 'admin',         // 管理者：すべての機能にアクセス可能
  MANAGER = 'manager',     // 管理職：部門・チームの管理機能にアクセス可能
  EMPLOYEE = 'employee',   // 一般社員：基本機能にアクセス可能
  GUEST = 'guest'          // ゲスト：限定的な閲覧のみ可能
}

/**
 * パーミッション（権限）定義
 * 特定の機能やリソースに対するアクセス権を表す
 */
export enum Permission {
  // 従業員管理関連
  EMPLOYEE_VIEW = 'employee:view',          // 従業員情報閲覧
  EMPLOYEE_CREATE = 'employee:create',      // 従業員情報作成
  EMPLOYEE_EDIT = 'employee:edit',          // 従業員情報編集
  EMPLOYEE_DELETE = 'employee:delete',      // 従業員情報削除

  // タイムカード関連
  TIMECARD_VIEW = 'timecard:view',          // タイムカード閲覧（自分のみ）
  TIMECARD_EDIT = 'timecard:edit',          // タイムカード編集（自分のみ）
  TIMECARD_VIEW_ALL = 'timecard:view:all',  // 全員のタイムカード閲覧
  TIMECARD_EDIT_ALL = 'timecard:edit:all',  // 全員のタイムカード編集

  // チーム管理関連
  TEAM_VIEW = 'team:view',                  // チーム情報閲覧
  TEAM_CREATE = 'team:create',              // チーム作成
  TEAM_EDIT = 'team:edit',                  // チーム編集
  TEAM_DELETE = 'team:delete',              // チーム削除

  // 経費精算関連
  EXPENSE_VIEW = 'expense:view',            // 経費閲覧（自分のみ）
  EXPENSE_CREATE = 'expense:create',        // 経費申請
  EXPENSE_EDIT = 'expense:edit',            // 経費編集（自分のみ）
  EXPENSE_DELETE = 'expense:delete',        // 経費削除（自分のみ）
  EXPENSE_APPROVE = 'expense:approve',      // 経費承認
  EXPENSE_VIEW_ALL = 'expense:view:all',    // 全員の経費閲覧
  EXPENSE_EDIT_ALL = 'expense:edit:all',    // 全員の経費編集

  // 機器管理関連
  EQUIPMENT_VIEW = 'equipment:view',        // 機器情報閲覧
  EQUIPMENT_CREATE = 'equipment:create',    // 機器情報作成
  EQUIPMENT_EDIT = 'equipment:edit',        // 機器情報編集
  EQUIPMENT_DELETE = 'equipment:delete',    // 機器情報削除
  EQUIPMENT_ASSIGN = 'equipment:assign',    // 機器割り当て

  // 会議室予約関連
  MEETING_VIEW = 'meeting:view',            // 会議室予約閲覧
  MEETING_CREATE = 'meeting:create',        // 会議室予約作成
  MEETING_EDIT = 'meeting:edit',            // 会議室予約編集（自分のみ）
  MEETING_DELETE = 'meeting:delete',        // 会議室予約削除（自分のみ）
  MEETING_EDIT_ALL = 'meeting:edit:all',    // 全員の会議室予約編集
  MEETING_DELETE_ALL = 'meeting:delete:all',// 全員の会議室予約削除

  // システム管理関連
  SYSTEM_SETTINGS = 'system:settings',      // システム設定
  USER_MANAGEMENT = 'user:management',      // ユーザー管理
  ROLE_MANAGEMENT = 'role:management',      // 役割管理
}

/**
 * 各ロールのデフォルトパーミッション
 * ロールに応じたデフォルトの権限セットを定義
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // 管理者は全ての権限を持つ
    ...Object.values(Permission)
  ],
  
  [UserRole.MANAGER]: [
    // 従業員管理
    Permission.EMPLOYEE_VIEW,
    Permission.EMPLOYEE_EDIT,
    
    // タイムカード
    Permission.TIMECARD_VIEW,
    Permission.TIMECARD_EDIT,
    Permission.TIMECARD_VIEW_ALL,
    Permission.TIMECARD_EDIT_ALL,
    
    // チーム管理
    Permission.TEAM_VIEW,
    Permission.TEAM_CREATE,
    Permission.TEAM_EDIT,
    
    // 経費精算
    Permission.EXPENSE_VIEW,
    Permission.EXPENSE_CREATE,
    Permission.EXPENSE_EDIT,
    Permission.EXPENSE_DELETE,
    Permission.EXPENSE_APPROVE,
    Permission.EXPENSE_VIEW_ALL,
    
    // 機器管理
    Permission.EQUIPMENT_VIEW,
    Permission.EQUIPMENT_ASSIGN,
    
    // 会議室予約
    Permission.MEETING_VIEW,
    Permission.MEETING_CREATE,
    Permission.MEETING_EDIT,
    Permission.MEETING_DELETE,
    Permission.MEETING_EDIT_ALL,
    Permission.MEETING_DELETE_ALL,
  ],
  
  [UserRole.EMPLOYEE]: [
    // 従業員管理
    Permission.EMPLOYEE_VIEW,
    
    // タイムカード
    Permission.TIMECARD_VIEW,
    Permission.TIMECARD_EDIT,
    
    // チーム管理
    Permission.TEAM_VIEW,
    
    // 経費精算
    Permission.EXPENSE_VIEW,
    Permission.EXPENSE_CREATE,
    Permission.EXPENSE_EDIT,
    Permission.EXPENSE_DELETE,
    
    // 機器管理
    Permission.EQUIPMENT_VIEW,
    
    // 会議室予約
    Permission.MEETING_VIEW,
    Permission.MEETING_CREATE,
    Permission.MEETING_EDIT,
    Permission.MEETING_DELETE,
  ],
  
  [UserRole.GUEST]: [
    // 最小限の閲覧権限のみ
    Permission.EMPLOYEE_VIEW,
    Permission.TEAM_VIEW,
    Permission.MEETING_VIEW,
    Permission.EQUIPMENT_VIEW,
  ]
};

/**
 * ユーザーの権限情報を格納する拡張型
 */
export interface UserPermissionData {
  uid: string;
  roles: UserRole[];
  permissions: Permission[];
  department?: string;
  position?: string;
}
