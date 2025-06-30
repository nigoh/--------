/**
 * useRegister Hook
 * ユーザー登録機能専用のカスタムフック
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validateRegisterForm, getPasswordStrength } from '../utils/authUtils';
import { ValidationErrors } from '../types/authTypes';
import { useTemporary } from '../../../hooks/useTemporary';

export interface UseRegisterReturn {
  // Form state
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
  
  // Validation
  errors: ValidationErrors;
  isValid: boolean;
  passwordStrength: { score: number; feedback: string[] };
  
  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setDisplayName: (name: string) => void;
  setAcceptTerms: (accept: boolean) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<boolean>;
  clearForm: () => void;
  
  // State
  loading: boolean;
  error: string | null;
}

/**
 * ユーザー登録機能専用フック
 */
export const useRegister = (): UseRegisterReturn => {
  const { register, loading, error, clearError } = useAuth();
  const { toast } = useTemporary();
  
  // フォーム状態
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // パスワード強度
  const passwordStrength = getPasswordStrength(password);

  // バリデーション
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateRegisterForm(
      email, 
      password, 
      confirmPassword, 
      displayName
    );
    
    // 利用規約の同意チェック
    if (!acceptTerms) {
      validationErrors.acceptTerms = '利用規約への同意が必要です';
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [email, password, confirmPassword, displayName, acceptTerms]);

  const isValid = validateForm();

  // フォーム送信
  const handleSubmit = useCallback(async (e?: React.FormEvent): Promise<boolean> => {
    if (e) {
      e.preventDefault();
    }

    // バリデーション
    if (!validateForm()) {
      toast.error('入力内容を確認してください');
      return false;
    }

    // エラーをクリア
    clearError();
    setErrors({});

    try {
      const success = await register({
        email,
        password,
        displayName: displayName.trim() || undefined,
      });
      
      if (success) {
        toast.success('アカウントが作成されました。メールを確認してください。');
        return true;
      } else {
        toast.error('アカウントの作成に失敗しました');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('予期しないエラーが発生しました');
      return false;
    }
  }, [
    email, 
    password, 
    displayName, 
    register, 
    validateForm, 
    clearError, 
    toast
  ]);

  // フォームクリア
  const clearForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setAcceptTerms(false);
    setErrors({});
    clearError();
  }, [clearError]);

  return {
    // Form state
    email,
    password,
    confirmPassword,
    displayName,
    acceptTerms,
    
    // Validation
    errors,
    isValid,
    passwordStrength,
    
    // Actions
    setEmail,
    setPassword,
    setConfirmPassword,
    setDisplayName,
    setAcceptTerms,
    handleSubmit,
    clearForm,
    
    // State
    loading,
    error,
  };
};