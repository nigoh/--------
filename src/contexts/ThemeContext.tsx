import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme, PaletteMode } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// MUI v7対応 - useColorScheme統合型のThemeContext
interface ThemeContextType {
  // 従来の互換性のためのプロパティ
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // MUI v7 カラースキーム関連
  mode: PaletteMode | 'system' | undefined;
  setMode: (mode: PaletteMode | 'system') => void;
  systemMode: PaletteMode | undefined; // 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeInitScript = () => {
  return <InitColorSchemeScript defaultMode="system" />;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  // MUI v7のuseColorScheme hookを使用
  const { mode, setMode, systemMode } = useColorScheme();

  // 以下は従来のコードとの互換性のために維持
  const getInitialHighContrast = () => {
    const saved = localStorage.getItem('highContrast');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-contrast: high)').matches;
  };

  const getInitialFontSize = () => {
    const saved = localStorage.getItem('fontSize');
    return saved ? (saved as 'small' | 'medium' | 'large') : 'medium';
  };

  // MUI v7のmodeをisDarkModeと同期
  const isDarkMode = mode === 'dark' || (mode === 'system' && systemMode === 'dark');
  const [isHighContrast, setIsHighContrast] = useState(getInitialHighContrast);
  const [fontSize, setFontSizeState] = useState(getInitialFontSize);
  
  // prefers-reduced-motionの動的検出
  const [isReducedMotion, setIsReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // システム設定の変更を監視
  // ダークモードはuseColorSchemeが内部的に監視するため不要
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('highContrast') === null) {
        setIsHighContrast(e.matches);
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  // ダークモード切替 - MUI v7のsetModeを使用
  const toggleDarkMode = () => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'light' : 'system');
    // localStorage管理はuseColorSchemeが内部的に行うため不要
  };

  // ハイコントラスト切替
  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', JSON.stringify(newValue));
  };

  // フォントサイズ設定
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        // 従来のプロパティ
        isDarkMode, 
        toggleDarkMode, 
        isHighContrast, 
        toggleHighContrast,
        isReducedMotion,
        fontSize,
        setFontSize,
        
        // MUI v7のカラースキーム関連
        mode,
        setMode,
        systemMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};
