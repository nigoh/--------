/**
 * AuthContext
 * 認証状態を提供するReactコンテキスト
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth, UseAuthReturn } from '../hooks/useAuth';

// コンテキストの型定義
interface AuthContextType extends UseAuthReturn {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証コンテキストプロバイダー
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [initialized, setInitialized] = React.useState(false);

  // 初期化完了の判定
  useEffect(() => {
    // 認証状態の初期化が完了したかを判定
    // ローディング中でない、またはユーザーが存在する場合に初期化完了とみなす
    if (!auth.loading || auth.user) {
      setInitialized(true);
    }
  }, [auth.loading, auth.user]);

  const contextValue: AuthContextType = {
    ...auth,
    initialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 認証コンテキストを使用するためのカスタムフック
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};