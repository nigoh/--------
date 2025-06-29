/**
 * 経費登録・編集モーダルコンポーネント
 * 
 * 新規登録と既存経費の編集の両方に対応
 * フォームバリデーションとアニメーションを含む
 */
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseEntry } from './useExpenseStore';
import { useTemporary } from '../../hooks/useTemporary';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';
import { EXPENSE_CATEGORIES, VALIDATION_MESSAGES, AMOUNT_LIMITS, TEXT_LIMITS } from './constants/expenseConstants';

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
  const { addExpense, updateExpense } = useExpenseStore();
  const { toast, progress } = useTemporary();
  const isEditing = !!expense;

  // フォーム状態
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    note: '',
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * フォームデータを初期化
   */
  useEffect(() => {
    if (open) {
      if (expense) {
        // 編集モードの場合、既存データをセット
        setFormData({
          date: expense.date,
          category: expense.category,
          amount: expense.amount.toString(),
          note: expense.note || '',
        });
      } else {
        // 新規登録の場合、フォームをリセット
        setFormData({
          date: new Date().toISOString().split('T')[0],
          category: '',
          amount: '',
          note: '',
        });
      }
      setErrors({});
    }
  }, [open, expense]);

  /**
   * 入力フィールドの変更ハンドラー
   */
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * バリデーション
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = VALIDATION_MESSAGES.REQUIRED_DATE;
    }

    if (!formData.category) {
      newErrors.category = VALIDATION_MESSAGES.REQUIRED_CATEGORY;
    }

    if (!formData.amount) {
      newErrors.amount = VALIDATION_MESSAGES.REQUIRED_AMOUNT;
    } else {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = VALIDATION_MESSAGES.INVALID_AMOUNT;
      } else if (amount > AMOUNT_LIMITS.MAX) {
        newErrors.amount = VALIDATION_MESSAGES.AMOUNT_TOO_LARGE;
      }
    }

    if (formData.note && formData.note.length > TEXT_LIMITS.NOTE_MAX_LENGTH) {
      newErrors.note = VALIDATION_MESSAGES.NOTE_TOO_LONG;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }

    progress.start(isEditing ? '経費情報を更新中...' : '経費を登録中...', 1);

    try {
      // 擬似的な遅延
      await new Promise(resolve => setTimeout(resolve, 1000));

      const expenseData = {
        date: formData.date,
        category: formData.category,
        amount: Number(formData.amount),
        note: formData.note,
      };

      if (isEditing && expense) {
        // 更新
        updateExpense(expense.id, expenseData);
        toast.success(`経費情報を更新しました`);
      } else {
        // 新規登録
        addExpense(expenseData);
        toast.success(`経費を登録しました`);
      }

      progress.complete();
      onClose();

      // 1秒後に進行状況をクリア
      setTimeout(() => {
        progress.clear();
      }, 1000);

    } catch (err) {
      progress.error();
      toast.error(isEditing ? '更新に失敗しました' : '登録に失敗しました');
      
      setTimeout(() => {
        progress.clear();
      }, 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          ...surfaceStyles.elevated(3)(theme),
          borderRadius: spacingTokens.sm,
          minHeight: '400px',
          maxWidth: '500px',
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
          onClick={onClose}
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: spacingTokens.md }}>
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
              <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                <TextField
                  label="日付"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="カテゴリ"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                >
                  {EXPENSE_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                <TextField
                  label="金額"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  required
                  size="small"
                  sx={{ maxWidth: 200 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
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
              error={!!errors.note}
              helperText={errors.note}
              placeholder="経費の詳細や目的を記入してください"
              size="small"
              sx={{ width: '100%' }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: spacingTokens.md, gap: spacingTokens.sm, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="medium"
          sx={{ minWidth: 100 }}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="medium"
          startIcon={<SaveIcon />}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            minWidth: 120,
          }}
        >
          {isEditing ? '更新' : '登録'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
