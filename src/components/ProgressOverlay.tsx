/**
 * グローバル進行状況表示コンポーネント
 * 
 * アプリ全体の進行状況をオーバーレイダイアログで表示
 * テーマ対応、アクセシビリティ改善、パフォーマンス最適化
 */
import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  LinearProgress,
  Box,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTemporaryStore } from '../stores/useTemporaryStore';

/**
 * 進行状況オーバーレイコンポーネント
 */
export const ProgressOverlay: React.FC = () => {
  const { progress, clearProgress } = useTemporaryStore();
  const theme = useTheme();

  // ダイアログスタイルをメモ化
  const dialogStyles = useMemo(() => ({
    minWidth: { xs: '300px', sm: '450px' },
    maxWidth: { xs: '90vw', sm: '500px' },
    padding: theme.spacing(4),
    borderRadius: `${typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16}px`,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: theme.shadows[10],
  }), [theme]);

  // プログレスの計算をメモ化
  const progressData = useMemo(() => {
    if (!progress) return null;
    const percentage = Math.min((progress.current / progress.total) * 100, 100);
    return { percentage, isCompleted: percentage === 100 };
  }, [progress]);

  if (!progress) return null;

  const { percentage } = progressData!;
  const canClose = progress.status === 'completed' || progress.status === 'error';

  return (
    <Dialog
      open={true}
      disableEscapeKeyDown={!canClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: dialogStyles,
          role: 'dialog',
          'aria-labelledby': 'progress-title',
          'aria-describedby': 'progress-description',
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', padding: 0 }}>
        <Box sx={{ marginBottom: theme.spacing(3) }}>
          <Typography 
            id="progress-title"
            variant="h6" 
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              marginBottom: theme.spacing(1),
            }}
          >
            {progress.label}
          </Typography>
        </Box>
        
        {progress.status === 'running' && (
          <Fade in={true} timeout={400}>
            <Box role="progressbar" aria-live="polite">
              <Box sx={{ 
                position: 'relative', 
                marginBottom: theme.spacing(3),
                display: 'flex',
                justifyContent: 'center',
              }}>
                <CircularProgress
                  variant="determinate"
                  value={percentage}
                  size={100}
                  thickness={3}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {Math.round(percentage)}%
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{ 
                  marginBottom: theme.spacing(2), 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: theme.palette.primary.main,
                    transition: theme.transitions.create('transform', {
                      duration: theme.transitions.duration.short,
                    }),
                  },
                }}
              />
              
              <Typography 
                id="progress-description"
                variant="body2" 
                sx={{ color: theme.palette.text.secondary }}
              >
                {progress.current} / {progress.total}
                {progress.total > 1 && ' 件'}
              </Typography>
            </Box>
          </Fade>
        )}

        {progress.status === 'completed' && (
          <Fade in={true} timeout={500}>
            <Box>
              <SuccessIcon 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.success.main,
                  marginBottom: theme.spacing(2),
                  animation: 'bounceIn 0.6s ease-out',
                  '@keyframes bounceIn': {
                    '0%': { 
                      opacity: 0, 
                      transform: 'scale(0.3)' 
                    },
                    '50%': { 
                      opacity: 1, 
                      transform: 'scale(1.05)' 
                    },
                    '100%': { 
                      opacity: 1, 
                      transform: 'scale(1)' 
                    },
                  },
                }} 
                aria-label="完了"
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.success.main,
                  marginBottom: theme.spacing(1),
                  fontWeight: 600,
                }}
              >
                完了しました！
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  marginBottom: theme.spacing(3),
                }}
              >
                処理が正常に完了しました
              </Typography>
              <Button
                variant="contained"
                onClick={clearProgress}
                sx={{
                  borderRadius: `${typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12}px`,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                閉じる
              </Button>
            </Box>
          </Fade>
        )}

        {progress.status === 'error' && (
          <Fade in={true} timeout={500}>
            <Box>
              <ErrorIcon 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.error.main,
                  marginBottom: theme.spacing(2),
                  animation: 'shake 0.6s ease-in-out',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                  },
                }} 
                aria-label="エラー"
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.error.main,
                  marginBottom: theme.spacing(1),
                  fontWeight: 600,
                }}
              >
                エラーが発生しました
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  marginBottom: theme.spacing(3),
                }}
              >
                処理中にエラーが発生しました
              </Typography>
              <Button
                variant="outlined"
                onClick={clearProgress}
                startIcon={<CloseIcon />}
                sx={{
                  borderRadius: `${typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12}px`,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.dark,
                    backgroundColor: alpha(theme.palette.error.main, 0.05),
                  },
                }}
              >
                閉じる
              </Button>
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
};
