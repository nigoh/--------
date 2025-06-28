/**
 * Scrollbar Styles
 * 
 * 統一されたスクロールバーデザイン
 */

import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

/**
 * カスタムスクロールバーのスタイル
 */
export const scrollbarStyles = {
  /**
   * 標準スクロールバー
   */
  standard: (theme: Theme): SxProps => ({
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  }),

  /**
   * 細いスクロールバー
   */
  thin: (theme: Theme): SxProps => ({
    '&::-webkit-scrollbar': {
      width: '4px',
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.3)' 
        : 'rgba(0, 0, 0, 0.3)',
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.5)' 
          : 'rgba(0, 0, 0, 0.5)',
      },
    },
  }),

  /**
   * 非表示スクロールバー
   */
  hidden: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
  },

  /**
   * ホバー時のみ表示
   */
  hoverOnly: (theme: Theme): SxProps => ({
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
    },
  }),

  /**
   * カラフルなスクロールバー
   */
  colorful: (theme: Theme): SxProps => ({
    '&::-webkit-scrollbar': {
      width: '12px',
      height: '12px',
    },
    '&::-webkit-scrollbar-track': {
      background: `linear-gradient(90deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
      borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: '6px',
      border: `2px solid ${theme.palette.background.paper}`,
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
      },
    },
  }),
};
