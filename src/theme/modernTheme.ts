/**
 * Material Design 3 Modern Theme
 * 
 * 新しいデザインシステムに基づいた統一されたテーマ
 * CSS Variables対応、アクセシビリティ配慮、パフォーマンス最適化
 */

import { createTheme, Theme } from '@mui/material/styles';
import { 
  colorTokens, 
  typographyTokens, 
  shapeTokens, 
  elevationTokens, 
  spacingTokens, 
  motionTokens 
} from './designSystem';
import { globalIMEStyles, getIMEStyles, japaneseInputStyles } from './imeStyles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

export interface ThemeOptions {
  mode: 'light' | 'dark';
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Typography scale mapping for different font sizes
const getTypographyScale = (fontSize: 'small' | 'medium' | 'large') => {
  const scaleFactor = fontSize === 'small' ? 0.875 : fontSize === 'large' ? 1.125 : 1;
  
  return {
    h1: {
      ...typographyTokens.displayLarge,
      fontSize: `${parseFloat(typographyTokens.displayLarge.fontSize) * scaleFactor}px`,
    },
    h2: {
      ...typographyTokens.displayMedium,
      fontSize: `${parseFloat(typographyTokens.displayMedium.fontSize) * scaleFactor}px`,
    },
    h3: {
      ...typographyTokens.displaySmall,
      fontSize: `${parseFloat(typographyTokens.displaySmall.fontSize) * scaleFactor}px`,
    },
    h4: {
      ...typographyTokens.headlineLarge,
      fontSize: `${parseFloat(typographyTokens.headlineLarge.fontSize) * scaleFactor}px`,
    },
    h5: {
      ...typographyTokens.headlineMedium,
      fontSize: `${parseFloat(typographyTokens.headlineMedium.fontSize) * scaleFactor}px`,
    },
    h6: {
      ...typographyTokens.headlineSmall,
      fontSize: `${parseFloat(typographyTokens.headlineSmall.fontSize) * scaleFactor}px`,
    },
    subtitle1: {
      ...typographyTokens.titleLarge,
      fontSize: `${parseFloat(typographyTokens.titleLarge.fontSize) * scaleFactor}px`,
    },
    subtitle2: {
      ...typographyTokens.titleMedium,
      fontSize: `${parseFloat(typographyTokens.titleMedium.fontSize) * scaleFactor}px`,
    },
    body1: {
      ...typographyTokens.bodyLarge,
      fontSize: `${parseFloat(typographyTokens.bodyLarge.fontSize) * scaleFactor}px`,
    },
    body2: {
      ...typographyTokens.bodyMedium,
      fontSize: `${parseFloat(typographyTokens.bodyMedium.fontSize) * scaleFactor}px`,
    },
    button: {
      ...typographyTokens.labelLarge,
      fontSize: `${parseFloat(typographyTokens.labelLarge.fontSize) * scaleFactor}px`,
      textTransform: 'none' as const,
    },
    caption: {
      ...typographyTokens.bodySmall,
      fontSize: `${parseFloat(typographyTokens.bodySmall.fontSize) * scaleFactor}px`,
    },
    overline: {
      ...typographyTokens.labelSmall,
      fontSize: `${parseFloat(typographyTokens.labelSmall.fontSize) * scaleFactor}px`,
      textTransform: 'uppercase' as const,
    },
  };
};

// テーマ作成関数
export const createModernTheme = (options: ThemeOptions): Theme => {
  const { mode, highContrast, fontSize } = options;
  
  // ベースカラーパレット
  const basePalette = {
    mode,
    primary: {
      main: mode === 'dark' ? colorTokens.primary[80] : colorTokens.primary[40],
      light: mode === 'dark' ? colorTokens.primary[90] : colorTokens.primary[50],
      dark: mode === 'dark' ? colorTokens.primary[70] : colorTokens.primary[30],
      contrastText: mode === 'dark' ? colorTokens.primary[20] : colorTokens.primary[100],
    },
    secondary: {
      main: mode === 'dark' ? colorTokens.secondary[80] : colorTokens.secondary[40],
      light: mode === 'dark' ? colorTokens.secondary[90] : colorTokens.secondary[50],
      dark: mode === 'dark' ? colorTokens.secondary[70] : colorTokens.secondary[30],
      contrastText: mode === 'dark' ? colorTokens.secondary[20] : colorTokens.secondary[100],
    },
    error: {
      main: mode === 'dark' ? colorTokens.error[80] : colorTokens.error[40],
      light: mode === 'dark' ? colorTokens.error[90] : colorTokens.error[50],
      dark: mode === 'dark' ? colorTokens.error[70] : colorTokens.error[30],
      contrastText: mode === 'dark' ? colorTokens.error[20] : colorTokens.error[100],
    },
    warning: {
      main: mode === 'dark' ? colorTokens.tertiary[80] : colorTokens.tertiary[40],
      light: mode === 'dark' ? colorTokens.tertiary[90] : colorTokens.tertiary[50],
      dark: mode === 'dark' ? colorTokens.tertiary[70] : colorTokens.tertiary[30],
      contrastText: mode === 'dark' ? colorTokens.tertiary[20] : colorTokens.tertiary[100],
    },
    info: {
      main: mode === 'dark' ? '#64B5F6' : '#2196F3', // Material Blue
      light: mode === 'dark' ? '#90CAF9' : '#42A5F5',
      dark: mode === 'dark' ? '#42A5F5' : '#1976D2',
      contrastText: '#ffffff',
    },
    success: {
      main: mode === 'dark' ? '#81C784' : '#4CAF50', // Material Green
      light: mode === 'dark' ? '#A5D6A7' : '#66BB6A',
      dark: mode === 'dark' ? '#66BB6A' : '#388E3C',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? colorTokens.neutral[10] : colorTokens.neutral[99],
      paper: mode === 'dark' ? colorTokens.neutral[20] : colorTokens.neutral[100],
    },
    surface: {
      main: mode === 'dark' ? colorTokens.neutral[20] : colorTokens.neutral[99],
      variant: mode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[90],
    },
    text: {
      primary: mode === 'dark' ? colorTokens.neutral[90] : colorTokens.neutral[10],
      secondary: mode === 'dark' ? colorTokens.neutral[80] : colorTokens.neutral[30],
      disabled: mode === 'dark' ? colorTokens.neutral[60] : colorTokens.neutral[50],
    },
    divider: mode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[80],
    outline: mode === 'dark' ? colorTokens.neutralVariant[60] : colorTokens.neutralVariant[50],
    outlineVariant: mode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[80],
  };

  // ハイコントラスト用パレット
  const highContrastPalette = {
    mode,
    primary: {
      main: mode === 'dark' ? '#FFFFFF' : '#000000',
      light: mode === 'dark' ? '#FFFFFF' : '#333333',
      dark: mode === 'dark' ? '#CCCCCC' : '#000000',
      contrastText: mode === 'dark' ? '#000000' : '#FFFFFF',
    },
    secondary: {
      main: mode === 'dark' ? '#FFFF00' : '#0066CC',
      light: mode === 'dark' ? '#FFFF66' : '#3399FF',
      dark: mode === 'dark' ? '#CCCC00' : '#004499',
      contrastText: mode === 'dark' ? '#000000' : '#FFFFFF',
    },
    error: {
      main: mode === 'dark' ? '#FF6B6B' : '#CC0000',
      light: mode === 'dark' ? '#FF9999' : '#FF3333',
      dark: mode === 'dark' ? '#CC0000' : '#990000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'dark' ? '#000000' : '#FFFFFF',
      paper: mode === 'dark' ? '#000000' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#FFFFFF' : '#000000',
      secondary: mode === 'dark' ? '#CCCCCC' : '#333333',
      disabled: mode === 'dark' ? '#666666' : '#999999',
    },
    divider: mode === 'dark' ? '#FFFFFF' : '#000000',
  };

  const palette = highContrast ? highContrastPalette : basePalette;

  return createTheme({
    cssVariables: true,
    palette,
    typography: {
      fontFamily: typographyTokens.bodyLarge.fontFamily,
      ...getTypographyScale(fontSize),
    },
    spacing: spacingTokens.sm, // 8px base
    shape: {
      borderRadius: highContrast ? parseInt(shapeTokens.corner.none) : parseInt(shapeTokens.corner.medium),
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    transitions: {
      duration: {
        shortest: parseInt(motionTokens.duration.short1),
        shorter: parseInt(motionTokens.duration.short4),
        short: parseInt(motionTokens.duration.medium2),
        standard: parseInt(motionTokens.duration.medium4),
        complex: parseInt(motionTokens.duration.long2),
        enteringScreen: parseInt(motionTokens.duration.medium4),
        leavingScreen: parseInt(motionTokens.duration.medium2),
      },
      easing: {
        easeInOut: motionTokens.easing.standard,
        easeOut: motionTokens.easing.decelerated,
        easeIn: motionTokens.easing.accelerated,
        sharp: motionTokens.easing.emphasized,
      },
    },
    components: {
      // Global styles
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            // スムーススクロール
            scrollBehavior: 'smooth',
            // フォントスムージング
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          body: {
            // reduced-motion対応
            '@media (prefers-reduced-motion: reduce)': {
              '*': {
                animationDuration: '0.01ms !important',
                animationIterationCount: '1 !important',
                transitionDuration: '0.01ms !important',
              },
            },
          },
          // フォーカスリング
          '*:focus-visible': {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: '2px',
          },
          // グローバルIMEスタイル追加
          ...globalIMEStyles(theme),
        }),
      },

      // Button
      MuiButton: {
        defaultProps: {
          disableRipple: highContrast,
          disableElevation: highContrast,
        },
        styleOverrides: {
          root: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.large,
            textTransform: 'none',
            fontWeight: 500,
            transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
            '&:hover': {
              transform: highContrast ? 'none' : 'translateY(-1px)',
            },
            '&:active': {
              transform: highContrast ? 'none' : 'translateY(0px)',
            },
          },
          contained: {
            ...elevationTokens.level1,
            '&:hover': {
              ...(!highContrast && elevationTokens.level2),
            },
          },
        },
      },

      // Card
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.large,
            border: highContrast 
              ? `2px solid ${palette.text.primary}` 
              : 'none',
            ...(!highContrast && elevationTokens.level1),
            transition: `all ${motionTokens.duration.medium3} ${motionTokens.easing.standard}`,
            '&:hover': {
              transform: highContrast ? 'none' : 'translateY(-2px)',
              ...(!highContrast && elevationTokens.level3),
            },
          },
        },
      },

      // Paper
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.medium,
            border: highContrast 
              ? `1px solid ${palette.text.primary}` 
              : 'none',
          },
        },
      },

      // TextField (IMEスタイル統合版)
      MuiTextField: {
        styleOverrides: {
          root: (props) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: highContrast 
                ? shapeTokens.corner.none 
                : shapeTokens.corner.small,
              transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
              '&:hover': {
                ...(!highContrast && elevationTokens.level1),
              },
              '&.Mui-focused': {
                ...(!highContrast && elevationTokens.level2),
              },
              // IMEスタイル統合（テーマオブジェクトを渡す）
              ...getIMEStyles(props.theme),
            },
            // 日本語入力専用スタイル
            ...japaneseInputStyles(props.theme),
          }),
        },
      },

      // Chip
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.small,
            transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
            '&:hover': {
              transform: highContrast ? 'none' : 'scale(1.02)',
            },
          },
        },
      },

      // Dialog
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.extraLarge,
            border: highContrast 
              ? `2px solid ${palette.text.primary}` 
              : 'none',
            ...(!highContrast && elevationTokens.level5),
          },
        },
      },

      // AppBar
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            ...(!highContrast && {
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }),
            border: highContrast 
              ? `1px solid ${palette.text.primary}` 
              : 'none',
          },
        },
      },

      // Tabs
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
            '&:hover': {
              backgroundColor: highContrast 
                ? 'transparent'
                : `rgba(${mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.04)`,
            },
          },
        },
      },

      // Tooltip
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.small,
            ...typographyTokens.bodySmall,
          },
        },
      },

      // IME関連のスタイルオーバーライドは上記TextFieldに統合済み
    },
  });
};

// デフォルトテーマインスタンス
export const modernTheme = createModernTheme({
  mode: 'light',
  highContrast: false,
  fontSize: 'medium',
});

// ダークテーマインスタンス
export const modernDarkTheme = createModernTheme({
  mode: 'dark',
  highContrast: false,
  fontSize: 'medium',
});

// ハイコントラストテーマインスタンス
export const modernHighContrastTheme = createModernTheme({
  mode: 'light',
  highContrast: true,
  fontSize: 'medium',
});

// ハイコントラストダークテーマインスタンス
export const modernHighContrastDarkTheme = createModernTheme({
  mode: 'dark',
  highContrast: true,
  fontSize: 'medium',
});
