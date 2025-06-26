# フェーズ 4: QA・リリース設計書

**期間**: 9/3–9/23  
**マイルストーン**: 本番環境デプロイ・品質保証

---

## 1. 目標

- 全機能の包括的テスト実施
- 本番環境での安定稼働確認
- セキュリティ監査実施
- パフォーマンス最適化
- 正式リリース実施
- ユーザードキュメント整備

---

## 2. 開発スケジュール

### 2.1 Week 1 (9/3-9/9): 総合テスト

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 9/3-9/4 | 単体テスト完全実施 | 全コンポーネント・関数テスト | Dev |
| 9/5-9/6 | 結合テスト実施 | API連携・画面遷移テスト | QA |
| 9/7-9/8 | E2Eテスト実施 | ユーザーシナリオテスト | QA |
| 9/9 | テスト結果集約 | テストレポート作成 | QA |

### 2.2 Week 2 (9/10-9/16): 本番環境準備

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 9/10-9/11 | 本番Firebase設定 | プロダクション環境構築 | DevOps |
| 9/12-9/13 | CI/CDパイプライン構築 | 自動デプロイ設定 | DevOps |
| 9/14-9/15 | セキュリティ監査 | セキュリティレポート | Security |
| 9/16 | 本番環境テスト | 本番動作確認 | QA |

### 2.3 Week 3 (9/17-9/23): リリース・ドキュメント

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 9/17-9/18 | ユーザーマニュアル作成 | 操作手順書 | Tech Writer |
| 9/19-9/20 | 管理者マニュアル作成 | 運用手順書 | Tech Writer |
| 9/21-9/22 | 正式リリース | 本番サービス開始 | PM |
| 9/23 | リリース後監視 | 動作監視・問題対応 | DevOps |

---

## 3. テスト戦略

### 3.1 単体テスト実装

#### 3.1.1 React コンポーネントテスト

```typescript
// src/__tests__/components/AttendanceButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AttendanceButton } from '../components/AttendanceButton';
import { useAttendanceStore } from '../stores/useAttendanceStore';

// モック
vi.mock('../stores/useAttendanceStore');

const mockUseAttendanceStore = vi.mocked(useAttendanceStore);

describe('AttendanceButton', () => {
  beforeEach(() => {
    mockUseAttendanceStore.mockReturnValue({
      currentStatus: 'notClockedIn',
      loading: false,
      clockIn: vi.fn(),
      clockOut: vi.fn(),
      startBreak: vi.fn(),
      endBreak: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('未出勤時に出勤ボタンが表示される', () => {
    render(<AttendanceButton />);
    
    expect(screen.getByText('出勤')).toBeInTheDocument();
    expect(screen.getByTestId('clock-in-button')).toBeInTheDocument();
  });

  test('出勤ボタンクリックで打刻処理が実行される', async () => {
    const mockClockIn = vi.fn();
    mockUseAttendanceStore.mockReturnValue({
      currentStatus: 'notClockedIn',
      loading: false,
      clockIn: mockClockIn,
      clockOut: vi.fn(),
      startBreak: vi.fn(),
      endBreak: vi.fn(),
    });

    render(<AttendanceButton />);
    
    fireEvent.click(screen.getByTestId('clock-in-button'));
    
    await waitFor(() => {
      expect(mockClockIn).toHaveBeenCalledTimes(1);
    });
  });

  test('出勤中は退勤・休憩開始ボタンが表示される', () => {
    mockUseAttendanceStore.mockReturnValue({
      currentStatus: 'working',
      loading: false,
      clockIn: vi.fn(),
      clockOut: vi.fn(),
      startBreak: vi.fn(),
      endBreak: vi.fn(),
    });

    render(<AttendanceButton />);
    
    expect(screen.getByText('退勤')).toBeInTheDocument();
    expect(screen.getByText('休憩開始')).toBeInTheDocument();
  });

  test('ローディング中はボタンが無効化される', () => {
    mockUseAttendanceStore.mockReturnValue({
      currentStatus: 'notClockedIn',
      loading: true,
      clockIn: vi.fn(),
      clockOut: vi.fn(),
      startBreak: vi.fn(),
      endBreak: vi.fn(),
    });

    render(<AttendanceButton />);
    
    expect(screen.getByTestId('clock-in-button')).toBeDisabled();
  });
});
```

