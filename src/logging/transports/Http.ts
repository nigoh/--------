/**
 * HTTP Transport
 * 
 * Sends logs to a backend API with batching and retry logic
 */

import { Transport } from './Transport';
import type { LogEntry, TransportConfig } from '../types';
import { maskPII } from '../utils/maskPII';

interface HttpTransportConfig extends TransportConfig {
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  enablePIIMasking?: boolean;
  headers?: Record<string, string>;
}

interface QueuedEntry {
  entry: LogEntry;
  retryCount: number;
  timestamp: number;
}

export class HttpTransport extends Transport {
  private endpoint: string;
  private batchSize: number;
  private flushInterval: number;
  private maxRetries: number;
  private retryDelay: number;
  private enablePIIMasking: boolean;
  private headers: Record<string, string>;
  
  private queue: QueuedEntry[] = [];
  private flushTimer: number | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor(endpoint: string, config: HttpTransportConfig = {}) {
    super(config);
    
    const httpConfig = config as HttpTransportConfig;
    this.endpoint = endpoint;
    this.batchSize = httpConfig.batchSize || 10;
    this.flushInterval = httpConfig.flushInterval || 30000; // 30 seconds
    this.maxRetries = httpConfig.maxRetries || 3;
    this.retryDelay = httpConfig.retryDelay || 1000; // 1 second
    this.enablePIIMasking = httpConfig.enablePIIMasking ?? true;
    this.headers = {
      'Content-Type': 'application/json',
      ...httpConfig.headers,
    };

    this.setupEventListeners();
    this.startFlushTimer();
  }

  private setupEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Flush logs before page unload
    window.addEventListener('beforeunload', () => {
      this.flushSync();
    });
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = window.setInterval(() => {
      this.processPendingQueue();
    }, this.flushInterval);
  }

  async send(entry: LogEntry): Promise<void> {
    if (!this.shouldHandle(entry)) {
      return;
    }

    // Apply PII masking if enabled
    const processedEntry = this.enablePIIMasking ? this.maskSensitiveData(entry) : entry;

    // Add to queue
    this.queue.push({
      entry: processedEntry,
      retryCount: 0,
      timestamp: Date.now(),
    });

    // If queue is full, process immediately
    if (this.queue.length >= this.batchSize) {
      this.processPendingQueue();
    }
  }

  private maskSensitiveData(entry: LogEntry): LogEntry {
    return {
      ...entry,
      message: maskPII(entry.message),
      context: entry.context ? this.maskContextData(entry.context) : undefined,
    };
  }

  private maskContextData(context: Record<string, unknown>): Record<string, unknown> {
    const masked: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        masked[key] = maskPII(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively mask nested objects
        masked[key] = this.maskContextData(value as Record<string, unknown>);
      } else {
        masked[key] = value;
      }
    }
    
    return masked;
  }

  private async processPendingQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      await this.sendBatch(batch.map(item => item.entry));
    } catch (error) {
      console.warn('Failed to send log batch:', error);
      
      // Re-queue failed items for retry
      const retriableItems = batch.filter(item => item.retryCount < this.maxRetries);
      retriableItems.forEach(item => {
        item.retryCount++;
        this.queue.unshift(item); // Add back to front of queue
      });

      // Schedule retry with exponential backoff
      const delay = this.retryDelay * Math.pow(2, batch[0]?.retryCount || 0);
      setTimeout(() => this.processPendingQueue(), delay);
    }
  }

  private async sendBatch(entries: LogEntry[]): Promise<void> {
    const payload = {
      logs: entries,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length > 0) {
      await this.processPendingQueue();
    }
  }

  private flushSync(): void {
    // Synchronous flush for page unload
    if (this.queue.length === 0 || !this.isOnline) {
      return;
    }

    const batch = this.queue.splice(0, this.batchSize);
    const payload = {
      logs: batch.map(item => item.entry),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Use sendBeacon for synchronous sending during page unload
    if ('sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      // Fallback to synchronous XHR
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.endpoint, false); // Synchronous
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      try {
        xhr.send(JSON.stringify(payload));
      } catch (error) {
        console.warn('Failed to send logs synchronously:', error);
      }
    }
  }

  /**
   * Get current queue status (for debugging)
   */
  getQueueStatus(): { queueLength: number; isOnline: boolean } {
    return {
      queueLength: this.queue.length,
      isOnline: this.isOnline,
    };
  }

  /**
   * Clear the pending queue
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Update endpoint URL
   */
  updateEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Remove event listeners
    window.removeEventListener('online', this.processPendingQueue);
    window.removeEventListener('offline', () => this.isOnline = false);
    window.removeEventListener('beforeunload', this.flushSync);
  }
}