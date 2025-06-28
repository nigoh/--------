import { useEffect } from 'react';

/**
 * タイマー用キーボードショートカット
 */
export interface TimerShortcuts {
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onClose?: () => void;
}

export const useTimerShortcuts = (shortcuts: TimerShortcuts, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // モーダルがフォーカスされている場合のみ動作
      const isModalActive = document.querySelector('[role="dialog"]');
      if (!isModalActive) return;

      // 入力フィールドにフォーカスがある場合は無効
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (event.shiftKey) {
            shortcuts.onReset?.();
          } else {
            // 現在の状態に応じてスタート/ポーズを切り替え
            const timerRunning = document.querySelector('[data-timer-running="true"]');
            if (timerRunning) {
              shortcuts.onPause?.();
            } else {
              shortcuts.onStart?.();
            }
          }
          break;
        
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            shortcuts.onReset?.();
          }
          break;
        
        case 'Escape':
          event.preventDefault();
          shortcuts.onClose?.();
          break;
        
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};

/**
 * ショートカットヘルプ表示用
 */
export const TIMER_SHORTCUTS_HELP = [
  { key: 'Space', description: 'スタート/一時停止' },
  { key: 'Shift + Space', description: 'リセット' },
  { key: 'Ctrl + R', description: 'リセット' },
  { key: 'Escape', description: 'モーダルを閉じる' },
];
