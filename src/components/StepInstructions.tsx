import { Box, Typography, Fade, keyframes } from '@mui/material';
import { Step } from '../features/meetingFlow/meetingFlowData';

// アニメーション定義
const fadeInUp = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

interface StepInstructionsProps {
  step: Step;
}

/**
 * ステップごとの説明文
 */
export default function StepInstructions({ step }: StepInstructionsProps) {
  return (
    <Fade in timeout={600}>
      <Box sx={{ 
        width: '100%', 
        mb: 3,
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(103, 126, 234, 0.08)',
        animation: `${fadeInUp} 0.6s ease-out`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.95)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(103, 126, 234, 0.12)',
        },
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line',
            lineHeight: 1.8,
            fontSize: '1.1rem',
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {step.contents.instructions}
        </Typography>
      </Box>
    </Fade>
  );
}
