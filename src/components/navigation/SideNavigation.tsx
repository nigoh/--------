/**
 * 左側固定ナビゲーションコンポーネント
 * Material Design 3準拠の管理系アプリナビゲーション
 */
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
  useTheme,
  Collapse,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Shuffle as ShuffleIcon,
  MeetingRoom as MeetingIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  ExpandLess,
  ExpandMore,
  AutoAwesome as AutoAwesomeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../theme/componentStyles';

export interface SideNavigationProps {
  currentTab: number;
  onNavigate: (tab: number) => void;
  onShowMeeting: () => void;
  onOpenSettings?: () => void;
  onOpenPerformance?: () => void;
  width?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  index: number;
  badge?: string;
  children?: NavigationItem[];
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  currentTab,
  onNavigate,
  onShowMeeting,
  onOpenSettings,
  onOpenPerformance,
  width = 280,
  collapsed = false,
  onToggleCollapse,
}) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const mainNavigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      icon: <DashboardIcon />,
      index: -1,
    },
    {
      id: 'team-shuffle',
      label: 'チーム分け',
      icon: <ShuffleIcon />,
      index: 0,
      badge: 'AI',
    },
    {
      id: 'meeting',
      label: 'ミーティング進行',
      icon: <MeetingIcon />,
      index: 3,
    },
    {
      id: 'employee',
      label: '社員管理',
      icon: <PeopleIcon />,
      index: 1,
    },
    {
      id: 'timecard',
      label: '勤怠管理',
      icon: <TimeIcon />,
      index: 2,
    },
  ];

  const settingsNavigationItems: NavigationItem[] = [
    {
      id: 'settings',
      label: '設定',
      icon: <SettingsIcon />,
      index: -3, // 特別な値
    },
    ...(process.env.NODE_ENV === 'development' ? [{
      id: 'performance',
      label: 'パフォーマンス',
      icon: <SpeedIcon />,
      index: -4, // 特別な値
      badge: 'Dev',
    }] : []),
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      // 展開/折りたたみ
      const newExpanded = new Set(expandedItems);
      if (expandedItems.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      // ナビゲーション
      if (item.index === 3) {
        // ミーティング進行機能
        onShowMeeting();
      } else if (item.index === -3) {
        // 設定
        onOpenSettings?.();
      } else if (item.index === -4) {
        // パフォーマンス（開発時のみ）
        onOpenPerformance?.();
      } else {
        // 通常のタブナビゲーション
        onNavigate(item.index);
      }
    }
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const isActive = currentTab === item.index;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const buttonContent = (
      <ListItemButton
        onClick={() => handleItemClick(item)}
        sx={{
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'initial',
          px: collapsed ? 2 : 2.5,
          py: 1,
          ml: depth * 2,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          background: isActive 
            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            : 'transparent',
          color: isActive ? 'white' : theme.palette.text.primary,
          '&:hover': {
            backgroundColor: isActive 
              ? alpha(theme.palette.primary.main, 0.8)
              : alpha(theme.palette.primary.main, 0.08),
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 3,
            justifyContent: 'center',
            color: isActive ? 'white' : theme.palette.text.primary,
          }}
        >
          {item.icon}
        </ListItemIcon>
        
        {!collapsed && (
          <>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
              }}
            />
            
            {/* バッジ表示 */}
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  backgroundColor: isActive 
                    ? 'rgba(255,255,255,0.2)' 
                    : theme.palette.primary.main,
                  color: isActive ? 'white' : 'white',
                  mr: hasChildren ? 1 : 0,
                }}
              />
            )}
            
            {/* 展開アイコン */}
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </>
        )}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          {collapsed ? (
            <Tooltip title={item.label} placement="right">
              {buttonContent}
            </Tooltip>
          ) : (
            buttonContent
          )}
        </ListItem>

        {/* 子項目 */}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderNavigationItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 80 : width,
        height: '100vh',
        flexShrink: 0,
        ...surfaceStyles.surface(theme),
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: theme.zIndex.drawer,
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: collapsed ? 32 : 40,
              height: collapsed ? 32 : 40,
              mr: collapsed ? 0 : 2,
            }}
          >
            <DashboardIcon />
          </Avatar>
          
          {!collapsed && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                WorkApp
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                統合ワークフロー
              </Typography>
            </Box>
          )}
        </Box>

        {/* 折りたたみボタン */}
        {onToggleCollapse && (
          <Tooltip title={collapsed ? '展開' : '折りたたみ'} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                position: collapsed ? 'absolute' : 'static',
                top: collapsed ? 8 : 'auto',
                right: collapsed ? -12 : 0,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                width: 24,
                height: 24,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* メインナビゲーションリスト */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {mainNavigationItems.map(item => renderNavigationItem(item))}
        </List>
      </Box>

      {/* 設定セクション */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
        <List sx={{ py: 0 }}>
          {settingsNavigationItems.map(item => renderNavigationItem(item))}
        </List>
      </Box>

      {/* フッター */}
      {!collapsed && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block',
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          >
            v1.0.0 - Material Design 3
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SideNavigation;
