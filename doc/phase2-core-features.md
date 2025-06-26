# フェーズ 2: コア機能開発設計書

**期間**: 7/16–8/12  
**マイルストーン**: 打刻・管理画面・申請機能 MVP

---

## 1. 目標

- 基本的な打刻機能の実装
- ダッシュボード画面の完成
- 勤怠管理機能の実装
- 残業申請機能の実装
- 管理者画面の基本機能実装

---

## 2. 開発スケジュール

### 2.1 Week 1 (7/16-7/22): 基盤機能実装

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 7/16-7/17 | 認証機能実装 | GitHub OAuth 完全動作 | Frontend |
| 7/18-7/19 | 基本レイアウト実装 | Header, Navigation, Layout | Frontend |
| 7/20-7/21 | ユーザー管理機能 | User Store, Profile 機能 | Frontend |
| 7/22 | Cloud Functions 基盤 | setupUser, 基本API | Backend |

### 2.2 Week 2 (7/23-7/29): 打刻機能実装

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 7/23-7/24 | 出退勤打刻UI | 打刻ボタン、時刻表示 | Frontend |
| 7/25-7/26 | 打刻機能実装 | clockIn/Out API, 位置情報 | Full-stack |
| 7/27-7/28 | 勤怠データ管理 | Attendance Store, CRUD | Frontend |
| 7/29 | 打刻機能テスト | 結合テスト、動作確認 | QA |

### 2.3 Week 3 (7/30-8/5): 勤怠管理機能

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 7/30-7/31 | 勤怠履歴画面 | データグリッド、フィルタ | Frontend |
| 8/1-8/2 | 月次集計機能 | 統計表示、計算ロジック | Full-stack |
| 8/3-8/4 | 勤怠修正機能 | 編集フォーム、承認フロー | Full-stack |
| 8/5 | 勤怠機能テスト | 機能テスト完了 | QA |

### 2.4 Week 4 (8/6-8/12): 申請・管理機能

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 8/6-8/7 | 残業申請機能 | 申請フォーム、API | Full-stack |
| 8/8-8/9 | 管理者機能基盤 | 権限管理、管理画面 | Full-stack |
| 8/10-8/11 | 承認機能実装 | 承認フロー、通知 | Full-stack |
| 8/12 | MVP テスト | 全機能統合テスト | QA |

---

## 3. 機能別実装詳細

### 3.1 認証機能実装

#### 3.1.1 GitHub OAuth 実装

```typescript
// src/services/auth.service.ts
import { signInWithPopup, GithubAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useAuthStore } from '../stores/useAuthStore';

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGitHub(): Promise<void> {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      provider.addScope('user:email');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      
      if (credential?.accessToken) {
        // GitHub API アクセス用トークンを保存
        localStorage.setItem('github_token', credential.accessToken);
      }
      
      // ユーザープロファイル取得
      await this.fetchUserProfile(result.user.uid);
      
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('github_token');
      useAuthStore.getState().setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  private async fetchUserProfile(uid: string): Promise<void> {
    // Firestore からユーザープロファイル取得
    // setupUser Cloud Function で作成されたプロファイルを取得
  }
}
```

#### 3.1.2 認証状態管理

```typescript
// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const { user, userProfile, loading, setUser, setUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Firestore のユーザープロファイルを監視
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          }
        });
        
        // クリーンアップ関数を返す
        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isManager: userProfile?.role === 'manager' || userProfile?.role === 'admin',
  };
};
```

### 3.2 打刻機能実装

#### 3.2.1 打刻UI コンポーネント

