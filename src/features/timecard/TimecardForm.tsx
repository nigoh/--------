import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from '@mui/material';
import { useTimecardStore } from './useTimecardStore';

export const TimecardForm: React.FC = () => {
  const { addEntry } = useTimecardStore();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [note, setNote] = useState('');
  const [isAbsence, setIsAbsence] = useState(false);
  const [absenceReason, setAbsenceReason] = useState('');
  const [absenceType, setAbsenceType] = useState<'planned' | 'sudden'>('planned');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({
      date,
      startTime: isAbsence ? '' : startTime,
      endTime: isAbsence ? '' : endTime,
      note,
      isAbsence,
      absenceReason: isAbsence ? absenceReason : undefined,
      absenceType: isAbsence ? absenceType : undefined,
    });
    setNote('');
    setAbsenceReason('');
    setIsAbsence(false);
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isAbsence}
                onChange={(e) => setIsAbsence(e.target.checked)}
              />
            }
            label="休暇"
          />
          <TextField
            label="出勤時間"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isAbsence}
          />
          <TextField
            label="退勤時間"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isAbsence}
          />
          {isAbsence && (
            <>
              <TextField
                label="理由"
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
              />
              <FormControl>
                <FormLabel>種別</FormLabel>
                <RadioGroup
                  row
                  value={absenceType}
                  onChange={(e) =>
                    setAbsenceType(e.target.value as 'planned' | 'sudden')
                  }
                >
                  <FormControlLabel value="planned" control={<Radio />} label="計画" />
                  <FormControlLabel value="sudden" control={<Radio />} label="突発" />
                </RadioGroup>
              </FormControl>
            </>
          )}
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
