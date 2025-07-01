import React from 'react';
import { StandardDialog } from '../../../components/ui';
import { Typography, Stack, Box, Chip } from '@mui/material';
import { ExpenseEntry } from '../useExpenseStore';

interface Props {
  selected: ExpenseEntry | null;
  onCloseDetail: () => void;
  formatDate: (d: string) => string;
  formatCurrency: (amount: number) => string;
}

const ExpenseDialogs: React.FC<Props> = ({ 
  selected, 
  onCloseDetail, 
  formatDate,
  formatCurrency 
}) => (
  <StandardDialog
    open={!!selected}
    onClose={onCloseDetail}
    title="経費詳細"
    variant="standard"
    size="md"
    actions={
      <button onClick={onCloseDetail}>
        閉じる
      </button>
    }
  >
    {selected && (
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            基本情報
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>日付:</strong> {formatDate(selected.date)}</Typography>
            <Typography><strong>カテゴリ:</strong> {selected.category}</Typography>
            <Typography><strong>金額:</strong> {formatCurrency(selected.amount)}</Typography>
            <Typography><strong>備考:</strong> {selected.note || '-'}</Typography>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            ステータス
          </Typography>
          <Chip 
            label={selected.status === 'pending' ? '申請中' : 
                   selected.status === 'approved' ? '承認済み' : 
                   selected.status === 'rejected' ? '却下' : '精算済み'}
            color={selected.status === 'pending' ? 'warning' : 
                   selected.status === 'approved' ? 'success' : 
                   selected.status === 'rejected' ? 'error' : 'info'}
          />
        </Box>

        {selected.receipts && selected.receipts.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              領収書 ({selected.receipts.length}件)
            </Typography>
            <Stack spacing={1}>
              {selected.receipts.map((receipt) => (
                <Typography key={receipt.id}>
                  📄 {receipt.filename}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    )}
  </StandardDialog>
);

export default ExpenseDialogs;
