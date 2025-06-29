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
import { useExpenseStore, ExpenseEntry, ExpenseReceipt } from './useExpenseStore';
import { ReceiptUpload } from './ReceiptUpload';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense?: ExpenseEntry | null;
}

const expenseCategories = [
  '交通費',
  '宿泊費',
  '会議費',
  '接待費',
  '通信費',
  '消耗品費',
  'その他',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  open,
  onClose,
  expense,
}) => {
  const { addExpense, updateExpense, addReceipt } = useExpenseStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: '',
    amount: '',
    note: '',
  });
  const [tempReceipts, setTempReceipts] = useState<ExpenseReceipt[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(expense);

  // フォームデータの初期化
  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        note: expense.note || '',
      });
      setTempReceipts([]);
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        category: '',
        amount: '',
        note: '',
      });
      setTempReceipts([]);
    }
    setError(null);
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.category || !formData.amount) {
      setError('カテゴリと金額は必須です');
      return;
    }

    const expenseData = {
      date: formData.date,
      category: formData.category,
      amount: Number(formData.amount),
      note: formData.note,
    };

    try {
      if (isEditing && expense) {
        updateExpense(expense.id, expenseData);
      } else {
        const newExpenseId = addExpense(expenseData);
        
        // 一時的な領収書があれば追加
        if (tempReceipts.length > 0 && newExpenseId) {
          tempReceipts.forEach(receipt => {
            addReceipt(newExpenseId, receipt);
          });
        }
      }
      
      handleClose();
    } catch (err) {
      setError('保存に失敗しました');
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      category: '',
      amount: '',
      note: '',
    });
    setTempReceipts([]);
    setError(null);
    onClose();
  };

  const handleReceiptAdd = (receipts: ExpenseReceipt[]) => {
    setTempReceipts(prev => [...prev, ...receipts]);
  };

  const handleReceiptRemove = (receiptId: string) => {
    setTempReceipts(prev => prev.filter(receipt => receipt.id !== receiptId));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
            {isEditing ? '経費編集' : '経費登録'}
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
              label="日付"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="カテゴリ"
              select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
              required
            >
              {expenseCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="金額"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
              }}
              fullWidth
              required
            />

            <TextField
              label="備考"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="経費の詳細説明を入力してください"
            />

            {/* 新規登録時のみ領収書アップロード */}
            {!isEditing && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  領収書添付（任意）
                </Typography>
                <ReceiptUpload
                  expenseId="temp-modal-upload"
                  receipts={tempReceipts}
                  disabled={false}
                  onReceiptsAdd={handleReceiptAdd}
                  onReceiptRemove={handleReceiptRemove}
                />
              </Box>
            )}
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
            {!isEditing && tempReceipts.length > 0 && ` (領収書 ${tempReceipts.length}件)`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
