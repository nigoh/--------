# フェーズ 3: 追加機能開発設計書

**期間**: 8/13–9/2  
**マイルストーン**: 休暇申請・レポート・i18n

---

## 1. 目標

- 休暇申請機能の完全実装
- 月次・年次レポート機能実装
- 多言語対応（日本語・英語）実装
- 通知機能実装
- PWA対応
- 高度な管理者機能実装

---

## 2. 開発スケジュール

### 2.1 Week 1 (8/13-8/19): 休暇申請機能

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 8/13-8/14 | 休暇申請UI実装 | 申請フォーム、カレンダー表示 | Frontend |
| 8/15-8/16 | 休暇管理API実装 | 申請・承認・残日数計算 | Backend |
| 8/17-8/18 | 休暇承認機能 | 管理者承認画面、通知 | Full-stack |
| 8/19 | 休暇機能テスト | 機能テスト完了 | QA |

### 2.2 Week 2 (8/20-8/26): レポート機能

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 8/20-8/21 | 月次レポート機能 | ダッシュボード、グラフ表示 | Frontend |
| 8/22-8/23 | CSV出力機能 | 勤怠・残業・休暇データ出力 | Backend |
| 8/24-8/25 | 年次レポート機能 | 年間集計、分析機能 | Full-stack |
| 8/26 | レポート機能テスト | 機能テスト完了 | QA |

### 2.3 Week 3 (8/27-9/2): PWA・多言語・通知

| 日程 | タスク | 成果物 | 担当 |
|------|--------|--------|------|
| 8/27-8/28 | 多言語対応実装 | i18n設定、翻訳ファイル | Frontend |
| 8/29-8/30 | PWA機能実装 | Service Worker、オフライン対応 | Frontend |
| 8/31-9/1 | 通知機能実装 | プッシュ通知、メール通知 | Backend |
| 9/2 | 統合テスト | 全機能統合テスト | QA |

---

## 3. 機能別実装詳細

### 3.1 休暇申請機能実装

#### 3.1.1 休暇申請フォーム

```typescript
// src/components/vacation/VacationRequestForm.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Calendar, Event } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVacationStore } from '../../stores/useVacationStore';
import { VacationCalendar } from './VacationCalendar';

// 休暇種別定義
export const VACATION_TYPES = {
  annual: { label: '年次有給休暇', color: 'primary', maxDays: 20 },
  sick: { label: '病気休暇', color: 'warning', maxDays: 10 },
  special: { label: '特別休暇', color: 'success', maxDays: 5 },
  maternity: { label: '産前産後休暇', color: 'secondary', maxDays: 98 },
  paternity: { label: '育児休暇', color: 'info', maxDays: 365 },
} as const;

const vacationRequestSchema = z.object({
  type: z.enum(['annual', 'sick', 'special', 'maternity', 'paternity']),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: '終了日は開始日以降である必要があります',
  path: ['endDate'],
});

type VacationRequestFormData = z.infer<typeof vacationRequestSchema>;

interface VacationRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const VacationRequestForm: React.FC<VacationRequestFormProps> = ({
  open,
  onClose,
}) => {
  const { submitRequest, loading, vacationBalance } = useVacationStore();
  const [showCalendar, setShowCalendar] = useState(false);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<VacationRequestFormData>({
    resolver: zodResolver(vacationRequestSchema),
    defaultValues: {
      type: 'annual',
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const vacationType = watch('type');

  const getVacationDays = (): number => {
    if (!startDate || !endDate || endDate < startDate) return 0;
    
    let days = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      // 土日を除外
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const vacationDays = getVacationDays();
  const remainingDays = vacationBalance[vacationType] || 0;
  const isExceedingLimit = vacationDays > remainingDays;

  const onSubmit = async (data: VacationRequestFormData) => {
    try {
      await submitRequest({
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
        days: vacationDays,
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('休暇申請エラー:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event />
            休暇申請
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3}>
              {/* 休暇種別選択 */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>休暇種別</InputLabel>
                    <Select {...field} label="休暇種別">
                      {Object.entries(VACATION_TYPES).map(([key, config]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={config.label}
                              color={config.color}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              (残り: {vacationBalance[key as keyof typeof vacationBalance] || 0}日)
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* 期間選択 */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="開始日"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="終了日"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={startDate}
                      slotProps={{
                        textField: {
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* カレンダー表示ボタン */}
              <Button
                variant="outlined"
                startIcon={<Calendar />}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? 'カレンダーを非表示' : 'カレンダーで確認'}
              </Button>

              {/* カレンダー表示 */}
              {showCalendar && (
                <VacationCalendar
                  startDate={startDate}
                  endDate={endDate}
                  existingVacations={[]} // 既存の休暇データ
                />
              )}

              {/* 取得日数表示 */}
              {vacationDays > 0 && (
                <Alert
                  severity={isExceedingLimit ? 'error' : 'info'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="body2">
                      取得日数: {vacationDays}日 (土日除く)
                    </Typography>
                    <Typography variant="body2">
                      残り日数: {remainingDays}日
                    </Typography>
                    {isExceedingLimit && (
                      <Typography variant="body2" color="error">
                        残り日数を超過しています
                      </Typography>
                    )}
                  </Box>
                </Alert>
              )}

              {/* 理由入力 */}
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="理由（任意）"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="休暇の理由があれば記入してください"
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
              disabled={loading || vacationDays === 0 || isExceedingLimit}
            >
              申請
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
```

