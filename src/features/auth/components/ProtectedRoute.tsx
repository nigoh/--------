/**
 * ProtectedRoute Component
 * 認証が必要なルート用のガードコンポーネント
 */

import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography,
  useTheme,
} from '@mui/material';
import { useAuthContext } from './AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  fallback?: React.ReactNode;
}

/**
 * 認証保護されたルートコンポーネント
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = false,
  fallback,
}) => {
  const theme = useTheme();
  const { 
    isAuthenticated, 
    user, 
    loading, 
    initialized,
    isEmailVerified,
  } = useAuthContext();

  // 初期化中の表示
  if (!initialized || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          認証状態を確認中...
        </Typography>
      </Box>
    );
  }

  // 未認証の場合
  if (!isAuthenticated || !user) {
    return fallback || <AuthPage />;
  }

  // メール確認が必要な場合
  if (requireEmailVerification && !isEmailVerified) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="h5" gutterBottom>
            メール確認が必要です
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {user.email} に送信された確認メールのリンクをクリックしてください。
          </Typography>
          <Typography variant="body2" color="text.secondary">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </Typography>
        </Box>
      </Box>
    );
  }

  // 認証済みの場合、子コンポーネントを表示
  return <>{children}</>;
};