#### 3.1.2 Zustand ストアテスト

```typescript
// src/__tests__/stores/useAttendanceStore.test.ts
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAttendanceStore } from '../stores/useAttendanceStore';
import { attendanceService } from '../services/attendance.service';

// モック
vi.mock('../services/attendance.service');

const mockAttendanceService = vi.mocked(attendanceService);

describe('useAttendanceStore', () => {
  beforeEach(() => {
    // ストアをリセット
    useAttendanceStore.getState().reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useAttendanceStore());
    
    expect(result.current.currentStatus).toBe('notClockedIn');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.todayRecord).toBeNull();
  });

  test('出勤処理が正常に動作する', async () => {
    const mockRecord = {
      id: '1',
      userId: 'user1',
      date: '2024-01-15',
      clockInTime: '09:00:00',
      status: 'working',
    };

    mockAttendanceService.clockIn.mockResolvedValue(mockRecord);

    const { result } = renderHook(() => useAttendanceStore());

    await act(async () => {
      await result.current.clockIn();
    });

    expect(mockAttendanceService.clockIn).toHaveBeenCalledTimes(1);
    expect(result.current.currentStatus).toBe('working');
    expect(result.current.todayRecord).toEqual(mockRecord);
  });

  test('出勤処理でエラーが発生した場合の処理', async () => {
    const errorMessage = '位置情報の取得に失敗しました';
    mockAttendanceService.clockIn.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAttendanceStore());

    await act(async () => {
      await result.current.clockIn();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.currentStatus).toBe('notClockedIn');
  });

  test('退勤処理が正常に動作する', async () => {
    const mockRecord = {
      id: '1',
      userId: 'user1',
      date: '2024-01-15',
      clockInTime: '09:00:00',
      clockOutTime: '18:00:00',
      status: 'clockedOut',
      workMinutes: 480,
    };

    mockAttendanceService.clockOut.mockResolvedValue(mockRecord);

    const { result } = renderHook(() => useAttendanceStore());

    // 出勤状態に設定
    act(() => {
      result.current.setCurrentStatus('working');
    });

    await act(async () => {
      await result.current.clockOut();
    });

    expect(mockAttendanceService.clockOut).toHaveBeenCalledTimes(1);
    expect(result.current.currentStatus).toBe('clockedOut');
    expect(result.current.todayRecord).toEqual(mockRecord);
  });
});
```

#### 3.1.3 Firebase サービステスト

```typescript
// src/__tests__/services/attendance.service.test.ts
import { vi } from 'vitest';
import { attendanceService } from '../services/attendance.service';
import { firestore } from '../lib/firebase';

// Firebase モック
vi.mock('../lib/firebase', () => ({
  firestore: {
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
  },
  auth: {
    currentUser: { uid: 'test-user-id' },
  },
}));

describe('AttendanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('出勤処理が正常に動作する', async () => {
    const mockLocation = { latitude: 35.6762, longitude: 139.6503 };
    const mockDocRef = { id: 'attendance-id-1' };
    
    vi.spyOn(global.navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((success) => success({
        coords: mockLocation,
      } as GeolocationPosition));

    vi.mocked(firestore.addDoc).mockResolvedValue(mockDocRef as any);

    const result = await attendanceService.clockIn();

    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'test-user-id',
        clockInTime: expect.any(String),
        location: mockLocation,
        status: 'working',
      })
    );

    expect(result.id).toBe('attendance-id-1');
    expect(result.status).toBe('working');
  });

  test('位置情報取得に失敗した場合のエラー処理', async () => {
    vi.spyOn(global.navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((_, error) => error({
        code: 1,
        message: 'Permission denied',
      } as GeolocationPositionError));

    await expect(attendanceService.clockIn()).rejects.toThrow(
      '位置情報の取得に失敗しました'
    );
  });

  test('月次勤怠データの取得が正常に動作する', async () => {
    const mockAttendanceData = [
      {
        id: '1',
        date: '2024-01-15',
        clockInTime: '09:00:00',
        clockOutTime: '18:00:00',
        workMinutes: 480,
      },
      {
        id: '2',
        date: '2024-01-16',
        clockInTime: '09:15:00',
        clockOutTime: '18:30:00',
        workMinutes: 495,
      },
    ];

    const mockQuerySnapshot = {
      docs: mockAttendanceData.map(data => ({
        id: data.id,
        data: () => data,
      })),
    };

    vi.mocked(firestore.getDocs).mockResolvedValue(mockQuerySnapshot as any);

    const result = await attendanceService.getMonthlyAttendance(2024, 1);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].workMinutes).toBe(495);
  });
});
```

