import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { FormDialog, FormDialogContent, FormDialogSection } from '../../../components/ui';
import { useTeamForm } from '../hooks/useTeamForm';
import { TeamMemberSelector } from './TeamMemberSelector';
import { TEAM_TYPES, TEAM_STATUS } from '../constants/teamConstants';
import type { TeamMember } from '../stores/useTeamStore';

/**
 * チームのCRUD操作用ダイアログ
 * 統一ダイアログシステムを使用
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

  const isValid = formStore.name.trim() !== '' && 
                  formStore.type !== '' && 
                  formStore.status !== '';

  return (
    <FormDialog
      open={formStore.isDialogOpen}
      onClose={closeDialog}
      onSubmit={handleSave}
      title={title}
      size="md"
      loading={formStore.isSubmitting}
      isValid={isValid}
      submitText={isEditing ? '更新' : '作成'}
    >
      <FormDialogContent>
        <FormDialogSection title="基本情報">
          <TextField
            label="チーム名"
            value={formStore.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={!!formStore.errors.name}
            helperText={formStore.errors.name}
            required
            fullWidth
            size="small"
          />
          
          <TextField
            label="説明"
            value={formStore.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        </FormDialogSection>

        <FormDialogSection title="チーム設定">
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>チームタイプ</InputLabel>
              <Select
                value={formStore.type}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                label="チームタイプ"
                required
              >
                {TEAM_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={formStore.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                label="ステータス"
                required
              >
                {TEAM_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </FormDialogSection>

        <FormDialogSection title="チームメンバー">
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              チームに所属するメンバーを選択してください
            </Typography>
            <TeamMemberSelector />
          </Box>
        </FormDialogSection>
      </FormDialogContent>
    </FormDialog>
  );
};
