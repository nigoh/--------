import { Stack, IconButton, Typography, Box } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { focusStyles } from '../../utils/accessibility';

interface StepNavigatorProps {
  activeStep: number;
  stepsLength: number;
  onBack: () => void;
  onNext: () => void;
  theme: any;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({ activeStep, stepsLength, onBack, onNext, theme }) => {
  const { isMobile } = useResponsive();
  
  return (
    <Stack 
      direction="row" 
      spacing={isMobile ? 2 : 3} 
      alignItems="center" 
      justifyContent="center" 
      sx={{ 
        width: '100%', 
        mt: 3, 
        mb: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)',
        padding: isMobile ? '8px 16px' : '12px 24px',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(103, 126, 234, 0.08)',
      }}
    >
      <IconButton 
        size={isMobile ? "medium" : "large"}
        onClick={onBack} 
        disabled={activeStep === 0}
        sx={{
          backgroundColor: 'rgba(103, 126, 234, 0.1)',
          border: '2px solid rgba(103, 126, 234, 0.2)',
          transition: 'all 0.2s ease-in-out',
          minWidth: isMobile ? 44 : 48,
          minHeight: isMobile ? 44 : 48,
          ...focusStyles,
        '&:hover': {
          backgroundColor: 'rgba(103, 126, 234, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(103, 126, 234, 0.3)',
        },
        '&:disabled': {
          backgroundColor: 'rgba(148, 163, 184, 0.1)',
          border: '2px solid rgba(148, 163, 184, 0.2)',
          transform: 'none',
          boxShadow: 'none',
        },
      }}
    >
      {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
    </IconButton>
    
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      minWidth: 120,
      justifyContent: 'center'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          fontSize: '1.25rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {activeStep + 1}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          color: 'text.secondary'
        }}
      >
        /
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          fontSize: '1.25rem',
          color: 'text.secondary'
        }}
      >
        {stepsLength}
      </Typography>
    </Box>
    
    <IconButton 
      size="large" 
      onClick={onNext} 
      disabled={activeStep === stepsLength - 1}
      sx={{
        backgroundColor: 'rgba(103, 126, 234, 0.1)',
        border: '2px solid rgba(103, 126, 234, 0.2)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(103, 126, 234, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(103, 126, 234, 0.3)',
        },
        '&:disabled': {
          backgroundColor: 'rgba(148, 163, 184, 0.1)',
          border: '2px solid rgba(148, 163, 184, 0.2)',
          transform: 'none',
          boxShadow: 'none',
        },
      }}
    >
      {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
    </IconButton>
    </Stack>
  );
};

export default StepNavigator;
