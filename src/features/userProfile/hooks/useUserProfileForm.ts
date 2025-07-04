/**
 * ユーザープロファイル管理フォーム用Hook
 */
import { useState, useCallback } from 'react';
import { useAuth } from '../../../auth/context';
import { useUserProfile } from './useUserProfile';

// 型定義
export interface ProfileUpdateData {
  displayName: string;
  photoURL: string;
}

export interface EmailUpdateData {
  newEmail: string;
  currentPassword: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export function useUserProfileForm() {
  const { user, signOut } = useAuth();
  const {
    isLoading,
    error,
    clearError,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
  } = useUserProfile();

  // 編集モード状態
  const [editMode, setEditMode] = useState<'none' | 'profile' | 'email' | 'password'>('none');
  
  // フォームデータ
  const [profileData, setProfileData] = useState<ProfileUpdateData>({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });
  
  const [emailData, setEmailData] = useState<EmailUpdateData>({
    newEmail: '',
    currentPassword: '',
  });
  
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
  });

  // 削除確認ダイアログ
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // プロファイル更新
  const handleProfileUpdate = useCallback(async () => {
    const success = await updateUserProfile(profileData);
    if (success) {
      setEditMode('none');
    }
    return success;
  }, [profileData, updateUserProfile]);

  // メールアドレス更新
  const handleEmailUpdate = useCallback(async () => {
    const success = await updateUserEmail(emailData);
    if (success) {
      setEditMode('none');
      setEmailData({ newEmail: '', currentPassword: '' });
    }
    return success;
  }, [emailData, updateUserEmail]);

  // パスワード更新
  const handlePasswordUpdate = useCallback(async () => {
    const success = await updateUserPassword(passwordData);
    if (success) {
      setEditMode('none');
      setPasswordData({ currentPassword: '', newPassword: '' });
    }
    return success;
  }, [passwordData, updateUserPassword]);

  // アカウント削除
  const handleAccountDelete = useCallback(async () => {
    const success = await deleteUserAccount(deletePassword);
    if (success) {
      setDeleteDialogOpen(false);
      await signOut();
    }
    return success;
  }, [deletePassword, deleteUserAccount, signOut]);

  // 編集キャンセル
  const handleCancelEdit = useCallback(() => {
    setEditMode('none');
    setProfileData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    });
    setEmailData({ newEmail: '', currentPassword: '' });
    setPasswordData({ currentPassword: '', newPassword: '' });
    clearError();
  }, [user, clearError]);

  return {
    isLoading,
    error,
    clearError,
    profileData,
    setProfileData,
    emailData,
    setEmailData,
    passwordData,
    setPasswordData,
    editMode,
    setEditMode,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deletePassword,
    setDeletePassword,
    handleProfileUpdate,
    handleEmailUpdate,
    handlePasswordUpdate,
    handleAccountDelete,
    handleCancelEdit
  };
}
