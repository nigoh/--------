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
import { useAuthLoggers } from '../../hooks/logging';
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
  const { featureLogger } = useAuthLoggers();

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

      // 新規登録試行ログ
      await featureLogger.logUserAction('register_attempt', {
        email: data.email,
        displayName: data.displayName,
        hasAcceptedTerms: data.acceptTerms
      });

      // バリデーション
      const validationError = validateRegisterData(data);
      if (validationError) {
        setError(validationError);
        setStoreError(validationError);
        
        // バリデーションエラーログ
        featureLogger.logError(new Error(validationError), {
          email: data.email,
          validationError,
          step: 'validation'
        });
        
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

        // 新規登録成功ログ
        await featureLogger.logUserAction('register_success', {
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          emailVerified: userCredential.user.emailVerified
        });

        // セキュリティログ
        featureLogger.logSecurityEvent('account_created', {
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          verificationEmailSent: true
        });

        console.log('✅ 新規登録が完了しました');
        console.log('📧 メール確認を送信しました');
        return true;
      }

      return false;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      
      // 新規登録失敗ログ
      featureLogger.logError(error, {
        email: data.email,
        errorCode: error.code,
        errorMessage: errorMessage,
        step: 'firebase_auth'
      });
      
      console.error('❌ 登録エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateRegisterData, getErrorMessage, setStoreError, featureLogger]);

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

      // メール確認再送信試行ログ
      await featureLogger.logUserAction('verification_email_resend_attempt', {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email
      });

      await sendEmailVerification(auth.currentUser);
      
      // メール確認再送信成功ログ
      await featureLogger.logUserAction('verification_email_resend_success', {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email
      });
      
      console.log('✅ メール確認を再送信しました');
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      
      // メール確認再送信失敗ログ
      featureLogger.logError(error, {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        errorCode: error.code,
        errorMessage: errorMessage
      });
      
      console.error('❌ メール再送信エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage, setStoreError, featureLogger]);

  return {
    isLoading,
    error,
    register,
    resendVerificationEmail,
    clearError,
  };
};
