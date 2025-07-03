/**
 * Logging System Types
 * 
 * Core type definitions for the logging system
 */

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string; // ISO8601
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

export interface LoggerConfig {
  enabledLevels?: LogLevel[];
  enabledInProduction?: boolean;
  maxBufferSize?: number;
  flushInterval?: number; // milliseconds
}

export interface TransportConfig {
  enabled?: boolean;
  level?: LogLevel;
  [key: string]: unknown;
}