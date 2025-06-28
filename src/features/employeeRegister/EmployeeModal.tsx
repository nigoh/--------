/**
 * 社員登録・編集モーダルコンポーネント
 * 
 * 新規登録と既存社員の編集の両方に対応
 * フォームバリデーションとアニメーションを含む
 */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
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
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useEmployeeStore, Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null; // nullの場合は新規登録
}

/**
 * 部署の選択肢（実際のアプリケーションではAPIから取得）
 */
const DEPARTMENTS = [
  '営業部',
  '開発部',
  'マーケティング部',
  '人事部',
  '経理部',
  '企画部',
  '総務部',
  'デザイン部',
];

/**
 * 役職の選択肢
 */
const POSITIONS = [
  '部長',
  '課長',
  '主任',
  'リーダー',
  '主査',
  '一般職',
  'インターン',
];

/**
 * スキルの選択肢
 */
const AVAILABLE_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'PHP',
  'C#',
  'Go',
  'Rust',
  'SQL',
  'MongoDB',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'Figma',
  'Photoshop',
  'Illustrator',
  'UI/UX',
  'プロジェクト管理',
  '英語',
  '中国語',
  '韓国語',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  onClose,
  employee,
}) => {
  const theme = useTheme();
  const { addEmployee, updateEmployee } = useEmployeeStore();
  const { toast, progress } = useTemporary();
  const isEditing = !!employee;

  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: '',
    skills: [] as string[],
    notes: '',
    isActive: true,
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * フォームデータを初期化
   */
  useEffect(() => {
    if (open) {
      if (employee) {
        // 編集モードの場合、既存データをセット
        setFormData({
          name: employee.name,
          email: employee.email,
          phone: employee.phone || '',
          department: employee.department,
          position: employee.position,
          joinDate: employee.joinDate,
          skills: employee.skills,
          notes: employee.notes || '',
          isActive: employee.isActive,
        });
      } else {
        // 新規登録の場合、フォームをリセット
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          joinDate: new Date().toISOString().split('T')[0],
          skills: [],
          notes: '',
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [open, employee]);

  /**
   * 入力フィールドの変更ハンドラー
   */
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * バリデーション
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.department.trim()) {
      newErrors.department = '部署は必須です';
    }

    if (!formData.position.trim()) {
      newErrors.position = '役職は必須です';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = '入社日は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }

    progress.start(isEditing ? '社員情報を更新中...' : '社員を登録中...', 1);

    try {
      // 擬似的な遅延
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditing && employee) {
        // 更新
        const updatedEmployee: Employee = {
          ...employee,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        updateEmployee(employee.id, formData);
        toast.success(`${formData.name}さんの情報を更新しました`);
      } else {
        // 新規登録
        const newEmployee: Employee = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addEmployee(newEmployee);
        toast.success(`${formData.name}さんを登録しました`);
      }

      progress.complete();
      onClose();

      // 1秒後に進行状況をクリア
      setTimeout(() => {
        progress.clear();
      }, 1000);

    } catch (err) {
      progress.error();
      toast.error(isEditing ? '更新に失敗しました' : '登録に失敗しました');
      
      setTimeout(() => {
        progress.clear();
      }, 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          ...surfaceStyles.elevated(3)(theme),
          borderRadius: spacingTokens.sm,
          minHeight: '500px',
          maxWidth: '600px',
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
          {isEditing ? <EditIcon /> : <PersonAddIcon />}
          <Typography variant="h6" component="div">
            {isEditing ? '社員情報編集' : '新規社員登録'}
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
        <Stack spacing={spacingTokens.md}>
          {/* 基本情報 */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              基本情報
            </Typography>
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
                  sx={{ maxWidth: 200 }}
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
                  sx={{ maxWidth: 300 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: spacingTokens.md, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                <TextField
                  label="電話番号"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  size="small"
                  sx={{ maxWidth: 200 }}
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
                  sx={{ maxWidth: 200 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>
          </Box>

          {/* 組織情報 */}
          <Box>
            <Divider sx={{ my: spacingTokens.sm }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              組織情報
            </Typography>
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
                sx={{ width: 150 }}
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
                sx={{ width: 150 }}
              />
            </Box>
          </Box>

          {/* スキル情報 */}
          <Box>
            <Divider sx={{ my: spacingTokens.sm }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: spacingTokens.sm,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              スキル・その他
            </Typography>
            <Stack spacing={spacingTokens.sm}>
              <Box>
                <Autocomplete
                  multiple
                  options={AVAILABLE_SKILLS}
                  value={formData.skills}
                  onChange={(_, value) => handleInputChange('skills', value)}
                  renderTags={() => null} // タグは下に別途表示するため非表示
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="スキル"
                      placeholder="スキルを選択または入力..."
                      size="small"
                      sx={{ maxWidth: 300 }}
                    />
                  )}
                  freeSolo
                />
                {/* スキルのChipを入力枠の下に表示 */}
                {formData.skills.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                )}
              </Box>
              <TextField
                label="備考"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="その他の情報や特記事項があれば記入してください"
                size="small"
                sx={{ maxWidth: 400 }}
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
      </DialogContent>

      <DialogActions sx={{ p: spacingTokens.md, gap: spacingTokens.sm, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="medium"
          sx={{ minWidth: 100 }}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
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
      </DialogActions>
    </Dialog>
  );
};
