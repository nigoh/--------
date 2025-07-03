/**
 * 検索操作専用ロギングのカスタムフック
 * 検索・フィルタリング・ソート操作を統一的にログ記録
 */
import { useCallback } from 'react';
import { useFeatureLogger } from './useFeatureLogger';

export interface SearchLoggerOptions {
  featureName: string;
  enableQueryLogging?: boolean;
  enablePerformanceLogging?: boolean;
  enableResultAnalysis?: boolean;
}

export interface SearchQuery {
  text?: string;
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  pagination?: { page: number; limit: number };
}

export interface SearchResult {
  totalCount: number;
  returnedCount: number;
  hasMore?: boolean;
  executionTime?: number;
}

export interface SearchLoggerReturn {
  logSearch: (query: SearchQuery, result: SearchResult, context?: Record<string, unknown>) => Promise<void>;
  logFilter: (filterType: string, filterValue: any, resultCount: number, context?: Record<string, unknown>) => Promise<void>;
  logSort: (sortField: string, sortDirection: string, context?: Record<string, unknown>) => Promise<void>;
  logPagination: (page: number, limit: number, totalPages: number, context?: Record<string, unknown>) => Promise<void>;
  logSearchPerformance: <T>(query: SearchQuery, searchFn: () => Promise<T>, context?: Record<string, unknown>) => Promise<T>;
  logSearchError: (error: Error, query: SearchQuery, context?: Record<string, unknown>) => void;
}

/**
 * 検索操作ロギングフック
 * 
 * @param options 検索ロギングの設定
 * @returns 検索操作ログ関数群
 */
export const useSearchLogger = (options: SearchLoggerOptions): SearchLoggerReturn => {
  const {
    featureName,
    enableQueryLogging = true,
    enablePerformanceLogging = true,
    enableResultAnalysis = true
  } = options;

  const featureLogger = useFeatureLogger(`${featureName}Search`, {
    enablePerformanceLogging,
    context: { feature: featureName }
  });

  /**
   * 検索クエリの複雑度を計算
   */
  const calculateQueryComplexity = useCallback((query: SearchQuery): number => {
    let complexity = 0;
    
    if (query.text) complexity += query.text.length > 20 ? 2 : 1;
    if (query.filters) complexity += Object.keys(query.filters).length;
    if (query.sort) complexity += 1;
    if (query.pagination) complexity += 0.5;
    
    return complexity;
  }, []);

  /**
   * 検索結果の品質を分析
   */
  const analyzeSearchQuality = useCallback((query: SearchQuery, result: SearchResult) => {
    const hasQuery = Boolean(query.text && query.text.length > 0);
    const hasResults = result.returnedCount > 0;
    const isFiltered = Boolean(query.filters && Object.keys(query.filters).length > 0);
    
    return {
      searchType: hasQuery ? 'text_search' : isFiltered ? 'filtered_browse' : 'browse_all',
      resultQuality: hasResults ? (result.returnedCount < 10 ? 'precise' : 'broad') : 'no_results',
      hasRelevantResults: hasResults,
      resultRatio: result.totalCount > 0 ? result.returnedCount / result.totalCount : 0
    };
  }, []);

  /**
   * 検索操作ログ
   */
  const logSearch = useCallback(async (
    query: SearchQuery,
    result: SearchResult,
    context?: Record<string, unknown>
  ) => {
    if (enableQueryLogging) {
      const complexity = calculateQueryComplexity(query);
      const quality = enableResultAnalysis ? analyzeSearchQuality(query, result) : {};

      await featureLogger.logUserAction('search', {
        queryText: query.text,
        queryLength: query.text?.length || 0,
        hasFilters: Boolean(query.filters && Object.keys(query.filters).length > 0),
        filterCount: query.filters ? Object.keys(query.filters).length : 0,
        hasSort: Boolean(query.sort),
        hasPagination: Boolean(query.pagination),
        queryComplexity: complexity,
        ...quality,
        resultCount: result.returnedCount,
        totalCount: result.totalCount,
        executionTime: result.executionTime,
        ...context
      });
    }
  }, [featureLogger, enableQueryLogging, calculateQueryComplexity, enableResultAnalysis, analyzeSearchQuality]);

  /**
   * フィルター操作ログ
   */
  const logFilter = useCallback(async (
    filterType: string,
    filterValue: any,
    resultCount: number,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('filter', {
      filterType,
      filterValue: String(filterValue),
      hasValue: Boolean(filterValue),
      resultCount,
      filterEffectiveness: resultCount > 0 ? 'effective' : 'too_restrictive',
      ...context
    });
  }, [featureLogger]);

  /**
   * ソート操作ログ
   */
  const logSort = useCallback(async (
    sortField: string,
    sortDirection: string,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('sort', {
      sortField,
      sortDirection,
      sortType: ['date', 'time', 'created', 'updated'].some(t => sortField.includes(t)) ? 'temporal' : 'alphabetical',
      ...context
    });
  }, [featureLogger]);

  /**
   * ページネーション操作ログ
   */
  const logPagination = useCallback(async (
    page: number,
    limit: number,
    totalPages: number,
    context?: Record<string, unknown>
  ) => {
    await featureLogger.logUserAction('paginate', {
      page,
      limit,
      totalPages,
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
      paginationType: page > 1 ? 'navigation' : 'initial_load',
      ...context
    });
  }, [featureLogger]);

  /**
   * 検索パフォーマンス計測
   */
  const logSearchPerformance = useCallback(async <T>(
    query: SearchQuery,
    searchFn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> => {
    if (enablePerformanceLogging) {
      return await featureLogger.logPerformance('search_execution', searchFn, {
        queryComplexity: calculateQueryComplexity(query),
        hasTextSearch: Boolean(query.text),
        filterCount: query.filters ? Object.keys(query.filters).length : 0,
        ...context
      });
    } else {
      return await searchFn();
    }
  }, [featureLogger, enablePerformanceLogging, calculateQueryComplexity]);

  /**
   * 検索エラーログ
   */
  const logSearchError = useCallback((
    error: Error,
    query: SearchQuery,
    context?: Record<string, unknown>
  ) => {
    featureLogger.logError(error, {
      queryText: query.text,
      filterCount: query.filters ? Object.keys(query.filters).length : 0,
      queryComplexity: calculateQueryComplexity(query),
      errorType: error.name,
      ...context
    });
  }, [featureLogger, calculateQueryComplexity]);

  return {
    logSearch,
    logFilter,
    logSort,
    logPagination,
    logSearchPerformance,
    logSearchError
  };
};
