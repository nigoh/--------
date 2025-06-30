/**
 * OtpInput Component
 * ワンタイムパスワード入力コンポーネント
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { Security, Refresh } from '@mui/icons-material';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface OtpInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  canResend?: boolean;
  resendCooldown?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  loading = false,
  error,
  title = '認証コードを入力',
  subtitle = '認証アプリまたはSMSで受信したコードを入力してください',
  canResend = true,
  resendCooldown = 60,
}) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // リセンドタイマー
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // 数字のみ許可
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1); // 最後の1文字のみ
    setValues(newValues);

    // 次の入力欄にフォーカス
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 完了時のコールバック
    const code = newValues.join('');
    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // 前の入力欄にフォーカス
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits.length > 0) {
      const newValues = Array(length).fill('');
      for (let i = 0; i < digits.length; i++) {
        newValues[i] = digits[i];
      }
      setValues(newValues);
      
      // 最後の入力欄またはペーストしたデータの次の欄にフォーカス
      const focusIndex = Math.min(digits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      // 完了時のコールバック
      if (digits.length === length && onComplete) {
        onComplete(digits);
      }
    }
  };

  const handleResend = () => {
    if (onResend && resendTimer === 0) {
      onResend();
      setResendTimer(resendCooldown);
    }
  };

  const clearCode = () => {
    setValues(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 400, mx: 'auto' }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: isHighContrast ? 0 : '50%',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Security />
        </Box>
        
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

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

      {/* OTP入力欄 */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          mb: 3,
        }}
        onPaste={handlePaste}
      >
        {values.map((value, index) => (
          <TextField
            key={index}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                width: 40,
                height: 40,
                padding: 0,
              },
            }}
            sx={{
              width: 48,
              '& .MuiOutlinedInput-root': {
                borderRadius: isHighContrast ? 0 : 1,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                },
              },
            }}
          />
        ))}
      </Box>

      {/* アクションボタン */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={clearCode}
          disabled={loading || values.every(v => !v)}
          sx={{
            borderRadius: isHighContrast ? 0 : 1,
          }}
        >
          クリア
        </Button>

        {canResend && (
          <Button
            variant="text"
            onClick={handleResend}
            disabled={loading || resendTimer > 0}
            startIcon={<Refresh />}
            sx={{
              borderRadius: isHighContrast ? 0 : 1,
            }}
          >
            {resendTimer > 0 ? `${resendTimer}秒後に再送信` : 'コードを再送信'}
          </Button>
        )}
      </Box>

      {/* ヘルプテキスト */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: 'block' }}
      >
        コードが届かない場合は、迷惑メールフォルダをご確認ください
      </Typography>
    </Box>
  );
};