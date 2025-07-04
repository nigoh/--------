/**
 * 認証機能のエクスポート統合
 * 
 * 🔄 リファクタリング完了
 * - 認証画面コンポーネント → features/authentication
 * - 管理機能 → features/adminManagement  
 * - 権限管理 → features/permissionManagement
 * - ユーザープロフィール → features/userProfile
 * - MFA機能 → features/mfa
 * - パスキー機能 → features/passkey
 * - 共通権限ゲート → components/common
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

// フック（基本認証のみ）
export * from './hooks';

// パスキー（ユーティリティ）
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

// 権限ユーティリティ
export { 
  hasPermission, 
  hasRole, 
  isAdmin,
  isSuperAdmin,
  hasAnyPermission,
  hasAllPermissions,
  getUserAllPermissions,
  getUserCustomClaims,
  getUserPermissionsFromFirestore,
  usePermissions 
} from './permissions';

// 🚨 以下のコンポーネントは新しい場所に移動しました：
// - LoginForm, RegisterForm, AuthPage → features/authentication
// - PermissionGate → components/common
// - AdminUserCreator → features/adminManagement
// - MFAManagement → features/mfa
// - PasskeyManagement → features/passkey
// - UserProfile → features/userProfile
