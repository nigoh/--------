/**
 * 管理者アカウント作成ユーティリティ
 * 開発・初期設定用の管理者アカウント作成機能
 */
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '../types/roles';

interface CreateAdminUserData {
  email: string;
  password: string;
  displayName: string;
  employeeId?: string;
  department?: string;
  position?: string;
}

/**
 * Super Admin アカウントを作成
 * 開発環境や初期セットアップ時に使用
 */
export const createSuperAdminUser = async (userData: CreateAdminUserData) => {
  try {
    console.log('Super Admin アカウント作成開始:', userData.email);

    // 1. Firebase Authentication でユーザー作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;
    console.log('Firebase Auth ユーザー作成完了:', user.uid);

    // 2. プロフィール更新
    await updateProfile(user, {
      displayName: userData.displayName,
    });

    // 3. Firestoreにユーザー情報を保存
    const userDocData = {
      uid: user.uid,
      email: userData.email,
      name: userData.displayName,
      employeeId: userData.employeeId || `SA-${Date.now()}`,
      department: userData.department || 'システム管理部',
      position: userData.position || 'システム管理者',
      
      // Super Admin 権限を付与
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      permissions: [
        ...DEFAULT_ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]
      ],
      
      // 基本情報
      isActive: true,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      
      // 管理者フラグ
      isSuperAdmin: true,
      isSystemUser: true,
      
      // 追加情報
      avatar: null,
      phone: null,
      nameKana: null,
      birthDate: null,
      hireDate: new Date().toISOString().split('T')[0],
      skills: ['システム管理', 'ユーザー管理', 'セキュリティ管理'],
    };

    await setDoc(doc(db, 'users', user.uid), userDocData);
    console.log('Firestore ユーザーデータ保存完了');

    // 4. Custom Claims の設定（Admin SDK が必要）
    console.log('⚠️ Custom Claims の設定は Firebase Admin SDK が必要です');
    console.log('以下のコマンドを Firebase Functions で実行してください:');
    console.log(`admin.auth().setCustomUserClaims('${user.uid}', {
      roles: ['super_admin', 'admin'],
      permissions: ['*'],
      isSuperAdmin: true
    });`);

    return {
      success: true,
      user: user,
      uid: user.uid,
      message: 'Super Admin アカウントが正常に作成されました'
    };

  } catch (error: any) {
    console.error('Super Admin アカウント作成エラー:', error);
    
    // エラーメッセージの日本語化
    let errorMessage = 'アカウント作成に失敗しました';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'このメールアドレスは既に使用されています';
        break;
      case 'auth/weak-password':
        errorMessage = 'パスワードが脆弱です。6文字以上で設定してください';
        break;
      case 'auth/invalid-email':
        errorMessage = 'メールアドレスの形式が正しくありません';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'メール/パスワード認証が無効になっています';
        break;
    }

    return {
      success: false,
      error: error,
      message: errorMessage
    };
  }
};

/**
 * 管理者アカウント作成のデモ関数
 * 開発環境でのテスト用
 */
export const createDemoSuperAdmin = async () => {
  const demoAdminData: CreateAdminUserData = {
    email: 'admin@company.com',
    password: 'SecurePassword123!',
    displayName: 'システム管理者',
    employeeId: 'SA-001',
    department: 'システム管理部',
    position: 'システム管理者'
  };

  return await createSuperAdminUser(demoAdminData);
};

/**
 * 既存ユーザーをSuper Adminに昇格
 */
export const promoteToSuperAdmin = async (uid: string) => {
  try {
    // Firestoreのユーザー情報を更新
    await setDoc(doc(db, 'users', uid), {
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      permissions: [...DEFAULT_ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]],
      isSuperAdmin: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log(`ユーザー ${uid} をSuper Adminに昇格しました`);
    console.log('⚠️ Custom Claims の更新も必要です（Admin SDK使用）');
    
    return { success: true, message: 'Super Admin権限を付与しました' };
  } catch (error) {
    console.error('Super Admin昇格エラー:', error);
    return { success: false, error };
  }
};

/**
 * 開発環境での初期管理者設定チェック
 */
export const checkAndCreateInitialAdmin = async () => {
  try {
    // 既存のSuper Adminをチェック
    const usersRef = collection(db, 'users');
    const adminQuery = query(
      usersRef, 
      where('isSuperAdmin', '==', true),
      limit(1)
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    
    if (adminSnapshot.empty) {
      console.log('Super Admin が存在しません。初期管理者を作成しますか？');
      console.log('createDemoSuperAdmin() を実行してください');
      return { hasAdmin: false, message: '初期管理者の作成が必要です' };
    } else {
      console.log('Super Admin が存在します');
      return { hasAdmin: true, message: 'Super Admin が設定済みです' };
    }
  } catch (error) {
    console.error('管理者チェックエラー:', error);
    return { hasAdmin: false, error };
  }
};

// Firestore imports を追加
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
