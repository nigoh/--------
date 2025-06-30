/**
 * useMFA Hook
 * 多要素認証機能のカスタムフック
 */

import { useState, useCallback } from 'react';
import { TotpSecret } from 'firebase/auth';
import {
  generateTotpSecret,
  enableTotp,
  getMfaFactors,
  unenrollMfaFactor,
  generateQrCodeUrl,
  generateBackupCodes,
} from '../services/mfaService';
import { MFASetupInfo } from '../types/authTypes';
import { useTemporary } from '../../../hooks/useTemporary';

export interface UseMFAReturn {
  // State
  loading: boolean;
  error: string | null;
  totpSecret: TotpSecret | null;
  qrCodeUrl: string | null;
  backupCodes: string[];
  enrolledFactors: any[];
  
  // Actions
  setupTotp: () => Promise<MFASetupInfo | null>;
  confirmTotp: (verificationCode: string, displayName?: string) => Promise<boolean>;
  disableMfa: (factorUid: string) => Promise<boolean>;
  refreshFactors: () => void;
  clearError: () => void;
  generateNewBackupCodes: () => string[];
}

/**
 * 多要素認証機能フック
 */
export const useMFA = (): UseMFAReturn => {
  const { toast } = useTemporary();
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);

  // TOTP設定の開始
  const setupTotp = useCallback(async (): Promise<MFASetupInfo | null> => {
    setLoading(true);
    setError(null);

    try {
      const secret = await generateTotpSecret();
      const qrUrl = generateQrCodeUrl(secret, 'user@example.com', 'Work App');
      const codes = generateBackupCodes();

      setTotpSecret(secret);
      setQrCodeUrl(qrUrl);
      setBackupCodes(codes);

      const setupInfo: MFASetupInfo = {
        secret: secret.secretKey,
        qrCodeUrl: qrUrl,
        backupCodes: codes,
      };

      toast.success('TOTP設定を開始しました');
      return setupInfo;
    } catch (error: any) {
      const errorMessage = error.message || 'TOTP設定の開始に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // TOTP確認と有効化
  const confirmTotp = useCallback(async (
    verificationCode: string,
    displayName?: string
  ): Promise<boolean> => {
    if (!totpSecret) {
      setError('TOTP設定が開始されていません');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await enableTotp(totpSecret, verificationCode, displayName);
      
      // 成功後の状態更新
      setTotpSecret(null);
      setQrCodeUrl(null);
      refreshFactors();
      
      toast.success('多要素認証が有効になりました');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'TOTP確認に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [totpSecret, toast]);

  // MFA無効化
  const disableMfa = useCallback(async (factorUid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await unenrollMfaFactor(factorUid);
      refreshFactors();
      toast.success('多要素認証を無効にしました');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'MFA無効化に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 登録済みファクターの更新
  const refreshFactors = useCallback(() => {
    try {
      const factors = getMfaFactors();
      setEnrolledFactors(factors);
    } catch (error) {
      console.error('Failed to refresh MFA factors:', error);
    }
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // バックアップコード再生成
  const generateNewBackupCodes = useCallback((): string[] => {
    const newCodes = generateBackupCodes();
    setBackupCodes(newCodes);
    toast.success('新しいバックアップコードを生成しました');
    return newCodes;
  }, [toast]);

  return {
    // State
    loading,
    error,
    totpSecret,
    qrCodeUrl,
    backupCodes,
    enrolledFactors,
    
    // Actions
    setupTotp,
    confirmTotp,
    disableMfa,
    refreshFactors,
    clearError,
    generateNewBackupCodes,
  };
};