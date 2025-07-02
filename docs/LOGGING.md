# ログ機能実装ガイド

## 概要

React + Vite アプリケーション向けの包括的なログ機能が実装されました。複数のトランスポート、PIIマスキング、オフライン対応など、本格的な運用に対応した機能を提供します。

## 📁 ファイル構成

```
src/logging/
├── index.ts                    # 公開API
├── Logger.ts                   # メインのLoggerクラス
├── LogProvider.tsx             # React Context
├── types.ts                    # 型定義
├── transports/                 # トランスポート層
│   ├── Transport.ts           # 抽象基底クラス
│   ├── Console.ts             # コンソール出力
│   ├── Storage.ts             # IndexedDB保存
│   └── Http.ts                # HTTP API送信
└── utils/
    └── maskPII.ts             # PII自動マスク
```

## 🚀 基本的な使用方法

### 1. アプリケーションの設定

```typescript
// App.tsx
import { LogProvider } from './logging';

function App() {
  return (
    <LogProvider 
      endpoint="/api/logs"
      enableHttpTransport={import.meta.env.PROD}
      enableStorageTransport={true}
    >
      <YourAppContent />
    </LogProvider>
  );
}
```

### 2. コンポーネントでの使用

```typescript
import { useComponentLogger } from '../logging';

export const MyComponent: React.FC = () => {
  const log = useComponentLogger('MyComponent');
  
  const handleClick = () => {
    log.info('ボタンがクリックされました', { 
      buttonId: 'submit',
      timestamp: Date.now() 
    });
  };
  
  return <button onClick={handleClick}>送信</button>;
};
```

### 3. アクション追跡

```typescript
import { useActionLogger } from '../logging';

export const Navigation: React.FC = () => {
  const actionLogger = useActionLogger();
  
  const handleNavigate = (to: string) => {
    actionLogger.logNavigation(location.pathname, to, 'click');
  };
  
  return (
    <nav>
      <a onClick={() => handleNavigate('/profile')}>プロフィール</a>
    </nav>
  );
};
```

### 4. パフォーマンス監視

```typescript
import { usePerformanceLogger } from '../logging';

export const AsyncComponent: React.FC = () => {
  const perfLogger = usePerformanceLogger();
  
  const fetchData = async () => {
    const startTime = performance.now();
    
    try {
      const result = await api.getData();
      const duration = performance.now() - startTime;
      
      perfLogger.logAsyncOperation('api-getData', duration, true);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      perfLogger.logAsyncOperation('api-getData', duration, false);
      throw error;
    }
  };
  
  return <div>...</div>;
};
```

## 📊 ログレベル

| レベル | 説明 | 使用例 |
|--------|------|--------|
| `trace` | 詳細なデバッグ情報 | ループ内の変数状態 |
| `debug` | 開発時のデバッグ | API レスポンス内容 |
| `info` | 通常の情報ログ | ユーザーアクション完了 |
| `warn` | 警告（継続可能） | APIリトライ実行 |
| `error` | エラー（障害発生） | 例外キャッチ |
| `fatal` | 重大な障害 | アプリ停止レベル |

## 🔒 PIIマスキング機能

### 自動マスキング対象

- **メールアドレス**: `user@example.com` → `u**r@example.com`
- **電話番号**: `090-1234-5678` → `********5678`
- **クレジットカード**: `1234-5678-9012-3456` → `************3456`
- **パスワード系フィールド**: 完全に `***` に置換
- **日本の郵便番号**: `123-4567` → `***-****`

### カスタムマスキング

```typescript
import { maskPII, maskPIIInObject } from '../logging';

// 文字列のマスキング
const masked = maskPII('連絡先: user@example.com, 090-1234-5678');
// 結果: "連絡先: u**r@example.com, ********5678"

// オブジェクトのマスキング
const data = {
  email: 'user@example.com',
  password: 'secret123',
  phone: '090-1234-5678'
};
const maskedData = maskPIIInObject(data);
// 結果: { email: 'u**r@example.com', password: '***', phone: '********5678' }
```

## 🌐 トランスポート設定

### Console Transport（開発用）

```typescript
new ConsoleTransport({
  colorize: import.meta.env.DEV,      // カラー出力
  includeContext: import.meta.env.DEV  // コンテキスト表示
});
```

### Storage Transport（オフライン対応）

```typescript
new StorageTransport({
  maxEntries: 1000,        // 最大保存件数
  retentionDays: 7,        // 保持期間（日）
  autoCleanup: true        // 自動クリーンアップ
});
```

### HTTP Transport（API送信）

```typescript
new HttpTransport('/api/logs', {
  batchSize: 10,           // バッチサイズ
  flushInterval: 30000,    // 送信間隔（ms）
  maxRetries: 3,           // 最大リトライ回数
  enablePIIMasking: true   // PII自動マスク
});
```

## 🎛️ 設定オプション

### Logger設定

```typescript
<LogProvider
  config={{
    enabledLevels: ['info', 'warn', 'error', 'fatal'],
    enabledInProduction: true,
    maxBufferSize: 1000,
    flushInterval: 30000
  }}
  endpoint="/api/logs"
  enableHttpTransport={import.meta.env.PROD}
  enableStorageTransport={true}
>
```

### 環境別設定

```typescript
// 開発環境: 全レベル出力、コンソール中心
// 本番環境: INFO以上、HTTP送信中心、PII保護強化
const isDev = import.meta.env.DEV;

const config = {
  enabledLevels: isDev 
    ? ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    : ['info', 'warn', 'error', 'fatal'],
  enabledInProduction: !isDev
};
```

## 📱 デモ機能

開発環境では「ログ機能デモ」が利用可能で、以下の機能をテストできます：

- 全ログレベルのテスト
- PII自動マスキングのデモ
- パフォーマンス測定
- エラーシミュレーション
- 機能一覧の確認

## 🔧 API仕様

### バックエンドAPI期待形式

```typescript
POST /api/logs
Content-Type: application/json

{
  "logs": [
    {
      "level": "info",
      "message": "User action performed",
      "timestamp": "2025-01-02T16:43:58.123Z",
      "context": { "userId": "123", "action": "click" },
      "sessionId": "session_1704466438123_abc123",
      "userAgent": "Mozilla/5.0...",
      "url": "https://example.com/page"
    }
  ],
  "timestamp": "2025-01-02T16:43:58.123Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com/page"
}
```

## 📈 パフォーマンス

- **バンドルサイズ影響**: +2.26KB (gzip)
- **ログ処理時間**: <1ms/イベント
- **メモリ使用量**: 自動クリーンアップ機能付き
- **ネットワーク効率**: バッチ処理によるリクエスト削減

## 🛡️ セキュリティ

- PII自動検出・マスク機能
- パスワード系フィールドの完全保護
- HTTPS通信必須（本番環境）
- ローカルストレージの暗号化検討

## 🔄 今後の拡張予定

- Session Replay連携
- 分析基盤（BigQuery）パイプライン
- Sentry/DataDog連携
- リアルタイムアラート機能

## 📞 サポート

実装に関する質問やバグ報告は、GitHubのIssueまたはプルリクエストでお知らせください。