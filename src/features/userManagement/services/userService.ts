/**
 * Firebase Firestore ユーザー管理サービス
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, UserRole, auth } from '@/auth';
import { 
  User, 
  CreateUserInput, 
  UpdateUserInput, 
  UserDocument, 
  UserFilters, 
  SortConfig, 
  UserListResult,
  UserStats 
} from '../types';

// コレクション名
const USERS_COLLECTION = 'users';

/**
 * Firebase Timestamp を Date に変換
 */
const timestampToDate = (timestamp: Timestamp | any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
};

/**
 * Firestore ドキュメントを User オブジェクトに変換
 */
const documentToUser = (doc: QueryDocumentSnapshot<DocumentData>): User => {
  const data = doc.data() as UserDocument;
  return {
    uid: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    lastLogin: data.lastLogin ? timestampToDate(data.lastLogin) : undefined,
  };
};

/**
 * ユーザー一覧を取得
 */
export const fetchUsers = async (
  filters: UserFilters = {},
  sortConfig: SortConfig = { field: 'name', direction: 'asc' },
  page: number = 1,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<UserListResult> => {
  try {
    console.log('fetchUsers called with:', { filters, sortConfig, page, pageSize });
    console.log('Firebase auth current user:', auth.currentUser);
    console.log('Firebase db instance:', db);
    
    const usersRef = collection(db, USERS_COLLECTION);
    console.log('Users collection reference created:', usersRef);
    
    // インデックス問題を回避するため、シンプルなクエリから開始
    let userQuery = query(usersRef);
    
    // 最も重要なフィルターのみを適用（インデックス問題回避）
    const hasFilters = (filters.roleFilter && filters.roleFilter !== 'all') ||
                      (filters.departmentFilter && filters.departmentFilter !== 'all') ||
                      (filters.positionFilter && filters.positionFilter !== 'all') ||
                      (filters.statusFilter && filters.statusFilter !== 'all') ||
                      (filters.skillFilter && filters.skillFilter !== 'all') ||
                      filters.lastLoginDays;

    if (!hasFilters) {
      // フィルターがない場合のみソートを適用
      userQuery = query(userQuery, orderBy(sortConfig.field as string, sortConfig.direction), limit(pageSize));
    } else {
      // フィルターがある場合は、最も重要なもの1つだけを適用
      if (filters.roleFilter && filters.roleFilter !== 'all') {
        userQuery = query(userQuery, where('roles', 'array-contains', filters.roleFilter), limit(pageSize));
      } else if (filters.departmentFilter && filters.departmentFilter !== 'all') {
        userQuery = query(userQuery, where('department', '==', filters.departmentFilter), limit(pageSize));
      } else if (filters.statusFilter === 'active') {
        userQuery = query(userQuery, where('isActive', '==', true), limit(pageSize));
      } else if (filters.statusFilter === 'inactive') {
        userQuery = query(userQuery, where('isActive', '==', false), limit(pageSize));
      } else {
        // 他のフィルターはクライアントサイドで処理
        userQuery = query(userQuery, limit(Math.min(pageSize * 3, 100))); // 余裕をもって多めに取得
      }
    }

    console.log('Firestore query filters:', {
      roleFilter: filters.roleFilter,
      departmentFilter: filters.departmentFilter,
      positionFilter: filters.positionFilter,
      statusFilter: filters.statusFilter,
      skillFilter: filters.skillFilter,
      lastLoginDays: filters.lastLoginDays,
      searchQuery: filters.searchQuery
    });

    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(userQuery);
    console.log('Query executed successfully, snapshot size:', querySnapshot.size);
    
    const users: User[] = [];

    querySnapshot.forEach((doc) => {
      const user = documentToUser(doc);
      
      // クライアントサイドでの追加フィルタリング
      let shouldInclude = true;
      
      // 検索クエリフィルター
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.employeeId.toLowerCase().includes(searchLower) ||
          (user.nameKana && user.nameKana.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) shouldInclude = false;
      }

      // DBで適用されなかったフィルターをクライアントサイドで処理
      if (shouldInclude && filters.departmentFilter && filters.departmentFilter !== 'all') {
        if (user.department !== filters.departmentFilter) shouldInclude = false;
      }

      if (shouldInclude && filters.positionFilter && filters.positionFilter !== 'all') {
        if (user.position !== filters.positionFilter) shouldInclude = false;
      }

      if (shouldInclude && filters.skillFilter && filters.skillFilter !== 'all') {
        if (!user.skills || !user.skills.includes(filters.skillFilter)) shouldInclude = false;
      }

      if (shouldInclude && filters.statusFilter && filters.statusFilter !== 'all') {
        const isActive = filters.statusFilter === 'active';
        if (user.isActive !== isActive) shouldInclude = false;
      }

      if (shouldInclude && filters.lastLoginDays) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - filters.lastLoginDays);
        if (!user.lastLogin || user.lastLogin < daysAgo) shouldInclude = false;
      }

      if (shouldInclude) {
        users.push(user);
      }
    });

    console.log(`Fetched ${querySnapshot.size} docs from Firestore, filtered to ${users.length} users`);

    // クライアントサイドでのソート（DBでソートできなかった場合）
    if (hasFilters) {
      users.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof User];
        const bValue = b[sortConfig.field as keyof User];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }

    // 総件数を取得（簡略版 - 実際にはカウント専用のクエリが必要）
    const totalSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const totalUsers = totalSnapshot.size;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
      users,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalUsers,
      }
    };

  } catch (error) {
    console.error('ユーザー一覧取得エラーの詳細:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Firebase DB instance:', db);
    
    throw new Error(`ユーザー一覧の取得に失敗しました: ${error instanceof Error ? error.message : error}`);
  }
};

