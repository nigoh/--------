/**
 * 経費登録・編集モーダルコンポーネント
 * 
 * Zustandフォームストアを活用
 * 新規登録と既存経費の編集の両方に対応
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  MenuItem,
  useTheme,
  Divider,
  Alert,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseEntry, ExpenseReceipt } from './useExpenseStore';
import { useExpenseForm } from './hooks/useExpenseForm';
import { ReceiptUpload } from './ReceiptUpload';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';
import { EXPENSE_CATEGORIES } from './constants/expenseConstants';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense?: ExpenseEntry | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  open,
  onClose,
  expense,
}) => {
  const theme = useTheme();
  const { addReceipt } = useExpenseStore();
  
  // メッセージ状態
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Zustandフォームフック
  const {
    formData,
    errors,
    isSubmitting,
    isEditing,
    handleFieldChange,
    handleSubmit,
    startEdit,
    resetForm,
    getFieldError,
  } = useExpenseForm((text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  });

  // 領収書状態（一時的）
  const [tempReceipts, setTempReceipts] = useState<ExpenseReceipt[]>([]);

  /**
   * モーダルが開いた時の初期化
   */
  useEffect(() => {
    if (open) {
      if (expense) {
        // 編集モード
        startEdit(expense);
        setTempReceipts(expense.receipts || []);
      } else {
        // 新規登録モード
        resetForm();
        setTempReceipts([]);
      }
      setMessage(null);
    }
  }, [open, expense, startEdit, resetForm]);

  /**
   * フィールド変更ハンドラー
   */
  const handleInputChange = useCallback((field: string, value: string) => {
    handleFieldChange(field, value);
  }, [handleFieldChange]);

  /**
   * 領収書の追加ハンドラー
   */
  const handleReceiptAdd = useCallback((receipts: ExpenseReceipt[]) => {
    setTempReceipts(prev => [...prev, ...receipts]);
  }, []);

  /**
   * 領収書の削除ハンドラー
   */
  const handleReceiptRemove = useCallback((receiptId: string) => {
    setTempReceipts(prev => prev.filter(receipt => receipt.id !== receiptId));
  }, []);

  /**
   * 保存処理
   */
  const handleSave = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      // 新規登録時に領収書がある場合の処理は
      // 実際のAPIと連携する際に実装
      onClose();
    }
  }, [handleSubmit, onClose]);

  /**
   * キャンセル処理
   */
  const handleCancel = useCallback(() => {
    resetForm();
    setTempReceipts([]);
    setMessage(null);
    onClose();
  }, [resetForm, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            ...surfaceStyles.elevated(3)(theme),
            borderRadius: spacingTokens.sm,
            minHeight: '400px',
            maxWidth: '500px',
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacingTokens.md,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
          {isEditing ? <EditIcon /> : <ReceiptIcon />}
          <Typography variant="h6" component="div">
            {isEditing ? '経費情報編集' : '新規経費登録'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCancel}
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: spacingTokens.md }}>
        {/* メッセージ表示 */}
        {message && (
          <Fade in={!!message}>
            <Alert 
              severity={message.type} 
              sx={{ mb: spacingTokens.md }}
            >
              {message.text}
            </Alert>
          </Fade>
        )}

        <Stack spacing={spacingTokens.md}>
          {/* 基本情報 */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              基本情報
            </Typography>
            <Stack spacing={spacingTokens.sm}>
              <Box sx={{ 
                display: 'flex', 
                gap: spacingTokens.md, 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: 'flex-start' 
              }}>
                <TextField
                  label="日付"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  error={!!getFieldError('date')}
                  helperText={getFieldError('date')}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                  InputLabelProps={{ shrink: true }}
                  disabled={isSubmitting}
                />
                <TextField
                  select
                  label="カテゴリ"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  error={!!getFieldError('category')}
                  helperText={getFieldError('category')}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                  disabled={isSubmitting}
                >
                  {EXPENSE_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: spacingTokens.md, 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: 'flex-start' 
              }}>
                <TextField
                  label="金額"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  error={!!getFieldError('amount')}
                  helperText={getFieldError('amount')}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* 詳細情報 */}
          <Box>
            <Divider sx={{ my: spacingTokens.sm }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              詳細情報
            </Typography>
            <TextField
              label="備考"
              multiline
              rows={3}
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              error={!!getFieldError('note')}
              helperText={getFieldError('note')}
              placeholder="経費の詳細や目的を記入してください"
              size="small"
              sx={{ width: '100%', mb: spacingTokens.md }}
              disabled={isSubmitting}
            />
          </Box>

          {/* 領収書アップロード */}
          <Box>
            <Divider sx={{ my: spacingTokens.sm }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ReceiptIcon fontSize="small" />
              領収書添付（任意）
            </Typography>
            <ReceiptUpload
              expenseId={expense?.id || "temp-modal-upload"}
              receipts={tempReceipts}
              disabled={isSubmitting}
              onReceiptsAdd={handleReceiptAdd}
              onReceiptRemove={handleReceiptRemove}
            />
          </Box>
          
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: spacingTokens.md, gap: spacingTokens.sm, justifyContent: 'center' }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          size="medium"
          sx={{ minWidth: 100 }}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="medium"
          startIcon={<SaveIcon />}
          disabled={isSubmitting}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            minWidth: 120,
          }}
        >
          {isSubmitting ? '処理中...' : (isEditing ? '更新' : '登録')}
          {tempReceipts.length > 0 && ` (領収書 ${tempReceipts.length}件)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
