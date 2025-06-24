import { Box, Typography, TextField } from '@mui/material';

export interface Step {
  title: string;
  instructions: string;
  time: number;
}

interface StepHeaderProps {
  step: Step;
  time: number;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepHeader({ step, time, onTimeChange }: StepHeaderProps) {
  return (
    <Box sx={{ width: '100%', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="number"
          value={time}
          onChange={onTimeChange}
          inputProps={{ min: 1, max: 120, style: { width: 48, textAlign: 'right' } }}
          size="small"
          sx={{ mr: 1 }}
        />
        <Typography variant="body2">分</Typography>
      </Box>
    </Box>
  );
}
