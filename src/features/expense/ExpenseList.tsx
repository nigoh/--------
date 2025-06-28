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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useExpenseStore } from './useExpenseStore';

interface EditForm {
  date: string;
  category: string;
  amount: number;
  note?: string;
}

export const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, updateExpense } = useExpenseStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    date: '',
    category: '',
    amount: 0,
    note: '',
  });

  const openEdit = (id: string) => {
    const entry = expenses.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      date: entry.date,
      category: entry.category,
      amount: entry.amount,
      note: entry.note ?? '',
    });
    setEditingId(id);
  };

  const closeEdit = () => setEditingId(null);

  const handleSave = () => {
    if (!editingId) return;
    updateExpense(editingId, form);
    closeEdit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        経費一覧
      </Typography>
      {expenses.length === 0 ? (
        <Typography color="text.secondary">まだ登録がありません</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell>日付</TableCell>
                <TableCell>カテゴリ</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>備考</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.note}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => openEdit(entry.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteExpense(entry.id)}>
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>経費編集</DialogTitle>
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
              label="カテゴリ"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <TextField
              label="金額"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
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
