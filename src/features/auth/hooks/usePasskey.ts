/**
 * usePasskey Hook
 * パスキー認証機能のカスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
import {
  createPasskey,
  authenticateWithPasskey,
  authenticateWithConditionalUI,
  isPlatformAuthenticatorAvailable,
  prepareRegistrationData,
  prepareAuthenticationData,
} from '../services/passkeyService';
import { isPasskeySupported } from '../utils/authUtils';
import { PasskeyCredential } from '../types/authTypes';
import { useTemporary } from '../../../hooks/useTemporary';

export interface UsePasskeyReturn {
  // State
  loading: boolean;
  error: string | null;
  isSupported: boolean;
  isPlatformAvailable: boolean;
  
  // Actions
  register: (userId: string, userName: string, userDisplayName?: string) => Promise<PasskeyCredential | null>;
  authenticate: (allowCredentials?: PublicKeyCredentialDescriptor[]) => Promise<PasskeyCredential | null>;
  authenticateConditional: () => Promise<PasskeyCredential | null>;
  clearError: () => void;
  
  // Utilities
  checkSupport: () => Promise<void>;
}

/**
 * パスキー認証機能フック
 */
export const usePasskey = (): UsePasskeyReturn => {
  const { toast } = useTemporary();
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);

  // サポート状況チェック
  const checkSupport = useCallback(async () => {
    try {
      const supported = isPasskeySupported();
      setIsSupported(supported);
      
      if (supported) {
        const platformAvailable = await isPlatformAuthenticatorAvailable();
        setIsPlatformAvailable(platformAvailable);
      }
    } catch (error) {
      console.error('Passkey support check failed:', error);
      setIsSupported(false);
      setIsPlatformAvailable(false);
    }
  }, []);

  // 初期化時にサポート状況をチェック
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  // パスキー登録
  const register = useCallback(async (
    userId: string,
    userName: string,
    userDisplayName?: string
  ): Promise<PasskeyCredential | null> => {
    if (!isSupported) {
      setError('お使いのブラウザはパスキーをサポートしていません');
      toast.error('パスキーはサポートされていません');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const credential = await createPasskey(
        userId,
        userName,
        userDisplayName || userName
      );

      toast.success('パスキーが作成されました');
      return credential;
    } catch (error: any) {
      const errorMessage = error.message || 'パスキーの作成に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isSupported, toast]);

  // パスキー認証
  const authenticate = useCallback(async (
    allowCredentials?: PublicKeyCredentialDescriptor[]
  ): Promise<PasskeyCredential | null> => {
    if (!isSupported) {
      setError('お使いのブラウザはパスキーをサポートしていません');
      toast.error('パスキーはサポートされていません');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const credential = await authenticateWithPasskey(allowCredentials);
      toast.success('パスキー認証が完了しました');
      return credential;
    } catch (error: any) {
      const errorMessage = error.message || 'パスキー認証に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isSupported, toast]);

  // 条件付きUI認証
  const authenticateConditional = useCallback(async (): Promise<PasskeyCredential | null> => {
    if (!isSupported) {
      return null;
    }

    setError(null);

    try {
      const credential = await authenticateWithConditionalUI();
      if (credential) {
        toast.success('パスキー認証が完了しました');
      }
      return credential;
    } catch (error: any) {
      // 条件付きUI認証では通常はエラーを表示しない
      console.warn('Conditional UI authentication failed:', error);
      return null;
    }
  }, [isSupported, toast]);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    isSupported,
    isPlatformAvailable,
    
    // Actions
    register,
    authenticate,
    authenticateConditional,
    clearError,
    
    // Utilities
    checkSupport,
  };
};