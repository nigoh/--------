/**
 * 社員登録フォームUIコンポーネント
 * 
 * フォームUIの描画のみに責務を限定し、
 * ビジネスロジックは useEmployeeForm カスタムフックに移譲
 */
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Collapse,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DEPARTMENTS, POSITIONS, SKILL_OPTIONS } from '../constants/employeeFormConstants';
import { useEmployeeForm } from '../hooks/useEmployeeForm';

/**
 * スキル選択セクションコンポーネント
 */
const SkillSelectionSection: React.FC<{
  formData: { skills: string[] };
  skillsExpanded: boolean;
  onToggleExpanded: () => void;
  onSkillChange: (skill: string, checked: boolean) => void;
  onSkillDelete: (skill: string) => void;
}> = ({
  formData,
  skillsExpanded,
  onToggleExpanded,
  onSkillChange,
  onSkillDelete,
}) => (
  <Box>
    <Button
      variant="outlined"
      onClick={onToggleExpanded}
      endIcon={skillsExpanded ? <ExpandLess /> : <ExpandMore />}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        textAlign: 'left',
        textTransform: 'none',
      }}
    >
      スキルを選択 ({formData.skills.length}個選択中)
    </Button>
    
    <Collapse in={skillsExpanded}>
      <Paper
        variant="outlined"
        sx={{
          mt: 1,
          p: 2,
          maxHeight: 300,
          overflow: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <FormGroup>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 1 
          }}>
            {SKILL_OPTIONS.map((skill: string) => (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={formData.skills.includes(skill)}
                    onChange={(e) => onSkillChange(skill, e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {skill}
                  </Typography>
                }
                sx={{ 
                  m: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                  }
                }}
              />
            ))}
          </Box>
        </FormGroup>
      </Paper>
    </Collapse>

    {/* 選択されたスキルを下部に表示 */}
    {formData.skills.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          選択中のスキル:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.skills.map((skill: string) => (
            <Chip 
              key={skill} 
              label={skill} 
              onDelete={() => onSkillDelete(skill)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                '& .MuiChip-deleteIcon': {
                  fontSize: '16px',
                }
              }}
            />
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

/**
 * 基本情報セクションコンポーネント
 */
const BasicInfoSection: React.FC<{
  formData: { name: string; email: string; phone: string; joinDate: string };
  validationErrors: any;
  onUpdateFormData: (field: keyof import('../hooks/useEmployeeFormValidation').EmployeeFormData, value: string) => void;
}> = ({ formData, validationErrors, onUpdateFormData }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
      基本情報
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <TextField
        fullWidth
        label="氏名"
        value={formData.name}
        onChange={(e) => onUpdateFormData('name', e.target.value)}
        error={!!validationErrors.name}
        helperText={validationErrors.name}
        required
        placeholder="山田 太郎"
      />
      
      <TextField
        fullWidth
        label="メールアドレス"
        type="email"
        value={formData.email}
        onChange={(e) => onUpdateFormData('email', e.target.value)}
        error={!!validationErrors.email}
        helperText={validationErrors.email}
        required
        placeholder="yamada@example.com"
      />
    </Box>

    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
      <TextField
        fullWidth
        label="電話番号"
        value={formData.phone}
        onChange={(e) => onUpdateFormData('phone', e.target.value)}
        error={!!validationErrors.phone}
        helperText={validationErrors.phone}
        placeholder="090-1234-5678"
      />
      
      <TextField
        fullWidth
        label="入社日"
        type="date"
        value={formData.joinDate}
        onChange={(e) => onUpdateFormData('joinDate', e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  </Box>
);

/**
 * 部署・役職セクションコンポーネント
 */
const DepartmentPositionSection: React.FC<{
  formData: { department: string; position: string };
  validationErrors: any;
  onUpdateFormData: (field: keyof import('../hooks/useEmployeeFormValidation').EmployeeFormData, value: string) => void;
}> = ({ formData, validationErrors, onUpdateFormData }) => (
  <Box>
    <Divider sx={{ my: 2 }} />
    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
      部署・役職
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <FormControl fullWidth error={!!validationErrors.department} required>
        <InputLabel>部署</InputLabel>
        <Select
          value={formData.department}
          onChange={(e) => onUpdateFormData('department', e.target.value)}
          label="部署"
        >
          {DEPARTMENTS.map((dept: string) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth error={!!validationErrors.position} required>
        <InputLabel>役職</InputLabel>
        <Select
          value={formData.position}
          onChange={(e) => onUpdateFormData('position', e.target.value)}
          label="役職"
        >
          {POSITIONS.map((pos: string) => (
            <MenuItem key={pos} value={pos}>
              {pos}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Box>
);

/**
 * 社員登録フォームコンポーネント（UI描画のみ）
 */
export const EmployeeRegisterFormUI: React.FC = () => {
  const {
    formData,
    isSubmitting,
    skillsExpanded,
    validationErrors,
    updateFormData,
    handleSkillChange,
    handleSkillDelete,
    handleSubmit,
    handleReset,
    toggleSkillsExpanded,
  } = useEmployeeForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 基本情報セクション */}
        <BasicInfoSection
          formData={formData}
          validationErrors={validationErrors}
          onUpdateFormData={updateFormData}
        />

        {/* 部署・役職セクション */}
        <DepartmentPositionSection
          formData={formData}
          validationErrors={validationErrors}
          onUpdateFormData={updateFormData}
        />

        {/* スキル・経験セクション */}
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            スキル・経験
          </Typography>
          
          <SkillSelectionSection
            formData={formData}
            skillsExpanded={skillsExpanded}
            onToggleExpanded={toggleSkillsExpanded}
            onSkillChange={handleSkillChange}
            onSkillDelete={handleSkillDelete}
          />

          <TextField
            fullWidth
            label="備考・その他"
            multiline
            rows={4}
            value={formData.notes || ''}
            onChange={(e) => updateFormData('notes', e.target.value)}
            placeholder="経験年数、プロジェクト経験、資格など自由に記載してください"
            sx={{ mt: 2 }}
          />
        </Box>

        {/* 送信ボタン */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
              },
            }}
          >
            {isSubmitting ? '登録中...' : '登録'}
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleReset}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            リセット
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeRegisterFormUI;
