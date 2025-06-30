/**
 * useAuthStore Tests
 * 認証ストアのテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../features/auth/stores/useAuthStore';

// Firebase モック
vi.mock('../features/auth/services/authService', () => ({
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  sendPasswordReset: vi.fn(),
  resendEmailVerification: vi.fn(),
  observeAuthState: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // ストアのリセット
    useAuthStore.getState().reset();
  });

  it('初期状態が正しく設定される', () => {
    const state = useAuthStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.mfaRequired).toBe(false);
    expect(state.emailVerificationSent).toBe(false);
  });

  it('ユーザーの設定が正しく動作する', () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: true,
      phoneNumber: null,
    };

    useAuthStore.getState().setUser(mockUser);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('ローディング状態の設定が正しく動作する', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().loading).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('エラー状態の設定が正しく動作する', () => {
    const errorMessage = 'Test error message';
    
    useAuthStore.getState().setError(errorMessage);
    expect(useAuthStore.getState().error).toBe(errorMessage);

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('MFA必須状態の設定が正しく動作する', () => {
    useAuthStore.getState().setMfaRequired(true);
    expect(useAuthStore.getState().mfaRequired).toBe(true);

    useAuthStore.getState().setMfaRequired(false);
    expect(useAuthStore.getState().mfaRequired).toBe(false);
  });

  it('メール確認送信状態の設定が正しく動作する', () => {
    useAuthStore.getState().setEmailVerificationSent(true);
    expect(useAuthStore.getState().emailVerificationSent).toBe(true);

    useAuthStore.getState().setEmailVerificationSent(false);
    expect(useAuthStore.getState().emailVerificationSent).toBe(false);
  });

  it('ストアのリセットが正しく動作する', () => {
    // 状態を変更
    useAuthStore.getState().setUser({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: true,
      phoneNumber: null,
    });
    useAuthStore.getState().setError('Test error');
    useAuthStore.getState().setLoading(true);

    // リセット
    useAuthStore.getState().reset();

    // 初期状態に戻っているか確認
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.mfaRequired).toBe(false);
    expect(state.emailVerificationSent).toBe(false);
  });
});