#### 3.1.2 休暇カレンダーコンポーネント

```typescript
// src/components/vacation/VacationCalendar.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend } from 'date-fns';
import { ja } from 'date-fns/locale';

interface VacationCalendarProps {
  startDate: Date;
  endDate: Date;
  existingVacations: Array<{
    startDate: string;
    endDate: string;
    type: string;
    status: string;
  }>;
}

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
}));

const DayCell = styled(Box)<{
  isSelected?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
  hasVacation?: boolean;
}>(({ theme, isSelected, isWeekend, isOtherMonth, hasVacation }) => ({
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'default',
  fontSize: '0.875rem',
  
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }),
  
  ...(isWeekend && !isSelected && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.disabled,
  }),
  
  ...(isOtherMonth && {
    color: theme.palette.text.disabled,
  }),
  
  ...(hasVacation && !isSelected && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  }),
}));

export const VacationCalendar: React.FC<VacationCalendarProps> = ({
  startDate,
  endDate,
  existingVacations,
}) => {
  const monthStart = startOfMonth(startDate);
  const monthEnd = endOfMonth(startDate);
  
  // カレンダーに表示する日付の範囲を計算
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay());
  
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const isInVacationPeriod = (date: Date): boolean => {
    return date >= startDate && date <= endDate;
  };

  const hasExistingVacation = (date: Date): boolean => {
    return existingVacations.some(vacation => {
      const vStart = new Date(vacation.startDate);
      const vEnd = new Date(vacation.endDate);
      return date >= vStart && date <= vEnd && vacation.status !== 'rejected';
    });
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {format(startDate, 'yyyy年M月', { locale: ja })}
      </Typography>
      
      <CalendarContainer elevation={1}>
        {/* 曜日ヘッダー */}
        {weekDays.map((day, index) => (
          <Box
            key={day}
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: index === 0 || index === 6 ? 'error.main' : 'text.primary',
              pb: 1,
            }}
          >
            {day}
          </Box>
        ))}
        
        {/* 日付セル */}
        {calendarDays.map((day) => (
          <DayCell
            key={day.toISOString()}
            isSelected={isInVacationPeriod(day)}
            isWeekend={isWeekend(day)}
            isOtherMonth={!isSameMonth(day, startDate)}
            hasVacation={hasExistingVacation(day)}
          >
            {format(day, 'd')}
          </DayCell>
        ))}
      </CalendarContainer>
      
      {/* 凡例 */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: 'primary.main',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption">申請期間</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: 'warning.light',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption">既存の休暇</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: 'grey.100',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption">土日</Typography>
        </Box>
      </Box>
    </Box>
  );
};
```

### 3.2 レポート機能実装

#### 3.2.1 月次レポートダッシュボード

