# フェーズ 1: 設計フェーズ詳細設計書

**期間**: 7/2–7/15  
**マイルストーン**: ワイヤーフレーム & データモデル確定

---

## 1. 目標

- UI/UXワイヤーフレーム完成
- データベーススキーマ確定
- APIエンドポイント設計完成
- セキュリティルール設計完成
- 画面遷移設計完成

---

## 2. ワイヤーフレーム設計

### 2.1 画面一覧

| 画面パス | 画面名 | 権限 | 主要機能 |
|---------|--------|------|----------|
| `/login` | ログイン画面 | 未認証 | GitHub OAuth認証 |
| `/dashboard` | ダッシュボード | 認証済み | 本日の勤怠状況・打刻ボタン |
| `/attendance` | 勤怠履歴 | 認証済み | 個人の勤怠履歴表示・編集 |
| `/overtime` | 残業申請 | 認証済み | 残業申請・承認状況確認 |
| `/vacation` | 休暇申請 | 認証済み | 休暇申請・残日数確認 |
| `/admin/users` | ユーザー管理 | 管理者 | 社員情報・権限管理 |
| `/admin/attendance` | 勤怠管理 | 管理者 | 全社員勤怠確認・承認 |
| `/admin/reports` | レポート | 管理者 | 月次集計・CSV出力 |

### 2.2 画面詳細設計

#### 2.2.1 ダッシュボード (`/dashboard`)

```
┌─────────────────────────────────────────┐
│ [Header] Timecard App    [User Menu]    │
├─────────────────────────────────────────┤
│                                         │
│  今日の勤怠: 2025/07/15 (月)             │
│  ┌─────────────────────────────────────┐ │
│  │ 出勤: 09:00  │ 退勤: --:--        │ │
│  │ 休憩: --:--  │ 復帰: --:--        │ │
│  │ 実働時間: 2h 30m                   │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │  出勤   │ │  休憩   │ │  退勤   │    │
│  │ 09:00   │ │ 開始/終了│ │ 18:00   │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│  今月の状況:                             │
│  - 出勤日数: 15日                        │
│  - 総労働時間: 120h 30m                  │
│  - 残業時間: 20h 15m                     │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 申請待ち:                            │ │
│  │ • 残業申請 (7/14) - 承認待ち         │ │
│  │ • 有給申請 (7/20-7/21) - 承認待ち    │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### 2.2.2 勤怠履歴画面 (`/attendance`)

```
┌─────────────────────────────────────────┐
│ 勤怠履歴                 [月選択: 7月]    │
├─────────────────────────────────────────┤
│ [フィルタ] 状態: 全て ▼  期間: 今月 ▼    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │日付  │出勤 │退勤 │休憩│実働 │状態  │操作│ │
│ ├─────────────────────────────────────┤ │
│ │7/15 │09:00│18:30│60m│8h30m│承認済│表示│ │
│ │7/14 │09:15│19:00│60m│9h45m│承認済│表示│ │
│ │7/13 │09:00│--:--│--m│--h--│未完了│編集│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 合計: 出勤15日 / 実働120h30m / 残業20h15m │
│                                         │
│ [CSV出力] [修正申請]                     │
└─────────────────────────────────────────┘
```

#### 2.2.3 残業申請画面 (`/overtime`)

```
┌─────────────────────────────────────────┐
│ 残業申請                                 │
├─────────────────────────────────────────┤
│ 新規申請                                 │
│ ┌─────────────────────────────────────┐ │
│ │ 対象日: [2025/07/15] ▼              │ │
│ │ 開始時間: [18:00] ▼                 │ │
│ │ 終了予定: [20:00] ▼                 │ │
│ │ 残業時間: 2時間                      │ │
│ │                                    │ │
│ │ 理由:                               │ │
│ │ ┌────────────────────────────────┐   │ │
│ │ │プロジェクト納期対応のため            │   │ │
│ │ │                                │   │ │
│ │ └────────────────────────────────┘   │ │
│ │                                    │ │
│ │         [申請] [クリア]              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 申請履歴                                 │
│ ┌─────────────────────────────────────┐ │
│ │日付  │時間  │理由        │状態   │操作│ │
│ ├─────────────────────────────────────┤ │
│ │7/14 │2h   │納期対応     │承認済 │表示│ │
│ │7/13 │1.5h │会議延長     │承認済 │表示│ │
│ │7/12 │3h   │バグ修正     │承認待ち│取消│ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. データベーススキーマ設計

