/**
 * Main Layout Component
 * 
 * アプリ全体の統一されたレイアウト構造
 * Material Design 3準拠のレスポンシブレイアウト
 */
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { surfaceStyles, scrollbarStyles } from '../../theme/componentStyles';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
  sx?: any;
}

/**
 * メインレイアウトコンポーネント
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = false,
  showSidebar = false,
  className,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        ...surfaceStyles.surface(theme),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * スクロール可能なコンテンツエリア
 */
interface ScrollableContentProps {
  children: React.ReactNode;
  maxHeight?: string | number;
  scrollbarType?: 'standard' | 'thin' | 'hidden' | 'hoverOnly';
  sx?: any;
}

export const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  maxHeight = '100%',
  scrollbarType = 'standard',
  sx = {},
}) => {
  const theme = useTheme();

  const getScrollbarStyles = () => {
    const style = scrollbarStyles[scrollbarType];
    return typeof style === 'function' ? style(theme) : style;
  };

  return (
    <Box
      sx={{
        height: '100%',
        maxHeight,
        overflow: 'auto',
        ...getScrollbarStyles(),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * フレックス レイアウトコンテナ
 */
interface FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
  wrap?: boolean;
  sx?: any;
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap = 0,
  wrap = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * グリッドレイアウトコンテナ
 */
interface GridContainerProps {
  children: React.ReactNode;
  columns?: number | string;
  gap?: number | string;
  minItemWidth?: number | string;
  autoFit?: boolean;
  sx?: any;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  columns,
  gap = 16,
  minItemWidth = '300px',
  autoFit = false,
  sx = {},
}) => {
  const gridColumns = autoFit 
    ? `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
    : columns 
      ? typeof columns === 'number' 
        ? `repeat(${columns}, 1fr)`
        : columns
      : `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: gap,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * セクションコンテナ（余白付き）
 */
interface SectionContainerProps {
  children: React.ReactNode;
  maxWidth?: string | number;
  padding?: string | number;
  centered?: boolean;
  sx?: any;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  maxWidth = '1200px',
  padding = { xs: 2, sm: 3, md: 4 },
  centered = true,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        margin: centered ? '0 auto' : 0,
        padding: padding,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * カードコンテナ（立体感のあるエリア）
 */
interface CardContainerProps {
  children: React.ReactNode;
  elevation?: 1 | 2 | 3 | 4 | 5;
  padding?: string | number;
  interactive?: boolean;
  sx?: any;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  elevation = 2,
  padding = 3,
  interactive = false,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...(interactive ? surfaceStyles.interactive(theme) : surfaceStyles.elevated(elevation)(theme)),
        padding: padding,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default MainLayout;
