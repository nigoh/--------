/**
 * 一時的なデータ管理用Zustandストア
 * 
 * アプリ全体で使用する一時的なデータ（通知、進行状況、トースト、
 * クリップボード、ユーザー設定、セッションデータ）を管理
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// 通知の型定義
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

// 進行状況の型定義
export interface Progress {
  id: string;
  label: string;
  current: number;
  total: number;
  status: 'running' | 'completed' | 'error';
}

// トーストの型定義
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  createdAt: Date;
}

// ユーザー設定の型定義
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  notifications: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
}

// 一時データの状態の型定義
export interface TemporaryData {
  notifications: Notification[];
  progress: Progress | null;
  toast: Toast | null;
  clipboard: string | null;
  userPreferences: UserPreferences;
  sessionData: Record<string, any>;
}

// アクションの型定義
export interface TemporaryActions {
  // 通知管理
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // 進行状況管理
  setProgress: (progress: Omit<Progress, 'id'> & { id?: string }) => void;
  updateProgress: (current: number, status?: Progress['status']) => void;
  clearProgress: () => void;
  
  // トースト管理
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  hideToast: () => void;
  
  // クリップボード管理
  setClipboard: (data: string) => void;
  clearClipboard: () => void;
  
  // ユーザー設定
  setUserPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetUserPreferences: () => void;
  
  // セッションデータ
  setSessionData: (key: string, value: any) => void;
  getSessionData: (key: string) => any;
  removeSessionData: (key: string) => void;
  clearSessionData: () => void;
  
  // 全体リセット
  reset: () => void;
}

export type TemporaryStore = TemporaryData & TemporaryActions;

// デフォルトユーザー設定
const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  language: 'ja',
  notifications: true,
  autoSave: true,
  soundEnabled: false,
};

// 初期状態
const initialState: TemporaryData = {
  notifications: [],
  progress: null,
  toast: null,
  clipboard: null,
  userPreferences: defaultUserPreferences,
  sessionData: {},
};

/**
 * 一時データ管理ストア
 */
export const useTemporaryStore = create<TemporaryStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // 通知管理
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      
      set((state) => ({
        notifications: [...state.notifications, newNotification],
      }));
      
      // 自動削除（duration指定時）
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, notification.duration);
      }
    },

    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }));
    },

    clearNotifications: () => set({ notifications: [] }),

    // 進行状況管理
    setProgress: (progress) => {
      const newProgress: Progress = {
        ...progress,
        id: progress.id || crypto.randomUUID(),
      };
      set({ progress: newProgress });
    },

    updateProgress: (current, status) => {
      const { progress } = get();
      if (progress) {
        set({
          progress: {
            ...progress,
            current,
            status: status || progress.status,
          },
        });
      }
    },

    clearProgress: () => set({ progress: null }),

    // トースト管理
    showToast: (message, type = 'info', duration = 3000) => {
      // 既存のトーストがあれば削除
      get().hideToast();
      
      const toast: Toast = {
        id: crypto.randomUUID(),
        message,
        type,
        duration,
        createdAt: new Date(),
      };
      
      set({ toast });
      
      // 自動非表示
      setTimeout(() => {
        get().hideToast();
      }, duration);
    },

    hideToast: () => set({ toast: null }),

    // クリップボード管理
    setClipboard: (data) => {
      set({ clipboard: data });
      
      // ブラウザのクリップボードにもコピー
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data).catch(() => {
          // クリップボードアクセスに失敗した場合は無視
        });
      }
    },

    clearClipboard: () => set({ clipboard: null }),

    // ユーザー設定
    setUserPreference: (key, value) => {
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          [key]: value,
        },
      }));
    },

    resetUserPreferences: () => set({ userPreferences: defaultUserPreferences }),

    // セッションデータ
    setSessionData: (key, value) => {
      set((state) => ({
        sessionData: {
          ...state.sessionData,
          [key]: value,
        },
      }));
    },

    getSessionData: (key) => get().sessionData[key],

    removeSessionData: (key) => {
      set((state) => {
        const { [key]: removed, ...rest } = state.sessionData;
        return { sessionData: rest };
      });
    },

    clearSessionData: () => set({ sessionData: {} }),

    // 全体リセット
    reset: () => set(initialState),
  }))
);
