/**
 * ユーザー管理機能 Zustand ストア
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  User, 
  CreateUserInput, 
  UpdateUserInput, 
  UserFilters, 
  SortConfig, 
  PaginationConfig,
  UserStats 
} from '../types';
import { UserRole } from '../../auth';
import {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateLastLogin,
  checkEmployeeIdExists,
  fetchUserStats,
  generateDummyUsers,
} from '../services/userService';

// ストア状態インターフェース
interface UserManagementState {
  // データ
  users: User[];
  selectedUser: User | null;
  stats: UserStats | null;
  
  // UI状態
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // フィルターとソート
  filters: UserFilters;
  sortConfig: SortConfig;
  pagination: PaginationConfig;
  
  // ダイアログ状態
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // アクション
  // データ取得
  loadUsers: (refresh?: boolean) => Promise<void>;
  loadUser: (uid: string) => Promise<void>;
  loadStats: () => Promise<void>;
  
  // CRUD操作
  createUser: (userData: CreateUserInput) => Promise<void>;
  updateUser: (uid: string, userData: UpdateUserInput) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  toggleUserStatus: (uid: string) => Promise<void>;
  
  // バリデーション
  checkEmployeeIdExists: (employeeId: string, excludeUid?: string) => Promise<boolean>;
  
  // UI制御
  setFilters: (filters: Partial<UserFilters>) => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // ダイアログ制御
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (user: User) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (user: User) => void;
  closeDeleteDialog: () => void;
  
  // ユーティリティ
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
  // 開発用
  generateDummyData: () => Promise<void>;
}

// 初期状態
const initialState = {
  users: [],
  selectedUser: null,
  stats: null,
  loading: false,
  saving: false,
  error: null,
  filters: {
    searchQuery: '',
    roleFilter: 'all' as const,
    departmentFilter: 'all',
    positionFilter: 'all',
    skillFilter: 'all',
    statusFilter: 'all' as const,
  },
  sortConfig: {
    field: 'name' as keyof User,
    direction: 'asc' as const,
  },
  pagination: {
    page: 1,
    pageSize: 20,
    totalPages: 1,
    totalUsers: 0,
  },
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
};

export const useUserManagementStore = create<UserManagementState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // ユーザー一覧を読み込み
      loadUsers: async (refresh = false) => {
        const state = get();
        if (state.loading && !refresh) return;
        
        set({ loading: true, error: null });
        
        try {
          const result = await fetchUsers(
            state.filters,
            state.sortConfig,
            state.pagination.page,
            state.pagination.pageSize
          );
          
          set({
            users: result.users,
            pagination: result.pagination,
            loading: false,
          });
        } catch (error) {
          console.error('ユーザー一覧読み込みエラー:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'ユーザー一覧の読み込みに失敗しました',
          });
        }
      },
      
      // 特定のユーザーを読み込み
      loadUser: async (uid: string) => {
        set({ loading: true, error: null });
        
        try {
          const user = await fetchUser(uid);
          set({
            selectedUser: user,
            loading: false,
          });
        } catch (error) {
          console.error('ユーザー読み込みエラー:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'ユーザー情報の読み込みに失敗しました',
          });
        }
      },
      
      // 統計情報を読み込み
      loadStats: async () => {
        try {
          const stats = await fetchUserStats();
          set({ stats });
        } catch (error) {
          console.error('統計情報読み込みエラー:', error);
        }
      },
      
      // ユーザーを作成
      createUser: async (userData: CreateUserInput) => {
        set({ saving: true, error: null });
        
        try {
          await createUser(userData);
          set({ saving: false, isAddDialogOpen: false });
          
          // 一覧を再読み込み
          await get().loadUsers(true);
          await get().loadStats();
        } catch (error) {
          console.error('ユーザー作成エラー:', error);
          set({
            saving: false,
            error: error instanceof Error ? error.message : 'ユーザーの作成に失敗しました',
          });
        }
      },
      
      // ユーザーを更新
      updateUser: async (uid: string, userData: UpdateUserInput) => {
        set({ saving: true, error: null });
        
        try {
          await updateUser(uid, userData);
          set({ saving: false, isEditDialogOpen: false, selectedUser: null });
          
          // 一覧を再読み込み
          await get().loadUsers(true);
          await get().loadStats();
        } catch (error) {
          console.error('ユーザー更新エラー:', error);
          set({
            saving: false,
            error: error instanceof Error ? error.message : 'ユーザー情報の更新に失敗しました',
          });
        }
      },
      
      // ユーザーを削除
      deleteUser: async (uid: string) => {
        set({ saving: true, error: null });
        
        try {
          await deleteUser(uid);
          set({ saving: false, isDeleteDialogOpen: false, selectedUser: null });
          
          // 一覧を再読み込み
          await get().loadUsers(true);
          await get().loadStats();
        } catch (error) {
          console.error('ユーザー削除エラー:', error);
          set({
            saving: false,
            error: error instanceof Error ? error.message : 'ユーザーの削除に失敗しました',
          });
        }
      },
      
      // ユーザーステータスを切り替え
      toggleUserStatus: async (uid: string) => {
        set({ saving: true, error: null });
        
        try {
          await toggleUserStatus(uid);
          set({ saving: false });
          
          // 一覧を再読み込み
          await get().loadUsers(true);
          await get().loadStats();
        } catch (error) {
          console.error('ユーザーステータス切り替えエラー:', error);
          set({
            saving: false,
            error: error instanceof Error ? error.message : 'ユーザーステータスの切り替えに失敗しました',
          });
        }
      },
      
      // 社員番号重複チェック
      checkEmployeeIdExists: async (employeeId: string, excludeUid?: string) => {
        try {
          return await checkEmployeeIdExists(employeeId, excludeUid);
        } catch (error) {
          console.error('社員番号重複チェックエラー:', error);
          return false;
        }
      },
      
      // フィルターを設定
      setFilters: (newFilters: Partial<UserFilters>) => {
        const currentFilters = get().filters;
        const filters = { ...currentFilters, ...newFilters };
        
        set({
          filters,
          pagination: { ...get().pagination, page: 1 }, // フィルター変更時は1ページ目に戻る
        });
        
        // フィルター変更時は自動で再読み込み
        get().loadUsers(true);
      },
      
      // ソート設定を変更
      setSortConfig: (sortConfig: SortConfig) => {
        set({ sortConfig });
        get().loadUsers(true);
      },
      
      // ページを設定
      setPage: (page: number) => {
        set({
          pagination: { ...get().pagination, page },
        });
        get().loadUsers(true);
      },
      
      // ページサイズを設定
      setPageSize: (pageSize: number) => {
        set({
          pagination: { ...get().pagination, pageSize, page: 1 },
        });
        get().loadUsers(true);
      },
      
      // ダイアログ制御
      openAddDialog: () => set({ isAddDialogOpen: true, error: null }),
      closeAddDialog: () => set({ isAddDialogOpen: false, error: null }),
      
      openEditDialog: (user: User) => set({
        isEditDialogOpen: true,
        selectedUser: user,
        error: null,
      }),
      closeEditDialog: () => set({
        isEditDialogOpen: false,
        selectedUser: null,
        error: null,
      }),
      
      openDeleteDialog: (user: User) => set({
        isDeleteDialogOpen: true,
        selectedUser: user,
        error: null,
      }),
      closeDeleteDialog: () => set({
        isDeleteDialogOpen: false,
        selectedUser: null,
        error: null,
      }),
      
      // エラー管理
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      
      // リセット
      reset: () => set(initialState),
      
      // 開発用ダミーデータ生成
      generateDummyData: async () => {
        if (process.env.NODE_ENV !== 'development') {
          console.warn('ダミーデータは開発環境でのみ生成可能です');
          return;
        }
        
        set({ loading: true });
        
        try {
          await generateDummyUsers();
          await get().loadUsers(true);
          await get().loadStats();
        } catch (error) {
          console.error('ダミーデータ生成エラー:', error);
          set({
            error: error instanceof Error ? error.message : 'ダミーデータの生成に失敗しました',
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'user-management-store',
    }
  )
);
