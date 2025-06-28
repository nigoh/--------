import { create } from 'zustand';

export interface TimecardEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  note?: string;
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
        { id: crypto.randomUUID(), ...entry },
      ],
    })),
  updateEntry: (id, entry) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...entry } : e
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  reset: () => set(initialState),
}));