```typescript
// src/pages/ReportsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import { Download, TrendingUp, Schedule, Event } from '@mui/icons-material';
import { useReportStore } from '../stores/useReportStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ReportsPage: React.FC = () => {
  const {
    monthlyReport,
    teamReport,
    yearlyTrend,
    loading,
    fetchMonthlyReport,
    fetchTeamReport,
    fetchYearlyTrend,
    exportReport,
  } = useReportStore();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [reportType, setReportType] = useState<'individual' | 'team'>('individual');

  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    
    if (reportType === 'individual') {
      fetchMonthlyReport(year, month);
    } else {
      fetchTeamReport(year, month);
    }
    
    fetchYearlyTrend(year);
  }, [selectedMonth, reportType]);

  const handleExportCSV = async () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    await exportReport(reportType, year, month);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        勤怠レポート
      </Typography>

      {/* レポート設定 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DatePicker
            label="対象月"
            value={selectedMonth}
            onChange={(newValue) => newValue && setSelectedMonth(newValue)}
            views={['year', 'month']}
            slotProps={{ textField: { size: 'small' } }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>レポート種別</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'individual' | 'team')}
              label="レポート種別"
            >
              <MenuItem value="individual">個人</MenuItem>
              <MenuItem value="team">チーム</MenuItem>
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

      {reportType === 'individual' && monthlyReport && (
        <>
          {/* 個人サマリーカード */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Schedule color="primary" />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        出勤日数
                      </Typography>
                      <Typography variant="h5">
                        {monthlyReport.workDays}日
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUp color="success" />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        総労働時間
                      </Typography>
                      <Typography variant="h5">
                        {Math.floor(monthlyReport.totalWorkMinutes / 60)}h{monthlyReport.totalWorkMinutes % 60}m
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Schedule color="warning" />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        残業時間
                      </Typography>
                      <Typography variant="h5">
                        {Math.floor(monthlyReport.totalOvertimeMinutes / 60)}h{monthlyReport.totalOvertimeMinutes % 60}m
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Event color="info" />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        取得休暇
                      </Typography>
                      <Typography variant="h5">
                        {monthlyReport.vacationDays}日
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 日別労働時間グラフ */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              日別労働時間
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyReport.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="workHours" fill="#8884d8" name="労働時間" />
                <Bar dataKey="overtimeHours" fill="#82ca9d" name="残業時間" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* 時間帯別分析 */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              出勤時刻分布
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={monthlyReport.clockInDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {monthlyReport.clockInDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {reportType === 'team' && teamReport && (
        <>
          {/* チーム概要 */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              チーム概要
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamReport.memberSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="workHours" fill="#8884d8" name="労働時間" />
                    <Bar dataKey="overtimeHours" fill="#82ca9d" name="残業時間" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={teamReport.attendanceRate}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="rate"
                    >
                      {teamReport.attendanceRate.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {/* 年間トレンド */}
      {yearlyTrend && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            年間トレンド
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="workHours" stroke="#8884d8" name="労働時間" />
              <Line type="monotone" dataKey="overtimeHours" stroke="#82ca9d" name="残業時間" />
              <Line type="monotone" dataKey="vacationDays" stroke="#ffc658" name="休暇日数" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};
```

### 3.3 多言語対応実装

#### 3.3.1 i18n設定

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: 'ja', // デフォルト言語
    fallbackLng: 'ja',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

#### 3.3.2 翻訳ファイル

