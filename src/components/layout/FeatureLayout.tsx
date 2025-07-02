import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { spacingTokens } from '../../theme/designSystem';
import { gradientTokens } from '../../theme/gradients';

interface FeatureLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
  backgroundColor?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  useGradient?: boolean;
}

/**
 * 全機能共通のベースレイアウトコンポーネント
 * 統一されたレイアウト構造とレスポンシブ対応を提供
 * 現代的なデザインシステムに基づく改良版
 */
export const FeatureLayout: React.FC<FeatureLayoutProps> = ({
  children,
  title,
  maxWidth = false,
  showHeader = false,
  headerContent,
  backgroundColor,
  variant = 'gradient',
  useGradient = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 背景の決定
  const getBackground = () => {
    if (backgroundColor) return backgroundColor;
    
    switch (variant) {
      case 'elevated':
        return gradientTokens.themeAware.surfaceElevated(isDark);
      case 'glass':
        return gradientTokens.themeAware.glass(isDark);
      case 'gradient':
        return gradientTokens.themeAware.background(isDark);
      default:
        return theme.palette.background.default;
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: getBackground(),
      position: 'relative',
      // Glass morphism効果
      ...(variant === 'glass' && {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${gradientTokens.themeAware.glassBorder(isDark)}`,
      }),
    }}>
      {/* 装飾的オーバーレイ（グラデーション効果強化） */}
      {useGradient && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark 
              ? 'radial-gradient(ellipse at top, rgba(114, 99, 167, 0.15) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at top, rgba(114, 99, 167, 0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* ヘッダー部分（改良版） */}
      {showHeader && (
        <Box sx={{ 
          py: { xs: spacingTokens.md, md: spacingTokens.lg },
          px: { xs: spacingTokens.sm, sm: spacingTokens.md, md: spacingTokens.lg },
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: variant === 'glass' 
            ? gradientTokens.themeAware.surfaceElevated(isDark)
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <Container maxWidth={maxWidth} sx={{ px: 0 }}>
            {title && (
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: gradientTokens.primary.bold,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: headerContent ? 2 : 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
            )}
            {headerContent}
          </Container>
        </Box>
      )}

      {/* メインコンテンツ領域（改良版） */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        // 改良されたスクロールバー
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: isDark 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: isDark 
              ? 'rgba(255, 255, 255, 0.3)' 
              : 'rgba(0, 0, 0, 0.3)',
          },
        },
        // スムーススクロール
        scrollBehavior: 'smooth',
      }}>
        <Container 
          maxWidth={maxWidth}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            py: { xs: spacingTokens.md, sm: spacingTokens.lg, md: spacingTokens.xl },
            px: { xs: spacingTokens.md, sm: spacingTokens.lg, md: spacingTokens.xl },
            minHeight: '100%',
            width: '100%',
            position: 'relative',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
