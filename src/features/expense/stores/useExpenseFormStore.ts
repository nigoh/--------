import { create } from 'zustand';
import { ExpenseEntry, ExpenseStatus } from '../useExpenseStore';

export interface ExpenseFormData {
  date: string;
  category: string;
  amount: string;
  note: string;
  receipts: File[];
}

export interface ExpenseFormErrors {
  date?: string;
  category?: string;
  amount?: string;
  note?: string;
  receipts?: string;
}

export interface ExpenseFormState {
  formData: ExpenseFormData;
  errors: ExpenseFormErrors;
  isSubmitting: boolean;
  isLoading: boolean;
  editingExpense: ExpenseEntry | null;
}

export interface ExpenseFormActions {
  setFormData: (data: Partial<ExpenseFormData>) => void;
  updateField: (field: keyof ExpenseFormData, value: string | File[]) => void;
  setErrors: (errors: ExpenseFormErrors) => void;
  clearErrors: () => void;
  setSubmitting: (submitting: boolean) => void;
  setLoading: (loading: boolean) => void;
  setEditingExpense: (expense: ExpenseEntry | null) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  populateFormFromExpense: (expense: ExpenseEntry) => void;
}

export type ExpenseFormStore = ExpenseFormState & ExpenseFormActions;

const initialFormData: ExpenseFormData = {
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: '',
  note: '',
  receipts: [],
};

const initialState: ExpenseFormState = {
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  isLoading: false,
  editingExpense: null,
};

export const useExpenseFormStore = create<ExpenseFormStore>((set, get) => ({
  ...initialState,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  updateField: (field, value) => {
    const state = get();
    // 無限ループ防止
    if (state.formData[field] === value) return;
    
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      // フィールド更新時にそのフィールドのエラーをクリア
      errors: { ...state.errors, [field]: undefined },
    }));
  },

  setErrors: (errors) =>
    set((state) => ({
      errors: { ...state.errors, ...errors },
    })),

  clearErrors: () =>
    set(() => ({
      errors: {},
    })),

  setSubmitting: (submitting) =>
    set(() => ({
      isSubmitting: submitting,
    })),

  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  setEditingExpense: (expense) =>
    set(() => ({
      editingExpense: expense,
    })),

  resetForm: () =>
    set(() => ({
      formData: { ...initialFormData, date: new Date().toISOString().split('T')[0] },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      editingExpense: null,
    })),

  validateForm: () => {
    const { formData } = get();
    const errors: ExpenseFormErrors = {};

    // 日付バリデーション
    if (!formData.date) {
      errors.date = '日付を入力してください';
    }

    // カテゴリバリデーション
    if (!formData.category) {
      errors.category = 'カテゴリを選択してください';
    }

    // 金額バリデーション
    if (!formData.amount) {
      errors.amount = '金額を入力してください';
    } else {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = '正しい金額を入力してください';
      } else if (amount > 1000000) {
        errors.amount = '金額は100万円以下で入力してください';
      }
    }

    // 備考バリデーション（任意だがある場合は長さチェック）
    if (formData.note && formData.note.length > 500) {
      errors.note = '備考は500文字以内で入力してください';
    }

    set(() => ({ errors }));
    return Object.keys(errors).length === 0;
  },

  populateFormFromExpense: (expense) => {
    set(() => ({
      formData: {
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        note: expense.note || '',
        receipts: [], // ファイルは再アップロードが必要
      },
      editingExpense: expense,
      errors: {},
    }));
  },
}));
