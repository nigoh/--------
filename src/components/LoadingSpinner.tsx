import React from 'react';
import { Box, CircularProgress, Typography, Fade, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingSpinnerProps {
  message?: string;
  size?: number | string;
  variant?: 'page' | 'component' | 'inline';
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '読み込み中...',
  size = 40,
  variant = 'component',
  color = 'primary',
}) => {
  const theme = useTheme();

  const getContainerStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'page':
        return {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          gap: 3,
        };
      case 'component':
        return {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 2,
        };
      case 'inline':
        return {
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (variant === 'page') {
      return 'white';
    }
    return theme.palette.text.secondary;
  };

  return (
    <Fade in timeout={300}>
      <Box sx={getContainerStyles()}>
        <CircularProgress
          size={size}
          color={color}
          sx={{
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.6,
              },
              '100%': {
                opacity: 1,
              },
            },
          }}
        />
        
        {message && (
          <Typography
            variant={variant === 'page' ? 'h6' : 'body2'}
            sx={{
              color: getTextColor(),
              fontWeight: variant === 'page' ? 600 : 400,
              textAlign: 'center',
              animation: 'fadeInUp 0.6s ease-out',
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
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

// ページ全体のローディング用のプリセット
export const PageLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner variant="page" size={60} message={message} />
);

// コンポーネント内のローディング用のプリセット
export const ComponentLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner variant="component" size={40} message={message} />
);

// インライン表示用のプリセット
export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner variant="inline" size={20} message={message} />
);

export default LoadingSpinner;
