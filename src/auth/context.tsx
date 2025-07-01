/**
 * Firebase認証コンテキスト
 * アプリケーション全体で認証状態を管理
 */
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type Unsubscribe
} from 'firebase/auth';
import { auth } from './firebase';
import type { AuthState, AuthUser } from './types';
import { useAuthStore } from './stores/useAuthStore';

// 認証コンテキストの型定義
interface AuthContextType {
  user: AuthUser | null;
  authState: AuthState;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// プロバイダーコンポーネントのProps型
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    authState,
    isLoading,
    setUser,
    setAuthState,
    setLoading,
    clearUser,
  } = useAuthStore();

  // ユーザー情報の更新
  const refreshUser = React.useCallback(async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        const idTokenResult = await auth.currentUser.getIdTokenResult(true);
        
        const authUser: AuthUser = {
          ...auth.currentUser,
          customClaims: idTokenResult.claims as AuthUser['customClaims']
        };
        
        setUser(authUser);
      } catch (error) {
        console.error('ユーザー情報の更新に失敗しました:', error);
      }
    }
  }, [setUser]);

  // ログアウト処理
  const signOut = React.useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      clearUser();
      setAuthState('unauthenticated');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearUser, setAuthState]);

  // Firebase認証状態の監視
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            // ユーザーがログイン中の場合
            const idTokenResult = await firebaseUser.getIdTokenResult();
            
            const authUser: AuthUser = {
              ...firebaseUser,
              customClaims: idTokenResult.claims as AuthUser['customClaims']
            };
            
            setUser(authUser);
            setAuthState('authenticated');
          } else {
            // ユーザーがログアウト状態の場合
            clearUser();
            setAuthState('unauthenticated');
          }
        } catch (error) {
          console.error('認証状態の更新に失敗しました:', error);
          clearUser();
          setAuthState('unauthenticated');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('認証状態の監視でエラーが発生しました:', error);
        clearUser();
        setAuthState('unauthenticated');
        setLoading(false);
      }
    );

    // クリーンアップ関数
    return () => {
      unsubscribe();
    };
  }, [setUser, setAuthState, setLoading, clearUser]);

  // コンテキスト値
  const contextValue: AuthContextType = {
    user,
    authState,
    isLoading,
    isAuthenticated: authState === 'authenticated',
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 認証コンテキストを使用するカスタムフック
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth は AuthProvider 内で使用してください');
  }
  
  return context;
};

/**
 * 認証が必要なコンポーネントをラップするHOC
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>認証状態を確認中...</div>;
    }

    if (!isAuthenticated) {
      return <div>ログインが必要です</div>;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
