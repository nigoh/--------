/**
 * パスキー（WebAuthn）認証ユーティリティ
 * Firebase Authentication Preview API対応
 */

// WebAuthn CredentialCreationOptions
interface ExtendedCredentialCreationOptions extends CredentialCreationOptions {
  publicKey: PublicKeyCredentialCreationOptions & {
    extensions?: {
      credProps?: boolean;
    };
  };
}

// WebAuthn CredentialRequestOptions
interface ExtendedCredentialRequestOptions extends CredentialRequestOptions {
  publicKey: PublicKeyCredentialRequestOptions;
}

/**
 * パスキー登録データ
 */
export interface PasskeyRegistrationData {
  challenge: string;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  rp: {
    name: string;
    id: string;
  };
}

/**
 * パスキー認証データ  
 */
export interface PasskeyAuthenticationData {
  challenge: string;
  allowCredentials?: {
    type: 'public-key';
    id: string;
  }[];
}

/**
 * パスキーサポート確認
 */
export const isPasskeySupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  );
};

/**
 * プラットフォーム認証の可用性確認
 */
export const checkPlatformAuthenticatorAvailability = async (): Promise<boolean> => {
  try {
    if (!isPasskeySupported()) {
      return false;
    }
    
    const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.warn('プラットフォーム認証の確認に失敗しました:', error);
    return false;
  }
};

/**
 * Base64URLエンコード
 */
const base64urlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Base64URLデコード
 */
const base64urlDecode = (str: string): ArrayBuffer => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const bytes = atob(str);
  const buffer = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    view[i] = bytes.charCodeAt(i);
  }
  return buffer;
};

/**
 * パスキー登録
 */
export const registerPasskey = async (
  registrationData: PasskeyRegistrationData
): Promise<PublicKeyCredential | null> => {
  try {
    if (!isPasskeySupported()) {
      throw new Error('パスキーがサポートされていません');
    }

    const options: ExtendedCredentialCreationOptions = {
      publicKey: {
        challenge: base64urlDecode(registrationData.challenge),
        rp: {
          name: registrationData.rp.name,
          id: registrationData.rp.id,
        },
        user: {
          id: new TextEncoder().encode(registrationData.user.id),
          name: registrationData.user.name,
          displayName: registrationData.user.displayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: true,
        },
        timeout: 60000,
        attestation: 'direct',
        extensions: {
          credProps: true,
        },
      },
    };

    const credential = await navigator.credentials.create(options);
    
    if (!credential || credential.type !== 'public-key') {
      throw new Error('パスキーの登録に失敗しました');
    }

    console.log('✅ パスキーを登録しました:', credential.id);
    return credential as PublicKeyCredential;
  } catch (error) {
    console.error('❌ パスキー登録エラー:', error);
    
    if ((error as Error).name === 'NotAllowedError') {
      throw new Error('パスキーの登録がキャンセルされました');
    } else if ((error as Error).name === 'NotSupportedError') {
      throw new Error('パスキーがサポートされていません');
    } else if ((error as Error).name === 'SecurityError') {
      throw new Error('セキュリティエラーが発生しました');
    }
    
    throw error;
  }
};

/**
 * パスキー認証
 */
export const authenticateWithPasskey = async (
  authenticationData: PasskeyAuthenticationData
): Promise<PublicKeyCredential | null> => {
  try {
    if (!isPasskeySupported()) {
      throw new Error('パスキーがサポートされていません');
    }

    const options: ExtendedCredentialRequestOptions = {
      publicKey: {
        challenge: base64urlDecode(authenticationData.challenge),
        allowCredentials: authenticationData.allowCredentials?.map(cred => ({
          type: cred.type,
          id: base64urlDecode(cred.id),
        })),
        userVerification: 'required',
        timeout: 60000,
      },
    };

    const credential = await navigator.credentials.get(options);
    
    if (!credential || credential.type !== 'public-key') {
      throw new Error('パスキーでの認証に失敗しました');
    }

    console.log('✅ パスキーで認証しました:', credential.id);
    return credential as PublicKeyCredential;
  } catch (error) {
    console.error('❌ パスキー認証エラー:', error);
    
    if ((error as Error).name === 'NotAllowedError') {
      throw new Error('パスキーでの認証がキャンセルされました');
    } else if ((error as Error).name === 'NotSupportedError') {
      throw new Error('パスキーがサポートされていません');
    } else if ((error as Error).name === 'SecurityError') {
      throw new Error('セキュリティエラーが発生しました');
    }
    
    throw error;
  }
};

/**
 * クレデンシャルレスポンスの変換
 */
export const formatCredentialResponse = (credential: PublicKeyCredential): Record<string, any> => {
  const response = credential.response as AuthenticatorAssertionResponse;
  
  return {
    id: credential.id,
    type: credential.type,
    rawId: base64urlEncode(credential.rawId),
    response: {
      clientDataJSON: base64urlEncode(response.clientDataJSON),
      authenticatorData: base64urlEncode(response.authenticatorData),
      signature: base64urlEncode(response.signature),
      userHandle: response.userHandle ? base64urlEncode(response.userHandle) : null,
    },
  };
};

/**
 * デバイス生体認証の確認
 */
export const checkBiometricAvailability = async (): Promise<{
  available: boolean;
  biometricType?: string;
}> => {
  try {
    if (!isPasskeySupported()) {
      return { available: false };
    }

    // プラットフォーム認証の確認
    const platformAvailable = await checkPlatformAuthenticatorAvailability();
    
    if (!platformAvailable) {
      return { available: false };
    }

    // デバイス固有の生体認証タイプを判定
    const userAgent = navigator.userAgent;
    let biometricType = 'biometric';
    
    if (/iPhone|iPad/.test(userAgent)) {
      biometricType = 'Face ID / Touch ID';
    } else if (/Android/.test(userAgent)) {
      biometricType = '指紋認証 / 顔認証';
    } else if (/Windows/.test(userAgent)) {
      biometricType = 'Windows Hello';
    } else if (/Mac/.test(userAgent)) {
      biometricType = 'Touch ID';
    }

    return {
      available: true,
      biometricType,
    };
  } catch (error) {
    console.warn('生体認証の確認に失敗しました:', error);
    return { available: false };
  }
};
