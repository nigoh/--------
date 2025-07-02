/**
 * Logging System - Public API
 * 
 * Provides a comprehensive logging solution for React + Vite applications
 * with multiple transports, PII masking, and production-ready features.
 */

export { Logger } from './Logger';
export { 
  LogProvider, 
  useLogger, 
  useComponentLogger, 
  useActionLogger, 
  usePerformanceLogger 
} from './LogProvider';
export { Transport } from './transports/Transport';
export { ConsoleTransport } from './transports/Console';
export { StorageTransport } from './transports/Storage';
export { HttpTransport } from './transports/Http';
export { 
  maskPII, 
  maskPIIInObject, 
  containsPII, 
  maskByFieldName 
} from './utils/maskPII';

export type {
  LogLevel,
  LogEntry,
  LoggerConfig,
  TransportConfig
} from './types';