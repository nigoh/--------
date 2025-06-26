/**
 * 一時的なデータ管理用のカスタムフック
 * 
 * useTemporaryStoreのラッパーとして、より使いやすいAPIを提供
 */
import { useTemporaryStore } from '../stores/useTemporaryStore';

/**
 * 一時的なデータ管理用のカスタムフック
 */
export const useTemporary = () => {
  const store = useTemporaryStore();

  return {
    // 通知関連
    notify: {
      success: (message: string, title?: string, duration?: number) => 
        store.addNotification({ type: 'success', message, title, duration }),
      error: (message: string, title?: string, duration?: number) => 
        store.addNotification({ type: 'error', message, title, duration }),
      warning: (message: string, title?: string, duration?: number) => 
        store.addNotification({ type: 'warning', message, title, duration }),
      info: (message: string, title?: string, duration?: number) => 
        store.addNotification({ type: 'info', message, title, duration }),
      clear: () => store.clearNotifications(),
      remove: (id: string) => store.removeNotification(id),
    },

    // トースト関連
    toast: {
      success: (message: string, duration?: number) => 
        store.showToast(message, 'success', duration),
      error: (message: string, duration?: number) => 
        store.showToast(message, 'error', duration),
      warning: (message: string, duration?: number) => 
        store.showToast(message, 'warning', duration),
      info: (message: string, duration?: number) => 
        store.showToast(message, 'info', duration),
      hide: () => store.hideToast(),
    },

    // 進行状況関連
    progress: {
      start: (label: string, total: number) => 
        store.setProgress({ label, current: 0, total, status: 'running' }),
      update: (current: number) => store.updateProgress(current),
      complete: () => {
        const currentProgress = store.progress;
        if (currentProgress) {
          store.updateProgress(currentProgress.total, 'completed');
        }
      },
      error: () => {
        const currentProgress = store.progress;
        if (currentProgress) {
          store.updateProgress(currentProgress.current, 'error');
        }
      },
      clear: () => store.clearProgress(),
      get: () => store.progress,
    },

    // クリップボード関連
    clipboard: {
      copy: (data: string) => {
        store.setClipboard(data);
        store.showToast('クリップボードにコピーしました', 'success', 2000);
      },
      get: () => store.clipboard,
      clear: () => store.clearClipboard(),
    },

    // セッションデータ関連
    session: {
      set: store.setSessionData,
      get: store.getSessionData,
      remove: store.removeSessionData,
      clear: store.clearSessionData,
    },

    // 設定関連
    preferences: store.userPreferences,
    setPreference: store.setUserPreference,
    resetPreferences: store.resetUserPreferences,

    // 全体リセット
    reset: store.reset,

    // 生データアクセス（必要に応じて）
    raw: {
      notifications: store.notifications,
      progress: store.progress,
      toast: store.toast,
    },
  };
};

/**
 * 通知のみを使用するためのシンプルなフック
 */
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useTemporaryStore();
  
  return {
    notifications,
    add: addNotification,
    remove: removeNotification,
    clear: clearNotifications,
  };
};

/**
 * トーストのみを使用するためのシンプルなフック
 */
export const useToast = () => {
  const { toast, showToast, hideToast } = useTemporaryStore();
  
  return {
    toast,
    show: showToast,
    hide: hideToast,
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
  };
};

/**
 * 進行状況のみを使用するためのシンプルなフック
 */
export const useProgress = () => {
  const { progress, setProgress, updateProgress, clearProgress } = useTemporaryStore();
  
  return {
    progress,
    start: (label: string, total: number) => setProgress({ label, current: 0, total, status: 'running' }),
    update: updateProgress,
    complete: () => {
      if (progress) {
        updateProgress(progress.total, 'completed');
      }
    },
    error: () => {
      if (progress) {
        updateProgress(progress.current, 'error');
      }
    },
    clear: clearProgress,
  };
};