### 3.1 Firestore コレクション構造

#### 3.1.1 users コレクション
```typescript
interface User {
  uid: string;           // document ID
  name: string;          // 表示名
  email: string;         // メールアドレス
  role: 'employee' | 'admin' | 'manager'; // 権限
  team: string;          // 所属チーム
  employeeId?: string;   // 社員番号
  startDate: string;     // 入社日 (YYYY-MM-DD)
  isActive: boolean;     // アクティブ状態
  settings: {
    timezone: string;    // タイムゾーン
    language: string;    // 言語設定
    notifications: boolean; // 通知設定
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 3.1.2 attendance コレクション
```typescript
interface Attendance {
  id: string;            // document ID (auto-generated)
  uid: string;           // ユーザーID
  date: string;          // 勤怠日 (YYYY-MM-DD)
  clockIn?: Timestamp;   // 出勤時刻
  clockOut?: Timestamp;  // 退勤時刻
  breakStart?: Timestamp; // 休憩開始
  breakEnd?: Timestamp;   // 休憩終了
  breakMinutes: number;   // 休憩時間（分）
  workMinutes: number;    // 実働時間（分）
  overtimeMinutes: number; // 残業時間（分）
  status: 'pending' | 'approved' | 'rejected'; // 承認状態
  note?: string;          // 備考
  location?: {            // 打刻場所
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;
}
```

#### 3.1.3 overtimeRequests コレクション
```typescript
interface OvertimeRequest {
  id: string;            // document ID
  uid: string;           // 申請者ID
  date: string;          // 対象日 (YYYY-MM-DD)
  startTime: Timestamp;  // 残業開始時刻
  endTime: Timestamp;    // 残業終了予定時刻
  actualEndTime?: Timestamp; // 実際の終了時刻
  minutes: number;       // 予定残業時間（分）
  actualMinutes?: number; // 実際の残業時間（分）
  reason: string;        // 残業理由
  status: 'pending' | 'approved' | 'rejected'; // 承認状態
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;   // 承認者ID
  rejectionReason?: string; // 却下理由
}
```

#### 3.1.4 vacations コレクション
```typescript
interface Vacation {
  id: string;            // document ID
  uid: string;           // 申請者ID
  type: 'annual' | 'sick' | 'special' | 'maternity' | 'paternity'; // 休暇種別
  startDate: string;     // 開始日 (YYYY-MM-DD)
  endDate: string;       // 終了日 (YYYY-MM-DD)
  days: number;          // 取得日数
  reason?: string;       // 理由
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;
  rejectionReason?: string;
}
```

#### 3.1.5 settings コレクション (システム設定)
```typescript
interface SystemSettings {
  id: 'company';         // 固定ID
  companyName: string;   // 会社名
  workingHours: {
    start: string;       // 標準出勤時刻 (HH:mm)
    end: string;         // 標準退勤時刻 (HH:mm)
    breakMinutes: number; // 標準休憩時間（分）
  };
  overtime: {
    threshold: number;   // 残業開始時刻（分）
    maxDaily: number;    // 1日の最大残業時間（分）
    maxMonthly: number;  // 月の最大残業時間（分）
  };
  vacation: {
    annual: number;      // 年次有給日数
    carryOver: number;   // 繰越可能日数
  };
  updatedAt: Timestamp;
}
```

### 3.2 インデックス設計

```javascript
// Firestore Indexes
{
  "attendance": [
    { "uid": "asc", "date": "desc" },
    { "date": "asc", "status": "asc" },
    { "uid": "asc", "status": "asc", "date": "desc" }
  ],
  "overtimeRequests": [
    { "uid": "asc", "date": "desc" },
    { "status": "asc", "createdAt": "desc" },
    { "uid": "asc", "status": "asc" }
  ],
  "vacations": [
    { "uid": "asc", "startDate": "desc" },
    { "status": "asc", "createdAt": "desc" }
  ]
}
```

---

## 4. API設計

### 4.1 Cloud Functions エンドポイント

#### 4.1.1 勤怠関連API
```typescript
// 打刻処理
export const clockIn = onCall(async (request) => {
  // 出勤打刻の処理
  // 位置情報取得・重複チェック・データ保存
});

export const clockOut = onCall(async (request) => {
  // 退勤打刻・労働時間計算
});

export const updateAttendance = onCall(async (request) => {
  // 勤怠修正（管理者のみ）
});

// 月次集計
export const getMonthlyReport = onCall(async (request) => {
  // 指定月の勤怠集計データ取得
});
```

#### 4.1.2 承認関連API
```typescript
// 残業申請承認
export const approveOvertime = onCall(async (request) => {
  // 残業申請の承認・却下処理
});

// 休暇申請承認
export const approveVacation = onCall(async (request) => {
  // 休暇申請の承認・却下処理
});

// 一括承認
export const bulkApprove = onCall(async (request) => {
  // 複数申請の一括承認
});
```

#### 4.1.3 管理者機能API
```typescript
// ユーザー権限変更
export const updateUserRole = onCall(async (request) => {
  // 管理者権限での権限変更
});

// CSV出力
export const exportAttendanceCSV = onCall(async (request) => {
  // 勤怠データのCSV出力
});

// データ集計
export const getTeamReport = onCall(async (request) => {
  // チーム別勤怠集計
});
```

### 4.2 リアルタイム更新設計

```typescript
// 申請状況のリアルタイム監視
const useOvertimeRequestListener = (uid: string) => {
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'overtimeRequests'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as OvertimeRequest[];
        setRequests(data);
      }
    );
    
    return unsubscribe;
  }, [uid]);
  
  return requests;
};
```

---

## 5. セキュリティルール設計

### 5.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー情報
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
    }
    
    // 勤怠データ
    match /attendance/{attendanceId} {
      allow read: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.uid;
      allow update: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // 残業申請
    match /overtimeRequests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.uid;
      allow update: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
    }
    
    // 休暇申請
    match /vacations/{vacationId} {
      allow read: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.uid;
      allow update: if request.auth != null && 
        (resource.data.uid == request.auth.uid || isAdmin());
    }
    
    // システム設定（読み取りのみ）
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // 管理者権限チェック関数
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 6. 画面遷移設計

### 6.1 ルーティング設計

```typescript
// App.tsx でのルート定義
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "overtime",
        element: <OvertimePage />,
      },
      {
        path: "vacation",
        element: <VacationPage />,
      },
      {
        path: "admin",
        element: <AdminProtectedRoute />,
        children: [
          {
            path: "users",
            element: <AdminUsersPage />,
          },
          {
            path: "attendance",
            element: <AdminAttendancePage />,
          },
          {
            path: "reports",
            element: <AdminReportsPage />,
          },
        ],
      },
    ],
  },
]);
```

### 6.2 権限管理

```typescript
// ProtectedRoute コンポーネント
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <Outlet />;
};

