/**
 * Authentication Feature Index
 * 認証機能の統一エクスポート
 */

// Components
export { AuthLayout } from './components/AuthLayout';
export { AuthPage } from './components/AuthPage';
export { AuthProvider, useAuthContext } from './components/AuthContext';
export { ProtectedRoute } from './components/ProtectedRoute';
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { SocialButtons } from './components/SocialButtons';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';

// Services
export * from './services/authService';
export { auth, firestore, functions } from './services/firebase';

// Stores
export { useAuthStore } from './stores/useAuthStore';

// Types
export * from './types/authTypes';

// Constants
export { AUTH_CONSTANTS, AUTH_ERRORS } from './constants/authConstants';

// Utils
export * from './utils/authUtils';