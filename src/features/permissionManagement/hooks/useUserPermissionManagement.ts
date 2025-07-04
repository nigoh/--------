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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} にロール ${role} を設定しています`);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} からロール ${role} を削除しています`);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} に権限 ${permission} を追加しています`);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} から権限 ${permission} を削除しています`);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} の権限を一括設定しています:`, permissions);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} の部門を ${departmentId} に設定しています`);
        return { success: true };
      }
      
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
      // 開発環境では一時的にローカル処理
      if (process.env.NODE_ENV === 'development') {
        console.log(`開発環境: ユーザー ${uid} の役職を ${position} に設定しています`);
        return { success: true };
      }
      
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
