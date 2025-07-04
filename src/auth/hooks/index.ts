/**
 * 認証フックのエクスポート
 * 
 * 関心分離に従って機能ごとにfeaturesディレクトリに移動済み：
 * - useUserProfile → features/userProfile/hooks
 * - useUserPermissionManagement → features/permissionManagement/hooks
 * - MFA関連 → features/mfa/hooks
 * - Passkey関連 → features/passkey/hooks
 */
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';
export { useMFA } from './useMFA';
export { usePermission } from './usePermission';
export { useEmailVerification } from './useEmailVerification';
export { useBackupCodes } from './useBackupCodes';
export { useWebAuthn } from './useWebAuthn';

// リファクタリング済み - 以下のhooksは新しい場所に移動
// - useUserProfile → features/userProfile/hooks/useUserProfile
// - useUserPermissionManagement → features/permissionManagement/hooks/useUserPermissionManagement
