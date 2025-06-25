import { Box, Typography, TextField, Button } from '@mui/material';
import { Step } from '../features/meetingFlow/meetingFlowData';

interface StepHeaderProps {
  step: Step;
  time: number;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReturnToShuffle?: () => void;
}

/**
 * ステップタイトルとタイマー設定UI
 */
export default function StepHeader({ step, time, onTimeChange, onReturnToShuffle }: StepHeaderProps) {
  return (
    <Box sx={{ 
      width: '100%', 
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      flexWrap: { xs: 'wrap', md: 'nowrap' }
    }}>
      {/* 左側: 戻るボタン */}
      <Box sx={{ flex: '0 0 auto', order: { xs: 3, md: 1 } }}>
        {onReturnToShuffle && (
          <Button 
            variant="outlined" 
            color="secondary" 
            size="small"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              px: 2,
              py: 1,
              fontSize: '0.8rem',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(118, 75, 162, 0.2)',
              },
            }} 
            onClick={onReturnToShuffle}
          >
            ← チーム分けに戻る
          </Button>
        )}
      </Box>

      {/* 中央: メインタイトル */}
      <Box sx={{ 
        flex: '1 1 auto', 
        textAlign: 'center',
        order: { xs: 1, md: 2 },
        width: { xs: '100%', md: 'auto' }
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(103, 126, 234, 0.1)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {step.title}
        </Typography>
      </Box>

      {/* 右側: タイマー設定 */}
      <Box sx={{ 
        flex: '0 0 auto',
        order: { xs: 2, md: 3 },
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
