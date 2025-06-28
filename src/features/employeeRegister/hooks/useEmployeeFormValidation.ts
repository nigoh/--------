/**
 * 社員登録フォームバリデーションのカスタムフック
 * 
 * バリデーションロジックをフォームコンポーネントから分離し、
 * 再利用可能なバリデーション機能を提供
 */
import { useState } from 'react';

// バリデーションエラーの型定義
export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
}

// フォームデータの型定義（Employee型のサブセット）
export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  skills: string[];
  joinDate: string;
  notes?: string;
}

/**
 * バリデーション設定
 */
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: false,
    pattern: /^(\d{2,4}-?\d{2,4}-?\d{4}|\d{10,11})$/,
  },
  department: {
    required: true,
  },
  position: {
    required: true,
  },
} as const;

/**
 * 社員登録フォームバリデーションのカスタムフック
 */
export const useEmployeeFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  /**
   * 名前のバリデーション
   */
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return '名前は必須です';
    }
    if (name.trim().length < VALIDATION_RULES.name.minLength) {
      return `名前は${VALIDATION_RULES.name.minLength}文字以上で入力してください`;
    }
    if (name.trim().length > VALIDATION_RULES.name.maxLength) {
      return `名前は${VALIDATION_RULES.name.maxLength}文字以下で入力してください`;
    }
    return undefined;
  };

  /**
   * メールアドレスのバリデーション
   */
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'メールアドレスは必須です';
    }
    if (!VALIDATION_RULES.email.pattern.test(email)) {
      return '正しいメールアドレス形式で入力してください';
    }
    return undefined;
  };

  /**
   * 電話番号のバリデーション
   */
  const validatePhone = (phone: string): string | undefined => {
    if (phone && !VALIDATION_RULES.phone.pattern.test(phone)) {
      return '正しい電話番号形式で入力してください（例：090-1234-5678）';
    }
    return undefined;
  };

  /**
   * 部署のバリデーション
   */
  const validateDepartment = (department: string): string | undefined => {
    if (!department) {
      return '部署は必須です';
    }
    return undefined;
  };

  /**
   * 役職のバリデーション
   */
  const validatePosition = (position: string): string | undefined => {
    if (!position) {
      return '役職は必須です';
    }
    return undefined;
  };

  /**
   * フォーム全体のバリデーション
   */
  const validateForm = (formData: EmployeeFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // 各フィールドのバリデーション
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    const departmentError = validateDepartment(formData.department);
    if (departmentError) errors.department = departmentError;

    const positionError = validatePosition(formData.position);
    if (positionError) errors.position = positionError;

    setValidationErrors(errors);
    return errors;
  };

  /**
   * 単一フィールドのバリデーション
   */
  const validateField = (fieldName: keyof EmployeeFormData, value: string) => {
    let error: string | undefined;

    switch (fieldName) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'department':
        error = validateDepartment(value);
        break;
      case 'position':
        error = validatePosition(value);
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));

    return error;
  };

  /**
   * エラーのクリア
   */
  const clearErrors = () => {
    setValidationErrors({});
  };

  /**
   * 特定フィールドのエラーをクリア
   */
  const clearFieldError = (fieldName: keyof ValidationErrors) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: undefined,
    }));
  };

  /**
   * フォームが有効かどうかを判定
   */
  const isFormValid = (formData: EmployeeFormData): boolean => {
    const errors = validateForm(formData);
    return Object.keys(errors).length === 0;
  };

  return {
    validationErrors,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    isFormValid,
    setValidationErrors,
  };
};

export default useEmployeeFormValidation;
