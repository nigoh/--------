import React from 'react';
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
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useTeamForm } from '../hooks/useTeamForm';
import { TeamMemberSelector } from './TeamMemberSelector';
import { TEAM_TYPES, TEAM_STATUS } from '../constants/teamConstants';

/**
 * チームのCRUD操作用ダイアログ
 */
export const TeamDialogs: React.FC = () => {
  const { formStore, handleSubmit, closeDialog } = useTeamForm();

  const isEditing = !!formStore.editingTeam;
  const title = isEditing ? 'チーム編集' : 'チーム新規作成';

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) {
      // ダイアログは handleSubmit 内で閉じられる
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    formStore.updateField(field as any, value);
  };

  return (
    <Dialog
      open={formStore.isDialogOpen}
      onClose={closeDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={closeDialog} disabled={formStore.isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* チーム基本情報 */}
        <Box>
          <Typography variant="h6" gutterBottom>
            チーム基本情報
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="チーム名"
              value={formStore.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!formStore.errors.name}
              helperText={formStore.errors.name}
              disabled={formStore.isSubmitting}
              required
            />

            <TextField
              fullWidth
              label="説明"
              value={formStore.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              multiline
              rows={3}
              disabled={formStore.isSubmitting}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel required>チームタイプ</InputLabel>
                <Select
                  value={formStore.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  label="チームタイプ"
                  error={!!formStore.errors.type}
                  disabled={formStore.isSubmitting}
                  required
                >
                  <MenuItem value="">
                    <em>選択してください</em>
                  </MenuItem>
                  {TEAM_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formStore.errors.type && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {formStore.errors.type}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel required>ステータス</InputLabel>
                <Select
                  value={formStore.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  label="ステータス"
                  error={!!formStore.errors.status}
                  disabled={formStore.isSubmitting}
                  required
                >
                  <MenuItem value="">
                    <em>選択してください</em>
                  </MenuItem>
                  {TEAM_STATUS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {formStore.errors.status && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {formStore.errors.status}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* メンバー選択 */}
        <TeamMemberSelector />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={closeDialog}
          disabled={formStore.isSubmitting}
          color="inherit"
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={formStore.isSubmitting}
          startIcon={
            formStore.isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              <SaveIcon />
            )
          }
        >
          {formStore.isSubmitting ? '保存中...' : isEditing ? '更新' : '作成'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
