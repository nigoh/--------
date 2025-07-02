/**
 * 権限管理のためのカスタムフック
 * ユーザーの権限とロールを設定するAPI
 */
import { useCallback } from 'react';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { UserRole, Permission } from '../types/roles';

interface UseUserPermissionManagementReturn {
  // ユーザーにロールを設定
  setUserRole: (uid: string, role: UserRole) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーのロールを削除
  removeUserRole: (uid: string, role: UserRole) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーに権限を追加
  addUserPermission: (uid: string, permission: Permission) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーから権限を削除
  removeUserPermission: (uid: string, permission: Permission) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーの権限を一括設定
  setUserPermissions: (uid: string, permissions: Permission[]) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーの部門を設定
  setUserDepartment: (uid: string, departmentId: string) => Promise<{ success: boolean; error?: any }>;
  
  // ユーザーの役職を設定
  setUserPosition: (uid: string, position: string) => Promise<{ success: boolean; error?: any }>;
}

/**
 * 権限管理のためのカスタムフック
 * @returns 権限管理に関するメソッド群
 */
export function useUserPermissionManagement(): UseUserPermissionManagementReturn {
  const functions = getFunctions();
  
  /**
   * ユーザーにロールを設定
   */
  const setUserRole = useCallback(async (uid: string, role: UserRole) => {
    try {
      const setRole = httpsCallable(functions, 'setUserRole');
      await setRole({ uid, role });
      return { success: true };
    } catch (error) {
      console.error('ロール設定エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーのロールを削除
   */
  const removeUserRole = useCallback(async (uid: string, role: UserRole) => {
    try {
      const removeRole = httpsCallable(functions, 'removeUserRole');
      await removeRole({ uid, role });
      return { success: true };
    } catch (error) {
      console.error('ロール削除エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーに権限を追加
   */
  const addUserPermission = useCallback(async (uid: string, permission: Permission) => {
    try {
      const addPermission = httpsCallable(functions, 'addUserPermission');
      await addPermission({ uid, permission });
      return { success: true };
    } catch (error) {
      console.error('権限追加エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーから権限を削除
   */
  const removeUserPermission = useCallback(async (uid: string, permission: Permission) => {
    try {
      const removePermission = httpsCallable(functions, 'removeUserPermission');
      await removePermission({ uid, permission });
      return { success: true };
    } catch (error) {
      console.error('権限削除エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーの権限を一括設定
   */
  const setUserPermissions = useCallback(async (uid: string, permissions: Permission[]) => {
    try {
      const setPermissions = httpsCallable(functions, 'setUserPermissions');
      await setPermissions({ uid, permissions });
      return { success: true };
    } catch (error) {
      console.error('権限設定エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーの部門を設定
   */
  const setUserDepartment = useCallback(async (uid: string, departmentId: string) => {
    try {
      const setDepartment = httpsCallable(functions, 'setUserDepartment');
      await setDepartment({ uid, departmentId });
      return { success: true };
    } catch (error) {
      console.error('部門設定エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  /**
   * ユーザーの役職を設定
   */
  const setUserPosition = useCallback(async (uid: string, position: string) => {
    try {
      const setPosition = httpsCallable(functions, 'setUserPosition');
      await setPosition({ uid, position });
      return { success: true };
    } catch (error) {
      console.error('役職設定エラー:', error);
      return { success: false, error };
    }
  }, [functions]);
  
  return {
    setUserRole,
    removeUserRole,
    addUserPermission,
    removeUserPermission,
    setUserPermissions,
    setUserDepartment,
    setUserPosition
  };
}
