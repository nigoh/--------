/**
 * 新規登録機能のカスタムフック
 */
import { useCallback, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import type { RegisterFormData } from '../types';

// 登録フックの戻り値型
interface UseRegisterReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  
  // アクション
  register: (data: RegisterFormData) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  clearError: () => void;
}

/**
 * 新規登録機能のカスタムフック
 */
export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setError: setStoreError } = useAuthStore();

  // エラーメッセージの変換
  const getErrorMessage = useCallback((errorCode: string): string => {
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
      'auth/weak-password': 'パスワードは8文字以上で設定してください',
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/operation-not-allowed': 'メール認証が無効化されています',
      'auth/network-request-failed': '通信に失敗しました。再試行してください',
    };
    
    return errorMap[errorCode] || '登録に失敗しました';
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
    setStoreError(null);
  }, [setStoreError]);

  // バリデーション
  const validateRegisterData = useCallback((data: RegisterFormData): string | null => {
    if (!data.email.trim()) {
      return 'メールアドレスを入力してください';
    }
    
    if (!data.password) {
      return 'パスワードを入力してください';
    }
    
    if (data.password.length < 8) {
      return 'パスワードは8文字以上で入力してください';
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      return 'パスワードは英大文字、英小文字、数字を含む必要があります';
    }
    
    if (data.password !== data.confirmPassword) {
      return 'パスワードが一致しません';
    }
    
    if (!data.displayName.trim()) {
      return '表示名を入力してください';
    }
    
    if (!data.acceptTerms) {
      return '利用規約に同意してください';
    }
    
    return null;
  }, []);

  // 新規登録
  const register = useCallback(async (data: RegisterFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // バリデーション
      const validationError = validateRegisterData(data);
      if (validationError) {
        setError(validationError);
        setStoreError(validationError);
        return false;
      }

      // Firebase Authでユーザー作成
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        // プロフィール更新
        await updateProfile(userCredential.user, {
          displayName: data.displayName,
        });

        // メール確認送信
        await sendEmailVerification(userCredential.user);

        console.log('✅ 新規登録が完了しました');
        console.log('📧 メール確認を送信しました');
        return true;
      }

      return false;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ 登録エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateRegisterData, getErrorMessage, setStoreError]);

  // メール確認の再送信
  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!auth.currentUser) {
        setError('ログインしてください');
        return false;
      }

      if (auth.currentUser.emailVerified) {
        setError('メールアドレスは既に確認済みです');
        return false;
      }

      await sendEmailVerification(auth.currentUser);
      
      console.log('✅ メール確認を再送信しました');
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ メール再送信エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage, setStoreError]);

  return {
    isLoading,
    error,
    register,
    resendVerificationEmail,
    clearError,
  };
};
