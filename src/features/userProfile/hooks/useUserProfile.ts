/**
 * ユーザープロファイル管理フック
 * Firebase Authのユーザー情報の更新・管理を行う
 */
import { useState, useCallback } from 'react';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { auth } from '../../../auth/firebase';
import { useAuth } from '../../../auth/context';

// プロファイル更新データ型
export interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
}

// メール更新データ型
export interface EmailUpdateData {
  newEmail: string;
  currentPassword: string;
}

// パスワード更新データ型
export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

/**
 * ユーザープロファイル管理フック
 */
export const useUserProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // エラーメッセージの日本語化
  const getErrorMessage = useCallback((error: any): string => {
    const code = error.code || 'unknown';
    
    switch (code) {
      case 'auth/requires-recent-login':
        return '最近のログインが必要です。一度ログアウトして再度ログインしてください。';
      case 'auth/wrong-password':
        return '現在のパスワードが正しくありません。';
      case 'auth/weak-password':
        return 'パスワードが弱すぎます。6文字以上で設定してください。';
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使用されています。';
      case 'auth/invalid-email':
        return '正しいメールアドレス形式で入力してください。';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。接続を確認してください。';
      case 'auth/too-many-requests':
        return 'リクエストが多すぎます。しばらく時間をおいてから再試行してください。';
      default:
        return 'エラーが発生しました。しばらく時間をおいてから再試行してください。';
    }
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // プロファイル更新
  const updateUserProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
      
      console.log('✅ プロファイルを更新しました');
      return true;
    } catch (error: any) {
      console.error('❌ プロファイル更新エラー:', error);
      setError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, getErrorMessage]);

  // メールアドレス更新
  const updateUserEmail = useCallback(async (data: EmailUpdateData): Promise<boolean> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 再認証が必要
      const credential = EmailAuthProvider.credential(user.email!, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // メールアドレス更新前に検証メール送信
      await verifyBeforeUpdateEmail(user, data.newEmail);
      
      console.log('✅ メールアドレス確認用のメールを送信しました');
      return true;
    } catch (error: any) {
      console.error('❌ メールアドレス更新エラー:', error);
      setError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, getErrorMessage]);

  // パスワード更新
  const updateUserPassword = useCallback(async (data: PasswordUpdateData): Promise<boolean> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 再認証が必要
      const credential = EmailAuthProvider.credential(user.email!, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // パスワード更新
      await updatePassword(user, data.newPassword);
      
      console.log('✅ パスワードを更新しました');
      return true;
    } catch (error: any) {
      console.error('❌ パスワード更新エラー:', error);
      setError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, getErrorMessage]);

  // アカウント削除
  const deleteUserAccount = useCallback(async (currentPassword: string): Promise<boolean> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 再認証が必要
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // アカウント削除
      await user.delete();
      
      console.log('✅ アカウントを削除しました');
      return true;
    } catch (error: any) {
      console.error('❌ アカウント削除エラー:', error);
      setError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, getErrorMessage]);

  return {
    isLoading,
    error,
    clearError,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
  };
};
