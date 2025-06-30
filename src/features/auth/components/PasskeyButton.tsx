/**
 * PasskeyButton Component
 * パスキー認証ボタンコンポーネント
 */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { Fingerprint, Security } from '@mui/icons-material';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { 
  isPlatformAuthenticatorAvailable,
  authenticateWithPasskey,
  createPasskey,
} from '../services/passkeyService';
import { isPasskeySupported } from '../utils/authUtils';

interface PasskeyButtonProps {
  mode: 'login' | 'register';
  onSuccess?: (credential: any) => void;
  onError?: (error: Error) => void;
  loading?: boolean;
  disabled?: boolean;
  userId?: string;
  userName?: string;
  userDisplayName?: string;
}

export const PasskeyButton: React.FC<PasskeyButtonProps> = ({
  mode,
  onSuccess,
  onError,
  loading = false,
  disabled = false,
  userId = '',
  userName = '',
  userDisplayName = '',
}) => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // パスキーサポート状況をチェック
  useEffect(() => {
    const checkSupport = async () => {
      const supported = isPasskeySupported();
      setIsSupported(supported);
      
      if (supported) {
        const platformAvailable = await isPlatformAuthenticatorAvailable();
        setIsPlatformAvailable(platformAvailable);
      }
    };

    checkSupport();
  }, []);

  const handlePasskeyAction = async () => {
    if (!isSupported || isProcessing || loading || disabled) {
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === 'register') {
        // パスキー登録
        if (!userId || !userName) {
          throw new Error('User information is required for registration');
        }

        const credential = await createPasskey(
          userId,
          userName,
          userDisplayName || userName
        );
        onSuccess?.(credential);
      } else {
        // パスキー認証
        const credential = await authenticateWithPasskey();
        onSuccess?.(credential);
      }
    } catch (error) {
      console.error('Passkey operation error:', error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  // サポートされていない場合は表示しない
  if (!isSupported) {
    return null;
  }

  const buttonText = (() => {
    if (isProcessing) {
      return mode === 'register' ? 'パスキーを作成中...' : 'パスキー認証中...';
    }
    return mode === 'register' ? 'パスキーを作成' : 'パスキーでログイン';
  })();

  const buttonIcon = isPlatformAvailable ? <Fingerprint /> : <Security />;

  return (
    <Box>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled={loading || disabled || isProcessing}
        onClick={handlePasskeyAction}
        startIcon={buttonIcon}
        sx={{
          py: 1.5,
          borderRadius: isHighContrast ? 0 : 2,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          fontWeight: 500,
          '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: `${theme.palette.primary.main}0A`,
          },
          '&:disabled': {
            borderColor: theme.palette.action.disabled,
            color: theme.palette.action.disabled,
          },
        }}
      >
        {buttonText}
      </Button>

      {/* パスキーについての説明 */}
      {mode === 'register' && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          {isPlatformAvailable
            ? '生体認証または画面ロックでログインできます'
            : 'セキュリティキーまたは認証器が必要です'}
        </Typography>
      )}
    </Box>
  );
};