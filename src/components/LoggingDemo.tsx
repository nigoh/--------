/**
 * Logging Demo Component
 * 
 * Demonstrates various logging features and usage patterns
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  BugReport as BugIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { 
  useComponentLogger, 
  useActionLogger, 
  usePerformanceLogger 
} from '../logging';

export const LoggingDemo: React.FC = () => {
  const [testMessage, setTestMessage] = useState('');
  const [performanceTest, setPerformanceTest] = useState<number | null>(null);
  
  // Component-specific logger
  const log = useComponentLogger('LoggingDemo');
  
  // Action logging
  const actionLogger = useActionLogger();
  
  // Performance logging
  const perfLogger = usePerformanceLogger();

  // Demonstrate different log levels
  const handleLogLevel = (level: string) => {
    const message = `This is a ${level} level log message`;
    const context = { 
      testData: 'sample data', 
      userId: 'demo-user',
      timestamp: new Date().toISOString() 
    };
    
    switch (level) {
      case 'trace':
        log.trace(message, context);
        break;
      case 'debug':
        log.debug(message, context);
        break;
      case 'info':
        log.info(message, context);
        break;
      case 'warn':
        log.warn(message, context);
        break;
      case 'error':
        log.error(message, context);
        break;
      case 'fatal':
        log.fatal(message, context);
        break;
    }
    
    // Also log the action
    actionLogger.logAction(`test-${level}-log`, { level, message });
  };

  // Demonstrate custom message logging
  const handleCustomMessage = () => {
    if (!testMessage.trim()) {
      log.warn('Empty message provided for custom logging');
      return;
    }
    
    log.info('Custom user message', {
      message: testMessage,
      messageLength: testMessage.length,
      containsEmail: testMessage.includes('@'),
      containsPhone: /\d{3}-?\d{3}-?\d{4}/.test(testMessage),
    });
    
    actionLogger.logAction('custom-message-logged', { 
      messageLength: testMessage.length 
    });
    
    setTestMessage('');
  };

  // Demonstrate performance logging
  const handlePerformanceTest = async () => {
    const startTime = performance.now();
    setPerformanceTest(startTime);
    
    // Simulate some async work
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    perfLogger.logAsyncOperation('simulated-async-work', duration, true);
    
    setPerformanceTest(null);
    
    log.info('Performance test completed', {
      duration,
      startTime,
      endTime,
    });
  };

  // Demonstrate error simulation
  const handleErrorSimulation = () => {
    try {
      // Simulate an error
      throw new Error('This is a simulated error for logging demonstration');
    } catch (error) {
      log.error('Simulated error caught', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        simulatedError: true,
      });
      
      actionLogger.logError(error as Error, {
        source: 'LoggingDemo',
        simulated: true,
      });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        ログ機能デモ
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        このページでは新しいログ機能をテストできます。
        ブラウザの開発者ツールでコンソールを確認してください。
      </Alert>

      <Stack spacing={3}>
        {/* Log Levels Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ログレベルテスト
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              異なるログレベルでメッセージを出力します
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {['trace', 'debug', 'info', 'warn', 'error', 'fatal'].map((level) => (
                <Button
                  key={level}
                  variant="outlined"
                  size="small"
                  onClick={() => handleLogLevel(level)}
                  color={
                    level === 'error' || level === 'fatal' ? 'error' :
                    level === 'warn' ? 'warning' :
                    level === 'info' ? 'info' : 'primary'
                  }
                >
                  {level.toUpperCase()}
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Custom Message Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              カスタムメッセージログ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              独自のメッセージをログに記録します（PII自動マスク機能付き）
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="ログメッセージ"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="例: user@example.com または 090-1234-5678"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleCustomMessage}
                disabled={!testMessage.trim()}
                startIcon={<InfoIcon />}
              >
                ログ記録
              </Button>
            </Stack>
            
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              💡 メールアドレスや電話番号を入力すると自動的にマスクされます
            </Typography>
          </CardContent>
        </Card>

        {/* Performance Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              パフォーマンスログ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              非同期処理の実行時間を測定・記録します
            </Typography>
            
            <Button
              variant="contained"
              onClick={handlePerformanceTest}
              disabled={performanceTest !== null}
              startIcon={performanceTest !== null ? <TimelineIcon /> : <SpeedIcon />}
              color="success"
            >
              {performanceTest !== null ? '実行中...' : 'パフォーマンステスト開始'}
            </Button>
            
            {performanceTest !== null && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  ⏱️ 非同期処理を実行中... ({Math.round(performance.now() - performanceTest)}ms)
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Error Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              エラーログ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              エラーをキャッチしてログに記録します
            </Typography>
            
            <Button
              variant="contained"
              onClick={handleErrorSimulation}
              startIcon={<ErrorIcon />}
              color="error"
            >
              エラーシミュレーション
            </Button>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              実装されている機能
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  🚀 トランスポート機能
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip label="Console Transport" color="primary" size="small" />
                  <Chip label="IndexedDB Storage" color="secondary" size="small" />
                  <Chip label="HTTP API Transport" color="success" size="small" />
                </Stack>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  🔒 セキュリティ機能
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip label="PII自動マスク" color="warning" size="small" />
                  <Chip label="パスワード保護" color="error" size="small" />
                  <Chip label="データ暗号化" color="info" size="small" />
                </Stack>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ⚡ パフォーマンス機能
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip label="非同期ログ送信" color="success" size="small" />
                  <Chip label="バッチ処理" color="primary" size="small" />
                  <Chip label="オフライン対応" color="secondary" size="small" />
                  <Chip label="自動リトライ" color="warning" size="small" />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};