/**
 * MFA管理フォームのカスタムフック
 */
import { useState, useCallback } from 'react';
import { useAuth } from '../../../auth/context';
import { multiFactor } from 'firebase/auth';
import { auth } from '../../../auth/firebase';

/**
 * MFA管理フォームのカスタムフック
 */
export const useMFAForm = () => {
  const { user } = useAuth();
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * MFA設定取得
   */
  const loadMFAStatus = useCallback(async () => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const factors = multiFactor(auth.currentUser).enrolledFactors;
      setEnrolledFactors(factors);
    } catch (error) {
      console.error('MFA設定取得エラー:', error);
      setError('MFA設定の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * MFA削除処理
   */
  const handleDeleteMFA = useCallback(async (factorUid: string) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const factor = enrolledFactors.find(f => f.uid === factorUid);
      if (factor) {
        await multiFactor(auth.currentUser).unenroll(factor);
        await loadMFAStatus(); // 再読み込み
        setSuccessMessage('MFA設定を削除しました');
      }
    } catch (error: any) {
      console.error('MFA削除エラー:', error);
      setError(error.message || 'MFA設定の削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [enrolledFactors, loadMFAStatus]);

  /**
   * MFA追加開始
   */
  const startAddingMFA = useCallback(() => {
    setIsAdding(true);
    setError(null);
  }, []);

  /**
   * MFA追加キャンセル
   */
  const cancelAddingMFA = useCallback(() => {
    setIsAdding(false);
  }, []);

  /**
   * MFA追加成功
   */
  const handleAddSuccess = useCallback(() => {
    setIsAdding(false);
    loadMFAStatus(); // 再読み込み
    setSuccessMessage('MFA設定を追加しました');
    
    // 3秒後に成功メッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }, [loadMFAStatus]);

  /**
   * エラー設定
   */
  const setFormError = useCallback((message: string) => {
    setError(message);
  }, []);

  /**
   * エラークリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    enrolledFactors,
    isLoading,
    isAdding,
    error,
    successMessage,
    loadMFAStatus,
    handleDeleteMFA,
    startAddingMFA,
    cancelAddingMFA,
    handleAddSuccess,
    setFormError,
    clearError,
  };
};
