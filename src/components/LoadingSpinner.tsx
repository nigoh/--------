import React from 'react';
import { Box, CircularProgress, Typography, Fade, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingSpinnerProps {
  message?: string;
  size?: number | string;
  variant?: 'page' | 'component' | 'inline';
  color?: 'primary' | 'secondary' | 'inherit';
  backdrop?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '読み込み中...',
  size = 40,
  variant = 'component',
  color = 'primary',
  backdrop = false,
}) => {
  const theme = useTheme();

  const getContainerStyles = (): SxProps<Theme> => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'page':
        return {
          ...baseStyles,
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          gap: 3,
          position: backdrop ? 'fixed' : 'static',
          top: backdrop ? 0 : 'auto',
          left: backdrop ? 0 : 'auto',
          right: backdrop ? 0 : 'auto',
          bottom: backdrop ? 0 : 'auto',
          zIndex: backdrop ? theme.zIndex.modal : 'auto',
          ...(backdrop && {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
          }),
        };
      case 'component':
        return {
          ...baseStyles,
          flexDirection: 'column',
          minHeight: 200,
          padding: theme.spacing(3),
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          gap: 2,
        };
      case 'inline':
        return {
          ...baseStyles,
          gap: theme.spacing(1),
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): SxProps<Theme> => ({
    color: variant === 'page' 
      ? theme.palette.text.primary 
      : theme.palette.text.secondary,
    fontWeight: variant === 'page' ? 600 : 400,
    textAlign: 'center',
    opacity: 0,
    animation: 'fadeInUp 0.6s ease-out 0.3s forwards',
    '@keyframes fadeInUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  });

  return (
    <Fade in timeout={300}>
      <Box sx={getContainerStyles()}>
        <CircularProgress
          size={size}
          color={color}
          sx={{
            opacity: 0,
            animation: 'spinnerAppear 0.6s ease-out forwards',
            '@keyframes spinnerAppear': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        />
        
        {message && (
          <Typography
            variant={variant === 'page' ? 'h6' : 'body2'}
            sx={getTextStyles()}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

// ページ全体のローディング用のプリセット
export const PageLoader: React.FC<{ message?: string; backdrop?: boolean }> = ({ 
  message, 
  backdrop = true 
}) => (
  <LoadingSpinner 
    variant="page" 
    size={60} 
    message={message} 
    backdrop={backdrop}
  />
);

// コンポーネント内のローディング用のプリセット
export const ComponentLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner variant="component" size={40} message={message} />
);

// インライン表示用のプリセット
export const InlineLoader: React.FC<{ message?: string; size?: number }> = ({ 
  message, 
  size = 20 
}) => (
  <LoadingSpinner variant="inline" size={size} message={message} />
);

// ボタンローディング用のプリセット
export const ButtonLoader: React.FC = () => (
  <LoadingSpinner variant="inline" size={16} color="inherit" />
);

export default LoadingSpinner;