### 3.2 E2Eテスト実装

#### 3.2.1 Playwright 設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### 3.2.2 勤怠打刻E2Eテスト

```typescript
// e2e/attendance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('勤怠打刻機能', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/');
    await page.click('[data-testid="github-login-button"]');
    
    // GitHub OAuth フローをモック
    await page.route('**/api/auth/github', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { uid: 'test-user', name: 'テストユーザー' },
          token: 'mock-token'
        }),
      });
    });
    
    await page.waitForLoadState('networkidle');
  });

  test('出勤から退勤までの基本フロー', async ({ page }) => {
    // 出勤ボタンが表示されることを確認
    await expect(page.locator('[data-testid="clock-in-button"]')).toBeVisible();
    
    // 位置情報許可をモック
    await page.context().grantPermissions(['geolocation']);
    await page.setGeolocation({ latitude: 35.6762, longitude: 139.6503 });
    
    // 出勤ボタンをクリック
    await page.click('[data-testid="clock-in-button"]');
    
    // 出勤完了の確認
    await expect(page.locator('[data-testid="status-working"]')).toBeVisible();
    await expect(page.locator('[data-testid="clock-out-button"]')).toBeVisible();
    
    // 現在時刻が表示されることを確認
    await expect(page.locator('[data-testid="current-time"]')).toBeVisible();
    
    // 退勤ボタンをクリック
    await page.click('[data-testid="clock-out-button"]');
    
    // 退勤確認ダイアログが表示される
    await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible();
    await page.click('[data-testid="confirm-button"]');
    
    // 退勤完了の確認
    await expect(page.locator('[data-testid="status-clocked-out"]')).toBeVisible();
    
    // 勤務時間が表示されることを確認
    await expect(page.locator('[data-testid="work-time"]')).toBeVisible();
  });

  test('休憩機能のテスト', async ({ page }) => {
    // 出勤
    await page.context().grantPermissions(['geolocation']);
    await page.click('[data-testid="clock-in-button"]');
    await page.waitForSelector('[data-testid="status-working"]');
    
    // 休憩開始
    await page.click('[data-testid="break-start-button"]');
    await expect(page.locator('[data-testid="status-on-break"]')).toBeVisible();
    await expect(page.locator('[data-testid="break-end-button"]')).toBeVisible();
    
    // 休憩時間が表示されることを確認
    await expect(page.locator('[data-testid="break-time"]')).toBeVisible();
    
    // 休憩終了
    await page.click('[data-testid="break-end-button"]');
    await expect(page.locator('[data-testid="status-working"]')).toBeVisible();
  });

  test('位置情報が取得できない場合のエラー処理', async ({ page }) => {
    // 位置情報を拒否
    await page.context().clearPermissions();
    
    await page.click('[data-testid="clock-in-button"]');
    
    // エラーメッセージが表示される
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('位置情報');
  });
});
```

#### 3.2.3 休暇申請E2Eテスト

