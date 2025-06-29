/**
 * 経費一覧のフィルターコンポーネント
 * 
 * 検索、カテゴリフィルター、ステータスフィルターを含む
 * EmployeeFiltersの構造を移植
 */
import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';
import { EXPENSE_CATEGORIES, STATUS_CONFIG } from '../constants/expenseConstants';

interface ExpenseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  statusFilter: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  statusFilter,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  
  // フィルターが適用されているかチェック
  const hasActiveFilters = categoryFilter || statusFilter;
  const activeFilterCount = [categoryFilter, statusFilter].filter(Boolean).length;

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, flexWrap: 'wrap' }}>
          {/* 検索フィールド */}
          <TextField
            fullWidth
            placeholder="カテゴリ、金額、備考で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onSearchChange('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
              }
            }}
            size="small"
            sx={{ 
              flex: 1,
              minWidth: 300,
              maxWidth: 500,
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
                '&::placeholder': {
                  color: theme.palette.text.secondary,
                  opacity: 0.7,
                },
                '&:-webkit-autofill': {
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
                },
                '&:-webkit-autofill:hover': {
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
                },
                '&:-webkit-autofill:focus': {
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
                },
              },
            }}
          />
          
          {/* 詳細フィルターボタン */}
          <Badge badgeContent={activeFilterCount} color="primary" sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterDialog}
              size="small"
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: 120,
              }}
            >
              詳細フィルター
            </Button>
          </Badge>

          {/* フィルタークリアボタン */}
          {hasActiveFilters && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              size="small"
              color="warning"
              sx={{ flexShrink: 0 }}
            >
              クリア
            </Button>
          )}
        </Box>
      </Box>

      {/* フィルターダイアログ */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={handleCloseFilterDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              borderRadius: isMobile ? 0 : 2,
              maxHeight: isMobile ? '100vh' : '80vh',
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pb: spacingTokens.md 
        }}>
          <FilterListIcon />
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

            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
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
          <Button onClick={handleCloseFilterDialog} color="inherit">
            キャンセル
          </Button>
          <Button 
            onClick={handleCloseFilterDialog} 
            variant="contained"
            startIcon={<FilterListIcon />}
          >
            適用
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseFilters;
