import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseReceipt } from './useExpenseStore';

interface ReceiptUploadProps {
  expenseId: string;
  receipts: ExpenseReceipt[];
  disabled?: boolean;
  // フォーム内での一時的な状態管理用コールバック（オプション）
  onReceiptsAdd?: (receipts: ExpenseReceipt[]) => void;
  onReceiptRemove?: (receiptId: string) => void;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  expenseId,
  receipts,
  disabled = false,
  onReceiptsAdd,
  onReceiptRemove,
}) => {
  const theme = useTheme();
  const { addReceipt, removeReceipt } = useExpenseStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // PDFビュワーモーダル用の状態
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<ExpenseReceipt | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // ファイル形式チェック（PDF のみ）
    if (file.type !== 'application/pdf') {
      setError('PDFファイルのみアップロード可能です');
      return;
    }

    // ファイルサイズチェック（10MB まで）
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズは10MB以下にしてください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 実際のアプリケーションではここでサーバーにアップロード
      // デモ用にBase64データURLを作成
      const fileUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // 領収書を追加
      const newReceipt: ExpenseReceipt = {
        id: crypto.randomUUID(),
        filename: file.name,
        fileUrl,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
      };

      // フォーム内での一時管理かストア管理かを判定
      if (onReceiptsAdd) {
        // フォーム内での一時管理
        onReceiptsAdd([newReceipt]);
      } else {
        // ストアでの永続管理
        addReceipt(expenseId, newReceipt);
      }

    } catch (err) {
      setError('アップロードに失敗しました');
    } finally {
      setUploading(false);
      // ファイル入力をリセット
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [expenseId, addReceipt, onReceiptsAdd]);

  const handleRemoveReceipt = useCallback((receiptId: string) => {
    if (onReceiptRemove) {
      // フォーム内での一時管理
      onReceiptRemove(receiptId);
    } else {
      // ストアでの永続管理
      removeReceipt(expenseId, receiptId);
    }
  }, [expenseId, removeReceipt, onReceiptRemove]);

  // PDFビュワーを開く
  const handleViewPdf = useCallback((receipt: ExpenseReceipt) => {
    setCurrentPdf(receipt);
    setZoomLevel(1);
    setViewerOpen(true);
  }, []);

  // PDFビュワーを閉じる
  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
    setCurrentPdf(null);
    setZoomLevel(1);
  }, []);

  // ズーム操作
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  // PDFダウンロード
  const handleDownload = useCallback((receipt: ExpenseReceipt) => {
    const link = document.createElement('a');
    link.href = receipt.fileUrl;
    link.download = receipt.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
      }}
    >

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* アップロードエリア */}
      <Box
        sx={{
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: disabled 
            ? alpha(theme.palette.action.disabled, 0.1)
            : alpha(theme.palette.primary.main, 0.02),
          transition: 'all 0.2s ease',
          '&:hover': disabled ? {} : {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        {uploading ? (
          <Box>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              アップロード中...
            </Typography>
          </Box>
        ) : (
          <>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="receipt-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={disabled}
            />
            <label htmlFor="receipt-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
                disabled={disabled}
                sx={{
                  fontWeight: 'bold',
                }}
              >
                ファイルを選択
              </Button>
            </label>
            <Typography variant="body2" sx={{ mb: 1 }}>
              PDFファイルをアップロード
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              最大ファイルサイズ: 10MB
            </Typography>
          </>
        )}
      </Box>

      {/* アップロード済みファイル一覧 */}
      {receipts.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            アップロード済み領収書 ({receipts.length}件)
          </Typography>
          <List>
            {receipts.map((receipt) => (
              <ListItem
                key={receipt.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <PdfIcon sx={{ mr: 2, color: 'error.main' }} />
                <ListItemText
                  primary={receipt.filename}
                  secondary={`${formatFileSize(receipt.fileSize)} • ${new Date(receipt.uploadDate).toLocaleString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="プレビュー"
                    onClick={() => handleViewPdf(receipt)}
                    sx={{ mr: 1 }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="ダウンロード"
                    onClick={() => handleDownload(receipt)}
                    sx={{ mr: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="削除"
                    onClick={() => handleRemoveReceipt(receipt.id)}
                    disabled={disabled}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* PDFビュワーモーダル */}
      <Dialog
        open={viewerOpen}
        onClose={handleCloseViewer}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Box>
            <Typography variant="h6" component="span">
              領収書プレビュー
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {currentPdf?.filename}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
              <ZoomOutIcon />
            </IconButton>
            <Typography variant="body2" sx={{ 
              minWidth: '60px', 
              textAlign: 'center', 
              lineHeight: '40px' 
            }}>
              {Math.round(zoomLevel * 100)}%
            </Typography>
            <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <ZoomInIcon />
            </IconButton>
            <IconButton 
              onClick={() => currentPdf && handleDownload(currentPdf)}
              sx={{ ml: 1 }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={handleCloseViewer}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          overflow: 'auto',
        }}>
          {currentPdf && (
            <Box sx={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'auto',
            }}>
              <embed
                src={currentPdf.fileUrl}
                type="application/pdf"
                style={{
                  width: `${Math.min(100 * zoomLevel, 100)}%`,
                  height: `${Math.min(100 * zoomLevel, 100)}%`,
                  minHeight: '500px',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: theme.shadows[4],
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            {currentPdf && `${formatFileSize(currentPdf.fileSize)} • ${new Date(currentPdf.uploadDate).toLocaleString()}`}
          </Typography>
          <Button onClick={handleCloseViewer} variant="outlined">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
