/**
 * グローバル通知システムコンポーネント
 * 
 * アプリ全体の通知（Alert）とトースト（Snackbar）を表示
 */
import React from 'react';
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
 * 通知アイコンを取得
 */
const getNotificationIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    default:
      return <InfoIcon />;
  }
};

/**
 * 通知システムメインコンポーネント
 */
export const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification, toast, hideToast } = useTemporaryStore();

  return (
    <Portal>
      {/* 通知リスト */}
      <Stack
        spacing={1}
        sx={{
          position: 'fixed',
          top: 80, // ナビゲーションの下に表示
          right: 20,
          zIndex: 9999,
          maxWidth: 400,
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
        }}
      >
        {notifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={300}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Alert
              severity={notification.type}
              onClose={() => removeNotification(notification.id)}
              icon={getNotificationIcon(notification.type)}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                boxShadow: 4,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
                '& .MuiAlert-message': {
                  padding: '8px 0',
                },
              }}
            >
              <Box>
                {notification.title && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                      mb: notification.message ? 0.5 : 0,
                    }}
                  >
                    {notification.title}
                  </Typography>
                )}
                {notification.message && (
                  <Typography variant="body2">
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
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 300,
            '& .MuiAlert-icon': {
              fontSize: '1.25rem',
            },
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Portal>
  );
};
