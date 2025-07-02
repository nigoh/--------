import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import {
  StandardDialog,
  ConfirmationDialog,
  FormDialog,
  FormDialogContent,
  FormDialogSection
} from './ui';
import { LoggingExample } from './LoggingExample';
import { spacingTokens } from '../theme/designSystem';

const DialogShowcase: React.FC = () => {
  const theme = useTheme();
  
  // ダイアログの状態管理
  const [standardOpen, setStandardOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [loggingExampleOpen, setLoggingExampleOpen] = useState(false);
  
  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    notifications: true
  });
  
  // ローディング状態
  const [loading, setLoading] = useState(false);
  
  const handleFormSubmit = async () => {
    setLoading(true);
    
    // 2秒の模擬処理
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('フォームデータ:', formData);
    setLoading(false);
    setFormOpen(false);
    
    // フォームリセット
    setFormData({
      name: '',
      email: '',
      department: '',
      notifications: true
    });
  };
  
  const handleDeleteConfirm = async () => {
    setLoading(true);
    
    // 削除処理の模擬
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('削除が完了しました');
    setLoading(false);
    setDeleteConfirmOpen(false);
  };
  
  return (
    <Box sx={{ p: spacingTokens.lg }}>
      <Typography variant="h4" gutterBottom>
        統一ダイアログシステム デモ
      </Typography>
      
      <Typography variant="body1" sx={{ mb: spacingTokens.lg, color: theme.palette.text.secondary }}>
        アプリケーション全体で使用する統一されたダイアログコンポーネントのデモンストレーションです。
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: spacingTokens.md
        }}
      >
        {/* 標準ダイアログ */}
        <Paper sx={{ p: spacingTokens.md, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            標準ダイアログ
          </Typography>
          <Typography variant="body2" sx={{ mb: spacingTokens.md, color: theme.palette.text.secondary }}>
            基本的な情報表示やシンプルなコンテンツに使用
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setStandardOpen(true)}
          >
            標準ダイアログを開く
          </Button>
        </Paper>
        
        {/* 確認ダイアログ */}
        <Paper sx={{ p: spacingTokens.md, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            確認ダイアログ
          </Typography>
          <Typography variant="body2" sx={{ mb: spacingTokens.md, color: theme.palette.text.secondary }}>
            ユーザーアクションの確認に使用
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setConfirmationOpen(true)}
            >
              情報確認
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => setDeleteConfirmOpen(true)}
            >
              削除確認
            </Button>
          </Box>
        </Paper>
        
        {/* フォームダイアログ */}
        <Paper sx={{ p: spacingTokens.md, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            フォームダイアログ
          </Typography>
          <Typography variant="body2" sx={{ mb: spacingTokens.md, color: theme.palette.text.secondary }}>
            データ入力や設定変更に使用
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setFormOpen(true)}
            >
              フォームダイアログ
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setFullscreenOpen(true)}
            >
              フルスクリーン
            </Button>
          </Box>
        </Paper>
      </Box>
      
      {/* ログシステム デモセクション */}
      <Box sx={{ mt: spacingTokens.xl }}>
        <Typography variant="h5" gutterBottom>
          ログシステム デモ
        </Typography>
        <Typography variant="body1" sx={{ mb: spacingTokens.md, color: theme.palette.text.secondary }}>
          統一ログシステムの機能をテストできます。
        </Typography>
        <Button
          variant="contained"
          onClick={() => setLoggingExampleOpen(true)}
          sx={{ mb: spacingTokens.md }}
        >
          ログシステム デモを開く
        </Button>
        {loggingExampleOpen && (
          <LoggingExample onClose={() => setLoggingExampleOpen(false)} />
        )}
      </Box>
      
      {/* 標準ダイアログ */}
      <StandardDialog
        open={standardOpen}
        onClose={() => setStandardOpen(false)}
        title="標準ダイアログ"
        variant="standard"
        size="md"
        animation="slide"
        actions={
          <>
            <Button onClick={() => setStandardOpen(false)} variant="outlined">
              閉じる
            </Button>
            <Button onClick={() => setStandardOpen(false)} variant="contained">
              了解
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          これは標準的なダイアログです。情報の表示や簡単なユーザーインタラクションに使用します。
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
          統一されたデザインシステムにより、アプリケーション全体で一貫したユーザーエクスペリエンスを提供します。
        </Typography>
      </StandardDialog>
      
      {/* 確認ダイアログ - 情報 */}
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={() => {
          console.log('確認されました');
          setConfirmationOpen(false);
        }}
        title="操作の確認"
        message="この操作を実行してもよろしいですか？"
        type="question"
        confirmText="実行"
      />
      
      {/* 確認ダイアログ - 削除 */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="データの削除"
        message="このデータを削除すると、元に戻すことはできません。本当に削除してもよろしいですか？"
        type="warning"
        dangerous={true}
        loading={loading}
        confirmText="削除"
      />
      
      {/* フォームダイアログ */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title="ユーザー情報の編集"
        loading={loading}
        isValid={formData.name.length > 0 && formData.email.length > 0}
      >
        <FormDialogContent>
          <FormDialogSection title="基本情報">
            <TextField
              label="名前"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="メールアドレス"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              required
            />
          </FormDialogSection>
          
          <FormDialogSection title="詳細設定">
            <FormControl fullWidth>
              <InputLabel>部署</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                label="部署"
              >
                <MenuItem value="engineering">エンジニアリング</MenuItem>
                <MenuItem value="design">デザイン</MenuItem>
                <MenuItem value="marketing">マーケティング</MenuItem>
                <MenuItem value="sales">営業</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                />
              }
              label="通知を受け取る"
            />
          </FormDialogSection>
        </FormDialogContent>
      </FormDialog>
      
      {/* フルスクリーンダイアログ */}
      <StandardDialog
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        title="フルスクリーンダイアログ"
        variant="fullscreen"
        animation="slide"
        actions={
          <>
            <Button onClick={() => setFullscreenOpen(false)} variant="outlined">
              キャンセル
            </Button>
            <Button onClick={() => setFullscreenOpen(false)} variant="contained">
              保存
            </Button>
          </>
        }
      >
        <Box sx={{ p: spacingTokens.lg }}>
          <Typography variant="h6" gutterBottom>
            フルスクリーンコンテンツ
          </Typography>
          <Typography variant="body1">
            大量のコンテンツや複雑なフォームに適したフルスクリーンダイアログです。
            モバイルデバイスでは自動的にフルスクリーンになります。
          </Typography>
          
          <Box sx={{ mt: spacingTokens.lg }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: spacingTokens.md
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Paper sx={{ p: spacingTokens.md, textAlign: 'center' }} key={index}>
                  <Typography variant="h6">
                    サンプルカード {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    フルスクリーンダイアログ内のコンテンツ例
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </StandardDialog>
    </Box>
  );
};

export default DialogShowcase;
