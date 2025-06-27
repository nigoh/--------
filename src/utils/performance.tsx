/**
 * Performance Monitoring with Web Vitals
 * 
 * Core Web Vitalsの監視とパフォーマンス最適化
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import React from 'react';

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
  console.group(`🚀 ${metric.name} Performance Metric`);
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
    
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`Rating: ${emoji} ${rating}`);
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
  
  console.log('🔍 Performance monitoring initialized with Web Vitals');
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
    
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
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

    let reportText = '📊 Performance Report\n\n';
    
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
export const PerformanceDevTools = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const tracker = PerformanceTracker.getInstance();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxWidth: '400px',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: isOpen ? '10px' : '0',
        }}
      >
        {isOpen ? 'Hide' : 'Show'} Performance Metrics
      </button>
      
      {isOpen && (
        <div>
          <pre style={{ margin: 0, fontSize: '10px', lineHeight: '1.4' }}>
            {tracker.generateReport()}
          </pre>
          <button
            onClick={() => tracker.clearStoredMetrics()}
            style={{
              backgroundColor: '#ff4444',
              border: 'none',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Clear Metrics
          </button>
        </div>
      )}
    </div>
  );
};

export default { initPerformanceMonitoring, PerformanceTracker, PerformanceDevTools };
