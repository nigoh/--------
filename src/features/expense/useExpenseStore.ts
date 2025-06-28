import { create } from 'zustand';

export interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  note?: string;
}

export interface ExpenseState {
  expenses: ExpenseEntry[];
}

export interface ExpenseActions {
  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => void;
  updateExpense: (id: string, entry: Partial<ExpenseEntry>) => void;
  deleteExpense: (id: string) => void;
  reset: () => void;
}

export type ExpenseStore = ExpenseState & ExpenseActions;

const initialState: ExpenseState = {
  expenses: [],
};

export const useExpenseStore = create<ExpenseStore>((set) => ({
  ...initialState,
  addExpense: (entry) =>
    set((state) => ({
      expenses: [
        ...state.expenses,
        { id: crypto.randomUUID(), ...entry },
      ],
    })),
  updateExpense: (id, entry) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === id ? { ...e, ...entry } : e
      ),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),
  reset: () => set(initialState),
}));
