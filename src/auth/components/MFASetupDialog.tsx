/**
 * MFA設定ダイアログコンポーネント
 * TOTP・SMS認証の設定UI
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security as SecurityIcon,
  QrCode2 as QrCodeIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useMFA } from '../hooks/useMFA';
import { spacingTokens } from '../../theme/designSystem';
import type { MfaMethod } from '../types';

// Props型定義
interface MFASetupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// MFA設定ステップ
const SETUP_STEPS = ['認証方法選択', 'セットアップ', '認証コード確認'];

/**
 * MFA設定ダイアログ
 */
export const MFASetupDialog: React.FC<MFASetupDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    isLoading,
    error,
    totpSecret,
    qrCodeUrl,
    setupTOTP,
    verifyTOTP,
    setupSMS,
    verifySMS,
    clearError,
  } = useMFA();

  // ステップ状態
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>('totp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [totpSecretData, setTotpSecretData] = useState<any>(null);

  // ダイアログリセット
  const resetDialog = useCallback(() => {
    setActiveStep(0);
    setSelectedMethod('totp');
    setPhoneNumber('');
    setVerificationCode('');
    setTotpSecretData(null);
    clearError();
  }, [clearError]);

  // ダイアログクローズ
  const handleClose = useCallback(() => {
    resetDialog();
    onClose();
  }, [resetDialog, onClose]);

  // 次のステップ
  const handleNext = useCallback(async () => {
    if (activeStep === 0) {
      // ステップ1: セットアップ開始
      if (selectedMethod === 'totp') {
        const secret = await setupTOTP();
        if (secret) {
          setTotpSecretData(secret);
          setActiveStep(1);
        }
      } else {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      // ステップ2: SMS送信 or TOTP準備完了
      if (selectedMethod === 'sms') {
        if (phoneNumber) {
          const success = await setupSMS(phoneNumber);
          if (success) {
            setActiveStep(2);
          }
        }
      } else {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      // ステップ3: 認証コード検証
      let success = false;
      
      if (selectedMethod === 'totp' && totpSecretData) {
        success = await verifyTOTP(verificationCode, totpSecretData);
      } else if (selectedMethod === 'sms') {
        success = await verifySMS(verificationCode);
      }
      
      if (success) {
        onSuccess?.();
        handleClose();
      }
    }
  }, [
    activeStep,
    selectedMethod,
    phoneNumber,
    verificationCode,
    totpSecretData,
    setupTOTP,
    setupSMS,
    verifyTOTP,
    verifySMS,
    onSuccess,
    handleClose,
  ]);

  // 前のステップ
  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
    clearError();
  }, [clearError]);

  // 電話番号バリデーション
  const isPhoneValid = /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  const isCodeValid = verificationCode.length === 6;

  // ステップ0: 認証方法選択
  const renderMethodSelection = () => (
    <Box>
      <Typography variant="body1" gutterBottom>
        多要素認証（MFA）を設定して、アカウントのセキュリティを強化しましょう。
      </Typography>
      
      <FormControl component="fieldset" sx={{ mt: spacingTokens.lg, width: '100%' }}>
        <FormLabel component="legend">認証方法を選択してください</FormLabel>
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as MfaMethod)}
          sx={{ mt: spacingTokens.md }}
        >
          <FormControlLabel
            value="totp"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <QrCodeIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2">認証アプリ（TOTP）</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Google Authenticator、Authy等のアプリを使用
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ mb: spacingTokens.md, alignItems: 'flex-start' }}
          />
          <FormControlLabel
            value="sms"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <SmsIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2">SMS認証</Typography>
                  <Typography variant="body2" color="text.secondary">
                    携帯電話にショートメッセージで認証コードを送信
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  // ステップ1: セットアップ
  const renderSetup = () => {
    if (selectedMethod === 'totp') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            認証アプリの設定
          </Typography>
          
          {qrCodeUrl ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.md }}>
                認証アプリでQRコードをスキャンしてください
              </Typography>
              
              <Box sx={{ display: 'inline-block', p: spacingTokens.md, bgcolor: 'white', borderRadius: 1 }}>
                {/* QRコード表示エリア - 将来的にQRコード生成ライブラリで実装 */}
                <Box 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <QrCodeIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    QRコード生成中...
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: spacingTokens.md }}>
                QRコードが読み取れない場合は、以下のキーを手動で入力してください：
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={totpSecret || ''}
                multiline
                rows={2}
                slotProps={{
                  input: {
                    readOnly: true,
                    style: { fontFamily: 'monospace', fontSize: '0.875rem' }
                  }
                }}
                sx={{ mt: spacingTokens.sm, maxWidth: 400 }}
              />
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            電話番号の設定
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.md }}>
            SMS認証コードを受信する電話番号を入力してください
          </Typography>
          
          <TextField
            fullWidth
            label="電話番号"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+81901234567"
            helperText="国際電話番号形式（+81で始まる）で入力してください"
            error={phoneNumber !== '' && !isPhoneValid}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      );
    }
  };

  // ステップ2: 認証コード確認
  const renderVerification = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        認証コードの確認
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.md }}>
        {selectedMethod === 'totp' 
          ? '認証アプリに表示された6桁のコードを入力してください'
          : 'SMSで送信された6桁のコードを入力してください'
        }
      </Typography>
      
      <TextField
        fullWidth
        label="認証コード"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="123456"
        error={verificationCode !== '' && !isCodeValid}
        helperText={verificationCode !== '' && !isCodeValid ? '6桁の数字を入力してください' : ''}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SecurityIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );

  // 次へボタンの無効化判定
  const isNextDisabled = () => {
    if (isLoading) return true;
    
    switch (activeStep) {
      case 0:
        return false;
      case 1:
        return selectedMethod === 'sms' && !isPhoneValid;
      case 2:
        return !isCodeValid;
      default:
        return false;
    }
  };

  // ボタンテキスト
  const getNextButtonText = () => {
    switch (activeStep) {
      case 0:
        return '設定を開始';
      case 1:
        return selectedMethod === 'sms' ? 'SMSを送信' : '次へ';
      case 2:
        return '設定を完了';
      default:
        return '次へ';
    }
  };

  return (
    <>
      {/* reCAPTCHA コンテナ */}
      <div id="recaptcha-container" />
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
          <SecurityIcon />
          多要素認証（MFA）の設定
        </DialogTitle>
        
        <DialogContent>
          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={clearError}>
              {error}
            </Alert>
          )}
          
          {/* ステッパー */}
          <Stepper activeStep={activeStep} sx={{ mb: spacingTokens.xl }}>
            {SETUP_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* ステップコンテンツ */}
          {activeStep === 0 && renderMethodSelection()}
          {activeStep === 1 && renderSetup()}
          {activeStep === 2 && renderVerification()}
        </DialogContent>
        
        <DialogActions sx={{ p: spacingTokens.lg, gap: spacingTokens.sm }}>
          <Button onClick={handleClose} disabled={isLoading}>
            キャンセル
          </Button>
          
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isLoading}>
              戻る
            </Button>
          )}
          
          <LoadingButton
            onClick={handleNext}
            loading={isLoading}
            disabled={isNextDisabled()}
            variant="contained"
            startIcon={activeStep === 2 ? <CheckIcon /> : undefined}
          >
            {getNextButtonText()}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
