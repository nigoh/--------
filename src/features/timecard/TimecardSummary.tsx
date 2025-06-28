import React, { useMemo } from 'react';
import { Paper, Stack, Typography, Box, useTheme } from '@mui/material';
import { useTimecardStore, TimecardEntry } from './useTimecardStore';
import { calculateDuration } from './utils';

interface TimecardSummaryProps {
  month: string; // YYYY-MM
}

export const TimecardSummary: React.FC<TimecardSummaryProps> = ({ month }) => {
  const theme = useTheme();
  const entries = useTimecardStore((s) => s.entries);

  const summary = useMemo(() => {
    let totalHours = 0;
    let vacation = 0;
    let planned = 0;
    let sudden = 0;

    entries.forEach((e: TimecardEntry) => {
      if (!e.date.startsWith(month)) return;
      if (e.isAbsence) {
        vacation += 1;
        if (e.absenceType === 'planned') planned += 1;
        if (e.absenceType === 'sudden') sudden += 1;
      } else if (e.startTime && e.endTime) {
        totalHours += calculateDuration(e.startTime, e.endTime);
      }
    });

    return { totalHours, vacation, planned, sudden };
  }, [entries, month]);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        月次サマリー
      </Typography>
      <Stack direction="row" spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            合計時間
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {summary.totalHours.toFixed(1)}h
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            休暇日数
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {summary.vacation}日（計画 {summary.planned}・突発 {summary.sudden}）
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TimecardSummary;