```typescript
// src/components/attendance/TimeClockCard.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  PlayArrow,
  Stop,
  PauseCircle,
  PlayCircle,
} from '@mui/icons-material';
import { useAttendanceStore } from '../../stores/useAttendanceStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const TimeClockCard: React.FC = () => {
  const {
    todayAttendance,
    loading,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
  } = useAttendanceStore();
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    try {
      // 位置情報取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => clockIn(position),
          () => clockIn() // 位置情報取得失敗時はなしで実行
        );
      } else {
        await clockIn();
      }
    } catch (error) {
      console.error('Clock in error:', error);
    }
  };

  const getWorkingTime = (): string => {
    if (!todayAttendance?.clockIn) return '--:--';
    
    const start = todayAttendance.clockIn.toDate();
    const end = todayAttendance.clockOut?.toDate() || currentTime;
    const breakMinutes = todayAttendance.breakMinutes || 0;
    
    const workingMinutes = Math.floor((end.getTime() - start.getTime()) / 60000) - breakMinutes;
    const hours = Math.floor(workingMinutes / 60);
    const minutes = workingMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const getStatus = (): { label: string; color: any } => {
    if (!todayAttendance?.clockIn) {
      return { label: '未出勤', color: 'default' };
    }
    if (todayAttendance.breakStart && !todayAttendance.breakEnd) {
      return { label: '休憩中', color: 'warning' };
    }
    if (!todayAttendance.clockOut) {
      return { label: '出勤中', color: 'success' };
    }
    return { label: '退勤済み', color: 'info' };
  };

  const status = getStatus();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {format(currentTime, 'yyyy年M月d日(E)', { locale: ja })}
          </Typography>
          <Chip label={status.label} color={status.color} />
        </Box>

        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, fontFamily: 'monospace' }}>
          {format(currentTime, 'HH:mm:ss')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">出勤</Typography>
            <Typography variant="h6">
              {todayAttendance?.clockIn ? format(todayAttendance.clockIn.toDate(), 'HH:mm') : '--:--'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">退勤</Typography>
            <Typography variant="h6">
              {todayAttendance?.clockOut ? format(todayAttendance.clockOut.toDate(), 'HH:mm') : '--:--'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">休憩時間</Typography>
            <Typography variant="h6">
              {todayAttendance?.breakMinutes ? `${todayAttendance.breakMinutes}分` : '--分'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">実働時間</Typography>
            <Typography variant="h6">{getWorkingTime()}</Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleClockIn}
            disabled={loading || !!todayAttendance?.clockIn}
            color="success"
            fullWidth
          >
            出勤
          </Button>
          
          <Button
            variant="outlined"
            startIcon={todayAttendance?.breakStart && !todayAttendance?.breakEnd ? <PlayCircle /> : <PauseCircle />}
            onClick={todayAttendance?.breakStart && !todayAttendance?.breakEnd ? endBreak : startBreak}
            disabled={loading || !todayAttendance?.clockIn || !!todayAttendance?.clockOut}
            fullWidth
          >
            {todayAttendance?.breakStart && !todayAttendance?.breakEnd ? '休憩終了' : '休憩開始'}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Stop />}
            onClick={clockOut}
            disabled={loading || !todayAttendance?.clockIn || !!todayAttendance?.clockOut}
            color="error"
            fullWidth
          >
            退勤
          </Button>
        </Stack>

        {todayAttendance?.breakStart && !todayAttendance?.breakEnd && (
          <Alert severity="info" sx={{ mt: 2 }}>
            休憩中です。作業を再開する際は「休憩終了」ボタンを押してください。
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
```

#### 3.2.2 打刻API実装

