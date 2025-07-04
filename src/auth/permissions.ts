/**
 * Firebase Auth 権限管理ユーティリティ
 * Custom Claims と Firestore ベースの権限システム
 */
import React from 'react';
import { getIdTokenResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from './types/roles';

/**
 * Custom Claims の型定義
 */
interface CustomClaims {
  roles?: UserRole[];
  permissions?: Permission[];
  department?: string;
  position?: string;
  lastRoleUpdate?: string;
}

/**
 * Firestore ユーザーデータの型
 */
interface FirestoreUserData {
  roles: UserRole[];
  permissions: Permission[];
  isActive: boolean;
}

/**
 * ユーザーの Custom Claims を取得
 */
export const getUserCustomClaims = async (): Promise<CustomClaims | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const tokenResult = await getIdTokenResult(user, true); // 強制リフレッシュ
    return tokenResult.claims as CustomClaims;
  } catch (error) {
    console.error('Custom Claims取得エラー:', error);
    return null;
  }
};

/**
 * Firestore からユーザー権限を取得
 */
export const getUserPermissionsFromFirestore = async (uid: string): Promise<FirestoreUserData> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return { roles: [], permissions: [], isActive: false };
    }

    const userData = userDoc.data();
    return {
      roles: (userData.roles || []) as UserRole[],
      permissions: (userData.permissions || []) as Permission[],
      isActive: userData.isActive ?? true,
    };
  } catch (error) {
    console.error('Firestore権限取得エラー:', error);
    return { roles: [], permissions: [], isActive: false };
  }
};

/**
 * ユーザーが特定の権限を持っているかチェック
 */
export const hasPermission = async (permission: Permission): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // 1. Custom Claims から確認
    const claims = await getUserCustomClaims();
    if (claims?.permissions?.includes(permission)) return true;
    if (claims?.roles?.includes(UserRole.ADMIN) || claims?.roles?.includes(UserRole.SUPER_ADMIN)) return true;

    // 2. Firestore から確認
    const firestoreData = await getUserPermissionsFromFirestore(user.uid);
    if (!firestoreData.isActive) return false; // 非アクティブユーザーは権限なし

    // 直接権限を持っているか
    if (firestoreData.permissions.includes(permission)) return true;

    // ロールベースの権限チェック
    return firestoreData.roles.some((role: UserRole) => 
      DEFAULT_ROLE_PERMISSIONS[role]?.includes(permission)
    );

  } catch (error) {
    console.error('権限チェックエラー:', error);
    return false;
  }
};

/**
 * ユーザーが特定のロールを持っているかチェック
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Custom Claims から確認
    const claims = await getUserCustomClaims();
    if (claims?.roles?.includes(role)) return true;

    // Firestore から確認
    const firestoreData = await getUserPermissionsFromFirestore(user.uid);
    return firestoreData.roles.includes(role) && firestoreData.isActive;

  } catch (error) {
    console.error('ロールチェックエラー:', error);
    return false;
  }
};

/**
 * 管理者権限チェック
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole(UserRole.ADMIN);
};

/**
 * スーパー管理者権限チェック
 */
export const isSuperAdmin = async (): Promise<boolean> => {
  return await hasRole(UserRole.SUPER_ADMIN);
};

/**
 * 複数権限の同時チェック
 */
export const hasAnyPermission = async (permissions: Permission[]): Promise<boolean> => {
  const results = await Promise.all(
    permissions.map(permission => hasPermission(permission))
  );
  return results.some(result => result);
};

/**
 * 全権限の同時チェック
 */
export const hasAllPermissions = async (permissions: Permission[]): Promise<boolean> => {
  const results = await Promise.all(
    permissions.map(permission => hasPermission(permission))
  );
  return results.every(result => result);
};

/**
 * ユーザーの全権限を取得
 */
export const getUserAllPermissions = async (): Promise<Permission[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const permissions = new Set<Permission>();

    // Custom Claims から権限取得
    const claims = await getUserCustomClaims();
    if (claims?.permissions) {
      claims.permissions.forEach((perm: Permission) => permissions.add(perm));
    }

    // Firestore から権限取得
    const firestoreData = await getUserPermissionsFromFirestore(user.uid);
    if (!firestoreData.isActive) return []; // 非アクティブユーザーは権限なし

    // 直接権限
    firestoreData.permissions.forEach((perm: Permission) => permissions.add(perm));

    // ロールベースの権限
    firestoreData.roles.forEach((role: UserRole) => {
      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role];
      if (rolePermissions) {
        rolePermissions.forEach((perm: Permission) => permissions.add(perm));
      }
    });

    return Array.from(permissions);

  } catch (error) {
    console.error('全権限取得エラー:', error);
    return [];
  }
};

/**
 * 権限ベースのコンポーネント表示制御用Hook
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPermissions = async () => {
      try {
        const userPermissions = await getUserAllPermissions();
        setPermissions(userPermissions);
      } catch (error) {
        console.error('権限読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    // 認証状態の変更を監視
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        loadPermissions();
      } else {
        setPermissions([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return {
    permissions,
    loading,
    hasPermission: (permission: Permission) => permissions.includes(permission),
    hasRole: async (role: UserRole) => await hasRole(role),
    isAdmin: async () => await isAdmin(),
    isSuperAdmin: async () => await isSuperAdmin(),
  };
};
