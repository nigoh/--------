/**
 * useAuth Hook
 * 認証機能のメインカスタムフック
 */

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { User, LoginCredentials, RegisterCredentials } from '../types/authTypes';

export interface UseAuthReturn {
  // State
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
  emailVerificationSent: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
  
  // Utilities
  clearError: () => void;
  isEmailVerified: boolean;
  requiresEmailVerification: boolean;
}

/**
 * 認証機能のメインフック
 */
export const useAuth = (): UseAuthReturn => {
  const {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    mfaRequired,
    emailVerificationSent,
    
    // Actions
    login,
    register,
    loginWithSocial,
    logout,
    sendPasswordReset,
    resendEmailVerification,
    clearError,
    initialize,
  } = useAuthStore();

  // 初期化処理
  useEffect(() => {
    initialize();
  }, [initialize]);

  // ユーティリティ計算
  const isEmailVerified = user?.emailVerified ?? false;
  const requiresEmailVerification = isAuthenticated && !isEmailVerified;

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    mfaRequired,
    emailVerificationSent,
    
    // Actions
    login,
    register,
    loginWithGoogle: () => loginWithSocial('google'),
    logout,
    sendPasswordReset,
    resendEmailVerification,
    
    // Utilities
    clearError,
    isEmailVerified,
    requiresEmailVerification,
  };
};