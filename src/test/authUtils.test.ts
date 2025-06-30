/**
 * Authentication Utils Tests
 * 認証ユーティリティのテスト
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateLoginForm,
  validateRegisterForm,
  getErrorMessage,
  isPasskeySupported,
} from '../features/auth/utils/authUtils';

describe('Authentication Utils', () => {
  describe('validateEmail', () => {
    it('有効なメールアドレスを正しく検証する', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@company.co.jp')).toBe(true);
      expect(validateEmail('a@b.c')).toBe(true);
    });

    it('無効なメールアドレスを正しく検証する', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@invalid.com')).toBe(false);
      expect(validateEmail('invalid.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('有効なパスワードを正しく検証する', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('StrongPass1')).toBe(true);
      expect(validatePassword('MyPassword123')).toBe(true);
    });

    it('無効なパスワードを正しく検証する', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('password')).toBe(false); // 大文字なし
      expect(validatePassword('PASSWORD')).toBe(false); // 小文字なし
      expect(validatePassword('Password')).toBe(false); // 数字なし
      expect(validatePassword('12345678')).toBe(false); // 文字なし
    });
  });

  describe('getPasswordStrength', () => {
    it('弱いパスワードのスコアを正しく計算する', () => {
      const result = getPasswordStrength('weak');
      expect(result.score).toBe(1); // 小文字のみ
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('強いパスワードのスコアを正しく計算する', () => {
      const result = getPasswordStrength('StrongPassword123!');
      expect(result.score).toBe(5); // 全条件満たす
      expect(result.feedback.length).toBe(0);
    });

    it('中程度のパスワードのスコアを正しく計算する', () => {
      const result = getPasswordStrength('Password123');
      expect(result.score).toBe(4); // 大文字・小文字・数字・長さ
      expect(result.feedback.length).toBe(0);
    });
  });

  describe('validateLoginForm', () => {
    it('有効なログインフォームを正しく検証する', () => {
      const errors = validateLoginForm('test@example.com', 'password123');
      expect(Object.keys(errors).length).toBe(0);
    });

    it('無効なログインフォームを正しく検証する', () => {
      const errors = validateLoginForm('', '');
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });

    it('無効なメールアドレスを検出する', () => {
      const errors = validateLoginForm('invalid-email', 'password123');
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeUndefined();
    });
  });

  describe('validateRegisterForm', () => {
    it('有効な登録フォームを正しく検証する', () => {
      const errors = validateRegisterForm(
        'test@example.com',
        'Password123',
        'Password123',
        'Test User'
      );
      expect(Object.keys(errors).length).toBe(0);
    });

    it('パスワード不一致を検出する', () => {
      const errors = validateRegisterForm(
        'test@example.com',
        'Password123',
        'DifferentPassword123',
        'Test User'
      );
      expect(errors.confirmPassword).toBeDefined();
    });

    it('弱いパスワードを検出する', () => {
      const errors = validateRegisterForm(
        'test@example.com',
        'weak',
        'weak',
        'Test User'
      );
      expect(errors.password).toBeDefined();
    });
  });

  describe('getErrorMessage', () => {
    it('日本語のエラーメッセージを正しく取得する', () => {
      const message = getErrorMessage('auth/user-not-found', 'ja');
      expect(message).toBe('メールアドレスが登録されていません');
    });

    it('英語のエラーメッセージを正しく取得する', () => {
      const message = getErrorMessage('auth/user-not-found', 'en');
      expect(message).toBe('Email address is not registered');
    });

    it('未知のエラーコードに対してデフォルトメッセージを返す', () => {
      const message = getErrorMessage('unknown-error', 'ja');
      expect(message).toBe('不明なエラーが発生しました');
    });
  });

  describe('isPasskeySupported', () => {
    it('パスキーサポートを確認する', () => {
      // テスト環境では通常falseになる
      const supported = isPasskeySupported();
      expect(typeof supported).toBe('boolean');
    });
  });
});