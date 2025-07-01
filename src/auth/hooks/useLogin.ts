/**
 * ログイン機能のカスタムフック
 */
import { useCallback, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  type UserCredential,
  type MultiFactorError,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginFormData, AuthErrorCode } from '../types';
import type { MultiFactorResolver } from 'firebase/auth';

// ログインフックの戻り値型
interface UseLoginReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  mfaResolver: MultiFactorResolver | null;
  
  // アクション
  loginWithEmail: (data: LoginFormData) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
  clearMfaResolver: () => void;
}

/**
 * ログイン機能のカスタムフック
 */
export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  
  const { setLastLogin, setError: setStoreError, setMfaRequired } = useAuthStore();

  // エラーメッセージの変換
  const getErrorMessage = useCallback((errorCode: string): string => {
    const errorMap: Record<string, string> = {
      'auth/user-not-found': 'メールアドレスが登録されていません',
      'auth/wrong-password': 'パスワードが正しくありません',
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/too-many-requests': 'しばらく時間をおいて再試行してください',
      'auth/network-request-failed': '通信に失敗しました。再試行してください',
      'auth/multi-factor-auth-required': '多要素認証が必要です',
    };
    
    return errorMap[errorCode] || '認証に失敗しました';
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
    setStoreError(null);
  }, [setStoreError]);

  // MFAリゾルバークリア
  const clearMfaResolver = useCallback(() => {
    setMfaResolver(null);
    setMfaRequired(false);
  }, [setMfaRequired]);

  // メール・パスワードでのログイン
  const loginWithEmail = useCallback(async (data: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        setLastLogin('email');
        clearMfaResolver();
        console.log('✅ メール認証でログインしました');
        return true;
      }

      return false;
    } catch (error: any) {
      // MFAが必要な場合
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = error.resolver as MultiFactorResolver;
        setMfaResolver(resolver);
        setMfaRequired(true);
        setError('多要素認証が必要です');
        console.log('🔐 MFA認証が必要です');
        return false;
      }

      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ ログインエラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setLastLogin, getErrorMessage, setStoreError, setMfaRequired, clearMfaResolver]);

  // Googleログイン
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      
      // カスタムパラメータの設定
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const userCredential: UserCredential = await signInWithPopup(auth, provider);

      if (userCredential.user) {
        setLastLogin('google');
        clearMfaResolver();
        console.log('✅ Google認証でログインしました');
        return true;
      }

      return false;
    } catch (error: any) {
      // ユーザーがキャンセルした場合は特別処理
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ ユーザーがログインをキャンセルしました');
        return false;
      }

      // MFAが必要な場合
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = error.resolver as MultiFactorResolver;
        setMfaResolver(resolver);
        setMfaRequired(true);
        setError('多要素認証が必要です');
        console.log('🔐 MFA認証が必要です');
        return false;
      }

      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ Googleログインエラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setLastLogin, getErrorMessage, setStoreError, setMfaRequired, clearMfaResolver]);

  // パスワード再設定
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ パスワード再設定メールを送信しました');
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ パスワード再設定エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage, setStoreError]);

  return {
    isLoading,
    error,
    mfaResolver,
    loginWithEmail,
    loginWithGoogle,
    resetPassword,
    clearError,
    clearMfaResolver,
  };
};
