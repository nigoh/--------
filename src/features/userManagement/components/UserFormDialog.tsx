/**
 * ユーザー作成・編集ダイアログコンポーネント
 */
import React, { useState, useEffect } from 'react';
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
  Chip,
  Box,
  Grid,
  Typography,
  Autocomplete,
  FormHelperText,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { CreateUserInput, UpdateUserInput } from '../types';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '@/auth';
import { useUserManagementStore } from '../stores/useUserManagementStore';
import {
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  POSITIONS,
  POSITION_LABELS,
  SKILLS,
  ROLE_LABELS,
  VALIDATION_RULES,
} from '../constants/userConstants';

export const UserFormDialog: React.FC = () => {
  const {
    selectedUser,
    isAddDialogOpen,
    isEditDialogOpen,
    saving,
    error,
    createUser,
    updateUser,
    closeAddDialog,
    closeEditDialog,
    checkEmployeeIdExists,
  } = useUserManagementStore();

  const isOpen = isAddDialogOpen || isEditDialogOpen;
  const isEdit = isEditDialogOpen && selectedUser;

  // フォーム状態
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    displayName: '',
    employeeId: '',
    name: '',
    nameKana: '',
    department: '',
    position: '',
    phone: '',
    joinDate: '',
    skills: [],
    roles: [UserRole.EMPLOYEE],
    permissions: [],
    isActive: true,
    notes: '',
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // フォームデータの初期化
  useEffect(() => {
    if (isEdit && selectedUser) {
      setFormData({
        email: selectedUser.email,
        displayName: selectedUser.displayName,
        employeeId: selectedUser.employeeId,
        name: selectedUser.name,
        nameKana: selectedUser.nameKana || '',
        department: selectedUser.department,
        position: selectedUser.position,
        phone: selectedUser.phone || '',
        joinDate: selectedUser.joinDate,
        skills: selectedUser.skills,
        roles: selectedUser.roles,
        permissions: selectedUser.permissions,
        isActive: selectedUser.isActive,
        notes: selectedUser.notes || '',
      });
    } else {
      setFormData({
        email: '',
        displayName: '',
        employeeId: '',
        name: '',
        nameKana: '',
        department: '',
        position: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
        skills: [],
        roles: [UserRole.EMPLOYEE],
        permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.EMPLOYEE],
        isActive: true,
        notes: '',
      });
    }
    setErrors({});
  }, [isEdit, selectedUser, isOpen]);

  // フィールド変更ハンドラー
  const handleFieldChange = (field: keyof CreateUserInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ロール変更時の権限自動設定
  const handleRoleChange = (roles: UserRole[]) => {
    const permissions: Permission[] = [];
    roles.forEach(role => {
      permissions.push(...DEFAULT_ROLE_PERMISSIONS[role]);
    });
    
    // 重複を排除
    const uniquePermissions = Array.from(new Set(permissions));
    
    setFormData(prev => ({
      ...prev,
      roles,
      permissions: uniquePermissions,
    }));
  };

  // バリデーション
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // 必須フィールド
    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    } else if (formData.name.length > VALIDATION_RULES.name.maxLength) {
      newErrors.name = `氏名は${VALIDATION_RULES.name.maxLength}文字以内で入力してください`;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!VALIDATION_RULES.email.pattern.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = '社員番号は必須です';
    } else if (!VALIDATION_RULES.employeeId.pattern.test(formData.employeeId)) {
      newErrors.employeeId = '社員番号は英数字とハイフンのみ使用可能です';
    } else {
      // 重複チェック
      const exists = await checkEmployeeIdExists(
        formData.employeeId,
        isEdit ? selectedUser?.uid : undefined
      );
      if (exists) {
        newErrors.employeeId = 'この社員番号は既に使用されています';
      }
    }

    if (!formData.department) {
      newErrors.department = '部署は必須です';
    }

    if (!formData.position) {
      newErrors.position = '役職は必須です';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = '入社日は必須です';
    }

    if (formData.roles.length === 0) {
      newErrors.roles = '少なくとも1つのロールを選択してください';
    }

    // 電話番号（任意）
    if (formData.phone && !VALIDATION_RULES.phone.pattern.test(formData.phone)) {
      newErrors.phone = '有効な電話番号を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存ハンドラー
  const handleSave = async () => {
    if (!(await validateForm())) return;

    try {
      if (isEdit && selectedUser) {
        await updateUser(selectedUser.uid, formData as UpdateUserInput);
      } else {
        await createUser(formData);
      }
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  // キャンセルハンドラー
  const handleCancel = () => {
    if (isEdit) {
      closeEditDialog();
    } else {
      closeAddDialog();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          {isEdit ? 'ユーザー編集' : 'ユーザー追加'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* 基本情報 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本情報
              </Typography>
            </Grid>

            {/* 氏名 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="氏名"
                required
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* 氏名カナ */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="氏名カナ"
                value={formData.nameKana}
                onChange={(e) => handleFieldChange('nameKana', e.target.value)}
              />
            </Grid>

            {/* メールアドレス */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* 社員番号 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="社員番号"
                required
                value={formData.employeeId}
                onChange={(e) => handleFieldChange('employeeId', e.target.value.toUpperCase())}
                error={!!errors.employeeId}
                helperText={errors.employeeId}
                placeholder="EMP001"
              />
            </Grid>

            {/* 部署 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.department}>
                <InputLabel>部署</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                >
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {DEPARTMENT_LABELS[dept]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* 役職 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.position}>
                <InputLabel>役職</InputLabel>
                <Select
                  value={formData.position}
                  onChange={(e) => handleFieldChange('position', e.target.value)}
                >
                  {POSITIONS.map((position) => (
                    <MenuItem key={position} value={position}>
                      {POSITION_LABELS[position]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* 電話番号 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="電話番号"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="090-1234-5678"
              />
            </Grid>

            {/* 入社日 */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="入社日"
                value={formData.joinDate ? new Date(formData.joinDate) : null}
                onChange={(date) => handleFieldChange('joinDate', 
                  date ? date.toISOString().split('T')[0] : ''
                )}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.joinDate,
                    helperText: errors.joinDate,
                  }
                }}
              />
            </Grid>

            {/* スキル */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={SKILLS}
                value={formData.skills}
                onChange={(_, value) => handleFieldChange('skills', value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="スキル"
                    placeholder="スキルを選択..."
                  />
                )}
              />
            </Grid>

            {/* 権限設定 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                権限設定
              </Typography>
            </Grid>

            {/* ロール */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.roles}>
                <InputLabel>ロール</InputLabel>
                <Select
                  multiple
                  value={formData.roles}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((role) => (
                        <Chip
                          key={role}
                          label={ROLE_LABELS[role]}
                          size="small"
                          color={
                            role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
                              ? 'error'
                              : role === UserRole.MANAGER
                              ? 'warning'
                              : 'default'
                          }
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(UserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* ステータス */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                  />
                }
                label="アクティブ"
              />
            </Grid>

            {/* 備考 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="備考"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="その他の情報や備考..."
              />
            </Grid>
          </Grid>

          {/* エラー表示 */}
          {error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error.contrastText">
                {error}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={saving}>
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
          >
            {saving ? '保存中...' : isEdit ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