```json
// src/i18n/locales/ja.json
{
  "common": {
    "save": "保存",
    "cancel": "キャンセル",
    "delete": "削除",
    "edit": "編集",
    "confirm": "確認",
    "loading": "読み込み中...",
    "error": "エラーが発生しました",
    "success": "正常に完了しました"
  },
  "auth": {
    "login": "ログイン",
    "logout": "ログアウト",
    "loginWithGitHub": "GitHubでログイン",
    "welcome": "ようこそ"
  },
  "attendance": {
    "clockIn": "出勤",
    "clockOut": "退勤",
    "breakStart": "休憩開始",
    "breakEnd": "休憩終了",
    "workingTime": "実働時間",
    "overtime": "残業時間",
    "status": {
      "notClockedIn": "未出勤",
      "working": "出勤中",
      "onBreak": "休憩中",
      "clockedOut": "退勤済み"
    }
  },
  "vacation": {
    "request": "休暇申請",
    "types": {
      "annual": "年次有給休暇",
      "sick": "病気休暇",
      "special": "特別休暇",
      "maternity": "産前産後休暇",
      "paternity": "育児休暇"
    },
    "remaining": "残り{{days}}日",
    "duration": "取得期間"
  },
  "reports": {
    "monthly": "月次レポート",
    "yearly": "年次レポート",
    "workDays": "出勤日数",
    "totalWorkTime": "総労働時間",
    "totalOvertime": "総残業時間",
    "exportCSV": "CSV出力"
  }
}
```

```json
// src/i18n/locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Completed successfully"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "loginWithGitHub": "Login with GitHub",
    "welcome": "Welcome"
  },
  "attendance": {
    "clockIn": "Clock In",
    "clockOut": "Clock Out",
    "breakStart": "Start Break",
    "breakEnd": "End Break",
    "workingTime": "Working Time",
    "overtime": "Overtime",
    "status": {
      "notClockedIn": "Not Clocked In",
      "working": "Working",
      "onBreak": "On Break",
      "clockedOut": "Clocked Out"
    }
  },
  "vacation": {
    "request": "Vacation Request",
    "types": {
      "annual": "Annual Leave",
      "sick": "Sick Leave",
      "special": "Special Leave",
      "maternity": "Maternity Leave",
      "paternity": "Paternity Leave"
    },
    "remaining": "{{days}} days remaining",
    "duration": "Duration"
  },
  "reports": {
    "monthly": "Monthly Report",
    "yearly": "Yearly Report",
    "workDays": "Work Days",
    "totalWorkTime": "Total Work Time",
    "totalOvertime": "Total Overtime",
    "exportCSV": "Export CSV"
  }
}
```

### 3.4 PWA対応実装

#### 3.4.1 Service Worker設定

```typescript
// public/sw.js
const CACHE_NAME = 'timecard-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあれば返す、なければネットワークから取得
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// プッシュ通知処理
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '確認',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('勤怠管理アプリ', options)
  );
});
```

#### 3.4.2 PWA設定

```json
// public/manifest.json
{
  "name": "Timecard App",
  "short_name": "Timecard",
  "description": "勤怠管理アプリ",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3.5 通知機能実装

#### 3.5.1 プッシュ通知サービス

```typescript
// src/services/notification.service.ts
export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
      });

      // サブスクリプションをサーバーに送信
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('プッシュ通知の登録に失敗:', error);
      return null;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // Firebase Functions にサブスクリプションを送信
    const response = await fetch('/api/subscribe-to-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('サブスクリプションの送信に失敗しました');
    }
  }

  showLocalNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });
    }
  }
}
```

---

## 4. 完了条件

### 4.1 機能実装完了

- [ ] 休暇申請機能完全動作
- [ ] 休暇承認機能完了
- [ ] 月次レポート機能完了
- [ ] CSV出力機能完了
- [ ] 多言語対応（日本語・英語）完了
- [ ] PWA対応完了
- [ ] プッシュ通知機能完了

### 4.2 品質保証

- [ ] 全機能の単体テスト完了
- [ ] 結合テスト完了
- [ ] 多言語表示確認完了
- [ ] PWA動作確認完了
- [ ] 通知機能動作確認完了

### 4.3 性能要件

- [ ] Lighthouse PWAスコア 90以上
- [ ] オフライン動作確認完了
- [ ] プッシュ通知配信確認完了

### 4.4 追加機能確認

- [ ] 休暇残日数自動計算動作確認
- [ ] レポートデータの正確性確認
- [ ] 多言語切り替え動作確認

---

## 5. 次フェーズへの引き継ぎ

- 実装済み全機能の動作確認結果
- PWA対応状況とオフライン機能確認結果
- 多言語対応状況と翻訳品質評価
- 通知機能の動作確認結果
- 本番環境での最終テスト準備資料
