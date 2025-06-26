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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Divider,
} from '@mui/material';
import { useEmployeeStore } from './useEmployeeStore';
import { Employee } from './useEmployeeStore';

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
const initialFormData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
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
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.phone.trim()) {
      errors.phone = '電話番号は必須です';
    } else if (!/^[\d-+()]+$/.test(formData.phone)) {
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
  const handleSkillChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, skills: typeof value === 'string' ? value.split(',') : value }));
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
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 新しい社員を追加
      addEmployee({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      // フォームをリセット
      setFormData(initialFormData);
      setValidationErrors({});
      
      // 成功メッセージ（将来的にはトーストやダイアログで表示）
      alert('社員情報を登録しました');
      
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。');
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
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 800, 
        mx: 'auto',
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
        <Grid container spacing={3}>
          {/* 基本情報 */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              基本情報
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="氏名"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="電話番号"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              placeholder="090-1234-5678"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>

          {/* 部署・役職 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              部署・役職
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>

          {/* スキル・経験 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              スキル・経験
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>スキル</InputLabel>
              <Select
                multiple
                value={formData.skills}
                onChange={handleSkillChange}
                input={<OutlinedInput label="スキル" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        onDelete={() => handleSkillDelete(value)}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {SKILL_OPTIONS.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="備考・その他"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="経験年数、プロジェクト経験、資格など自由に記載してください"
            />
          </Grid>

          {/* 送信ボタン */}
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
