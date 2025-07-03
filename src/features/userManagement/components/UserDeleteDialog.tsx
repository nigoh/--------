/**
 * ユーザー削除確認ダイアログコンポーネント
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useUserManagementStore } from '../stores/useUserManagementStore';
import { DEPARTMENT_LABELS, POSITION_LABELS, ROLE_LABELS } from '../constants/userConstants';
import { UserRole, useAuth } from '@/auth';

export const UserDeleteDialog: React.FC = () => {
  const { user: currentUser } = useAuth();
  const {
    selectedUser,
    isDeleteDialogOpen,
    saving,
    deleteUser,
    closeDeleteDialog,
  } = useUserManagementStore();

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.uid);
    }
  };

  const handleCancel = () => {
    closeDeleteDialog();
  };

  if (!selectedUser) return null;

  const isCurrentUser = currentUser?.uid === selectedUser.uid;
  const hasAdminRole = selectedUser.roles.includes(UserRole.ADMIN) || 
                       selectedUser.roles.includes(UserRole.SUPER_ADMIN);

  return (
    <Dialog
      open={isDeleteDialogOpen}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1 }} />
          ユーザーの削除
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* 警告メッセージ */}
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>この操作は取り消せません。</strong>
            ユーザーを削除すると、関連するすべてのデータが失われます。
          </Typography>
        </Alert>

        {/* 自分自身を削除しようとしている場合の警告 */}
        {isCurrentUser && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>注意:</strong> 自分自身のアカウントを削除しようとしています。
              削除後はシステムにアクセスできなくなります。
            </Typography>
          </Alert>
        )}

        {/* 管理者ユーザーの場合の警告 */}
        {hasAdminRole && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>注意:</strong> このユーザーは管理者権限を持っています。
              削除前に他の管理者がいることを確認してください。
            </Typography>
          </Alert>
        )}

        {/* ユーザー情報表示 */}
        <Box sx={{ 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 1,
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={selectedUser.photoURL || undefined}
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              {selectedUser.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {selectedUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                社員番号:
              </Typography>
              <Typography variant="body2">
                {selectedUser.employeeId}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                部署:
              </Typography>
              <Typography variant="body2">
                {DEPARTMENT_LABELS[selectedUser.department as keyof typeof DEPARTMENT_LABELS] || selectedUser.department}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                役職:
              </Typography>
              <Typography variant="body2">
                {POSITION_LABELS[selectedUser.position as keyof typeof POSITION_LABELS] || selectedUser.position}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ロール:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selectedUser.roles.map((role) => (
                  <Chip
                    key={role}
                    label={ROLE_LABELS[role]}
                    size="small"
                    color={
                      role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
                        ? 'error'
                        : role === UserRole.MANAGER
                        ? 'warning'
                        : 'default'
                    }
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                入社日:
              </Typography>
              <Typography variant="body2">
                {new Date(selectedUser.joinDate).toLocaleDateString('ja-JP')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                ステータス:
              </Typography>
              <Chip
                label={selectedUser.isActive ? 'アクティブ' : '非アクティブ'}
                size="small"
                color={selectedUser.isActive ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          本当にこのユーザーを削除しますか？
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} disabled={saving}>
          キャンセル
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={saving}
          startIcon={<WarningIcon />}
        >
          {saving ? '削除中...' : '削除する'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
