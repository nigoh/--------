import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { spacingTokens } from '../../theme/designSystem';

interface FeatureLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
  backgroundColor?: string;
}

/**
 * 全機能共通のベースレイアウトコンポーネント
 * 統一されたレイアウト構造とレスポンシブ対応を提供
 */
export const FeatureLayout: React.FC<FeatureLayoutProps> = ({
  children,
  title,
  maxWidth = false, // デフォルトを false に変更してフル幅に
  showHeader = false,
  headerContent,
  backgroundColor,
}) => {
  const theme = useTheme();

  const defaultBackground = backgroundColor || 
    `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`;

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: defaultBackground,
    }}>
      {/* ヘッダー部分（オプション） */}
      {showHeader && (
        <Box sx={{ 
          py: spacingTokens.md,
          px: { xs: spacingTokens.sm, sm: spacingTokens.md, md: spacingTokens.lg },
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}>
          <Container maxWidth={maxWidth} sx={{ px: 0 }}>
            {title && (
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: headerContent ? 2 : 0
                }}
              >
                {title}
              </Typography>
            )}
            {headerContent}
          </Container>
        </Box>
      )}

      {/* メインコンテンツ領域 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        width: '100%',
        height: '100%',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.action.hover,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.action.selected,
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: theme.palette.action.focus,
          },
        },
      }}>
        <Container 
          maxWidth={maxWidth}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            py: { xs: spacingTokens.xs, sm: spacingTokens.sm, md: spacingTokens.md },
            px: { xs: spacingTokens.xs, sm: spacingTokens.sm, md: spacingTokens.md },
            minHeight: '100%',
            width: '100%',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
