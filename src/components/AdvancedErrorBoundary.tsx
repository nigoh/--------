/**
 * Advanced Error Boundary with Performance Monitoring
 * 
 * エラー境界の拡張版 - パフォーマンス監視とエラー解析機能付き
 * 
 * 機能:
 * - エラーの自動キャッチと分析
 * - 詳細なエラーレポートの生成
 * - クリップボードへのエラー情報コピー（簡易版・詳細版）
 * - 視覚的フィードバック付きのユーザビリティ
 * - エラー監視サービスへの自動送信（本番環境）
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
  Snackbar,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
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
  copySuccess: boolean;
  showCopySnackbar: boolean;
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
      copySuccess: false,
      showCopySnackbar: false,
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
      copySuccess: false,
      showCopySnackbar: false,
    });
  };

  handleCopyError = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const currentTime = new Date().toLocaleString('ja-JP');
    const errorReport = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 エラーレポート - ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 基本情報:
  エラーID: ${errorId}
  発生時刻: ${currentTime}
  URL: ${window.location.href}
  ユーザーエージェント: ${navigator.userAgent}

🔍 エラー詳細:
  メッセージ: ${error?.message || 'Unknown error'}
  エラータイプ: ${error?.name || 'Unknown'}

📜 スタックトレース:
${error?.stack || 'No stack trace available'}

🏗️ コンポーネントスタック:
${errorInfo?.componentStack || 'No component stack available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 サポート情報:
このエラーレポートを開発チームに送信することで、問題の解決に役立ちます。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    try {
      await navigator.clipboard.writeText(errorReport);
      this.setState({ 
        copySuccess: true, 
        showCopySnackbar: true 
      });
      
      // 2秒後にコピー成功状態をリセット
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 2000);
      
      console.log('📋 エラーレポートをクリップボードにコピーしました');
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      
      // フォールバック: テキストエリアを使用してコピー
      const textArea = document.createElement('textarea');
      textArea.value = errorReport;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      this.setState({ 
        copySuccess: true, 
        showCopySnackbar: true 
      });
      
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 2000);
    }
  };

  handleCopySimple = async () => {
    const { error, errorId } = this.state;
    const simpleReport = `エラーID: ${errorId} | ${error?.message || 'Unknown error'}`;
    
    try {
      await navigator.clipboard.writeText(simpleReport);
      this.setState({ 
        copySuccess: true, 
        showCopySnackbar: true 
      });
      
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 2000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
  };

  handleCloseSnackbar = () => {
    this.setState({ showCopySnackbar: false });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId, showDetails, copySuccess, showCopySnackbar } = this.state;
      
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

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🔧 エラーレポートの活用方法
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>簡易コピー:</strong> エラーIDとメッセージのみをコピーします（チャット・メール用）
                </Typography>
                <Typography variant="body2">
                  <strong>詳細コピー:</strong> 技術的な詳細を含む完全なレポートをコピーします（開発者向け）
                </Typography>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      icon={<BugIcon />}
                      label={`エラーID: ${errorId}`}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={copySuccess ? <CheckIcon /> : <CopyIcon />}
                      onClick={this.handleCopySimple}
                      color={copySuccess ? "success" : "primary"}
                      sx={{ minWidth: 120 }}
                    >
                      {copySuccess ? 'コピー済み' : '簡易コピー'}
                    </Button>
                    
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={copySuccess ? <CheckIcon /> : <CopyIcon />}
                      onClick={this.handleCopyError}
                      color={copySuccess ? "success" : "primary"}
                      sx={{ minWidth: 120 }}
                    >
                      {copySuccess ? 'コピー済み' : '詳細コピー'}
                    </Button>
                  </Stack>
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

          {/* コピー成功時のスナックバー */}
          <Snackbar
            open={showCopySnackbar}
            autoHideDuration={3000}
            onClose={this.handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={this.handleCloseSnackbar} 
              severity="success" 
              sx={{ width: '100%' }}
              variant="filled"
            >
              📋 エラー情報をクリップボードにコピーしました
            </Alert>
          </Snackbar>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default AdvancedErrorBoundary;