```typescript
// functions/src/attendance.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();

interface ClockInData {
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const clockIn = onCall<ClockInData>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const uid = request.auth.uid;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const now = Timestamp.now();

  try {
    // 今日の勤怠データをチェック
    const attendanceQuery = await db
      .collection('attendance')
      .where('uid', '==', uid)
      .where('date', '==', today)
      .limit(1)
      .get();

    if (!attendanceQuery.empty) {
      throw new HttpsError('already-exists', '本日は既に出勤済みです');
    }

    // 位置情報の処理
    let location;
    if (request.data.location) {
      location = {
        lat: request.data.location.latitude,
        lng: request.data.location.longitude,
        timestamp: now,
      };
    }

    // 勤怠データ作成
    const attendanceData = {
      uid,
      date: today,
      clockIn: now,
      clockOut: null,
      breakStart: null,
      breakEnd: null,
      breakMinutes: 0,
      workMinutes: 0,
      overtimeMinutes: 0,
      status: 'pending',
      location,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('attendance').add(attendanceData);

    return {
      success: true,
      attendanceId: docRef.id,
      clockInTime: now.toDate().toISOString(),
    };
  } catch (error) {
    console.error('Clock in error:', error);
    throw new HttpsError('internal', '出勤登録に失敗しました');
  }
});

export const clockOut = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const uid = request.auth.uid;
  const today = new Date().toISOString().split('T')[0];
  const now = Timestamp.now();

  try {
    // 今日の勤怠データを取得
    const attendanceQuery = await db
      .collection('attendance')
      .where('uid', '==', uid)
      .where('date', '==', today)
      .limit(1)
      .get();

    if (attendanceQuery.empty) {
      throw new HttpsError('not-found', '出勤記録が見つかりません');
    }

    const attendanceDoc = attendanceQuery.docs[0];
    const attendanceData = attendanceDoc.data();

    if (attendanceData.clockOut) {
      throw new HttpsError('already-exists', '既に退勤済みです');
    }

    // 休憩中の場合は自動で休憩終了
    let breakMinutes = attendanceData.breakMinutes || 0;
    if (attendanceData.breakStart && !attendanceData.breakEnd) {
      const breakEndTime = now;
      const additionalBreak = Math.floor((breakEndTime.toMillis() - attendanceData.breakStart.toMillis()) / 60000);
      breakMinutes += additionalBreak;
    }

    // 労働時間計算
    const workTotalMinutes = Math.floor((now.toMillis() - attendanceData.clockIn.toMillis()) / 60000);
    const workMinutes = workTotalMinutes - breakMinutes;

    // 標準労働時間を超えた分を残業として計算
    const standardWorkMinutes = 8 * 60; // 8時間
    const overtimeMinutes = Math.max(0, workMinutes - standardWorkMinutes);

    // 勤怠データ更新
    await attendanceDoc.ref.update({
      clockOut: now,
      breakEnd: attendanceData.breakStart && !attendanceData.breakEnd ? now : attendanceData.breakEnd,
      breakMinutes,
      workMinutes,
      overtimeMinutes,
      updatedAt: now,
    });

    return {
      success: true,
      clockOutTime: now.toDate().toISOString(),
      workMinutes,
      overtimeMinutes,
    };
  } catch (error) {
    console.error('Clock out error:', error);
    throw new HttpsError('internal', '退勤登録に失敗しました');
  }
});
```

### 3.3 勤怠管理機能実装

#### 3.3.1 勤怠履歴画面

