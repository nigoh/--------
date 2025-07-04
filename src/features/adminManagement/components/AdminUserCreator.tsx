/**
 * 開発環境用 Super Admin 作成コンポーネント
 * 初期セットアップやテスト用
 */
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import { AdminPanelSettings, Security } from '@mui/icons-material';
import { 
  createSuperAdminUser, 
  createDemoSuperAdmin, 
  checkAndCreateInitialAdmin 
} from '../services/createAdminUser';

interface AdminCreationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  employeeId: string;
  department: string;
  position: string;
}

export const AdminUserCreator: React.FC = () => {
  const [formData, setFormData] = useState<AdminCreationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    employeeId: '',
    department: 'システム管理部',
    position: 'システム管理者',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // フォーム入力の処理
  const handleInputChange = (field: keyof AdminCreationFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // バリデーション
  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.displayName) {
      return 'メールアドレス、パスワード、表示名は必須です';
    }
    
    if (formData.password.length < 6) {
      return 'パスワードは6文字以上で入力してください';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'パスワードが一致しません';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'メールアドレスの形式が正しくありません';
    }
    
    return null;
  };

  // Super Admin 作成
  const handleCreateSuperAdmin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setResult({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const result = await createSuperAdminUser({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        employeeId: formData.employeeId || undefined,
        department: formData.department,
        position: formData.position,
      });

      if (result.success) {
        setResult({
          type: 'success',
          message: `${result.message}\nUID: ${result.uid}`
        });
        
        // フォームをリセット
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          displayName: '',
          employeeId: '',
          department: 'システム管理部',
          position: 'システム管理者',
        });
      } else {
        setResult({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: '予期しないエラーが発生しました'
      });
    } finally {
      setLoading(false);
    }
  };

  // デモ管理者作成
  const handleCreateDemoAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const result = await createDemoSuperAdmin();
      
      if (result.success) {
        setResult({
          type: 'success',
          message: `デモ管理者アカウントを作成しました\nメール: admin@company.com\nUID: ${result.uid}`
        });
      } else {
        setResult({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'デモ管理者の作成に失敗しました'
      });
    } finally {
      setLoading(false);
    }
  };

  // 初期管理者チェック
  const handleCheckAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const result = await checkAndCreateInitialAdmin();
      
      setResult({
        type: result.hasAdmin ? 'info' : 'error',
        message: result.message || '管理者チェックでエラーが発生しました'
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: '管理者チェックに失敗しました'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              Super Admin アカウント作成
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ⚠️ 開発環境専用：本番環境では使用しないでください
          </Typography>

          {/* 結果表示 */}
          {result && (
            <Alert 
              severity={result.type} 
              sx={{ mb: 3 }}
              onClose={() => setResult(null)}
            >
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {result.message}
              </pre>
            </Alert>
          )}

          {/* クイックアクション */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleCheckAdmin}
              disabled={loading}
              startIcon={<Security />}
            >
              管理者アカウントの存在確認
            </Button>
            
            <Button
              variant="contained"
              onClick={handleCreateDemoAdmin}
              disabled={loading}
              color="secondary"
            >
              デモ管理者アカウント作成
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>または</Divider>

          {/* カスタム管理者作成フォーム */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            カスタム Super Admin 作成
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="メールアドレス"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="パスワード"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                fullWidth
                required
              />
              <TextField
                label="パスワード確認"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                fullWidth
                required
              />
            </Box>

            <TextField
              label="表示名"
              value={formData.displayName}
              onChange={handleInputChange('displayName')}
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="社員ID"
                value={formData.employeeId}
                onChange={handleInputChange('employeeId')}
                fullWidth
                placeholder="自動生成"
              />
              <TextField
                label="部署"
                value={formData.department}
                onChange={handleInputChange('department')}
                fullWidth
              />
            </Box>

            <TextField
              label="役職"
              value={formData.position}
              onChange={handleInputChange('position')}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleCreateSuperAdmin}
              disabled={loading}
              size="large"
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Super Admin作成'}
            </Button>
          </Stack>

          {/* 注意事項 */}
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Custom Claims の設定について
            </Typography>
            <Typography variant="body2">
              Firestoreでの権限設定は完了しますが、Custom Claimsの設定にはFirebase Admin SDKが必要です。
              Firebase Functionsまたはサーバーサイドで以下を実行してください：
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                mt: 1, 
                p: 1, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                fontSize: '0.75rem',
                overflow: 'auto'
              }}
            >
{`admin.auth().setCustomUserClaims(uid, {
  roles: ['super_admin', 'admin'],
  permissions: ['*'],
  isSuperAdmin: true
});`}
            </Box>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};
