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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { spacingTokens } from '../../../theme/designSystem';

interface EmployeeFilterDialogProps {
  open: boolean;
  onClose: () => void;
  departments: string[];
  departmentFilter: string;
  statusFilter: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const EmployeeFilterDialog: React.FC<EmployeeFilterDialogProps> = ({
  open,
  onClose,
  departments,
  departmentFilter,
  statusFilter,
  onDepartmentChange,
  onStatusChange,
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

  const hasActiveFilters = departmentFilter || statusFilter;

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

          <FormControl fullWidth>
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

export default EmployeeFilterDialog;
