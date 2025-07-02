import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { spacingTokens } from '../../../theme/designSystem';
import { useSettingsForm } from '../hooks/useSettingsForm';

// サンプルカテゴリ
const CATEGORIES = ['システム', 'ユーザー', 'セキュリティ', 'メール', 'その他'] as const;

/**
 * 設定のCRUD操作用ダイアログコンポーネント
 */
export const SettingsDialogs: React.FC = () => {
  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    formData,
    selectedSetting,
    closeDialogs,
    setFormData,
    resetForm,
  } = useSettingsForm();

  // フォーム送信ハンドラー
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('フォームデータ:', formData);
    
    // ここで実際のデータ保存処理を行う
    
    closeDialogs();
    resetForm();
  }, [formData, closeDialogs, resetForm]);

  // 削除確認ハンドラー
  const handleDelete = useCallback(() => {
    console.log('削除する設定:', selectedSetting);
    
    // ここで実際の削除処理を行う
    
    closeDialogs();
  }, [selectedSetting, closeDialogs]);

  // キャンセルハンドラー
  const handleCancel = useCallback(() => {
    closeDialogs();
    resetForm();
  }, [closeDialogs, resetForm]);

  return (
    <>
      {/* 作成ダイアログ */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCancel}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            設定の新規作成
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: spacingTokens.md }}
          >
            <TextField
              margin="dense"
              fullWidth
              required
              label="設定名"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              sx={{ mb: spacingTokens.md }}
            />

            <FormControl fullWidth margin="dense" sx={{ mb: spacingTokens.md }}>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={formData.category}
                label="カテゴリ"
                onChange={(e) => setFormData({ category: e.target.value })}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              fullWidth
              required
              label="値"
              value={formData.value}
              onChange={(e) => setFormData({ value: e.target.value })}
              sx={{ mb: spacingTokens.md }}
            />

            <TextField
              margin="dense"
              fullWidth
              multiline
              rows={3}
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ description: e.target.value })}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: spacingTokens.md }}>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCancel}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            設定の編集
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: spacingTokens.md }}
          >
            <TextField
              margin="dense"
              fullWidth
              required
              label="設定名"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              sx={{ mb: spacingTokens.md }}
            />

            <FormControl fullWidth margin="dense" sx={{ mb: spacingTokens.md }}>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={formData.category}
                label="カテゴリ"
                onChange={(e) => setFormData({ category: e.target.value })}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              fullWidth
              required
              label="値"
              value={formData.value}
              onChange={(e) => setFormData({ value: e.target.value })}
              sx={{ mb: spacingTokens.md }}
            />

            <TextField
              margin="dense"
              fullWidth
              multiline
              rows={3}
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ description: e.target.value })}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: spacingTokens.md }}>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancel}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" color="error">
            設定の削除
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography>
            設定「{selectedSetting?.name || ''}」を削除してもよろしいですか？
            この操作は元に戻せません。
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: spacingTokens.md }}>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
