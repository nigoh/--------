/**
 * Passkey Service
 * WebAuthn / Passkey認証サービス
 */

import { PasskeyCredential } from '../types/authTypes';
import { AUTH_CONSTANTS } from '../constants/authConstants';

/**
 * WebAuthn登録用のCredentialCreationOptions生成
 */
export const generateRegistrationOptions = (
  userId: string,
  userName: string,
  userDisplayName: string
): PublicKeyCredentialCreationOptions => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  return {
    challenge,
    rp: {
      name: 'Work App',
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(userId),
      name: userName,
      displayName: userDisplayName,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    timeout: AUTH_CONSTANTS.PASSKEY.TIMEOUT,
    attestation: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: AUTH_CONSTANTS.PASSKEY.USER_VERIFICATION as UserVerificationRequirement,
      residentKey: AUTH_CONSTANTS.PASSKEY.RESIDENT_KEY as ResidentKeyRequirement,
    },
  };
};

/**
 * WebAuthn認証用のCredentialRequestOptions生成
 */
export const generateAuthenticationOptions = (
  allowCredentials?: PublicKeyCredentialDescriptor[]
): PublicKeyCredentialRequestOptions => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  return {
    challenge,
    timeout: AUTH_CONSTANTS.PASSKEY.TIMEOUT,
    userVerification: AUTH_CONSTANTS.PASSKEY.USER_VERIFICATION as UserVerificationRequirement,
    allowCredentials: allowCredentials || [],
  };
};

/**
 * Passkeyの作成
 */
export const createPasskey = async (
  userId: string,
  userName: string,
  userDisplayName: string
): Promise<PasskeyCredential> => {
  try {
    // WebAuthnサポートチェック
    if (!navigator.credentials || !navigator.credentials.create) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const options = generateRegistrationOptions(userId, userName, userDisplayName);
    
    const credential = await navigator.credentials.create({
      publicKey: options,
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to create passkey');
    }

    return {
      id: credential.id,
      type: credential.type,
      rawId: credential.rawId,
      response: credential.response as AuthenticatorAttestationResponse,
    };
  } catch (error) {
    console.error('Passkey creation error:', error);
    throw new Error(`Passkey creation failed: ${(error as Error).message}`);
  }
};

/**
 * Passkeyを使用した認証
 */
export const authenticateWithPasskey = async (
  allowCredentials?: PublicKeyCredentialDescriptor[]
): Promise<PasskeyCredential> => {
  try {
    // WebAuthnサポートチェック
    if (!navigator.credentials || !navigator.credentials.get) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const options = generateAuthenticationOptions(allowCredentials);
    
    const credential = await navigator.credentials.get({
      publicKey: options,
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to authenticate with passkey');
    }

    return {
      id: credential.id,
      type: credential.type,
      rawId: credential.rawId,
      response: credential.response as AuthenticatorAssertionResponse,
    };
  } catch (error) {
    console.error('Passkey authentication error:', error);
    throw new Error(`Passkey authentication failed: ${(error as Error).message}`);
  }
};

/**
 * 条件付きUI認証 (Conditional UI)
 */
export const authenticateWithConditionalUI = async (): Promise<PasskeyCredential | null> => {
  try {
    // ブラウザサポートチェック
    if (!navigator.credentials || 
        !navigator.credentials.get ||
        !PublicKeyCredential.isConditionalMediationAvailable) {
      return null;
    }

    const available = await PublicKeyCredential.isConditionalMediationAvailable();
    if (!available) {
      return null;
    }

    const options = generateAuthenticationOptions();
    
    const credential = await navigator.credentials.get({
      publicKey: options,
      mediation: 'conditional',
    }) as PublicKeyCredential;

    if (!credential) {
      return null;
    }

    return {
      id: credential.id,
      type: credential.type,
      rawId: credential.rawId,
      response: credential.response as AuthenticatorAssertionResponse,
    };
  } catch (error) {
    console.error('Conditional UI authentication error:', error);
    return null;
  }
};

/**
 * プラットフォーム認証器の利用可能性チェック
 */
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  try {
    if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return false;
    }
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Platform authenticator check error:', error);
    return false;
  }
};

/**
 * ArrayBufferをBase64URLエンコード
 */
export const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Base64URLをArrayBufferにデコード
 */
export const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // パディング追加
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Passkey認証レスポンスの検証用データ準備
 */
export const prepareAuthenticationData = (credential: PasskeyCredential) => {
  const response = credential.response as AuthenticatorAssertionResponse;
  
  return {
    id: credential.id,
    rawId: arrayBufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      signature: arrayBufferToBase64Url(response.signature),
      userHandle: response.userHandle ? arrayBufferToBase64Url(response.userHandle) : null,
    },
  };
};

/**
 * Passkey登録レスポンスの検証用データ準備
 */
export const prepareRegistrationData = (credential: PasskeyCredential) => {
  const response = credential.response as AuthenticatorAttestationResponse;
  
  return {
    id: credential.id,
    rawId: arrayBufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      attestationObject: arrayBufferToBase64Url(response.attestationObject),
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
    },
  };
};