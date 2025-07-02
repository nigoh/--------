/// <reference types="vite/client" />

import type { Logger } from './logging';

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_USE_FIREBASE_EMULATORS: string
  readonly VITE_DEV_AUTH_BYPASS: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global logger for error boundaries and non-React contexts
declare global {
  interface Window {
    __APP_LOGGER__?: Logger;
  }
}
