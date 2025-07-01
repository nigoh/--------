import React from 'react';
import {
  Button,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { StandardDialog } from './StandardDialog';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  HelpOutline as QuestionIcon
} from '@mui/icons-material';

// 確認ダイアログのタイプ
export type ConfirmationType = 'info' | 'warning' | 'error' | 'success' | 'question';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
  // コンテンツ
  title: string;
  message: string;
  
  // タイプとスタイル
  type?: ConfirmationType;
  
  // ボタン設定
  confirmText?: string;
  cancelText?: string;
  
  // 危険な操作の場合
  dangerous?: boolean;
  
  // ローディング状態
  loading?: boolean;
}

// タイプ別の設定
const getTypeConfig = (type: ConfirmationType, theme: any) => {
  const configs = {
    info: {
      icon: <InfoIcon />,
      color: theme.palette.info.main,
      iconBgColor: theme.palette.info.light + '20',
    },
    warning: {
      icon: <WarningIcon />,
      color: theme.palette.warning.main,
      iconBgColor: theme.palette.warning.light + '20',
    },
    error: {
      icon: <ErrorIcon />,
      color: theme.palette.error.main,
      iconBgColor: theme.palette.error.light + '20',
    },
    success: {
      icon: <SuccessIcon />,
      color: theme.palette.success.main,
      iconBgColor: theme.palette.success.light + '20',
    },
    question: {
      icon: <QuestionIcon />,
      color: theme.palette.primary.main,
      iconBgColor: theme.palette.primary.light + '20',
    }
  };
  
  return configs[type];
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'question',
  confirmText,
  cancelText = 'キャンセル',
  dangerous = false,
  loading = false
}) => {
  const theme = useTheme();
  const typeConfig = getTypeConfig(type, theme);
  
  // デフォルトの確認ボタンテキスト
  const getDefaultConfirmText = () => {
    if (confirmText) return confirmText;
    
    switch (type) {
      case 'error':
      case 'warning':
        return dangerous ? '削除' : '実行';
      case 'question':
        return 'はい';
      default:
        return 'OK';
    }
  };
  
  const actions = (
    <>
      <Button
        onClick={onClose}
        variant="outlined"
        disabled={loading}
        sx={{ minWidth: '80px' }}
      >
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color={dangerous ? 'error' : 'primary'}
        disabled={loading}
        sx={{ minWidth: '80px' }}
      >
        {loading ? '処理中...' : getDefaultConfirmText()}
      </Button>
    </>
  );
  
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      title={title}
      variant="confirmation"
      size="sm"
      animation="fade"
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
      actions={actions}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          py: 2
        }}
      >
        {/* アイコン */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: typeConfig.iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: typeConfig.color,
            '& svg': {
              fontSize: 32
            }
          }}
        >
          {typeConfig.icon}
        </Box>
        
        {/* メッセージ */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: theme.palette.text.primary,
            lineHeight: 1.6,
            maxWidth: '400px'
          }}
        >
          {message}
        </Typography>
      </Box>
    </StandardDialog>
  );
};
