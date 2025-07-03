/**
 * 権限管理のためのカスタムフック
 * ユーザーの権限とロールを検証するためのAPI
 */
import { useCallback } from 'react';
import { useAuth } from '../context';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '../types/roles';

interface UsePermissionReturn {
  // 単一ロール検証
  hasRole: (requiredRole: UserRole) => boolean;
  
  // 複数ロール検証（いずれか）
  hasAnyRole: (requiredRoles: UserRole[]) => boolean;
  
  // 複数ロール検証（すべて）
  hasAllRoles: (requiredRoles: UserRole[]) => boolean;
  
  // 単一権限検証
  hasPermission: (requiredPermission: Permission) => boolean;
  
  // 複数権限検証（いずれか）
  hasAnyPermission: (requiredPermissions: Permission[]) => boolean;
  
  // 複数権限検証（すべて）
  hasAllPermissions: (requiredPermissions: Permission[]) => boolean;
  
  // ユーザーの全ロール取得
  getUserRoles: () => UserRole[];
  
  // ユーザーの全権限取得
  getUserPermissions: () => Permission[];
  
  // ユーザーが最も権限の強いロールを取得
  getHighestRole: () => UserRole | null;
  
  // 管理者かどうか
  isAdmin: () => boolean;
  
  // 同じ部門かどうかをチェック
  isSameDepartment: (departmentId: string) => boolean;
}

/**
 * ロールの強さの順位付け (強い順)
 */
const ROLE_STRENGTH: Record<UserRole, number> = {
  [UserRole.ADMIN]: 100,
  [UserRole.MANAGER]: 75,
  [UserRole.EMPLOYEE]: 50,
  [UserRole.GUEST]: 25
};

/**
 * ユーザーの権限を検証するためのカスタムフック
 * @returns 権限検証に関するメソッド群
 */
export function usePermission(): UsePermissionReturn {
  const { user } = useAuth();
  
  /**
   * ユーザーのロールを取得
   */
  const getUserRoles = useCallback((): UserRole[] => {
    if (!user?.customClaims?.roles) {
      return user?.uid ? [UserRole.EMPLOYEE] : []; // デフォルトは一般社員
    }
    return user.customClaims.roles;
  }, [user]);
  
  /**
   * ユーザーの権限を取得（カスタムClaimsから直接 + ロールから導出）
   */
  const getUserPermissions = useCallback((): Permission[] => {
    const explicitPermissions = user?.customClaims?.permissions || [];
    const roles = getUserRoles();
    
    // ロールから権限を取得して結合
    const roleBasedPermissions = roles.flatMap(role => DEFAULT_ROLE_PERMISSIONS[role] || []);
    
    // 重複を除去
    return Array.from(new Set([...explicitPermissions, ...roleBasedPermissions]));
  }, [user, getUserRoles]);
  
  /**
   * 特定のロールを持っているか確認
   */
  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    // 開発環境では一時的に管理者権限を付与
    if (process.env.NODE_ENV === 'development' && requiredRole === UserRole.ADMIN) {
      console.log('開発環境: 管理者権限を一時的に付与しています');
      return true;
    }
    
    const userRoles = getUserRoles();
    return userRoles.includes(requiredRole);
  }, [getUserRoles]);
  
  /**
   * 指定されたロールのいずれかを持っているか確認
   */
  const hasAnyRole = useCallback((requiredRoles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }, [getUserRoles]);
  
  /**
   * 指定されたロールのすべてを持っているか確認
   */
  const hasAllRoles = useCallback((requiredRoles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return requiredRoles.every(role => userRoles.includes(role));
  }, [getUserRoles]);
  
  /**
   * 特定の権限を持っているか確認
   */
  const hasPermission = useCallback((requiredPermission: Permission): boolean => {
    const userPermissions = getUserPermissions();
    return userPermissions.includes(requiredPermission);
  }, [getUserPermissions]);
  
  /**
   * 指定された権限のいずれかを持っているか確認
   */
  const hasAnyPermission = useCallback((requiredPermissions: Permission[]): boolean => {
    const userPermissions = getUserPermissions();
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  }, [getUserPermissions]);
  
  /**
   * 指定された権限のすべてを持っているか確認
   */
  const hasAllPermissions = useCallback((requiredPermissions: Permission[]): boolean => {
    const userPermissions = getUserPermissions();
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }, [getUserPermissions]);
  
  /**
   * ユーザーが持つ最も強いロールを取得
   */
  const getHighestRole = useCallback((): UserRole | null => {
    const userRoles = getUserRoles();
    if (userRoles.length === 0) return null;
    
    return userRoles.reduce((highest, current) => {
      return ROLE_STRENGTH[current] > ROLE_STRENGTH[highest] ? current : highest;
    }, userRoles[0]);
  }, [getUserRoles]);
  
  /**
   * 管理者かどうかを確認
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);
  
  /**
   * 同じ部門かどうかをチェック
   */
  const isSameDepartment = useCallback((departmentId: string): boolean => {
    const userDepartment = user?.customClaims?.department;
    if (!userDepartment) return false;
    
    return userDepartment === departmentId;
  }, [user]);
  
  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRoles,
    getUserPermissions,
    getHighestRole,
    isAdmin,
    isSameDepartment
  };
}