```typescript
// e2e/vacation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('休暇申請機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ログイン処理（省略）
    
    // 休暇申請ページに移動
    await page.click('[data-testid="vacation-menu"]');
    await page.waitForLoadState('networkidle');
  });

  test('年次有給休暇の申請フロー', async ({ page }) => {
    // 新規申請ボタンをクリック
    await page.click('[data-testid="new-vacation-request"]');
    
    // 申請フォームが表示される
    await expect(page.locator('[data-testid="vacation-request-form"]')).toBeVisible();
    
    // 休暇種別を選択
    await page.selectOption('[data-testid="vacation-type"]', 'annual');
    
    // 開始日を選択
    await page.fill('[data-testid="start-date"]', '2024-02-01');
    
    // 終了日を選択
    await page.fill('[data-testid="end-date"]', '2024-02-02');
    
    // 理由を入力
    await page.fill('[data-testid="reason"]', '私用のため');
    
    // 取得日数が自動計算されることを確認
    await expect(page.locator('[data-testid="vacation-days"]')).toContainText('2日');
    
    // 申請ボタンをクリック
    await page.click('[data-testid="submit-request"]');
    
    // 申請完了メッセージが表示される
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // 申請一覧に追加されることを確認
    await expect(page.locator('[data-testid="vacation-list"]')).toContainText('2024-02-01');
  });

  test('休暇残日数を超過した場合のエラー処理', async ({ page }) => {
    await page.click('[data-testid="new-vacation-request"]');
    
    // 残日数を超える期間を設定
    await page.selectOption('[data-testid="vacation-type"]', 'annual');
    await page.fill('[data-testid="start-date"]', '2024-02-01');
    await page.fill('[data-testid="end-date"]', '2024-02-28'); // 20日を超過
    
    // エラーメッセージが表示される
    await expect(page.locator('[data-testid="error-message"]')).toContainText('残り日数を超過');
    
    // 申請ボタンが無効化される
    await expect(page.locator('[data-testid="submit-request"]')).toBeDisabled();
  });
});
```

### 3.3 性能テスト

#### 3.3.1 Lighthouse CI設定

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.8}],
        "categories:pwa": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### 3.3.2 バンドルサイズ分析

```typescript
// scripts/analyze-bundle.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
        }),
      ],
    },
  },
});
```

---

## 4. セキュリティ監査

### 4.1 セキュリティチェックリスト

#### 4.1.1 認証・認可

- [ ] GitHub OAuth設定の確認
- [ ] JWT トークンの適切な管理
- [ ] セッション管理の実装確認
- [ ] 権限ベースアクセス制御の確認

#### 4.1.2 データ保護

- [ ] Firebase Security Rules の監査
- [ ] 個人情報の暗号化確認
- [ ] データ入力値検証の実装確認
- [ ] SQLインジェクション対策確認

#### 4.1.3 通信セキュリティ

- [ ] HTTPS強制の確認
- [ ] CORS設定の確認
- [ ] CSP（Content Security Policy）設定
- [ ] セキュリティヘッダーの設定確認

#### 4.1.4 クライアントサイドセキュリティ

- [ ] XSS対策の実装確認
- [ ] 機密情報のクライアント側保存回避
- [ ] 入力値サニタイゼーションの確認
- [ ] 依存関係の脆弱性チェック

### 4.2 セキュリティテストスクリプト

```bash
#!/bin/bash
# scripts/security-check.sh

echo "=== セキュリティチェック開始 ==="

# 依存関係の脆弱性チェック
echo "1. 依存関係の脆弱性チェック"
npm audit --audit-level=moderate

# Firebase Security Rules テスト
echo "2. Firebase Security Rules テスト"
firebase emulators:exec --only firestore "npm run test:security-rules"

# Lighthouse セキュリティ監査
echo "3. Lighthouse セキュリティ監査"
npx lighthouse --only-categories=best-practices --output=json --output-path=./security-audit.json http://localhost:5173

# OWASP ZAP セキュリティスキャン
echo "4. OWASP ZAP セキュリティスキャン"
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:5173

echo "=== セキュリティチェック完了 ==="
```

---

## 5. 本番環境設定

