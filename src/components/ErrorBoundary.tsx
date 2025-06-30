import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert, IconButton, Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
  copySuccess: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, copySuccess: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      copySuccess: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, copySuccess: false });
  };

  copyToClipboard = async () => {
    const errorDetails = `
エラー情報:
---------
エラーメッセージ: ${this.state.error?.message || 'Unknown error'}
エラー名: ${this.state.error?.name || 'Error'}
発生時刻: ${new Date().toLocaleString('ja-JP')}
ブラウザ: ${navigator.userAgent}
URL: ${window.location.href}

スタックトレース:
${this.state.error?.stack || 'スタックトレースなし'}

コンポーネントスタック:
${this.state.errorInfo || 'コンポーネントスタックなし'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      this.setState({ copySuccess: true });
      
      // 3秒後にコピー成功状態をリセット
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 3000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      // フォールバック: テキストエリアを使った古い方法
      this.fallbackCopyToClipboard(errorDetails);
    }
  };

  fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.setState({ copySuccess: true });
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 3000);
    } catch (err) {
      console.error('フォールバックコピーに失敗しました:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 2,
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 64,
                color: 'error.main',
                mb: 2,
              }}
            />
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              申し訳ございません
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              予期しないエラーが発生しました。ページをリロードしてもう一度お試しください。
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    エラー詳細:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {this.state.error?.message || 'Unknown error'}
                  </Typography>
                </Box>
                <Tooltip title={this.state.copySuccess ? 'コピーしました！' : 'エラー情報をコピー'}>
                  <IconButton
                    size="small"
                    onClick={this.copyToClipboard}
                    sx={{ 
                      ml: 1,
                      color: this.state.copySuccess ? 'success.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: this.state.copySuccess ? 'success.light' : 'action.hover',
                      }
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                再試行
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{
                  borderRadius: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    color: '#5a6fd8',
                    backgroundColor: 'rgba(103, 126, 234, 0.05)',
                  },
                }}
              >
                ページリロード
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    開発者向け情報:
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={this.copyToClipboard}
                    disabled={this.state.copySuccess}
                    sx={{
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    {this.state.copySuccess ? 'コピー済み' : '詳細をコピー'}
                  </Button>
                </Box>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {this.state.errorInfo}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
