/**
 * 権限ベースのコンポーネント表示制御
 * HOCとコンポーネントレベルでの権限管理
 */
import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Permission, UserRole } from '../types/roles';
import { hasPermission, hasRole } from '../permissions';

// 権限チェック結果のローディング・エラー表示用コンポーネント
interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  role?: UserRole;
  permissions?: Permission[];
  roles?: UserRole[];
  requireAll?: boolean; // true: 全ての権限が必要, false: いずれかの権限があればOK
  fallback?: React.ReactNode;
  showError?: boolean;
}

/**
 * 権限ゲートコンポーネント
 * 指定された権限を持たないユーザーには子コンポーネントを表示しない
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  role,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback,
  showError = false,
}) => {
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkPermissions = async () => {
      try {
        let hasAccess = false;

        // 単一権限チェック
        if (permission) {
          hasAccess = await hasPermission(permission);
        }

        // 単一ロールチェック
        if (role) {
          hasAccess = hasAccess || await hasRole(role);
        }

        // 複数権限チェック
        if (permissions.length > 0) {
          const permissionResults = await Promise.all(
            permissions.map(perm => hasPermission(perm))
          );
          
          if (requireAll) {
            hasAccess = hasAccess || permissionResults.every(result => result);
          } else {
            hasAccess = hasAccess || permissionResults.some(result => result);
          }
        }

        // 複数ロールチェック
        if (roles.length > 0) {
          const roleResults = await Promise.all(
            roles.map(r => hasRole(r))
          );
          
          if (requireAll) {
            hasAccess = hasAccess || roleResults.every(result => result);
          } else {
            hasAccess = hasAccess || roleResults.some(result => result);
          }
        }

        setHasAccess(hasAccess);
      } catch (error) {
        console.error('権限チェックエラー:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [permission, role, permissions, roles, requireAll]);

  if (loading) {
    return fallback || null;
  }

  if (!hasAccess) {
    if (showError) {
      return (
        <Alert 
          severity="warning" 
          icon={<LockOutlined />}
          sx={{ mt: 2 }}
        >
          この機能を利用する権限がありません
        </Alert>
      );
    }
    return fallback || null;
  }

  return <>{children}</>;
};

/**
 * 管理者専用コンポーネント
 */
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback
}) => (
  <PermissionGate role={UserRole.ADMIN} fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * 権限ベースのページ保護用HOC
 */
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: {
    permission?: Permission;
    role?: UserRole;
    permissions?: Permission[];
    roles?: UserRole[];
    requireAll?: boolean;
  }
) => {
  const WithPermissionComponent: React.FC<P> = (props) => (
    <PermissionGate 
      {...requiredPermissions}
      fallback={
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <LockOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">アクセス権限がありません</Typography>
        </Box>
      }
      showError={false}
    >
      <WrappedComponent {...props} />
    </PermissionGate>
  );

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithPermissionComponent;
};
