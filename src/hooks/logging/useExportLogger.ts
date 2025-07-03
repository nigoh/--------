/**
 * エクスポート操作専用ロギングのカスタムフック
 * データエクスポート・ダウンロード操作を統一的にログ記録
 */
import { useCallback } from 'react';
import { useFeatureLogger } from './useFeatureLogger';

export interface ExportLoggerOptions {
  featureName: string;
  enableDataTracking?: boolean;
  enablePerformanceLogging?: boolean;
  enableSecurityLogging?: boolean;
}

export interface ExportRequest {
  format: string;
  filters?: Record<string, any>;
  columns?: string[];
  dateRange?: { from: string; to: string };
  includeHeaders?: boolean;
  compression?: boolean;
}

export interface ExportResult {
  recordCount: number;
  fileSize: number;
  fileName: string;
  executionTime: number;
  success: boolean;
  error?: string;
}

export interface ExportLoggerReturn {
  logExportRequest: (request: ExportRequest, context?: Record<string, unknown>) => Promise<void>;
  logExportComplete: (request: ExportRequest, result: ExportResult, context?: Record<string, unknown>) => Promise<void>;
  logExportError: (error: Error, request: ExportRequest, context?: Record<string, unknown>) => void;
  logDataAccess: (dataType: string, recordCount: number, accessLevel: string, context?: Record<string, unknown>) => void;
  logDownload: (fileName: string, fileSize: number, downloadMethod: string, context?: Record<string, unknown>) => Promise<void>;
  logExportPerformance: <T>(request: ExportRequest, exportFn: () => Promise<T>, context?: Record<string, unknown>) => Promise<T>;
}

/**
 * エクスポート操作ロギングフック
 * 
 * @param options エクスポートロギングの設定
 * @returns エクスポート操作ログ関数群
 */
