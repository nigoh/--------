/**
 * グローバル通知システムコンポーネント
 * 
 * アプリ全体の通知（Alert）とトースト（Snackbar）を表示
 * テーマ対応、パフォーマンス最適化、アクセシビリティ対応
 */
import React, { useMemo } from 'react';
import {
  Snackbar,
  Alert,
  Stack,
  Portal,
  Slide,
  Fade,
  IconButton,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTemporaryStore } from '../stores/useTemporaryStore';

/**
 * 通知タイプ
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 通知アイコンを取得（メモ化）
 */
const getNotificationIcon = (type: NotificationType) => {
  const iconProps = {
    sx: { fontSize: '1.5rem' }
  };
  
  switch (type) {
    case 'success':
      return <SuccessIcon {...iconProps} />;
    case 'error':
      return <ErrorIcon {...iconProps} />;
    case 'warning':
      return <WarningIcon {...iconProps} />;
    case 'info':
      return <InfoIcon {...iconProps} />;
    default:
      return <InfoIcon {...iconProps} />;
  }
};

/**
 * 通知システムメインコンポーネント
 */
export const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification, toast, hideToast } = useTemporaryStore();
  const theme = useTheme();

  // 通知リストのスタイルをメモ化
  const notificationStackStyles = useMemo(() => ({
    position: 'fixed',
    top: theme.spacing(10), // ナビゲーションの下に表示
    right: theme.spacing(2.5),
    zIndex: theme.zIndex.snackbar + 100,
    maxWidth: '400px',
    minWidth: '320px',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'hidden auto',
    gap: theme.spacing(1),
    // スクロールバースタイル
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
  }), [theme]);

  // アラートのスタイルをメモ化
  const getAlertStyles = useMemo(() => (type: NotificationType) => ({
    borderRadius: `${typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12}px`,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette[type].main, 0.2)}`,
    boxShadow: theme.shadows[4],
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
    '& .MuiAlert-icon': {
      color: theme.palette[type].main,
      fontSize: '1.5rem',
    },
    '& .MuiAlert-message': {
      padding: theme.spacing(1, 0),
      width: '100%',
    },
    '& .MuiAlert-action': {
      paddingTop: 0,
    },
  }), [theme]);

  return (
    <Portal>
      {/* 通知リスト */}
      <Stack sx={notificationStackStyles}>
        {notifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={{
              enter: 400,
              exit: 200,
            }}
            style={{ 
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <Alert
              severity={notification.type}
              onClose={() => removeNotification(notification.id)}
              icon={getNotificationIcon(notification.type)}
              action={
                <IconButton
                  aria-label="通知を閉じる"
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.1),
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={getAlertStyles(notification.type)}
            >
              <Box sx={{ width: '100%' }}>
                {notification.title && (
                  <Typography
                    variant="subtitle2"
                    component="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: notification.message ? 0.5 : 0,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {notification.title}
                  </Typography>
                )}
                {notification.message && (
                  <Typography 
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </Typography>
                )}
              </Box>
            </Alert>
          </Slide>
        ))}
      </Stack>

      {/* トースト */}
      <Snackbar
        open={!!toast}
        autoHideDuration={toast?.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
        sx={{
          '& .MuiSnackbarContent-root': {
            minWidth: 'unset',
          },
        }}
      >
        <Alert
          severity={toast?.type}
          onClose={hideToast}
          icon={toast ? getNotificationIcon(toast.type) : undefined}
          sx={{
            borderRadius: `${typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12}px`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
            minWidth: '300px',
            maxWidth: '500px',
            border: toast ? `1px solid ${alpha(theme.palette[toast.type].main, 0.2)}` : 'none',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem',
              color: toast ? theme.palette[toast.type].main : undefined,
            },
            '& .MuiAlert-message': {
              fontWeight: 500,
            },
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Portal>
  );
};
