/**
 * RegisterForm Component
 * ユーザー登録フォームコンポーネント
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
} from '@mui/icons-material';
import { useRegister } from '../hooks/useRegister';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    email,
    password,
    confirmPassword,
    displayName,
    acceptTerms,
    errors,
    loading,
    error,
    passwordStrength,
    setEmail,
    setPassword,
    setConfirmPassword,
    setDisplayName,
    setAcceptTerms,
    handleSubmit,
  } = useRegister();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // パスワード強度の色を取得
  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return theme.palette.error.main;
    if (score <= 2) return theme.palette.warning.main;
    if (score <= 3) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  // パスワード強度のラベルを取得
  const getPasswordStrengthLabel = (score: number) => {
    if (score <= 1) return '弱い';
    if (score <= 2) return '普通';
    if (score <= 3) return '良い';
    return '強い';
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* エラー表示 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: isHighContrast ? 0 : 1,
          }}
        >
          {error}
        </Alert>
      )}

      {/* 表示名 */}
      <TextField
        fullWidth
        type="text"
        label="表示名"
        placeholder="山田 太郎"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={!!errors.displayName}
        helperText={errors.displayName || '表示名は任意です'}
        margin="normal"
        autoComplete="name"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: isHighContrast ? 0 : 1,
          },
        }}
      />

      {/* メールアドレス */}
      <TextField
        fullWidth
        type="email"
        label="メールアドレス *"
        placeholder="example@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        autoComplete="email"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: isHighContrast ? 0 : 1,
          },
        }}
      />

      {/* パスワード */}
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="パスワード *"
        placeholder="8文字以上の英数字"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        autoComplete="new-password"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handlePasswordVisibility}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                aria-label="パスワードの表示切替"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: isHighContrast ? 0 : 1,
          },
        }}
      />

      {/* パスワード強度インジケーター */}
      {password && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              パスワード強度:
            </Typography>
            <Chip
              label={getPasswordStrengthLabel(passwordStrength.score)}
              size="small"
              sx={{
                backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={(passwordStrength.score / 4) * 100}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                backgroundColor: getPasswordStrengthColor(passwordStrength.score),
              },
            }}
          />
          
          {passwordStrength.feedback.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {passwordStrength.feedback.map((feedback, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', fontSize: '0.75rem' }}
                >
                  • {feedback}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* パスワード確認 */}
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        label="パスワード確認 *"
        placeholder="パスワードを再入力"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        margin="normal"
        autoComplete="new-password"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleConfirmPasswordVisibility}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                aria-label="確認パスワードの表示切替"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: isHighContrast ? 0 : 1,
          },
        }}
      />

      {/* 利用規約同意 */}
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            <Link href="#" underline="hover">
              利用規約
            </Link>
            と
            <Link href="#" underline="hover">
              プライバシーポリシー
            </Link>
            に同意します *
          </Typography>
        }
        sx={{ mt: 2, mb: 1, alignItems: 'flex-start' }}
      />
      
      {errors.acceptTerms && (
        <Typography variant="caption" color="error.main" sx={{ ml: 4 }}>
          {errors.acceptTerms}
        </Typography>
      )}

      {/* 登録ボタン */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<PersonAdd />}
        sx={{
          py: 1.5,
          mt: 3,
          mb: 3,
          borderRadius: isHighContrast ? 0 : 2,
          fontWeight: 600,
        }}
      >
        {loading ? 'アカウント作成中...' : 'アカウントを作成'}
      </Button>

      {/* ログインリンク */}
      {onSwitchToLogin && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            既にアカウントをお持ちの方は{' '}
            <Link
              component="button"
              type="button"
              onClick={onSwitchToLogin}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              ログイン
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
};