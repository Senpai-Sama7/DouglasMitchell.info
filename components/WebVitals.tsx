'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useState } from 'react';

interface VitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export function WebVitals() {
  const [metrics, setMetrics] = useState<Map<string, VitalsMetric>>(new Map());

  useReportWebVitals((metric) => {
    const { name, value, rating, delta } = metric;

    // Update metrics state
    setMetrics((prev) => {
      const newMetrics = new Map(prev);
      newMetrics.set(name, { name, value, rating, delta });
      return newMetrics;
    });

    // Send to analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      sendToAnalytics(metric);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${name}:`, {
        value: Math.round(value),
        rating,
        delta: Math.round(delta),
      });
    }
  });

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_SHOW_VITALS) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs rounded-lg p-3 z-50 max-w-xs">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <span>⚡</span>
        <span>Web Vitals</span>
      </div>
      <div className="space-y-1">
        {Array.from(metrics.values()).map((metric) => (
          <div key={metric.name} className="flex justify-between items-center gap-4">
            <span className="font-mono">{metric.name}:</span>
            <span
              className={`font-bold ${
                metric.rating === 'good'
                  ? 'text-green-400'
                  : metric.rating === 'needs-improvement'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {Math.round(metric.value)}
              {metric.name === 'CLS' ? '' : 'ms'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Send metrics to analytics endpoint
async function sendToAnalytics(metric: any) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });

  const url = '/api/vitals';

  // Use sendBeacon if available (for better reliability)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    // Fallback to fetch
    fetch(url, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send web vitals:', error);
    });
  }
}

// Thresholds for Core Web Vitals (2026 standards)
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
};
