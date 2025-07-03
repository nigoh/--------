/**
 * 権限管理のデバッグ画面
 * 開発環境での動作確認用
 */
import React from 'react';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';
import { useAuth } from '../../auth';
import { usePermission } from '../../auth/hooks/usePermission';
import { UserRole } from '../../auth/types/roles';
import { EnhancedRoleManagementList } from './EnhancedRoleManagementList';

export const DebugRoleManagement: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasRole, getUserRoles, getUserPermissions, isAdmin } = usePermission();

  if (isLoading) {
    return <div>認証状態を確認中...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        権限管理デバッグ画面
      </Typography>
      
      {/* 認証情報 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            認証情報
          </Typography>
          <Typography>認証状態: {isAuthenticated ? '認証済み' : '未認証'}</Typography>
          <Typography>ユーザーID: {user?.uid || 'なし'}</Typography>
          <Typography>メール: {user?.email || 'なし'}</Typography>
          <Typography>表示名: {user?.displayName || 'なし'}</Typography>
          <Typography>カスタムClaims: {JSON.stringify(user?.customClaims, null, 2)}</Typography>
        </CardContent>
      </Card>

      {/* 権限情報 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            権限情報
          </Typography>
          <Typography>ユーザーロール: {JSON.stringify(getUserRoles())}</Typography>
          <Typography>ユーザー権限: {JSON.stringify(getUserPermissions())}</Typography>
          <Typography>管理者権限: {isAdmin() ? 'あり' : 'なし'}</Typography>
          <Typography>ADMIN権限: {hasRole(UserRole.ADMIN) ? 'あり' : 'なし'}</Typography>
          <Typography>MANAGER権限: {hasRole(UserRole.MANAGER) ? 'あり' : 'なし'}</Typography>
          <Typography>EMPLOYEE権限: {hasRole(UserRole.EMPLOYEE) ? 'あり' : 'なし'}</Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* 権限管理画面 */}
      <Typography variant="h5" gutterBottom>
        権限管理機能
      </Typography>
      
      {isAuthenticated ? (
        <EnhancedRoleManagementList />
      ) : (
        <Card>
          <CardContent>
            <Typography color="error">
              ログインが必要です
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DebugRoleManagement;
