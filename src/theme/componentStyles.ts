/**
 * Material Design 3 Component Styles
 * 
 * 各コンポーネントの一貫したスタイリングを提供
 * デザインシステムのトークンを使用
 */

import { Theme } from '@mui/material/styles';
import { 
  colorTokens, 
  typographyTokens, 
  shapeTokens, 
  elevationTokens, 
  spacingTokens, 
  motionTokens, 
  stateLayerTokens 
} from './designSystem';
import { SxProps } from '@mui/material';

// ==================== Surface Styles ====================

/**
 * サーフェス（面）のスタイル
 */
export const surfaceStyles = {
  // 基本的なサーフェス
  surface: (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.mode === 'dark' 
      ? colorTokens.neutral[10] 
      : colorTokens.neutral[99],
    color: theme.palette.mode === 'dark' 
      ? colorTokens.neutral[90] 
      : colorTokens.neutral[10],
    borderRadius: shapeTokens.corner.medium,
    transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
  }),

  // 立体感のあるサーフェス
  elevated: (level: 1 | 2 | 3 | 4 | 5) => (theme: Theme): SxProps => ({
    ...surfaceStyles.surface(theme),
    ...elevationTokens[`level${level}`],
    backgroundColor: theme.palette.mode === 'dark'
      ? `rgba(${hexToRgb(colorTokens.neutral[20])}, 0.9)`
      : `rgba(${hexToRgb(colorTokens.neutral[99])}, 0.9)`,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  }),

  // インタラクティブなサーフェス
  interactive: (theme: Theme): SxProps => ({
    ...surfaceStyles.surface(theme),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.hover})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.hover})`,
      transform: 'translateY(-2px)',
      ...elevationTokens.level2,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    '&:active': {
      transform: 'translateY(0px)',
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.pressed})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.pressed})`,
    },
  }),

  // グラスモーフィズム効果
  glassmorphism: (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(30, 30, 30, 0.7)'
      : 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.3)'}`,
    borderRadius: shapeTokens.corner.large,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(31, 38, 135, 0.37)',
  }),
};

// ==================== Button Styles ====================

/**
 * ボタンスタイル
 */
