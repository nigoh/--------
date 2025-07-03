import { useCallback } from 'react';
import { useBusinessLoggers } from '../../../hooks/logging';
import { useTimecardStore, TimecardEntry } from '../useTimecardStore';
import { useTemporary } from '../../../hooks/useTemporary';

/**
 * 勤怠管理フォーム操作のロギング付きフック
 */
export const useTimecardForm = () => {
  const { addEntry, updateEntry, deleteEntry } = useTimecardStore();
  const { toast, progress } = useTemporary();
  const { featureLogger, crudLogger } = useBusinessLoggers('TimecardManagement');

  /**
   * 勤怠登録（出勤・退勤・休暇）
   */
  const handleTimecardEntry = useCallback(async (entryData: Omit<TimecardEntry, 'id'>) => {
    try {
      // 勤怠登録開始ログ
      featureLogger.logUserAction('timecard_entry_attempt', {
        date: entryData.date,
        type: entryData.isAbsence ? 'absence' : 'attendance',
        absenceType: entryData.absenceType,
        hasNote: !!entryData.note
      });

      progress.start('勤怠情報を登録中...', 1);

      // 勤怠データ追加
      const entryId = crypto.randomUUID();
      const newEntry = { ...entryData, id: entryId };
      addEntry(entryData);

      // CRUD操作ログ
      await crudLogger.logCreate('timecard_entry', newEntry, {
        type: entryData.isAbsence ? 'absence' : 'attendance',
        date: entryData.date,
        workHours: entryData.isAbsence ? 0 : calculateWorkHours(entryData.startTime || '', entryData.endTime || ''),
        absenceType: entryData.absenceType
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('timecard_entry_success', {
        entryId: entryId,
        type: entryData.isAbsence ? 'absence' : 'attendance',
        date: entryData.date
      });

      toast.success(
        entryData.isAbsence 
          ? `${entryData.date}の休暇を登録しました`
          : `${entryData.date}の勤怠を登録しました`
      );

      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Timecard entry failed'), {
        action: 'timecard_entry',
        date: entryData.date,
        type: entryData.isAbsence ? 'absence' : 'attendance'
      });

      toast.error('勤怠登録に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [addEntry, crudLogger, featureLogger, toast, progress]);

  /**
   * 勤怠情報更新
   */
  const handleUpdateTimecard = useCallback(async (id: string, updates: Partial<TimecardEntry>) => {
    try {
      // 更新開始ログ
      featureLogger.logUserAction('timecard_update_attempt', {
        entryId: id,
        updateFields: Object.keys(updates)
      });

      progress.start('勤怠情報を更新中...', 1);

      // 勤怠データ更新
      updateEntry(id, updates);

      // CRUD操作ログ
      await crudLogger.logUpdate('timecard_entry', id, updates, {
        changedFields: Object.keys(updates),
        hasTimeChange: !!(updates.startTime || updates.endTime),
        hasStatusChange: updates.isAbsence !== undefined
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('timecard_update_success', {
        entryId: id,
        updatedFields: Object.keys(updates)
      });

      toast.success('勤怠情報を更新しました');
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Timecard update failed'), {
        action: 'timecard_update',
        entryId: id,
        updateFields: Object.keys(updates)
      });

      toast.error('勤怠更新に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [updateEntry, crudLogger, featureLogger, toast, progress]);

  /**
   * 勤怠削除
   */
  const handleDeleteTimecard = useCallback(async (entry: TimecardEntry) => {
    try {
      // 削除開始ログ
      featureLogger.logUserAction('timecard_delete_attempt', {
        entryId: entry.id,
        date: entry.date,
        type: entry.isAbsence ? 'absence' : 'attendance'
      });

      progress.start('勤怠情報を削除中...', 1);

      // 勤怠データ削除
      deleteEntry(entry.id);

      // CRUD操作ログ
      await crudLogger.logDelete('timecard_entry', entry.id, {
        date: entry.date,
        type: entry.isAbsence ? 'absence' : 'attendance',
        workHours: entry.isAbsence ? 0 : calculateWorkHours(entry.startTime || '', entry.endTime || '')
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('timecard_delete_success', {
        entryId: entry.id,
        date: entry.date
      });

      toast.success(`${entry.date}の勤怠情報を削除しました`);
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Timecard delete failed'), {
        action: 'timecard_delete',
        entryId: entry.id,
        date: entry.date
      });

      toast.error('勤怠削除に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [deleteEntry, crudLogger, featureLogger, toast, progress]);

  /**
   * 休暇申請
   */
  const handleVacationRequest = useCallback(async (vacationData: {
    startDate: string;
    endDate: string;
    type: 'annual' | 'sick' | 'special';
    reason: string;
    days: number;
  }) => {
    try {
      // 休暇申請開始ログ
      featureLogger.logUserAction('vacation_request_attempt', {
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        type: vacationData.type,
        days: vacationData.days,
        hasReason: !!vacationData.reason
      });

      progress.start('休暇申請を送信中...', 1);

      // 休暇期間の各日に休暇エントリーを作成
      const vacationEntries = generateVacationEntries(vacationData);
      
      for (const entry of vacationEntries) {
        addEntry(entry);
      }

      // CRUD操作ログ
      await crudLogger.logCreate('vacation_request', {
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        type: vacationData.type,
        days: vacationData.days
      }, {
        type: vacationData.type,
        duration: vacationData.days,
        isMultiDay: vacationData.days > 1
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('vacation_request_success', {
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        type: vacationData.type,
        days: vacationData.days
      });

      toast.success(`${vacationData.days}日間の${getVacationTypeLabel(vacationData.type)}を申請しました`);
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Vacation request failed'), {
        action: 'vacation_request',
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        type: vacationData.type
      });

      toast.error('休暇申請に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [addEntry, crudLogger, featureLogger, toast, progress]);

  /**
   * 集計処理ログ
   */
  const logSummaryGeneration = useCallback(async (month: string, summaryData: {
    totalWorkDays: number;
    totalWorkHours: number;
    vacationDays: number;
    overtimeHours: number;
  }) => {
    try {
      // 集計処理ログ
      featureLogger.logPerformance('summary_generation', async () => {
        return summaryData;
      }, {
        month,
        totalWorkDays: summaryData.totalWorkDays,
        totalWorkHours: summaryData.totalWorkHours,
        vacationDays: summaryData.vacationDays,
        overtimeHours: summaryData.overtimeHours
      });

    } catch (error) {
      featureLogger.logError(error instanceof Error ? error : new Error('Summary generation failed'), {
        action: 'summary_generation',
        month
      });
    }
  }, [featureLogger]);

  return {
    handleTimecardEntry,
    handleUpdateTimecard,
    handleDeleteTimecard,
    handleVacationRequest,
    logSummaryGeneration
  };
};

/**
 * 勤務時間計算
 */
function calculateWorkHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60)); // 時間単位
}

/**
 * 休暇エントリー生成
 */
function generateVacationEntries(vacationData: {
  startDate: string;
  endDate: string;
  type: 'annual' | 'sick' | 'special';
  reason: string;
}): Omit<TimecardEntry, 'id'>[] {
  const entries: Omit<TimecardEntry, 'id'>[] = [];
  const start = new Date(vacationData.startDate);
  const end = new Date(vacationData.endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    // 土日をスキップ
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      entries.push({
        date: date.toISOString().slice(0, 10),
        startTime: '',
        endTime: '',
        note: vacationData.reason,
        isAbsence: true,
        absenceReason: vacationData.reason,
        absenceType: 'planned'
      });
    }
  }
  
  return entries;
}

/**
 * 休暇種別ラベル取得
 */
function getVacationTypeLabel(type: 'annual' | 'sick' | 'special'): string {
  switch (type) {
    case 'annual': return '年次有給休暇';
    case 'sick': return '病気休暇';
    case 'special': return '特別休暇';
    default: return '休暇';
  }
}
