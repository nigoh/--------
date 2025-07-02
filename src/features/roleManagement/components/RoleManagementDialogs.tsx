/**
 * 権限管理ダイアログ
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Button,
  Checkbox,
  CircularProgress
} from '@mui/material';
import { spacingTokens } from '../../../theme/designSystem';
import { Permission } from '../../../auth/types/roles';
import { useRoleManagementForm } from '../hooks/useRoleManagementForm';
import { useRoleManagementStore } from '../stores/useRoleManagementStore';

export const RoleManagementDialogs: React.FC = () => {
  const { users, loading } = useRoleManagementStore();
  const {
    permissionDialogOpen,
    closePermissionDialog,
    selectedUserId,
    selectedPermissions,
    handlePermissionToggle,
    savePermissions,
    groupPermissionsByCategory
  } = useRoleManagementForm();

  // 選択されているユーザー情報を取得
  const selectedUser = selectedUserId
    ? users.find(u => u.uid === selectedUserId)
    : null;

  return (
    <Dialog
      open={permissionDialogOpen}
      onClose={closePermissionDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>権限設定</DialogTitle>
      <DialogContent>
        {/* 選択ユーザー情報 */}
        {selectedUser && (
          <Box sx={{ mb: spacingTokens.md }}>
            <Typography variant="subtitle1">
              {selectedUser.displayName || 'ユーザー'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser.email}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: spacingTokens.md }} />
        
        {/* 権限選択エリア */}
        <Typography variant="subtitle2" gutterBottom>
          付与する権限を選択してください
        </Typography>
        
        {/* 権限カテゴリー別表示 */}
        {Object.entries(groupPermissionsByCategory()).map(([category, permissionList]) => (
          <Box key={category} sx={{ mb: spacingTokens.lg }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {category}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }}>
              {permissionList.map(permission => (
                <Box key={permission}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: selectedPermissions.includes(permission)
                        ? 'primary.main'
                        : 'divider',
                      borderRadius: 1,
                      p: spacingTokens.sm,
                      bgcolor: selectedPermissions.includes(permission)
                        ? 'action.selected'
                        : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handlePermissionToggle(permission)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={selectedPermissions.includes(permission)}
                        color="primary"
                      />
                      <Box>
                        <Typography variant="body2" noWrap>
                          {getPermissionDisplayName(permission)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {permission}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={closePermissionDialog}>キャンセル</Button>
        <Button onClick={savePermissions} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : '権限を保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 権限の表示名を取得
function getPermissionDisplayName(permission: Permission): string {
  // 権限名を「:」で分割して最後の部分を取得
  const parts = permission.split(':');
  
  // アクション名の変換
  const actionMap: Record<string, string> = {
    'view': '閲覧',
    'create': '作成',
    'edit': '編集',
    'delete': '削除',
    'approve': '承認',
    'assign': '割り当て',
    'all': '全て',
    'settings': '設定',
    'management': '管理'
  };
  
  // リソース名の変換
  const resourceMap: Record<string, string> = {
    'employee': '従業員情報',
    'timecard': 'タイムカード',
    'team': 'チーム',
    'expense': '経費',
    'equipment': '機器',
    'meeting': '会議室',
    'system': 'システム',
    'user': 'ユーザー',
    'role': 'ロール'
  };
  
  // 最初の部分はリソース名
  const resource = resourceMap[parts[0]] || parts[0];
  
  // アクションとターゲットの組み合わせ
  if (parts.length === 3 && parts[2] === 'all') {
    return `${resource}（全員）${actionMap[parts[1]] || parts[1]}`;
  }
  
  // 基本的なアクションの場合
  if (parts.length === 2) {
    return `${resource}${actionMap[parts[1]] || parts[1]}`;
  }
  
  return permission;
}
