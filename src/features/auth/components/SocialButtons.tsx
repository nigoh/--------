/**
 * SocialButtons Component
 * ソーシャルログインボタンコンポーネント
 */

import React from 'react';
import {
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface SocialButtonsProps {
  loading?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
  loading = false,
}) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const { loginWithGoogle, loading: authLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const isLoading = loading || authLoading;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Google ログイン */}
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled={isLoading}
        onClick={handleGoogleLogin}
        startIcon={<Google />}
        sx={{
          py: 1.5,
          borderRadius: isHighContrast ? 0 : 2,
          borderColor: '#4285f4',
          color: '#4285f4',
          fontWeight: 500,
          '&:hover': {
            borderColor: '#3367d6',
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
          },
          '&:disabled': {
            borderColor: theme.palette.action.disabled,
            color: theme.palette.action.disabled,
          },
        }}
      >
        {isLoading ? 'ログイン中...' : 'Googleでログイン'}
      </Button>

      {/* 今後の拡張用：他のソーシャルプロバイダー */}
      {/* 
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled={isLoading}
        startIcon={<GitHub />}
        sx={{
          py: 1.5,
          borderRadius: isHighContrast ? 0 : 2,
          borderColor: '#333',
          color: '#333',
          fontWeight: 500,
          '&:hover': {
            borderColor: '#000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        GitHubでログイン
      </Button>
      */}
    </Box>
  );
};