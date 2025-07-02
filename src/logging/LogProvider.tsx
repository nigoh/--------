/**
 * Log Provider and React Context
 * 
 * Provides the Logger instance throughout the React component tree
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Logger } from './Logger';
import { ConsoleTransport } from './transports/Console';
import { StorageTransport } from './transports/Storage';
import { HttpTransport } from './transports/Http';
import type { LoggerConfig } from './types';

interface LogProviderProps {
  children: React.ReactNode;
  config?: LoggerConfig;
  endpoint?: string;
  enableHttpTransport?: boolean;
  enableStorageTransport?: boolean;
}

// Create the context
const LogContext = createContext<Logger | null>(null);

/**
 * Log Provider Component
 * 
 * Initializes and provides the Logger instance with appropriate transports
 */
export const LogProvider: React.FC<LogProviderProps> = ({
  children,
  config = {},
  endpoint = '/api/logs',
  enableHttpTransport = true,
  enableStorageTransport = true,
}) => {
  const logger = useMemo(() => {
    const transports = [];

    // Always include console transport for development visibility
    transports.push(new ConsoleTransport({
      enabled: true,
      colorize: import.meta.env.DEV,
      includeContext: import.meta.env.DEV,
    }));

    // Add storage transport for offline support
    if (enableStorageTransport) {
      transports.push(new StorageTransport({
        enabled: true,
        maxEntries: 1000,
        retentionDays: 7,
        autoCleanup: true,
      }));
    }

    // Add HTTP transport for backend logging (in production or when enabled)
    if (enableHttpTransport && (import.meta.env.PROD || import.meta.env.DEV)) {
      transports.push(new HttpTransport(endpoint, {
        enabled: true,
        batchSize: 10,
        flushInterval: 30000, // 30 seconds
        maxRetries: 3,
        enablePIIMasking: true,
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
      }));
    }

    return new Logger(transports, {
      enabledLevels: import.meta.env.DEV 
        ? ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
        : ['info', 'warn', 'error', 'fatal'], // More restrictive in production
      enabledInProduction: true,
      maxBufferSize: 1000,
      flushInterval: 30000,
      ...config,
    });
  }, [config, endpoint, enableHttpTransport, enableStorageTransport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Flush any pending logs before cleanup
      logger.flush().catch(console.warn);
    };
  }, [logger]);

  // Log application startup
  useEffect(() => {
    logger.info('Application started', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
    });

    // Log performance metrics if available
    if ('performance' in window && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      logger.info('Page load performance', {
        loadTime,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.loadEventStart - timing.navigationStart,
      });
    }
  }, [logger]);

  return (
    <LogContext.Provider value={logger}>
      {children}
    </LogContext.Provider>
  );
};

/**
 * Hook to access the Logger instance
 */
export const useLogger = (): Logger => {
  const logger = useContext(LogContext);
  
  if (!logger) {
    throw new Error('useLogger must be used within a LogProvider');
  }
  
  return logger;
};

/**
 * Hook for logging with automatic component context
 */
export const useComponentLogger = (componentName: string) => {
  const logger = useLogger();
  
  return useMemo(() => ({
    trace: (message: string, context?: Record<string, unknown>) => 
      logger.trace(message, { component: componentName, ...context }),
    debug: (message: string, context?: Record<string, unknown>) => 
      logger.debug(message, { component: componentName, ...context }),
    info: (message: string, context?: Record<string, unknown>) => 
      logger.info(message, { component: componentName, ...context }),
    warn: (message: string, context?: Record<string, unknown>) => 
      logger.warn(message, { component: componentName, ...context }),
    error: (message: string, context?: Record<string, unknown>) => 
      logger.error(message, { component: componentName, ...context }),
    fatal: (message: string, context?: Record<string, unknown>) => 
      logger.fatal(message, { component: componentName, ...context }),
  }), [logger, componentName]);
};

/**
 * Hook for logging user actions
 */
export const useActionLogger = () => {
  const logger = useLogger();
  
  return useMemo(() => ({
    logAction: (action: string, details?: Record<string, unknown>) => {
      logger.info(`User action: ${action}`, {
        action,
        ...details,
        timestamp: new Date().toISOString(),
      });
    },
    
    logNavigation: (from: string, to: string, method?: string) => {
      logger.info('Navigation', {
        action: 'navigation',
        from,
        to,
        method: method || 'click',
        timestamp: new Date().toISOString(),
      });
    },
    
    logError: (error: Error, context?: Record<string, unknown>) => {
      logger.error('User action error', {
        action: 'error',
        error: error.message,
        stack: error.stack,
        ...context,
      });
    },
  }), [logger]);
};

/**
 * Hook for performance logging
 */
export const usePerformanceLogger = () => {
  const logger = useLogger();
  
  return useMemo(() => ({
    logRenderTime: (componentName: string, startTime: number) => {
      const renderTime = performance.now() - startTime;
      logger.debug('Component render time', {
        component: componentName,
        renderTime,
        timestamp: new Date().toISOString(),
      });
    },
    
    logAsyncOperation: (operation: string, duration: number, success: boolean) => {
      logger.info('Async operation completed', {
        operation,
        duration,
        success,
        timestamp: new Date().toISOString(),
      });
    },
    
    logResourceLoad: (resource: string, loadTime: number, size?: number) => {
      logger.info('Resource loaded', {
        resource,
        loadTime,
        size,
        timestamp: new Date().toISOString(),
      });
    },
  }), [logger]);
};