/**
 * 新規登録フォームコンポーネント
 * 統一されたデザインシステムに従った実装
 */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useRegister } from '../hooks/useRegister';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import type { RegisterFormData } from '../types';

// Props型定義
interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

// パスワード強度
interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'error' | 'warning' | 'info' | 'success';
}

/**
 * 新規登録フォームコンポーネント
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onRegisterSuccess,
}) => {
  const { isLoading, error, register, clearError } = useRegister();

  // フォーム状態
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false,
  });

  // UI状態
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'error',
  });

  // パスワード強度チェック
  const checkPasswordStrength = useCallback((password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, feedback: [], color: 'error' };
    }

    const feedback: string[] = [];
    let score = 0;

    // 長さチェック
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('8文字以上');
    }

    // 大文字チェック
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('英大文字を含む');
    }

    // 小文字チェック
    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('英小文字を含む');
    }

    // 数字チェック
    if (/\d/.test(password)) {
      score += 25;
    } else {
      feedback.push('数字を含む');
    }

    // 色の決定
    let color: PasswordStrength['color'] = 'error';
    if (score >= 100) color = 'success';
    else if (score >= 75) color = 'info';
    else if (score >= 50) color = 'warning';

    return { score, feedback, color };
  }, []);

  // フォーム入力ハンドラー
  const handleInputChange = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();

    // パスワード強度チェック
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  }, [error, clearError, checkPasswordStrength]);

  // 新規登録処理
  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await register(formData);
    if (success && onRegisterSuccess) {
      onRegisterSuccess();
    }
  }, [formData, register, onRegisterSuccess]);

  // パスワード一致チェック
  const passwordMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword && !passwordMatch;

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 450,
        width: '100%',
        borderRadius: shapeTokens.corner.large,
      }}
    >
      <CardContent sx={{ p: spacingTokens.xl }}>
        {/* ヘッダー */}
        <Box sx={{ textAlign: 'center', mb: spacingTokens.lg }}>
          <Typography variant="h4" component="h1" gutterBottom>
            新規登録
          </Typography>
          <Typography variant="body2" color="text.secondary">
            アカウントを作成してください
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: spacingTokens.md }}>
            {error}
          </Alert>
        )}

        {/* 登録フォーム */}
        <Box component="form" onSubmit={handleRegister}>
          <Stack spacing={spacingTokens.md}>
            {/* 表示名 */}
            <TextField
              fullWidth
              label="表示名"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              required
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* メールアドレス */}
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* パスワード */}
            <Box>
              <TextField
                fullWidth
                label="パスワード"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={isLoading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* パスワード強度インジケーター */}
              {formData.password && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  
                  {passwordStrength.feedback.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {passwordStrength.feedback.map((item, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          <CancelIcon sx={{ fontSize: 14 }} />
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {passwordStrength.score === 100 && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'success.main',
                        mt: 1,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 14 }} />
                      強固なパスワードです
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* パスワード確認 */}
            <TextField
              fullWidth
              label="パスワード確認"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              disabled={isLoading}
              error={showPasswordMismatch}
              helperText={showPasswordMismatch ? 'パスワードが一致しません' : undefined}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 利用規約同意 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  disabled={isLoading}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  <Link href="#" underline="hover">利用規約</Link>
                  および
                  <Link href="#" underline="hover">プライバシーポリシー</Link>
                  に同意します
                </Typography>
              }
            />

            {/* 登録ボタン */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              loading={isLoading}
              disabled={!formData.acceptTerms || !!showPasswordMismatch}
              sx={{ py: spacingTokens.sm }}
            >
              アカウントを作成
            </LoadingButton>
          </Stack>
        </Box>

        {/* ログインリンク */}
        {onSwitchToLogin && (
          <Box sx={{ textAlign: 'center', mt: spacingTokens.lg }}>
            <Typography variant="body2" color="text.secondary">
              既にアカウントをお持ちの方は{' '}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToLogin}
                sx={{ textDecoration: 'none' }}
              >
                ログイン
              </Link>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
