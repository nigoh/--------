/**
 * Authentication Store (Zustand)
 * 認証状態を管理するZustandストア
 */

import { create } from 'zustand';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/authTypes';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout,
  sendPasswordReset,
  resendEmailVerification,
  observeAuthState,
  getCurrentUser
} from '../services/authService';

interface AuthActions {
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  loginWithSocial: (provider: 'google') => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Password and email actions
  sendPasswordReset: (email: string) => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
  
  // State management
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setMfaRequired: (required: boolean) => void;
  setEmailVerificationSent: (sent: boolean) => void;
  
  // Initialization
  initialize: () => void;
  reset: () => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  mfaRequired: false,
  emailVerificationSent: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  // Authentication actions
  login: async (credentials: LoginCredentials): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const user = await loginWithEmail(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false,
        mfaRequired: false 
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || '予期しないエラーが発生しました';
      set({ error: errorMessage, loading: false });
      
      // MFA required の場合の特別処理
      if (error.code === 'auth/multi-factor-auth-required') {
        set({ mfaRequired: true });
      }
      
      return false;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const user = await registerWithEmail(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false,
        emailVerificationSent: true 
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || '予期しないエラーが発生しました';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  loginWithSocial: async (provider: 'google'): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      let user: User;
      
      switch (provider) {
        case 'google':
          user = await loginWithGoogle();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || '予期しないエラーが発生しました';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  logout: async (): Promise<void> => {
    set({ loading: true });
    
    try {
      await logout();
      set({
        ...initialState,
        loading: false
      });
    } catch (error: any) {
      // ログアウトエラーでも状態はクリア
      set({
        ...initialState,
        loading: false,
        error: error.message || 'ログアウトに失敗しました'
      });
    }
  },

  sendPasswordReset: async (email: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await sendPasswordReset(email);
      set({ loading: false });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'パスワードリセットメールの送信に失敗しました';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  resendEmailVerification: async (): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await resendEmailVerification();
      set({ 
        loading: false,
        emailVerificationSent: true 
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'メール確認の再送信に失敗しました';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // State management
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setMfaRequired: (mfaRequired: boolean) => {
    set({ mfaRequired });
  },

  setEmailVerificationSent: (emailVerificationSent: boolean) => {
    set({ emailVerificationSent });
  },

  // Initialization
  initialize: () => {
    // 現在のユーザー状態を確認
    const currentUser = getCurrentUser();
    if (currentUser) {
      set({ 
        user: currentUser, 
        isAuthenticated: true 
      });
    }

    // 認証状態の監視を開始
    observeAuthState((user) => {
      get().setUser(user);
    });
  },

  reset: () => {
    set(initialState);
  },
}));