// AdminProtectedRoute コンポーネント
const AdminProtectedRoute: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) return <Navigate to="/dashboard" />;
  
  return <Outlet />;
};
```

---

## 7. 状態管理設計

### 7.1 Zustand ストア構造

```typescript
// src/stores/useAuthStore.ts
interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (provider: AuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// src/stores/useAttendanceStore.ts
interface AttendanceStore {
  todayAttendance: Attendance | null;
  monthlyAttendance: Attendance[];
  loading: boolean;
  clockIn: (location?: GeolocationPosition) => Promise<void>;
  clockOut: () => Promise<void>;
  updateAttendance: (id: string, data: Partial<Attendance>) => Promise<void>;
  fetchMonthlyData: (year: number, month: number) => Promise<void>;
}

// src/stores/useOvertimeStore.ts
interface OvertimeStore {
  requests: OvertimeRequest[];
  loading: boolean;
  submitRequest: (data: CreateOvertimeRequest) => Promise<void>;
  updateRequest: (id: string, data: Partial<OvertimeRequest>) => Promise<void>;
  fetchRequests: () => Promise<void>;
}
```

---

## 8. 完了条件

### 8.1 設計ドキュメント
- [ ] 全画面のワイヤーフレーム完成
- [ ] データベーススキーマ定義完了
- [ ] API仕様書作成完了
- [ ] セキュリティルール設計完了
- [ ] 画面遷移図作成完了

### 8.2 技術仕様
- [ ] TypeScript型定義ファイル作成
- [ ] Zustand ストア設計完了
- [ ] Firebase設定ファイル更新
- [ ] ESLint/Prettier設定更新

### 8.3 レビュー・承認
- [ ] ステークホルダーレビュー完了
- [ ] 技術レビュー完了
- [ ] セキュリティレビュー完了
- [ ] 設計変更管理プロセス確立

---

## 9. 次フェーズへの引き継ぎ

- 確定した設計ドキュメント一式
- 型定義ファイル
- Firestore セキュリティルール
- 画面コンポーネント設計書
- テストケース設計書