```typescript
// src/pages/AttendancePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download, Edit } from '@mui/icons-material';
import { useAttendanceStore } from '../stores/useAttendanceStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const AttendancePage: React.FC = () => {
  const {
    monthlyAttendance,
    loading,
    fetchMonthlyData,
    exportMonthlyCSV,
  } = useAttendanceStore();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    fetchMonthlyData(year, month);
  }, [selectedMonth]);

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: '日付',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'M/d(E)', { locale: ja }),
    },
    {
      field: 'clockIn',
      headerName: '出勤',
      width: 100,
      valueFormatter: (params) => 
        params.value ? format(params.value.toDate(), 'HH:mm') : '--:--',
    },
    {
      field: 'clockOut',
      headerName: '退勤',
      width: 100,
      valueFormatter: (params) => 
        params.value ? format(params.value.toDate(), 'HH:mm') : '--:--',
    },
    {
      field: 'breakMinutes',
      headerName: '休憩',
      width: 80,
      valueFormatter: (params) => `${params.value || 0}分`,
    },
    {
      field: 'workMinutes',
      headerName: '実働時間',
      width: 100,
      valueFormatter: (params) => {
        const minutes = params.value || 0;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
      },
    },
    {
      field: 'overtimeMinutes',
      headerName: '残業時間',
      width: 100,
      valueFormatter: (params) => {
        const minutes = params.value || 0;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return minutes > 0 ? `${hours}h ${mins}m` : '--';
      },
    },
    {
      field: 'status',
      headerName: '状態',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'approved' ? '承認済み' : '承認待ち'}
          color={params.value === 'approved' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 100,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => handleEditAttendance(params.row.id)}
          disabled={params.row.status === 'approved'}
        >
          編集
        </Button>
      ),
    },
  ];

  const filteredData = monthlyAttendance.filter(record => {
    if (statusFilter === 'all') return true;
    return record.status === statusFilter;
  });

  const getTotalStats = () => {
    const totalWork = filteredData.reduce((sum, record) => sum + (record.workMinutes || 0), 0);
    const totalOvertime = filteredData.reduce((sum, record) => sum + (record.overtimeMinutes || 0), 0);
    const workDays = filteredData.filter(record => record.clockIn).length;

    return {
      workDays,
      totalWorkHours: Math.floor(totalWork / 60),
      totalWorkMinutes: totalWork % 60,
      totalOvertimeHours: Math.floor(totalOvertime / 60),
      totalOvertimeMinutes: totalOvertime % 60,
    };
  };

  const stats = getTotalStats();

  const handleEditAttendance = (attendanceId: string) => {
    // 編集ダイアログを開く
  };

  const handleExportCSV = async () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    await exportMonthlyCSV(year, month);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        勤怠履歴
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DatePicker
            label="対象月"
            value={selectedMonth}
            onChange={(newValue) => newValue && setSelectedMonth(newValue)}
            views={['year', 'month']}
            slotProps={{ textField: { size: 'small' } }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>状態</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="状態"
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="pending">承認待ち</MenuItem>
              <MenuItem value="approved">承認済み</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
          >
            CSV出力
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          月次集計
        </Typography>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="body2" color="text.secondary">出勤日数</Typography>
            <Typography variant="h6">{stats.workDays}日</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">総労働時間</Typography>
            <Typography variant="h6">
              {stats.totalWorkHours}時間{stats.totalWorkMinutes}分
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">総残業時間</Typography>
            <Typography variant="h6">
              {stats.totalOvertimeHours}時間{stats.totalOvertimeMinutes}分
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};
```

### 3.4 残業申請機能実装

#### 3.4.1 残業申請フォーム

```typescript
// src/components/overtime/OvertimeRequestForm.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOvertimeStore } from '../../stores/useOvertimeStore';

const overtimeRequestSchema = z.object({
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  reason: z.string().min(1, '残業理由を入力してください').max(500, '理由は500文字以内で入力してください'),
}).refine((data) => data.endTime > data.startTime, {
  message: '終了時刻は開始時刻より後である必要があります',
  path: ['endTime'],
});

type OvertimeRequestFormData = z.infer<typeof overtimeRequestSchema>;

interface OvertimeRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({
  open,
  onClose,
}) => {
  const { submitRequest, loading } = useOvertimeStore();
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OvertimeRequestFormData>({
    resolver: zodResolver(overtimeRequestSchema),
    defaultValues: {
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      reason: '',
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const getOvertimeMinutes = (): number => {
    if (!startTime || !endTime || endTime <= startTime) return 0;
    return Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const onSubmit = async (data: OvertimeRequestFormData) => {
    try {
      await submitRequest({
        date: data.date.toISOString().split('T')[0],
        startTime: data.startTime,
        endTime: data.endTime,
        minutes: getOvertimeMinutes(),
        reason: data.reason,
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('残業申請エラー:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>残業申請</DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="対象日"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      error: !!errors.date,
                      helperText: errors.date?.message,
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="開始時刻"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        error: !!errors.startTime,
                        helperText: errors.startTime?.message,
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="終了予定時刻"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        error: !!errors.endTime,
                        helperText: errors.endTime?.message,
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </Box>

            {getOvertimeMinutes() > 0 && (
              <Alert severity="info">
                <Typography variant="body2">
                  残業時間: {formatDuration(getOvertimeMinutes())}
                </Typography>
              </Alert>
            )}

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="残業理由"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                  placeholder="残業が必要な理由を詳しく記入してください"
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || getOvertimeMinutes() === 0}
          >
            申請
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

---

## 4. テスト実装

### 4.1 単体テスト

```typescript
// src/components/attendance/__tests__/TimeClockCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimeClockCard } from '../TimeClockCard';
import { useAttendanceStore } from '../../../stores/useAttendanceStore';