### 5.1 Firebase本番環境設定

```typescript
// src/config/firebase.prod.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, 'asia-northeast1');

// 本番環境では Emulator に接続しない
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

### 5.2 CI/CD パイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
```

### 5.3 環境変数設定

```bash
# .env.production
VITE_FIREBASE_API_KEY=prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=timecard-app-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=timecard-app-prod
VITE_FIREBASE_STORAGE_BUCKET=timecard-app-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_VAPID_PUBLIC_KEY=BH4...
VITE_API_BASE_URL=https://asia-northeast1-timecard-app-prod.cloudfunctions.net
```

---

## 6. 監視・ログ設定

### 6.1 エラー監視設定

```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // 本番環境でのみSentryに送信
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }
    return event;
  },
});

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
```

### 6.2 アナリティクス設定

```typescript
// src/utils/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    logEvent(analytics, eventName, parameters);
  }
};

// 勤怠イベント追跡
export const trackAttendanceEvent = (action: 'clock_in' | 'clock_out' | 'break_start' | 'break_end') => {
  trackEvent('attendance_action', {
    action,
    timestamp: new Date().toISOString(),
  });
};

// 休暇申請イベント追跡
export const trackVacationEvent = (action: 'request' | 'approve' | 'reject', type: string) => {
  trackEvent('vacation_action', {
    action,
    vacation_type: type,
    timestamp: new Date().toISOString(),
  });
};
```

---

## 7. ユーザードキュメント

### 7.1 操作マニュアル目次

1. **はじめに**
   - システム概要
   - 動作環境
   - ログイン方法

2. **基本操作**
   - 勤怠打刻
   - 休憩時間管理
   - 勤怠履歴確認

3. **休暇申請**
   - 休暇申請方法
   - 申請状況確認
   - 休暇残日数確認

4. **レポート機能**
   - 月次レポート閲覧
   - CSV出力方法
   - データの見方

5. **設定**
   - プロフィール設定
   - 通知設定
   - 言語設定

6. **トラブルシューティング**
   - よくある問題
   - エラーメッセージ一覧
   - お問い合わせ方法

### 7.2 管理者マニュアル目次

1. **管理者機能概要**
   - 権限と責任
   - 管理画面アクセス方法

2. **ユーザー管理**
   - ユーザー追加・削除
   - 権限設定
   - 組織構造管理

3. **勤怠管理**
   - 勤怠データ確認
   - 修正・承認処理
   - 異常データ対応

4. **休暇管理**
   - 休暇申請承認
   - 休暇残日数管理
   - 休暇設定変更

5. **システム設定**
   - 勤務時間設定
   - 休日設定
   - 通知設定

6. **運用・保守**
   - データバックアップ
   - ログ確認
   - 障害対応

---

## 8. 完了条件

### 8.1 テスト完了条件

- [ ] 単体テストカバレッジ 90% 以上
- [ ] 結合テスト全項目PASS
- [ ] E2Eテスト全シナリオPASS
- [ ] 性能テスト基準値クリア
- [ ] セキュリティ監査完了

### 8.2 本番環境完了条件

- [ ] 本番Firebase環境構築完了
- [ ] CI/CDパイプライン構築完了
- [ ] SSL証明書設定完了
- [ ] ドメイン設定完了
- [ ] 監視・アラート設定完了

### 8.3 ドキュメント完了条件

- [ ] ユーザーマニュアル作成完了
- [ ] 管理者マニュアル作成完了
- [ ] API仕様書更新完了
- [ ] 運用手順書作成完了

### 8.4 リリース完了条件

- [ ] 本番環境での動作確認完了
- [ ] ステークホルダー承認取得
- [ ] ユーザー研修実施完了
- [ ] 正式サービス開始

---

## 9. 次フェーズへの引き継ぎ

- 本番環境での安定稼働確認結果
- 初期ユーザーフィードバック収集
- 性能・セキュリティ監査結果
- 運用開始後の改善点リスト
- Phase 5（運用フェーズ）への準備状況
