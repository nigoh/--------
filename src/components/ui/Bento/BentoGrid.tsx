/**
 * Modern Bento Grid Layout Component
 * 
 * Material Design 3準拠の動的グリッドレイアウト
 * レスポンシブ対応、アニメーション付き
 */

import React from 'react';
import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens, shapeTokens } from '../../../theme/designSystem';
import { StaggerContainer, StaggerItem, HoverAnimation } from '../Animation/MotionComponents';

// ==================== Interfaces ====================

/**
 * Bentoアイテムの設定
 */
export interface BentoItem {
  id: string;
  content: React.ReactNode;
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  minHeight?: number | string;
  backgroundColor?: string;
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * BentoGridのプロパティ
 */
interface BentoGridProps {
  items: BentoItem[];
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  maxWidth?: string | number;
  animated?: boolean;
  className?: string;
  sx?: any;
}

// ==================== Component ====================

/**
 * モダンなBentoグリッドコンポーネント
 */
export const BentoGrid: React.FC<BentoGridProps> = ({
  items,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  },
  gap = spacingTokens.md,
  maxWidth = '1200px',
  animated = true,
  className,
  sx,
}) => {
  const theme = useTheme();
  
  // レスポンシブ判定
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  
  // 現在のブレークポイントに対応するカラム数を取得
  const getCurrentColumns = () => {
    if (isXs) return columns.xs || 1;
    if (isSm) return columns.sm || 2;
    if (isMd) return columns.md || 3;
    if (isLg) return columns.lg || 4;
    return columns.xl || 4;
  };

  // アイテムのスパンを取得
  const getItemSpan = (item: BentoItem) => {
    if (isXs) return Math.min(item.span?.xs || 1, getCurrentColumns());
    if (isSm) return Math.min(item.span?.sm || 1, getCurrentColumns());
    if (isMd) return Math.min(item.span?.md || 1, getCurrentColumns());
    if (isLg) return Math.min(item.span?.lg || 1, getCurrentColumns());
    return Math.min(item.span?.xl || 1, getCurrentColumns());
  };

  const containerStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${getCurrentColumns()}, 1fr)`,
    gap: `${gap}px`,
    maxWidth,
    margin: '0 auto',
    padding: `${spacingTokens.lg}px`,
    ...sx,
  };

  const Container = animated ? StaggerContainer : Box;

  return (
    <Container
      className={className}
      sx={containerStyles}
    >
      {items.map((item, index) => {
        const ItemWrapper = animated ? StaggerItem : Box;
        const InteractiveWrapper = item.interactive ? HoverAnimation : Box;
        
        return (
          <ItemWrapper
            key={item.id}
            sx={{
              gridColumn: `span ${getItemSpan(item)}`,
              minHeight: item.minHeight || 200,
            }}
          >
            <InteractiveWrapper
              onClick={item.onClick}
              sx={{ 
                height: '100%',
                cursor: item.interactive ? 'pointer' : 'default',
              }}
            >
              <Paper
                sx={{
                  ...surfaceStyles.elevated(2)(theme),
                  height: '100%',
                  padding: spacingTokens.lg,
                  backgroundColor: item.backgroundColor || 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: shapeTokens.corner.large,
                  transition: 'all 0.3s ease',
                  '&:hover': item.interactive ? {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  } : {},
                }}
              >
                {item.content}
              </Paper>
            </InteractiveWrapper>
          </ItemWrapper>
        );
      })}
    </Container>
  );
};

// ==================== Preset Layouts ====================

/**
 * ダッシュボード用のBentoレイアウト
 */
export const DashboardBentoGrid: React.FC<{
  items: BentoItem[];
  animated?: boolean;
}> = ({ items, animated = true }) => {
  return (
    <BentoGrid
      items={items}
      columns={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 6,
      }}
      gap={spacingTokens.md}
      animated={animated}
    />
  );
};

/**
 * ポートフォリオ用のBentoレイアウト
 */
export const PortfolioBentoGrid: React.FC<{
  items: BentoItem[];
  animated?: boolean;
}> = ({ items, animated = true }) => {
  return (
    <BentoGrid
      items={items}
      columns={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      }}
      gap={spacingTokens.lg}
      animated={animated}
      sx={{
        '& .MuiPaper-root': {
          minHeight: 250,
        },
      }}
    />
  );
};

/**
 * コンパクトなBentoレイアウト
 */
export const CompactBentoGrid: React.FC<{
  items: BentoItem[];
  animated?: boolean;
}> = ({ items, animated = true }) => {
  return (
    <BentoGrid
      items={items}
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
        lg: 6,
        xl: 8,
      }}
      gap={spacingTokens.sm}
      animated={animated}
      sx={{
        '& .MuiPaper-root': {
          minHeight: 120,
          padding: spacingTokens.md,
        },
      }}
    />
  );
};

// ==================== Utility Functions ====================

/**
 * BentoItemを簡単に作成するヘルパー関数
 */
export const createBentoItem = (
  id: string,
  content: React.ReactNode,
  options?: Partial<Omit<BentoItem, 'id' | 'content'>>
): BentoItem => ({
  id,
  content,
  span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
  minHeight: 200,
  interactive: false,
  ...options,
});

/**
 * 大きなBentoItemを作成するヘルパー関数
 */
export const createLargeBentoItem = (
  id: string,
  content: React.ReactNode,
  options?: Partial<Omit<BentoItem, 'id' | 'content'>>
): BentoItem => ({
  id,
  content,
  span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 },
  minHeight: 300,
  interactive: false,
  ...options,
});

/**
 * ワイドなBentoItemを作成するヘルパー関数
 */
export const createWideBentoItem = (
  id: string,
  content: React.ReactNode,
  options?: Partial<Omit<BentoItem, 'id' | 'content'>>
): BentoItem => ({
  id,
  content,
  span: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  minHeight: 200,
  interactive: false,
  ...options,
});

// ==================== Examples ====================

/**
 * 使用例のBentoアイテム
 */
export const exampleBentoItems: BentoItem[] = [
  createLargeBentoItem(
    'hero',
    <Box sx={{ textAlign: 'center' }}>
      <h2>メインコンテンツ</h2>
      <p>大きなアイテムの例</p>
    </Box>,
    { 
      backgroundColor: 'primary.main',
      interactive: true,
      minHeight: 400,
    }
  ),
  createBentoItem(
    'stats1',
    <Box>
      <h3>統計1</h3>
      <p>1,234</p>
    </Box>,
    { interactive: true }
  ),
  createBentoItem(
    'stats2',
    <Box>
      <h3>統計2</h3>
      <p>5,678</p>
    </Box>,
    { interactive: true }
  ),
  createWideBentoItem(
    'chart',
    <Box>
      <h3>チャート</h3>
      <p>グラフ表示エリア</p>
    </Box>,
    { 
      backgroundColor: 'secondary.main',
      interactive: true,
    }
  ),
  createBentoItem(
    'quick1',
    <Box>
      <h4>クイックアクション1</h4>
    </Box>,
    { 
      interactive: true,
      minHeight: 150,
    }
  ),
  createBentoItem(
    'quick2',
    <Box>
      <h4>クイックアクション2</h4>
    </Box>,
    { 
      interactive: true,
      minHeight: 150,
    }
  ),
];

export default BentoGrid;
