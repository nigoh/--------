import React from 'react';
import { 
  CardContent as MuiCardContent, 
  CardContentProps as MuiCardContentProps, 
  useTheme 
} from '@mui/material';
import { spacingTokens } from '../../../theme/designSystem';

/**
 * Custom CardContent Component - Material Design 3 準拠
 * 統一されたパディングとレイアウトを提供するカードコンテンツコンポーネント
 */

export interface CustomCardContentProps extends MuiCardContentProps {
  /** パディングサイズ */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** 垂直方向のパディング */
  paddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** 水平方向のパディング */
  paddingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** コンテンツの配置 */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** フレックスレイアウト */
  flex?: boolean;
  /** フレックス方向 */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** アイテム間のギャップ */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** 高さを親に合わせる */
  fullHeight?: boolean;
  /** 最後の子要素のマージンボトムを削除 */
  removeLastChildMargin?: boolean;
}

const spacingMap = {
  none: 0,
  xs: spacingTokens.xs,
  sm: spacingTokens.sm,
  md: spacingTokens.md,
  lg: spacingTokens.lg,
  xl: spacingTokens.xl,
  xxl: spacingTokens.xxl,
};

export const CustomCardContent: React.FC<CustomCardContentProps> = ({
  children,
  padding = 'md',
  paddingY,
  paddingX,
  align = 'start',
  flex = false,
  flexDirection = 'column',
  gap = 'none',
  fullHeight = false,
  removeLastChildMargin = false,
  sx,
  ...props
}) => {
  const theme = useTheme();

  // パディング計算
  const getPadding = () => {
    const p = spacingMap[padding];
    const py = paddingY ? spacingMap[paddingY] : undefined;
    const px = paddingX ? spacingMap[paddingX] : undefined;

    if (py !== undefined && px !== undefined) {
      return { paddingY: py, paddingX: px };
    } else if (py !== undefined) {
      return { paddingY: py, paddingX: p };
    } else if (px !== undefined) {
      return { paddingY: p, paddingX: px };
    }
    return { padding: p };
  };

  // アライメントスタイル
  const getAlignmentStyles = () => {
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };

    return flex ? {
      display: 'flex',
      flexDirection,
      alignItems: alignMap[align],
      gap: spacingMap[gap],
      ...(fullHeight && { height: '100%' }),
    } : {};
  };

  return (
    <MuiCardContent
      {...props}
      sx={{
        ...getPadding(),
        ...getAlignmentStyles(),
        // MUIのデフォルトのlast-child paddingBottomを制御
        '&:last-child': {
          paddingBottom: removeLastChildMargin ? 0 : undefined,
        },
        // 最後の子要素のマージンを削除
        ...(removeLastChildMargin && {
          '& > *:last-child': {
            marginBottom: 0,
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MuiCardContent>
  );
};

export default CustomCardContent;
