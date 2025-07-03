/**
 * Logger Class
 * 
 * Core logger implementation that dispatches log entries to multiple transports
 */

import { Transport } from './transports/Transport';
import type { LogLevel, LogEntry, LoggerConfig } from './types';

export class Logger {
  private transports: Transport[] = [];
  private config: LoggerConfig;
  private sessionId: string;

  constructor(transports: Transport[] = [], config: LoggerConfig = {}) {
    this.transports = transports;
    this.config = {
      enabledLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      enabledInProduction: false,
      maxBufferSize: 1000,
      flushInterval: 30000, // 30 seconds
      ...config,
    };
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // Check if logging is enabled for this environment
    if (import.meta.env.PROD && !this.config.enabledInProduction) {
      return level === 'error' || level === 'fatal'; // Only errors in production by default
    }

    // Check if this log level is enabled
    return this.config.enabledLevels?.includes(level) ?? true;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      sessionId: this.sessionId,
      userId: context?.userId as string,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private async dispatchToTransports(entry: LogEntry): Promise<void> {
    const promises = this.transports.map(transport => {
      try {
        return transport.send(entry);
      } catch (error) {
        // Silently handle transport errors to prevent logging from breaking the app
        console.warn('Transport error:', error);
        return Promise.resolve();
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      // Prevent logging errors from breaking the application
      console.warn('Logger dispatch error:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context);
    
    // Dispatch asynchronously to avoid blocking the main thread
    setTimeout(() => this.dispatchToTransports(entry), 0);
  }

  // Public logging methods
  trace = (message: string, context?: Record<string, unknown>) => this.log('trace', message, context);
  debug = (message: string, context?: Record<string, unknown>) => this.log('debug', message, context);
  info = (message: string, context?: Record<string, unknown>) => this.log('info', message, context);
  warn = (message: string, context?: Record<string, unknown>) => this.log('warn', message, context);
  error = (message: string, context?: Record<string, unknown>) => this.log('error', message, context);
  fatal = (message: string, context?: Record<string, unknown>) => this.log('fatal', message, context);

  // Utility methods
  addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  removeTransport(transport: Transport): void {
    const index = this.transports.indexOf(transport);
    if (index > -1) {
      this.transports.splice(index, 1);
    }
  }

  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  async flush(): Promise<void> {
    const flushPromises = this.transports.map(transport => 
      transport.flush ? transport.flush() : Promise.resolve()
    );
    await Promise.allSettled(flushPromises);
  }
}