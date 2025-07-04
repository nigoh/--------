/// <reference types="vite/client" />

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
  readonly VITE_ENABLE_ADMIN_CREATOR: string
  readonly VITE_ADMIN_CREATOR_TAB: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
