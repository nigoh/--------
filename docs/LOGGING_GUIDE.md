# Logging System Guide

## 概要

このプロジェクトには包括的なログシステムが実装されており、React + Viteアプリケーションでの効率的なログ管理を提供します。複数のトランスポート、PII（個人識別情報）マスキング、パフォーマンスログ機能を備えています。

## 🎯 主な機能

- **多層ログレベル**: trace, debug, info, warn, error, fatal
- **複数トランスポート**: Console, Storage, HTTP
- **PII自動マスキング**: 個人情報の自動検出と匿名化
- **React統合**: Context APIとカスタムフック
- **パフォーマンス計測**: 処理時間の自動追跡
- **開発/本番環境対応**: 環境別の設定制御

## 📁 ファイル構造

```text
src/logging/
├── index.ts                  # パブリックAPI
├── types.ts                  # 型定義
├── Logger.ts                 # コアロガークラス
├── LogProvider.tsx           # React Context Provider
├── transports/               # 出力先
│   ├── Transport.ts          # 基底クラス
│   ├── Console.ts            # コンソール出力
│   ├── Storage.ts            # ローカルストレージ
│   └── Http.ts               # HTTP送信
└── utils/
    └── maskPII.ts            # PII匿名化
```

## 🚀 基本的な使い方

### 1. アプリケーション全体での設定

```tsx
// App.tsx
import { LogProvider } from './logging';

function App() {
  return (
    <LogProvider 
      config={{
        enabledInProduction: true,
        enabledLevels: ['info', 'warn', 'error', 'fatal']
      }}
      enableHttpTransport={true}
      enableStorageTransport={true}
      endpoint="/api/logs"
    >
      {/* アプリケーションコンテンツ */}
    </LogProvider>
  );
}
```

### 2. コンポーネント内での使用

```tsx
import { useComponentLogger } from '../logging';

const MyComponent: React.FC = () => {
  const log = useComponentLogger('MyComponent');

  const handleClick = () => {
    log.info('ボタンがクリックされました', { 
      userId: user.id,
      timestamp: Date.now() 
    });
  };

  useEffect(() => {
    log.debug('コンポーネントがマウントされました');
    
    return () => {
      log.debug('コンポーネントがアンマウントされました');
    };
  }, [log]);

  return (
    <button onClick={handleClick}>
      クリック
    </button>
  );
};
```

## 📊 ログレベル

| レベル | 用途 | 例 |
|--------|------|-----|
| `trace` | 詳細なデバッグ情報 | 関数の入出力値 |
| `debug` | 開発時のデバッグ | 状態変化、条件分岐 |
| `info` | 一般的な情報 | ユーザーアクション、API呼び出し |
| `warn` | 警告 | 非推奨機能の使用、リソース不足 |
| `error` | エラー | 予期しない例外、API エラー |
| `fatal` | 致命的エラー | アプリケーション停止レベル |

### 使用例

```tsx
const log = useComponentLogger('UserRegistration');

// 情報ログ
log.info('ユーザー登録開始', { email: user.email });

// 警告ログ
log.warn('パスワード強度が弱いです', { strength: 'weak' });

// エラーログ
log.error('登録に失敗しました', { 
  error: error.message,
  userId: user.id 
});

// デバッグログ（開発環境のみ）
log.debug('バリデーション結果', { 
  isValid: true,
  errors: [] 
});
```

## 🎭 専用フック

### useActionLogger - ユーザーアクション追跡

```tsx
import { useActionLogger } from '../logging';

const MyComponent: React.FC = () => {
  const actionLogger = useActionLogger();

  const handleLogin = async (credentials) => {
    await actionLogger.logAction('user_login', async () => {
      // ログイン処理
      return await authenticateUser(credentials);
    }, { 
      email: credentials.email 
    });
  };

  return <LoginForm onSubmit={handleLogin} />;
};
```

### usePerformanceLogger - パフォーマンス計測

