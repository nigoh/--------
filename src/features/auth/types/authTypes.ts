/**
 * Authentication Types
 * 認証機能の型定義
 */

import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  customClaims?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
  emailVerificationSent: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface MFASetupInfo {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface PasskeyCredential {
  id: string;
  type: 'public-key';
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
}

export type AuthProvider = 'email' | 'google' | 'passkey';

export type MFAMethod = 'totp' | 'sms';

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Firebase Auth Error Codes
export const AUTH_ERROR_CODES = {
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  MFA_REQUIRED: 'auth/multi-factor-auth-required',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];