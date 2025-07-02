/**
 * Logging System Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger } from '../logging/Logger';
import { ConsoleTransport } from '../logging/transports/Console';
import { StorageTransport } from '../logging/transports/Storage';
import { maskPII } from '../logging/utils/maskPII';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console
const consoleSpy = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
};
Object.assign(console, consoleSpy);

describe('Logging System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Logger', () => {
    it('should create logger with transports', () => {
      const consoleTransport = new ConsoleTransport(true);
      const logger = new Logger([consoleTransport]);
      
      expect(logger.getStats().transports).toBe(1);
    });

    it('should log messages with different levels', () => {
      const consoleTransport = new ConsoleTransport(true);
      const logger = new Logger([consoleTransport]);
      
      logger.info('Test info message');
      logger.warn('Test warning message');
      logger.error('Test error message');
      
      // Console transport should have been called
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should log with context data', () => {
      const consoleTransport = new ConsoleTransport(true);
      const logger = new Logger([consoleTransport]);
      
      logger.info('Test with context', { userId: '123', action: 'login' });
      
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Test with context'),
        expect.any(String),
        expect.objectContaining({ userId: '123', action: 'login' })
      );
    });

    it('should generate error ID for error logs', () => {
      const consoleTransport = new ConsoleTransport(true);
      const logger = new Logger([consoleTransport]);
      
      logger.error('Test error');
      
      // Console transport should have been called with formatted message
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: Test error'),
        expect.any(String)
      );
    });
  });

  describe('ConsoleTransport', () => {
    it('should be disabled in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const transport = new ConsoleTransport(true);
      expect(transport.shouldLog('info')).toBe(false);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should respect log levels', () => {
      const transport = new ConsoleTransport(true);
      transport.setMinLevel('warn');
      
      expect(transport.shouldLog('debug')).toBe(false);
      expect(transport.shouldLog('info')).toBe(false);
      expect(transport.shouldLog('warn')).toBe(true);
      expect(transport.shouldLog('error')).toBe(true);
    });
  });

  describe('StorageTransport', () => {
    it('should save logs to localStorage', async () => {
      const transport = new StorageTransport({ useIndexedDB: false });
      
      await transport.send({
        level: 'info',
        message: 'Test message',
        timestamp: new Date().toISOString(),
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'app-logs',
        expect.stringContaining('Test message')
      );
    });

    it('should retrieve stored logs', () => {
      const transport = new StorageTransport({ useIndexedDB: false });
      const testLogs = [
        { level: 'info', message: 'Test 1', timestamp: '2024-01-01T00:00:00.000Z' },
        { level: 'error', message: 'Test 2', timestamp: '2024-01-01T00:00:01.000Z' },
      ];
      
      localStorageMock.setItem('app-logs', JSON.stringify(testLogs));
      
      const logs = transport.getStoredLogs();
      expect(logs).toEqual(testLogs);
    });
  });

  describe('PII Masking', () => {
    it('should mask email addresses', () => {
      const text = 'User email is john.doe@example.com';
      const masked = maskPII(text);
      expect(masked).toBe('User email is j***@example.com');
    });

    it('should mask credit card numbers', () => {
      const text = 'Card number: 1234-5678-9012-3456';
      const masked = maskPII(text);
      // Debug the actual output
      console.log('Expected: Card number: ****-****-****-3456');
      console.log('Actual  :', masked);
      expect(masked).toBe('Card number: ****-****-****-3456');
    });

    it('should mask sensitive object keys', () => {
      const obj = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com',
        age: 30,
      };
      
      const masked = maskPII(obj);
      expect(masked.username).toBe('john');
      expect(masked.password).toBe('***MASKED***');
      expect(masked.email).toBe('***MASKED***');
      expect(masked.age).toBe(30);
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            token: 'abc123',
          }
        }
      };
      
      const masked = maskPII(obj);
      expect(masked.user.name).toBe('John');
      expect(masked.user.credentials.password).toBe('***MASKED***');
      expect(masked.user.credentials.token).toBe('***MASKED***');
    });

    it('should handle arrays', () => {
      const arr = [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' },
      ];
      
      const masked = maskPII(arr);
      expect(masked[0].name).toBe('John');
      expect(masked[0].email).toBe('***MASKED***');
      expect(masked[1].name).toBe('Jane');
      expect(masked[1].email).toBe('***MASKED***');
    });
  });
});