// Mock the store
jest.mock('../../../stores/useAttendanceStore');

const mockUseAttendanceStore = useAttendanceStore as jest.MockedFunction<typeof useAttendanceStore>;

describe('TimeClockCard', () => {
  beforeEach(() => {
    mockUseAttendanceStore.mockReturnValue({
      todayAttendance: null,
      loading: false,
      clockIn: jest.fn(),
      clockOut: jest.fn(),
      startBreak: jest.fn(),
      endBreak: jest.fn(),
    });
  });

  test('出勤ボタンが表示される', () => {
    render(<TimeClockCard />);
    expect(screen.getByText('出勤')).toBeInTheDocument();
  });

  test('出勤後は出勤ボタンが無効化される', () => {
    mockUseAttendanceStore.mockReturnValue({
      todayAttendance: {
        clockIn: { toDate: () => new Date() } as any,
        clockOut: null,
        breakMinutes: 0,
      },
      loading: false,
      clockIn: jest.fn(),
      clockOut: jest.fn(),
      startBreak: jest.fn(),
      endBreak: jest.fn(),
    });

    render(<TimeClockCard />);
    const clockInButton = screen.getByText('出勤');
    expect(clockInButton).toBeDisabled();
  });

  test('出勤ボタンクリックで clockIn が呼ばれる', async () => {
    const mockClockIn = jest.fn();
    mockUseAttendanceStore.mockReturnValue({
      todayAttendance: null,
      loading: false,
      clockIn: mockClockIn,
      clockOut: jest.fn(),
      startBreak: jest.fn(),
      endBreak: jest.fn(),
    });

    render(<TimeClockCard />);
    fireEvent.click(screen.getByText('出勤'));

    await waitFor(() => {
      expect(mockClockIn).toHaveBeenCalled();
    });
  });
});
```

### 4.2 結合テスト

```typescript
// src/__tests__/attendance-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { AuthProvider } from '../contexts/AuthContext';

// Firebase のモック
jest.mock('../services/firebase');

describe('勤怠管理フロー', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('出勤から退勤までの基本フロー', async () => {
    renderWithProviders(<DashboardPage />);

    // 出勤ボタンクリック
    fireEvent.click(screen.getByText('出勤'));

    // 出勤完了を待つ
    await waitFor(() => {
      expect(screen.getByText('出勤中')).toBeInTheDocument();
    });

    // 休憩開始
    fireEvent.click(screen.getByText('休憩開始'));

    await waitFor(() => {
      expect(screen.getByText('休憩中')).toBeInTheDocument();
    });

    // 休憩終了
    fireEvent.click(screen.getByText('休憩終了'));

    // 退勤
    fireEvent.click(screen.getByText('退勤'));

    await waitFor(() => {
      expect(screen.getByText('退勤済み')).toBeInTheDocument();
    });
  });
});
```

---

## 5. 完了条件

### 5.1 機能実装完了
- [ ] GitHub OAuth 認証完全動作
- [ ] 出退勤打刻機能完了
- [ ] 休憩開始/終了機能完了
- [ ] 勤怠履歴表示機能完了
- [ ] 残業申請機能完了
- [ ] 基本的な管理者機能完了

### 5.2 品質保証
- [ ] 単体テスト 80% 以上のカバレッジ
- [ ] 結合テスト全シナリオ通過
- [ ] セキュリティルール動作確認
- [ ] レスポンシブデザイン確認

### 5.3 性能要件
- [ ] 打刻処理 200ms 以内
- [ ] 画面遷移 100ms 以内
- [ ] Firebase Functions レスポンス 300ms 以内

### 5.4 MVP確認
- [ ] 実際の勤務フローでの動作確認
- [ ] エラーハンドリング動作確認
- [ ] ユーザビリティテスト実施

---

## 6. 次フェーズへの引き継ぎ

- 実装済み機能の動作確認結果
- 発見されたバグ・改善点リスト
- パフォーマンス測定結果
- ユーザーフィードバック
- 次フェーズで実装予定の追加機能要件
