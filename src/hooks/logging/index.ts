/**
 * 共有ロギングフック統一エクスポート
 * 全機能で一貫したログ記録を実現するための共通フック群
 */

// フィーチャー別ロギング
export { useFeatureLogger } from './useFeatureLogger';
export type { FeatureLoggerOptions, FeatureLoggerReturn } from './useFeatureLogger';

// CRUD操作ロギング
export { useCRUDLogger } from './useCRUDLogger';
export type { 
  CRUDLoggerOptions, 
  CRUDLoggerReturn
} from './useCRUDLogger';

// 検索・フィルターロギング
export { useSearchLogger } from './useSearchLogger';
export type { 
  SearchLoggerOptions, 
  SearchLoggerReturn,
  SearchResult
} from './useSearchLogger';

// エクスポートロギング
export { useExportLogger } from './useExportLogger';
export type { 
  ExportLoggerOptions, 
  ExportLoggerReturn,
  ExportRequest,
  ExportResult 
} from './useExportLogger';

// ロギング分析
export { useLoggingAnalytics } from './useLoggingAnalytics';
export type { 
  LoggingAnalytics,
  AnalyticsMetrics,
  PerformanceEndpoint,
  PerformanceAnalysis,
  ErrorDetail,
  ErrorAnalysis,
  UserLogin,
  UserActivity,
  SecurityActivity,
  SecurityEvents,
  FeatureUsage
} from './useLoggingAnalytics';

/**
 * ロギング設定の統一インターフェース
 */
export interface UnifiedLoggingConfig {
  featureName: string;
  enablePerformanceLogging?: boolean;
  enableDataTracking?: boolean;
  enableSecurityLogging?: boolean;
  enableValidationLogging?: boolean;
  context?: Record<string, unknown>;
}

/**
 * 統一ロギング設定でロガー群を作成
 */
