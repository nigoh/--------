import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Box, Chip } from '@mui/material';
import { ExpenseEntry, ExpenseReceipt } from '../useExpenseStore';

interface Props {
  selected: ExpenseEntry | null;
  onCloseDetail: () => void;
  deleteOpen: boolean;
  deleting: ExpenseEntry | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  formatDate: (d: string) => string;
  formatCurrency: (amount: number) => string;
}

const ExpenseDialogs: React.FC<Props> = ({ 
  selected, 
  onCloseDetail, 
  deleteOpen, 
  deleting, 
  onCancelDelete, 
  onConfirmDelete, 
  formatDate,
  formatCurrency 
}) => (
  <>
    <Dialog 
      open={!!selected} 
      onClose={onCloseDetail} 
      maxWidth="md" 
      fullWidth 
      slotProps={{ 
        paper: {
          sx: { 
            borderRadius: 2, 
            background: 'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)' 
          } 
        }
      }}
    >
      {selected && (
        <>
          <DialogTitle 
            sx={{ 
              background: 'linear-gradient(45deg,#667eea 30%,#764ba2 90%)', 
              color: 'white', 
              fontWeight: 'bold' 
            }}
          >
            💰 経費詳細情報
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>基本情報</Typography>
                <Stack spacing={1}>
                  <Typography><strong>日付:</strong> {formatDate(selected.date)}</Typography>
                  <Typography><strong>カテゴリ:</strong> {selected.category}</Typography>
                  <Typography><strong>金額:</strong> {formatCurrency(selected.amount)}</Typography>
                  <Typography><strong>ステータス:</strong> 
                    <Chip 
                      label={selected.status === 'approved' ? '承認済み' : selected.status === 'pending' ? '承認待ち' : '却下'} 
                      color={selected.status === 'approved' ? 'success' : selected.status === 'pending' ? 'warning' : 'error'} 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  </Typography>
                </Stack>
              </Box>
              {selected.note && (
                <Box>
                  <Typography variant="h6" gutterBottom>備考</Typography>
                  <Typography 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(255,255,255,0.8)', 
                      borderRadius: 1, 
                      whiteSpace: 'pre-wrap' 
                    }}
                  >
                    {selected.note}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="h6" gutterBottom>領収書</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selected.receipts && selected.receipts.length > 0 ? (
                    selected.receipts.map((receipt: ExpenseReceipt, index: number) => (
                      <Chip 
                        key={receipt.id || index} 
                        label={receipt.filename} 
                        variant="outlined"
                        onClick={() => window.open(receipt.fileUrl, '_blank')}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">領収書なし</Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>その他情報</Typography>
                <Stack spacing={1}>
                  {selected.submittedDate && <Typography><strong>申請日:</strong> {formatDate(selected.submittedDate)}</Typography>}
                  {selected.approvedDate && <Typography><strong>承認日:</strong> {formatDate(selected.approvedDate)}</Typography>}
                  {selected.settledDate && <Typography><strong>精算日:</strong> {formatDate(selected.settledDate)}</Typography>}
                  {selected.approvedBy && <Typography><strong>承認者:</strong> {selected.approvedBy}</Typography>}
                  {selected.id && <Typography><strong>経費ID:</strong> {selected.id}</Typography>}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onCloseDetail} variant="outlined">閉じる</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    
    <Dialog 
      open={deleteOpen} 
      onClose={onCancelDelete} 
      slotProps={{ 
        paper: {
          sx: { 
            borderRadius: 2, 
            background: 'linear-gradient(135deg,#ffebee 0%,#ffcdd2 100%)' 
          } 
        }
      }}
    >
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
        経費削除の確認
      </DialogTitle>
      <DialogContent>
        <Typography>
          本当に「{deleting?.category} - {deleting && formatCurrency(deleting.amount)}」を削除しますか？
        </Typography>
        <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
          この操作は取り消せません。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelDelete} variant="outlined">キャンセル</Button>
        <Button onClick={onConfirmDelete} variant="contained" color="error">削除</Button>
      </DialogActions>
    </Dialog>
  </>
);

export default ExpenseDialogs;
