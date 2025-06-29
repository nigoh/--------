import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Fade,
  Alert,
  Chip,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { EquipmentItem } from './useEquipmentStore';

interface StockAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  item: EquipmentItem | null;
  onAdjust: (itemId: string, delta: number) => void;
}

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  open,
  onClose,
  item,
  onAdjust,
}) => {
  const [adjustment, setAdjustment] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAdjustment('');
      setAdjustmentType('add');
      setError(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!item) return;

    const value = Number(adjustment);
    if (isNaN(value) || value <= 0) {
      setError('正の数値を入力してください');
      return;
    }

    let delta = 0;
    
    switch (adjustmentType) {
      case 'add':
        delta = value;
        break;
      case 'remove':
        if (value > item.quantity) {
          setError(`在庫数量(${item.quantity})を超えて減らすことはできません`);
          return;
        }
        delta = -value;
        break;
      case 'set':
        delta = value - item.quantity;
        break;
    }

    onAdjust(item.id, delta);
    handleClose();
  };

  const handleClose = () => {
    setAdjustment('');
    setAdjustmentType('add');
    setError(null);
    onClose();
  };

  const getNewQuantity = () => {
    if (!item || !adjustment) return item?.quantity || 0;
    
    const value = Number(adjustment);
    if (isNaN(value)) return item.quantity;

    switch (adjustmentType) {
      case 'add':
        return item.quantity + value;
      case 'remove':
        return Math.max(0, item.quantity - value);
      case 'set':
        return Math.max(0, value);
      default:
        return item.quantity;
    }
  };

  const newQuantity = getNewQuantity();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <InventoryIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              在庫調整
            </Typography>
          </Stack>
          {item && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {item.name} ({item.category})
            </Typography>
          )}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* 現在の在庫数 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                現在の在庫数
              </Typography>
              <Chip
                label={`${item?.quantity || 0} 個`}
                color="primary"
                variant="outlined"
                size="medium"
              />
            </Box>

            {/* 調整方法 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                調整方法
              </Typography>
              <ButtonGroup fullWidth variant="outlined">
                <Button
                  variant={adjustmentType === 'add' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('add')}
                  startIcon={<AddIcon />}
                  color="success"
                >
                  追加
                </Button>
                <Button
                  variant={adjustmentType === 'remove' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('remove')}
                  startIcon={<RemoveIcon />}
                  color="error"
                >
                  減少
                </Button>
                <Button
                  variant={adjustmentType === 'set' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('set')}
                  startIcon={<InventoryIcon />}
                >
                  設定
                </Button>
              </ButtonGroup>
            </Box>

            {/* 数量入力 */}
            <TextField
              label={
                adjustmentType === 'add' ? '追加数量' :
                adjustmentType === 'remove' ? '減少数量' : '設定数量'
              }
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 1 }}
              helperText={
                adjustmentType === 'add' ? '追加する数量を入力' :
                adjustmentType === 'remove' ? '減らす数量を入力' : '新しい在庫数を入力'
              }
            />

            {/* 結果プレビュー */}
            {adjustment && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  調整後の在庫数
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body1">
                    {item?.quantity || 0} → {newQuantity}
                  </Typography>
                  <Chip
                    label={`変更: ${adjustmentType === 'add' ? '+' : adjustmentType === 'remove' ? '-' : ''}${
                      adjustmentType === 'set' ? 
                        (newQuantity - (item?.quantity || 0)) : 
                        adjustment
                    }`}
                    color={
                      adjustmentType === 'add' ? 'success' :
                      adjustmentType === 'remove' ? 'error' : 'info'
                    }
                    size="small"
                  />
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ fontWeight: 600 }}
            disabled={!adjustment}
          >
            調整実行
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
