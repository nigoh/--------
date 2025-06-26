import React, { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useTimecardStore } from './useTimecardStore';

export const TimecardForm: React.FC = () => {
  const { addEntry } = useTimecardStore();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({ date, startTime, endTime, note });
    setNote('');
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        勤怠登録
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="出勤時間"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="退勤時間"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="備考"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={2}
          />
          <Button type="submit" variant="contained">
            登録
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
