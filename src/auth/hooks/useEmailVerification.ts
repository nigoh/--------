/**
 * メールアドレス確認フック
 * Firebase Authentication Email Verification
 */
import { useCallback, useState } from 'react';
import { 
  sendEmailVerification, 
  reload,
  type User 
} from 'firebase/auth';
import { auth } from '../firebase';

interface UseEmailVerificationReturn {
  isLoading: boolean;
  error: string | null;
  sendVerificationEmail: () => Promise<boolean>;
  checkEmailVerified: () => Promise<boolean>;
  clearError: () => void;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 確認メール送信
  const sendVerificationEmail = useCallback(async (): Promise<boolean> => {
    console.log('📧 [Email Verification] 確認メール送信開始');
    
    if (!auth.currentUser) {
      console.error('❌ [Email Verification] ユーザーが認証されていません');
      setError('ログインが必要です');
      return false;
    }

    if (auth.currentUser.emailVerified) {
      console.log('✅ [Email Verification] メールアドレスは既に確認済みです');
      return true;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('📧 [Email Verification] sendEmailVerification()呼び出し中...');
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/auth/verify-email',
        handleCodeInApp: false,
      });

      console.log('✅ [Email Verification] 確認メール送信成功');
      return true;
    } catch (error: any) {
      console.error('❌ [Email Verification] エラー詳細:', {
        error: error,
        code: error?.code,
        message: error?.message
      });

      // エラーハンドリング
      if (error?.code === 'auth/too-many-requests') {
        setError('送信回数が多すぎます。しばらくしてから再試行してください');
      } else if (error?.code === 'auth/invalid-email') {
        setError('無効なメールアドレスです');
      } else if (error?.code === 'auth/user-not-found') {
        setError('ユーザーが見つかりません');
      } else {
        setError(`確認メール送信エラー: ${error?.message || '不明なエラー'}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // メール確認状態チェック
  const checkEmailVerified = useCallback(async (): Promise<boolean> => {
    console.log('🔍 [Email Verification] メール確認状態チェック開始');
    
    if (!auth.currentUser) {
      console.error('❌ [Email Verification] ユーザーが認証されていません');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 [Email Verification] reload()呼び出し中...');
      await reload(auth.currentUser);

      const isVerified = auth.currentUser.emailVerified;
      console.log('🔍 [Email Verification] 確認状態:', isVerified);

      return isVerified;
    } catch (error: any) {
      console.error('❌ [Email Verification] チェックエラー:', {
        error: error,
        code: error?.code,
        message: error?.message
      });

      setError('メール確認状態の取得に失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    sendVerificationEmail,
    checkEmailVerified,
    clearError,
  };
};
