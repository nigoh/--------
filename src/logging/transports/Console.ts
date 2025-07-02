/**
 * Console Transport
 * 
 * Outputs logs to the browser console with color coding
 */

import { Transport } from './Transport';
import type { LogEntry, TransportConfig } from '../types';

interface ConsoleTransportConfig extends TransportConfig {
  colorize?: boolean;
  includeContext?: boolean;
}

export class ConsoleTransport extends Transport {
  private colors: Record<string, string> = {
    trace: '#6B7280', // Gray
    debug: '#3B82F6', // Blue
    info: '#10B981',  // Green
    warn: '#F59E0B',  // Yellow
    error: '#EF4444', // Red
    fatal: '#DC2626', // Dark Red
  };

  constructor(config: ConsoleTransportConfig = {}) {
    super({
      colorize: import.meta.env.DEV,
      includeContext: import.meta.env.DEV,
      ...config,
    });
  }

  async send(entry: LogEntry): Promise<void> {
    if (!this.shouldHandle(entry)) {
      return;
    }

    const config = this.config as ConsoleTransportConfig;
    const { level, message, timestamp, context } = entry;

    // Prepare console method
    const consoleMethod = this.getConsoleMethod(level);
    
    if (config.colorize && import.meta.env.DEV) {
      // Colorized output for development
      const color = this.colors[level];
      const timeStr = new Date(timestamp).toLocaleTimeString();
      
      consoleMethod(
        `%c[${level.toUpperCase()}] %c${timeStr} %c${message}`,
        `color: ${color}; font-weight: bold;`,
        'color: #6B7280; font-size: 0.875em;',
        'color: inherit;',
        config.includeContext && context ? context : ''
      );
    } else {
      // Simple output for production or when colorize is disabled
      const timeStr = new Date(timestamp).toLocaleTimeString();
      consoleMethod(`[${level.toUpperCase()}] ${timeStr} ${message}`, context || '');
    }
  }

  private getConsoleMethod(level: string): (...args: any[]) => void {
    switch (level) {
      case 'trace':
        return console.trace.bind(console);
      case 'debug':
        return console.debug.bind(console);
      case 'info':
        return console.info.bind(console);
      case 'warn':
        return console.warn.bind(console);
      case 'error':
      case 'fatal':
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }
}