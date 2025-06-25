import { createTheme, Theme } from '@mui/material/styles';

export interface ThemeOptions {
  mode: 'light' | 'dark';
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// 基本カラーパレット
const baseColors = {
  primary: {
    light: '#667eea',
    main: '#4f46e5',
    dark: '#3730a3',
  },
  secondary: {
    light: '#f093fb',
    main: '#f093fb',
    dark: '#c084fc',
  },
  accent: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },
};

// フォントサイズ設定
const fontSizes = {
  small: {
    fontSize: 12,
    h1: { fontSize: '2rem' },
    h2: { fontSize: '1.75rem' },
    h3: { fontSize: '1.5rem' },
    h4: { fontSize: '1.25rem' },
    h5: { fontSize: '1.125rem' },
    h6: { fontSize: '1rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
    button: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
  },
  medium: {
    fontSize: 14,
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1.125rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
  },
  large: {
    fontSize: 16,
    h1: { fontSize: '3rem' },
    h2: { fontSize: '2.5rem' },
    h3: { fontSize: '2rem' },
    h4: { fontSize: '1.75rem' },
    h5: { fontSize: '1.5rem' },
    h6: { fontSize: '1.25rem' },
    body1: { fontSize: '1.125rem' },
    body2: { fontSize: '1rem' },
    button: { fontSize: '1rem' },
    caption: { fontSize: '0.875rem' },
  },
};

// ライトテーマの設定
const lightTheme = {
  palette: {
    mode: 'light' as const,
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    divider: '#e5e7eb',
  },
};

// ダークテーマの設定
const darkTheme = {
  palette: {
    mode: 'dark' as const,
    primary: {
      ...baseColors.primary,
      main: '#6366f1',
    },
    secondary: baseColors.secondary,
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: '#334155',
  },
};

// ハイコントラストテーマの設定
const highContrastLight = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#0066cc',
      light: '#3399ff',
      dark: '#004499',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    divider: '#000000',
  },
};

const highContrastDark = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#cccccc',
    },
    secondary: {
      main: '#ffff00',
      light: '#ffff66',
      dark: '#cccc00',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    divider: '#ffffff',
  },
};

// テーマ作成関数
export const createModernTheme = (options: ThemeOptions): Theme => {
  const { mode, highContrast, fontSize } = options;
  
  // ベーステーマの選択
  let baseTheme;
  if (highContrast) {
    baseTheme = mode === 'dark' ? highContrastDark : highContrastLight;
  } else {
    baseTheme = mode === 'dark' ? darkTheme : lightTheme;
  }

  // フォントサイズの選択
  const fontSizeConfig = fontSizes[fontSize];

  return createTheme({
    ...baseTheme,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      ...fontSizeConfig,
    },
    shape: {
      borderRadius: highContrast ? 4 : 12,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: highContrast ? 4 : 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: highContrast ? 'none' : 'translateY(-1px)',
              boxShadow: highContrast ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: highContrast ? 4 : 16,
            backdropFilter: highContrast ? 'none' : 'blur(10px)',
            background: highContrast 
              ? undefined 
              : mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
            border: highContrast 
              ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` 
              : undefined,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: highContrast ? 'none' : 'translateY(-2px)',
              boxShadow: highContrast 
                ? 'none' 
                : '0 8px 25px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: highContrast ? 4 : 8,
              transition: 'all 0.2s ease-in-out',
              background: highContrast 
                ? undefined 
                : mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.5)' 
                  : 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                boxShadow: highContrast 
                  ? 'none' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: highContrast ? 4 : 16,
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: highContrast ? 'none' : 'scale(1.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: highContrast ? 4 : 12,
            backdropFilter: highContrast ? 'none' : 'blur(10px)',
            background: highContrast 
              ? undefined 
              : mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
            border: highContrast 
              ? `1px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` 
              : undefined,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: highContrast ? 4 : 16,
            backdropFilter: highContrast ? 'none' : 'blur(20px)',
            background: highContrast 
              ? undefined 
              : mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
            border: highContrast 
              ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` 
              : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backdropFilter: highContrast ? 'none' : 'blur(10px)',
            background: highContrast 
              ? undefined 
              : mode === 'dark' 
                ? 'rgba(15, 23, 42, 0.9)' 
                : 'rgba(255, 255, 255, 0.9)',
            border: highContrast 
              ? `1px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` 
              : undefined,
          },
        },
      },
    },
  });
};

// デフォルトテーマ
export const modernTheme = createModernTheme({
  mode: 'light',
  highContrast: false,
  fontSize: 'medium',
});
