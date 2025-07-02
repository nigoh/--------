/**
 * 権限管理用Zustandストア
 */
import { create } from 'zustand';
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { Permission, UserRole } from '../../../auth/types/roles';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/roleManagementConstants';

// ユーザー型定義
export interface UserWithPermissions {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  roles: UserRole[];
  permissions: Permission[];
  department?: string;
  position?: string;
  lastLogin?: Date;
  createdAt: Date;
}

// フィルター型定義
export interface UserFilters {
  searchQuery?: string;
  roleFilter?: UserRole | 'all';
  departmentFilter?: string | 'all';
  lastLoginDays?: number;
}

// ソート設定型定義
export interface SortConfig {
  field: keyof UserWithPermissions;
  direction: 'asc' | 'desc';
}

// ストア状態型定義
interface RoleManagementState {
  // データ
  users: UserWithPermissions[];
  
  // UIの状態
  loading: boolean;
  error: string | null;
  
  // ページネーション
  page: number;
  pageSize: number;
  totalPages: number;
  totalUsers: number;
  
  // フィルタリングとソート
  filters: UserFilters;
  sortConfig: SortConfig;
  
  // アクション
  loadUsers: (page?: number, filters?: UserFilters, sort?: SortConfig) => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: UserFilters) => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  updateUsers: (updaterFn: (users: UserWithPermissions[]) => UserWithPermissions[]) => void;
  setError: (error: string | null) => void;
}

export const useRoleManagementStore = create<RoleManagementState>((set, get) => ({
  // 初期状態
  users: [],
  loading: false,
  error: null,
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  totalPages: 1,
  totalUsers: 0,
  filters: {
    searchQuery: '',
    roleFilter: 'all',
    departmentFilter: 'all',
  },
  sortConfig: {
    field: 'displayName',
    direction: 'asc',
  },
  
  // ユーザーデータを読み込む
  loadUsers: async (page = 1, filters, sort) => {
    set({ loading: true, error: null });
    
    const currentFilters = filters || get().filters;
    const currentSort = sort || get().sortConfig;
    const pageSize = get().pageSize;
    
    try {
      const db = getFirestore();
      let usersQuery = query(
        collection(db, 'users'),
        orderBy(currentSort.field as string, currentSort.direction),
        limit(pageSize)
      );
      
      // フィルターの適用
      if (currentFilters.roleFilter && currentFilters.roleFilter !== 'all') {
        usersQuery = query(usersQuery, where('roles', 'array-contains', currentFilters.roleFilter));
      }
      
      if (currentFilters.departmentFilter && currentFilters.departmentFilter !== 'all') {
        usersQuery = query(usersQuery, where('department', '==', currentFilters.departmentFilter));
      }
      
      // 最終ログイン日フィルター（クライアント側でフィルタリングする方がよいかも）
      // ...
      
      // ページネーション
      if (page > 1) {
        // 実際の実装では、前のページの最後のドキュメントを取得する必要がある
        // ここでは簡易的な実装
      }
      
      const querySnapshot = await getDocs(usersQuery);
      const userList: UserWithPermissions[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserWithPermissions;
        
        // 検索クエリのフィルタリング（クライアント側）
        if (
          currentFilters.searchQuery && 
          !matchesSearchQuery(userData, currentFilters.searchQuery)
        ) {
          return;
        }
        
        userList.push({
          ...userData,
          uid: doc.id,
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin as any) : undefined,
          createdAt: new Date(userData.createdAt as any)
        });
      });
      
      // 総ページ数の取得（実際の実装では、サーバーサイドでのページネーション処理が必要）
      const countSnapshot = await getDocs(collection(db, 'users'));
      const totalDocs = countSnapshot.size;
      
      set({ 
        users: userList,
        page,
        filters: currentFilters,
        sortConfig: currentSort,
        totalUsers: totalDocs,
        totalPages: Math.ceil(totalDocs / pageSize)
      });
    } catch (err) {
      console.error('ユーザー一覧取得エラー:', err);
      set({ error: 'ユーザー情報の読み込み中にエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },
  
  // ページを設定
  setPage: (page) => {
    if (page !== get().page) {
      set({ page });
      get().loadUsers(page);
    }
  },
  
  // フィルターを設定
  setFilters: (filters) => {
    set({ filters });
    get().loadUsers(1, filters); // フィルター変更時は1ページ目に戻る
  },
  
  // ソート設定を更新
  setSortConfig: (sortConfig) => {
    set({ sortConfig });
    get().loadUsers(get().page, undefined, sortConfig);
  },
  
  // ユーザー一覧を更新
  updateUsers: (updaterFn) => {
    set(state => ({
      users: updaterFn(state.users)
    }));
  },
  
  // エラーを設定
  setError: (error) => set({ error }),
}));

// 検索クエリに一致するかチェック
function matchesSearchQuery(user: UserWithPermissions, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    user.email.toLowerCase().includes(lowerQuery) ||
    (!!user.displayName && user.displayName.toLowerCase().includes(lowerQuery))
  );
}
