import { Box, Typography } from '@mui/material';
import { Step } from './meetingFlowData';

interface StepInstructionsProps {
  step: Step;
}

export default function StepInstructions({ step }: StepInstructionsProps) {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{step.instructions}</Typography>
    </Box>
  );
}
