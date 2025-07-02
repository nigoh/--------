/**
 * Transport Abstract Base Class
 * 
 * Defines the interface for all log transports
 */

import type { LogEntry, TransportConfig } from '../types';

export abstract class Transport {
  protected config: TransportConfig;

  constructor(config: TransportConfig = {}) {
    this.config = {
      enabled: true,
      ...config,
    };
  }

  /**
   * Send a log entry to this transport
   */
  abstract send(entry: LogEntry): Promise<void>;

  /**
   * Flush any buffered logs (optional)
   */
  async flush?(): Promise<void>;

  /**
   * Check if this transport should handle the given log entry
   */
  protected shouldHandle(entry: LogEntry): boolean {
    if (!this.config.enabled) {
      return false;
    }

    if (this.config.level) {
      const levels: Record<string, number> = {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5,
      };
      
      const entryLevel = levels[entry.level];
      const configLevel = levels[this.config.level];
      
      return entryLevel >= configLevel;
    }

    return true;
  }

  /**
   * Update transport configuration
   */
  updateConfig(config: Partial<TransportConfig>): void {
    this.config = { ...this.config, ...config };
  }
}