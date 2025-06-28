import { Box, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import { DirectionsRun as RunningIcon, Timer as TimerIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import StepNavigator from './StepNavigator';
import StepHeader from '../../components/StepHeader';
import TimerModal from './TimerModal';
import { Step as StepType } from './meetingFlowData';
import React, { useState } from 'react';
import { useTimerHistoryStore } from './useTimerHistoryStore';

interface StepPanelProps {
  step: StepType;
  stepsLength: number;
  activeStep: number;
  timerRunning: boolean;
  showAlert: boolean;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimerFinish: () => void;
  onStart: () => void;
  onPause: () => void;
  onBack: () => void;
  onNext: () => void;
  onReturnToShuffle: () => void;
  onAlertClose: () => void;
  theme: any;
}

const StepPanel: React.FC<StepPanelProps> = ({
  step, stepsLength, activeStep, timerRunning, showAlert, onTimeChange, onTimerFinish, onStart, onPause, onBack, onNext, onReturnToShuffle, onAlertClose, theme: propTheme
}) => {
  const theme = useTheme();
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [customSeconds, setCustomSeconds] = useState(step.time * 60);
  
  // タイマー履歴ストア
  const { startSession, completeSession, cancelSession } = useTimerHistoryStore();

  const handleTimerReset = () => {
    // 実行中の場合は一時停止してからリセット
    if (timerRunning && onPause) {
      onPause();
    }
    setCustomSeconds(step.time * 60);
  };

  const handleTimeChange = (newSeconds: number) => {
    setCustomSeconds(newSeconds);
    // 元のonTimeChangeも呼び出す（分単位に変換）
    if (onTimeChange) {
      const fakeEvent = {
        target: { value: Math.floor(newSeconds / 60).toString() }
      } as React.ChangeEvent<HTMLInputElement>;
      onTimeChange(fakeEvent);
    }
  };

  // タイマー開始時のハンドラー
  const handleTimerStart = () => {
    startSession(step.title, customSeconds, activeStep + 1);
    onStart();
  };

  // タイマー完了時のハンドラー  
  const handleTimerFinish = () => {
    completeSession();
    onTimerFinish();
  };

  return (
    <>
      {/* メインカラー70% - パネル背景 */}
      <Paper elevation={3} sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        minHeight: { xs: 'auto', md: '100%' },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}>
        <StepHeader 
          step={step} 
          time={step.time} 
          onTimeChange={onTimeChange} 
          onReturnToShuffle={onReturnToShuffle}
        />
        
        {/* セカンダリカラー25% - 画像表示エリア */}
        <Box sx={{
          width: '100%',
          p: 2,
          mb: 3,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[50],
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}>
          <Box
            component="img"
            src={step.contents.imageUrl}
            alt={step.title + 'のイメージ画像'}
            sx={{
              width: '100%',
              height: { xs: 200, sm: 280, md: 400 },
              borderRadius: 2,
              objectFit: 'contain',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[4],
              },
            }}
          />
        </Box>

        <StepNavigator
          activeStep={activeStep}
          stepsLength={stepsLength}
          onBack={onBack}
          onNext={onNext}
          theme={propTheme}
        />
        
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          my: 2 
        }}>
          <Box sx={{ 
            width: '60%', 
            height: '2px', 
            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}60, transparent)`,
            borderRadius: 1 
          }} />
        </Box>

        {/* タイマーボタン - アクセントカラー5% */}
        <Button
          variant="contained"
          onClick={() => setTimerModalOpen(true)}
          startIcon={<TimerIcon />}
          size="large"
          sx={{
            borderRadius: 3,
            px: 6,
            py: 2,
            fontWeight: 700,
            fontSize: '1.2rem',
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: theme.palette.primary.contrastText,
            boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
            transition: 'all 0.3s ease-in-out',
            mb: 3,
            '&:hover': {
              transform: 'translateY(-3px) scale(1.02)',
              boxShadow: `0 8px 24px ${theme.palette.primary.main}60`,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            },
          }}
        >
          {timerRunning ? `タイマー実行中 (${Math.floor(customSeconds / 60)}分)` : `タイマー開始 (${Math.floor(customSeconds / 60)}分)`}
        </Button>

        {/* ステータス表示 */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: timerRunning ? theme.palette.success.main : theme.palette.text.secondary,
            fontWeight: 500,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {timerRunning ? (
            <>
              <RunningIcon sx={{ fontSize: 16 }} />
              タイマー実行中...
            </>
          ) : (
            <>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              タイマー待機中
            </>
          )}
        </Typography>
      </Paper>

      {/* タイマーモーダル */}
      <TimerModal
        open={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        seconds={customSeconds}
        running={timerRunning}
        onFinish={handleTimerFinish}
        onStart={handleTimerStart}
        onPause={onPause}
        onReset={handleTimerReset}
        onTimeChange={handleTimeChange}
        title={`${step.title} - ステップ${activeStep + 1}`}
      />
      
      {/* タイムアップモーダル */}
      <Dialog
        open={showAlert}
        onClose={onAlertClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.warning.main}`,
            boxShadow: `0 16px 32px ${theme.palette.warning.main}40`,
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: theme.palette.warning.main,
          pb: 1,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[50],
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}>
          ⏰ タイムアップ！
        </DialogTitle>
        <DialogContent sx={{ 
          textAlign: 'center',
          py: 3,
          px: 3,
          backgroundColor: theme.palette.background.default,
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1,
          }}>
            時間です！
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            mb: 2
          }}>
            お疲れ様でした！
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.palette.text.secondary,
            lineHeight: 1.6
          }}>
            次のステップに進む場合は、下部のナビゲーションをご利用ください。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          pb: 3,
          px: 3,
          backgroundColor: theme.palette.background.default,
        }}>
          <Button
            onClick={onAlertClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              color: theme.palette.warning.contrastText,
              boxShadow: `0 4px 16px ${theme.palette.warning.main}40`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
                boxShadow: `0 6px 20px ${theme.palette.warning.main}60`,
                transform: 'translateY(-2px)',
              }
            }}
          >
            了解
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StepPanel;
