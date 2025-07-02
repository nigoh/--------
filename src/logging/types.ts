/**
 * Logging Types and Interfaces
 */

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string; // ISO8601
  context?: Record<string, unknown>;
  userId?: string;
  url?: string;
  userAgent?: string;
  errorId?: string;
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  feature?: string;
  component?: string;
  [key: string]: unknown;
}