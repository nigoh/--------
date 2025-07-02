/**
 * HTTP Transport - バックエンドAPIへのバッチ送信
 */

import { Transport } from './Transport';
import type { LogEntry } from '../types';

interface HttpTransportOptions {
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class HttpTransport extends Transport {
  private endpoint: string;
  private batchSize: number;
  private flushInterval: number;
  private maxRetries: number;
  private retryDelay: number;
  
  private buffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private retryCount = 0;

  constructor(endpoint: string = '/api/logs', options: HttpTransportOptions = {}) {
    super({ 
      enabled: true, 
      minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
    });
    
    this.endpoint = endpoint;
    this.batchSize = options.batchSize ?? 10;
    this.flushInterval = options.flushInterval ?? 5000; // 5秒
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000; // 1秒

    // ページ離脱時の送信
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
    }
  }

  send(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    this.buffer.push(entry);

    // バッファが満杯またはFATAL/ERRORの場合は即座に送信
    if (this.buffer.length >= this.batchSize || entry.level === 'fatal' || entry.level === 'error') {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  /**
   * バッファの内容を送信
   */
  private async flush(sync: boolean = false): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
      if (sync && navigator.sendBeacon) {
        // ページ離脱時の同期送信
        navigator.sendBeacon(
          this.endpoint,
          JSON.stringify({ logs: logsToSend })
        );
      } else {
        await this.sendToServer(logsToSend);
      }
      
      this.retryCount = 0;
    } catch (error) {
      console.warn('Failed to send logs to server:', error);
      
      // リトライ処理
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.buffer.unshift(...logsToSend); // バッファに戻す
        
        setTimeout(() => {
          this.flush();
        }, this.retryDelay * Math.pow(2, this.retryCount - 1)); // 指数バックオフ
      } else {
        // 最大リトライ回数に達した場合はコンソールに出力
        console.error('Max retries exceeded. Logs lost:', logsToSend);
        this.retryCount = 0;
      }
    }
  }

  /**
   * サーバーへの送信
   */
  private async sendToServer(logs: LogEntry[]): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        logs,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * フラッシュをスケジュール
   */
  private scheduleFlush(): void {
    if (this.flushTimer) return;

    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * 手動フラッシュ
   */
  public forceFlush(): Promise<void> {
    return this.flush();
  }

  /**
   * バッファサイズ取得
   */
  public getBufferSize(): number {
    return this.buffer.length;
  }

  /**
   * トランスポート停止時のクリーンアップ
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(true);
  }
}