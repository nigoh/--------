import { useTheme, useMediaQuery } from '@mui/material';

/**
 * レスポンシブ対応のカスタムフック
 */

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    // 便利なプロパティ
    columns: isMobile ? 1 : isTablet ? 2 : 3,
    spacing: isMobile ? 2 : isTablet ? 3 : 4,
    containerMaxWidth: isMobile ? 'sm' : isTablet ? 'md' : 'lg',
    cardPadding: isMobile ? 2 : 3,
    buttonSize: isMobile ? 'medium' : 'large',
  };
};

/**
 * 動的なスペーシング計算
 */
export const getResponsiveSpacing = (mobile: number, tablet?: number, desktop?: number) => ({
  xs: mobile,
  sm: tablet || mobile * 1.5,
  md: desktop || mobile * 2,
});

/**
 * 動的なフォントサイズ計算
 */
export const getResponsiveFontSize = (mobile: string, tablet?: string, desktop?: string) => ({
  xs: mobile,
  sm: tablet || mobile,
  md: desktop || tablet || mobile,
});

/**
 * レスポンシブなグリッド設定
 */
export const getResponsiveGridProps = (mobileColumns = 12, tabletColumns = 6, desktopColumns = 4) => ({
  xs: mobileColumns,
  sm: tabletColumns,
  md: desktopColumns,
});

/**
 * タッチデバイス検出
 */
export const useTouch = () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return { isTouchDevice };
};
