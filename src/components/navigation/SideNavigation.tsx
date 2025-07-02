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
  ExpandLess,
  ExpandMore,
  AutoAwesome as AutoAwesomeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../theme/componentStyles';
import { gradientTokens } from '../../theme/gradients';
import { spacingTokens, motionTokens } from '../../theme/designSystem';
import { useAuth } from '../../auth';
import { getMainNavigationItems, getSettingsNavigationItems } from './navigationItems';
import type { NavigationItem } from './navigationItems';

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
  const { signOut, user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  // 折りたたみ時に展開状態をリセット
  React.useEffect(() => {
    if (collapsed) {
      setExpandedItems(new Set());
    }
  }, [collapsed]);

  const mainNavigationItems = getMainNavigationItems();
  const settingsNavigationItems = getSettingsNavigationItems();

  const handleItemClick = async (item: NavigationItem, event?: React.MouseEvent) => {
    // 親要素のクリックイベントを停止
    event?.stopPropagation();
    
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
      } else if (item.index === -2) {
        // ログアウト
        try {
          await signOut();
        } catch (error) {
          console.error('ログアウトに失敗しました:', error);
        }
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
      <Box
        onClick={(event) => handleItemClick(item, event)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'initial',
          px: collapsed ? 2 : 2.5,
          py: 1,
          ml: depth * 2,
          borderRadius: '12px',
          mx: 1,
          mb: 0.5,
          background: isActive 
            ? gradientTokens.primary.bold
            : 'transparent',
          color: isActive ? 'white' : theme.palette.text.primary,
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
          '&:hover': {
            background: isActive 
              ? gradientTokens.primary.dark
              : gradientTokens.themeAware.glass(theme.palette.mode === 'dark'),
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateX(2px)',
          },
          // Glowing border effect for active item
          ...(isActive && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '12px',
              padding: '1px',
              background: gradientTokens.primary.bold,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
            },
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 24,
            mr: collapsed ? 0 : 3,
            color: isActive ? 'white' : theme.palette.text.primary,
            '& svg': {
              fontSize: '1.25rem',
              filter: isActive ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' : 'none',
            },
          }}
        >
          {item.icon}
        </Box>
        
        {!collapsed && (
          <>
            <Typography 
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: 'inherit',
                flex: 1,
                letterSpacing: '0.01em',
              }}
            >
              {item.label}
            </Typography>
            
            {/* バッジ表示（改良版） */}
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  background: isActive 
                    ? 'rgba(255,255,255,0.2)' 
                    : gradientTokens.tertiary.subtle,
                  color: isActive ? 'white' : theme.palette.tertiary?.main || theme.palette.primary.main,
                  mr: hasChildren ? 1 : 0,
                  backdropFilter: 'blur(8px)',
                  border: 'none',
                }}
              />
            )}
            
            {/* 展開アイコン */}
            {hasChildren && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                opacity: 0.7,
                transition: `transform ${motionTokens.duration.short4} ${motionTokens.easing.standard}`,
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}>
                <ExpandLess fontSize="small" />
              </Box>
            )}
          </>
        )}
      </Box>
    );

    return (
      <Box key={item.id}>
        {collapsed ? (
          <Tooltip 
            title={item.label} 
            placement="right"
            disableInteractive
            enterDelay={0}
            leaveDelay={0}
            TransitionProps={{ timeout: 0 }}
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  background: gradientTokens.themeAware.surfaceElevated(theme.palette.mode === 'dark'),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                },
              },
            }}
          >
            {buttonContent}
          </Tooltip>
        ) : (
          buttonContent
        )}

        {/* 子項目 */}
        {hasChildren && !collapsed && isExpanded && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 2 }}>
              {item.children!.map(child => renderNavigationItem(child, depth + 1))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 80 : width,
        height: '100vh',
        flexShrink: 0,
        background: gradientTokens.themeAware.surfaceElevated(theme.palette.mode === 'dark'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column',
        transition: `all ${motionTokens.duration.medium3} ${motionTokens.easing.emphasized}`,
        position: 'relative',
        zIndex: theme.zIndex.drawer,
        cursor: collapsed ? 'pointer' : 'default',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        '&:hover': collapsed ? {
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        } : {},
        // Glassmorphism border effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '0 16px 16px 0',
          background: gradientTokens.themeAware.glassBorder(theme.palette.mode === 'dark'),
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        },
      }}
      onClick={collapsed && onToggleCollapse ? onToggleCollapse : undefined}
      title={collapsed ? 'クリックして展開' : undefined}
    >
      {/* ヘッダー（改良版） */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          position: 'relative',
          background: gradientTokens.themeAware.glass(theme.palette.mode === 'dark'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: gradientTokens.primary.bold,
              background: gradientTokens.primary.bold,
              width: collapsed ? 40 : 48,
              height: collapsed ? 40 : 48,
              mr: collapsed ? 0 : 2,
              fontSize: collapsed ? '1rem' : '1.25rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              border: `2px solid ${alpha('#ffffff', 0.2)}`,
            }}
          >
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
          
          {!collapsed && (
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: gradientTokens.primary.bold,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {user?.displayName || 'ユーザー'}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  opacity: 0.7,
                }}
              >
                {user?.email || 'ログイン済み'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 折りたたみボタン（改良版） */}
        {onToggleCollapse && !collapsed && (
          <Tooltip 
            title="折りたたみ" 
            placement="bottom"
            disableInteractive
            enterDelay={0}
            leaveDelay={0}
            TransitionProps={{ timeout: 0 }}
          >
            <IconButton
              onClick={onToggleCollapse}
              disableRipple
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                width: 36,
                height: 36,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* メインナビゲーションリスト */}
      <Box sx={{ flex: 1, overflow: 'auto', py: spacingTokens.sm }}>
        <Box>
          {mainNavigationItems.map(item => renderNavigationItem(item))}
        </Box>
      </Box>

      {/* 設定セクション */}
      <Box sx={{ 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
        pt: spacingTokens.sm,
        background: gradientTokens.themeAware.glass(theme.palette.mode === 'dark'),
      }}>
        <Box sx={{ py: 0 }}>
          {settingsNavigationItems.map(item => renderNavigationItem(item))}
        </Box>
      </Box>

      {/* フッター（改良版） */}
      {!collapsed && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: gradientTokens.themeAware.glass(theme.palette.mode === 'dark'),
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
            WorkApp v2.0 - MD3
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SideNavigation;