/**
 * 特定のユーザーを取得
 */
export const fetchUser = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (!userDoc.exists()) {
      return null;
    }
    return documentToUser(userDoc as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    throw new Error('ユーザー情報の取得に失敗しました');
  }
};

/**
 * ユーザーを作成
 */
export const createUser = async (userData: CreateUserInput, createdBy?: string): Promise<string> => {
  try {
    const userDoc: Omit<UserDocument, 'createdAt' | 'updatedAt'> = {
      ...userData,
      createdBy,
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    throw new Error('ユーザーの作成に失敗しました');
  }
};

/**
 * ユーザー情報を更新
 */
export const updateUser = async (
  uid: string, 
  userData: UpdateUserInput, 
  updatedBy?: string
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...userData,
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('ユーザー更新エラー:', error);
    throw new Error('ユーザー情報の更新に失敗しました');
  }
};

/**
 * ユーザーを削除
 */
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    throw new Error('ユーザーの削除に失敗しました');
  }
};

/**
 * ユーザーのステータスを切り替え
 */
export const toggleUserStatus = async (uid: string, updatedBy?: string): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (!userDoc.exists()) {
      throw new Error('ユーザーが見つかりません');
    }

    const currentData = userDoc.data() as UserDocument;
    const userRef = doc(db, USERS_COLLECTION, uid);
    
    await updateDoc(userRef, {
      isActive: !currentData.isActive,
      updatedBy,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('ユーザーステータス更新エラー:', error);
    throw new Error('ユーザーステータスの更新に失敗しました');
  }
};

/**
 * 最終ログイン日時を更新
 */
export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error('最終ログイン更新エラー:', error);
    // ログイン時のエラーは非致命的なのでthrowしない
  }
};

/**
 * 社員番号の重複チェック
 */
export const checkEmployeeIdExists = async (employeeId: string, excludeUid?: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('employeeId', '==', employeeId));
    const querySnapshot = await getDocs(q);
    
    if (excludeUid) {
      // 更新時は現在のユーザーを除外
      return querySnapshot.docs.some(doc => doc.id !== excludeUid);
    }
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('社員番号重複チェックエラー:', error);
    return false;
  }
};

/**
 * ユーザー統計情報を取得
 */
export const fetchUserStats = async (): Promise<UserStats> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    const stats: UserStats = {
      total: 0,
      active: 0,
      inactive: 0,
      byRole: {
        [UserRole.SUPER_ADMIN]: 0,
        [UserRole.ADMIN]: 0,
        [UserRole.MANAGER]: 0,
        [UserRole.EMPLOYEE]: 0,
        [UserRole.GUEST]: 0,
      },
      byDepartment: {},
      recentJoins: 0,
    };

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    querySnapshot.forEach((doc) => {
      const user = documentToUser(doc);
      stats.total++;

      if (user.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      // ロール別統計
      user.roles.forEach(role => {
        stats.byRole[role]++;
      });

      // 部署別統計
      if (user.department) {
        stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
      }

      // 最近の入社
      if (new Date(user.joinDate) > oneMonthAgo) {
        stats.recentJoins++;
      }
    });

    return stats;
  } catch (error) {
    console.error('ユーザー統計取得エラー:', error);
    throw new Error('ユーザー統計の取得に失敗しました');
  }
};

/**
 * 開発環境用ダミーデータ生成
 */
export const generateDummyUsers = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('ダミーデータは開発環境でのみ生成可能です');
    return;
  }

  const dummyUsers: CreateUserInput[] = [
    {
      email: 'admin@example.com',
      displayName: '管理者 太郎',
      employeeId: 'EMP001',
      name: '管理者 太郎',
      nameKana: 'カンリシャ タロウ',
      department: 'management',
      position: 'ceo',
      phone: '090-1234-5678',
      joinDate: '2020-04-01',
      skills: ['経営戦略', 'チームマネジメント', 'プロジェクト管理'],
      roles: [UserRole.ADMIN],
      permissions: [],
      isActive: true,
      notes: 'システム管理者',
    },
    {
      email: 'manager@example.com',
      displayName: 'マネージャー 花子',
      employeeId: 'EMP002',
      name: 'マネージャー 花子',
      nameKana: 'マネージャー ハナコ',
      department: 'dev',
      position: 'manager',
      phone: '090-2345-6789',
      joinDate: '2021-01-15',
      skills: ['React', 'TypeScript', 'チームマネジメント', 'プロジェクト管理'],
      roles: [UserRole.MANAGER],
      permissions: [],
      isActive: true,
    },
    {
      email: 'employee@example.com',
      displayName: '社員 次郎',
      employeeId: 'EMP003',
      name: '社員 次郎',
      nameKana: 'シャイン ジロウ',
      department: 'dev',
      position: 'senior',
      phone: '090-3456-7890',
      joinDate: '2022-06-01',
      skills: ['JavaScript', 'React', 'Node.js', 'Firebase'],
      roles: [UserRole.EMPLOYEE],
      permissions: [],
      isActive: true,
    },
  ];

  try {
    for (const user of dummyUsers) {
      await createUser(user, 'system');
    }
    console.log('ダミーユーザーを作成しました');
  } catch (error) {
    console.error('ダミーユーザー作成エラー:', error);
  }
};
