import React, { useState } from 'react';
import {
  Box,
  Chip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Schedule as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Payment as SettledIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseStatus } from './useExpenseStore';

interface StatusManagerProps {
  expenseId: string;
  currentStatus: ExpenseStatus;
  disabled?: boolean;
}

const statusConfig = {
  pending: {
    label: '申請中',
    color: 'warning',
    icon: PendingIcon,
    bgColor: '#fff3e0',
    textColor: '#f57c00',
  },
  approved: {
    label: '承認済み',
    color: 'success',
    icon: ApprovedIcon,
    bgColor: '#e8f5e8',
    textColor: '#2e7d32',
  },
  rejected: {
    label: '却下',
    color: 'error',
    icon: RejectedIcon,
    bgColor: '#ffebee',
    textColor: '#d32f2f',
  },
  settled: {
    label: '清算済み',
    color: 'info',
    icon: SettledIcon,
    bgColor: '#e3f2fd',
    textColor: '#1976d2',
  },
} as const;

export const StatusManager: React.FC<StatusManagerProps> = ({
  expenseId,
  currentStatus,
  disabled = false,
}) => {
  const theme = useTheme();
  const { updateStatus } = useExpenseStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | null>(null);
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const config = statusConfig[currentStatus];
  const IconComponent = config.icon;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: ExpenseStatus) => {
    handleMenuClose();
    
    if (status === 'approved' || status === 'rejected') {
      setSelectedStatus(status);
      setDialogOpen(true);
    } else {
      updateStatus(expenseId, status);
    }
  };

  const handleDialogConfirm = () => {
    if (!selectedStatus) return;

    const metadata: any = {};
    if (selectedStatus === 'approved' && approvedBy.trim()) {
      metadata.approvedBy = approvedBy.trim();
    }
    if (selectedStatus === 'rejected' && rejectionReason.trim()) {
      metadata.rejectionReason = rejectionReason.trim();
    }

    updateStatus(expenseId, selectedStatus, metadata);
    setDialogOpen(false);
    setSelectedStatus(null);
    setApprovedBy('');
    setRejectionReason('');
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedStatus(null);
    setApprovedBy('');
    setRejectionReason('');
  };

  // 変更可能なステータスを決定
  const getAvailableStatuses = (): ExpenseStatus[] => {
    switch (currentStatus) {
      case 'pending':
        return ['approved', 'rejected'];
      case 'approved':
        return ['settled'];
      case 'rejected':
        return ['pending'];
      case 'settled':
        return [];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: config.bgColor,
            color: config.textColor,
            border: `1px solid ${alpha(config.textColor, 0.3)}`,
          }}
        >
          <IconComponent fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {config.label}
          </Typography>
        </Box>

        {availableStatuses.length > 0 && !disabled && (
          <Button
            size="small"
            variant="outlined"
            endIcon={<ExpandIcon />}
            onClick={handleMenuOpen}
            sx={{ minWidth: 'auto' }}
          >
            変更
          </Button>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {availableStatuses.map((status) => {
          const statusConf = statusConfig[status];
          const StatusIcon = statusConf.icon;
          return (
            <MenuItem key={status} onClick={() => handleStatusChange(status)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatusIcon fontSize="small" sx={{ color: statusConf.textColor }} />
                <Typography>{statusConf.label}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      <Dialog open={dialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          ステータス変更: {selectedStatus && statusConfig[selectedStatus].label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedStatus === 'approved' && (
              <TextField
                label="承認者名"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                fullWidth
                helperText="承認者の名前を入力してください（任意）"
              />
            )}
            {selectedStatus === 'rejected' && (
              <TextField
                label="却下理由"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                fullWidth
                multiline
                rows={3}
                helperText="却下理由を入力してください（任意）"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={handleDialogConfirm} variant="contained">
            変更
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
