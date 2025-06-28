import React from 'react';
import { 
  Box, 
  Container,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  useMediaQuery
} from '@mui/material';
import { 
  Shuffle as ShuffleIcon, 
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { surfaceStyles } from '../../theme/componentStyles';

/**
 * App Header Component
 * アプリケーションのヘッダー部分を管理
 * ロゴ、ナビゲーション、モバイルメニューボタンを含む
 */

interface AppHeaderProps {
  currentTheme: any;
  currentTab: number;
  onTabChange: (value: number) => void;
  onBackToDashboard: () => void;
  onOpenMobileDrawer: () => void;
  isMobile: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTheme,
  currentTab,
  onTabChange,
  onBackToDashboard,
  onOpenMobileDrawer,
  isMobile
}) => {
  return (
    <Box
      sx={{
        ...surfaceStyles.glassmorphism(currentTheme),
        borderBottom: `1px solid ${currentTheme.palette.divider}`,
        position: 'relative',
        zIndex: 1200,
        flexShrink: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          minHeight: 64,
        }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: currentTheme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <DashboardIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              WorkApp
            </Typography>
          </Box>

          {/* Desktop Navigation Tabs */}
          {!isMobile && currentTab >= 0 && (
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => onTabChange(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  background: `linear-gradient(45deg, ${currentTheme.palette.primary.main} 30%, ${currentTheme.palette.secondary.main} 90%)`,
                  height: 3,
                  borderRadius: '2px 2px 0 0',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    color: currentTheme.palette.primary.main,
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <Tab icon={<ShuffleIcon />} label="チーム分け" />
              <Tab icon={<PeopleIcon />} label="社員管理" />
              <Tab icon={<TimeIcon />} label="勤怠管理" />
            </Tabs>
          )}

          {/* Mobile Menu Button & Back to Dashboard Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {currentTab >= 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={onBackToDashboard}
                sx={{ borderRadius: 2 }}
              >
                <DashboardIcon sx={{ mr: { xs: 0, sm: 1 } }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                  ダッシュボード
                </Typography>
              </Button>
            )}
            
            {isMobile && (
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenMobileDrawer}
                sx={{ borderRadius: 2, minWidth: 'auto', p: 1 }}
              >
                <MenuIcon />
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AppHeader;
