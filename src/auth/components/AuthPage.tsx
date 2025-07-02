/**
 * 認証ページメインコンポーネント
 * ログイン・新規登録の切り替えを管理
 */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { spacingTokens } from '../../theme/designSystem';
import { useAuth } from '../context';

// 認証モード
type AuthMode = 'login' | 'register' | 'reset-password';

// Props型定義
interface AuthPageProps {
  defaultMode?: AuthMode;
  onAuthSuccess?: () => void;
}

/**
 * 認証ページコンポーネント
 */
export const AuthPage: React.FC<AuthPageProps> = ({
  defaultMode = 'login',
  onAuthSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();

  // 認証モード状態
  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 認証成功ハンドラー
  const handleAuthSuccess = useCallback(() => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  // 新規登録成功ハンドラー
  const handleRegisterSuccess = useCallback(() => {
    setSuccessMessage('登録が完了しました。確認メールをお送りしましたので、メールアドレスを確認してください。');
    setAuthMode('login');
  }, []);

  // パスワード再設定ハンドラー
  const handleForgotPassword = useCallback(() => {
    setAuthMode('reset-password');
  }, []);

  // 既にログイン済みの場合
  if (isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: spacingTokens.xl, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          既にログインしています
        </Typography>
        <Typography variant="body1" color="text.secondary">
          アプリケーションをお楽しみください。
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacingTokens.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? 'auto' : '80vh',
          width: '100%',
          position: 'relative',
          zIndex: 10, // 1から10に増加
        }}
      >
        {/* 成功メッセージ */}
        {successMessage && (
          <Fade in={!!successMessage}>
            <Box sx={{ width: '100%', mb: spacingTokens.lg }}>
              <Alert
                severity="success"
                onClose={() => setSuccessMessage(null)}
                sx={{
                  background: 'rgba(76, 175, 80, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.success.main}40`,
                  color: theme.palette.success.main,
                  '& .MuiAlert-icon': {
                    color: theme.palette.success.main,
                  },
                  '& .MuiAlert-action': {
                    color: theme.palette.success.main,
                  },
                }}
              >
                {successMessage}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* メインコンテンツエリア */}
        <Box 
          sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >

          {/* ログインフォーム */}
          {authMode === 'login' && (
            <Fade in={authMode === 'login'} timeout={300}>
              <Box sx={{ width: '100%' }}>
                <LoginForm
                  onSwitchToRegister={() => setAuthMode('register')}
                  onForgotPassword={handleForgotPassword}
                  onLoginSuccess={handleAuthSuccess}
                />
              </Box>
            </Fade>
          )}

          {/* 新規登録フォーム */}
          {authMode === 'register' && (
            <Fade in={authMode === 'register'} timeout={300}>
              <Box sx={{ width: '100%' }}>
                <RegisterForm
                  onSwitchToLogin={() => setAuthMode('login')}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              </Box>
            </Fade>
          )}

          {/* パスワード再設定フォーム（今後実装） */}
          {authMode === 'reset-password' && (
            <Fade in={authMode === 'reset-password'} timeout={300}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  パスワード再設定
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  パスワード再設定機能は今後実装予定です。
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setAuthMode('login')}
                >
                  ログインに戻る
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* フッター */}
        <Box sx={{ textAlign: 'center', mt: spacingTokens.xl, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 WorkApp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
