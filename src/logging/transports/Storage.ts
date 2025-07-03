/**
 * Storage Transport
 * 
 * Stores logs in IndexedDB for offline support and buffering
 */

import { Transport } from './Transport';
import type { LogEntry, TransportConfig } from '../types';

interface StorageTransportConfig extends TransportConfig {
  dbName?: string;
  storeName?: string;
  maxEntries?: number;
  autoCleanup?: boolean;
  retentionDays?: number;
}

export class StorageTransport extends Transport {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private storeName: string;
  private maxEntries: number;
  private autoCleanup: boolean;
  private retentionDays: number;
  private initPromise: Promise<void>;

  constructor(config: StorageTransportConfig = {}) {
    super(config);
    
    const storageConfig = config as StorageTransportConfig;
    this.dbName = storageConfig.dbName || 'WorkAppLogs';
    this.storeName = storageConfig.storeName || 'logs';
    this.maxEntries = storageConfig.maxEntries || 1000;
    this.autoCleanup = storageConfig.autoCleanup ?? true;
    this.retentionDays = storageConfig.retentionDays || 7;
    
    this.initPromise = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        console.warn('IndexedDB not supported, StorageTransport disabled');
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.warn('Failed to open IndexedDB:', request.error);
        resolve(); // Don't reject, just disable storage
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('level', 'level');
          store.createIndex('sessionId', 'sessionId');
        }
      };
    });
  }

  async send(entry: LogEntry): Promise<void> {
    if (!this.shouldHandle(entry)) {
      return;
    }

    await this.initPromise;
    
    if (!this.db) {
      return; // IndexedDB not available
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Add timestamp as number for indexing
      const logRecord = {
        ...entry,
        timestampNum: new Date(entry.timestamp).getTime(),
      };
      
      await new Promise<void>((resolve, reject) => {
        const request = store.add(logRecord);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Auto cleanup if enabled
      if (this.autoCleanup) {
        this.cleanupOldEntries();
      }

    } catch (error) {
      console.warn('Failed to store log entry:', error);
    }
  }

  private async cleanupOldEntries(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Remove entries older than retention period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
      const cutoffTime = cutoffDate.getTime();
      
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      await new Promise<void>((resolve, reject) => {
        const request = index.openCursor(range);
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });

      // Also limit total number of entries
      await this.limitTotalEntries();

    } catch (error) {
      console.warn('Failed to cleanup old log entries:', error);
    }
  }

  private async limitTotalEntries(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const countRequest = store.count();
      const count = await new Promise<number>((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(countRequest.error);
      });

      if (count > this.maxEntries) {
        // Remove oldest entries
        const excessCount = count - this.maxEntries;
        const index = store.index('timestamp');
        
        await new Promise<void>((resolve, reject) => {
          let deletedCount = 0;
          const request = index.openCursor();
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor && deletedCount < excessCount) {
              cursor.delete();
              deletedCount++;
              cursor.continue();
            } else {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      }

    } catch (error) {
      console.warn('Failed to limit log entries:', error);
    }
  }

  async flush(): Promise<void> {
    // Storage transport doesn't need explicit flushing
    return Promise.resolve();
  }

  /**
   * Retrieve logs from storage (utility method)
   */
  async getLogs(options: {
    level?: string;
    sessionId?: string;
    since?: Date;
    limit?: number;
  } = {}): Promise<LogEntry[]> {
    await this.initPromise;
    
    if (!this.db) {
      return [];
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      let request: IDBRequest;
      
      if (options.since) {
        const index = store.index('timestamp');
        const range = IDBKeyRange.lowerBound(options.since.getTime());
        request = index.getAll(range, options.limit);
      } else {
        request = store.getAll(undefined, options.limit);
      }
      
      const results = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Filter by level and sessionId if specified
      return results
        .filter(entry => !options.level || entry.level === options.level)
        .filter(entry => !options.sessionId || entry.sessionId === options.sessionId)
        .map(entry => {
          // Remove internal timestampNum field
          const { timestampNum, id, ...logEntry } = entry;
          return logEntry as LogEntry;
        });

    } catch (error) {
      console.warn('Failed to retrieve logs:', error);
      return [];
    }
  }

  /**
   * Clear all logs from storage
   */
  async clearLogs(): Promise<void> {
    await this.initPromise;
    
    if (!this.db) {
      return;
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

    } catch (error) {
      console.warn('Failed to clear logs:', error);
    }
  }
}