/**
 * 機能別ロギングのカスタムフック
 * 各機能で統一されたログ記録を提供
 */
import { useCallback } from 'react';

export interface FeatureLoggerOptions {
  enablePerformanceLogging?: boolean;
  enableUserTracking?: boolean;
  enableErrorTracking?: boolean;
  context?: Record<string, unknown>;
}

export interface FeatureLoggerReturn {
  logFeatureAccess: (context?: Record<string, unknown>) => void;
  logUserAction: (action: string, data?: any, context?: Record<string, unknown>) => Promise<void>;
  logPerformance: <T>(operation: string, fn: () => Promise<T>, context?: Record<string, unknown>) => Promise<T>;
  logError: (error: Error | string, context?: Record<string, unknown>) => void;
  logDataOperation: (operation: string, entityType: string, entityId?: string, context?: Record<string, unknown>) => void;
  logSecurityEvent: (event: string, context?: Record<string, unknown>) => void;
}

/**
 * 機能別ロギングフック
 * 
 * @param featureName 機能名 (例: 'TeamManagement', 'EmployeeRegister')
 * @param options ロギングオプション
 * @returns ロギング関数群
 */
export const useFeatureLogger = (
  featureName: string, 
  options: FeatureLoggerOptions = {}
): FeatureLoggerReturn => {
  const {
    enablePerformanceLogging = true,
    enableUserTracking = true,
    enableErrorTracking = true,
    context: baseContext = {}
  } = options;

  /**
   * 機能アクセスログ
   */
  const logFeatureAccess = useCallback((context?: Record<string, unknown>) => {
    if (enableUserTracking) {
      try {
        console.log(`[${featureName}] 機能アクセス`, {
          feature: featureName,
          timestamp: Date.now(),
          ...baseContext,
          ...context
        });
      } catch (error) {
        console.warn('Failed to log feature access:', error);
      }
    }
  }, [featureName, enableUserTracking, baseContext]);

  /**
   * ユーザーアクションログ
   */
  const logUserAction = useCallback(async (
    action: string, 
    data?: any, 
    context?: Record<string, unknown>
  ) => {
    if (enableUserTracking) {
      try {
        console.log(`[${featureName}] ユーザーアクション: ${action}`, {
          feature: featureName,
          action,
          data,
          ...baseContext,
          ...context
        });
      } catch (error) {
        console.warn('Failed to log user action:', error);
      }
    }
  }, [featureName, enableUserTracking, baseContext]);

  /**
   * パフォーマンスログ
   */
  const logPerformance = useCallback(async <T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> => {
    if (enablePerformanceLogging) {
      const startTime = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        
        console.log(`[${featureName}] パフォーマンス計測: ${operation}`, {
          feature: featureName,
          operation,
          duration,
          success: true,
          ...baseContext,
          ...context
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        console.log(`[${featureName}] パフォーマンス計測: ${operation} (エラー)`, {
          feature: featureName,
          operation,
          duration,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          ...baseContext,
          ...context
        });
        
        throw error;
      }
    } else {
      return await fn();
    }
  }, [featureName, enablePerformanceLogging, baseContext]);

  /**
   * エラーログ
   */
  const logError = useCallback((error: Error | string, context?: Record<string, unknown>) => {
    if (enableErrorTracking) {
      try {
        const errorMessage = error instanceof Error ? error.message : error;
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error(`[${featureName}] エラー`, {
          feature: featureName,
          error: errorMessage,
          stack: errorStack,
          timestamp: Date.now(),
          ...baseContext,
          ...context
        });
      } catch (logError) {
        console.error('Failed to log error:', logError, 'Original error:', error);
      }
    }
  }, [featureName, enableErrorTracking, baseContext]);

  /**
   * データ操作ログ
   */
  const logDataOperation = useCallback((
    operation: string,
    entityType: string,
    entityId?: string,
    context?: Record<string, unknown>
  ) => {
    try {
      console.log(`[${featureName}] データ操作: ${operation}`, {
        feature: featureName,
        operation,
        entityType,
        entityId,
        timestamp: Date.now(),
        ...baseContext,
        ...context
      });
    } catch (error) {
      console.warn('Failed to log data operation:', error);
    }
  }, [featureName, baseContext]);

  /**
   * セキュリティイベントログ
   */
  const logSecurityEvent = useCallback((event: string, context?: Record<string, unknown>) => {
    try {
      console.warn(`[${featureName}] セキュリティイベント: ${event}`, {
        feature: featureName,
        securityEvent: event,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...baseContext,
        ...context
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, [featureName, baseContext]);

  return {
    logFeatureAccess,
    logUserAction,
    logPerformance,
    logError,
    logDataOperation,
    logSecurityEvent
  };
};
