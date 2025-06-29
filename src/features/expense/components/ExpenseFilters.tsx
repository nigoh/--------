/**
 * 経費一覧のフィルターコンポーネント
 * 
 * 検索、カテゴリフィルター、ステータスフィルターを含む
 */
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';
import { STATUS_CONFIG } from '../constants/expenseConstants';

interface ExpenseFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  searchQuery,
  categoryFilter,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        ...surfaceStyles.surface(theme),
        mb: spacingTokens.md,
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: spacingTokens.md }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            placeholder="備考・カテゴリで検索"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>カテゴリ</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              label="カテゴリ"
            >
              <MenuItem value="">すべて</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              label="ステータス"
            >
              <MenuItem value="">すべて</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <MenuItem key={status} value={status}>
                  {config.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
    </Paper>
  );
};
