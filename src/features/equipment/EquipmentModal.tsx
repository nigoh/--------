import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
  Box,
  Fade,
  Alert,
} from '@mui/material';
import { useEquipmentStore, EquipmentItem } from './useEquipmentStore';

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  item?: EquipmentItem | null;
}

const equipmentCategories = [
  'PC・周辺機器',
  'オフィス用品',
  '文房具',
  '清掃用品',
  '家具',
  '電子機器',
  '工具',
  'その他',
];

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  open,
  onClose,
  item,
}) => {
  const { addItem, updateItem } = useEquipmentStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(item);

  // フォームデータの初期化
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        note: item.note || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        note: '',
      });
    }
    setError(null);
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.category || !formData.quantity) {
      setError('名前、カテゴリ、数量は必須です');
      return;
    }

    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      setError('数量は0以上の数値を入力してください');
      return;
    }

    const itemData = {
      name: formData.name,
      category: formData.category,
      quantity,
      note: formData.note || undefined,
    };

    try {
      if (isEditing && item) {
        updateItem(item.id, itemData);
      } else {
        addItem(itemData);
      }
      
      handleClose();
    } catch (err) {
      setError('保存に失敗しました');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      note: '',
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEditing ? '備品編集' : '備品登録'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="備品名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              placeholder="例: ノートパソコン、プリンター用紙"
            />

            <TextField
              label="カテゴリ"
              select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
              required
            >
              {equipmentCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="数量"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0 }}
              helperText="0以上の数値を入力してください"
            />

            <TextField
              label="備考"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="仕様、保管場所、メモなど"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ fontWeight: 600 }}
          >
            {isEditing ? '更新' : '登録'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
