/**
 * 社員登録フォームコンポーネント
 * 
 * 新しい社員の基本情報、部署・役職、連絡先情報、スキル・経験を入力し、
 * バリデーションを行ってからZustandストアに保存するフォーム
 */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useEmployeeStore } from './useEmployeeStore';
import { Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';

// 部署の選択肢
const DEPARTMENTS = [
  '総務部',
  '人事部', 
  '経理部',
  '営業部',
  '開発部',
  'マーケティング部',
  '企画部',
  'その他'
];

// 役職の選択肢
const POSITIONS = [
  '社員',
  '主任',
  '係長',
  '課長',
  '部長',
  '取締役',
  '代表取締役',
  'インターン',
  'その他'
];

// スキルのプリセット選択肢
const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'HTML/CSS',
  'SQL',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Git',
  'プロジェクト管理',
  'UI/UX',
  'デザイン',
  'マーケティング',
  '営業',
  '経理',
  '人事',
  '総務'
];

// バリデーションエラーの型定義
interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
}

// フォームデータの初期値
const initialFormData: Omit<Employee, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> = {
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  joinDate: new Date().toISOString().split('T')[0], // 今日の日付をデフォルトに
  skills: [],
  notes: '',
};

/**
 * 社員登録フォームコンポーネント
 */
export const EmployeeRegisterForm: React.FC = () => {
  const { addEmployee } = useEmployeeStore();
  const { toast, progress } = useTemporary();
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  /**
   * バリデーション実行
   */
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // 必須項目のチェック
    if (!formData.name.trim()) {
      errors.name = '氏名は必須です';
    }

    if (!formData.email.trim()) {
      errors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '正しいメールアドレスを入力してください';
    }

    if (formData.phone && !/^[\d-+()]+$/.test(formData.phone)) {
      errors.phone = '正しい電話番号を入力してください';
    }

    if (!formData.department) {
      errors.department = '部署は必須です';
    }

    if (!formData.position) {
      errors.position = '役職は必須です';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * スキル追加・削除のハンドラー
   */
  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  /**
   * スキル削除
   */
  const handleSkillDelete = (skillToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete)
    }));
  };

  /**
   * フォーム送信
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('入力内容を確認してください');
      toast.warning('入力内容を確認してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // 進行状況表示開始
    progress.start('社員情報を登録中...', 1);

    try {
      // 擬似的な遅延（実際のAPIコールではない）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 新しい社員を追加
      addEmployee({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim(),
      });

      // 進行状況完了
      progress.complete();
      
      // 成功トーストと通知
      toast.success(`${formData.name}さんを登録しました`);
      
      // フォームをリセット
      setFormData(initialFormData);
      setValidationErrors({});
      
      // 1秒後に進行状況をクリア
      setTimeout(() => {
        progress.clear();
      }, 1000);
      
    } catch (err) {
      progress.error();
      setError('登録に失敗しました。もう一度お試しください。');
      toast.error('登録に失敗しました');
      
      // 2秒後に進行状況をクリア
      setTimeout(() => {
        progress.clear();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * フォームリセット
   */
  const handleReset = () => {
    setFormData(initialFormData);
    setValidationErrors({});
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          社員登録
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 基本情報 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                基本情報
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="氏名"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="メールアドレス"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    required
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="電話番号"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    error={!!validationErrors.phone}
                    helperText={validationErrors.phone}
                    placeholder="090-1234-5678"
                  />
                  
                  <TextField
                    fullWidth
                    label="入社日"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* 部署・役職 */}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    label="部署"
                  >
                    {DEPARTMENTS.map((dept) => (
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
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    label="役職"
                  >
                    {POSITIONS.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* スキル・経験 */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                スキル・経験
              </Typography>
              
              <Stack spacing={2}>
                {/* スキル選択（チェックリスト形式） */}
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => setSkillsExpanded(!skillsExpanded)}
                    endIcon={skillsExpanded ? <ExpandLess /> : <ExpandMore />}
                    sx={{ 
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                      }
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
                          {SKILL_OPTIONS.map((skill) => (
                            <FormControlLabel
                              key={skill}
                              control={
                                <Checkbox
                                  checked={formData.skills.includes(skill)}
                                  onChange={(e) => handleSkillChange(skill, e.target.checked)}
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
                </Box>

                {/* 選択されたスキルを下部に表示 */}
                {formData.skills.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      選択中のスキル:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.skills.map((skill) => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          onDelete={() => handleSkillDelete(skill)}
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

                <TextField
                  fullWidth
                  label="備考・その他"
                  multiline
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="経験年数、プロジェクト経験、資格など自由に記載してください"
                />
              </Stack>
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
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};
