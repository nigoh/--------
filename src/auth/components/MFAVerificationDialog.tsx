/**
 * MFA認証ダイアログコンポーネント
 * ログイン時のMFA検証UI
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  InputAdornment,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  QrCode2 as QrCodeIcon,
  Sms as SmsIcon,
  Check as CheckIcon,
  Fingerprint as FingerprintIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useMFA } from '../hooks/useMFA';
import { useWebAuthn } from '../hooks/useWebAuthn';
import { useBackupCodes } from '../hooks/useBackupCodes';
import { spacingTokens } from '../../theme/designSystem';
import type { MfaMethod } from '../types';
import type { MultiFactorResolver } from 'firebase/auth';

// Props型定義
interface MFAVerificationDialogProps {
  open: boolean;
  resolver: MultiFactorResolver | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * MFA認証ダイアログ
 */
export const MFAVerificationDialog: React.FC<MFAVerificationDialogProps> = ({
  open,
  resolver,
  onSuccess,
  onCancel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    isLoading,
    error,
    resolveMFAChallenge,
    clearError,
  } = useMFA();

  // WebAuthn機能
  const {
    isLoading: isWebAuthnLoading,
    error: webAuthnError,
    verifyWebAuthnMFA,
    clearError: clearWebAuthnError,
  } = useWebAuthn();

  // バックアップコード機能
  const {
    isLoading: isBackupLoading,
    error: backupError,
    verifyBackupCode,
    clearError: clearBackupError,
  } = useBackupCodes();

  // 状態
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  // ローディング状態の統合
  const isAnyLoading = isLoading || isWebAuthnLoading || isBackupLoading;

  // 利用可能なMFA方法を取得
  const availableMethods = resolver?.hints || [];

  // 方法選択
  const handleMethodSelect = useCallback((method: MfaMethod) => {
    setSelectedMethod(method);
    clearError();
    clearWebAuthnError();
    clearBackupError();
  }, [clearError, clearWebAuthnError, clearBackupError]);

  // 認証コード検証
  const handleVerify = useCallback(async () => {
    if (!resolver || !selectedMethod) return;

    let success = false;

    if (selectedMethod === 'webauthn') {
      // WebAuthn認証
      success = await verifyWebAuthnMFA('challenge-from-server');
    } else if (selectedMethod === 'backup-code') {
      // バックアップコード認証
      success = await verifyBackupCode(verificationCode);
    } else if (verificationCode) {
      // TOTP/SMS認証
      success = await resolveMFAChallenge(resolver, verificationCode, selectedMethod);
    }

    if (success) {
      onSuccess();
    }
  }, [resolver, selectedMethod, verificationCode, resolveMFAChallenge, verifyWebAuthnMFA, verifyBackupCode, onSuccess]);

  // リセット
  const resetState = useCallback(() => {
    setSelectedMethod(null);
    setVerificationCode('');
    clearError();
    clearWebAuthnError();
    clearBackupError();
  }, [clearError, clearWebAuthnError, clearBackupError]);

  // ダイアログが閉じられたときのリセット
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  // 認証コードバリデーション
  const isCodeValid = selectedMethod === 'webauthn' || verificationCode.length === 6;

  // メソッド表示名
  const getMethodDisplayName = (factorId: string) => {
    switch (factorId) {
      case 'totp':
        return '認証アプリ（TOTP）';
      case 'phone':
        return 'SMS認証';
      case 'webauthn':
        return '生体認証・セキュリティキー';
      case 'backup-code':
        return 'バックアップコード';
      default:
        return '不明な認証方法';
    }
  };

  // メソッドアイコン
  const getMethodIcon = (factorId: string) => {
    switch (factorId) {
      case 'totp':
        return <QrCodeIcon />;
      case 'phone':
        return <SmsIcon />;
      case 'webauthn':
        return <FingerprintIcon />;
      case 'backup-code':
        return <BackupIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  // メソッド説明
  const getMethodDescription = (method: MfaMethod) => {
    switch (method) {
      case 'totp':
        return '認証アプリに表示されている6桁のコードを入力してください';
      case 'sms':
        return 'お客様の携帯電話に送信されたSMSの6桁のコードを入力してください';
      default:
        return '認証コードを入力してください';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
        <SecurityIcon />
        多要素認証
      </DialogTitle>
      
      <DialogContent>
        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {!selectedMethod ? (
          // メソッド選択画面
          <Box>
            <Typography variant="body1" gutterBottom>
              アカウントのセキュリティ保護のため、追加の認証が必要です。
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
              以下の認証方法から一つを選択してください：
            </Typography>

            <List>
              {availableMethods.map((hint, index) => {
                const factorId = hint.factorId;
                const method = factorId === 'totp' ? 'totp' : 'sms';
                
                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleMethodSelect(method)}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: spacingTokens.sm,
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {getMethodIcon(factorId)}
                      </ListItemIcon>
                      <ListItemText
                        primary={getMethodDisplayName(factorId)}
                        secondary={
                          factorId === 'phone' 
                            ? '登録済みの電話番号に認証コードを送信'
                            : '認証アプリからコードを取得'
                        }
                      />
                      <Chip
                        label="使用する"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ) : (
          // 認証コード入力画面
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, mb: spacingTokens.md }}>
              {getMethodIcon(selectedMethod)}
              <Typography variant="h6">
                {getMethodDisplayName(selectedMethod)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
              {getMethodDescription(selectedMethod)}
            </Typography>

            <TextField
              fullWidth
              label="認証コード"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              error={verificationCode !== '' && !isCodeValid}
              helperText={
                verificationCode !== '' && !isCodeValid 
                  ? '6桁の数字を入力してください' 
                  : '6桁の認証コードを入力してください'
              }
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityIcon />
                    </InputAdornment>
                  ),
                  style: { textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem' }
                },
              }}
            />

            {/* 別の方法を選択 */}
            <Box sx={{ textAlign: 'center', mt: spacingTokens.lg }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setSelectedMethod(null)}
              >
                別の認証方法を選択
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: spacingTokens.lg, gap: spacingTokens.sm }}>
        <LoadingButton
          onClick={onCancel}
          disabled={isLoading}
          variant="outlined"
        >
          キャンセル
        </LoadingButton>
        
        {selectedMethod && (
          <LoadingButton
            onClick={handleVerify}
            loading={isLoading}
            disabled={!isCodeValid}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            認証する
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
