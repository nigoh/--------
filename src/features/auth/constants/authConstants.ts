/**
 * Authentication Constants
 * 認証機能の定数定義
 */

export const AUTH_CONSTANTS = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Session storage keys
  STORAGE_KEYS: {
    USER_PREFERENCES: 'auth_user_preferences',
    REMEMBER_EMAIL: 'auth_remember_email',
    THEME_PREFERENCE: 'auth_theme_preference',
  },
  
  // Timeouts and delays
  TIMEOUTS: {
    EMAIL_VERIFICATION_RESEND: 60000, // 1 minute
    PASSWORD_RESET_RESEND: 60000, // 1 minute
    MFA_CODE_TIMEOUT: 300000, // 5 minutes
    AUTO_LOGOUT: 1800000, // 30 minutes
  },
  
  // UI Constants
  UI: {
    TOAST_DURATION: 5000,
    LOADING_DEBOUNCE: 300,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900000, // 15 minutes
  },
  
  // Routes
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    MFA: '/mfa',
    HOME: '/home',
    DASHBOARD: '/',
    PASSWORD_RESET: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },
  
  // MFA
  MFA: {
    TOTP_WINDOW: 1, // Allow 1 step tolerance for TOTP
    BACKUP_CODES_COUNT: 8,
    CODE_LENGTH: 6,
  },
  
  // Passkey
  PASSKEY: {
    TIMEOUT: 60000, // 1 minute
    USER_VERIFICATION: 'required',
    AUTHENTICATOR_ATTACHMENT: 'platform',
    RESIDENT_KEY: 'required',
  },
} as const;

// Error messages for i18n
export const AUTH_ERRORS = {
  // Japanese messages
  ja: {
    'auth/user-not-found': 'メールアドレスが登録されていません',
    'auth/wrong-password': 'パスワードが正しくありません',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/weak-password': 'パスワードが簡単すぎます。8文字以上で英大小文字と数字を含めてください',
    'auth/invalid-email': '有効なメールアドレスを入力してください',
    'auth/network-request-failed': '通信に失敗しました。再試行してください',
    'auth/multi-factor-auth-required': '多要素認証が必要です',
    'auth/too-many-requests': 'リクエストが多すぎます。しばらく待ってから再試行してください',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'validation/email-required': 'メールアドレスは必須です',
    'validation/password-required': 'パスワードは必須です',
    'validation/password-too-short': 'パスワードは8文字以上である必要があります',
    'validation/password-weak': 'パスワードは英大小文字と数字を含む必要があります',
    'validation/passwords-not-match': 'パスワードが一致しません',
    'validation/display-name-required': '表示名は必須です',
    'generic/unknown-error': '不明なエラーが発生しました',
    'mfa/code-required': '認証コードは必須です',
    'mfa/invalid-code': '認証コードが正しくありません',
    'passkey/not-supported': 'お使いのブラウザはパスキーをサポートしていません',
    'passkey/creation-failed': 'パスキーの作成に失敗しました',
    'passkey/authentication-failed': 'パスキー認証に失敗しました',
  },
  
  // English messages
  en: {
    'auth/user-not-found': 'Email address is not registered',
    'auth/wrong-password': 'Password is incorrect',
    'auth/email-already-in-use': 'Email address is already in use',
    'auth/weak-password': 'Password is too weak. Use 8+ characters with uppercase, lowercase, and numbers',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/network-request-failed': 'Network request failed. Please try again',
    'auth/multi-factor-auth-required': 'Multi-factor authentication required',
    'auth/too-many-requests': 'Too many requests. Please wait and try again',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/user-disabled': 'This account has been disabled',
    'validation/email-required': 'Email address is required',
    'validation/password-required': 'Password is required',
    'validation/password-too-short': 'Password must be at least 8 characters',
    'validation/password-weak': 'Password must contain uppercase, lowercase, and numbers',
    'validation/passwords-not-match': 'Passwords do not match',
    'validation/display-name-required': 'Display name is required',
    'generic/unknown-error': 'An unknown error occurred',
    'mfa/code-required': 'Authentication code is required',
    'mfa/invalid-code': 'Authentication code is incorrect',
    'passkey/not-supported': 'Your browser does not support passkeys',
    'passkey/creation-failed': 'Failed to create passkey',
    'passkey/authentication-failed': 'Passkey authentication failed',
  },
} as const;

export type Locale = keyof typeof AUTH_ERRORS;