import { Box, Typography, TextField } from '@mui/material';
import { Step } from '../features/meetingFlow/meetingFlowData';

interface StepHeaderProps {
  step: Step;
  time: number;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ステップタイトルとタイマー設定UI
 */
export default function StepHeader({ step, time, onTimeChange }: StepHeaderProps) {
  return (
    <Box sx={{ 
      width: '100%', 
      mb: 3, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          flex: 1,
          minWidth: 'fit-content'
        }}
      >
        {step.title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}
        >
          タイマー：
        </Typography>
        <TextField
          type="number"
          value={time}
          onChange={onTimeChange}
          slotProps={{ 
            htmlInput: { 
              min: 1, 
              max: 120, 
              style: { 
                width: 60, 
                textAlign: 'center',
                fontWeight: 600
              } 
            } 
          }}
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                boxShadow: '0 0 0 2px rgba(103, 126, 234, 0.2)',
              },
            },
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}
        >
          分
        </Typography>
      </Box>
    </Box>
  );
}