export const useUnifiedLoggers = (config: UnifiedLoggingConfig) => {
  const {
    featureName,
    enablePerformanceLogging = true,
    enableDataTracking = true,
    enableSecurityLogging = true,
    enableValidationLogging = true,
    context = {}
  } = config;

  // シンプルなコンソールベースの実装
  const featureLogger = {
    logFeatureAccess: (ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] 機能アクセス`, { ...context, ...ctx });
    },
    logUserAction: async (action: string, data?: any, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] ユーザーアクション: ${action}`, { data, ...context, ...ctx });
    },
    logPerformance: async <T>(operation: string, fn: () => Promise<T>, ctx?: Record<string, unknown>): Promise<T> => {
      const start = performance.now();
      try {
        const result = await fn();
        console.log(`[${featureName}] パフォーマンス: ${operation}`, { 
          duration: performance.now() - start, 
          success: true, 
          ...context, 
          ...ctx 
        });
        return result;
      } catch (error) {
        console.log(`[${featureName}] パフォーマンス: ${operation} (エラー)`, { 
          duration: performance.now() - start, 
          success: false, 
          error: error instanceof Error ? error.message : String(error),
          ...context, 
          ...ctx 
        });
        throw error;
      }
    },
    logError: (error: Error | string, ctx?: Record<string, unknown>) => {
      console.error(`[${featureName}] エラー`, { 
        error: error instanceof Error ? error.message : error,
        ...context, 
        ...ctx 
      });
    },
    logDataOperation: (operation: string, entityType: string, entityId?: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] データ操作: ${operation}`, { 
        entityType, 
        entityId, 
        ...context, 
        ...ctx 
      });
    },
    logSecurityEvent: (event: string, ctx?: Record<string, unknown>) => {
      console.warn(`[${featureName}] セキュリティイベント: ${event}`, { ...context, ...ctx });
    }
  };

  const crudLogger = {
    logCreate: async (entityData: any, entityId?: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] CRUD: 作成`, { entityId, ...context, ...ctx });
    },
    logRead: async (query?: any, resultCount?: number, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] CRUD: 読取`, { resultCount, ...context, ...ctx });
    },
    logUpdate: async (entityId: string, changes: Record<string, any>, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] CRUD: 更新`, { entityId, changes: Object.keys(changes), ...context, ...ctx });
    },
    logDelete: async (entityId: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] CRUD: 削除`, { entityId, ...context, ...ctx });
    },
    logBulkOperation: async (operation: string, count: number, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] CRUD: 一括${operation}`, { count, ...context, ...ctx });
    },
    logValidation: (validationResult: any, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] バリデーション`, { 
        isValid: Boolean(validationResult?.isValid ?? validationResult?.success), 
        ...context, 
        ...ctx 
      });
    },
    logPermissionCheck: (operation: string, entityId?: string, granted?: boolean, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] 権限チェック: ${operation}`, { entityId, granted, ...context, ...ctx });
    }
  };

  const searchLogger = {
    logSearch: async (query: any, result: any, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] 検索`, { 
        queryText: query.text, 
        resultCount: result.returnedCount, 
        ...context, 
        ...ctx 
      });
    },
    logFilter: async (filterType: string, filterValue: any, resultCount: number, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] フィルター: ${filterType}`, { filterValue, resultCount, ...context, ...ctx });
    },
    logSort: async (sortField: string, sortDirection: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] ソート: ${sortField}`, { sortDirection, ...context, ...ctx });
    },
    logPagination: async (page: number, limit: number, totalPages: number, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] ページネーション`, { page, limit, totalPages, ...context, ...ctx });
    },
    logSearchPerformance: async <T>(query: any, searchFn: () => Promise<T>, ctx?: Record<string, unknown>): Promise<T> => {
      return featureLogger.logPerformance('search_execution', searchFn, ctx);
    },
    logSearchError: (error: Error, query: any, ctx?: Record<string, unknown>) => {
      featureLogger.logError(error, { queryText: query.text, ...ctx });
    }
  };

  const exportLogger = {
    logExportRequest: async (request: any, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] エクスポート要求`, { format: request.format, ...context, ...ctx });
    },
    logExportComplete: async (request: any, result: any, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] エクスポート完了`, { 
        format: request.format, 
        recordCount: result.recordCount, 
        ...context, 
        ...ctx 
      });
    },
    logExportError: (error: Error, request: any, ctx?: Record<string, unknown>) => {
      featureLogger.logError(error, { exportFormat: request.format, ...ctx });
    },
    logDataAccess: (dataType: string, recordCount: number, accessLevel: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] データアクセス`, { dataType, recordCount, accessLevel, ...context, ...ctx });
    },
    logDownload: async (fileName: string, fileSize: number, downloadMethod: string, ctx?: Record<string, unknown>) => {
      console.log(`[${featureName}] ダウンロード`, { fileName, fileSize, downloadMethod, ...context, ...ctx });
    },
    logExportPerformance: async <T>(request: any, exportFn: () => Promise<T>, ctx?: Record<string, unknown>): Promise<T> => {
      return featureLogger.logPerformance('export_execution', exportFn, ctx);
    }
  };

  return {
    featureLogger,
    crudLogger,
    searchLogger,
    exportLogger
  };
};

/**
 * 認証機能向けロガー
 */
export const useAuthLoggers = () => useUnifiedLoggers({
  featureName: 'Authentication',
  enableSecurityLogging: true,
  enableDataTracking: false, // 認証では個人データは記録しない
  context: { module: 'auth' }
});

/**
 * 管理機能向けロガー
 */
export const useManagementLoggers = (featureName: string) => useUnifiedLoggers({
  featureName,
  enablePerformanceLogging: true,
  enableDataTracking: true,
  enableSecurityLogging: true,
  context: { category: 'management' }
});

/**
 * 業務機能向けロガー
 */
export const useBusinessLoggers = (featureName: string) => useUnifiedLoggers({
  featureName,
  enablePerformanceLogging: true,
  enableDataTracking: true,
  enableValidationLogging: true,
  context: { category: 'business' }
});
