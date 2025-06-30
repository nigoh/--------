/**
 * Authentication Utilities
 * 認証機能のユーティリティ関数
 */

import { AUTH_CONSTANTS, AUTH_ERRORS, Locale } from '../constants/authConstants';
import { ValidationErrors } from '../types/authTypes';

/**
 * メールアドレスの検証
 */
export const validateEmail = (email: string): boolean => {
  return AUTH_CONSTANTS.EMAIL_REGEX.test(email);
};

/**
 * パスワードの検証
 */
export const validatePassword = (password: string): boolean => {
  return (
    password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH &&
    AUTH_CONSTANTS.PASSWORD_REGEX.test(password)
  );
};

/**
 * パスワードの強度チェック
 */
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('8文字以上にしてください');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('小文字を含めてください');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('大文字を含めてください');

  if (/\d/.test(password)) score += 1;
  else feedback.push('数字を含めてください');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  return { score, feedback };
};

/**
 * ログインフォームの検証
 */
export const validateLoginForm = (
  email: string,
  password: string,
  locale: Locale = 'ja'
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email.trim()) {
    errors.email = AUTH_ERRORS[locale]['validation/email-required'];
  } else if (!validateEmail(email)) {
    errors.email = AUTH_ERRORS[locale]['auth/invalid-email'];
  }

  if (!password.trim()) {
    errors.password = AUTH_ERRORS[locale]['validation/password-required'];
  }

  return errors;
};

/**
 * 登録フォームの検証
 */
export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  displayName: string,
  locale: Locale = 'ja'
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // メール検証
  if (!email.trim()) {
    errors.email = AUTH_ERRORS[locale]['validation/email-required'];
  } else if (!validateEmail(email)) {
    errors.email = AUTH_ERRORS[locale]['auth/invalid-email'];
  }

  // パスワード検証
  if (!password.trim()) {
    errors.password = AUTH_ERRORS[locale]['validation/password-required'];
  } else if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.password = AUTH_ERRORS[locale]['validation/password-too-short'];
  } else if (!validatePassword(password)) {
    errors.password = AUTH_ERRORS[locale]['validation/password-weak'];
  }

  // パスワード確認
  if (password !== confirmPassword) {
    errors.confirmPassword = AUTH_ERRORS[locale]['validation/passwords-not-match'];
  }

  // 表示名検証（オプション）
  if (displayName && !displayName.trim()) {
    errors.displayName = AUTH_ERRORS[locale]['validation/display-name-required'];
  }

  return errors;
};

/**
 * エラーメッセージの取得
 */
export const getErrorMessage = (
  errorCode: string,
  locale: Locale = 'ja'
): string => {
  return AUTH_ERRORS[locale][errorCode as keyof typeof AUTH_ERRORS[typeof locale]] ||
         AUTH_ERRORS[locale]['generic/unknown-error'];
};

/**
 * パスキーサポートの確認
 */
export const isPasskeySupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'navigator' in window &&
    'credentials' in navigator &&
    'create' in navigator.credentials &&
    typeof PublicKeyCredential !== 'undefined'
  );
};

/**
 * WebAuthn サポート詳細の確認
 */
export const getWebAuthnSupport = (): {
  supported: boolean;
  platformAuthenticator: boolean;
  userVerification: boolean;
} => {
  if (!isPasskeySupported()) {
    return {
      supported: false,
      platformAuthenticator: false,
      userVerification: false,
    };
  }

  return {
    supported: true,
    platformAuthenticator: 
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function',
    userVerification: 
      typeof PublicKeyCredential.isConditionalMediationAvailable === 'function',
  };
};

/**
 * セッションストレージのヘルパー
 */
export const sessionStorageHelper = {
  set: (key: string, value: any): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  },

  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== 'undefined') {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
    }
  },
};

/**
 * ローカルストレージのヘルパー
 */
export const localStorageHelper = {
  set: (key: string, value: any): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
};

/**
 * デバウンス関数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 安全なルートリダイレクト
 */
export const safeRedirect = (path: string): void => {
  if (typeof window !== 'undefined') {
    // SPAのルーティングに適した処理
    // 実際の実装ではReact Routerなどのhistory.pushを使用
    window.location.href = path;
  }
};