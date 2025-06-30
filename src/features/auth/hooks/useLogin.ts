/**
 * useLogin Hook
 * ログイン機能専用のカスタムフック
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validateLoginForm } from '../utils/authUtils';
import { ValidationErrors } from '../types/authTypes';
import { useTemporary } from '../../../hooks/useTemporary';

export interface UseLoginReturn {
  // Form state
  email: string;
  password: string;
  rememberMe: boolean;
  
  // Validation
  errors: ValidationErrors;
  isValid: boolean;
  
  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRememberMe: (remember: boolean) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<boolean>;
  clearForm: () => void;
  
  // State
  loading: boolean;
  error: string | null;
}

/**
 * ログイン機能専用フック
 */
export const useLogin = (): UseLoginReturn => {
  const { login, loading, error, clearError } = useAuth();
  const { toast } = useTemporary();
  
  // フォーム状態
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // バリデーション
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [email, password]);

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
      const success = await login({ email, password });
      
      if (success) {
        toast.success('ログインしました');
        
        // Remember me の処理
        if (rememberMe) {
          localStorage.setItem('auth_remember_email', email);
        } else {
          localStorage.removeItem('auth_remember_email');
        }
        
        return true;
      } else {
        toast.error('ログインに失敗しました');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('予期しないエラーが発生しました');
      return false;
    }
  }, [email, password, rememberMe, login, validateForm, clearError, toast]);

  // フォームクリア
  const clearForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setRememberMe(false);
    setErrors({});
    clearError();
  }, [clearError]);

  // 初期化処理：記憶されたメールアドレスを復元
  useState(() => {
    const rememberedEmail = localStorage.getItem('auth_remember_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  });

  return {
    // Form state
    email,
    password,
    rememberMe,
    
    // Validation
    errors,
    isValid,
    
    // Actions
    setEmail,
    setPassword,
    setRememberMe,
    handleSubmit,
    clearForm,
    
    // State
    loading,
    error,
  };
};