export const buttonStyles = {
  // Filled Button (Primary)
  filled: (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.mode === 'dark' 
      ? colorTokens.primary[80] 
      : colorTokens.primary[40],
    color: theme.palette.mode === 'dark' 
      ? colorTokens.primary[20] 
      : colorTokens.primary[100],
    borderRadius: shapeTokens.corner.large,
    padding: `${spacingTokens.sm}px ${spacingTokens.lg}px`,
    textTransform: 'none',
    ...typographyTokens.labelLarge,
    transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? colorTokens.primary[70]
        : colorTokens.primary[30],
      transform: 'translateY(-1px)',
      ...elevationTokens.level2,
    },
    '&:active': {
      transform: 'translateY(0px)',
      ...elevationTokens.level1,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  }),

  // Outlined Button (Secondary)
  outlined: (theme: Theme): SxProps => ({
    backgroundColor: 'transparent',
    color: theme.palette.mode === 'dark' 
      ? colorTokens.primary[80] 
      : colorTokens.primary[40],
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? colorTokens.primary[80] 
      : colorTokens.primary[40]}`,
    borderRadius: shapeTokens.corner.large,
    padding: `${spacingTokens.sm}px ${spacingTokens.lg}px`,
    textTransform: 'none',
    ...typographyTokens.labelLarge,
    transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.hover})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.hover})`,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0px)',
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.pressed})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.pressed})`,
    },
  }),

  // Text Button
  text: (theme: Theme): SxProps => ({
    backgroundColor: 'transparent',
    color: theme.palette.mode === 'dark' 
      ? colorTokens.primary[80] 
      : colorTokens.primary[40],
    border: 'none',
    borderRadius: shapeTokens.corner.large,
    padding: `${spacingTokens.sm}px ${spacingTokens.md}px`,
    textTransform: 'none',
    ...typographyTokens.labelLarge,
    transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.hover})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.hover})`,
    },
    '&:active': {
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.primary[80])}, ${stateLayerTokens.pressed})`
        : `rgba(${hexToRgb(colorTokens.primary[40])}, ${stateLayerTokens.pressed})`,
    },
  }),

  // FAB (Floating Action Button)
  fab: (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.mode === 'dark' 
      ? colorTokens.secondary[80] 
      : colorTokens.primary[40],
    color: theme.palette.mode === 'dark' 
      ? colorTokens.secondary[20] 
      : colorTokens.primary[100],
    borderRadius: shapeTokens.corner.large,
    ...elevationTokens.level3,
    transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
    '&:hover': {
      ...elevationTokens.level4,
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
      ...elevationTokens.level2,
    },
  }),
};

// ==================== Input Styles ====================

/**
 * 入力フィールドスタイル
 */
export const inputStyles = {
  // Outlined TextField
  outlined: (theme: Theme): SxProps => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.mode === 'dark'
        ? `rgba(${hexToRgb(colorTokens.neutral[20])}, 0.5)`
        : `rgba(${hexToRgb(colorTokens.neutral[99])}, 0.8)`,
      borderRadius: shapeTokens.corner.small,
      transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark'
          ? colorTokens.neutralVariant[60]
          : colorTokens.neutralVariant[50],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.mode === 'dark'
          ? colorTokens.primary[80]
          : colorTokens.primary[40],
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.mode === 'dark'
          ? colorTokens.primary[80]
          : colorTokens.primary[40],
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      ...typographyTokens.bodyLarge,
      color: theme.palette.mode === 'dark'
        ? colorTokens.neutralVariant[80]
        : colorTokens.neutralVariant[30],
      '&.Mui-focused': {
        color: theme.palette.mode === 'dark'
          ? colorTokens.primary[80]
          : colorTokens.primary[40],
      },
    },
  }),

  // Filled TextField
  filled: (theme: Theme): SxProps => ({
    '& .MuiFilledInput-root': {
      backgroundColor: theme.palette.mode === 'dark'
        ? colorTokens.neutralVariant[30]
        : colorTokens.neutralVariant[90],
      borderRadius: `${shapeTokens.corner.small} ${shapeTokens.corner.small} 0 0`,
      transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? colorTokens.neutralVariant[20]
          : colorTokens.neutralVariant[80],
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.mode === 'dark'
          ? colorTokens.neutralVariant[20]
          : colorTokens.neutralVariant[80],
      },
      '&:before': {
        borderBottomColor: theme.palette.mode === 'dark'
          ? colorTokens.neutralVariant[60]
          : colorTokens.neutralVariant[50],
      },
      '&:after': {
        borderBottomColor: theme.palette.mode === 'dark'
          ? colorTokens.primary[80]
          : colorTokens.primary[40],
      },
    },
  }),
};

// ==================== Animation Styles ====================

/**
 * アニメーションスタイル
 */
export const animations = {
  // フェードイン
  fadeIn: {
    animation: 'fadeIn 0.6s ease-out',
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },

  // スライドアップ
  slideUp: {
    animation: 'slideUp 0.4s ease-out',
    '@keyframes slideUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(40px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },

  // スケールイン
  scaleIn: {
    animation: 'scaleIn 0.3s ease-out',
    '@keyframes scaleIn': {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '100%': {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },

  // パルス（注意を引く）
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
      },
      '50%': {
        transform: 'scale(1.05)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  },

  // ホバー時の浮上
  hoverFloat: {
    transition: `transform ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },

  // 減速されたフェード
  delayedFadeIn: (delay: number = 0) => ({
    animation: `delayedFadeIn 0.8s ease-out ${delay}ms both`,
    '@keyframes delayedFadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(30px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  }),
};

// ==================== Utility Functions ====================

/**
 * Hex色をRGB値に変換
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

// ==================== Layout Styles ====================

/**
 * レイアウト関連のスタイル
 */
export const layoutStyles = {
  // コンテナ
  container: (theme: Theme): SxProps => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacingTokens.lg}px`,
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${spacingTokens.md}px`,
    },
  }),

  // グリッドコンテナ
  gridContainer: {
    display: 'grid',
    gap: spacingTokens.lg,
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  },

  // フレックスセンター
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // フレックスベットween
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // フルハイト
  fullHeight: {
    minHeight: '100vh',
  },
};

// ==================== State Styles ====================

/**
 * 状態に応じたスタイル
 */
export const stateStyles = {
  // ローディング状態
  loading: {
    opacity: 0.7,
    pointerEvents: 'none',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 1,
    },
  },

  // エラー状態
  error: (theme: Theme): SxProps => ({
    borderColor: theme.palette.mode === 'dark'
      ? colorTokens.error[80]
      : colorTokens.error[40],
    color: theme.palette.mode === 'dark'
      ? colorTokens.error[80]
      : colorTokens.error[40],
  }),

  // 成功状態
  success: (theme: Theme): SxProps => ({
    borderColor: theme.palette.mode === 'dark'
      ? '#81C784' // Material Green 300
      : '#4CAF50', // Material Green 500
    color: theme.palette.mode === 'dark'
      ? '#81C784'
      : '#4CAF50',
  }),

  // 無効状態
  disabled: {
    opacity: stateLayerTokens.disabled,
    pointerEvents: 'none',
  },
};
