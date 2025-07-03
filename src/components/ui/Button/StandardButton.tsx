import React from 'react';
import { 
  Button as MuiButton, 
  CircularProgress, 
  useTheme,
  alpha
} from '@mui/material';
import { StandardButtonProps } from './types';
import { buttonStyles } from '../../../theme/componentStyles';
import { spacingTokens, motionTokens } from '../../../theme/designSystem';

/**
 * 統一されたスタンダードボタンコンポーネント
 * プロジェクト全体で使用する基本ボタン
 */
const StandardButton: React.FC<StandardButtonProps> = ({
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  loading = false,
  loadingText,
  startIcon,
  endIcon,
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

  // ローディング時のアイコン
  const loadingIcon = (
    <CircularProgress 
      size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
      sx={{ 
        color: 'inherit',
        mr: loadingText ? 1 : 0 
      }}
    />
  );

  // スタイルの組み合わせ
  const getButtonStyles = () => {
    const baseStyle = variant === 'contained' 
      ? buttonStyles.filled(theme)
      : variant === 'outlined'
      ? buttonStyles.outlined(theme)
      : buttonStyles.text(theme);

    const sizeStyle = size === 'small' 
      ? buttonStyles.small(theme)
      : size === 'large'
      ? {
          padding: `${spacingTokens.lg}px ${spacingTokens.xl}px`,
          fontSize: '1rem',
          minHeight: '48px'
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      // ローディング時のスタイル調整
      ...(loading && {
        pointerEvents: 'none' as const,
        opacity: 0.7,
      }),
    };
  };

  return (
    <MuiButton
      size={sizeMap[size]}
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={loading ? loadingIcon : startIcon}
      endIcon={loading ? undefined : endIcon}
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export default StandardButton;
