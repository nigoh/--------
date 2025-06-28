/**
 * 音声フィードバックシステム
 * タイマー完了時の通知音とバイブレーション
 */

export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  private constructor() {
    this.init();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }

  /**
   * 完了音を再生
   */
  async playCompletionSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // 美しいチャイム音を生成
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // ハーモニアスなチャイム音（C-E-G和音）
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.3); // E5
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.6); // G5

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

      oscillator.type = 'sine';
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1);

      // バイブレーション（対応デバイスのみ）
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.warn('Could not play completion sound:', error);
    }
  }

  /**
   * 警告音を再生（残り30秒）
   */
  async playWarningSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // 緊急度を表現する音（低めの音で注意喚起）
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      oscillator.type = 'triangle';
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);

      // 軽いバイブレーション
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.warn('Could not play warning sound:', error);
    }
  }

  /**
   * 音声を有効/無効切り替え
   */
  toggleSound(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * 音声が有効かどうか
   */
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}

export const soundManager = SoundManager.getInstance();
