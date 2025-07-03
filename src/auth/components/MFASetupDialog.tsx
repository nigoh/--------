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
  Fingerprint as FingerprintIcon,
  Key as KeyIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useMFA } from '../hooks/useMFA';
import { useWebAuthn } from '../hooks/useWebAuthn';
import { useBackupCodes } from '../hooks/useBackupCodes';
import { useEmailVerification } from '../hooks/useEmailVerification';
import { auth } from '../firebase';
import { spacingTokens } from '../../theme/designSystem';
import type { MfaMethod, WebAuthnAuthenticatorType } from '../types';
import QRCode from 'qrcode';

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

  // メールアドレス確認機能
  const {
    isLoading: isEmailLoading,
    error: emailError,
    sendVerificationEmail,
    checkEmailVerified,
    clearError: clearEmailError,
  } = useEmailVerification();

  // WebAuthn機能
  const {
    isLoading: isWebAuthnLoading,
    error: webAuthnError,
    isSupported: isWebAuthnSupported,
    availableAuthenticators,
    checkSupport: checkWebAuthnSupport,
    setupWebAuthnMFA,
    clearError: clearWebAuthnError,
  } = useWebAuthn();

  // バックアップコード機能
  const {
    isLoading: isBackupLoading,
    error: backupError,
    generateBackupCodes,
    downloadBackupCodes,
    clearError: clearBackupError,
  } = useBackupCodes();

  // ステップ状態
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>('totp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [totpSecretData, setTotpSecretData] = useState<any>(null);
  const [selectedAuthenticatorType, setSelectedAuthenticatorType] = useState<WebAuthnAuthenticatorType>('cross-platform');
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<any[]>([]);

  // ダイアログリセット
  const resetDialog = useCallback(() => {
    setActiveStep(0);
    setSelectedMethod('totp');
    setPhoneNumber('');
    setVerificationCode('');
    setTotpSecretData(null);
    setSelectedAuthenticatorType('cross-platform');
    setGeneratedBackupCodes([]);
    clearError();
    clearWebAuthnError();
    clearBackupError();
  }, [clearError, clearWebAuthnError, clearBackupError]);

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
      } else if (selectedMethod === 'webauthn') {
        setActiveStep(1);
      } else if (selectedMethod === 'backup-code') {
        setActiveStep(1);
      } else {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      // ステップ2: SMS送信 or TOTP準備完了 or WebAuthn設定 or バックアップコード生成
      if (selectedMethod === 'sms') {
        if (phoneNumber) {
          const success = await setupSMS(phoneNumber);
          if (success) {
            setActiveStep(2);
          }
        }
      } else if (selectedMethod === 'webauthn') {
        const success = await setupWebAuthnMFA(selectedAuthenticatorType);
        if (success) {
          onSuccess?.();
          handleClose();
        }
      } else if (selectedMethod === 'backup-code') {
        const codes = await generateBackupCodes();
        if (codes.length > 0) {
          setGeneratedBackupCodes(codes);
          setActiveStep(2);
        }
      } else {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      // ステップ3: 認証コード検証 or バックアップコード完了
      let success = false;
      
      if (selectedMethod === 'totp' && totpSecretData) {
        success = await verifyTOTP(verificationCode, totpSecretData);
      } else if (selectedMethod === 'sms') {
        success = await verifySMS(verificationCode);
      } else if (selectedMethod === 'backup-code') {
        // バックアップコードは生成のみで完了
        success = true;
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
    selectedAuthenticatorType,
    setupTOTP,
    setupSMS,
    verifyTOTP,
    verifySMS,
    setupWebAuthnMFA,
    generateBackupCodes,
    onSuccess,
    handleClose,
  ]);

  // 前のステップ
  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
    clearError();
    clearWebAuthnError();
    clearBackupError();
  }, [clearError, clearWebAuthnError, clearBackupError]);

  // ローディング状態の統合
  const isAnyLoading = isLoading || isWebAuthnLoading || isBackupLoading;

  // 電話番号バリデーション
  const isPhoneValid = /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  const isCodeValid = verificationCode.length === 6;

  // WebAuthn初期化
  useEffect(() => {
    if (open && selectedMethod === 'webauthn') {
      checkWebAuthnSupport();
    }
  }, [open, selectedMethod, checkWebAuthnSupport]);

  // QRコード生成
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  useEffect(() => {
    if (qrCodeUrl) {
      QRCode.toDataURL(qrCodeUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeDataUrl).catch(console.error);
    }
  }, [qrCodeUrl]);

  // ステップ0: 認証方法選択
  const renderMethodSelection = () => (
    <Box>
      <Typography variant="body1" gutterBottom>
        多要素認証（MFA）を設定して、アカウントのセキュリティを強化しましょう。
      </Typography>
      
      <FormControl component="fieldset" sx={{ mt: spacingTokens.md, width: '100%' }}>
        <FormLabel component="legend">認証方法を選択してください</FormLabel>
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as MfaMethod)}
          sx={{ mt: spacingTokens.lg }}
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
            sx={{ mb: spacingTokens.sm, alignItems: 'flex-start' }}
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
            sx={{ mb: spacingTokens.sm, alignItems: 'flex-start' }}
          />
          <FormControlLabel
            value="webauthn"
            control={<Radio />}
            disabled={!isWebAuthnSupported}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <FingerprintIcon color={isWebAuthnSupported ? "primary" : "disabled"} />
                <Box>
                  <Typography variant="subtitle2" color={isWebAuthnSupported ? "textPrimary" : "textSecondary"}>
                    生体認証・セキュリティキー
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isWebAuthnSupported 
                      ? '指紋・顔認証やYubiKey等のハードウェアキーを使用'
                      : 'お使いのデバイスではサポートされていません'
                    }
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ mb: spacingTokens.sm, alignItems: 'flex-start' }}
          />
          <FormControlLabel
            value="backup-code"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <BackupIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2">バックアップコード</Typography>
                  <Typography variant="body2" color="text.secondary">
                    緊急時アクセス用のワンタイムコードを生成
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
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="TOTP QR Code" 
                    style={{ display: 'block', width: 200, height: 200 }}
                  />
                ) : (
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
                )}
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
    } else if (selectedMethod === 'webauthn') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            生体認証・セキュリティキーの設定
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
            指紋認証、顔認証、またはYubiKeyなどのセキュリティキーを設定します。
          </Typography>

          <Box sx={{ mb: spacingTokens.lg }}>
            <Typography variant="subtitle2" gutterBottom>
              認証器の種類を選択してください：
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                value={selectedAuthenticatorType}
                onChange={(e) => setSelectedAuthenticatorType(e.target.value as WebAuthnAuthenticatorType)}
              >
                {availableAuthenticators.includes('platform') && (
                  <FormControlLabel
                    value="platform"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                        <FingerprintIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2">内蔵認証器</Typography>
                          <Typography variant="body2" color="text.secondary">
                            指紋認証・顔認証など
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                )}
                
                <FormControlLabel
                  value="cross-platform"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                      <KeyIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2">外部セキュリティキー</Typography>
                        <Typography variant="body2" color="text.secondary">
                          YubiKey・FIDO2キーなど
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Typography variant="body2" color="text.secondary">
            「次へ」をクリックすると、選択した認証器での設定が開始されます。
          </Typography>
        </Box>
      );
    } else if (selectedMethod === 'backup-code') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            バックアップコードの生成
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
            緊急時アクセス用のワンタイムコードを生成します。
          </Typography>

          <Alert severity="info" sx={{ mb: spacingTokens.lg, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>バックアップコードについて：</strong>
            </Typography>
            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
              • 10個のワンタイムコードが生成されます<br />
              • 各コードは一度だけ使用できます<br />
              • 認証アプリやSMSが使えない時の緊急手段です<br />
              • 安全な場所に保管してください
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary">
            「次へ」をクリックしてバックアップコードを生成します。
          </Typography>
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
  const renderVerification = () => {
    if (selectedMethod === 'backup-code') {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            バックアップコード
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
            以下のバックアップコードを安全な場所に保管してください。
          </Typography>

          <Alert severity="warning" sx={{ mb: spacingTokens.lg }}>
            <Typography variant="body2">
              <strong>重要:</strong> これらのコードは一度だけ表示されます。
              必ずダウンロードまたは印刷して安全な場所に保管してください。
            </Typography>
          </Alert>

          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: spacingTokens.lg, 
            borderRadius: 1,
            mb: spacingTokens.lg,
            fontFamily: 'monospace'
          }}>
            {generatedBackupCodes.map((code, index) => (
              <Typography key={code.id} variant="body1" sx={{ mb: 0.5 }}>
                {index + 1}. {code.code}
              </Typography>
            ))}
          </Box>

          <Button
            variant="outlined"
            onClick={() => downloadBackupCodes(generatedBackupCodes)}
            startIcon={<BackupIcon />}
            fullWidth
            sx={{ mb: spacingTokens.md }}
          >
            PDFでダウンロード
          </Button>

          <Typography variant="caption" color="text.secondary">
            コードを保存したら「設定を完了」をクリックしてください。
          </Typography>
        </Box>
      );
    }

    return (
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
  };

  // 次へボタンの無効化判定
  const isNextDisabled = () => {
    if (isAnyLoading) return true;
    
    switch (activeStep) {
      case 0:
        return false;
      case 1:
        return selectedMethod === 'sms' && !isPhoneValid;
      case 2:
        if (selectedMethod === 'backup-code') return false;
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
          {/* メールアドレス確認警告とアクション */}
          {!auth.currentUser?.emailVerified && (
            <Alert severity="warning" sx={{ mb: spacingTokens.lg }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2">
                  MFAを使用するにはメールアドレスの確認が必要です
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LoadingButton
                    size="small"
                    variant="contained"
                    loading={isEmailLoading}
                    onClick={sendVerificationEmail}
                    sx={{ minWidth: 'auto' }}
                  >
                    確認メール送信
                  </LoadingButton>
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    loading={isEmailLoading}
                    onClick={async () => {
                      const isVerified = await checkEmailVerified();
                      if (isVerified) {
                        clearEmailError();
                        // UI更新のために少し待つ
                        setTimeout(() => window.location.reload(), 1000);
                      }
                    }}
                    sx={{ minWidth: 'auto' }}
                  >
                    確認状態をチェック
                  </LoadingButton>
                </Box>
              </Box>
              {emailError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {emailError}
                </Typography>
              )}
            </Alert>
          )}

          {/* エラー表示 */}
          {(error || webAuthnError || backupError) && (
            <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={() => {
              clearError();
              clearWebAuthnError();
              clearBackupError();
            }}>
              {error || webAuthnError || backupError}
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
          <Button onClick={handleClose} disabled={isAnyLoading}>
            キャンセル
          </Button>
          
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isAnyLoading}>
              戻る
            </Button>
          )}
          
          <LoadingButton
            onClick={handleNext}
            loading={isAnyLoading}
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