```tsx
import { usePerformanceLogger } from '../logging';

const DataProcessor: React.FC = () => {
  const perfLogger = usePerformanceLogger();

  const processLargeDataset = async () => {
    const timer = perfLogger.startTimer('data_processing');
    
    try {
      // 重い処理
      const result = await processData(largeDataset);
      
      timer.end({ 
        recordCount: largeDataset.length,
        success: true 
      });
      
      return result;
    } catch (error) {
      timer.end({ 
        recordCount: largeDataset.length,
        success: false,
        error: error.message 
      });
      throw error;
    }
  };

  return <DataTable onProcess={processLargeDataset} />;
};
```

## 🔒 PII マスキング

個人識別情報は自動的に検出・匿名化されます：

```tsx
log.info('ユーザー情報を更新', {
  email: 'user@example.com',      // → 'u***@example.com'
  phone: '090-1234-5678',         // → '090-****-5678'
  creditCard: '4111-1111-1111-1111', // → '4111-****-****-1111'
  name: '田中太郎'                  // → '田中**'
});
```

### カスタムマスキング

```tsx
import { maskPIIInObject } from '../logging';

const sensitiveData = {
  username: 'john_doe',
  password: 'secret123',
  personalId: '123-45-6789'
};

const maskedData = maskPIIInObject(sensitiveData, {
  username: (value) => value.substring(0, 2) + '***',
  password: () => '[REDACTED]',
  personalId: (value) => value.replace(/\d/g, '*')
});

log.info('ユーザーデータ処理', maskedData);
```

## 📤 トランスポート設定

### Console Transport（コンソール出力）

```tsx
import { ConsoleTransport } from '../logging';

const consoleTransport = new ConsoleTransport({
  enabled: true,
  colorize: true,          // カラー出力
  includeContext: true,    // コンテキスト情報表示
  level: 'debug'           // 最小ログレベル
});
```

### Storage Transport（ローカルストレージ）

```tsx
import { StorageTransport } from '../logging';

const storageTransport = new StorageTransport({
  enabled: true,
  maxEntries: 1000,        // 最大保存件数
  retentionDays: 7,        // 保持期間
  autoCleanup: true,       // 自動クリーンアップ
  level: 'info'
});
```

### HTTP Transport（サーバー送信）

```tsx
import { HttpTransport } from '../logging';

const httpTransport = new HttpTransport('/api/logs', {
  enabled: true,
  batchSize: 10,           // バッチサイズ
  flushInterval: 30000,    // 送信間隔（ms）
  retryAttempts: 3,        // リトライ回数
  level: 'warn'
});
```

## ⚙️ 設定オプション

### LoggerConfig

```tsx
interface LoggerConfig {
  enabledLevels?: LogLevel[];        // 有効なログレベル
  enabledInProduction?: boolean;     // 本番環境での有効化
  maxBufferSize?: number;            // バッファサイズ
  flushInterval?: number;            // フラッシュ間隔
}
```

### 環境別設定例

```tsx
// 開発環境
const devConfig = {
  enabledLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  enabledInProduction: false,
  maxBufferSize: 1000,
  flushInterval: 10000
};

// 本番環境
const prodConfig = {
  enabledLevels: ['warn', 'error', 'fatal'],
  enabledInProduction: true,
  maxBufferSize: 500,
  flushInterval: 30000
};
```

## 🛠️ 実装パターン

### エラーバウンダリでの使用

```tsx
import { useLogger } from '../logging';

class ErrorBoundary extends React.Component {
  private logger = new Logger([new ConsoleTransport(), new HttpTransport('/api/errors')]);

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.logger.fatal('React エラーバウンダリでエラーをキャッチ', {
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo.componentStack
    });
  }
}
```

### API呼び出しでの使用

```tsx
import { useComponentLogger } from '../logging';

const useAPI = () => {
  const log = useComponentLogger('API');

  const fetchData = async (endpoint: string) => {
    log.info('API呼び出し開始', { endpoint });
    
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        log.warn('API レスポンスエラー', { 
          endpoint, 
          status: response.status,
          statusText: response.statusText 
        });
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      log.info('API呼び出し成功', { 
        endpoint, 
        dataSize: JSON.stringify(data).length 
      });
      
      return data;
    } catch (error) {
      log.error('API呼び出し失敗', { 
        endpoint, 
        error: error.message 
      });
      throw error;
    }
  };

  return { fetchData };
};
```

