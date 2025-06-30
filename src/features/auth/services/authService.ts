/**
 * Authentication Service
 * Firebase認証操作を管理するサービス層
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  AuthError,
  multiFactor,
  PhoneAuthProvider,
  RecaptchaVerifier,
  TotpMultiFactorGenerator,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { User, LoginCredentials, RegisterCredentials, AuthError as AppAuthError } from '../types/authTypes';
import { AUTH_ERROR_CODES } from '../types/authTypes';

/**
 * Firebase UserをアプリのUser型に変換
 */
export const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
  phoneNumber: firebaseUser.phoneNumber,
});

/**
 * Firebase AuthErrorをアプリのAuthError型に変換
 */
export const mapFirebaseError = (error: AuthError): AppAuthError => ({
  code: error.code,
  message: error.message,
  details: error,
});

/**
 * メール/パスワードでログイン
 */
export const loginWithEmail = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    // ユーザー情報をFirestoreに保存/更新
    await updateUserDocument(userCredential.user);
    
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * メール/パスワードでユーザー登録
 */
export const registerWithEmail = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    // プロフィール更新
    if (credentials.displayName) {
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });
    }
    
    // メール確認送信
    await sendEmailVerification(userCredential.user);
    
    // ユーザー情報をFirestoreに保存
    await createUserDocument(userCredential.user);
    
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * Googleソーシャルログイン
 */
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const userCredential = await signInWithPopup(auth, provider);
    
    // ユーザー情報をFirestoreに保存/更新
    await updateUserDocument(userCredential.user);
    
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * パスワードリセットメール送信
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * メール確認再送信
 */
export const resendEmailVerification = async (): Promise<void> => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in');
    }
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * パスワード更新
 */
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
    } else {
      throw new Error('No user is currently signed in');
    }
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * プロフィール更新
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
      await updateUserDocument(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in');
    }
  } catch (error) {
    throw mapFirebaseError(error as AuthError);
  }
};

/**
 * Firestoreにユーザードキュメントを作成
 */
const createUserDocument = async (user: FirebaseUser): Promise<void> => {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user', // デフォルトロール
    preferences: {
      theme: 'light',
      language: 'ja',
      notifications: true,
    },
  };
  
  await setDoc(userDocRef, userData);
};

/**
 * Firestoreのユーザードキュメントを更新
 */
const updateUserDocument = async (user: FirebaseUser): Promise<void> => {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  // ドキュメントが存在するかチェック
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    // 更新
    await updateDoc(userDocRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      updatedAt: new Date(),
    });
  } else {
    // 新規作成
    await createUserDocument(user);
  }
};

/**
 * 認証状態の監視
 */
export const observeAuthState = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): User | null => {
  if (auth.currentUser) {
    return mapFirebaseUser(auth.currentUser);
  }
  return null;
};