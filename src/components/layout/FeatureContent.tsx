import React from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';

interface FeatureContentProps {
  children: React.ReactNode;
  elevation?: number;
  padding?: number | string;
  backgroundColor?: string;
  borderRadius?: number;
  variant?: 'paper' | 'transparent';
}

/**
 * 機能コンテンツ用の統一コンテナコンポーネント
 * 統一されたスタイリングとレスポンシブ対応を提供
 */
export const FeatureContent: React.FC<FeatureContentProps> = ({
  children,
  elevation = 1,
  padding = spacingTokens.lg,
  backgroundColor,
  borderRadius = shapeTokens.corner.large,
  variant = 'paper',
}) => {
  const theme = useTheme();

  const baseStyles = {
    borderRadius,
    p: padding,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  if (variant === 'transparent') {
    return (
      <Box sx={{
        ...baseStyles,
        backgroundColor: backgroundColor || 'transparent',
      }}>
        {children}
      </Box>
    );
  }

  return (
    <Paper
      elevation={elevation}
      sx={{
        ...baseStyles,
        backgroundColor: backgroundColor || theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {children}
    </Paper>
  );
};
