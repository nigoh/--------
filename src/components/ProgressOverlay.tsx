/**
 * グローバル進行状況表示コンポーネント
 * 
 * アプリ全体の進行状況をオーバーレイダイアログで表示
 */
import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  LinearProgress,
  Box,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTemporaryStore } from '../stores/useTemporaryStore';

/**
 * 進行状況オーバーレイコンポーネント
 */
export const ProgressOverlay: React.FC = () => {
  const { progress } = useTemporaryStore();

  if (!progress) return null;

  const progressPercentage = Math.min((progress.current / progress.total) * 100, 100);

  return (
    <Dialog
      open={true}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          minWidth: 450,
          maxWidth: 500,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            {progress.label}
          </Typography>
        </Box>
        
        {progress.status === 'running' && (
          <Fade in={true}>
            <Box>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <CircularProgress
                  variant="determinate"
                  value={progressPercentage}
                  size={80}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
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
                  <Typography variant="h6" component="div" color="text.secondary">
                    {Math.round(progressPercentage)}%
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{ 
                  mb: 2, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  },
                }}
              />
              
              <Typography variant="body2" color="text.secondary">
                {progress.current} / {progress.total}
                {progress.total > 1 && ' 件'}
              </Typography>
            </Box>
          </Fade>
        )}

        {progress.status === 'completed' && (
          <Fade in={true}>
            <Box>
              <SuccessIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'success.main',
                  mb: 2,
                }} 
              />
              <Typography variant="h6" color="success.main" gutterBottom>
                完了しました！
              </Typography>
              <Typography variant="body2" color="text.secondary">
                処理が正常に完了しました
              </Typography>
            </Box>
          </Fade>
        )}

        {progress.status === 'error' && (
          <Fade in={true}>
            <Box>
              <ErrorIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'error.main',
                  mb: 2,
                }} 
              />
              <Typography variant="h6" color="error.main" gutterBottom>
                エラーが発生しました
              </Typography>
              <Typography variant="body2" color="text.secondary">
                処理中にエラーが発生しました
              </Typography>
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
};
