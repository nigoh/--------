/**
 * Firebase Configuration
 * Firebase認証とFirestoreの初期化設定
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  browserSessionPersistence,
  setPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { 
  getFunctions, 
  connectFunctionsEmulator 
} from 'firebase/functions';

// Firebase configuration - In production, these should come from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo-app-id",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEMO-MEASUREMENT"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Functions
export const functions = getFunctions(app);

// Development environment setup
const isDevelopment = process.env.NODE_ENV === 'development';
const useEmulators = process.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (isDevelopment && useEmulators) {
  try {
    // Connect to Auth Emulator
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    
    // Connect to Firestore Emulator
    if (!firestore._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
    
    // Connect to Functions Emulator
    if (!functions._delegate.customDomain) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
    
    console.log('🔧 Connected to Firebase Emulators');
  } catch (error) {
    console.warn('Firebase Emulator connection failed:', error);
  }
}

// Set auth persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn('Failed to set auth persistence:', error);
});

// Export Firebase services
export { app };
export default app;