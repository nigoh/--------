import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { useExpenseStore } from './useExpenseStore';

export const ExpenseForm: React.FC = () => {
  const { addExpense } = useExpenseStore();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ date, category, amount, note });
    setCategory('');
    setAmount(0);
    setNote('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        経費登録
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          label="日付"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="金額"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
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
    </Paper>
  );
};
