import React, { useState } from 'react';
import { Paper, Stack, TextField, Button } from '@mui/material';
import { useEquipmentStore } from './useEquipmentStore';
import { SubsectionTitle } from '../../components/ui/Typography';

export const EquipmentForm: React.FC = () => {
  const { addItem } = useEquipmentStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addItem({ name, category, quantity, note });
    setName('');
    setCategory('');
    setQuantity(1);
    setNote('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
      <SubsectionTitle sx={{ fontWeight: 'bold', mb: 2 }}>
        備品登録
      </SubsectionTitle>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField label="名称" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="カテゴリ" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField
          label="在庫数"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          inputProps={{ min: 0 }}
        />
        <TextField label="備考" value={note} onChange={(e) => setNote(e.target.value)} multiline rows={2} />
        <Button type="submit" variant="contained">
          追加
        </Button>
      </Stack>
    </Paper>
  );
};
