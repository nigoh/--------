import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Stack,
  Button,
  Typography,
  MenuItem,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { useExpenseStore, ExpenseReceipt } from './useExpenseStore';
import { ReceiptUpload } from './ReceiptUpload';
import { ExpenseModal } from './ExpenseModal';

const expenseCategories = [
  '交通費',
  '宿泊費',
  '会議費',
  '接待費',
  '通信費',
  '消耗品費',
  'その他',
];

export const ExpenseForm: React.FC = () => {
  const { addExpense, addReceipt, expenses } = useExpenseStore();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  // モーダル状態管理
  const [modalOpen, setModalOpen] = useState(false);
  
  // フォーム用の一時的な領収書状態
  const [tempReceipts, setTempReceipts] = useState<ExpenseReceipt[]>([]);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション（必要最小限）
    if (!category || !amount) {
      return;
    }

    // モーダルを開く
    setModalOpen(true);
  };

  // モーダルが閉じられたときの処理
  const handleModalClose = () => {
    setModalOpen(false);
    
    // フォームをリセット
    setCategory('');
    setAmount('');
    setNote('');
    setTempReceipts([]);
    setSuccessAlert(true);
    
    // 成功メッセージを3秒後に非表示
    setTimeout(() => setSuccessAlert(false), 3000);
  };

  // 一時的な領収書の追加
  const handleReceiptAdd = (receipts: ExpenseReceipt[]) => {
    setTempReceipts(prev => [...prev, ...receipts]);
  };

  // 一時的な領収書の削除
  const handleReceiptRemove = (receiptId: string) => {
    setTempReceipts(prev => prev.filter(receipt => receipt.id !== receiptId));
  };

  // 最新の経費を取得（登録直後の経費）
  const latestExpense = expenses.length > 0 ? expenses[expenses.length - 1] : null;

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          経費登録
        </Typography>
        
        {successAlert && (
          <Alert severity="success" sx={{ mb: 2 }}>
            経費が正常に登録されました！
          </Alert>
        )}

        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <TextField
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <TextField
            label="カテゴリ"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            select
            required
          >
            {expenseCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
              }
            }}
            required
          />
          
          <TextField
            label="備考"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={2}
            placeholder="経費の詳細説明を入力してください"
          />

          {/* 領収書アップロード */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              領収書添付（任意）
            </Typography>
            <ReceiptUpload
              expenseId="temp-form-upload"
              receipts={tempReceipts}
              disabled={false}
              onReceiptsAdd={handleReceiptAdd}
              onReceiptRemove={handleReceiptRemove}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" sx={{ flex: 1 }}>
              経費を登録{tempReceipts.length > 0 && ` (領収書 ${tempReceipts.length}件)`}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* ExpenseModal */}
      <ExpenseModal
        open={modalOpen}
        onClose={handleModalClose}
        expense={null}
      />
    </>
  );
};
