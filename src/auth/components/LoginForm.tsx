/**
 * ログインフォームコンポーネント
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
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  Fingerprint as FingerprintIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useLogin } from '../hooks/useLogin';
import { isPasskeySupported, checkBiometricAvailability } from '../passkey';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import { MFAVerificationDialog } from './MFAVerificationDialog';
import type { LoginFormData } from '../types';

// Props型定義
interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

/**
 * ログインフォームコンポーネント
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword,
  onLoginSuccess,
}) => {
  const theme = useTheme();
  const { 
    isLoading, 
    error, 
    mfaResolver,
    loginWithEmail, 
    loginWithGoogle, 
    clearError,
    clearMfaResolver
  } = useLogin();

  // フォーム状態
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI状態
  const [showPassword, setShowPassword] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  // パスキー対応確認
  React.useEffect(() => {
    const checkPasskeySupport = async () => {
      const supported = isPasskeySupported();
      setPasskeySupported(supported);

      if (supported) {
        const biometric = await checkBiometricAvailability();
        if (biometric.available && biometric.biometricType) {
          setBiometricType(biometric.biometricType);
        }
      }
    };

    checkPasskeySupport();
  }, []);

  // フォーム入力ハンドラー
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  }, [error, clearError]);

  // メール・パスワードログイン
  const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await loginWithEmail(formData);
    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [formData, loginWithEmail, onLoginSuccess]);

  // Googleログイン
  const handleGoogleLogin = useCallback(async () => {
    const success = await loginWithGoogle();
    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [loginWithGoogle, onLoginSuccess]);

  // パスキーログイン（今後実装）
  const handlePasskeyLogin = useCallback(async () => {
    console.log('パスキーログイン（未実装）');
    // TODO: パスキー認証の実装
  }, []);

  return (
    <Box>
      <Card
        elevation={2}
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: shapeTokens.corner.large,
        }}
      >
      <CardContent sx={{ p: spacingTokens.xl }}>
        {/* ヘッダー */}
        <Box sx={{ textAlign: 'center', mb: spacingTokens.lg }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ログイン
          </Typography>
          <Typography variant="body2" color="text.secondary">
            アカウントにサインインしてください
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: spacingTokens.md }}>
            {error}
          </Alert>
        )}

        {/* メール・パスワードフォーム */}
        <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: spacingTokens.lg }}>
          <Stack spacing={spacingTokens.md}>
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label="ログイン状態を保持"
              />
              
              {onForgotPassword && (
                <Link
                  component="button"
                  type="button"
                  onClick={onForgotPassword}
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  パスワードを忘れた方
                </Link>
              )}
            </Box>

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              loading={isLoading}
              sx={{ py: spacingTokens.sm }}
            >
              ログイン
            </LoadingButton>
          </Stack>
        </Box>

        {/* ソーシャルログイン */}
        <Box>
          <Divider sx={{ my: spacingTokens.lg }}>
            <Typography variant="body2" color="text.secondary">
              または
            </Typography>
          </Divider>

          <Stack spacing={spacingTokens.sm}>
            {/* Googleログイン */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              startIcon={<GoogleIcon />}
              sx={{ py: spacingTokens.sm }}
            >
              Googleでログイン
            </Button>

            {/* パスキーログイン */}
            {passkeySupported && (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handlePasskeyLogin}
                disabled={isLoading}
                startIcon={<FingerprintIcon />}
                sx={{ py: spacingTokens.sm }}
              >
                {biometricType ? `${biometricType}でログイン` : 'パスキーでログイン'}
              </Button>
            )}
          </Stack>
        </Box>

        {/* 新規登録リンク */}
        {onSwitchToRegister && (
          <Box sx={{ textAlign: 'center', mt: spacingTokens.lg }}>
            <Typography variant="body2" color="text.secondary">
              アカウントをお持ちでない方は{' '}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToRegister}
                sx={{ textDecoration: 'none' }}
              >
                新規登録
              </Link>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>

    {/* MFA検証ダイアログ */}
    <MFAVerificationDialog
      open={!!mfaResolver}
      resolver={mfaResolver}
      onSuccess={() => {
        clearMfaResolver();
        onLoginSuccess?.();
      }}
      onCancel={() => {
        clearMfaResolver();
      }}
    />
  </Box>
);
};
