/**
 * Storage Transport - IndexedDB/LocalStorage へのバッファリング
 */

import { Transport } from './Transport';
import type { LogEntry } from '../types';

export class StorageTransport extends Transport {
  private storageKey = 'app-logs';
  private maxEntries = 1000; // 最大保存件数
  private useIndexedDB = true;

  constructor(options: { maxEntries?: number; useIndexedDB?: boolean } = {}) {
    super({ enabled: true, minLevel: 'debug' });
    this.maxEntries = options.maxEntries ?? 1000;
    this.useIndexedDB = options.useIndexedDB ?? true;
  }

  async send(entry: LogEntry): Promise<void> {
    if (!this.shouldLog(entry.level)) return;

    try {
      if (this.useIndexedDB && this.isIndexedDBAvailable()) {
        await this.saveToIndexedDB(entry);
      } else {
        this.saveToLocalStorage(entry);
      }
    } catch (error) {
      // Storage失敗時はコンソールにフォールバック
      console.warn('Failed to save log to storage:', error);
      console.log('Original log entry:', entry);
    }
  }

  /**
   * LocalStorage に保存
   */
  private saveToLocalStorage(entry: LogEntry): void {
    try {
      const logs = this.getStoredLogs();
      logs.push(entry);

      // 最大件数を超えた場合は古いものから削除
      if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.warn('LocalStorage save failed:', error);
    }
  }

  /**
   * IndexedDB に保存
   */
  private async saveToIndexedDB(entry: LogEntry): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppLogsDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['logs'], 'readwrite');
        const store = transaction.objectStore('logs');
        
        const addRequest = store.add({
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });

        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);

        // 古いエントリの削除
        this.cleanupOldEntries(store);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore('logs', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('level', 'level', { unique: false });
      };
    });
  }

  /**
   * 保存されたログを取得
   */
  getStoredLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * 保存されたログをクリア
   */
  clearStoredLogs(): void {
    localStorage.removeItem(this.storageKey);
    
    if (this.isIndexedDBAvailable()) {
      const request = indexedDB.open('AppLogsDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['logs'], 'readwrite');
        const store = transaction.objectStore('logs');
        store.clear();
      };
    }
  }

  /**
   * IndexedDB サポート確認
   */
  private isIndexedDBAvailable(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  /**
   * 古いエントリの削除（IndexedDB）
   */
  private cleanupOldEntries(store: IDBObjectStore): void {
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result > this.maxEntries) {
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          const allEntries = getAllRequest.result;
          const sorted = allEntries.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          const toDelete = sorted.slice(0, allEntries.length - this.maxEntries);
          toDelete.forEach(entry => store.delete(entry.id));
        };
      }
    };
  }
}