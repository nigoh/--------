/**
 * 社員フォーム管理用Hook (Zustand準拠版)
 * 
 * Zustandストアを使用した状態管理、バリデーション、保存処理
 */
import { useCallback } from 'react';
import { useEmployeeStore, Employee } from '../useEmployeeStore';
import { useEmployeeFormStore } from '../stores/useEmployeeFormStore';
import { useTemporary } from '../../../hooks/useTemporary';

export interface ValidationErrors {
  [key: string]: string;
}

export const useEmployeeForm = (
  employee?: Employee | null,
  mode: 'create' | 'edit' | 'view' = 'create'
) => {
  // Zustandストアから状態とアクションを取得
  const {
    formData,
    errors,
    customSkill,
    isSubmitting,
    isDirty,
    initializeForm,
    updateField,
    setCustomSkill,
    addCustomSkill,
    setSubmitting,
    clearAllErrors,
    setErrors,
  } = useEmployeeFormStore();

  const { addEmployee, updateEmployee } = useEmployeeStore();
  const { toast, progress } = useTemporary();
  
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  const isCreating = mode === 'create';

  /**
   * フォームデータを初期化（メモ化）
   */
  const initializeFormWithOpen = useCallback((isOpen: boolean) => {
    if (isOpen) {
      initializeForm(employee, mode);
    }
  }, [employee?.id, mode, initializeForm]); // employeeの変更はIDで判定

  /**
   * 入力フィールドの変更ハンドラー（メモ化）
   */
  const handleInputChange = useCallback((field: keyof typeof formData, value: any) => {
    updateField(field, value);
  }, [updateField]);

  /**
   * カスタムスキル追加ハンドラー（メモ化）
   */
  const handleAddCustomSkill = useCallback(() => {
    addCustomSkill();
  }, [addCustomSkill]);

  /**
   * Enterキーでのカスタムスキル追加（メモ化）
   */
  const handleCustomSkillKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  }, [handleAddCustomSkill]);

  /**
   * バリデーション（メモ化）
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.department.trim()) {
      newErrors.department = '部署は必須です';
    }

    if (!formData.position.trim()) {
      newErrors.position = '役職は必須です';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = '入社日は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  /**
   * 保存処理（メモ化）
   */
  const handleSave = useCallback(async (onSuccess?: () => void) => {
    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return false;
    }

    setSubmitting(true);
    progress.start(isEditing ? '社員情報を更新中...' : '社員を登録中...', 1);

    try {
      // 擬似的な遅延
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditing && employee) {
        // 更新
        updateEmployee(employee.id, formData);
        toast.success(`${formData.name}さんの情報を更新しました`);
      } else {
        // 新規登録
        const newEmployee: Employee = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addEmployee(newEmployee);
        toast.success(`${formData.name}さんを登録しました`);
      }

      progress.complete();
      onSuccess?.();

      // 1秒後に進行状況をクリア
      setTimeout(() => {
        progress.clear();
      }, 1000);

      return true;

    } catch (err) {
      progress.error();
      toast.error(isEditing ? '更新に失敗しました' : '登録に失敗しました');

      setTimeout(() => {
        progress.clear();
      }, 2000);

      return false;
    } finally {
      setSubmitting(false);
    }
  }, [
    validateForm, 
    setSubmitting, 
    formData, 
    isEditing, 
    employee, 
    updateEmployee, 
    addEmployee, 
    toast, 
    progress
  ]);

  return {
    // Zustand状態
    formData,
    errors,
    customSkill,
    isSubmitting,
    isDirty,
    
    // フラグ
    isEditing,
    isViewing,
    isCreating,
    
    // 関数
    initializeForm: initializeFormWithOpen,
    handleInputChange,
    handleAddCustomSkill,
    handleCustomSkillKeyPress,
    validateForm,
    handleSave,
    setCustomSkill,
  };
};
