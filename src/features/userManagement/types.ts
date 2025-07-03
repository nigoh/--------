/**
 * ユーザー管理機能の型定義
 */
import { UserRole, Permission } from '../../auth';

// 統合ユーザー型定義
export interface User {
  uid: string;                    // Firebase Auth UID
  email: string;                  // メールアドレス
  displayName: string;            // 表示名
  photoURL?: string;              // プロフィール画像
  
  // 基本社員情報
  employeeId: string;             // 社員番号
  name: string;                   // 氏名
  nameKana?: string;              // 氏名カナ
  department: string;             // 部署
  position: string;               // 役職
  phone?: string;                 // 電話番号
  joinDate: string;               // 入社日
  skills: string[];               // スキル
  notes?: string;                 // 備考
  
  // 権限情報
  roles: UserRole[];              // ロール
  permissions: Permission[];       // 権限
  isActive: boolean;              // アクティブ状態
  
  // システム情報
  lastLogin?: Date;               // 最終ログイン
  createdAt: Date;                // 作成日時
  updatedAt: Date;                // 更新日時
  createdBy?: string;             // 作成者
  updatedBy?: string;             // 更新者
}

// ユーザー作成用の型
export type CreateUserInput = Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'lastLogin'>;

// ユーザー更新用の型
export type UpdateUserInput = Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>;

// フィルター型定義
export interface UserFilters {
  searchQuery?: string;
  roleFilter?: UserRole | 'all';
  departmentFilter?: string | 'all';
  positionFilter?: string | 'all';
  skillFilter?: string | 'all';
  statusFilter?: 'active' | 'inactive' | 'all';
  lastLoginDays?: number;
}

// ソート設定型定義
export interface SortConfig {
  field: keyof User;
  direction: 'asc' | 'desc';
}

// ページネーション型定義
export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalPages: number;
  totalUsers: number;
}

// ユーザー一覧取得結果
export interface UserListResult {
  users: User[];
  pagination: PaginationConfig;
}

// Firebase ドキュメント形式
export interface UserDocument extends Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'lastLogin'> {
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  lastLogin?: FirebaseTimestamp;
}

// Firebase Timestamp 型
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// ユーザー統計情報
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<UserRole, number>;
  byDepartment: Record<string, number>;
  recentJoins: number; // 最近1ヶ月の新規入社
}
