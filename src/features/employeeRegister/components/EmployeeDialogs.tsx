/**
 * 社員登録・編集モーダルコンポーネント
 * 統一ダイアログシステムを使用
 */
import React, { useEffect } from 'react';
import {
  TextField,
  Box,
  Chip,
  Stack,
  Autocomplete,
  Switch,
  FormControlLabel,
  useTheme,
  FormGroup,
  Checkbox,
  Paper,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { FormDialog, FormDialogContent, FormDialogSection } from '../../../components/ui';
import { Employee } from '../useEmployeeStore';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { spacingTokens } from '../../../theme/designSystem';
import { DEPARTMENTS, POSITIONS, SKILL_OPTIONS } from '../constants/employeeFormConstants';

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
  mode?: 'create' | 'edit' | 'view';
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  onClose,
  employee,
  mode = 'create',
}) => {
  const theme = useTheme();
  
  const {
    formData,
    errors,
    customSkill,
    isSubmitting,
    isDirty,
    isEditing,
    isViewing,
    isCreating,
    initializeForm,
    handleInputChange,
    handleAddCustomSkill,
    handleCustomSkillKeyPress,
    validateForm,
    handleSave,
    setCustomSkill,
  } = useEmployeeForm(employee, mode);

  useEffect(() => {
    initializeForm(open);
  }, [open, employee, initializeForm]);

  const onSaveClick = async () => {
    const success = await handleSave(onClose);
  };

  // 詳細表示用コンテンツ
  const renderViewOnlyContent = () => {
    if (!employee) return null;

    return (
      <>
        <FormDialogSection title="基本情報">
          <Stack spacing={spacingTokens.sm}>
            <Typography><strong>氏名:</strong> {employee.name}</Typography>
            <Typography><strong>メールアドレス:</strong> {employee.email}</Typography>
            <Typography><strong>電話番号:</strong> {employee.phone}</Typography>
            <Typography><strong>入社日:</strong> {employee.joinDate}</Typography>
          </Stack>
        </FormDialogSection>

        <FormDialogSection title="組織情報">
          <Stack spacing={spacingTokens.sm}>
            <Typography><strong>部署:</strong> {employee.department}</Typography>
            <Typography><strong>役職:</strong> {employee.position}</Typography>
            <Typography><strong>在籍状況:</strong> {employee.isActive ? '在籍中' : '退職済み'}</Typography>
          </Stack>
        </FormDialogSection>

        <FormDialogSection title="スキル・資格">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {employee.skills?.map((skill, index) => (
              <Chip key={index} label={skill} variant="outlined" />
            ))}
          </Box>
        </FormDialogSection>
      </>
    );
  };

  // フォーム入力用コンテンツ
  const renderFormContent = () => (
    <>
      <FormDialogSection title="基本情報">
        <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="氏名"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="メールアドレス"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="電話番号"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="入社日"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleInputChange('joinDate', e.target.value)}
            error={!!errors.joinDate}
            helperText={errors.joinDate}
            required
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Box>
      </FormDialogSection>

      <FormDialogSection title="組織情報">
        <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Autocomplete
            options={DEPARTMENTS}
            value={formData.department}
            onChange={(_, value) => handleInputChange('department', value || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="部署"
                error={!!errors.department}
                helperText={errors.department}
                required
                size="small"
              />
            )}
            sx={{ flex: 1 }}
          />
          <Autocomplete
            options={POSITIONS}
            value={formData.position}
            onChange={(_, value) => handleInputChange('position', value || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="役職"
                error={!!errors.position}
                helperText={errors.position}
                required
                size="small"
              />
            )}
            sx={{ flex: 1 }}
          />
        </Box>
      </FormDialogSection>

      <FormDialogSection title="スキル・資格">
        {/* 選択されたスキルの表示 */}
        {formData.skills && formData.skills.length > 0 && (
          <Stack spacing={spacingTokens.sm} sx={{ mb: spacingTokens.md }}>
            <Typography variant="body2" color="text.secondary">
              選択中のスキル:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: spacingTokens.xs,
              minHeight: '32px', // 最小高さを設定してレイアウト安定化
              maxHeight: '120px', // 最大高さを制限
              overflowY: 'auto', // 縦スクロール対応
              overflowX: 'hidden', // 横スクロールを防止
              boxSizing: 'border-box', // パディング・ボーダーを幅に含める
              // スクロールバーを右端に固定
              marginRight: 0,
              paddingRight: spacingTokens.sm,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.action.selected,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: theme.palette.action.focus,
                },
              },
            }}>
              {formData.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  variant="outlined" 
                  size="small"
                  onDelete={() => {
                    const currentSkills = formData.skills || [];
                    handleInputChange('skills', currentSkills.filter(s => s !== skill));
                  }}
                  sx={{
                    maxWidth: '100%', // Chip自体も親要素を超えないよう制限
                    '& .MuiChip-label': {
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    },
                    '& .MuiChip-deleteIcon': {
                      fontSize: '1rem',
                      '&:hover': {
                        color: theme.palette.error.main
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Stack>
        )}

        {/* スキル選択チェックボックス */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: spacingTokens.md, 
            maxHeight: 200, 
            overflowY: 'auto',
            backgroundColor: theme.palette.background.default,
            // スクロールバーを右端に固定
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.action.hover,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.action.selected,
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: theme.palette.action.focus,
              },
            },
          }}
        >
          <FormGroup>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              }, 
              gap: spacingTokens.xs 
            }}>
              {SKILL_OPTIONS.map((skill) => (
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      checked={formData.skills?.includes(skill) || false}
                      onChange={(e) => {
                        const currentSkills = formData.skills || [];
                        if (e.target.checked) {
                          handleInputChange('skills', [...currentSkills, skill]);
                        } else {
                          handleInputChange('skills', currentSkills.filter(s => s !== skill));
                        }
                      }}
                      size="small"
                    />
                  }
                  label={skill}
                  sx={{ 
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              ))}
            </Box>
          </FormGroup>
        </Paper>
        
        {/* カスタムスキル追加 */}
        <Box sx={{ display: 'flex', gap: spacingTokens.sm, alignItems: 'flex-end', mt: spacingTokens.md }}>
          <TextField
            label="カスタムスキル追加"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyPress={handleCustomSkillKeyPress}
            size="small"
            sx={{ flex: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AddIcon
                    sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                    onClick={handleAddCustomSkill}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </FormDialogSection>

      <FormDialogSection title="ステータス">
        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              color="primary"
            />
          }
          label="在籍中"
        />
      </FormDialogSection>
    </>
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSaveClick}
      title={isViewing ? '社員情報詳細' : isEditing ? '社員情報編集' : '新規社員登録'}
      size="md"
      loading={isSubmitting}
      disabled={!isDirty}
      isValid={Object.keys(errors).length === 0}
      submitText={isViewing ? undefined : isEditing ? '更新' : '登録'}
      showCancelButton={!isViewing}
    >
      <FormDialogContent>
        {isViewing ? renderViewOnlyContent() : renderFormContent()}
      </FormDialogContent>
    </FormDialog>
  );
};
