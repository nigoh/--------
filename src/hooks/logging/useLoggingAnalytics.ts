import { useState, useCallback } from 'react';
import { useComponentLogger } from '../../logging';

export interface AnalyticsMetrics {
  apiResponseTime: number;
  errorRate: number;
  successRate: number;
  activeUsers: number;
}

export interface PerformanceEndpoint {
  endpoint: string;
  avgResponseTime: number;
  callCount: number;
}

export interface PerformanceAnalysis {
  slowestEndpoints: PerformanceEndpoint[];
  averageResponseTime: number;
  totalRequests: number;
}

export interface ErrorDetail {
  type: string;
  count: number;
  percentage: number;
}

export interface ErrorAnalysis {
  commonErrors: ErrorDetail[];
  totalErrors: number;
  errorTrend: number;
}

export interface UserLogin {
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface UserActivity {
  recentLogins: UserLogin[];
  activeUsers: number;
  sessionsCount: number;
}

export interface SecurityActivity {
  type: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SecurityEvents {
  suspiciousActivities: SecurityActivity[];
  failedLoginAttempts: number;
  securityScore: number;
}

export interface FeatureUsage {
  featureName: string;
  usageCount: number;
  uniqueUsers: number;
  usageRate: number;
}

export interface LoggingAnalytics {
  metrics: AnalyticsMetrics;
  performanceAnalysis: PerformanceAnalysis;
  errorAnalysis: ErrorAnalysis;
  userActivity: UserActivity;
  securityEvents: SecurityEvents;
  featureUsage: FeatureUsage[];
}

export function useLoggingAnalytics() {
  const logger = useComponentLogger('LoggingAnalytics');
  const [analytics, setAnalytics] = useState<LoggingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateMockData = useCallback((): LoggingAnalytics => {
    logger.info('分析データの生成を開始');

    const mockData: LoggingAnalytics = {
      metrics: {
        apiResponseTime: Math.floor(Math.random() * 200 + 150),
        errorRate: Math.floor(Math.random() * 5 + 1),
        successRate: Math.floor(Math.random() * 5 + 95),
        activeUsers: Math.floor(Math.random() * 50 + 20),
      },
      performanceAnalysis: {
        slowestEndpoints: [
          { endpoint: '/api/timecard/summary', avgResponseTime: 850, callCount: 145 },
          { endpoint: '/api/equipment/search', avgResponseTime: 720, callCount: 89 },
          { endpoint: '/api/expense/report', avgResponseTime: 680, callCount: 67 },
          { endpoint: '/api/auth/profile', avgResponseTime: 450, callCount: 234 },
          { endpoint: '/api/team/members', avgResponseTime: 380, callCount: 156 },
        ],
        averageResponseTime: 285,
        totalRequests: 1250,
      },
      errorAnalysis: {
        commonErrors: [
          { type: 'Validation Error', count: 25, percentage: 45 },
          { type: 'Authentication Error', count: 18, percentage: 32 },
          { type: 'Network Timeout', count: 8, percentage: 14 },
          { type: 'Database Error', count: 5, percentage: 9 },
        ],
        totalErrors: 56,
        errorTrend: -12,
      },
      userActivity: {
        recentLogins: [
          { userId: 'user_001', timestamp: new Date().toISOString(), ipAddress: '192.168.1.10', userAgent: 'Chrome/120.0' },
          { userId: 'user_002', timestamp: new Date(Date.now() - 300000).toISOString(), ipAddress: '192.168.1.15', userAgent: 'Firefox/119.0' },
          { userId: 'user_003', timestamp: new Date(Date.now() - 600000).toISOString(), ipAddress: '192.168.1.22', userAgent: 'Safari/17.0' },
          { userId: 'user_004', timestamp: new Date(Date.now() - 900000).toISOString(), ipAddress: '192.168.1.8', userAgent: 'Chrome/120.0' },
          { userId: 'user_005', timestamp: new Date(Date.now() - 1200000).toISOString(), ipAddress: '192.168.1.33', userAgent: 'Edge/119.0' },
        ],
        activeUsers: 23,
        sessionsCount: 45,
      },
      securityEvents: {
        suspiciousActivities: [
          {
            type: 'Multiple Failed Logins',
            description: '同一IPから5回連続のログイン失敗',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            severity: 'medium',
          },
          {
            type: 'Unusual Access Pattern',
            description: '通常と異なる時間帯でのアクセス',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            severity: 'low',
          },
        ],
        failedLoginAttempts: 12,
        securityScore: 95,
      },
      featureUsage: [
        { featureName: 'タイムカード管理', usageCount: 456, uniqueUsers: 34, usageRate: 85 },
        { featureName: '備品管理', usageCount: 234, uniqueUsers: 28, usageRate: 72 },
        { featureName: '経費管理', usageCount: 189, uniqueUsers: 22, usageRate: 58 },
        { featureName: 'チーム管理', usageCount: 145, uniqueUsers: 18, usageRate: 48 },
        { featureName: '従業員登録', usageCount: 89, uniqueUsers: 12, usageRate: 32 },
      ],
    };

    logger.info('分析データの生成が完了', { metricsCount: Object.keys(mockData.metrics).length });
    return mockData;
  }, [logger]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      logger.info('分析データの更新を開始');

      await new Promise(resolve => setTimeout(resolve, 1000));

      const newData = generateMockData();
      setAnalytics(newData);

      logger.info('分析データの更新が完了');
    } catch (error) {
      logger.error('分析データの更新に失敗', { error });
    } finally {
      setIsLoading(false);
    }
  }, [generateMockData, logger]);

  return {
    analytics,
    isLoading,
    refresh,
  };
}
