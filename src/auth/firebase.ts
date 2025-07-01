/**
 * Firebase設定とSDKの初期化
 * Firebase Authentication v10対応
 */
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  type Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  type Firestore
} from 'firebase/firestore';
import { 
  getFunctions, 
  connectFunctionsEmulator,
  type Functions
} from 'firebase/functions';

// Firebase設定
// 実際の本番環境では環境変数から取得する
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth: Auth = getAuth(app);

// Firebase Firestore
export const db: Firestore = getFirestore(app);

// Firebase Functions
export const functions: Functions = getFunctions(app);

// 開発環境でのエミュレーター接続
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' && !auth.emulatorConfig) {
  try {
    // Firebase Emulator Suite のデフォルトポート設定
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    
    console.log('🔧 Firebase Emulator に接続しました');
  } catch (error) {
    console.warn('⚠️ Firebase Emulator への接続に失敗しました:', error);
  }
}

// App Check の設定（本番環境のみ）
if (import.meta.env.PROD) {
  // TODO: App Check の実装
  // import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
}

export default app;
