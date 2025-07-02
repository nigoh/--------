/**
 * Logger Class - 統一ログインターフェース
 */

import type { LogLevel, LogEntry, LogContext } from './types';
import type { Transport } from './transports/Transport';
import { maskPII, maskSensitiveUrlParams } from './utils/maskPII';

export class Logger {
  private transports: Transport[] = [];
  private defaultContext: LogContext = {};

  constructor(transports: Transport[] = [], defaultContext: LogContext = {}) {
    this.transports = transports;
    this.defaultContext = defaultContext;
  }

  /**
   * Transport を追加
   */
  addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  /**
   * Transport を削除
   */
  removeTransport(transport: Transport): void {
    const index = this.transports.indexOf(transport);
    if (index > -1) {
      this.transports.splice(index, 1);
    }
  }

  /**
   * デフォルトコンテキストを設定
   */
  setDefaultContext(context: LogContext): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * 内部ログ処理
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // PII マスキング適用
    const maskedContext = context ? maskPII(context) : undefined;
    const maskedMessage = maskPII(message);

    // ログエントリ作成
    const entry: LogEntry = {
      level,
      message: maskedMessage,
      timestamp: new Date().toISOString(),
      context: maskedContext ? { ...this.defaultContext, ...maskedContext } : this.defaultContext,
      userId: this.getUserId(),
      url: this.getCurrentUrl(),
      userAgent: this.getUserAgent(),
      errorId: level === 'error' || level === 'fatal' ? this.generateErrorId() : undefined,
    };

    // 全 Transport に送信
    this.transports.forEach(transport => {
      try {
        const result = transport.send(entry);
        // Promise が返された場合のエラーハンドリング
        if (result instanceof Promise) {
          result.catch(error => {
            console.warn('Transport failed:', error);
          });
        }
      } catch (error) {
        console.warn('Transport sync failed:', error);
      }
    });
  }

  // ログレベル別メソッド
  trace = (message: string, context?: Record<string, unknown>): void => {
    this.log('trace', message, context);
  };

  debug = (message: string, context?: Record<string, unknown>): void => {
    this.log('debug', message, context);
  };

  info = (message: string, context?: Record<string, unknown>): void => {
    this.log('info', message, context);
  };

  warn = (message: string, context?: Record<string, unknown>): void => {
    this.log('warn', message, context);
  };

  error = (message: string, context?: Record<string, unknown>): void => {
    this.log('error', message, context);
  };

  fatal = (message: string, context?: Record<string, unknown>): void => {
    this.log('fatal', message, context);
  };

  /**
   * エラーオブジェクトをログ
   */
  logError = (error: Error, context?: Record<string, unknown>): void => {
    this.error(error.message, {
      ...context,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
    });
  };

  /**
   * パフォーマンス計測ログ
   */
  logPerformance = (name: string, duration: number, context?: Record<string, unknown>): void => {
    this.info(`Performance: ${name}`, {
      ...context,
      duration,
      type: 'performance',
    });
  };

  /**
   * ユーザーアクションログ
   */
  logUserAction = (action: string, target?: string, context?: Record<string, unknown>): void => {
    this.info(`User Action: ${action}`, {
      ...context,
      target,
      type: 'user-action',
    });
  };

  /**
   * API呼び出しログ
   */
  logApiCall = (method: string, url: string, status: number, duration: number, context?: Record<string, unknown>): void => {
    const level = status >= 400 ? 'error' : 'info';
    this.log(level, `API ${method} ${url} - ${status}`, {
      ...context,
      method,
      url: maskSensitiveUrlParams(url),
      status,
      duration,
      type: 'api-call',
    });
  };

  // ユーティリティメソッド
  private getUserId(): string | undefined {
    try {
      return localStorage.getItem('userId') || undefined;
    } catch {
      return undefined;
    }
  }

  private getCurrentUrl(): string {
    try {
      return maskSensitiveUrlParams(window.location.href);
    } catch {
      return 'unknown';
    }
  }

  private getUserAgent(): string {
    try {
      return navigator.userAgent;
    } catch {
      return 'unknown';
    }
  }

  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * ログ統計情報
   */
  getStats(): { transports: number; defaultContext: LogContext } {
    return {
      transports: this.transports.length,
      defaultContext: this.defaultContext,
    };
  }
}