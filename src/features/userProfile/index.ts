/**
 * ユーザープロファイル機能のエントリポイント
 */

// メインコンポーネント
export { default as UserProfile } from './UserProfile';

// コンポーネント
export { UserProfileManager } from './components/UserProfileManager';

// フック
export { useUserProfileForm } from './hooks/useUserProfileForm';
export type { 
  ProfileUpdateData, 
  EmailUpdateData, 
  PasswordUpdateData 
} from './hooks/useUserProfileForm';
