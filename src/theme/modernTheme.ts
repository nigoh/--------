/**
 * Material Design 3 Modern Theme - MUI v7 Compatible
 * 
 * MUI v7最新推奨パターンに基づいた統一されたテーマ
 * - CSS Variables完全対応 (cssVariables: true)
 * - colorSchemes API採用
 * - theme.applyStyles() 使用
 * - Material Design 3準拠
 * - アクセシビリティ配慮、パフォーマンス最適化
 */

import { createTheme, Theme } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { 
  colorTokens, 
  typographyTokens, 
  shapeTokens, 
  elevationTokens, 
  spacingTokens, 
  motionTokens 
} from './designSystem';
import { globalIMEStyles, getIMEStyles, japaneseInputStyles } from './imeStyles';

// MUI v7 Breakpoint overrides
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
  
  // Custom palette extensions for CSS variables
  interface PaletteOptions {
    surface?: {
      main?: string;
      variant?: string;
    };
    outline?: string;
    outlineVariant?: string;
  }
  
  interface Palette {
    surface: {
      main: string;
      variant: string;
    };
    outline: string;
    outlineVariant: string;
  }
}

export interface ThemeOptions {
  mode?: 'light' | 'dark' | 'system';
  highContrast?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

// Typography scale mapping for different font sizes - MUI v7 compatible
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

// MUI v7 推奨テーマ作成関数 - CSS Variables & colorSchemes API採用
export const createModernTheme = (options: ThemeOptions = {}): Theme => {
  const { 
    mode = 'system', 
    highContrast = false, 
    fontSize = 'medium' 
  } = options;
  
  // ベースカラーパレット - Material Design 3準拠
  const createColorScheme = (schemeMode: 'light' | 'dark', isHighContrast: boolean = false) => {
    if (isHighContrast) {
      return {
        palette: {
          primary: {
            main: schemeMode === 'dark' ? '#FFFFFF' : '#000000',
            light: schemeMode === 'dark' ? '#FFFFFF' : '#333333',
            dark: schemeMode === 'dark' ? '#CCCCCC' : '#000000',
            contrastText: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
          },
          secondary: {
            main: schemeMode === 'dark' ? '#FFFF00' : '#0066CC',
            light: schemeMode === 'dark' ? '#FFFF66' : '#3399FF',
            dark: schemeMode === 'dark' ? '#CCCC00' : '#004499',
            contrastText: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
          },
          error: {
            main: schemeMode === 'dark' ? '#FF6B6B' : '#CC0000',
            light: schemeMode === 'dark' ? '#FF9999' : '#FF3333',
            dark: schemeMode === 'dark' ? '#CC0000' : '#990000',
            contrastText: '#FFFFFF',
          },
          background: {
            default: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
            paper: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
          },
          text: {
            primary: schemeMode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: schemeMode === 'dark' ? '#CCCCCC' : '#333333',
            disabled: schemeMode === 'dark' ? '#666666' : '#999999',
          },
          divider: schemeMode === 'dark' ? '#FFFFFF' : '#000000',
          surface: {
            main: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
            variant: schemeMode === 'dark' ? '#000000' : '#FFFFFF',
          },
          outline: schemeMode === 'dark' ? '#FFFFFF' : '#000000',
          outlineVariant: schemeMode === 'dark' ? '#FFFFFF' : '#000000',
        },
      };
    }

    return {
      palette: {
        primary: {
          main: schemeMode === 'dark' ? colorTokens.primary[70] : colorTokens.primary[50],
          light: schemeMode === 'dark' ? colorTokens.primary[80] : colorTokens.primary[60],
          dark: schemeMode === 'dark' ? colorTokens.primary[60] : colorTokens.primary[40],
          contrastText: schemeMode === 'dark' ? colorTokens.primary[10] : colorTokens.primary[99],
        },
        secondary: {
          main: schemeMode === 'dark' ? colorTokens.secondary[70] : colorTokens.secondary[50],
          light: schemeMode === 'dark' ? colorTokens.secondary[80] : colorTokens.secondary[60],
          dark: schemeMode === 'dark' ? colorTokens.secondary[60] : colorTokens.secondary[40],
          contrastText: schemeMode === 'dark' ? colorTokens.secondary[10] : colorTokens.secondary[99],
        },
        tertiary: {
          main: schemeMode === 'dark' ? colorTokens.tertiary[70] : colorTokens.tertiary[50],
          light: schemeMode === 'dark' ? colorTokens.tertiary[80] : colorTokens.tertiary[60],
          dark: schemeMode === 'dark' ? colorTokens.tertiary[60] : colorTokens.tertiary[40],
          contrastText: schemeMode === 'dark' ? colorTokens.tertiary[10] : colorTokens.tertiary[99],
        },
        error: {
          main: schemeMode === 'dark' ? colorTokens.error[70] : colorTokens.error[50],
          light: schemeMode === 'dark' ? colorTokens.error[80] : colorTokens.error[60],
          dark: schemeMode === 'dark' ? colorTokens.error[60] : colorTokens.error[40],
          contrastText: schemeMode === 'dark' ? colorTokens.error[10] : colorTokens.error[99],
        },
        warning: {
          main: schemeMode === 'dark' ? colorTokens.warning[70] : colorTokens.warning[50],
          light: schemeMode === 'dark' ? colorTokens.warning[80] : colorTokens.warning[60],
          dark: schemeMode === 'dark' ? colorTokens.warning[60] : colorTokens.warning[40],
          contrastText: schemeMode === 'dark' ? colorTokens.warning[10] : colorTokens.warning[99],
        },
        info: {
          main: schemeMode === 'dark' ? colorTokens.tertiary[70] : colorTokens.tertiary[50],
          light: schemeMode === 'dark' ? colorTokens.tertiary[80] : colorTokens.tertiary[60],
          dark: schemeMode === 'dark' ? colorTokens.tertiary[60] : colorTokens.tertiary[40],
          contrastText: schemeMode === 'dark' ? colorTokens.tertiary[10] : colorTokens.tertiary[99],
        },
        success: {
          main: schemeMode === 'dark' ? colorTokens.success[70] : colorTokens.success[50],
          light: schemeMode === 'dark' ? colorTokens.success[80] : colorTokens.success[60],
          dark: schemeMode === 'dark' ? colorTokens.success[60] : colorTokens.success[40],
          contrastText: schemeMode === 'dark' ? colorTokens.success[10] : colorTokens.success[99],
        },
        background: {
          default: schemeMode === 'dark' ? colorTokens.neutral[10] : colorTokens.neutral[99],
          paper: schemeMode === 'dark' ? colorTokens.neutral[20] : colorTokens.neutral[100],
        },
        surface: {
          main: schemeMode === 'dark' ? colorTokens.neutral[20] : colorTokens.neutral[99],
          variant: schemeMode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[90],
        },
        text: {
          primary: schemeMode === 'dark' ? colorTokens.neutral[90] : colorTokens.neutral[10],
          secondary: schemeMode === 'dark' ? colorTokens.neutral[80] : colorTokens.neutral[30],
          disabled: schemeMode === 'dark' ? colorTokens.neutral[60] : colorTokens.neutral[50],
        },
        divider: schemeMode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[80],
        outline: schemeMode === 'dark' ? colorTokens.neutralVariant[60] : colorTokens.neutralVariant[50],
        outlineVariant: schemeMode === 'dark' ? colorTokens.neutralVariant[30] : colorTokens.neutralVariant[80],
      },
    };
  };

  return createTheme({
    // MUI v7 CSS Variables完全対応
    cssVariables: true,
    
    // MUI v7 colorSchemes API採用
    colorSchemes: {
      light: createColorScheme('light', highContrast),
      dark: createColorScheme('dark', highContrast),
    },
    
    // デフォルトモード設定
    defaultMode: mode as 'light' | 'dark' | 'system',
    
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
      // Global styles - MUI v7対応
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
          // フォーカスリング - CSS Variables対応
          '*:focus-visible': {
            outline: `2px solid var(--mui-palette-primary-main)`,
            outlineOffset: '2px',
          },
          // グローバルIMEスタイル追加
          ...globalIMEStyles(theme),
        }),
      },

