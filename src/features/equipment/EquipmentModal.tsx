import React, { useState, useEffect } from 'react';
import {
  TextField,
  Stack,
  MenuItem,
  Alert,
} from '@mui/material';
import { FormDialog, FormDialogContent, FormDialogSection } from '../../components/ui';
import { useEquipmentStore, EquipmentItem } from './useEquipmentStore';

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  item?: EquipmentItem | null;
}

const equipmentCategories = [
  'PC・周辺機器',
  'オフィス用品',
  '文房具',
  '清掃用品',
  '家具',
  '電子機器',
  '工具',
  'その他',
];

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  open,
  onClose,
  item,
}) => {
  const { addItem, updateItem } = useEquipmentStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(item);

  // フォームデータの初期化
  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          name: item.name,
          category: item.category,
          quantity: item.quantity.toString(),
          note: item.note || '',
        });
      } else {
        setFormData({
          name: '',
          category: '',
          quantity: '',
          note: '',
        });
      }
      setError(null);
    }
  }, [open, item]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('備品名を入力してください');
      return false;
    }
    if (!formData.category) {
      setError('カテゴリを選択してください');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('正しい数量を入力してください');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const equipmentData = {
        name: formData.name.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        note: formData.note.trim(),
      };

      if (isEditing && item) {
        updateItem(item.id, equipmentData);
      } else {
        addItem(equipmentData);
      }

      onClose();
    } catch (err) {
      setError('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.name.trim() !== '' && 
                  formData.category !== '' && 
                  formData.quantity !== '' && 
                  parseInt(formData.quantity) >= 0;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? '備品編集' : '備品登録'}
      size="sm"
      loading={isSubmitting}
      isValid={isValid}
      submitText={isEditing ? '更新' : '登録'}
    >
      <FormDialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormDialogSection title="基本情報">
          <Stack spacing={2}>
            <TextField
              label="備品名"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              fullWidth
              size="small"
            />

            <TextField
              label="カテゴリ"
              select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
              fullWidth
              size="small"
            >
              {equipmentCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="数量"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              required
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />

            <TextField
              label="備考"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
            />
          </Stack>
        </FormDialogSection>
      </FormDialogContent>
    </FormDialog>
  );
};
