import { User as FirebaseUser } from 'firebase/auth';

/**
 * 認証ユーザーの拡張型定義
 */
export interface AuthUser extends FirebaseUser {
  customClaims?: {
    role?: string;
    permissions?: string[];
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
export type MfaMethod = 'totp' | 'sms';

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
  | 'verifyMfa';

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
