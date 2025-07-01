/**
 * パスキー管理コンポーネント
 * パスキーの登録・削除・管理機能
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  DeviceUnknown as DeviceIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { 
  isPasskeySupported, 
  checkBiometricAvailability,
  registerPasskey,
  type PasskeyRegistrationData 
} from '../passkey';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import { useAuthStore } from '../stores/useAuthStore';

// パスキー情報の型定義
interface PasskeyInfo {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
  deviceType: string;
}

// Props型定義
interface PasskeyManagementProps {
  onPasskeyAdded?: () => void;
  onPasskeyRemoved?: () => void;
}

/**
 * パスキー管理コンポーネント
 */
export const PasskeyManagement: React.FC<PasskeyManagementProps> = ({
  onPasskeyAdded,
  onPasskeyRemoved,
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();

  // 状態
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 初期化
  useEffect(() => {
    const checkSupport = async () => {
      const supported = isPasskeySupported();
      setIsSupported(supported);

      if (supported) {
        const biometric = await checkBiometricAvailability();
        if (biometric.available && biometric.biometricType) {
          setBiometricType(biometric.biometricType);
        }
      }
    };

    checkSupport();
    loadPasskeys();
  }, []);

  // パスキー一覧読み込み（モック）
  const loadPasskeys = useCallback(() => {
    // 実際の実装では、サーバーから登録済みパスキー一覧を取得
    const mockPasskeys: PasskeyInfo[] = [
      {
        id: 'passkey-1',
        name: 'Windows Hello (PC)',
        createdAt: '2025-01-15T10:30:00Z',
        lastUsed: '2025-07-01T14:20:00Z',
        deviceType: 'Windows',
      },
      {
        id: 'passkey-2', 
        name: 'Touch ID (iPhone)',
        createdAt: '2025-02-20T15:45:00Z',
        lastUsed: null,
        deviceType: 'iOS',
      },
    ];
    
    setPasskeys(mockPasskeys);
  }, []);

  // パスキー登録
  const handleAddPasskey = useCallback(async () => {
    if (!user) {
      setError('ユーザーが認証されていません');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 登録用データを準備（実際の実装ではサーバーから取得）
      const registrationData: PasskeyRegistrationData = {
        challenge: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        user: {
          id: user.uid,
          name: user.email || 'user',
          displayName: user.displayName || user.email || 'User',
        },
        rp: {
          name: 'ワークアプリケーション',
          id: window.location.hostname,
        },
      };

      // パスキー登録実行
      const credential = await registerPasskey(registrationData);
      
      if (credential) {
        // 新しいパスキーを一覧に追加（実際の実装ではサーバーに保存）
        const newPasskey: PasskeyInfo = {
          id: credential.id,
          name: `${biometricType || 'パスキー'} (${new Date().toLocaleDateString()})`,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          deviceType: navigator.userAgent.includes('Windows') ? 'Windows' : 
                     navigator.userAgent.includes('Mac') ? 'macOS' :
                     navigator.userAgent.includes('iPhone') ? 'iOS' :
                     navigator.userAgent.includes('Android') ? 'Android' : 'Unknown',
        };
        
        setPasskeys(prev => [...prev, newPasskey]);
        setShowAddDialog(false);
        
        if (onPasskeyAdded) {
          onPasskeyAdded();
        }
        
        console.log('✅ パスキーを登録しました:', credential.id);
      }
    } catch (error: any) {
      console.error('❌ パスキー登録エラー:', error);
      setError(error.message || 'パスキーの登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [user, biometricType, onPasskeyAdded]);

  // パスキー削除
  const handleDeletePasskey = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 実際の実装では、サーバーでパスキーを削除
      setPasskeys(prev => prev.filter(pk => pk.id !== id));
      setDeleteId(null);
      
      if (onPasskeyRemoved) {
        onPasskeyRemoved();
      }
      
      console.log('✅ パスキーを削除しました:', id);
    } catch (error: any) {
      console.error('❌ パスキー削除エラー:', error);
      setError(error.message || 'パスキーの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [onPasskeyRemoved]);

  // デバイスアイコン取得
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'windows':
        return '💻';
      case 'macos':
        return '🖥️';
      case 'ios':
        return '📱';
      case 'android':
        return '📲';
      default:
        return <DeviceIcon />;
    }
  };

  // 最終使用日時のフォーマット
  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return '未使用';
    return new Date(lastUsed).toLocaleDateString('ja-JP');
  };

  if (!isSupported) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            このデバイスはパスキーをサポートしていません。
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          {/* ヘッダー */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: spacingTokens.lg }}>
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <FingerprintIcon />
                パスキー管理
              </Typography>
              <Typography variant="body2" color="text.secondary">
                生体認証・PIN認証によるパスワードレスログイン
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddDialog(true)}
              disabled={isLoading}
            >
              追加
            </Button>
          </Box>

          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* パスキー一覧 */}
          {passkeys.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: spacingTokens.xl }}>
              <FingerprintIcon sx={{ fontSize: 48, color: 'text.secondary', mb: spacingTokens.md }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                登録済みのパスキーがありません
              </Typography>
              <Typography variant="body2" color="text.secondary">
                「追加」ボタンからパスキーを登録してください
              </Typography>
            </Box>
          ) : (
            <List>
              {passkeys.map((passkey) => (
                <ListItem
                  key={passkey.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: shapeTokens.corner.medium,
                    mb: spacingTokens.sm,
                  }}
                >
                  <ListItemIcon>
                    {typeof getDeviceIcon(passkey.deviceType) === 'string' ? (
                      <Box sx={{ fontSize: 24 }}>{getDeviceIcon(passkey.deviceType)}</Box>
                    ) : (
                      getDeviceIcon(passkey.deviceType)
                    )}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={passkey.name}
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip
                          label={`登録: ${new Date(passkey.createdAt).toLocaleDateString('ja-JP')}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`最終使用: ${formatLastUsed(passkey.lastUsed)}`}
                          size="small"
                          variant="outlined"
                          color={passkey.lastUsed ? 'primary' : 'default'}
                        />
                      </Stack>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => setDeleteId(passkey.id)}
                      disabled={isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* パスキー追加ダイアログ */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
          <SecurityIcon />
          パスキー追加
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            新しいパスキーを登録します。
          </Typography>
          
          <Alert severity="info" sx={{ mt: spacingTokens.md }}>
            <Typography variant="body2">
              {biometricType ? `${biometricType}を使用してパスキーを登録します。` : 'デバイスの認証機能を使用してパスキーを登録します。'}
              登録後は、パスワードなしでログインできるようになります。
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: spacingTokens.lg, gap: spacingTokens.sm }}>
          <Button
            onClick={() => setShowAddDialog(false)}
            disabled={isLoading}
            variant="outlined"
          >
            キャンセル
          </Button>
          
          <LoadingButton
            onClick={handleAddPasskey}
            loading={isLoading}
            variant="contained"
            startIcon={<FingerprintIcon />}
          >
            登録開始
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* パスキー削除確認ダイアログ */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>パスキー削除</DialogTitle>
        
        <DialogContent>
          <Typography variant="body1">
            このパスキーを削除してもよろしいですか？
          </Typography>
          
          <Alert severity="warning" sx={{ mt: spacingTokens.md }}>
            削除後は、このデバイスではパスキーログインができなくなります。
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: spacingTokens.lg, gap: spacingTokens.sm }}>
          <Button
            onClick={() => setDeleteId(null)}
            disabled={isLoading}
            variant="outlined"
          >
            キャンセル
          </Button>
          
          <LoadingButton
            onClick={() => deleteId && handleDeletePasskey(deleteId)}
            loading={isLoading}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            削除
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
