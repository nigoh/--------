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
  IconButton,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { spacingTokens } from '../../../theme/designSystem';
import { Department } from '../constants/employeeFormConstants';

interface EmployeeFilterDialogProps {
  open: boolean;
  onClose: () => void;
  departments: readonly Department[];
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

  const handleClearAllFilters = () => {
    onClearFilters();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          }
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
          onClick={onClose}
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
          onClick={onClose}
          variant="contained"
        >
          適用
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFilterDialog;
