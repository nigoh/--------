/**
 * WebAuthn/FIDO2認証のカスタムフック
 * 生体認証・セキュリティキー対応
 */
import { useCallback, useState } from 'react';
import { multiFactor } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import type { 
  WebAuthnCredential, 
  WebAuthnSetupData, 
  WebAuthnAuthenticatorType,
  MfaMethod 
} from '../types';

// WebAuthnフックの戻り値型
interface UseWebAuthnReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  availableAuthenticators: WebAuthnAuthenticatorType[];
  
  // アクション
  checkSupport: () => Promise<boolean>;
  createCredential: (authenticatorType?: WebAuthnAuthenticatorType) => Promise<WebAuthnCredential | null>;
  authenticateCredential: (allowCredentials?: PublicKeyCredentialDescriptor[]) => Promise<WebAuthnCredential | null>;
  setupWebAuthnMFA: (authenticatorType?: WebAuthnAuthenticatorType) => Promise<boolean>;
  verifyWebAuthnMFA: (challenge: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * WebAuthn機能のカスタムフック
 */
export const useWebAuthn = (): UseWebAuthnReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [availableAuthenticators, setAvailableAuthenticators] = useState<WebAuthnAuthenticatorType[]>([]);
  
  const { setMfaVerified, setError: setStoreError } = useAuthStore();

  // エラーメッセージの変換
  const getErrorMessage = useCallback((errorName: string): string => {
    const errorMap: Record<string, string> = {
      'NotSupportedError': 'WebAuthnがサポートされていません',
      'NotAllowedError': '認証がキャンセルされました',
      'SecurityError': 'セキュリティエラーが発生しました',
      'InvalidStateError': '認証器が既に登録されています',
      'ConstraintError': '認証器の制約に違反しました',
      'UnknownError': '不明なエラーが発生しました',
      'AbortError': '認証がタイムアウトしました',
      'NetworkError': 'ネットワークエラーが発生しました',
    };
    return errorMap[errorName] || 'WebAuthn操作中にエラーが発生しました';
  }, []);

  // エラー処理
  const handleError = useCallback((error: any) => {
    const message = getErrorMessage(error.name || 'UnknownError');
    setError(message);
    setStoreError(message);
    console.error('WebAuthn Error:', error);
  }, [getErrorMessage, setStoreError]);

  // WebAuthnサポート確認
  const checkSupport = useCallback(async (): Promise<boolean> => {
    try {
      const supported = !!(
        window.PublicKeyCredential &&
        navigator.credentials
      );
      
      setIsSupported(supported);
      
      if (supported) {
        const authenticators: WebAuthnAuthenticatorType[] = [];
        
        // プラットフォーム認証器（生体認証）のサポート確認
        try {
          const platformSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          if (platformSupported) {
            authenticators.push('platform');
          }
        } catch (e) {
          console.warn('Platform authenticator check failed:', e);
        }
        
        // クロスプラットフォーム認証器（外部キー）は基本的に利用可能
        authenticators.push('cross-platform');
        
        setAvailableAuthenticators(authenticators);
      }
      
      return supported;
    } catch (error) {
      console.error('WebAuthn support check failed:', error);
      setIsSupported(false);
      return false;
    }
  }, []);

  // 認証情報作成（登録）
  const createCredential = useCallback(async (
    authenticatorType: WebAuthnAuthenticatorType = 'cross-platform'
  ): Promise<WebAuthnCredential | null> => {
    if (!auth.currentUser) {
      handleError({ name: 'InvalidStateError' });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // ユーザー情報
      const user = auth.currentUser;
      const userId = new TextEncoder().encode(user.uid);
      
      // チャレンジ生成（実際の実装では Firebase Functions から取得）
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      
      // 認証器選択設定
      const authenticatorSelection: AuthenticatorSelectionCriteria = {
        authenticatorAttachment: authenticatorType === 'platform' ? 'platform' : 'cross-platform',
        userVerification: 'required',
        residentKey: 'preferred',
      };

      // 公開鍵パラメータ
      const pubKeyCredParams: PublicKeyCredentialParameters[] = [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ];

      // WebAuthn作成オプション
      const createOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'WorkApp',
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: user.email || user.uid,
            displayName: user.displayName || user.email || 'User',
          },
          pubKeyCredParams,
          authenticatorSelection,
          timeout: 60000,
          attestation: 'direct',
        },
      };

      // 認証情報作成
      const credential = await navigator.credentials.create(createOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('認証情報の作成に失敗しました');
      }

      // 結果を変換
      const webAuthnCredential: WebAuthnCredential = {
        id: credential.id,
        type: 'public-key',
        rawId: credential.rawId,
        response: {
          clientDataJSON: (credential.response as AuthenticatorAttestationResponse).clientDataJSON,
          authenticatorData: (credential.response as AuthenticatorAttestationResponse).getAuthenticatorData(),
          attestationObject: (credential.response as AuthenticatorAttestationResponse).attestationObject,
        },
        authenticatorAttachment: credential.authenticatorAttachment || undefined,
        clientExtensionResults: credential.getClientExtensionResults(),
      };

      return webAuthnCredential;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // 認証実行（ログイン）
  const authenticateCredential = useCallback(async (
    allowCredentials?: PublicKeyCredentialDescriptor[]
  ): Promise<WebAuthnCredential | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // チャレンジ生成（実際の実装では Firebase Functions から取得）
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      // WebAuthn認証オプション
      const getOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials: allowCredentials || [],
        },
      };

      // 認証実行
      const credential = await navigator.credentials.get(getOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('認証に失敗しました');
      }

      // 結果を変換
      const webAuthnCredential: WebAuthnCredential = {
        id: credential.id,
        type: 'public-key',
        rawId: credential.rawId,
        response: {
          clientDataJSON: (credential.response as AuthenticatorAssertionResponse).clientDataJSON,
          authenticatorData: (credential.response as AuthenticatorAssertionResponse).authenticatorData,
          signature: (credential.response as AuthenticatorAssertionResponse).signature,
          userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle,
        },
        authenticatorAttachment: credential.authenticatorAttachment || undefined,
        clientExtensionResults: credential.getClientExtensionResults(),
      };

      return webAuthnCredential;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // WebAuthn MFA設定
  const setupWebAuthnMFA = useCallback(async (
    authenticatorType: WebAuthnAuthenticatorType = 'cross-platform'
  ): Promise<boolean> => {
    if (!auth.currentUser) {
      handleError({ name: 'InvalidStateError' });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // WebAuthn認証情報作成
      const credential = await createCredential(authenticatorType);
      if (!credential) {
        return false;
      }

      // Firebase MFA登録
      // TODO: Firebase Functions でWebAuthn認証情報を検証・登録
      // const multiFactorSession = await multiFactor(auth.currentUser).getSession();
      // await registerWebAuthnCredential(credential, multiFactorSession);

      setMfaVerified(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [createCredential, handleError, setMfaVerified]);

  // WebAuthn MFA認証
  const verifyWebAuthnMFA = useCallback(async (challenge: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // 登録済み認証情報で認証実行
      const credential = await authenticateCredential();
      if (!credential) {
        return false;
      }

      // Firebase MFA認証
      // TODO: Firebase Functions でWebAuthn認証を検証
      // await verifyWebAuthnCredential(credential, challenge);

      setMfaVerified(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authenticateCredential, handleError, setMfaVerified]);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    isSupported,
    availableAuthenticators,
    checkSupport,
    createCredential,
    authenticateCredential,
    setupWebAuthnMFA,
    verifyWebAuthnMFA,
    clearError,
  };
};
