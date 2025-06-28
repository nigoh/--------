/**
 * Performance Monitoring with Web Vitals
 * 
 * Core Web Vitalsの監視とパフォーマンス最適化
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import React from 'react';
import { 
  RocketLaunch as RocketIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

// パフォーマンスメトリクスの型定義
interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

/**
 * パフォーマンスメトリクスをコンソールに出力
 */
const logMetric = (metric: PerformanceMetric) => {
  console.group(`Performance Metric: ${metric.name}`);
  console.log(`Value: ${metric.value.toFixed(2)}ms`);
  console.log(`Delta: ${metric.delta.toFixed(2)}ms`);
  console.log(`ID: ${metric.id}`);
  
  // パフォーマンス閾値による評価
  const thresholds = {
    'CLS': { good: 0.1, poor: 0.25 },
    'FID': { good: 100, poor: 300 },
    'FCP': { good: 1800, poor: 3000 },
    'LCP': { good: 2500, poor: 4000 },
    'TTFB': { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric.name as keyof typeof thresholds];
  if (threshold) {
    let rating = 'good';
    if (metric.value > threshold.poor) {
      rating = 'poor';
    } else if (metric.value > threshold.good) {
      rating = 'needs-improvement';
    }
    
    const ratingText = rating === 'good' ? 'Good' : rating === 'needs-improvement' ? 'Needs Improvement' : 'Poor';
    console.log(`Rating: ${ratingText}`);
  }
  
  console.groupEnd();
};

/**
 * Analytics サービスに送信（実際の実装では分析サービスのAPIを使用）
 */
const sendToAnalytics = (metric: PerformanceMetric) => {
  // 本番環境では実際の分析サービス（Google Analytics、Adobe Analytics等）に送信
  if (process.env.NODE_ENV === 'production') {
    // 例: gtag('event', metric.name, { value: metric.value });
    // 例: analytics.track(metric.name, { value: metric.value });
  }
  
  // 開発環境ではローカルストレージに保存
  if (process.env.NODE_ENV === 'development') {
    const metrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
    metrics.push({
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    localStorage.setItem('performance-metrics', JSON.stringify(metrics));
  }
};

/**
 * パフォーマンスメトリクスのハンドラー
 */
const handleMetric = (metric: PerformanceMetric) => {
  logMetric(metric);
  sendToAnalytics(metric);
};

/**
 * Web Vitalsの監視を開始
 */
export const initPerformanceMonitoring = () => {
  // Cumulative Layout Shift (CLS)
  onCLS(handleMetric);
  
  // Interaction to Next Paint (INP) - FIDの後継
  onINP(handleMetric);
  
  // First Contentful Paint (FCP)
  onFCP(handleMetric);
  
  // Largest Contentful Paint (LCP)
  onLCP(handleMetric);
  
  // Time to First Byte (TTFB)
  onTTFB(handleMetric);
  
  console.log('Performance monitoring initialized with Web Vitals');
};

/**
 * カスタムパフォーマンス計測
 */
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private measurements: Map<string, number> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  /**
   * 計測開始
   */
  start(name: string): void {
    this.measurements.set(name, performance.now());
    performance.mark(`${name}-start`);
  }

  /**
   * 計測終了
   */
  end(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`Performance measurement "${name}" was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    this.measurements.delete(name);
    
    console.log(`Timer: ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * 保存されたメトリクスを取得
   */
  getStoredMetrics(): Array<{
    name: string;
    value: number;
    timestamp: number;
    url: string;
    userAgent: string;
  }> {
    try {
      return JSON.parse(localStorage.getItem('performance-metrics') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * 保存されたメトリクスをクリア
   */
  clearStoredMetrics(): void {
    localStorage.removeItem('performance-metrics');
  }

  /**
   * パフォーマンスレポートを生成
   */
  generateReport(): string {
    const metrics = this.getStoredMetrics();
    if (metrics.length === 0) {
      return 'No performance metrics available';
    }

    const report = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    let reportText = 'Performance Report\n\n';
    
    Object.entries(report).forEach(([name, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      reportText += `${name}:\n`;
      reportText += `  Average: ${avg.toFixed(2)}ms\n`;
      reportText += `  Min: ${min.toFixed(2)}ms\n`;
      reportText += `  Max: ${max.toFixed(2)}ms\n`;
      reportText += `  Samples: ${values.length}\n\n`;
    });

    return reportText;
  }
}

/**
 * 開発環境でのパフォーマンス情報表示
 */
interface PerformanceDevToolsProps {
  open: boolean;
  onClose: () => void;
}

export const PerformanceDevTools: React.FC<PerformanceDevToolsProps> = ({ open, onClose }) => {
  const tracker = PerformanceTracker.getInstance();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid #333',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px',
          borderBottom: '1px solid #333',
          paddingBottom: '10px'
        }}>
          <h3 style={{ margin: 0, color: '#4fc3f7', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RocketIcon style={{ fontSize: '16px' }} />
            Performance Monitor
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ 
              backgroundColor: '#2e7d32', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              DEV
            </span>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #666',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CloseIcon style={{ fontSize: '12px' }} />
              Close
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          {tracker.getStoredMetrics().length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#999', 
              padding: '20px',
              border: '1px dashed #444',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUpIcon style={{ fontSize: '24px', color: '#666' }} />
              No performance data collected yet.
              <small>Navigate through the app to generate metrics.</small>
            </div>
          ) : (
            <pre style={{ margin: 0, fontSize: '11px', lineHeight: '1.5', color: '#e0e0e0' }}>
              {tracker.generateReport()}
            </pre>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              tracker.clearStoredMetrics();
              onClose();
            }}
            style={{
              backgroundColor: '#f44336',
              border: 'none',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <DeleteIcon style={{ fontSize: '14px' }} />
            Clear Metrics
          </button>
          <button
            onClick={() => {
              console.log(tracker.generateReport());
              alert('Performance report logged to console');
            }}
            style={{
              backgroundColor: '#4caf50',
              border: 'none',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CopyIcon style={{ fontSize: '14px' }} />
            Export to Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default { initPerformanceMonitoring, PerformanceTracker, PerformanceDevTools };
