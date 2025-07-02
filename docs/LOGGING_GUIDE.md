# Logging System Documentation

## 概要

React + Vite Work App 用の統一ログシステムです。開発効率とデバッグ性向上のため、以下の機能を提供します：

- **統一ログインターフェース**: `log.info()`, `log.error()` 等の一貫したAPI
- **マルチトランスポート**: Console、Storage、HTTP転送の組み合わせ
- **PII自動マスキング**: 個人情報の自動検出・マスク
- **React統合**: Context/Hook による DI と HOC サポート
- **パフォーマンス配慮**: 非同期処理とバッファリング

## クイックスタート

### 1. LogProvider でアプリをラップ

```tsx
// main.tsx
import { LogProvider } from './logging';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogProvider>
    <App />
  </LogProvider>
);
```

### 2. コンポーネントでログ使用

```tsx
// 基本的な使用方法
import { useLogger } from './logging';

const MyComponent = () => {
  const logger = useLogger();
  
  const handleClick = () => {
    logger.info('Button clicked', { buttonId: 'submit', userId: '123' });
  };
  
  const handleError = (error: Error) => {
    logger.logError(error, { context: 'form-submission' });
  };
  
  return <button onClick={handleClick}>Submit</button>;
};
```

### 3. コンポーネント固有ロガー

```tsx
// より詳細なコンテキスト付きロギング
import { useComponentLogger } from './logging';

const UserProfileForm = () => {
  const logger = useComponentLogger('UserProfileForm', 'userManagement');
  
  const handleSubmit = async (data) => {
    logger.logComponentAction('form-submit', { formData: data });
    
    try {
      await saveProfile(data);
      logger.info('Profile saved successfully');
    } catch (error) {
      logger.logComponentError(error, { formData: data });
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

## ログレベル

| レベル | 用途 | 使用例 |
|--------|------|--------|
| `TRACE` | 詳細デバッグ | ループ内の状態変化 |
| `DEBUG` | 開発時情報 | Redux アクション詳細 |
| `INFO` | 通常運用ログ | 画面遷移、操作完了 |
| `WARN` | 警告 | API リトライ、非推奨機能使用 |
| `ERROR` | エラー | 例外、API失敗 |
| `FATAL` | 重大障害 | アプリクラッシュ、設定不備 |

```tsx
const logger = useLogger();

logger.trace('Loop iteration', { index: i, value: items[i] });
logger.debug('Redux action dispatched', { type: 'USER_LOGIN', payload });
logger.info('User logged in successfully', { userId: '123' });
logger.warn('Using deprecated API endpoint', { endpoint: '/old-api' });
logger.error('API request failed', { status: 500, endpoint: '/users' });
logger.fatal('Required config missing', { config: 'FIREBASE_API_KEY' });
```

## 特別なログメソッド

### エラーログ
```tsx
try {
  await riskyOperation();
} catch (error) {
  logger.logError(error, { context: 'user-registration', userId: '123' });
}
```

### API呼び出しログ
```tsx
const response = await fetch('/api/users');
logger.logApiCall('GET', '/api/users', response.status, 250);
```

### パフォーマンスログ
```tsx
const start = performance.now();
await expensiveOperation();
const duration = performance.now() - start;
logger.logPerformance('expensive-operation', duration);
```

### ユーザーアクションログ
```tsx
logger.logUserAction('button-click', 'submit-form', { formId: 'user-profile' });
```

## Transport 設定

### デフォルト設定
- **開発環境**: Console + Storage
- **本番環境**: Console + Storage + HTTP

### カスタム設定
```tsx
import { Logger, ConsoleTransport, StorageTransport, HttpTransport } from './logging';

const customLogger = new Logger([
  new ConsoleTransport(true),
  new StorageTransport({ maxEntries: 1000 }),
  new HttpTransport('/api/logs', { batchSize: 20 }),
]);

<LogProvider logger={customLogger}>
  <App />
</LogProvider>
```

## PII マスキング

個人情報は自動的にマスクされます：

```tsx
logger.info('User data', {
  name: 'John Doe',           // → そのまま
  email: 'john@example.com', // → 'j***@example.com' 
  password: 'secret123',     // → '***MASKED***'
  creditCard: '1234-5678-9012-3456', // → '****-****-****-3456'
});
```

### 対象パターン
- メールアドレス
- クレジットカード番号
- 電話番号
- パスワード・トークン
- 機密なオブジェクトキー

## 既存システムとの統合

### Error Boundary との連携
既存の `AdvancedErrorBoundary` と自動連携します：

```tsx
// エラー境界でキャッチされたエラーは自動的にログシステムに送信される
window.__APP_LOGGER__.fatal('React Error Boundary triggered', errorDetails);
```

### パフォーマンス監視との統合
```tsx
import { useLogger } from './logging';
import { PerformanceTracker } from './utils/performance';

const tracker = PerformanceTracker.getInstance();
const logger = useLogger();

tracker.start('component-render');
// ... レンダリング処理
const duration = tracker.end('component-render');
logger.logPerformance('component-render', duration);
```

## ストレージ管理

### ログの確認
```tsx
import { StorageTransport } from './logging';

const storage = new StorageTransport();
const logs = storage.getStoredLogs();
console.log('Stored logs:', logs);
```

### ログのクリア
```tsx
storage.clearStoredLogs();
```

## 本番環境での使用

### API エンドポイント設定
```tsx
// HTTP Transport が送信するログ形式
POST /api/logs
{
  "logs": [
    {
      "level": "error",
      "message": "API request failed",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "context": { "status": 500 },
      "userId": "user123",
      "url": "https://app.example.com/dashboard",
      "userAgent": "Mozilla/5.0...",
      "errorId": "error-1704110400000-abc123"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://app.example.com/dashboard"
}
```

### 外部サービス連携
```tsx
// Sentry などの監視サービスとの統合例
import * as Sentry from '@sentry/react';

const sentryTransport = {
  send: (entry) => {
    if (entry.level === 'error' || entry.level === 'fatal') {
      Sentry.captureMessage(entry.message, entry.level, {
        extra: entry.context,
        tags: { component: entry.context?.component }
      });
    }
  }
};

logger.addTransport(sentryTransport);
```

## トラブルシューティング

### よくある問題

**ログが表示されない**
- LogProvider でアプリがラップされているか確認
- Transport の有効性とログレベル設定を確認

**パフォーマンスへの影響**
- HTTP Transport のバッチサイズ調整
- Storage Transport の最大保存件数調整
- 不要なログレベルの無効化

**PII マスキングの過剰**
- SENSITIVE_KEYS の調整
- カスタムマスキング関数の実装

### デバッグ方法
```tsx
// ロガーの状態確認
const stats = logger.getStats();
console.log('Logger stats:', stats);

// Transport の状態確認
const bufferSize = httpTransport.getBufferSize();
console.log('HTTP buffer size:', bufferSize);
```

## バンドルサイズへの影響

追加されたコード量:
- **gzip圧縮後**: 約 +3KB
- **未圧縮**: 約 +15KB

パフォーマンス:
- **ログ処理**: < 1ms/entry
- **PII マスキング**: < 0.5ms/entry
- **Storage書き込み**: 非同期、メインスレッドブロックなし