# Logging Quick Reference

## 基本的な使い方

```tsx
import { useComponentLogger } from '../logging';

const MyComponent = () => {
  const log = useComponentLogger('MyComponent');
  
  // 基本ログ
  log.info('処理開始');
  log.warn('警告メッセージ');
  log.error('エラーが発生', { error: error.message });
  
  return <div>My Component</div>;
};
```

## ログレベル

| レベル | 用途 |
|--------|------|
| `trace` | 詳細なデバッグ |
| `debug` | 開発デバッグ |
| `info` | 一般情報 |
| `warn` | 警告 |
| `error` | エラー |
| `fatal` | 致命的エラー |

## 専用フック

### アクションログ
```tsx
const actionLogger = useActionLogger();

const handleSubmit = async () => {
  await actionLogger.logAction('form_submit', async () => {
    return await submitForm(data);
  }, { formType: 'registration' });
};
```

### パフォーマンスログ
```tsx
const perfLogger = usePerformanceLogger();

const processData = async () => {
  const timer = perfLogger.startTimer('data_processing');
  
  try {
    const result = await heavyProcess();
    timer.end({ success: true });
    return result;
  } catch (error) {
    timer.end({ success: false, error: error.message });
    throw error;
  }
};
```

## PII マスキング

```tsx
// 自動マスキング
log.info('ユーザー登録', {
  email: 'user@example.com',      // → 'u***@example.com'
  phone: '090-1234-5678',         // → '090-****-5678'
});

// カスタムマスキング
import { maskPIIInObject } from '../logging';

const masked = maskPIIInObject(data, {
  password: () => '[REDACTED]'
});
```

## 環境設定

```tsx
// App.tsx
<LogProvider 
  config={{
    enabledInProduction: true,
    enabledLevels: ['info', 'warn', 'error', 'fatal']
  }}
  enableHttpTransport={true}
  endpoint="/api/logs"
>
  <App />
</LogProvider>
```

## 実装パターン

### API呼び出し
```tsx
const fetchData = async (url) => {
  log.info('API呼び出し開始', { url });
  
  try {
    const response = await fetch(url);
    log.info('API呼び出し成功', { status: response.status });
    return await response.json();
  } catch (error) {
    log.error('API呼び出し失敗', { url, error: error.message });
    throw error;
  }
};
```

### エラーハンドリング
```tsx
const handleError = (error, context) => {
  log.error('予期しないエラー', {
    error: error.message,
    stack: error.stack,
    context
  });
};
```

### 状態変更
```tsx
const updateState = (newState) => {
  log.debug('状態更新', { 
    previous: currentState, 
    new: newState 
  });
  setState(newState);
};
```

## デバッグ

### ログが表示されない場合
1. `enabledInProduction: true` を設定
2. コンソールレベルを確認: `level: 'debug'`
3. ブラウザコンソールで: `localStorage.getItem('app_logs')`

### パフォーマンス最適化
- バッチサイズ調整: `batchSize: 10`
- フラッシュ間隔: `flushInterval: 30000`
- レベルフィルター: `enabledLevels: ['warn', 'error']`
