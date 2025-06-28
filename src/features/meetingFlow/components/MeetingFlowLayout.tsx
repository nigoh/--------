/**
 * ミーティングフローレイアウトコンポーネント
 * 
 * レスポンシブレイアウトの責務を分離し、
 * デスクトップとモバイルの表示切り替えを管理
 */
import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useResponsive } from '../../../hooks/useResponsive';
import { focusStyles } from '../../../utils/accessibility';
import AnimatedBackground from '../../../components/AnimatedBackground';

interface MeetingFlowLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  sidebarContent: React.ReactNode;
}

/**
 * ミーティングフローのメインレイアウトコンポーネント
 */
export const MeetingFlowLayout: React.FC<MeetingFlowLayoutProps> = ({
  children,
  sidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  sidebarContent,
}) => {
  const theme = useTheme();
  const { isMobile, spacing } = useResponsive();

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: theme.palette.background.default,
    }}>
      {/* 背景 */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AnimatedBackground>
          <Box />
        </AnimatedBackground>
      </Box>

      {/* モバイル用ハンバーガーメニュー */}
      {isMobile && (
        <Box sx={{ 
          position: 'fixed', 
          top: 16, 
          right: 16, 
          zIndex: 1300,
        }}>
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[100],
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[700] 
                  : theme.palette.grey[200],
                transform: 'scale(1.05)',
              },
              ...focusStyles,
            }}
          >
            <MenuIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Box>
      )}

      {/* メインコンテンツエリア */}
      <Box sx={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        p: { xs: 1, sm: 2 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: spacing,
      }}>
        {children}
      </Box>

      {/* サイドバー - モバイルはDrawer、デスクトップは固定 */}
      {isMobile ? (
        <MobileSidebar
          open={sidebarOpen}
          onClose={onCloseSidebar}
          theme={theme}
        >
          {sidebarContent}
        </MobileSidebar>
      ) : (
        <DesktopSidebar>{sidebarContent}</DesktopSidebar>
      )}
    </Box>
  );
};

/**
 * モバイル用サイドバー（Drawer）
 */
const MobileSidebar: React.FC<{
  open: boolean;
  onClose: () => void;
  theme: any;
  children: React.ReactNode;
}> = ({ open, onClose, theme, children }) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    sx={{
      '& .MuiDrawer-paper': {
        width: '85vw',
        maxWidth: 400,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        border: `1px solid ${theme.palette.divider}`,
      },
    }}
  >
    <Box sx={{ 
      height: '100%',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[800] 
        : theme.palette.grey[50],
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <Box 
            sx={{ 
              width: 4, 
              height: 20, 
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 2
            }} 
          />
          進行のコツ
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
            },
            ...focusStyles,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  </Drawer>
);

/**
 * デスクトップ用サイドバー（固定）
 */
const DesktopSidebar: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box sx={{ 
    boxSizing: 'border-box',
    flex: { xs: '1 1 auto', md: '1 1 42%' },
    height: { xs: 'auto', md: '100%' },
    display: 'flex',
    flexDirection: 'column'
  }}>
    {children}
  </Box>
);

/**
 * メインコンテンツエリア
 */
export const MeetingFlowContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box sx={{ 
    boxSizing: 'border-box',
    flex: { xs: '1 1 auto', md: '1 1 45%' },
    height: { xs: 'auto', md: '100%' },
    display: 'flex',
    flexDirection: 'column'
  }}>
    {children}
  </Box>
);

export default MeetingFlowLayout;
