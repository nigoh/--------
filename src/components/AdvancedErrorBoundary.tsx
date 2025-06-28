/**
 * Advanced Error Boundary with Performance Monitoring
 * 
 * エラー境界の拡張版 - パフォーマンス監視とエラー解析機能付き
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Alert,
  Collapse,
  IconButton,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
}

/**
 * エラー情報の分析
 */
const analyzeError = (error: Error, errorInfo: ErrorInfo) => {
  const analysis = {
    type: 'Unknown',
    severity: 'medium' as 'low' | 'medium' | 'high',
    category: 'Runtime Error',
    suggestions: [] as string[],
  };

  // エラータイプの分析
  if (error.name === 'ChunkLoadError') {
    analysis.type = 'Chunk Load Error';
    analysis.severity = 'medium';
    analysis.category = 'Network/Build';
    analysis.suggestions.push('ページを更新してください');
    analysis.suggestions.push('ネットワーク接続を確認してください');
  } else if (error.message.includes('Loading CSS chunk')) {
    analysis.type = 'CSS Chunk Error';
    analysis.severity = 'low';
    analysis.category = 'Styling';
    analysis.suggestions.push('スタイルの読み込みに失敗しました');
  } else if (error.message.includes('fetch')) {
    analysis.type = 'Network Error';
    analysis.severity = 'high';
    analysis.category = 'API/Network';
    analysis.suggestions.push('インターネット接続を確認してください');
    analysis.suggestions.push('サーバーの状態を確認してください');
  } else if (error.message.includes('Cannot read property')) {
    analysis.type = 'Property Access Error';
    analysis.severity = 'high';
    analysis.category = 'Data/State';
    analysis.suggestions.push('データが正しく読み込まれていない可能性があります');
  }

  return analysis;
};

/**
 * エラー情報を外部サービスに送信
 */
const reportError = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
  const errorReport = {
    errorId,
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: localStorage.getItem('userId') || 'anonymous',
  };

  // 本番環境では実際のエラー監視サービスに送信
  if (process.env.NODE_ENV === 'production') {
    // 例: Sentry, LogRocket, Bugsnag等
    // Sentry.captureException(error, { extra: errorReport });
  }

  // 開発環境ではローカルストレージに保存
  if (process.env.NODE_ENV === 'development') {
    const errors = JSON.parse(localStorage.getItem('error-reports') || '[]');
    errors.push(errorReport);
    localStorage.setItem('error-reports', JSON.stringify(errors));
    console.error('Error Report:', errorReport);
  }
};

export class AdvancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // エラーを外部に報告
    reportError(error, errorInfo, this.state.errorId);
    
    // 親コンポーネントのエラーハンドラーを呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    });
  };

  handleCopyError = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorText = `
Error ID: ${errorId}
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `.trim();
    
    navigator.clipboard.writeText(errorText).then(() => {
      console.log('Error details copied to clipboard');
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId, showDetails } = this.state;
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const analysis = error && errorInfo ? analyzeError(error, errorInfo) : null;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <ErrorIcon
                  sx={{
                    fontSize: 64,
                    color: 'error.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  予期しないエラーが発生しました
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  申し訳ございません。アプリケーションでエラーが発生しました。
                </Typography>
              </Box>

              {analysis && (
                <Alert 
                  severity={analysis.severity === 'high' ? 'error' : analysis.severity === 'medium' ? 'warning' : 'info'}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {analysis.type} - {analysis.category}
                  </Typography>
                  <Stack spacing={1}>
                    {analysis.suggestions.map((suggestion, index) => (
                      <Typography key={index} variant="body2">
                        • {suggestion}
                      </Typography>
                    ))}
                  </Stack>
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={<BugIcon />}
                    label={`エラーID: ${errorId}`}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton
                    onClick={this.handleCopyError}
                    size="small"
                    title="エラー詳細をコピー"
                  >
                    <CopyIcon />
                  </IconButton>
                </Stack>
              </Box>

              <Button
                onClick={() => this.setState({ showDetails: !showDetails })}
                startIcon={showDetails ? <CollapseIcon /> : <ExpandIcon />}
                variant="text"
                size="small"
                sx={{ mb: 2 }}
              >
                技術的な詳細を{showDetails ? '隠す' : '表示'}
              </Button>

              <Collapse in={showDetails}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50', mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      エラーメッセージ:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        mb: 2,
                      }}
                    >
                      {error?.message}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      スタックトレース:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {error?.stack}
                    </Typography>
                  </CardContent>
                </Card>
              </Collapse>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  color="primary"
                >
                  ページを更新
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleReset}
                  color="secondary"
                >
                  再試行
                </Button>
              </Stack>
            </CardActions>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default AdvancedErrorBoundary;
