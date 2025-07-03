import React from 'react';
import {
  IconButton as MuiIconButton,
  Badge,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { IconButtonProps } from './types';
import { buttonStyles } from '../../../theme/componentStyles';

/**
 * 統一されたアイコンボタンコンポーネント
 * プロジェクト全体で使用する基本アイコンボタン
 */
const IconButton: React.FC<IconButtonProps> = ({
  size = 'medium',
  color = 'primary',
  tooltip,
  loading = false,
  badgeCount,
  badgeMax = 99,
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

  // ボタンコンテンツ
  const buttonContent = (
    <Badge
      badgeContent={badgeCount}
      max={badgeMax}
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          fontSize: size === 'small' ? '0.6rem' : '0.75rem',
          minWidth: size === 'small' ? 16 : 20,
          height: size === 'small' ? 16 : 20,
        },
      }}
    >
      <MuiIconButton
        size={sizeMap[size]}
        color={color}
        disabled={disabled || loading}
        sx={[
          buttonStyles.icon(theme),
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
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 28 : 24}
            sx={{ color: 'inherit' }}
          />
        ) : (
          children
        )}
      </MuiIconButton>
    </Badge>
  );

  // ツールチップがある場合はラップ
  if (tooltip && !disabled) {
    return (
      <Tooltip title={tooltip} placement="top">
        <span>{buttonContent}</span>
      </Tooltip>
    );
  }

  return buttonContent;
};

export default IconButton;
