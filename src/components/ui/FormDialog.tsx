import React from 'react';
import {
  Button,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import { StandardDialog } from './StandardDialog';
import { spacingTokens } from '../../theme/designSystem';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  
  // コンテンツ
  title: string;
  children: React.ReactNode;
  
  // サイズとスタイル
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  
  // ボタン設定
  submitText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  
  // 状態
  loading?: boolean;
  disabled?: boolean;
  
  // バリデーション
  isValid?: boolean;
  
  // 高度な設定
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  
  // 追加アクション
  secondaryActions?: React.ReactNode;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  size = 'md',
  fullScreen = false,
  submitText = '保存',
  cancelText = 'キャンセル',
  showCancelButton = true,
  loading = false,
  disabled = false,
  isValid = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  secondaryActions
}) => {
  const theme = useTheme();
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!loading && !disabled && isValid) {
      onSubmit();
    }
  };
  
  const actions = (
    <>
      {/* セカンダリアクション */}
      {secondaryActions}
      
      {/* メインアクション */}
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        {showCancelButton && (
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{ minWidth: '80px' }}
          >
            {cancelText}
          </Button>
        )}
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || disabled || !isValid}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
          sx={{ minWidth: '80px' }}
        >
          {loading ? '保存中...' : submitText}
        </Button>
      </Box>
    </>
  );
  
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      title={title}
      variant="form"
      size={size}
      fullScreen={fullScreen}
      animation="slide"
      disableBackdropClick={disableBackdropClick || loading}
      disableEscapeKeyDown={disableEscapeKeyDown || loading}
      actions={actions}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacingTokens.md,
          minHeight: 0, // フレックスアイテムがオーバーフローを適切に処理
        }}
      >
        {children}
      </Box>
    </StandardDialog>
  );
};

// フォームダイアログ用のコンテンツラッパー
interface FormDialogContentProps {
  children: React.ReactNode;
  spacing?: number;
}

export const FormDialogContent: React.FC<FormDialogContentProps> = ({
  children,
  spacing = spacingTokens.md
}) => {
  return (
    <Box
      sx={{
        // マージンとパディングを設定
        padding: spacing,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing,
        flex: 1,
        minHeight: 0,
        
        // スクロール可能なコンテンツ
        overflowY: 'auto',
        
        // カスタムスクロールバー
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
        },
      }}
    >
      {children}
    </Box>
  );
};

// フォームセクション用コンポーネント
interface FormDialogSectionProps {
  title?: string;
  children: React.ReactNode;
  spacing?: number;
}

export const FormDialogSection: React.FC<FormDialogSectionProps> = ({
  title,
  children,
  spacing = spacingTokens.sm
}) => {
  const theme = useTheme();
  
  return (
    <Box>
      {title && (
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: spacingTokens.xs,
            mb: spacingTokens.sm,
          }}
        >
          <Box
            component="h3"
            sx={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Box>
        </Box>
      )}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
