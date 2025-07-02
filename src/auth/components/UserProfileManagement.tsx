/**
 * ユーザープロファイル管理コンポーネント
 * アカウント情報の表示・編集機能
 */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../context';
import { useUserProfile } from '../hooks/useUserProfile';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import type { ProfileUpdateData, EmailUpdateData, PasswordUpdateData } from '../hooks/useUserProfile';

/**
 * ユーザープロファイル管理コンポーネント
 */
export const UserProfileManagement: React.FC = () => {
  const theme = useTheme();
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
  }, [profileData, updateUserProfile]);

  // メールアドレス更新
  const handleEmailUpdate = useCallback(async () => {
    const success = await updateUserEmail(emailData);
    if (success) {
      setEditMode('none');
      setEmailData({ newEmail: '', currentPassword: '' });
    }
  }, [emailData, updateUserEmail]);

  // パスワード更新
  const handlePasswordUpdate = useCallback(async () => {
    const success = await updateUserPassword(passwordData);
    if (success) {
      setEditMode('none');
      setPasswordData({ currentPassword: '', newPassword: '' });
    }
  }, [passwordData, updateUserPassword]);

  // アカウント削除
  const handleAccountDelete = useCallback(async () => {
    const success = await deleteUserAccount(deletePassword);
    if (success) {
      setDeleteDialogOpen(false);
      await signOut();
    }
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

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            ログインが必要です
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: spacingTokens.md }}>
      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* プロファイル情報 */}
      <Card sx={{ mb: spacingTokens.md }}>
        <CardHeader
          avatar={
            <Avatar
              src={user.photoURL || undefined}
              sx={{ width: 60, height: 60 }}
            >
              {user.displayName?.[0] || user.email?.[0] || '?'}
            </Avatar>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {user.displayName || 'ユーザー'}
              </Typography>
              {user.emailVerified && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="認証済み"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>
          }
          subheader={user.email}
          action={
            editMode === 'none' && (
              <IconButton onClick={() => setEditMode('profile')}>
                <EditIcon />
              </IconButton>
            )
          }
        />

        {editMode === 'profile' && (
          <CardContent>
            <Stack spacing={spacingTokens.md}>
              <TextField
                fullWidth
                label="表示名"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                slotProps={{
                  input: {
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="プロフィール画像URL"
                value={profileData.photoURL}
                onChange={(e) => setProfileData(prev => ({ ...prev, photoURL: e.target.value }))}
                slotProps={{
                  input: {
                    startAdornment: <PhotoIcon color="action" sx={{ mr: 1 }} />,
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <LoadingButton
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loading={isLoading}
                  onClick={handleProfileUpdate}
                >
                  保存
                </LoadingButton>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  キャンセル
                </Button>
              </Box>
            </Stack>
          </CardContent>
        )}
      </Card>

      {/* メールアドレス変更 */}
      <Card sx={{ mb: spacingTokens.md }}>
        <CardHeader
          title="メールアドレス"
          subheader={user.email}
          action={
            editMode === 'none' && (
              <Button
                startIcon={<EmailIcon />}
                onClick={() => setEditMode('email')}
              >
                変更
              </Button>
            )
          }
        />

        {editMode === 'email' && (
          <CardContent>
            <Stack spacing={spacingTokens.md}>
              <TextField
                fullWidth
                label="新しいメールアドレス"
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                required
              />
              
              <TextField
                fullWidth
                label="現在のパスワード"
                type="password"
                value={emailData.currentPassword}
                onChange={(e) => setEmailData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <LoadingButton
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loading={isLoading}
                  onClick={handleEmailUpdate}
                >
                  確認メール送信
                </LoadingButton>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  キャンセル
                </Button>
              </Box>
            </Stack>
          </CardContent>
        )}
      </Card>

      {/* パスワード変更 */}
      <Card sx={{ mb: spacingTokens.md }}>
        <CardHeader
          title="パスワード"
          subheader="セキュリティのため定期的にパスワードを変更してください"
          action={
            editMode === 'none' && (
              <Button
                startIcon={<LockIcon />}
                onClick={() => setEditMode('password')}
              >
                変更
              </Button>
            )
          }
        />

        {editMode === 'password' && (
          <CardContent>
            <Stack spacing={spacingTokens.md}>
              <TextField
                fullWidth
                label="現在のパスワード"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
              
              <TextField
                fullWidth
                label="新しいパスワード"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                helperText="6文字以上で入力してください"
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <LoadingButton
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loading={isLoading}
                  onClick={handlePasswordUpdate}
                >
                  パスワード変更
                </LoadingButton>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  キャンセル
                </Button>
              </Box>
            </Stack>
          </CardContent>
        )}
      </Card>

      {/* アカウント削除 */}
      <Card>
        <CardHeader
          title="アカウント削除"
          subheader="この操作は取り消せません。十分ご注意ください。"
        />
        <CardContent>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            アカウントを削除
          </Button>
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>アカウント削除の確認</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: spacingTokens.md }}>
            本当にアカウントを削除しますか？この操作は取り消せません。
          </Typography>
          
          <TextField
            fullWidth
            label="パスワードを入力して確認"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <LoadingButton
            color="error"
            loading={isLoading}
            onClick={handleAccountDelete}
            disabled={!deletePassword}
          >
            削除実行
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
