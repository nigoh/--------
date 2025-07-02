/**
 * 権限管理フォーム用Hook
 */
import { useCallback, useState } from 'react';
import { Permission, UserRole } from '../../../auth/types/roles';
import { useUserPermissionManagement } from '../../../auth/hooks/useUserPermissionManagement';
import { PERMISSION_CATEGORIES } from '../constants/roleManagementConstants';
import { useRoleManagementStore } from '../stores/useRoleManagementStore';

export interface UserFormData {
  roles: UserRole[];
  department?: string;
  position?: string;
}

export function useRoleManagementForm() {
  // 状態
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UserFormData>({ roles: [] });
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  // Store
  const { users, loading, updateUsers } = useRoleManagementStore();
  
  // Auth hooks
  const {
    setUserRole,
    removeUserRole,
    setUserPermissions,
    setUserDepartment,
    setUserPosition
  } = useUserPermissionManagement();

  // 編集開始
  const startEditing = useCallback((userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (user) {
      setEditingUserId(userId);
      setEditData({
        roles: [...user.roles],
        department: user.department,
        position: user.position
      });
    }
  }, [users]);
  
  // 編集キャンセル
  const cancelEditing = useCallback(() => {
    setEditingUserId(null);
    setEditData({ roles: [] });
  }, []);
  
  // 編集保存
  const saveEditing = useCallback(async () => {
    if (!editingUserId) return;
    
    try {
      const user = users.find(u => u.uid === editingUserId);
      if (!user) throw new Error('ユーザーが見つかりません');
      
      // ロール設定
      if (editData.roles) {
        // 追加されたロール
        const rolesToAdd = editData.roles.filter(role => !user.roles.includes(role));
        // 削除されたロール
        const rolesToRemove = user.roles.filter(role => !editData.roles.includes(role));
        
        // ロール追加
        for (const role of rolesToAdd) {
          await setUserRole(editingUserId, role);
        }
        
        // ロール削除
        for (const role of rolesToRemove) {
          await removeUserRole(editingUserId, role);
        }
      }
      
      // 部門設定
      if (editData.department !== undefined && editData.department !== user.department) {
        await setUserDepartment(editingUserId, editData.department);
      }
      
      // 役職設定
      if (editData.position !== undefined && editData.position !== user.position) {
        await setUserPosition(editingUserId, editData.position);
      }
      
      // 編集後のデータで更新
      updateUsers(prevUsers => prevUsers.map(u => {
        if (u.uid === editingUserId) {
          return {
            ...u,
            roles: editData.roles || u.roles,
            department: editData.department !== undefined ? editData.department : u.department,
            position: editData.position !== undefined ? editData.position : u.position
          };
        }
        return u;
      }));
      
      setEditingUserId(null);
      setEditData({ roles: [] });
    } catch (err) {
      console.error('ユーザー編集エラー:', err);
      // エラーハンドリング（useRoleManagementStoreでエラー表示）
    }
  }, [editingUserId, editData, users, setUserRole, removeUserRole, setUserDepartment, setUserPosition, updateUsers]);
  
  // 権限編集ダイアログを開く
  const openPermissionDialog = useCallback((userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedPermissions([...user.permissions]);
      setPermissionDialogOpen(true);
    }
  }, [users]);
  
  // 権限編集ダイアログを閉じる
  const closePermissionDialog = useCallback(() => {
    setPermissionDialogOpen(false);
    setSelectedUserId(null);
    setSelectedPermissions([]);
  }, []);
  
  // 権限を保存
  const savePermissions = useCallback(async () => {
    if (!selectedUserId) return;
    
    try {
      await setUserPermissions(selectedUserId, selectedPermissions);
      
      // 権限を更新
      updateUsers((prevUsers: any[]) => prevUsers.map(u => {
        if (u.uid === selectedUserId) {
          return {
            ...u,
            permissions: selectedPermissions
          };
        }
        return u;
      }));
      
      closePermissionDialog();
    } catch (err) {
      console.error('権限設定エラー:', err);
      // エラーハンドリング（useRoleManagementStoreでエラー表示）
    }
  }, [selectedUserId, selectedPermissions, setUserPermissions, updateUsers, closePermissionDialog]);
  
  // 権限変更ハンドラー
  const handlePermissionToggle = useCallback((permission: Permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  }, []);
  
  // ロール変更ハンドラー
  const handleRoleToggle = useCallback((role: UserRole) => {
    setEditData(prev => {
      const currentRoles = [...prev.roles];
      if (currentRoles.includes(role)) {
        return { ...prev, roles: currentRoles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
  }, []);
  
  // 部門変更ハンドラー
  const handleDepartmentChange = useCallback((department: string) => {
    setEditData(prev => ({ ...prev, department }));
  }, []);
  
  // 役職変更ハンドラー
  const handlePositionChange = useCallback((position: string) => {
    setEditData(prev => ({ ...prev, position }));
  }, []);
  
  // 権限をカテゴリーごとにグループ化
  const groupPermissionsByCategory = useCallback(() => {
    const categories: {[key: string]: Permission[]} = {
      '従業員管理': [],
      'タイムカード': [],
      'チーム管理': [],
      '経費精算': [],
      '機器管理': [],
      '会議室予約': [],
      'システム設定': []
    };
    
    Object.values(Permission).forEach(permission => {
      const prefix = permission.split(':')[0];
      const category = PERMISSION_CATEGORIES[prefix] || 'その他';
      
      if (categories[category]) {
        categories[category].push(permission);
      } else {
        categories[category] = [permission];
      }
    });
    
    // 空のカテゴリーを削除
    return Object.fromEntries(
      Object.entries(categories).filter(([_, permissions]) => permissions.length > 0)
    );
  }, []);

  return {
    editingUserId,
    editData,
    permissionDialogOpen,
    selectedUserId,
    selectedPermissions,
    startEditing,
    cancelEditing,
    saveEditing,
    openPermissionDialog,
    closePermissionDialog,
    savePermissions,
    handlePermissionToggle,
    handleRoleToggle,
    handleDepartmentChange,
    handlePositionChange,
    groupPermissionsByCategory
  };
}
