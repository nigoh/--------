/**
 * パスキー管理フォームのカスタムフック
 */
import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../auth/stores/useAuthStore';

/**
 * パスキー管理フォームのカスタムフック
 */
export const usePasskeyForm = () => {
  const { user } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * パスキー登録処理の開始
   */
  const startPasskeyRegistration = useCallback(() => {
    setIsRegistering(true);
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * パスキー削除処理の開始
   */
  const startPasskeyDeletion = useCallback(() => {
    setIsDeleting(true);
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * 処理キャンセル
   */
  const cancelOperation = useCallback(() => {
    setIsRegistering(false);
    setIsDeleting(false);
    setError(null);
  }, []);

  /**
   * エラー設定
   */
  const setFormError = useCallback((message: string) => {
    setError(message);
    setIsRegistering(false);
    setIsDeleting(false);
  }, []);

  /**
   * 成功メッセージ設定
   */
  const setFormSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setIsRegistering(false);
    setIsDeleting(false);
    
    // 3秒後に成功メッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }, []);

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
