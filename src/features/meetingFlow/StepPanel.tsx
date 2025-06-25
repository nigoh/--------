import { Box, Paper, Grid, Divider, MobileStepper, Button, Stack, Typography, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, keyframes } from '@mui/material';
import StepNavigator from './StepNavigator';
import StepHeader from '../../components/StepHeader';
import StepInstructions from '../../components/StepInstructions';
import Timer from '../../components/Timer';
import { Step as StepType } from './meetingFlowData';
import React from 'react';

// モーダルアニメーション定義
const modalPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const titleShine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const buttonHover = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

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
  step, stepsLength, activeStep, timerRunning, showAlert, onTimeChange, onTimerFinish, onStart, onPause, onBack, onNext, onReturnToShuffle, onAlertClose, theme
}) => (
  <Paper elevation={3} sx={{
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
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
      boxShadow: '0 12px 40px rgba(103, 126, 234, 0.15)',
    },
  }}>
    <StepHeader 
      step={step} 
      time={step.time} 
      onTimeChange={onTimeChange} 
      onReturnToShuffle={onReturnToShuffle}
    />
    
    <Box
      component="img"
      src={step.contents.imageUrl}
      alt={step.title + 'のイメージ画像'}
      sx={{
        width: '100%',
        height: { xs: 200, sm: 280, md: 400 },
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        objectFit: 'contain',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        },
      }}
    />

    <StepNavigator
      activeStep={activeStep}
      stepsLength={stepsLength}
      onBack={onBack}
      onNext={onNext}
      theme={theme}
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
        background: 'linear-gradient(90deg, transparent, rgba(103, 126, 234, 0.3), transparent)',
        borderRadius: 1 
      }} />
    </Box>

    <Timer
      seconds={step.time * 60}
      running={timerRunning}
      onFinish={onTimerFinish}
      onStart={onStart}
      onPause={onPause}
    />
    
    {/* タイムアップモーダル */}
    <Dialog
      open={showAlert}
      onClose={onAlertClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        transition: {
          timeout: { enter: 200, exit: 150 },
          easing: { enter: 'ease-in-out', exit: 'ease-in-out' }
        },
        paper: {
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            boxShadow: '0 16px 64px rgba(251, 191, 36, 0.2)',
            animation: `${modalPulse} 2s ease-in-out infinite`,
          } 
        }
      }}
      sx={{
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
        color: '#f59e0b',
        pb: 1,
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
        backgroundSize: '200% 100%',
        animation: `${titleShine} 3s ease-in-out infinite`,
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: `${titleShine} 2s ease-in-out infinite`,
        }
      }}>
        ⏰ タイムアップ！
      </DialogTitle>
      <DialogContent sx={{ 
        textAlign: 'center',
        py: 3,
        px: 3
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          animation: `${modalPulse} 1.5s ease-in-out infinite`,
        }}>
          時間です！
        </Typography>
        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
          lineHeight: 1.6,
          mb: 2
        }}>
          お疲れ様でした！
        </Typography>
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          lineHeight: 1.6
        }}>
          次のステップに進む場合は、下部のナビゲーションをご利用ください。
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center',
        pb: 3,
        px: 3
      }}>
        <Button
          onClick={onAlertClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: `${modalPulse} 1s ease-in-out infinite`,
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)',
              animation: `${buttonHover} 0.6s ease-in-out infinite`,
              transform: 'translateY(-2px)',
            }
          }}
        >
          了解
        </Button>
      </DialogActions>
    </Dialog>
  </Paper>
);

export default StepPanel;