export const useExportLogger = (options: ExportLoggerOptions): ExportLoggerReturn => {
  const {
    featureName,
    enableDataTracking = true,
    enablePerformanceLogging = true,
    enableSecurityLogging = true
  } = options;

  const featureLogger = useFeatureLogger(`${featureName}Export`, {
    enablePerformanceLogging,
    context: { feature: featureName }
  });

  /**
   * エクスポート複雑度を計算
   */
  const calculateExportComplexity = useCallback((request: ExportRequest): number => {
    let complexity = 0;
    
    // フォーマット複雑度
    if (request.format === 'pdf') complexity += 3;
    else if (request.format === 'excel') complexity += 2;
    else if (request.format === 'csv') complexity += 1;
    
    // フィルター複雑度
    if (request.filters) complexity += Object.keys(request.filters).length * 0.5;
    
    // カラム選択複雑度
    if (request.columns && request.columns.length < 10) complexity += 0.5;
    else if (request.columns && request.columns.length >= 10) complexity += 1;
    
    // 日付範囲複雑度
    if (request.dateRange) complexity += 1;
    
    // 圧縮複雑度
    if (request.compression) complexity += 0.5;
    
    return complexity;
  }, []);

  /**
   * エクスポートリスク評価
   */
  const assessExportRisk = useCallback((request: ExportRequest, recordCount?: number) => {
    let riskLevel = 'low';
    let riskFactors: string[] = [];
    
    // 大量データのリスク
    if (recordCount && recordCount > 10000) {
      riskLevel = 'high';
      riskFactors.push('large_dataset');
    } else if (recordCount && recordCount > 1000) {
      riskLevel = 'medium';
      riskFactors.push('medium_dataset');
    }
    
    // 全データエクスポートのリスク
    if (!request.filters || Object.keys(request.filters).length === 0) {
      if (riskLevel === 'low') riskLevel = 'medium';
      riskFactors.push('no_filters');
    }
    
    // 機密データ可能性
    if (request.columns?.some(col => 
      ['email', 'phone', 'address', 'salary', 'personal'].some(sensitive => 
        col.toLowerCase().includes(sensitive)
      )
    )) {
      riskLevel = 'high';
      riskFactors.push('sensitive_data');
    }
    
    return { riskLevel, riskFactors };
  }, []);

  /**
   * エクスポート要求ログ
   */
  const logExportRequest = useCallback(async (
    request: ExportRequest,
    context?: Record<string, unknown>
  ) => {
    const complexity = calculateExportComplexity(request);
    const risk = enableSecurityLogging ? assessExportRisk(request) : { riskLevel: 'unknown', riskFactors: [] };

    await featureLogger.logUserAction('export_request', {
      format: request.format,
      hasFilters: Boolean(request.filters && Object.keys(request.filters).length > 0),
      filterCount: request.filters ? Object.keys(request.filters).length : 0,
      columnCount: request.columns?.length || 0,
      hasDateRange: Boolean(request.dateRange),
      includeHeaders: request.includeHeaders,
      useCompression: request.compression,
      exportComplexity: complexity,
      riskLevel: risk.riskLevel,
      riskFactors: risk.riskFactors,
      ...context
    });

    if (enableSecurityLogging && risk.riskLevel === 'high') {
      featureLogger.logSecurityEvent('high_risk_export', {
        format: request.format,
        riskFactors: risk.riskFactors,
        ...context
      });
    }
  }, [featureLogger, calculateExportComplexity, enableSecurityLogging, assessExportRisk]);

  /**
   * エクスポート完了ログ
   */
  const logExportComplete = useCallback(async (
    request: ExportRequest,
    result: ExportResult,
    context?: Record<string, unknown>
  ) => {
    const complexity = calculateExportComplexity(request);
    const efficiency = result.recordCount > 0 ? result.fileSize / result.recordCount : 0;

    await featureLogger.logUserAction('export_complete', {
      format: request.format,
      recordCount: result.recordCount,
      fileSize: result.fileSize,
      fileName: result.fileName,
      executionTime: result.executionTime,
      success: result.success,
      exportComplexity: complexity,
      efficiency: Math.round(efficiency),
      performanceCategory: result.executionTime < 5000 ? 'fast' : result.executionTime < 15000 ? 'medium' : 'slow',
      ...context
    });

    if (enableDataTracking) {
      featureLogger.logDataOperation('export', 'data', undefined, {
        recordCount: result.recordCount,
        format: request.format,
        success: result.success,
        ...context
      });
    }
  }, [featureLogger, calculateExportComplexity, enableDataTracking]);

  /**
   * エクスポートエラーログ
   */
  const logExportError = useCallback((
    error: Error,
    request: ExportRequest,
    context?: Record<string, unknown>
  ) => {
    featureLogger.logError(error, {
      exportFormat: request.format,
      exportComplexity: calculateExportComplexity(request),
      hasFilters: Boolean(request.filters),
      columnCount: request.columns?.length || 0,
      errorType: error.name,
      ...context
    });
  }, [featureLogger, calculateExportComplexity]);

  /**
   * データアクセスログ
   */
  const logDataAccess = useCallback((
    dataType: string,
    recordCount: number,
    accessLevel: string,
    context?: Record<string, unknown>
  ) => {
    if (enableSecurityLogging) {
      featureLogger.logSecurityEvent('data_access', {
        dataType,
        recordCount,
        accessLevel,
        isLargeAccess: recordCount > 1000,
        timestamp: Date.now(),
        ...context
      });
    }
  }, [featureLogger, enableSecurityLogging]);

  /**
   * ダウンロードログ
   */
  const logDownload = useCallback(async (
    fileName: string,
    fileSize: number,
    downloadMethod: string,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('download', {
      fileName,
      fileSize,
      downloadMethod,
      fileSizeCategory: fileSize < 1024 * 1024 ? 'small' : fileSize < 10 * 1024 * 1024 ? 'medium' : 'large',
      ...context
    });
  }, [featureLogger]);

  /**
   * エクスポートパフォーマンス計測
   */
  const logExportPerformance = useCallback(async <T>(
    request: ExportRequest,
    exportFn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> => {
    if (enablePerformanceLogging) {
      return await featureLogger.logPerformance('export_execution', exportFn, {
        exportFormat: request.format,
        exportComplexity: calculateExportComplexity(request),
        hasCompression: request.compression,
        ...context
      });
    } else {
      return await exportFn();
    }
  }, [featureLogger, enablePerformanceLogging, calculateExportComplexity]);

  return {
    logExportRequest,
    logExportComplete,
    logExportError,
    logDataAccess,
    logDownload,
    logExportPerformance
  };
};
