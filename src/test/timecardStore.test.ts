import { describe, it, expect, beforeEach } from 'vitest';
import { useTimecardStore, calculateMonthlyHours } from '../features/timecard/useTimecardStore';

const resetStore = () => {
  const { reset } = useTimecardStore.getState();
  reset();
};

describe('useTimecardStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('adds a new timecard entry', () => {
    const { addEntry } = useTimecardStore.getState();
    addEntry({
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '18:00',
      note: '',
      isAbsence: false,
    });
    expect(useTimecardStore.getState().entries.length).toBe(1);
    expect(useTimecardStore.getState().entries[0].date).toBe('2024-01-01');
  });

  it('updates a timecard entry', () => {
    const { addEntry, updateEntry } = useTimecardStore.getState();
    addEntry({
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '18:00',
      note: '',
      isAbsence: false,
    });
    const id = useTimecardStore.getState().entries[0].id;
    updateEntry(id, { endTime: '17:30' });
    expect(useTimecardStore.getState().entries[0].endTime).toBe('17:30');
  });

  it('deletes a timecard entry', () => {
    const { addEntry, deleteEntry } = useTimecardStore.getState();
    addEntry({
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '18:00',
      note: '',
      isAbsence: false,
    });
    const id = useTimecardStore.getState().entries[0].id;
    deleteEntry(id);
    expect(useTimecardStore.getState().entries.length).toBe(0);
  });

  it('calculates monthly hours correctly', () => {
    const { addEntry } = useTimecardStore.getState();
    addEntry({ date: '2024-01-01', startTime: '09:00', endTime: '18:00', note: '', isAbsence: false });
    addEntry({ date: '2024-01-02', startTime: '10:00', endTime: '17:00', note: '', isAbsence: false });
    const hours = calculateMonthlyHours(useTimecardStore.getState().entries);
    expect(hours['2024-01']).toBeCloseTo(16);
  });
});
