import { create } from 'zustand';

// 設定フォームのデータ型
interface SettingsFormData {
  id?: string;
  name: string;
  category: string;
  value: string;
  description: string;
}

// 設定フォームの状態
interface SettingsFormState {
  // ダイアログの表示状態
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // 選択中の設定と入力データ
  selectedSetting: any | null;
  formData: SettingsFormData;
  
  // アクション
  setCreateDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedSetting: (setting: any | null) => void;
  setFormData: (data: Partial<SettingsFormData>) => void;
  updateField: <K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) => void;
  resetForm: () => void;
}

// 初期フォームデータ
const initialFormData: SettingsFormData = {
  name: '',
  category: '',
  value: '',
  description: '',
};

/**
 * 設定フォーム用のZustandストア
 * フォーム状態とダイアログ表示を管理
 */
export const useSettingsFormStore = create<SettingsFormState>((set, get) => ({
  // 状態
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedSetting: null,
  formData: { ...initialFormData },
  
  // ダイアログ表示制御
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
  
  // データ設定
  setSelectedSetting: (setting) => set({ selectedSetting: setting }),
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  // フィールド更新（無限ループ防止のため、値が同じなら更新しない）
  updateField: (field, value) => {
    const state = get();
    if (state.formData[field] === value) return;
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    }));
  },
  
  // フォームリセット
  resetForm: () => set({ 
    formData: { ...initialFormData },
    selectedSetting: null
  }),
}));
