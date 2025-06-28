import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTimecardStore } from './useTimecardStore';

interface EditForm {
  date: string;
  startTime: string;
  endTime?: string;
  note?: string;
}

export const TimecardList: React.FC = () => {
  const { entries, deleteEntry, updateEntry } = useTimecardStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    date: '',
    startTime: '',
    endTime: '',
    note: '',
  });

  const openEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      note: entry.note,
    });
    setEditingId(id);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateEntry(editingId, form);
    closeEdit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        勤怠履歴
      </Typography>
      {entries.length === 0 ? (
        <Typography color="text.secondary">まだ登録がありません</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell>日付</TableCell>
                <TableCell>出勤</TableCell>
                <TableCell>退勤</TableCell>
                <TableCell>備考</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.startTime}</TableCell>
                  <TableCell>{entry.endTime}</TableCell>
                  <TableCell>{entry.note}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openEdit(entry.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={!!editingId} onClose={closeEdit}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>勤怠編集</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="日付"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="出勤時間"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="退勤時間"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="備考"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
