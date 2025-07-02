/**
 * Transport Abstract Base Class
 * 
 * ログ出力先の共通インターフェース
 */

import type { LogEntry } from '../types';

export abstract class Transport {
  protected enabled: boolean = true;
  protected minLevel: string = 'trace';

  constructor(options: { enabled?: boolean; minLevel?: string } = {}) {
    this.enabled = options.enabled ?? true;
    this.minLevel = options.minLevel ?? 'trace';
  }

  /**
   * ログエントリを送信
   */
  abstract send(entry: LogEntry): Promise<void> | void;

  /**
   * 指定レベルのログが有効かチェック
   */
  shouldLog(level: string): boolean {
    if (!this.enabled) return false;
    
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    const currentLevelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    
    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Transport を有効/無効化
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 最小ログレベルを設定
   */
  setMinLevel(level: string): void {
    this.minLevel = level;
  }
}