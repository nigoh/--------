/**
 * 社員登録フォーム状態管理のカスタムフック
 * 
 * フォームの状態管理、送信処理、リセット処理を分離し、
 * UIコンポーネントから独立したビジネスロジックを提供
 */
import { useState } from 'react';
import { useEmployeeStore } from '../useEmployeeStore';
import { useTemporary } from '../../../hooks/useTemporary';
import { useEmployeeFormValidation, EmployeeFormData } from './useEmployeeFormValidation';

/**
 * 初期フォームデータ
 */
const initialFormData: EmployeeFormData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  skills: [],
  joinDate: new Date().toISOString().split('T')[0], // 今日の日付
  notes: '',
};

/**
 * 社員登録フォーム状態管理のカスタムフック
 */
export const useEmployeeForm = () => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  
  const { addEmployee } = useEmployeeStore();
  const { toast, progress } = useTemporary();
  const {
    validationErrors,
    validateForm,
    validateField,
    clearErrors,
    isFormValid,
  } = useEmployeeFormValidation();

  /**
   * フォームデータを更新
   */
  const updateFormData = (field: keyof EmployeeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // リアルタイムバリデーション（文字列フィールドのみ）
    if (typeof value === 'string') {
      validateField(field, value);
    }
  };

  /**
   * スキルを追加/削除
   */
  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill),
    }));
  };

  /**
   * スキルを削除
   */
  const handleSkillDelete = (skillToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete),
    }));
  };

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (): Promise<boolean> => {
    // バリデーション実行
    if (!isFormValid(formData)) {
      toast.error('入力に不備があります。確認してください。');
      return false;
    }

    setIsSubmitting(true);
    progress.start('社員情報を登録中...', 1);

    try {
      // 擬似的な遅延（API呼び出しの模擬）
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 社員を登録
      addEmployee(formData);

      // 成功処理
      progress.complete();
      toast.success(`${formData.name}さんを登録しました`);
      
      // フォームをリセット
      handleReset();
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      progress.complete();
      toast.error('登録に失敗しました。もう一度お試しください。');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * フォームリセット処理
   */
  const handleReset = () => {
    setFormData(initialFormData);
    clearErrors();
    setSkillsExpanded(false);
    toast.info('フォームをリセットしました');
  };

  /**
   * スキル展開状態を切り替え
   */
  const toggleSkillsExpanded = () => {
    setSkillsExpanded(prev => !prev);
  };

  return {
    // フォーム状態
    formData,
    isSubmitting,
    skillsExpanded,
    validationErrors,
    
    // フォーム操作
    updateFormData,
    handleSkillChange,
    handleSkillDelete,
    handleSubmit,
    handleReset,
    toggleSkillsExpanded,
    
    // バリデーション
    isFormValid: () => isFormValid(formData),
  };
};

export default useEmployeeForm;
