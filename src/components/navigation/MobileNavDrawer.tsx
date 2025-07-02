import React from 'react';
import { 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography
} from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { useAuth } from '../../auth';
import { getMainNavigationItems, getSettingsNavigationItems } from './navigationItems';
import type { NavigationItem } from './navigationItems';
import { createModernTheme } from '../../theme/modernTheme';
import { useThemeContext } from '../../contexts/ThemeContext';

/**
 * Mobile Navigation Drawer
 * モバイル用のサイドドロワーナビゲーション
 * ハンバーガーメニューから展開される
 */

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTab: number;
  onNavigate: (tab: number) => void;
  onShowMeeting: () => void;
  onOpenSettings?: () => void;
  onOpenPerformance?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ 
  open, 
  onClose, 
  currentTab, 
  onNavigate, 
  onShowMeeting,
  onOpenSettings,
  onOpenPerformance 
}) => {
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const { user, signOut } = useAuth();
  const theme = createModernTheme({ 
    mode: isDarkMode ? 'dark' : 'light',
    highContrast: isHighContrast,
    fontSize 
  });
  
  const mainNavigationItems = getMainNavigationItems();
  const settingsNavigationItems = getSettingsNavigationItems();

  const handleItemClick = async (item: NavigationItem) => {
    if (item.index === 3) {
      // ミーティング進行機能
      onShowMeeting();
    } else if (item.index === -3) {
      // 設定
      onOpenSettings?.();
    } else if (item.index === -4) {
      // パフォーマンス（開発時のみ）
      onOpenPerformance?.();
    } else if (item.index === -2) {
      // ログアウト
      try {
        await signOut();
      } catch (error) {
        console.error('ログアウトに失敗しました:', error);
      }
    } else {
      // 通常のタブナビゲーション（ダッシュボード含む）
      onNavigate(item.index);
    }
    onClose();
  };
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <Dashboard />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            WorkApp
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
        
        {/* メインナビゲーション */}
        <List>
          {mainNavigationItems.map((item) => (
            <ListItem
              key={item.index}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: currentTab === item.index ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        {/* 設定セクション */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
        <List>
          {settingsNavigationItems.map((item) => (
            <ListItem
              key={item.index}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileNavDrawer;
