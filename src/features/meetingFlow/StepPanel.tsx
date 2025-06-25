import { Box, Paper, Grid, Divider, Alert, MobileStepper, Button, Stack, Typography, Card, CardContent, CardHeader } from '@mui/material';
import StepNavigator from './StepNavigator';
import StepHeader from '../../components/StepHeader';
import StepInstructions from '../../components/StepInstructions';
import Timer from '../../components/Timer';
import { Step as StepType } from './meetingFlowData';
import React from 'react';

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
  theme: any;
}

const StepPanel: React.FC<StepPanelProps> = ({
  step, stepsLength, activeStep, timerRunning, showAlert, onTimeChange, onTimerFinish, onStart, onPause, onBack, onNext, onReturnToShuffle, theme
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
    <StepHeader step={step} time={step.time} onTimeChange={onTimeChange} />
    
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
    
    {showAlert && (
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 2, 
          fontWeight: 600, 
          fontSize: '1.1em',
          borderRadius: 2,
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          '& .MuiAlert-icon': {
            color: '#f59e0b',
          },
        }}
      >
        時間です！次のステップへ進んでください。
      </Alert>
    )}

    <Button 
      variant="outlined" 
      color="secondary" 
      size="large" 
      sx={{ 
        maxWidth: 200, 
        mt: 2,
        borderRadius: 2,
        fontWeight: 600,
        px: 3,
        py: 1.5,
        borderWidth: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderWidth: 2,
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(118, 75, 162, 0.2)',
        },
      }} 
      onClick={onReturnToShuffle}
    >
      チーム分けに戻る
    </Button>
  </Paper>
);

export default StepPanel;
