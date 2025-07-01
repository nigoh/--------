/**
 * MFA管理コンポーネント
 * 設定済みMFAの管理とMFA設定UI
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  QrCode2 as QrCodeIcon,
  Sms as SmsIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { multiFactor } from 'firebase/auth';
import { auth } from '../firebase';
import { MFASetupDialog } from './MFASetupDialog';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import { useAuth } from '../context';

/**
 * MFA管理コンポーネント
 */
export const MFAManagement: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // 状態
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MFA設定取得
  const loadMFAStatus = useCallback(async () => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const factors = multiFactor(auth.currentUser).enrolledFactors;
      setEnrolledFactors(factors);
    } catch (error) {
      console.error('MFA設定取得エラー:', error);
      setError('MFA設定の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    loadMFAStatus();
  }, [loadMFAStatus]);

  // MFA削除
  const handleDeleteMFA = useCallback(async (factorUid: string) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const factor = enrolledFactors.find(f => f.uid === factorUid);
      if (factor) {
        await multiFactor(auth.currentUser).unenroll(factor);
        await loadMFAStatus(); // 再読み込み
      }
    } catch (error) {
      console.error('MFA削除エラー:', error);
      setError('MFA設定の削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [enrolledFactors, loadMFAStatus]);

  // MFA設定成功
  const handleSetupSuccess = useCallback(() => {
    setSetupDialogOpen(false);
    loadMFAStatus(); // 再読み込み
  }, [loadMFAStatus]);

  // ファクタータイプ表示名
  const getFactorDisplayName = (factorId: string) => {
    switch (factorId) {
      case 'totp':
        return '認証アプリ（TOTP）';
      case 'phone':
        return 'SMS認証';
      default:
        return '不明な認証方法';
    }
  };

  // ファクターアイコン
  const getFactorIcon = (factorId: string) => {
    switch (factorId) {
      case 'totp':
        return <QrCodeIcon color="primary" />;
      case 'phone':
        return <SmsIcon color="primary" />;
      default:
        return <SecurityIcon color="primary" />;
    }
  };

  // ファクター説明
  const getFactorDescription = (factorId: string) => {
    switch (factorId) {
      case 'totp':
        return 'Google Authenticator等の認証アプリを使用';
      case 'phone':
        return 'SMS経由で認証コードを受信';
      default:
        return '';
    }
  };

  // MFA有効状態
  const isMFAEnabled = enrolledFactors.length > 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: spacingTokens.xl }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* ヘッダー */}
      <Box sx={{ mb: spacingTokens.xl }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, mb: spacingTokens.md }}>
          <ShieldIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            多要素認証（MFA）
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          アカウントのセキュリティを強化するために、追加の認証方法を設定できます。
        </Typography>
      </Box>

      {/* エラー表示 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: spacingTokens.lg }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* MFA状態表示 */}
      <Card sx={{ mb: spacingTokens.lg, borderRadius: shapeTokens.corner.medium }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, mb: spacingTokens.md }}>
            {isMFAEnabled ? (
              <CheckCircleIcon sx={{ color: 'success.main' }} />
            ) : (
              <WarningIcon sx={{ color: 'warning.main' }} />
            )}
            <Typography variant="h6">
              MFA状態: {isMFAEnabled ? '有効' : '無効'}
            </Typography>
            <Chip
              label={isMFAEnabled ? '保護済み' : '設定推奨'}
              color={isMFAEnabled ? 'success' : 'warning'}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {isMFAEnabled
              ? 'アカウントは多要素認証で保護されています。'
              : 'アカウントのセキュリティを向上させるため、MFAの設定を推奨します。'
            }
          </Typography>
        </CardContent>
      </Card>

      {/* 設定済みMFA一覧 */}
      <Card sx={{ borderRadius: shapeTokens.corner.medium }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: spacingTokens.md }}>
            <Typography variant="h6">
              認証方法
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setSetupDialogOpen(true)}
              disabled={enrolledFactors.length >= 5} // Firebase制限
            >
              追加
            </Button>
          </Box>

          {enrolledFactors.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: spacingTokens.xl }}>
              <SecurityIcon sx={{ fontSize: 64, color: 'text.disabled', mb: spacingTokens.md }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                認証方法が設定されていません
              </Typography>
              <Typography variant="body2" color="text.disabled">
                「追加」ボタンから認証方法を設定してください
              </Typography>
            </Box>
          ) : (
            <List>
              {enrolledFactors.map((factor, index) => (
                <React.Fragment key={factor.uid}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getFactorIcon(factor.factorId)}
                    </ListItemIcon>
                    <ListItemText
                      primary={getFactorDisplayName(factor.factorId)}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {getFactorDescription(factor.factorId)}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            登録日: {new Date(factor.enrollmentTime).toLocaleDateString('ja-JP')}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteMFA(factor.uid)}
                        disabled={isLoading}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < enrolledFactors.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {/* 制限情報 */}
          {enrolledFactors.length > 0 && (
            <Box sx={{ mt: spacingTokens.md, p: spacingTokens.md, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                最大5個まで認証方法を設定できます。（現在: {enrolledFactors.length}/5）
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* MFA設定ダイアログ */}
      <MFASetupDialog
        open={setupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        onSuccess={handleSetupSuccess}
      />
    </Box>
  );
};
