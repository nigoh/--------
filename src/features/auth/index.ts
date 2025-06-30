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
export { PasskeyButton } from './components/PasskeyButton';
export { OtpInput } from './components/OtpInput';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useMFA } from './hooks/useMFA';
export { usePasskey } from './hooks/usePasskey';

// Services
export * from './services/authService';
export * from './services/mfaService';
export * from './services/passkeyService';
export { auth, firestore, functions } from './services/firebase';

// Stores
export { useAuthStore } from './stores/useAuthStore';

// Types
export * from './types/authTypes';

// Constants
export { AUTH_CONSTANTS, AUTH_ERRORS } from './constants/authConstants';

// Utils
export * from './utils/authUtils';