import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TimePickerPanelProps {
  selectedMinutes: number;
  selectedSeconds: number;
  onTimeChange: (minutes: number, seconds: number) => void;
}

export const TimePickerPanel: React.FC<TimePickerPanelProps> = ({
  selectedMinutes,
  selectedSeconds,
  onTimeChange,
}) => {
  const theme = useTheme();
  const minuteOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60];
  const secondOptions = [0, 15, 30, 45];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 3,
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[50],
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <AccessTimeIcon /> 時間を選択
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>分</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 300 }}>
          {minuteOptions.map((m) => (
            <Button
              key={m}
              variant={selectedMinutes === m ? 'contained' : 'outlined'}
              onClick={() => onTimeChange(m, selectedSeconds)}
              sx={{ minWidth: 60, height: 60, borderRadius: '50%', fontWeight: 600 }}
            >
              {m}
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>秒</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {secondOptions.map((s) => (
            <Button
              key={s}
              variant={selectedSeconds === s ? 'contained' : 'outlined'}
              onClick={() => onTimeChange(selectedMinutes, s)}
              sx={{ minWidth: 60, height: 60, borderRadius: '50%', fontWeight: 600 }}
            >
              {s}
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'primary.main' }}>
        <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
          {selectedMinutes}:{selectedSeconds.toString().padStart(2, '0')}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          選択された時間
        </Typography>
      </Box>
    </Box>
  );
};

export default TimePickerPanel;
