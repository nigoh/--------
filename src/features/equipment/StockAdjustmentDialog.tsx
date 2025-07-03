import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Box,
  Stack,
  Alert,
  Chip,
  ButtonGroup,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { FormDialog, FormDialogContent, FormDialogSection } from '../../components/ui';
import { EquipmentItem } from './useEquipmentStore';

interface StockAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  item: EquipmentItem | null;
  onAdjust: (itemId: string, delta: number, reason: string) => void;
}

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  open,
  onClose,
  item,
  onAdjust,
}) => {
  const [adjustment, setAdjustment] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAdjustment('');
      setAdjustmentType('add');
      setReason('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    setError(null);

    if (!item) {
      setError('備品が選択されていません');
      return;
    }

    const adjustmentNum = parseInt(adjustment);
    if (isNaN(adjustmentNum) || adjustmentNum <= 0) {
      setError('正しい数量を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      let delta = 0;
      
      switch (adjustmentType) {
        case 'add':
          delta = adjustmentNum;
          break;
        case 'remove':
          if (adjustmentNum > item.quantity) {
            setError(`減らす数量が在庫数(${item.quantity})を超えています`);
            setIsSubmitting(false);
            return;
          }
          delta = -adjustmentNum;
          break;
        case 'set':
          delta = adjustmentNum - item.quantity;
          break;
      }

      onAdjust(item.id, delta, reason || getDefaultReason(adjustmentType));
      onClose();
    } catch (err) {
      setError('在庫調整に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = adjustment !== '' && parseInt(adjustment) > 0;

  const getNewQuantity = () => {
    if (!item || !adjustment) return item?.quantity || 0;
    
    const adjustmentNum = parseInt(adjustment);
    if (isNaN(adjustmentNum)) return item.quantity;

    switch (adjustmentType) {
      case 'add':
        return item.quantity + adjustmentNum;
      case 'remove':
        return Math.max(0, item.quantity - adjustmentNum);
      case 'set':
        return adjustmentNum;
      default:
        return item.quantity;
    }
  };

  if (!item) return null;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="在庫調整"
      size="sm"
      loading={isSubmitting}
      isValid={isValid}
      submitText="調整実行"
    >
      <FormDialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormDialogSection title="備品情報">
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon color="primary" />
                {item.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={item.category} size="small" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  現在の在庫: {item.quantity}個
                </Typography>
              </Box>
            </Stack>
          </Box>
        </FormDialogSection>

        <FormDialogSection title="調整設定">
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" gutterBottom>
                調整タイプ
              </Typography>
              <ButtonGroup fullWidth size="small">
                <Button
                  variant={adjustmentType === 'add' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('add')}
                  startIcon={<AddIcon />}
                >
                  追加
                </Button>
                <Button
                  variant={adjustmentType === 'remove' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('remove')}
                  startIcon={<RemoveIcon />}
                >
                  減少
                </Button>
                <Button
                  variant={adjustmentType === 'set' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('set')}
                >
                  設定
                </Button>
              </ButtonGroup>
            </Box>

            <TextField
              label={adjustmentType === 'set' ? '設定する数量' : '調整数量'}
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              required
              fullWidth
              size="small"
              inputProps={{ min: 1 }}
            />

            <TextField
              label="調整理由（任意）"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="調整の理由を入力してください..."
            />

            {adjustment && (
              <Box sx={{ p: 2, backgroundColor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="body2" color="primary">
                  調整後の在庫: {getNewQuantity()}個
                </Typography>
              </Box>
            )}
          </Stack>
        </FormDialogSection>
      </FormDialogContent>
    </FormDialog>
  );
};

/**
 * デフォルト理由を生成
 */
function getDefaultReason(adjustmentType: 'add' | 'remove' | 'set'): string {
  switch (adjustmentType) {
    case 'add': return '在庫追加';
    case 'remove': return '在庫減少';
    case 'set': return '在庫調整';
    default: return '在庫調整';
  }
}
