import { User as FirebaseUser } from 'firebase/auth';
import { UserRole, Permission } from './types/roles';

/**
 * 認証ユーザーの拡張型定義
 */
export interface AuthUser extends FirebaseUser {
  customClaims?: {
    roles?: UserRole[];
    permissions?: Permission[];
    department?: string;
    position?: string;
    lastRoleUpdate?: string;
  };
}

/**
 * ログインフォームデータ
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * 新規登録フォームデータ
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
}

/**
 * パスワード再設定フォームデータ
 */
export interface ResetPasswordFormData {
  email: string;
}

/**
 * MFA設定データ
 */
export interface MfaSetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

/**
 * 認証エラーコード
 */
export type AuthErrorCode = 
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'
  | 'auth/multi-factor-auth-required'
  | 'auth/invalid-verification-code'
  | 'auth/code-expired'
  | 'unknown';

/**
 * 認証状態
 */
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * ログイン方法
 */
export type LoginMethod = 'email' | 'google' | 'passkey';

/**
 * MFA方法
 */
export type MfaMethod = 'totp' | 'sms' | 'webauthn' | 'backup-code';

/**
 * WebAuthn認証器の種類
 */
export type WebAuthnAuthenticatorType = 'platform' | 'cross-platform';

/**
 * WebAuthn認証データ
 */
export interface WebAuthnCredential {
  id: string;
  type: 'public-key';
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    authenticatorData: ArrayBuffer;
    signature?: ArrayBuffer;
    attestationObject?: ArrayBuffer;
    userHandle?: ArrayBuffer | null;
  };
  authenticatorAttachment?: AuthenticatorAttachment;
  clientExtensionResults?: AuthenticationExtensionsClientOutputs;
}

/**
 * WebAuthn設定データ
 */
export interface WebAuthnSetupData {
  challenge: string;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  rp: {
    id: string;
    name: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
}

/**
 * バックアップコード
 */
export interface BackupCode {
  id: string;
  code: string;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}

/**
 * リスク評価結果
 */
export interface RiskAssessment {
  deviceFingerprint: string;
  locationRisk: 'low' | 'medium' | 'high';
  timePatternRisk: 'low' | 'medium' | 'high';
  behaviorRisk: 'low' | 'medium' | 'high';
  overallRisk: number;
  riskFactors: string[];
}

/**
 * アダプティブ認証設定
 */
export interface AdaptiveAuthConfig {
  enabled: boolean;
  riskThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  actions: {
    [key: string]: MfaMethod[];
  };
}

/**
 * 認証アクション
 */
export type AuthAction = 
  | 'login'
  | 'register'  
  | 'logout'
  | 'resetPassword'
  | 'verifyEmail'
  | 'setupMfa'
  | 'verifyMfa'
  | 'setupWebauthn'
  | 'generateBackupCodes';

/**
 * パスキー認証データ
 */
export interface PasskeyCredential {
  id: string;
  type: 'public-key';
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    authenticatorData: ArrayBuffer;
    signature: ArrayBuffer;
    userHandle: ArrayBuffer | null;
  };
}

/**
 * 認証プロバイダー設定
 */
export interface AuthProviderConfig {
  google: {
    enabled: boolean;
    customParameters?: Record<string, string>;
  };
  passkey: {
    enabled: boolean;
    rpId: string;
    rpName: string;
  };
  mfa: {
    enabled: boolean;
    methods: MfaMethod[];
    required: boolean;
  };
}
