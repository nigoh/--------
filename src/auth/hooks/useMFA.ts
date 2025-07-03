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

  // TOTP設定（Firebase公式ドキュメント完全準拠）
  const setupTOTP = useCallback(async (): Promise<TotpSecret | null> => {
    console.log('🔧 [TOTP Setup] Firebase公式実装による設定開始');
    
    if (!auth.currentUser) {
      console.error('❌ [TOTP Setup] ユーザーが認証されていません');
      setError('認証が必要です');
      return null;
    }

    // Firebase公式ドキュメント: メールアドレス確認が必要
    if (!auth.currentUser.emailVerified) {
      console.error('❌ [TOTP Setup] メールアドレスが確認されていません');
      setError('MFAを使用するにはメールアドレスの確認が必要です');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔧 [TOTP Setup] ユーザー情報:', {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        emailVerified: auth.currentUser.emailVerified
      });

      // ステップ1: マルチファクターセッションを取得（公式ドキュメント準拠）
      console.log('🔧 [TOTP Setup] multiFactor().getSession() 呼び出し中...');
      const multiFactorSession = await multiFactor(auth.currentUser).getSession();
      console.log('✅ [TOTP Setup] マルチファクターセッション取得成功');

      // ステップ2: TOTPシークレットを生成（公式ドキュメント準拠）
      console.log('🔧 [TOTP Setup] TotpMultiFactorGenerator.generateSecret() 呼び出し中...');
      const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
      console.log('✅ [TOTP Setup] TOTPシークレット生成成功');

      // ステップ3: QRコードURL生成（公式ドキュメント準拠）
      console.log('🔧 [TOTP Setup] QRコードURL生成中...');
      const appName = 'WorkApp';
      const qrCodeUrl = totpSecret.generateQrCodeUrl(
        auth.currentUser.email || 'user',
        appName
      );
      console.log('✅ [TOTP Setup] QRコードURL生成成功:', qrCodeUrl);

      // シークレットキーも表示（公式ドキュメント推奨）
      console.log('🔧 [TOTP Setup] シークレットキー:', totpSecret.secretKey);
      
      setTotpSecret(totpSecret.secretKey);
      setQrCodeUrl(qrCodeUrl);
      
      console.log('✅ [TOTP Setup] 設定完了 - QRコードまたはシークレットキーを認証アプリに追加してください');
      return totpSecret;
      
    } catch (error: any) {
      console.error('❌ [TOTP Setup] エラー詳細:', {
        error: error,
        code: error?.code,
        message: error?.message
      });
      
      // Firebase公式ドキュメントに基づくエラーハンドリング
      if (error?.code === 'auth/operation-not-allowed') {
        const errorMsg = 'Firebase Consoleでマルチファクター認証を有効にしてください';
        console.error('❌ [TOTP Setup]', errorMsg);
        setError(errorMsg);
      } else if (error?.code === 'auth/invalid-user-token') {
        const errorMsg = '認証トークンが無効です。再ログインしてください';
        console.error('❌ [TOTP Setup]', errorMsg);
        setError(errorMsg);
      } else if (error?.code === 'auth/user-not-found') {
        const errorMsg = 'ユーザーが見つかりません';
        console.error('❌ [TOTP Setup]', errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = `TOTP設定エラー: ${error?.message || '不明なエラー'}`;
        console.error('❌ [TOTP Setup]', errorMsg);
        setError(errorMsg);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // TOTP検証・登録完了（Firebase公式ドキュメント完全準拠）
  const verifyTOTP = useCallback(async (code: string, secret: TotpSecret): Promise<boolean> => {
    console.log('🔧 [TOTP Verify] Firebase公式実装による検証・登録開始');
    
    if (!auth.currentUser) {
      console.error('❌ [TOTP Verify] ユーザーが認証されていません');
      setError('認証が必要です');
      return false;
    }

    // 入力検証
    if (!/^\d{6}$/.test(code)) {
      console.error('❌ [TOTP Verify] 無効な確認コード形式');
      setError('6桁の数字を入力してください');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔧 [TOTP Verify] 入力されたコード:', code);
      console.log('🔧 [TOTP Verify] 使用するシークレット:', secret.secretKey.substring(0, 8) + '...');

      // ステップ1: 登録用アサーションを作成（公式ドキュメント準拠）
      console.log('🔧 [TOTP Verify] TotpMultiFactorGenerator.assertionForEnrollment() 呼び出し中...');
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(secret, code);
      console.log('✅ [TOTP Verify] マルチファクターアサーション生成成功');

      // ステップ2: MFA登録を完了（公式ドキュメント準拠）
      const mfaDisplayName = 'TOTP Authentication';
      console.log('🔧 [TOTP Verify] multiFactor().enroll() 呼び出し中...', { displayName: mfaDisplayName });
      await multiFactor(auth.currentUser).enroll(multiFactorAssertion, mfaDisplayName);
      console.log('✅ [TOTP Verify] MFA登録完了');

      setMfaVerified(true);
      console.log('🎉 [TOTP Verify] TOTP MFA設定が正常に完了しました！');
      return true;
      
    } catch (error: any) {
      console.error('❌ [TOTP Verify] エラー詳細:', {
        error: error,
        code: error?.code,
        message: error?.message
      });
      
      // Firebase公式ドキュメントに基づくエラーハンドリング
      if (error?.code === 'auth/invalid-verification-code') {
        const errorMsg = '確認コードが正しくありません。認証アプリの6桁のコードを確認してください';
        console.error('❌ [TOTP Verify]', errorMsg);
        setError(errorMsg);
      } else if (error?.code === 'auth/code-expired') {
        const errorMsg = '確認コードの有効期限が切れています。新しいコードを入力してください';
        console.error('❌ [TOTP Verify]', errorMsg);
        setError(errorMsg);
      } else if (error?.code === 'auth/maximum-second-factor-count-exceeded') {
        const errorMsg = 'MFA設定可能数の上限に達しています';
        console.error('❌ [TOTP Verify]', errorMsg);
        setError(errorMsg);
      } else if (error?.code === 'auth/second-factor-already-in-use') {
        const errorMsg = 'この認証方法は既に使用されています';
        console.error('❌ [TOTP Verify]', errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = `TOTP検証エラー: ${error?.message || '不明なエラー'}`;
        console.error('❌ [TOTP Verify]', errorMsg);
        setError(errorMsg);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setMfaVerified]);

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

  // MFAチャレンジ解決（ログイン時 - Firebase公式ドキュメント準拠）
  const resolveMFAChallenge = useCallback(async (
    resolver: MultiFactorResolver,
    code: string,
    method: MfaMethod
  ): Promise<boolean> => {
    console.log('🔧 [MFA Challenge] チャレンジ解決開始:', { method });
    
    try {
      setIsLoading(true);
      setError(null);

      let multiFactorAssertion;

      if (method === 'totp') {
        console.log('🔧 [MFA Challenge] TOTP認証処理中...');
        
        // TOTP認証 - 公式ドキュメント準拠
        const totpFactorHint = resolver.hints.find(hint => 
          hint.factorId === TotpMultiFactorGenerator.FACTOR_ID
        );
        
        if (totpFactorHint) {
          console.log('🔧 [MFA Challenge] TOTP Factor found:', totpFactorHint.uid);
          multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
            totpFactorHint.uid,
            code
          );
          console.log('🔧 [MFA Challenge] TOTP assertion生成成功');
        } else {
          throw new Error('TOTP認証要素が見つかりません');
        }
      } else if (method === 'sms') {
        console.log('🔧 [MFA Challenge] SMS認証処理中...');
        
        // SMS認証
        if (!verificationId) {
          throw new Error('SMS認証IDが見つかりません');
        }
        const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
        multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
        console.log('🔧 [MFA Challenge] SMS assertion生成成功');
      }

      if (multiFactorAssertion) {
        console.log('🔧 [MFA Challenge] resolveSignIn()呼び出し中...');
        const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
        console.log('🔧 [MFA Challenge] ログイン成功:', userCredential.user.uid);
        
        setMfaVerified(true);
        setMfaRequired(false);
        return true;
      }

      throw new Error('認証アサーションの生成に失敗しました');
    } catch (error: any) {
      console.error('❌ [MFA Challenge] エラー詳細:', {
        error: error,
        code: error?.code,
        message: error?.message
      });
      
      // MFAチャレンジ特有のエラーハンドリング
      if (error?.code === 'auth/invalid-verification-code') {
        setError('認証コードが正しくありません');
      } else if (error?.code === 'auth/code-expired') {
        setError('認証コードの有効期限が切れています');
      } else if (error?.code === 'auth/too-many-requests') {
        setError('試行回数が多すぎます。しばらくしてから再試行してください');
      } else {
        handleError(error);
      }
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