      // Button - theme.applyStyles() 使用
      MuiButton: {
        defaultProps: {
          disableRipple: highContrast,
          disableElevation: highContrast,
        },
        styleOverrides: {
          root: ({ theme }) => [
            {
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
            // dark mode対応 - theme.applyStyles()使用
            theme.applyStyles('dark', {
              '&:hover': {
                backgroundColor: theme.vars?.palette.primary.dark || 'var(--mui-palette-primary-dark)',
              },
            }),
          ],
          contained: ({ theme }) => [
            {
              ...elevationTokens.level1,
              '&:hover': {
                ...(!highContrast && elevationTokens.level2),
              },
            },
            // dark mode追加スタイル
            theme.applyStyles('dark', {
              backgroundColor: theme.vars?.palette.primary.main || 'var(--mui-palette-primary-main)',
            }),
          ],
        },
      },

      // Card - theme.applyStyles() 使用
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => [
            {
              borderRadius: highContrast 
                ? shapeTokens.corner.none 
                : shapeTokens.corner.large,
              border: highContrast 
                ? `2px solid var(--mui-palette-text-primary)` 
                : 'none',
              ...(!highContrast && elevationTokens.level1),
              transition: `all ${motionTokens.duration.medium3} ${motionTokens.easing.standard}`,
              '&:hover': {
                transform: highContrast ? 'none' : 'translateY(-2px)',
                ...(!highContrast && elevationTokens.level3),
              },
            },
            // dark mode対応
            theme.applyStyles('dark', {
              backgroundColor: theme.vars?.palette.background.paper || 'var(--mui-palette-background-paper)',
              '&:hover': {
                backgroundColor: theme.vars?.palette.action?.hover || 'var(--mui-palette-action-hover)',
              },
            }),
          ],
        },
      },

      // Paper - CSS Variables対応
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.medium,
            border: highContrast 
              ? `1px solid var(--mui-palette-text-primary)` 
              : 'none',
            backgroundColor: 'var(--mui-palette-background-paper)',
          },
        },
      },

      // TextField - IMEスタイル統合版 + theme.applyStyles()
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => [
            {
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
                // IMEスタイル統合
                ...getIMEStyles(theme),
              },
              // 日本語入力専用スタイル
              ...japaneseInputStyles(theme),
            },
            // dark mode対応
            theme.applyStyles('dark', {
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.vars?.palette.background.paper || 'var(--mui-palette-background-paper)',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.vars?.palette.primary.main || 'var(--mui-palette-primary-main)',
                },
              },
            }),
          ],
        },
      },

      // Chip - CSS Variables対応
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => [
            {
              borderRadius: highContrast 
                ? shapeTokens.corner.none 
                : shapeTokens.corner.small,
              transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
              '&:hover': {
                transform: highContrast ? 'none' : 'scale(1.02)',
              },
            },
            theme.applyStyles('dark', {
              backgroundColor: theme.vars?.palette.background.paper || 'var(--mui-palette-background-paper)',
              color: theme.vars?.palette.text.primary || 'var(--mui-palette-text-primary)',
            }),
          ],
        },
      },

      // Dialog - theme.applyStyles() 使用
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => [
            {
              borderRadius: highContrast 
                ? shapeTokens.corner.none 
                : shapeTokens.corner.extraLarge,
              border: highContrast 
                ? `2px solid var(--mui-palette-text-primary)` 
                : 'none',
              ...(!highContrast && elevationTokens.level5),
            },
            theme.applyStyles('dark', {
              backgroundColor: theme.vars?.palette.background.paper || 'var(--mui-palette-background-paper)',
            }),
          ],
        },
      },

      // AppBar - Glassmorphism + CSS Variables
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => [
            {
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              ...(!highContrast && {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }),
              border: highContrast 
                ? `1px solid var(--mui-palette-text-primary)` 
                : 'none',
            },
            theme.applyStyles('dark', {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              ...(!highContrast && {
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }),
            }),
          ],
        },
      },

      // Tabs - theme.applyStyles() 使用
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => [
            {
              textTransform: 'none',
              fontWeight: 500,
              transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
              '&:hover': {
                backgroundColor: highContrast 
                  ? 'transparent'
                  : 'var(--mui-palette-action-hover)',
              },
            },
            theme.applyStyles('dark', {
              color: theme.vars?.palette.text.primary || 'var(--mui-palette-text-primary)',
              '&:hover': {
                backgroundColor: theme.vars?.palette.action?.hover || 'var(--mui-palette-action-hover)',
              },
            }),
          ],
        },
      },

      // Tooltip - CSS Variables対応
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: highContrast 
              ? shapeTokens.corner.none 
              : shapeTokens.corner.small,
            ...typographyTokens.bodySmall,
            backgroundColor: 'var(--mui-palette-text-primary)',
            color: 'var(--mui-palette-background-default)',
          },
        },
      },

      // Drawer - theme.applyStyles() 使用
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => [
            {
              backgroundColor: 'var(--mui-palette-background-paper)',
              ...(!highContrast && {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }),
            },
            theme.applyStyles('dark', {
              backgroundColor: 'rgba(18, 18, 18, 0.95)',
              ...(!highContrast && {
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }),
            }),
          ],
        },
      },
    },
  });
};

// MUI v7推奨テーマインスタンス - デフォルト設定
export const modernTheme = createModernTheme({
  mode: 'system',
  highContrast: false,
  fontSize: 'medium',
});

// レガシー互換用テーマ（既存コード対応）
export const modernDarkTheme = createModernTheme({
  mode: 'dark',
  highContrast: false,
  fontSize: 'medium',
});

export const modernHighContrastTheme = createModernTheme({
  mode: 'light',
  highContrast: true,
  fontSize: 'medium',
});

export const modernHighContrastDarkTheme = createModernTheme({
  mode: 'dark',
  highContrast: true,
  fontSize: 'medium',
});

// デフォルトエクスポートはMUI v7推奨の system mode
export default modernTheme;
