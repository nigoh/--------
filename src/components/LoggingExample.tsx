/**
 * Logging Example Component
 * 
 * ログシステムの使用例を示すデモコンポーネント
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  BugReport as DebugIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useComponentLogger } from '../logging';

interface LoggingExampleProps {
  onClose?: () => void;
}

export const LoggingExample: React.FC<LoggingExampleProps> = ({ onClose }) => {
  const logger = useComponentLogger('LoggingExample', 'demo');
  const [logLevel, setLogLevel] = useState<string>('info');
  const [message, setMessage] = useState<string>('Test log message');
  const [showSensitiveData, setShowSensitiveData] = useState<boolean>(false);

  // コンポーネントマウント時のログ
  React.useEffect(() => {
    logger.info('Logging example component mounted');
    return () => {
      logger.info('Logging example component unmounted');
    };
  }, [logger]);

  // 各種ログレベルのデモ
  const handleLogDemo = (level: string) => {
    const context = {
      demoType: 'manual-trigger',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 50) + '...',
    };

    switch (level) {
      case 'trace':
        logger.trace('Trace level demo - detailed debugging info', context);
        break;
      case 'debug':
        logger.debug('Debug level demo - development information', context);
        break;
      case 'info':
        logger.info('Info level demo - general information', context);
        break;
      case 'warn':
        logger.warn('Warning level demo - potential issue detected', context);
        break;
      case 'error':
        logger.error('Error level demo - something went wrong', context);
        break;
      case 'fatal':
        logger.fatal('Fatal level demo - critical system error', context);
        break;
    }

    logger.logComponentAction('log-demo-triggered', { level });
  };

  // PII マスキングのデモ
  const handlePIIDemo = () => {
    const sensitiveData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'secretPassword123',
      creditCard: '1234-5678-9012-3456',
      phone: '090-1234-5678',
      normalData: 'This is safe information',
      apiKey: 'sk_test_abcd1234efgh5678',
    };

    logger.info('PII Masking Demo - sensitive data will be masked', sensitiveData);
    logger.logUserAction('pii-demo-triggered', 'sensitive-data-log');
  };

  // エラーハンドリングのデモ
  const handleErrorDemo = () => {
    try {
      // 意図的にエラーを発生
      throw new Error('Demo error for testing error logging');
    } catch (error) {
      logger.logComponentError(error as Error, {
        errorType: 'demo-error',
        intentional: true,
      });
    }
  };

  // パフォーマンスログのデモ
  const handlePerformanceDemo = async () => {
    const start = performance.now();
    
    // 模擬的な重い処理
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    
    const duration = performance.now() - start;
    logger.logPerformance('demo-heavy-operation', duration, {
      operationType: 'simulated-delay',
      expectedRange: '100-600ms',
    });
  };

  // API呼び出しログのデモ
  const handleApiDemo = async () => {
    const start = performance.now();
    
    try {
      // 模擬API呼び出し
      const mockResponse = {
        ok: Math.random() > 0.3, // 70% 成功率
        status: Math.random() > 0.3 ? 200 : 500,
        statusText: Math.random() > 0.3 ? 'OK' : 'Internal Server Error',
      };
      
      const duration = performance.now() - start;
      
      logger.logApiCall(
        'GET',
        '/api/demo-endpoint?token=secret123&apiKey=abc123',
        mockResponse.status,
        duration,
        {
          mockDemo: true,
          successful: mockResponse.ok,
        }
      );
      
      if (!mockResponse.ok) {
        logger.error('Demo API call failed', {
          status: mockResponse.status,
          statusText: mockResponse.statusText,
        });
      }
    } catch (error) {
      logger.logComponentError(error as Error, { context: 'api-demo' });
    }
  };

  // カスタムログメッセージ
  const handleCustomLog = () => {
    const customContext = {
      customMessage: true,
      logLevel,
      userInput: message,
      timestamp: Date.now(),
    };

    switch (logLevel) {
      case 'trace':
        logger.trace(message, customContext);
        break;
      case 'debug':
        logger.debug(message, customContext);
        break;
      case 'info':
        logger.info(message, customContext);
        break;
      case 'warn':
        logger.warn(message, customContext);
        break;
      case 'error':
        logger.error(message, customContext);
        break;
      case 'fatal':
        logger.fatal(message, customContext);
        break;
    }
  };

  const logLevelColors = {
    trace: 'default',
    debug: 'primary',
    info: 'success',
    warn: 'warning',
    error: 'error',
    fatal: 'error',
  } as const;

  const logLevelIcons = {
    trace: <DebugIcon />,
    debug: <DebugIcon />,
    info: <InfoIcon />,
    warn: <WarningIcon />,
    error: <ErrorIcon />,
    fatal: <ErrorIcon />,
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          ログシステム デモ
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          ブラウザの開発者ツール（F12）のコンソールを開いて、ログ出力を確認してください。
          ローカルストレージにも保存されます。
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          各ボタンをクリックすると、対応するログが出力されます。
          PII（個人情報）は自動的にマスクされ、エラーには詳細な情報が付加されます。
        </Alert>

        <Stack spacing={3}>
          {/* ログレベルデモ */}
          <Box>
            <Typography variant="h6" gutterBottom>
              ログレベル デモ
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {['trace', 'debug', 'info', 'warn', 'error', 'fatal'].map((level) => (
                <Button
                  key={level}
                  variant="outlined"
                  size="small"
                  startIcon={logLevelIcons[level as keyof typeof logLevelIcons]}
                  onClick={() => handleLogDemo(level)}
                  color={logLevelColors[level as keyof typeof logLevelColors]}
                >
                  {level.toUpperCase()}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* 特別なログタイプデモ */}
          <Box>
            <Typography variant="h6" gutterBottom>
              特別なログタイプ デモ
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                onClick={handlePIIDemo}
                color="secondary"
              >
                PII マスキング
              </Button>
              <Button
                variant="outlined"
                onClick={handleErrorDemo}
                color="error"
              >
                エラーハンドリング
              </Button>
              <Button
                variant="outlined"
                onClick={handlePerformanceDemo}
                color="primary"
              >
                パフォーマンス
              </Button>
              <Button
                variant="outlined"
                onClick={handleApiDemo}
                color="info"
              >
                API呼び出し
              </Button>
            </Stack>
          </Box>

          {/* カスタムログ */}
          <Box>
            <Typography variant="h6" gutterBottom>
              カスタムログ メッセージ
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="end">
                <TextField
                  label="ログメッセージ"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>レベル</InputLabel>
                  <Select
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                    label="レベル"
                  >
                    {['trace', 'debug', 'info', 'warn', 'error', 'fatal'].map((level) => (
                      <MenuItem key={level} value={level}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {logLevelIcons[level as keyof typeof logLevelIcons]}
                          <span>{level.toUpperCase()}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleCustomLog}
                  startIcon={logLevelIcons[logLevel as keyof typeof logLevelIcons]}
                  color={logLevelColors[logLevel as keyof typeof logLevelColors]}
                >
                  ログ出力
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* 情報 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              ログ確認方法
            </Typography>
            <Stack spacing={1}>
              <Chip
                label="1. ブラウザの開発者ツール（F12）→ Console タブ"
                variant="outlined"
                size="small"
              />
              <Chip
                label="2. ローカルストレージ → app-logs キー"
                variant="outlined"
                size="small"
              />
              <Chip
                label="3. 本番環境では /api/logs エンドポイントに送信"
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>

          {onClose && (
            <Button onClick={onClose} sx={{ mt: 2 }}>
              閉じる
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};