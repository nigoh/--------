/**
 * 社員フォーム状態管理用Zustandストア
 * 
 * フォーム状態、バリデーション、一時的な状態をZustandで管理
 */
import { create } from 'zustand';
import { Employee } from '../useEmployeeStore';

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  skills: string[];
  notes: string;
  isActive: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

// フォーム状態の型定義
export interface EmployeeFormState {
  formData: EmployeeFormData;
  errors: ValidationErrors;
  customSkill: string;
  mode: 'create' | 'edit' | 'view';
  isSubmitting: boolean;
  isDirty: boolean;
}

// フォームアクションの型定義
export interface EmployeeFormActions {
  // 初期化
  initializeForm: (employee?: Employee | null, mode?: 'create' | 'edit' | 'view') => void;
  resetForm: () => void;
  
  // フィールド操作
  updateField: (field: keyof EmployeeFormData, value: any) => void;
  updateFormData: (data: Partial<EmployeeFormData>) => void;
  
  // エラー管理
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setErrors: (errors: ValidationErrors) => void;
  
  // カスタムスキル
  setCustomSkill: (skill: string) => void;
  addCustomSkill: () => void;
  
  // 状態管理
  setSubmitting: (submitting: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setMode: (mode: 'create' | 'edit' | 'view') => void;
}

// 統合型
export type EmployeeFormStore = EmployeeFormState & EmployeeFormActions;

// 初期状態
const initialFormData: EmployeeFormData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  joinDate: new Date().toISOString().split('T')[0],
  skills: [],
  notes: '',
  isActive: true,
};

const initialState: EmployeeFormState = {
  formData: initialFormData,
  errors: {},
  customSkill: '',
  mode: 'create',
  isSubmitting: false,
  isDirty: false,
};

/**
 * 社員フォーム状態管理Zustandストア
 */
export const useEmployeeFormStore = create<EmployeeFormStore>((set, get) => ({
  ...initialState,

  // 初期化
  initializeForm: (employee, mode = 'create') => {
    const currentState = get();
    
    // 同じemployeeとmodeの場合は何もしない（無限ループ防止）
    if (
      currentState.mode === mode &&
      employee && 
      currentState.formData.name === employee.name &&
      currentState.formData.email === employee.email
    ) {
      return;
    }
    
    if (employee) {
      // 既存データで初期化
      set({
        formData: {
          name: employee.name,
          email: employee.email,
          phone: employee.phone || '',
          department: employee.department,
          position: employee.position,
          joinDate: employee.joinDate,
          skills: employee.skills,
          notes: employee.notes || '',
          isActive: employee.isActive,
        },
        mode,
        errors: {},
        customSkill: '',
        isDirty: false,
      });
    } else {
      // 新規作成で初期化
      set({
        formData: initialFormData,
        mode: 'create',
        errors: {},
        customSkill: '',
        isDirty: false,
      });
    }
  },

  resetForm: () => set(initialState),

  // フィールド操作
  updateField: (field, value) => {
    const state = get();
    // 値が同じ場合は何もしない（無限ループ防止）
    if (state.formData[field] === value) {
      return;
    }
    
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
      isDirty: true,
      // 該当フィールドのエラーをクリア
      errors: {
        ...state.errors,
        [field]: '',
      },
    }));
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
      isDirty: true,
    }));
  },

  // エラー管理
  setError: (field, message) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: message,
      },
    }));
  },

  clearError: (field) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: '',
      },
    }));
  },

  clearAllErrors: () => set({ errors: {} }),

  setErrors: (errors) => set({ errors }),

  // カスタムスキル
  setCustomSkill: (skill) => {
    const state = get();
    // 値が同じ場合は何もしない（無限ループ防止）
    if (state.customSkill === skill) {
      return;
    }
    set({ customSkill: skill });
  },

  addCustomSkill: () => {
    const { customSkill, formData } = get();
    const trimmedSkill = customSkill.trim();
    
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      set((state) => ({
        formData: {
          ...state.formData,
          skills: [...state.formData.skills, trimmedSkill],
        },
        customSkill: '',
        isDirty: true,
      }));
    }
  },

  // 状態管理
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setMode: (mode) => set({ mode }),
}));
