/**
 * 認証状態管理ストア
 * Zustandを使用した統一的な状態管理
 */
import { create } from 'zustand';
import type { AuthUser, AuthState, LoginMethod } from '../types';

// 認証状態の型定義
export interface AuthStoreState {
  // ユーザー情報
  user: AuthUser | null;
  authState: AuthState;
  isLoading: boolean;
  
  // ログイン履歴
  lastLoginMethod: LoginMethod | null;
  lastLoginTime: string | null;
  
  // セッション情報
  sessionExpiry: string | null;
  
  // MFA状態
  mfaRequired: boolean;
  mfaVerified: boolean;
  
  // エラー状態
  error: string | null;
}

// 認証アクションの型定義
export interface AuthStoreActions {
  // ユーザー操作
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  updateUserProfile: (profile: Partial<AuthUser>) => void;
  
  // 認証状態操作
  setAuthState: (state: AuthState) => void;
  setLoading: (loading: boolean) => void;
  
  // ログイン情報操作
  setLastLogin: (method: LoginMethod) => void;
  
  // セッション操作
  setSessionExpiry: (expiry: string | null) => void;
  checkSessionExpiry: () => boolean;
  
  // MFA操作
  setMfaRequired: (required: boolean) => void;
  setMfaVerified: (verified: boolean) => void;
  resetMfaState: () => void;
  
  // エラー操作
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // ストア初期化
  reset: () => void;
}

// 統合型
export type AuthStore = AuthStoreState & AuthStoreActions;

// 初期状態
const initialState: AuthStoreState = {
  user: null,
  authState: 'loading',
  isLoading: true,
  lastLoginMethod: null,
  lastLoginTime: null,
  sessionExpiry: null,
  mfaRequired: false,
  mfaVerified: false,
  error: null,
};

/**
 * 認証ストアの作成
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  // ユーザー設定
  setUser: (user) => {
    const state = get();
    if (state.user === user) return;
    
    set({
      user,
      authState: user ? 'authenticated' : 'unauthenticated',
      isLoading: false,
      error: null,
    });
  },

  clearUser: () => {
    set({
      user: null,
      authState: 'unauthenticated',
      isLoading: false,
      lastLoginMethod: null,
      lastLoginTime: null,
      sessionExpiry: null,
      mfaRequired: false,
      mfaVerified: false,
      error: null,
    });
  },

  updateUserProfile: (profile) => {
    const state = get();
    if (!state.user) return;
    
    set({
      user: { ...state.user, ...profile }
    });
  },

  // 認証状態設定
  setAuthState: (authState) => {
    const state = get();
    if (state.authState === authState) return;
    
    set({ authState });
  },

  setLoading: (isLoading) => {
    const state = get();
    if (state.isLoading === isLoading) return;
    
    set({ isLoading });
  },

  // ログイン情報設定
  setLastLogin: (method) => {
    set({
      lastLoginMethod: method,
      lastLoginTime: new Date().toISOString(),
    });
  },

  // セッション管理
  setSessionExpiry: (sessionExpiry) => {
    set({ sessionExpiry });
  },

  checkSessionExpiry: () => {
    const state = get();
    if (!state.sessionExpiry) return true;
    
    const now = new Date();
    const expiry = new Date(state.sessionExpiry);
    
    return now < expiry;
  },

  // MFA操作
  setMfaRequired: (mfaRequired) => {
    const state = get();
    if (state.mfaRequired === mfaRequired) return;
    
    set({ mfaRequired });
  },

  setMfaVerified: (mfaVerified) => {
    const state = get();
    if (state.mfaVerified === mfaVerified) return;
    
    set({ mfaVerified });
  },

  resetMfaState: () => {
    set({
      mfaRequired: false,
      mfaVerified: false,
    });
  },

  // エラー操作
  setError: (error) => {
    const state = get();
    if (state.error === error) return;
    
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // ストア初期化
  reset: () => {
    set(initialState);
  },
}));

/**
 * 認証状態のセレクター
 */
export const useAuthSelectors = () => {
  const store = useAuthStore();
  
  return {
    // 基本状態
    isAuthenticated: store.authState === 'authenticated',
    isLoading: store.isLoading,
    hasUser: !!store.user,
    
    // ユーザー情報
    userEmail: store.user?.email || null,
    userName: store.user?.displayName || null,
    userRole: store.user?.customClaims?.role || null,
    
    // セッション状態
    isSessionValid: store.checkSessionExpiry(),
    
    // MFA状態
    needsMfa: store.mfaRequired && !store.mfaVerified,
    
    // エラー状態
    hasError: !!store.error,
  };
};
