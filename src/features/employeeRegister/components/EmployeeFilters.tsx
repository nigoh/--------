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

interface EmployeeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departments: string[];
  departmentFilter: string;
  statusFilter: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  departments,
  departmentFilter,
  statusFilter,
  onDepartmentChange,
  onStatusChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  
  // フィルターが適用されているかチェック
  const hasActiveFilters = departmentFilter || statusFilter;
  const activeFilterCount = [departmentFilter, statusFilter].filter(Boolean).length;

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleClearAllFilters = () => {
    onClearFilters();
    setFilterDialogOpen(false);
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, flexWrap: 'wrap' }}>
          {/* 検索フィールド */}
          <TextField
            fullWidth
            placeholder="社員名、部署、役職、メール、スキルで検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
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
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          詳細フィルター
          <IconButton
            onClick={handleCloseFilterDialog}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={spacingTokens.lg}>
            <FormControl fullWidth size="small">
              <InputLabel>部署</InputLabel>
              <Select
                value={departmentFilter}
                onChange={(e) => onDepartmentChange(e.target.value)}
                label="部署"
              >
                <MenuItem value="">すべて</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth size="small">
              <InputLabel>ステータス</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                label="ステータス"
              >
                <MenuItem value="">すべて</MenuItem>
                <MenuItem value="active">在籍中</MenuItem>
                <MenuItem value="inactive">退職済み</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClearAllFilters}
            color="warning"
            startIcon={<ClearIcon />}
          >
            すべてクリア
          </Button>
          <Button
            onClick={handleCloseFilterDialog}
            variant="contained"
          >
            適用
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeFilters;
