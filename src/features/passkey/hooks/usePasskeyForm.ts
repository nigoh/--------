/**
 * パスキー管理フォームのカスタムフック
 */
import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { useAuthLoggers } from '../../../hooks/logging';

/**
 * パスキー管理フォームのカスタムフック
 */
export const usePasskeyForm = () => {
  const { user } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { featureLogger } = useAuthLoggers();

  /**
   * パスキー登録処理の開始
   */
  const startPasskeyRegistration = useCallback(() => {
    setIsRegistering(true);
    setError(null);
    setSuccessMessage(null);
    
    // パスキー登録開始ログ
    featureLogger.logUserAction('passkey_register_start', {
      userId: user?.uid,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });
  }, [featureLogger, user]);

  /**
   * パスキー削除処理の開始
   */
  const startPasskeyDeletion = useCallback(() => {
    setIsDeleting(true);
    setError(null);
    setSuccessMessage(null);
    
    // パスキー削除開始ログ
    featureLogger.logUserAction('passkey_delete_start', {
      userId: user?.uid
    });
  }, [featureLogger, user]);

  /**
   * 処理キャンセル
   */
  const cancelOperation = useCallback(() => {
    const wasRegistering = isRegistering;
    const wasDeleting = isDeleting;
    
    setIsRegistering(false);
    setIsDeleting(false);
    setError(null);
    
    // キャンセルログ
    if (wasRegistering) {
      featureLogger.logUserAction('passkey_register_cancel', {
        userId: user?.uid
      });
    } else if (wasDeleting) {
      featureLogger.logUserAction('passkey_delete_cancel', {
        userId: user?.uid
      });
    }
  }, [isRegistering, isDeleting, featureLogger, user]);

  /**
   * エラー設定
   */
  const setFormError = useCallback((message: string) => {
    setError(message);
    const wasRegistering = isRegistering;
    const wasDeleting = isDeleting;
    
    setIsRegistering(false);
    setIsDeleting(false);
    
    // エラーログ
    featureLogger.logError(new Error(message), {
      userId: user?.uid,
      operation: wasRegistering ? 'register' : wasDeleting ? 'delete' : 'unknown',
      errorMessage: message
    });
  }, [isRegistering, isDeleting, featureLogger, user]);

  /**
   * 成功メッセージ設定
   */
  const setFormSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    const wasRegistering = isRegistering;
    const wasDeleting = isDeleting;
    
    setIsRegistering(false);
    setIsDeleting(false);
    
    // 成功ログ
    if (wasRegistering) {
      featureLogger.logUserAction('passkey_register_success', {
        userId: user?.uid
      });
      
      // セキュリティログ
      featureLogger.logSecurityEvent('passkey_registered', {
        userId: user?.uid,
        userAgent: navigator.userAgent
      });
    } else if (wasDeleting) {
      featureLogger.logUserAction('passkey_delete_success', {
        userId: user?.uid
      });
      
      // セキュリティログ
      featureLogger.logSecurityEvent('passkey_deleted', {
        userId: user?.uid
      });
    }
    
    // 3秒後に成功メッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }, [isRegistering, isDeleting, featureLogger, user]);

  return {
    user,
    isRegistering,
    isDeleting,
    error,
    successMessage,
    startPasskeyRegistration,
    startPasskeyDeletion,
    cancelOperation,
    setFormError,
    setFormSuccess
  };
};
