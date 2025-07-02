/**
 * Console Transport - 開発時のカラー付きコンソール出力
 */

import { Transport } from './Transport';
import type { LogEntry } from '../types';

export class ConsoleTransport extends Transport {
  private colors = {
    trace: 'color: #6b7280; font-size: 11px;',
    debug: 'color: #3b82f6; font-weight: normal;',
    info: 'color: #10b981; font-weight: normal;',
    warn: 'color: #f59e0b; font-weight: bold;',
    error: 'color: #ef4444; font-weight: bold;',
    fatal: 'color: #dc2626; font-weight: bold; background: #fef2f2; padding: 2px 4px;'
  };

  private icons = {
    trace: '🔍',
    debug: '🐛', 
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    fatal: '💥'
  };

  constructor(enabled: boolean = true) {
    // 本番環境では無効化
    super({ 
      enabled: enabled && process.env.NODE_ENV !== 'production',
      minLevel: process.env.NODE_ENV === 'development' ? 'trace' : 'info'
    });
  }

  send(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const { level, message, context, timestamp } = entry;
    const icon = this.icons[level];
    const style = this.colors[level];
    const time = new Date(timestamp).toLocaleTimeString('ja-JP');

    // ログレベルに応じてconsoleメソッドを選択
    const consoleFn = this.getConsoleMethod(level);

    if (context && Object.keys(context).length > 0) {
      consoleFn(
        `%c${icon} [${time}] ${level.toUpperCase()}: ${message}`,
        style,
        context
      );
    } else {
      consoleFn(
        `%c${icon} [${time}] ${level.toUpperCase()}: ${message}`,
        style
      );
    }
  }

  private getConsoleMethod(level: string): (...args: any[]) => void {
    switch (level) {
      case 'error':
      case 'fatal':
        return console.error.bind(console);
      case 'warn':
        return console.warn.bind(console);
      case 'debug':
        return console.debug.bind(console);
      case 'trace':
        return console.trace.bind(console);
      default:
        return console.log.bind(console);
    }
  }
}