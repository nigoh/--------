import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase設定 (Node.js環境用)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com", 
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);

async function enableTotpMfa() {
  try {
    console.log('TOTP MFA設定を開始します...');
    
    const result = await getAuth(app).projectConfigManager().updateProjectConfig({
      multiFactorConfig: {
        providerConfigs: [{
          state: "ENABLED",
          totpProviderConfig: {
            adjacentIntervals: 5
          }
        }]
      }
    });
    
    console.log('✅ TOTP MFA設定が完了しました:', result);
  } catch (error) {
    console.error('❌ TOTP MFA設定でエラーが発生しました:', error);
    console.error('Firebase Console での手動設定を推奨します。');
  }
}

enableTotpMfa();