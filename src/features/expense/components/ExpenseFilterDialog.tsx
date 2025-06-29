import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { spacingTokens } from '../../../theme/designSystem';
import { EXPENSE_CATEGORIES } from '../constants/expenseConstants';

interface ExpenseFilterDialogProps {
  open: boolean;
  onClose: () => void;
  categoryFilter: string;
  statusFilter: string;
  minAmount: string;
  maxAmount: string;
  dateFrom: string;
  dateTo: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ExpenseFilterDialog: React.FC<ExpenseFilterDialogProps> = ({
  open,
  onClose,
  categoryFilter,
  statusFilter,
  minAmount,
  maxAmount,
  dateFrom,
  dateTo,
  onCategoryChange,
  onStatusChange,
  onMinAmountChange,
  onMaxAmountChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
  };

  const hasActiveFilters = categoryFilter || statusFilter || minAmount || maxAmount || dateFrom || dateTo;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '80vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        pb: spacingTokens.md 
      }}>
        <FilterIcon />
        詳細フィルター
      </DialogTitle>
      
      <DialogContent sx={{ pt: spacingTokens.md }}>
        <Stack spacing={spacingTokens.lg}>
          <FormControl fullWidth>
            <InputLabel>カテゴリ</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              label="カテゴリ"
            >
              <MenuItem value="">すべて</MenuItem>
              {EXPENSE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              label="ステータス"
            >
              <MenuItem value="">すべて</MenuItem>
              <MenuItem value="pending">承認待ち</MenuItem>
              <MenuItem value="approved">承認済み</MenuItem>
              <MenuItem value="rejected">却下</MenuItem>
              <MenuItem value="settled">精算済み</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={spacingTokens.md}>
            <TextField
              label="最小金額"
              type="number"
              value={minAmount}
              onChange={(e) => onMinAmountChange(e.target.value)}
              InputProps={{
                startAdornment: <span style={{ marginRight: 4 }}>¥</span>,
              }}
              fullWidth
            />
            <TextField
              label="最大金額"
              type="number"
              value={maxAmount}
              onChange={(e) => onMaxAmountChange(e.target.value)}
              InputProps={{
                startAdornment: <span style={{ marginRight: 4 }}>¥</span>,
              }}
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={spacingTokens.md}>
            <TextField
              label="開始日"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="終了日"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          {hasActiveFilters && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              color="warning"
              sx={{ alignSelf: 'flex-start' }}
            >
              フィルタークリア
            </Button>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ 
        p: spacingTokens.lg,
        gap: spacingTokens.sm 
      }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained"
          startIcon={<CheckIcon />}
        >
          適用
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFilterDialog;
