import { create } from 'zustand';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'settled';

export interface ExpenseReceipt {
  id: string;
  filename: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  note?: string;
  status: ExpenseStatus;
  receipts: ExpenseReceipt[];
  submittedDate?: string;
  approvedDate?: string;
  settledDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface ExpenseState {
  expenses: ExpenseEntry[];
}

export interface ExpenseActions {
  addExpense: (entry: Omit<ExpenseEntry, 'id' | 'status' | 'receipts' | 'submittedDate'>) => void;
  updateExpense: (id: string, entry: Partial<ExpenseEntry>) => void;
  deleteExpense: (id: string) => void;
  updateStatus: (id: string, status: ExpenseStatus, metadata?: { approvedBy?: string; rejectionReason?: string }) => void;
  addReceipt: (expenseId: string, receipt: Omit<ExpenseReceipt, 'id' | 'uploadDate'>) => void;
  removeReceipt: (expenseId: string, receiptId: string) => void;
  reset: () => void;
}

export type ExpenseStore = ExpenseState & ExpenseActions;

const initialState: ExpenseState = {
  expenses: [],
};

export const useExpenseStore = create<ExpenseStore>((set) => ({
  ...initialState,
  addExpense: (entry) => {
    const newExpense = {
      id: crypto.randomUUID(),
      ...entry,
      status: 'pending' as ExpenseStatus,
      receipts: [],
      submittedDate: new Date().toISOString(),
    };
    
    set((state) => ({
      expenses: [...state.expenses, newExpense],
    }));
    
    return newExpense.id; // IDを返す
  },
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
  updateStatus: (id, status, metadata = {}) =>
    set((state) => ({
      expenses: state.expenses.map((e) => {
        if (e.id !== id) return e;
        
        const now = new Date().toISOString();
        const updates: Partial<ExpenseEntry> = { status };
        
        switch (status) {
          case 'approved':
            updates.approvedDate = now;
            updates.approvedBy = metadata.approvedBy;
            break;
          case 'rejected':
            updates.rejectionReason = metadata.rejectionReason;
            break;
          case 'settled':
            updates.settledDate = now;
            break;
        }
        
        return { ...e, ...updates };
      }),
    })),
  addReceipt: (expenseId, receipt) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              receipts: [
                ...e.receipts,
                {
                  id: crypto.randomUUID(),
                  ...receipt,
                  uploadDate: new Date().toISOString(),
                },
              ],
            }
          : e
      ),
    })),
  removeReceipt: (expenseId, receiptId) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              receipts: e.receipts.filter((r) => r.id !== receiptId),
            }
          : e
      ),
    })),
  reset: () => set(initialState),
}));
