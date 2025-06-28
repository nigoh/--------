import React from 'react';
import { 
  Box, 
  Button,
  useMediaQuery
} from '@mui/material';
import { 
  Shuffle as ShuffleIcon, 
  People as PeopleIcon,
  MeetingRoom as MeetingIcon, 
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { createModernTheme } from '../../theme/modernTheme';
import { useThemeContext } from '../../contexts/ThemeContext';
import { surfaceStyles } from '../../theme/componentStyles';

/**
 * Floating Navigation Component
 * デスクトップ用の固定サイドナビゲーション
 * 画面右側に浮遊する形で表示される
 */

interface FloatingNavigationProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
  onShowMeeting: () => void;
  isVisible: boolean;
}

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ 
  currentTab, 
  onTabChange, 
  onShowMeeting, 
  isVisible 
}) => {
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const theme = createModernTheme({ 
    mode: isDarkMode ? 'dark' : 'light',
    highContrast: isHighContrast,
    fontSize 
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // モバイルでは表示しない
  if (isMobile) return null;
  
  const navigationItems = [
    { icon: <ShuffleIcon />, label: 'チーム分け', index: 0 },
    { icon: <MeetingIcon />, label: 'ミーティング進行', index: 3 },
    { icon: <PeopleIcon />, label: '社員管理', index: 1 },
    { icon: <TimeIcon />, label: '勤怠管理', index: 2 },
  ];

  const handleNavigationClick = (item: typeof navigationItems[0]) => {
    if (item.index === 3) {
      // ミーティング進行機能
      onShowMeeting();
    } else {
      // 通常のタブナビゲーション
      onTabChange(item.index);
    }
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        right: 24,
        transform: 'translateY(-50%)',
        zIndex: 1100, // 設定ボタン(1500)より下に設定
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Box
        sx={{
          ...surfaceStyles.glassmorphism(theme),
          padding: 1,
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {navigationItems.map((item) => (
          <Button
            key={item.index}
            onClick={() => handleNavigationClick(item)}
            sx={{
              minWidth: 48,
              height: 48,
              borderRadius: '16px',
              backgroundColor: currentTab === item.index ? theme.palette.primary.main : 'transparent',
              color: currentTab === item.index ? 'white' : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: currentTab === item.index 
                  ? theme.palette.primary.dark 
                  : theme.palette.action.hover,
              },
            }}
            aria-label={item.label}
          >
            {item.icon}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default FloatingNavigation;
