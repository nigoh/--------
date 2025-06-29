/**
 * 社員登録・編集モーダルコンポーネント
 * 
 * 新規登録と既存社員の編集の両方に対応
 * フォームバリデーションとアニメーションを含む
 */
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Autocomplete,
  Switch,
  FormControlLabel,
  useTheme,
  Divider,
  FormGroup,
  Checkbox,
  FormLabel,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Employee } from '../useEmployeeStore';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';
import { DEPARTMENTS, POSITIONS, SKILL_OPTIONS } from '../constants/employeeFormConstants';

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null; // nullの場合は新規登録
  mode?: 'create' | 'edit' | 'view'; // 表示モードを追加
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  onClose,
  employee,
  mode = 'create', // デフォルトは新規作成モード
}) => {
  const theme = useTheme();
  
  // カスタムHookを使用して状態管理を分離
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

  /**
   * モーダルが開いた時にフォームを初期化
   */
  useEffect(() => {
    initializeForm(open);
  }, [open, employee, initializeForm]);

  /**
   * 保存ボタンクリック時の処理
   */
  const onSaveClick = async () => {
    const success = await handleSave(onClose);
    // handleSave内でonCloseが呼ばれるため、ここでは何もしない
  };

  /**
   * 詳細表示用の情報表示コンポーネント
   */
  const renderViewOnlyContent = () => {
    if (!employee) return null;

    return (
      <Stack spacing={spacingTokens.md}>
        {/* 基本情報 */}
        <Box>
          <Divider>
            <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
              基本情報
            </FormLabel>
          </Divider>
          <Stack spacing={spacingTokens.sm} sx={{ mt: spacingTokens.md }}>
            <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">氏名</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {employee.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {employee.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">電話番号</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {employee.phone || '未設定'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">入社日</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {new Date(employee.joinDate).toLocaleDateString('ja-JP')}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* 組織情報 */}
        <Box>
          <Divider>
            <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
              組織情報
            </FormLabel>
          </Divider>
          <Stack spacing={spacingTokens.sm} sx={{ mt: spacingTokens.md }}>
            <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">部署</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {employee.department}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">役職</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                  {employee.position}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* スキル情報 */}
        <Box>
          <Divider>
            <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
              スキル・その他
            </FormLabel>
          </Divider>
          <Stack spacing={spacingTokens.md} sx={{ mt: spacingTokens.md }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.sm }}>
                スキル ({employee.skills.length}個)
              </Typography>
              {employee.skills.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: spacingTokens.xs }}>
                  {employee.skills.map((skill, index) => (
                    <Chip
                      key={skill}
                      variant="filled"
                      label={skill}
                      size="small"
                      color="primary"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  スキル情報が登録されていません
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">備考</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mt: spacingTokens.xs }}>
                {employee.notes || '特記事項なし'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">在籍状況</Typography>
              <Chip
                label={employee.isActive ? '在籍中' : '退職済み'}
                color={employee.isActive ? 'success' : 'default'}
                size="small"
                sx={{ mt: spacingTokens.xs }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            ...surfaceStyles.elevated(3)(theme),
            minHeight: '500px',
            maxWidth: '600px',
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacingTokens.md,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
          {isViewing ? <VisibilityIcon /> : isEditing ? <EditIcon /> : <PersonAddIcon />}
          <Typography variant="h6" component="div">
            {isViewing ? '社員情報詳細' : isEditing ? '社員情報編集' : '新規社員登録'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: spacingTokens.md }}>
        {isViewing ? renderViewOnlyContent() : (
          <Stack spacing={spacingTokens.md}>
            {/* 基本情報 */}
            <Box>
            <Divider>
              <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
                基本情報
              </FormLabel>
            </Divider>

            <Stack spacing={spacingTokens.sm}>
              <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                <TextField
                  label="氏名"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  size="small"
                  sx={{ width: { xs: '100%', sm: 250 } }}
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
                  sx={{ width: { xs: '100%', sm: 300 } }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                <TextField
                  label="電話番号"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  size="small"
                  sx={{ width: { xs: '100%', sm: 250 } }}
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
                  sx={{ width: { xs: '100%', sm: 200 } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>
          </Box>

          {/* 組織情報 */}
          <Box>
            <Divider>
              <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
                組織情報
              </FormLabel>
            </Divider>
            <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
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
                freeSolo
                sx={{ width: { xs: '100%', sm: 200 } }}
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
                freeSolo
                sx={{ width: { xs: '100%', sm: 200 } }}
              />
            </Box>
          </Box>

          {/* スキル情報 */}
          <Box>
            <Stack spacing={spacingTokens.sm}>
              <Box>
                <Divider>
                  <FormLabel component="legend" sx={{ mt: spacingTokens.sm, mb: spacingTokens.sm, fontWeight: 600, color: theme.palette.text.primary }}>
                    スキル
                  </FormLabel>
                </Divider>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    maxHeight: 150,
                    overflow: 'auto',
                    width: { xs: '100%', sm: 500 }
                  }}
                >
                  <FormGroup>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                      {SKILL_OPTIONS.map((skill) => (
                        <FormControlLabel
                          key={skill}
                          control={
                            <Checkbox
                              checked={formData.skills.includes(skill)}
                              onChange={(e) => {
                                const newSkills = e.target.checked
                                  ? [...formData.skills, skill]
                                  : formData.skills.filter(s => s !== skill);
                                handleInputChange('skills', newSkills);
                              }}
                              size="small"
                            />
                          }
                          label={skill}
                          sx={{
                            margin: 0,
                            '& .MuiFormControlLabel-label': {
                              fontSize: '0.875rem',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </FormGroup>
                </Paper>

                {/* カスタムスキル追加 */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="カスタムスキルを追加"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={handleCustomSkillKeyPress}
                    placeholder="リストにないスキルを入力"
                    size="small"
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddCustomSkill}
                            disabled={!customSkill.trim() || formData.skills.includes(customSkill.trim())}
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* 選択されたスキルの概要表示 */}
                {formData.skills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Divider >
                      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                        選択されたスキル ({formData.skills.length}個)
                      </Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formData.skills.map((skill, index) => (
                        <Chip
                          key={skill}
                          variant="filled"
                          label={skill}
                          size="small"
                          color="primary"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                          onDelete={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            handleInputChange('skills', newSkills);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              <Divider sx={{ my: spacingTokens.sm }} />
              <TextField
                label="備考"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="その他の情報や特記事項があれば記入してください"
                size="small"
                sx={{ width: { xs: '100%', sm: 500 } }}
              />
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
            </Stack>
          </Box>
        </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: spacingTokens.md, gap: spacingTokens.sm, justifyContent: 'center' }}>
        {isViewing ? (
          <Button
            onClick={onClose}
            variant="contained"
            size="medium"
            sx={{ minWidth: 100 }}
          >
            閉じる
          </Button>
        ) : (
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              size="medium"
              sx={{ minWidth: 100 }}
            >
              キャンセル
            </Button>
            <Button
              onClick={onSaveClick}
              variant="contained"
              size="medium"
              startIcon={<SaveIcon />}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                minWidth: 120,
              }}
            >
              {isEditing ? '更新' : '登録'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
