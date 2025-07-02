/**
 * Log Provider - React Context for Dependency Injection
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Logger } from './Logger';
import { ConsoleTransport } from './transports/Console';
import { StorageTransport } from './transports/Storage';
import { HttpTransport } from './transports/Http';

// デフォルトロガー設定
const createDefaultLogger = (): Logger => {
  const transports = [
    new ConsoleTransport(true),
    new StorageTransport({ maxEntries: 500 }),
  ];

  // 本番環境では HTTP Transport を追加
  if (process.env.NODE_ENV === 'production') {
    transports.push(new HttpTransport('/api/logs'));
  }

  return new Logger(transports, {
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    buildVersion: process.env.VITE_APP_VERSION || 'unknown',
    environment: process.env.NODE_ENV || 'development',
  });
};

// Context 作成
const LogContext = createContext<Logger | null>(null);

// Provider Props
interface LogProviderProps {
  children: ReactNode;
  logger?: Logger;
}

/**
 * Log Provider Component
 */
export const LogProvider: React.FC<LogProviderProps> = ({ 
  children, 
  logger = createDefaultLogger() 
}) => {
  return (
    <LogContext.Provider value={logger}>
      {children}
    </LogContext.Provider>
  );
};

/**
 * Logger Hook
 */
export const useLogger = (): Logger => {
  const logger = useContext(LogContext);
  
  if (!logger) {
    throw new Error('useLogger must be used within a LogProvider');
  }
  
  return logger;
};

/**
 * Component Logger Hook - コンポーネント固有のコンテキスト付きロガー
 */
export const useComponentLogger = (componentName: string, feature?: string) => {
  const baseLogger = useLogger();
  
  // コンポーネント用のコンテキストを設定
  React.useEffect(() => {
    baseLogger.setDefaultContext({
      component: componentName,
      ...(feature && { feature }),
    });
  }, [baseLogger, componentName, feature]);

  // コンポーネント固有のログメソッド
  const logComponentAction = React.useCallback((action: string, data?: Record<string, unknown>) => {
    baseLogger.logUserAction(`${componentName}:${action}`, undefined, data);
  }, [baseLogger, componentName]);

  const logComponentError = React.useCallback((error: Error, context?: Record<string, unknown>) => {
    baseLogger.logError(error, {
      ...context,
      component: componentName,
    });
  }, [baseLogger, componentName]);

  const logComponentPerformance = React.useCallback((operation: string, duration: number) => {
    baseLogger.logPerformance(`${componentName}:${operation}`, duration);
  }, [baseLogger, componentName]);

  return {
    ...baseLogger,
    logComponentAction,
    logComponentError, 
    logComponentPerformance,
  };
};

/**
 * HOC for automatic component logging
 */
export function withLogging<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithLoggingComponent: React.FC<P> = (props) => {
    const logger = useComponentLogger(displayName);
    
    React.useEffect(() => {
      logger.logComponentAction('mount');
      
      return () => {
        logger.logComponentAction('unmount');
      };
    }, [logger]);

    return <WrappedComponent {...props} />;
  };

  WithLoggingComponent.displayName = `withLogging(${displayName})`;
  
  return WithLoggingComponent;
}