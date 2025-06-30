/**
 * AuthLayout Component
 * 認証画面の共通レイアウトコンポーネント
 */

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();
  const { isDarkMode, isHighContrast } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        p: 2,
      }}
    >
      <Container maxWidth={maxWidth}>
        <Paper
          elevation={isHighContrast ? 0 : 8}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: isHighContrast ? 0 : 3,
            border: isHighContrast 
              ? `2px solid ${theme.palette.text.primary}` 
              : 'none',
            background: theme.palette.background.paper,
            ...(isDarkMode && !isHighContrast && {
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(18, 18, 18, 0.9)',
            }),
          }}
        >
          {/* ヘッダー */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* ロゴ・アイコンエリア */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: isHighContrast ? 0 : '50%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                color: theme.palette.primary.contrastText,
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              W
            </Box>

            {/* タイトル */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            {/* サブタイトル */}
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* メインコンテンツ */}
          <Box>
            {children}
          </Box>

          {/* フッター */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              © 2025 Work App. セキュアで快適な認証体験を提供します。
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};