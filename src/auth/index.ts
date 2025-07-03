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

// ロール・パーミッション型
export { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from './types/roles';
export type { UserPermissionData } from './types/roles';

// コンテキスト
export { AuthProvider, useAuth, withAuth } from './context';

// ストア
export { useAuthStore, useAuthSelectors } from './stores/useAuthStore';

// フック
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useMFA } from './hooks/useMFA';
export { useUserProfile } from './hooks/useUserProfile';
export { usePermission } from './hooks/usePermission';

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
export { PermissionGate } from './components/PermissionGate';
// UserProfileManagement は features/userProfile に移動しました
export { MFASetupDialog } from './components/MFASetupDialog';
export { MFAVerificationDialog } from './components/MFAVerificationDialog';
// MFAManagement は features/mfa に移動しました
// RoleManagementPage は features/roleManagement に移動しました
