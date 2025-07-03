/**
 * ログイン機能のカスタムフック
 */
import { useCallback, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  type UserCredential,
  type MultiFactorError,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import { authenticateWithPasskey, formatCredentialResponse } from '../passkey';
import { useAuthLoggers } from '../../hooks/logging';
import type { LoginFormData, AuthErrorCode } from '../types';
import type { MultiFactorResolver } from 'firebase/auth';

// ログインフックの戻り値型
interface UseLoginReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  mfaResolver: MultiFactorResolver | null;
  
  // アクション
  loginWithEmail: (data: LoginFormData) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithPasskey: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
  clearMfaResolver: () => void;
}

/**
 * ログイン機能のカスタムフック
 */
export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  
  const { setLastLogin, setError: setStoreError, setMfaRequired } = useAuthStore();
  const { featureLogger } = useAuthLoggers();

  // エラーメッセージの変換
  const getErrorMessage = useCallback((errorCode: string): string => {
    const errorMap: Record<string, string> = {
      'auth/user-not-found': 'メールアドレスが登録されていません',
      'auth/wrong-password': 'パスワードが正しくありません',
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/too-many-requests': 'しばらく時間をおいて再試行してください',
      'auth/network-request-failed': '通信に失敗しました。再試行してください',
      'auth/multi-factor-auth-required': '多要素認証が必要です',
    };
    
    return errorMap[errorCode] || '認証に失敗しました';
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
    setStoreError(null);
  }, [setStoreError]);

  // MFAリゾルバークリア
  const clearMfaResolver = useCallback(() => {
    setMfaResolver(null);
    setMfaRequired(false);
  }, [setMfaRequired]);

  // メール・パスワードでのログイン
  const loginWithEmail = useCallback(async (data: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // ログイン試行開始ログ
      await featureLogger.logUserAction('login_attempt', {
        method: 'email',
        email: data.email,
        rememberMe: data.rememberMe
      });

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        setLastLogin('email');
        clearMfaResolver();
        
        // ログイン成功ログ
        await featureLogger.logUserAction('login_success', {
          method: 'email',
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          rememberMe: data.rememberMe
        });
        
        console.log('✅ メール認証でログインしました');
        return true;
      }

      return false;
    } catch (error: any) {
      // MFAが必要な場合
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = error.resolver as MultiFactorResolver;
        setMfaResolver(resolver);
        setMfaRequired(true);
        setError('多要素認証が必要です');
        
        // MFA要求ログ
        featureLogger.logSecurityEvent('mfa_required', {
          method: 'email',
          email: data.email,
          factorCount: resolver?.hints?.length || 0
        });
        
        console.log('🔐 MFA認証が必要です');
        return false;
      }

      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      
      // ログイン失敗ログ
      featureLogger.logError(error, {
        method: 'email',
        email: data.email,
        errorCode: error.code,
        errorMessage: errorMessage
      });
      
      console.error('❌ ログインエラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setLastLogin, getErrorMessage, setStoreError, setMfaRequired, clearMfaResolver, featureLogger]);

  // Googleログイン
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Google ログイン試行ログ
      await featureLogger.logUserAction('login_attempt', {
        method: 'google'
      });

      const provider = new GoogleAuthProvider();
      
      // カスタムパラメータの設定
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const userCredential: UserCredential = await signInWithPopup(auth, provider);

      if (userCredential.user) {
        setLastLogin('google');
        clearMfaResolver();
        
        // Google ログイン成功ログ
        await featureLogger.logUserAction('login_success', {
          method: 'google',
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          displayName: userCredential.user.displayName
        });
        
        console.log('✅ Google認証でログインしました');
        return true;
      }

      return false;
    } catch (error: any) {
      // ユーザーがキャンセルした場合は特別処理
      if (error.code === 'auth/popup-closed-by-user') {
        // キャンセルログ
        await featureLogger.logUserAction('login_cancelled', {
          method: 'google',
          reason: 'popup_closed'
        });
        
        console.log('ℹ️ ユーザーがログインをキャンセルしました');
        return false;
      }

      // MFAが必要な場合
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = error.resolver as MultiFactorResolver;
        setMfaResolver(resolver);
        setMfaRequired(true);
        setError('多要素認証が必要です');
        
        // MFA要求ログ
        featureLogger.logSecurityEvent('mfa_required', {
          method: 'google',
          factorCount: resolver?.hints?.length || 0
        });
        
        console.log('🔐 MFA認証が必要です');
        return false;
      }

      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      
      // Google ログイン失敗ログ
      featureLogger.logError(error, {
        method: 'google',
        errorCode: error.code,
        errorMessage: errorMessage
      });
      
      console.error('❌ Googleログインエラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setLastLogin, getErrorMessage, setStoreError, setMfaRequired, clearMfaResolver, featureLogger]);

  // パスキーログイン
  const loginWithPasskey = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // パスキー ログイン試行ログ
      await featureLogger.logUserAction('login_attempt', {
        method: 'passkey'
      });

      // 認証チャレンジを取得（本来はサーバーから取得）
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const challengeBase64 = btoa(String.fromCharCode(...challenge))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // パスキー認証を実行
      const credential = await authenticateWithPasskey({
        challenge: challengeBase64,
        // 登録済みの認証子を指定（実際の実装では保存された情報を使用）
        allowCredentials: undefined, // 全ての登録済み認証子を許可
      });

      if (!credential) {
        throw new Error('パスキー認証に失敗しました');
      }

      // 認証レスポンスを整形
      const formattedResponse = formatCredentialResponse(credential);
      
      // TODO: Firebase Custom Tokenベースの認証
      // 現在はデモンストレーション用のモック認証
      console.log('✅ パスキー認証レスポンス:', formattedResponse);

      // 一時的にゲストユーザーとしてログイン（デモ用）
      // 実際の実装では、サーバーでパスキーを検証してFirebase Custom Tokenを発行
      setLastLogin('passkey');
      clearMfaResolver();
      
      // パスキー ログイン成功ログ
      await featureLogger.logUserAction('login_success', {
        method: 'passkey',
        credentialId: credential.id,
        authenticatorType: credential.response.clientDataJSON ? 'platform' : 'cross-platform'
      });
      
      // セキュリティログ
      featureLogger.logSecurityEvent('passkey_authentication', {
        credentialId: credential.id,
        origin: window.location.origin,
        userAgent: navigator.userAgent
      });
      
      console.log('✅ パスキーでログインしました（デモモード）');
      return true;

    } catch (error: any) {
      console.error('❌ パスキーログインエラー:', error);
      
      // パスキー固有のエラーハンドリング
      if (error.message.includes('キャンセル')) {
        // キャンセルログ
        await featureLogger.logUserAction('login_cancelled', {
          method: 'passkey',
          reason: 'user_cancelled'
        });
        
        console.log('ℹ️ ユーザーがパスキー認証をキャンセルしました');
        return false;
      }
      
      if (error.message.includes('サポートされていません')) {
        setError('このデバイスではパスキーがサポートされていません');
      } else {
        setError(error.message || 'パスキー認証に失敗しました');
      }
      
      // パスキー ログイン失敗ログ
      featureLogger.logError(error, {
        method: 'passkey',
        errorMessage: error.message,
        userAgent: navigator.userAgent
      });
      
      setStoreError(error.message || 'パスキー認証に失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setLastLogin, setStoreError, clearMfaResolver, featureLogger]);

  // パスワード再設定
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // パスワード再設定試行ログ
      await featureLogger.logUserAction('password_reset_attempt', {
        email: email
      });

      await sendPasswordResetEmail(auth, email);
      
      // パスワード再設定成功ログ
      await featureLogger.logUserAction('password_reset_success', {
        email: email
      });
      
      // セキュリティログ
      featureLogger.logSecurityEvent('password_reset_email_sent', {
        email: email
      });
      
      console.log('✅ パスワード再設定メールを送信しました');
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setStoreError(errorMessage);
      
      // パスワード再設定失敗ログ
      featureLogger.logError(error, {
        email: email,
        errorCode: error.code,
        errorMessage: errorMessage
      });
      
      console.error('❌ パスワード再設定エラー:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getErrorMessage, setStoreError, featureLogger]);

  return {
    isLoading,
    error,
    mfaResolver,
    loginWithEmail,
    loginWithGoogle,
    loginWithPasskey,
    resetPassword,
    clearError,
    clearMfaResolver,
  };
};
