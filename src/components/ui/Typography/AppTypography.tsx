/**
 * アプリケーション統一Typography コンポーネント
 * 
 * Material Design 3準拠のタイポグラフィシステム
 * 一元的なスタイル管理とテーマ対応
 */
import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps, useTheme, alpha } from '@mui/material';

// 拡張されたVariantタイプ
export type AppTypographyVariant = 
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | MuiTypographyProps['variant'];

// 特殊なスタイリングオプション
export interface TypographyStyleOptions {
  gradient?: boolean;
  gradientColors?: [string, string];
  glassEffect?: boolean;
  truncate?: boolean;
  maxLines?: number;
}

export interface AppTypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  variant?: AppTypographyVariant;
  styleOptions?: TypographyStyleOptions;
}

/**
 * Material Design 3のタイポグラフィスケール定義
 */
const typographyScale = {
  displayLarge: {
    fontSize: { xs: '3rem', md: '3.5rem' },
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
  },
  displayMedium: {
    fontSize: { xs: '2.5rem', md: '2.8rem' },
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
  },
  displaySmall: {
    fontSize: { xs: '2rem', md: '2.25rem' },
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
  },
  headlineLarge: {
    fontSize: { xs: '1.75rem', md: '2rem' },
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
  },
  headlineMedium: {
    fontSize: { xs: '1.5rem', md: '1.75rem' },
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.005em',
  },
  headlineSmall: {
    fontSize: { xs: '1.25rem', md: '1.5rem' },
    fontWeight: 600,
    lineHeight: 1.35,
  },
  titleLarge: {
    fontSize: { xs: '1.125rem', md: '1.25rem' },
    fontWeight: 600,
    lineHeight: 1.4,
  },
  titleMedium: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.45,
  },
  titleSmall: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  labelLarge: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  labelMedium: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.35,
    letterSpacing: '0.015em',
  },
  labelSmall: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '0.02em',
  },
  bodyLarge: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodyMedium: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.45,
  },
  bodySmall: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
};

/**
 * 統一Typographyコンポーネント
 */
export const AppTypography: React.FC<AppTypographyProps> = ({
  variant = 'bodyMedium',
  styleOptions = {},
  sx = {},
  children,
  ...props
}) => {
  const theme = useTheme();
  const {
    gradient = false,
    gradientColors,
    glassEffect = false,
    truncate = false,
    maxLines,
  } = styleOptions;

  // カスタムバリアント用のスタイル取得
  const getCustomVariantStyles = () => {
    if (variant && typographyScale[variant as keyof typeof typographyScale]) {
      return typographyScale[variant as keyof typeof typographyScale];
    }
    return {};
  };

  // グラデーションスタイル
  const getGradientStyles = () => {
    if (!gradient) return {};
    
    const colors = gradientColors || [theme.palette.primary.main, theme.palette.secondary.main];
    return {
      background: `linear-gradient(45deg, ${colors[0]} 30%, ${colors[1]} 90%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    };
  };

  // ガラスエフェクトスタイル
  const getGlassEffectStyles = () => {
    if (!glassEffect) return {};
    
    return {
      color: alpha(theme.palette.common.white, 0.95),
      textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
      backdropFilter: 'blur(10px)',
    };
  };

  // テキスト切り捨てスタイル
  const getTruncateStyles = () => {
    if (maxLines && maxLines > 1) {
      return {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      };
    }
    
    if (truncate) {
      return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
      };
    }
    
    return {};
  };

  // MUIの標準バリアントかカスタムバリアントかを判定
  const isCustomVariant = variant && typographyScale[variant as keyof typeof typographyScale];
  const muiVariant = isCustomVariant ? 'body1' : variant;

  const combinedSx = {
    ...getCustomVariantStyles(),
    ...getGradientStyles(),
    ...getGlassEffectStyles(),
    ...getTruncateStyles(),
    ...sx,
  };

  return (
    <MuiTypography
      variant={muiVariant as MuiTypographyProps['variant']}
      sx={combinedSx}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

/**
 * 便利なプリセットコンポーネント
 */

// ページタイトル用
export const PageTitle: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="headlineLarge" component="h1" {...props} />
);

// セクションタイトル用
export const SectionTitle: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="headlineMedium" component="h2" {...props} />
);

// サブセクションタイトル用
export const SubsectionTitle: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="titleLarge" component="h3" {...props} />
);

// カードタイトル用
export const CardTitle: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="titleMedium" component="h4" {...props} />
);

// 本文用
export const BodyText: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="bodyMedium" {...props} />
);

// 説明文用
export const Caption: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="bodySmall" {...props} />
);

// ラベル用
export const Label: React.FC<Omit<AppTypographyProps, 'variant'>> = (props) => (
  <AppTypography variant="labelMedium" {...props} />
);

// ブランド・ロゴ用（グラデーション付き）
export const BrandText: React.FC<Omit<AppTypographyProps, 'variant' | 'styleOptions'>> = (props) => (
  <AppTypography 
    variant="displayMedium" 
    styleOptions={{ gradient: true }}
    {...props} 
  />
);

export default AppTypography;
