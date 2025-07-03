import React from 'react';
import {
  Fab as MuiFab,
  Tooltip,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { FABProps } from './types';
import { buttonStyles } from '../../../theme/componentStyles';

/**
 * 統一されたFloating Action Buttonコンポーネント
 * プロジェクト全体で使用する基本FAB
 */
const FAB: React.FC<FABProps> = ({
  size = 'medium',
  color = 'primary',
  tooltip,
  label,
  loading = false,
  children,
  disabled,
  sx,
  ...props
}) => {
  const theme = useTheme();

  // サイズマッピング
  const sizeMap: Record<typeof size, 'small' | 'medium' | 'large'> = {
    small: 'small',
    medium: 'medium',
    large: 'large'
  };

  // 拡張FAB（labelがある場合）
  const isExtended = Boolean(label);

  // FABコンテンツ
  const fabContent = (
    <MuiFab
      size={sizeMap[size]}
      color={color}
      variant={isExtended ? 'extended' : 'circular'}
      disabled={disabled || loading}
      sx={[
        buttonStyles.fab(theme),
        // 拡張FABのスタイル
        isExtended && {
          px: 2,
          gap: 1,
        },
        // ローディング時のスタイル調整
        loading && {
          pointerEvents: 'none' as const,
          opacity: 0.7,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 28 : 24}
            sx={{ color: 'inherit' }}
          />
          {isExtended && label && (
            <Typography variant="button" sx={{ textTransform: 'none' }}>
              {label}
            </Typography>
          )}
        </Box>
      ) : (
        <>
          {children}
          {isExtended && label && (
            <Typography variant="button" sx={{ textTransform: 'none' }}>
              {label}
            </Typography>
          )}
        </>
      )}
    </MuiFab>
  );

  // ツールチップがある場合はラップ
  if (tooltip && !disabled) {
    return (
      <Tooltip title={tooltip} placement="top">
        <span>{fabContent}</span>
      </Tooltip>
    );
  }

  return fabContent;
};

export default FAB;
