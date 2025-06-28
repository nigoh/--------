import { create } from 'zustand';
import { calculateDuration } from './utils';

export interface TimecardEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  note?: string;
  /** 休暇かどうか */
  isAbsence: boolean;
  /** 休暇理由 */
  absenceReason?: string;
  /**
   * 休暇種別
   * - planned: 計画休
   * - sudden: 突発休
   */
  absenceType?: 'planned' | 'sudden';
}

export interface TimecardState {
  entries: TimecardEntry[];
}

export interface TimecardActions {
  addEntry: (entry: Omit<TimecardEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimecardEntry>) => void;
  deleteEntry: (id: string) => void;
  reset: () => void;
}

export type TimecardStore = TimecardState & TimecardActions;

const initialState: TimecardState = {
  entries: [],
};

export const useTimecardStore = create<TimecardStore>((set) => ({
  ...initialState,
  addEntry: (entry) =>
    set((state) => ({
      entries: [
        ...state.entries,
        {
          id: crypto.randomUUID(),
          isAbsence: false,
          ...entry,
        },
      ],
    })),
  updateEntry: (id, entry) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id
          ? {
              ...e,
              ...entry,
            }
          : e
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  reset: () => set(initialState),
}));

/**
 * 月別の合計勤務時間を計算する
 */
export const calculateMonthlyHours = (
  entries: TimecardEntry[],
): Record<string, number> =>
  entries.reduce<Record<string, number>>((acc, e) => {
    if (e.isAbsence || !e.startTime || !e.endTime) return acc;
    const month = e.date.slice(0, 7);
    acc[month] = (acc[month] ?? 0) + calculateDuration(e.startTime, e.endTime);
    return acc;
  }, {});
