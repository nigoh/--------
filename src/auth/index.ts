/**
 * 認証機能のエクスポート統合
 */

// Firebase設定
export { default as firebase, auth, db, functions } from './firebase';

// 型定義
export type {
  AuthUser,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  MfaSetupData,
  AuthErrorCode,
  AuthState,
  LoginMethod,
  MfaMethod,
  AuthAction,
  PasskeyCredential,
  AuthProviderConfig,
} from './types';

// コンテキスト
export { AuthProvider, useAuth, withAuth } from './context';

// ストア
export { useAuthStore, useAuthSelectors } from './stores/useAuthStore';

// フック
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useMFA } from './hooks/useMFA';
export { useUserProfile } from './hooks/useUserProfile';

// パスキー
export {
  isPasskeySupported,
  checkPlatformAuthenticatorAvailability,
  registerPasskey,
  authenticateWithPasskey,
  formatCredentialResponse,
  checkBiometricAvailability,
} from './passkey';
export type {
  PasskeyRegistrationData,
  PasskeyAuthenticationData,
} from './passkey';

// コンポーネント
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { PasswordResetForm } from './components/PasswordResetForm';
export { AuthPage } from './components/AuthPage';
export { UserProfileManagement } from './components/UserProfileManagement';
export { MFASetupDialog } from './components/MFASetupDialog';
export { MFAVerificationDialog } from './components/MFAVerificationDialog';
export { MFAManagement } from './components/MFAManagement';
