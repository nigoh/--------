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
  expenses: [
    // サンプルデータ（テスト用）
    {
      id: '1',
      date: '2024-12-15',
      category: '交通費',
      amount: 1500,
      note: '客先訪問のための電車代',
      status: 'pending',
      receipts: [],
      submittedDate: '2024-12-15T09:30:00.000Z',
    },
    {
      id: '2', 
      date: '2024-12-14',
      category: '宿泊費',
      amount: 8500,
      note: '出張時のホテル代',
      status: 'approved',
      receipts: [],
      submittedDate: '2024-12-14T10:15:00.000Z',
      approvedDate: '2024-12-15T14:20:00.000Z',
      approvedBy: '田中課長',
    },
    {
      id: '3',
      date: '2024-12-13',
      category: '飲食費',
      amount: 3200,
      note: 'クライアントとの打ち合わせ会食',
      status: 'settled',
      receipts: [],
      submittedDate: '2024-12-13T11:00:00.000Z',
      approvedDate: '2024-12-14T09:30:00.000Z',
      settledDate: '2024-12-16T16:45:00.000Z',
      approvedBy: '佐藤部長',
    },
  ],
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