### 状態管理（Zustand）での使用

```tsx
import { create } from 'zustand';
import { Logger } from '../logging';

const logger = new Logger([new ConsoleTransport()]);

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  
  setUser: (user) => {
    logger.info('ユーザー状態更新', { 
      previousUserId: get().user?.id,
      newUserId: user.id 
    });
    
    set({ user });
  }
}));
```

## 📈 ログ分析とモニタリング

### ローカルストレージからのログ取得

```tsx
import { StorageTransport } from '../logging';

const storage = new StorageTransport({});

// 全ログの取得
const allLogs = storage.getLogs();

// エラーログのみ取得
const errorLogs = storage.getLogs().filter(log => 
  log.level === 'error' || log.level === 'fatal'
);

// 期間指定でログ取得
const recentLogs = storage.getLogs().filter(log => {
  const logTime = new Date(log.timestamp);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return logTime > oneDayAgo;
});
```

### ログのエクスポート

```tsx
const exportLogs = () => {
  const logs = storage.getLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
};
```

## 🚨 ベストプラクティス

### 1. 適切なログレベルの選択

```tsx
// ✅ 良い例
log.debug('状態変化', { oldState, newState });        // デバッグ情報
log.info('ユーザーがログインしました', { userId });     // 重要なイベント
log.warn('APIレスポンスが遅いです', { duration });      // パフォーマンス警告
log.error('データ保存に失敗', { error, data });        // エラー

// ❌ 悪い例
log.error('ボタンがクリックされました');               // エラーレベルの誤用
log.info('変数の値', { value });                     // 過度な情報ログ
```

### 2. 構造化されたコンテキスト

```tsx
// ✅ 良い例
log.info('商品購入完了', {
  orderId: order.id,
  userId: user.id,
  totalAmount: order.total,
  paymentMethod: order.paymentMethod,
  timestamp: Date.now()
});

// ❌ 悪い例
log.info(`ユーザー${user.id}が商品${product.id}を${order.total}円で購入`);
```

### 3. PII情報の適切な処理

```tsx
// ✅ 良い例
log.info('ユーザー登録', {
  email: maskPII(user.email),           // マスク済み
  userId: user.id,                      // ID は安全
  registrationDate: user.createdAt
});

// ❌ 悪い例
log.info('ユーザー登録', {
  email: user.email,                    // 生の個人情報
  password: user.password,              // 機密情報
  creditCard: user.creditCardNumber
});
```

### 4. パフォーマンスログの効果的な使用

```tsx
// ✅ 良い例
const processData = async (data: any[]) => {
  const timer = perfLogger.startTimer('data_processing');
  
  try {
    const result = await heavyComputation(data);
    timer.end({ 
      inputSize: data.length,
      outputSize: result.length,
      success: true 
    });
    return result;
  } catch (error) {
    timer.end({ 
      inputSize: data.length,
      success: false,
      error: error.message 
    });
    throw error;
  }
};
```

## 🔧 デバッグとトラブルシューティング

### ログが表示されない場合

1. **環境設定の確認**

   ```tsx
   const config = {
     enabledInProduction: true,  // 本番環境で有効化
     enabledLevels: ['info', 'warn', 'error']
   };
   ```

2. **トランスポートの確認**

   ```tsx
   const logger = new Logger([
     new ConsoleTransport({ enabled: true, level: 'debug' })
   ]);
   ```

3. **ブラウザコンソールでの確認**

   ```javascript
   // ブラウザのデベロッパーコンソールで
   localStorage.getItem('app_logs'); // ストレージログの確認
   ```

### パフォーマンス最適化

1. **バッチング**: HTTP送信でバッチサイズを調整
2. **フィルタリング**: 本番環境では必要なレベルのみ有効化
3. **クリーンアップ**: ストレージの自動クリーンアップ設定

## 📚 関連ファイル

- `src/components/LoggingDemo.tsx` - 使用例のデモ
- `src/test/logging.test.ts` - ユニットテスト
- `docs/examples/` - 追加の使用例

このガイドにより、プロジェクトのログシステムを効果的に活用し、アプリケーションの監視とデバッグを改善できます。
