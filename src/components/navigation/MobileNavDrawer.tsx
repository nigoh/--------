import React from 'react';
import { 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  alpha,
} from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { useAuth } from '../../auth';
import { getMainNavigationItems, getSettingsNavigationItems } from './navigationItems';
import type { NavigationItem } from './navigationItems';
import { createModernTheme } from '../../theme/modernTheme';
import { gradientTokens } from '../../theme/gradients';
import { spacingTokens, motionTokens } from '../../theme/designSystem';
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
          width: 320,
          background: gradientTokens.themeAware.surfaceElevated(isDarkMode),
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: '0 24px 24px 0',
          overflow: 'hidden',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      }}
    >
      {/* ヘッダー部分（改良版） */}
      <Box sx={{ 
        p: spacingTokens.lg,
        background: gradientTokens.primary.bold,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装飾的背景効果 */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: spacingTokens.md, position: 'relative', zIndex: 1 }}>
          <Avatar 
            sx={{ 
              mr: spacingTokens.md, 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 56,
              height: 56,
              fontSize: '1.5rem',
              fontWeight: 700,
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user?.displayName || 'ユーザー'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
              {user?.email || 'ログイン済み'}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          WorkApp
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          業務支援アプリケーション
        </Typography>
      </Box>
        
      {/* メインナビゲーション */}
      <Box sx={{ flex: 1, p: spacingTokens.md }}>
        <Typography 
          variant="overline" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: spacingTokens.sm,
            px: spacingTokens.sm,
            letterSpacing: '0.1em',
          }}
        >
          メイン機能
        </Typography>
        
        <List sx={{ p: 0 }}>
          {mainNavigationItems.map((item) => (
            <ListItem
              key={item.index}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: '12px',
                mb: spacingTokens.xs,
                p: 0,
                overflow: 'hidden',
                transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                '&:hover': {
                  transform: 'translateX(4px)',
                  '& .MuiListItemButton-root': {
                    background: gradientTokens.themeAware.glass(isDarkMode),
                  },
                },
              }}
            >
              <ListItemButton
                selected={currentTab === item.index}
                sx={{
                  borderRadius: '12px',
                  py: spacingTokens.md,
                  px: spacingTokens.md,
                  transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                  '&.Mui-selected': {
                    background: gradientTokens.primary.bold,
                    color: 'white',
                    '&:hover': {
                      background: gradientTokens.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 40,
                    '& svg': {
                      fontSize: '1.25rem',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentTab === item.index ? 600 : 500,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* 設定セクション */}
        <Divider sx={{ 
          my: spacingTokens.lg,
          borderColor: alpha(theme.palette.divider, 0.1),
        }} />
        
        <Typography 
          variant="overline" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: spacingTokens.sm,
            px: spacingTokens.sm,
            letterSpacing: '0.1em',
          }}
        >
          設定・その他
        </Typography>
        
        <List sx={{ p: 0 }}>
          {settingsNavigationItems.map((item) => (
            <ListItem
              key={item.index}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: '12px',
                mb: spacingTokens.xs,
                p: 0,
                transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                '&:hover': {
                  transform: 'translateX(4px)',
                  '& .MuiListItemButton-root': {
                    background: gradientTokens.themeAware.glass(isDarkMode),
                  },
                },
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: '12px',
                  py: spacingTokens.sm,
                  px: spacingTokens.md,
                  transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                  '&:hover': {
                    background: item.id === 'logout' 
                      ? gradientTokens.semantic.error
                      : gradientTokens.themeAware.glass(isDarkMode),
                    color: item.id === 'logout' ? 'white' : 'inherit',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 40,
                    '& svg': {
                      fontSize: '1.1rem',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.85rem',
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      background: gradientTokens.tertiary.subtle,
                      color: theme.palette.tertiary?.main || theme.palette.primary.main,
                      borderRadius: '8px',
                      px: spacingTokens.xs,
                      py: '2px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* フッター */}
      <Box sx={{ 
        p: spacingTokens.md,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: gradientTokens.themeAware.glass(isDarkMode),
      }}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            display: 'block',
            textAlign: 'center',
            fontSize: '0.7rem',
            opacity: 0.6,
            fontWeight: 500,
          }}
        >
          WorkApp v2.0 - Material Design 3
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MobileNavDrawer;
