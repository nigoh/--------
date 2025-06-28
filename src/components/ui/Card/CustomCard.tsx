import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, useTheme } from '@mui/material';
import { surfaceStyles } from '../../../theme/componentStyles';

/**
 * Custom Card Component - Material Design 3 準拠
 * プロジェクト全体で使用する汎用カードコンポーネント
 */

export interface CustomCardProps extends Omit<MuiCardProps, 'elevation' | 'variant'> {
  /** カードの立体感レベル（1-5） */
  surfaceLevel?: 1 | 2 | 3 | 4 | 5;
  /** インタラクティブなカード（ホバー効果付き） */
  interactive?: boolean;
  /** カードバリアント */
  variant?: 'surface' | 'elevated' | 'outlined' | 'filled';
  /** カスタムホバー効果 */
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  /** 角丸サイズ */
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** アニメーション設定 */
  animated?: boolean;
  /** フォーカス可能（アクセシビリティ対応） */
  focusable?: boolean;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  surfaceLevel = 1,
  interactive = false,
  variant = 'elevated',
  hoverEffect = 'lift',
  borderRadius = 'small',
  animated = true,
  focusable = false,
  sx,
  ...props
}) => {
  const theme = useTheme();

  // 角丸サイズの取得
  const getBorderRadius = (): number => {
    switch (borderRadius) {
      case 'none': return 0;
      case 'small': return 8;
      case 'medium': return 12;
      case 'large': return 16;
      case 'extraLarge': return 28;
      default: return 8;
    }
  };

  // ホバー効果の取得
  const getHoverEffect = () => {
    if (hoverEffect === 'none') return {};
    
    switch (hoverEffect) {
      case 'lift':
        return {
          transform: 'translateY(-4px)',
          transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        };
      case 'glow':
        return {
          boxShadow: '0 0 20px rgba(103, 80, 164, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        };
      case 'scale':
        return {
          transform: 'scale(1.02)',
          transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        };
      default:
        return {};
    }
  };

  // バリアントに応じたスタイル
  const getVariantStyles = () => {
    switch (variant) {
      case 'surface':
        return surfaceStyles.surface(theme);
      case 'elevated':
        return surfaceStyles.elevated(surfaceLevel)(theme);
      case 'outlined':
        return {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        };
      case 'filled':
        return {
          backgroundColor: theme.palette.action.hover,
          boxShadow: 'none',
        };
      default:
        return surfaceStyles.elevated(surfaceLevel)(theme);
    }
  };

  // インタラクティブスタイル
  const getInteractiveStyles = () => {
    if (!interactive) return {};
    
    return {
      cursor: 'pointer',
      transition: animated ? 'all 0.3s cubic-bezier(0.2, 0, 0, 1)' : 'none',
      '&:hover': getHoverEffect(),
      '&:focus-visible': focusable ? {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
      } : {},
      '&:active': {
        transform: interactive && hoverEffect === 'lift' ? 'translateY(-2px)' : undefined,
      },
    };
  };

  // アクセシビリティ属性
  const getAccessibilityProps = () => {
    if (!interactive && !focusable) return {};
    
    return {
      tabIndex: focusable ? 0 : undefined,
      role: interactive ? 'button' : undefined,
      'aria-pressed': interactive ? false : undefined,
    };
  };

  return (
    <MuiCard
      {...props}
      {...getAccessibilityProps()}
      sx={{
        ...getVariantStyles(),
        borderRadius: getBorderRadius(),
        overflow: 'hidden',
        position: 'relative',
        ...getInteractiveStyles(),
        ...(sx as any),
      } as any}
    >
      {children}
    </MuiCard>
  );
};

export default CustomCard;
