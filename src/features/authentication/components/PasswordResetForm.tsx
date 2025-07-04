/**
 * パスワード再設定フォームコンポーネント
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
  InputAdornment,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useLogin } from '../../../auth/hooks/useLogin';
import { spacingTokens, shapeTokens } from '../../../theme/designSystem';
import type { ResetPasswordFormData } from '../../../auth/types';

// Props型定義
interface PasswordResetFormProps {
  onSwitchToLogin?: () => void;
  onResetSuccess?: (email: string) => void;
}

/**
 * パスワード再設定フォームコンポーネント
 */
export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSwitchToLogin,
  onResetSuccess,
}) => {
  const theme = useTheme();
  const { resetPassword, isLoading, error, clearError } = useLogin();

  // フォーム状態
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
  });

  // バリデーション状態
  const [emailError, setEmailError] = useState<string>('');

  // メール形式の検証
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('正しいメールアドレス形式で入力してください');
      return false;
    }
    setEmailError('');
    return true;
  }, []);

  // フォーム入力ハンドラー
  const handleEmailChange = useCallback((value: string) => {
    setFormData({ email: value });
    if (error) clearError();
    if (emailError && value) {
      validateEmail(value);
    }
  }, [error, clearError, emailError, validateEmail]);

  // パスワード再設定処理
  const handlePasswordReset = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!validateEmail(formData.email)) {
      return;
    }

    try {
      await resetPassword(formData.email);
      if (onResetSuccess) {
        onResetSuccess(formData.email);
      }
    } catch (error) {
      console.error('パスワード再設定エラー:', error);
    }
  }, [formData.email, resetPassword, validateEmail, onResetSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Card
        elevation={2}
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: shapeTokens.corner.large,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.85)' 
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: spacingTokens.md }}>
          {/* ヘッダー */}
          <Box sx={{ textAlign: 'center', mb: spacingTokens.md }}>
            <Typography variant="h4" component="h1" gutterBottom>
              パスワード再設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              登録済みのメールアドレスに再設定用のリンクをお送りします
            </Typography>
          </Box>

          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: spacingTokens.md }}>
              {error}
            </Alert>
          )}

          {/* パスワード再設定フォーム */}
          <Box component="form" onSubmit={handlePasswordReset} sx={{ mb: spacingTokens.md }}>
            <Stack spacing={spacingTokens.md}>
              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => validateEmail(formData.email)}
                error={!!emailError}
                helperText={emailError}
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

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isLoading}
                startIcon={<SendIcon />}
                sx={{ py: spacingTokens.sm }}
              >
                再設定メールを送信
              </LoadingButton>
            </Stack>
          </Box>

          {/* 戻るリンク */}
          {onSwitchToLogin && (
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                type="button"
                onClick={onSwitchToLogin}
                sx={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <ArrowBackIcon fontSize="small" />
                ログイン画面に戻る
              </Link>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
