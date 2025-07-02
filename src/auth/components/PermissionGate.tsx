/**
 * 権限に基づいたコンポーネントレンダリングを制御するコンポーネント
 * アクセス制御のためのHOCとして機能する
 */
import React, { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';
import { Permission, UserRole } from '../types/roles';

interface PermissionGateProps {
  /**
   * 必要なロール（指定した場合、このロールを持つユーザーのみアクセス可能）
   */
  requiredRole?: UserRole;
  
  /**
   * 必要なロールのリスト（複数ある場合はいずれかを持っていればアクセス可能）
   */
  requiredRoles?: UserRole[];
  
  /**
   * 必要な権限（指定した場合、この権限を持つユーザーのみアクセス可能）
   */
  requiredPermission?: Permission;
  
  /**
   * 必要な権限のリスト（複数ある場合はいずれかを持っていればアクセス可能）
   */
  requiredPermissions?: Permission[];
  
  /**
   * すべての権限が必要かどうか（trueの場合、requiredPermissionsのすべてが必要）
   */
  requireAll?: boolean;
  
  /**
   * 部門制限（指定した部門のユーザーのみアクセス可能）
   */
  departmentId?: string;
  
  /**
   * 表示する子要素
   */
  children: ReactNode;
  
  /**
   * 権限がない場合に表示する要素
   */
  fallback?: ReactNode;
}

/**
 * 権限ゲートコンポーネント
 * 権限に基づいてUIの表示/非表示を制御する
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  departmentId,
  children,
  fallback = null,
}) => {
  const {
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSameDepartment,
  } = usePermission();
  
  // アクセス権のチェックロジック
  const hasAccess = () => {
    // 各条件をチェック
    const roleCheck = 
      (requiredRole && hasRole(requiredRole)) || 
      (requiredRoles && hasAnyRole(requiredRoles)) ||
      (!requiredRole && !requiredRoles);
    
    let permissionCheck = true;
    if (requiredPermission) {
      permissionCheck = hasPermission(requiredPermission);
    } else if (requiredPermissions) {
      permissionCheck = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
    }
    
    const departmentCheck = !departmentId || isSameDepartment(departmentId);
    
    // すべての条件を満たす必要がある
    return roleCheck && permissionCheck && departmentCheck;
  };
  
  // 権限チェックが有効な場合のみレンダリング、それ以外はフォールバック表示
  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};
