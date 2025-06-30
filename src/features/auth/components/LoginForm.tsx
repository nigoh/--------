/**
 * LoginForm Component
 * ログインフォームコンポーネント
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
  Divider,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useLogin } from '../hooks/useLogin';
import { SocialButtons } from './SocialButtons';
import { PasskeyButton } from './PasskeyButton';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    email,
    password,
    rememberMe,
    errors,
    loading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    handleSubmit,
  } = useLogin();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      {/* メールアドレス */}
      <TextField
        fullWidth
        type="email"
        label="メールアドレス"
        placeholder="example@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        autoComplete="email"
        autoFocus
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
        label="パスワード"
        placeholder="パスワードを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        autoComplete="current-password"
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

      {/* オプション */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="ログイン状態を保持"
        />
        
        {onForgotPassword && (
          <Link
            component="button"
            type="button"
            onClick={onForgotPassword}
            underline="hover"
            sx={{ fontSize: '0.875rem' }}
          >
            パスワードを忘れた場合
          </Link>
        )}
      </Box>

      {/* ログインボタン */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={<LoginIcon />}
        sx={{
          py: 1.5,
          mb: 3,
          borderRadius: isHighContrast ? 0 : 2,
          fontWeight: 600,
        }}
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </Button>

      {/* ソーシャルログイン */}
      <Box sx={{ mb: 3 }}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            または
          </Typography>
        </Divider>
        <SocialButtons loading={loading} />
        
        {/* パスキーログイン */}
        <Box sx={{ mt: 2 }}>
          <PasskeyButton
            mode="login"
            loading={loading}
            onSuccess={(credential) => {
              console.log('Passkey login success:', credential);
              // TODO: パスキー認証の後続処理
            }}
            onError={(error) => {
              console.error('Passkey login error:', error);
            }}
          />
        </Box>
      </Box>

      {/* 新規登録リンク */}
      {onSwitchToRegister && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            アカウントをお持ちでない方は{' '}
            <Link
              component="button"
              type="button"
              onClick={onSwitchToRegister}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              新規登録
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
};