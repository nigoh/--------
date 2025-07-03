/**
 * CRUD操作専用ロギングのカスタムフック
 * データの作成・読取・更新・削除操作を統一的にログ記録
 */
import { useCallback } from 'react';
import { useFeatureLogger } from './useFeatureLogger';

export interface CRUDLoggerOptions {
  entityType: string;
  enableDataLogging?: boolean;
  enablePerformanceLogging?: boolean;
  enableValidationLogging?: boolean;
}

export interface CRUDLoggerReturn {
  logCreate: (entityData: any, entityId?: string, context?: Record<string, unknown>) => Promise<void>;
  logRead: (query?: any, resultCount?: number, context?: Record<string, unknown>) => Promise<void>;
  logUpdate: (entityId: string, changes: Record<string, any>, context?: Record<string, unknown>) => Promise<void>;
  logDelete: (entityId: string, context?: Record<string, unknown>) => Promise<void>;
  logBulkOperation: (operation: string, count: number, context?: Record<string, unknown>) => Promise<void>;
  logValidation: (validationResult: any, context?: Record<string, unknown>) => void;
  logPermissionCheck: (operation: string, entityId?: string, granted?: boolean, context?: Record<string, unknown>) => void;
}

/**
 * CRUD操作ロギングフック
 * 
 * @param options CRUD操作の設定
 * @returns CRUD操作ログ関数群
 */
export const useCRUDLogger = (options: CRUDLoggerOptions): CRUDLoggerReturn => {
  const {
    entityType,
    enableDataLogging = true,
    enablePerformanceLogging = true,
    enableValidationLogging = true
  } = options;

  const featureLogger = useFeatureLogger(`${entityType}CRUD`, {
    enablePerformanceLogging,
    context: { entityType }
  });

  /**
   * 作成操作ログ
   */
  const logCreate = useCallback(async (
    entityData: any,
    entityId?: string,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('create', {
      entityType,
      entityId,
      dataSize: enableDataLogging ? JSON.stringify(entityData).length : undefined,
      hasRequiredFields: Boolean(entityData),
      ...context
    });

    featureLogger.logDataOperation('create', entityType, entityId, {
      timestamp: Date.now(),
      ...context
    });
  }, [featureLogger, entityType, enableDataLogging]);

  /**
   * 読取操作ログ
   */
  const logRead = useCallback(async (
    query?: any,
    resultCount?: number,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('read', {
      entityType,
      queryType: query ? typeof query : 'all',
      hasFilter: Boolean(query?.filter),
      hasSorting: Boolean(query?.sort),
      hasPagination: Boolean(query?.page || query?.limit),
      resultCount,
      ...context
    });

    if (enablePerformanceLogging && resultCount !== undefined) {
      await featureLogger.logPerformance('query_execution', async () => {
        return { resultCount };
      }, {
        queryComplexity: query ? Object.keys(query).length : 0,
        ...context
      });
    }
  }, [featureLogger, entityType, enablePerformanceLogging]);

  /**
   * 更新操作ログ
   */
  const logUpdate = useCallback(async (
    entityId: string,
    changes: Record<string, any>,
    context?: Record<string, unknown>
  ) => {
    const changedFields = Object.keys(changes);
    
    await featureLogger.logUserAction('update', {
      entityType,
      entityId,
      changedFields,
      changeCount: changedFields.length,
      hasStatusChange: 'status' in changes,
      hasMetadataChange: ['createdAt', 'updatedAt', 'version'].some(field => field in changes),
      ...context
    });

    featureLogger.logDataOperation('update', entityType, entityId, {
      changedFields,
      timestamp: Date.now(),
      ...context
    });
  }, [featureLogger, entityType]);

  /**
   * 削除操作ログ
   */
  const logDelete = useCallback(async (
    entityId: string,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('delete', {
      entityType,
      entityId,
      deleteType: context?.soft ? 'soft' : 'hard',
      ...context
    });

    featureLogger.logDataOperation('delete', entityType, entityId, {
      timestamp: Date.now(),
      ...context
    });
  }, [featureLogger, entityType]);

  /**
   * 一括操作ログ
   */
  const logBulkOperation = useCallback(async (
    operation: string,
    count: number,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction(`bulk_${operation}`, {
      entityType,
      operation,
      entityCount: count,
      isBatch: count > 1,
      ...context
    });

    if (enablePerformanceLogging) {
      await featureLogger.logPerformance(`bulk_${operation}`, async () => {
        return { count };
      }, {
        batchSize: count,
        ...context
      });
    }
  }, [featureLogger, entityType, enablePerformanceLogging]);

  /**
   * バリデーションログ
   */
  const logValidation = useCallback((
    validationResult: any,
    context?: Record<string, unknown>
  ) => {
    if (enableValidationLogging) {
      const isValid = Boolean(validationResult?.isValid ?? validationResult?.success ?? !validationResult?.errors);
      const errorCount = validationResult?.errors?.length || 0;

      featureLogger.logDataOperation('validation', entityType, undefined, {
        isValid,
        errorCount,
        validationFields: validationResult?.fields ? Object.keys(validationResult.fields) : [],
        timestamp: Date.now(),
        ...context
      });

      if (!isValid) {
        featureLogger.logError(`バリデーションエラー: ${entityType}`, {
          errors: validationResult?.errors,
          ...context
        });
      }
    }
  }, [featureLogger, entityType, enableValidationLogging]);

  /**
   * 権限チェックログ
   */
  const logPermissionCheck = useCallback((
    operation: string,
    entityId?: string,
    granted?: boolean,
    context?: Record<string, unknown>
  ) => {
    featureLogger.logSecurityEvent('permission_check', {
      entityType,
      operation,
      entityId,
      granted,
      timestamp: Date.now(),
      ...context
    });

    if (granted === false) {
      featureLogger.logError(`権限不足: ${operation} on ${entityType}`, {
        operation,
        entityId,
        ...context
      });
    }
  }, [featureLogger, entityType]);

  return {
    logCreate,
    logRead,
    logUpdate,
    logDelete,
    logBulkOperation,
    logValidation,
    logPermissionCheck
  };
};
