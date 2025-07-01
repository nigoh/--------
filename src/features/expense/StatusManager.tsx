import React, { useState } from 'react';
import {
  Box,
  Chip,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Schedule as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Payment as SettledIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';
import { FormDialog, FormDialogContent, FormDialogSection, ConfirmationDialog } from '../../components/ui';
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
    label: '精算済み',
    color: 'info',
    icon: SettledIcon,
    bgColor: '#e3f2fd',
    textColor: '#1976d2',
  },
} as const;

const getNextStatuses = (current: ExpenseStatus): ExpenseStatus[] => {
  switch (current) {
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

export const StatusManager: React.FC<StatusManagerProps> = ({
  expenseId,
  currentStatus,
  disabled = false,
}) => {
  const theme = useTheme();
  const { updateStatus } = useExpenseStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentConfig = statusConfig[currentStatus];
  const IconComponent = currentConfig.icon;
  const nextStatuses = getNextStatuses(currentStatus);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled || nextStatuses.length === 0) return;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status: ExpenseStatus) => {
    setSelectedStatus(status);
    setAnchorEl(null);
    
    if (status === 'rejected') {
      // 却下の場合はコメント入力ダイアログを表示
      setDialogOpen(true);
    } else {
      // その他の場合は確認ダイアログを表示
      setConfirmOpen(true);
    }
  };

  const handleDialogConfirm = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    try {
      await updateStatus(expenseId, selectedStatus, { rejectionReason: comment });
      setDialogOpen(false);
      setComment('');
      setSelectedStatus(null);
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setComment('');
    setSelectedStatus(null);
  };

  const handleConfirmDialog = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    try {
      await updateStatus(expenseId, selectedStatus);
      setConfirmOpen(false);
      setSelectedStatus(null);
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setSelectedStatus(null);
  };

  return (
    <>
      <Button
        onClick={handleMenuClick}
        disabled={disabled || nextStatuses.length === 0}
        endIcon={nextStatuses.length > 0 ? <ExpandIcon /> : undefined}
        sx={{
          minWidth: 'auto',
          p: 0,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Chip
          icon={<IconComponent />}
          label={currentConfig.label}
          sx={{
            backgroundColor: currentConfig.bgColor,
            color: currentConfig.textColor,
            fontWeight: 'medium',
            '& .MuiChip-icon': {
              color: currentConfig.textColor,
            },
          }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 150,
          },
        }}
      >
        {nextStatuses.map((status) => {
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          return (
            <MenuItem
              key={status}
              onClick={() => handleStatusSelect(status)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
              }}
            >
              <StatusIcon sx={{ fontSize: 16, color: config.textColor }} />
              <Typography variant="body2">{config.label}</Typography>
            </MenuItem>
          );
        })}
      </Menu>

      {/* 却下時のコメント入力ダイアログ */}
      <FormDialog
        open={dialogOpen}
        onClose={handleDialogCancel}
        onSubmit={handleDialogConfirm}
        title="経費申請の却下"
        size="sm"
        loading={isSubmitting}
        isValid={comment.trim() !== ''}
        submitText="却下"
      >
        <FormDialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            この経費申請を却下します。却下理由を入力してください。
          </Alert>
          
          <FormDialogSection title="却下理由">
            <TextField
              label="却下理由"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              required
              fullWidth
              placeholder="却下理由を詳細に記入してください"
            />
          </FormDialogSection>
        </FormDialogContent>
      </FormDialog>

      {/* その他のステータス変更確認ダイアログ */}
      <ConfirmationDialog
        open={confirmOpen}
        onClose={handleConfirmCancel}
        onConfirm={handleConfirmDialog}
        title="ステータス変更の確認"
        message={`この経費申請のステータスを「${selectedStatus ? statusConfig[selectedStatus].label : ''}」に変更してもよろしいですか？`}
        type="question"
        loading={isSubmitting}
        confirmText="変更"
      />
    </>
  );
};
