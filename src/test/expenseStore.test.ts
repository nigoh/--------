import { describe, it, expect, beforeEach } from 'vitest';
import { useExpenseStore } from '../features/expense/useExpenseStore';

// Helper to reset store before each test
const resetStore = () => {
  const { reset } = useExpenseStore.getState();
  reset();
};

describe('useExpenseStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('adds a new expense entry', () => {
    const { addExpense, expenses } = useExpenseStore.getState();
    addExpense({ date: '2024-01-01', category: '旅費', amount: 1000, note: '' });
    expect(useExpenseStore.getState().expenses.length).toBe(1);
    expect(useExpenseStore.getState().expenses[0].category).toBe('旅費');
  });

  it('updates an expense entry', () => {
    const { addExpense, updateExpense } = useExpenseStore.getState();
    addExpense({ date: '2024-01-01', category: '旅費', amount: 1000, note: '' });
    const id = useExpenseStore.getState().expenses[0].id;
    updateExpense(id, { amount: 2000 });
    expect(useExpenseStore.getState().expenses[0].amount).toBe(2000);
  });
});
