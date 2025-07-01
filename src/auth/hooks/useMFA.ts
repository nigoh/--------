/**
 * MFA（多要素認証）機能のカスタムフック
 * TOTP・SMS認証の設定・検証機能
 */
import { useCallback, useState } from 'react';
import {
  multiFactor,
  PhoneAuthProvider,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
  TotpMultiFactorGenerator,
  TotpSecret,
  type MultiFactorResolver,
  type MultiFactorError,
  type ApplicationVerifier,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import type { MfaMethod, MfaSetupData } from '../types';

// MFAフックの戻り値型
interface UseMFAReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  totpSecret: string | null;
  qrCodeUrl: string | null;
  verificationId: string | null;
  
  // アクション
  setupTOTP: () => Promise<TotpSecret | null>;
  verifyTOTP: (code: string, secret: TotpSecret) => Promise<boolean>;
  setupSMS: (phoneNumber: string) => Promise<boolean>;
  verifySMS: (code: string) => Promise<boolean>;
  resolveMFAChallenge: (resolver: MultiFactorResolver, code: string, method: MfaMethod) => Promise<boolean>;
  clearError: () => void;
}

/**
 * MFA機能のカスタムフック
 */
export const useMFA = (): UseMFAReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  
  const { setMfaRequired, setMfaVerified, setError: setStoreError } = useAuthStore();

  // エラーメッセージの変換
  const getErrorMessage = useCallback((errorCode: string): string => {
    const errorMap: Record<string, string> = {
      'auth/invalid-verification-code': '認証コードが正しくありません',
      'auth/code-expired': '認証コードの有効期限が切れています',
      'auth/too-many-requests': 'リクエストが多すぎます。しばらく待ってから再試行してください',
      'auth/phone-number-already-exists': 'この電話番号は既に登録されています',
      'auth/invalid-phone-number': '電話番号の形式が正しくありません',
      'auth/quota-exceeded': '認証コードの送信制限に達しました',
      'auth/multi-factor-auth-required': '多要素認証が必要です',
      'auth/maximum-second-factor-count-exceeded': 'MFA設定可能数の上限に達しています',
      'auth/second-factor-already-in-use': 'この認証方法は既に使用されています',
    };
    return errorMap[errorCode] || 'MFA操作中にエラーが発生しました';
  }, []);

  // エラー処理
  const handleError = useCallback((error: any) => {
    const message = getErrorMessage(error.code || 'unknown');
    setError(message);
    setStoreError(message);
    console.error('MFA Error:', error);
  }, [getErrorMessage, setStoreError]);

  // TOTP設定
  const setupTOTP = useCallback(async (): Promise<TotpSecret | null> => {
    if (!auth.currentUser) {
      handleError({ code: 'auth/user-not-found' });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const multiFactorSession = await multiFactor(auth.currentUser).getSession();
      const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
      
      // QRコードURL生成
      const appName = 'WorkApp';
      const accountName = auth.currentUser.email || 'user';
      const qrUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(accountName)}?secret=${totpSecret.secretKey}&issuer=${encodeURIComponent(appName)}`;
      
      setTotpSecret(totpSecret.secretKey);
      setQrCodeUrl(qrUrl);
      
      return totpSecret;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // TOTP検証・登録完了
  const verifyTOTP = useCallback(async (code: string, secret: TotpSecret): Promise<boolean> => {
    if (!auth.currentUser) {
      handleError({ code: 'auth/user-not-found' });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const totpCredential = TotpMultiFactorGenerator.assertionForEnrollment(secret, code);
      await multiFactor(auth.currentUser).enroll(totpCredential, 'TOTP Authentication');
      
      setMfaVerified(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, setMfaVerified]);

  // SMS設定
  const setupSMS = useCallback(async (phoneNumber: string): Promise<boolean> => {
    if (!auth.currentUser) {
      handleError({ code: 'auth/user-not-found' });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // reCAPTCHA verifier setup
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA verified');
          },
        });
      }

      const multiFactorSession = await multiFactor(auth.currentUser).getSession();
      const phoneInfoOptions = {
        phoneNumber,
        session: multiFactorSession,
      };

      // SMS送信とverificationId取得
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier);
      setVerificationId(verificationId);

      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // SMS認証コード検証・登録完了
  const verifySMS = useCallback(async (code: string): Promise<boolean> => {
    if (!verificationId || !auth.currentUser) {
      handleError({ code: 'auth/invalid-verification-id' });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
      
      // MFA登録完了
      await multiFactor(auth.currentUser).enroll(multiFactorAssertion, 'SMS Authentication');
      
      setMfaVerified(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [verificationId, handleError, setMfaVerified]);

  // MFAチャレンジ解決（ログイン時）
  const resolveMFAChallenge = useCallback(async (
    resolver: MultiFactorResolver,
    code: string,
    method: MfaMethod
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      let multiFactorAssertion;

      if (method === 'totp') {
        // TOTP認証
        const totpSecret = resolver.hints[0];
        if (totpSecret.factorId === 'totp') {
          multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
            totpSecret.uid,
            code
          );
        }
      } else if (method === 'sms') {
        // SMS認証
        const phoneCredential = PhoneAuthProvider.credential(verificationId || '', code);
        multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
      }

      if (multiFactorAssertion) {
        await resolver.resolveSignIn(multiFactorAssertion);
        setMfaVerified(true);
        setMfaRequired(false);
        return true;
      }

      return false;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [verificationId, handleError, setMfaVerified, setMfaRequired]);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    totpSecret,
    qrCodeUrl,
    verificationId,
    setupTOTP,
    verifyTOTP,
    setupSMS,
    verifySMS,
    resolveMFAChallenge,
    clearError,
  };
};

// グローバル型拡張
declare global {
  interface Window {
    recaptchaVerifier: ApplicationVerifier;
  }
}
