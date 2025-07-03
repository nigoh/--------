/**
 * MFA管理フォームのカスタムフック
 */
import { useState, useCallback } from 'react';
import { useAuth } from '../../../auth/context';
import { multiFactor } from 'firebase/auth';
import { auth } from '../../../auth/firebase';
import { useAuthLoggers } from '../../../hooks/logging';

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
  
  const { featureLogger } = useAuthLoggers();

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
      
      // MFA設定取得ログ
      await featureLogger.logUserAction('mfa_status_load', {
        userId: auth.currentUser.uid
      });

      const factors = multiFactor(auth.currentUser).enrolledFactors;
      setEnrolledFactors(factors);
      
      // MFA設定読み込み成功ログ
      await featureLogger.logUserAction('mfa_status_load_success', {
        userId: auth.currentUser.uid,
        factorCount: factors.length,
        factorTypes: factors.map(f => f.factorId)
      });
      
    } catch (error) {
      console.error('MFA設定取得エラー:', error);
      setError('MFA設定の取得に失敗しました');
      
      // MFA設定読み込み失敗ログ
      featureLogger.logError(error instanceof Error ? error : new Error('MFA設定取得エラー'), {
        userId: auth.currentUser?.uid,
        step: 'load_mfa_status'
      });
    } finally {
      setIsLoading(false);
    }
  }, [featureLogger]);

  /**
   * MFA削除処理
   */
  const handleDeleteMFA = useCallback(async (factorUid: string) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const factor = enrolledFactors.find(f => f.uid === factorUid);
      if (factor) {
        // MFA削除試行ログ
        await featureLogger.logUserAction('mfa_delete_attempt', {
          userId: auth.currentUser.uid,
          factorUid: factorUid,
          factorType: factor.factorId
        });

        await multiFactor(auth.currentUser).unenroll(factor);
        await loadMFAStatus(); // 再読み込み
        setSuccessMessage('MFA設定を削除しました');
        
        // MFA削除成功ログ
        await featureLogger.logUserAction('mfa_delete_success', {
          userId: auth.currentUser.uid,
          factorUid: factorUid,
          factorType: factor.factorId
        });

        // セキュリティログ
        featureLogger.logSecurityEvent('mfa_factor_removed', {
          userId: auth.currentUser.uid,
          factorType: factor.factorId,
          remainingFactors: enrolledFactors.length - 1
        });
      }
    } catch (error: any) {
      console.error('MFA削除エラー:', error);
      setError(error.message || 'MFA設定の削除に失敗しました');
      
      // MFA削除失敗ログ
      featureLogger.logError(error, {
        userId: auth.currentUser?.uid,
        factorUid: factorUid,
        step: 'mfa_delete'
      });
    } finally {
      setIsLoading(false);
    }
  }, [enrolledFactors, loadMFAStatus, featureLogger]);

  /**
   * MFA追加開始
   */
  const startAddingMFA = useCallback(() => {
    setIsAdding(true);
    setError(null);
    
    // MFA追加開始ログ
    featureLogger.logUserAction('mfa_add_start', {
      userId: auth.currentUser?.uid,
      currentFactorCount: enrolledFactors.length
    });
  }, [featureLogger, enrolledFactors.length]);

  /**
   * MFA追加キャンセル
   */
  const cancelAddingMFA = useCallback(() => {
    setIsAdding(false);
    
    // MFA追加キャンセルログ
    featureLogger.logUserAction('mfa_add_cancel', {
      userId: auth.currentUser?.uid
    });
  }, [featureLogger]);

  /**
   * MFA追加成功
   */
  const handleAddSuccess = useCallback(() => {
    setIsAdding(false);
    loadMFAStatus(); // 再読み込み
    setSuccessMessage('MFA設定を追加しました');
    
    // MFA追加成功ログ
    featureLogger.logUserAction('mfa_add_success', {
      userId: auth.currentUser?.uid,
      newFactorCount: enrolledFactors.length + 1
    });

    // セキュリティログ
    featureLogger.logSecurityEvent('mfa_factor_added', {
      userId: auth.currentUser?.uid,
      totalFactors: enrolledFactors.length + 1
    });
    
    // 3秒後に成功メッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }, [loadMFAStatus, featureLogger, enrolledFactors.length]);

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
