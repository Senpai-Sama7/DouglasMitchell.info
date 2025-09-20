/**
 * Error Monitoring and Detection Library
 * Provides comprehensive error tracking and user experience monitoring
 */

class ErrorMonitor {
  constructor(config = {}) {
    this.config = {
      enableConsoleCapture: true,
      enablePerformanceMonitoring: true,
      enableUserExperienceTracking: true,
      maxErrors: 50,
      reportInterval: 30000, // 30 seconds
      ...config
    };

    this.errors = [];
    this.performanceMetrics = {};
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (this.isInitialized) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          timestamp: Date.now()
        });
      }
    }, true);

    // Network monitoring
    this.monitorNetwork();

    // Performance monitoring
    if (this.config.enablePerformanceMonitoring) {
      this.monitorPerformance();
    }

    // User experience monitoring
    if (this.config.enableUserExperienceTracking) {
      this.monitorUserExperience();
    }

    this.isInitialized = true;
  }

  captureError(error) {
    // Prevent spam
    if (this.errors.length >= this.config.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    this.errors.push(error);

    // Log to console in development
    if (this.isDevelopment()) {
      console.error('ErrorMonitor captured:', error);
    }

    // Send to monitoring service if configured
    this.reportError(error);
  }

  monitorNetwork() {
    // Monitor fetch failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.captureError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            status: response.status,
            timestamp: Date.now()
          });
        }

        return response;
      } catch (error) {
        this.captureError({
          type: 'network',
          message: `Network error: ${error.message}`,
          url: args[0],
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  monitorPerformance() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.performanceMetrics.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.performanceMetrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Page load metrics
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      this.performanceMetrics.loadTime = perfData.loadEventEnd - perfData.navigationStart;
      this.performanceMetrics.domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      this.performanceMetrics.ttfb = perfData.responseStart - perfData.navigationStart;
    });
  }

  monitorUserExperience() {
    // Track failed interactions
    document.addEventListener('click', (event) => {
      const target = event.target;

      // Check for broken links
      if (target.tagName === 'A' && target.href.startsWith('#')) {
        const targetElement = document.querySelector(target.getAttribute('href'));
        if (!targetElement) {
          this.captureError({
            type: 'ux',
            message: `Broken anchor link: ${target.href}`,
            element: target.outerHTML,
            timestamp: Date.now()
          });
        }
      }
    });

    // Monitor form errors
    document.addEventListener('invalid', (event) => {
      this.captureError({
        type: 'form',
        message: `Form validation failed: ${event.target.validationMessage}`,
        field: event.target.name || event.target.id,
        timestamp: Date.now()
      });
    }, true);

    // Track theme toggle failures
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(() => {
          try {
            const currentScheme = getComputedStyle(document.documentElement).colorScheme;
            if (!currentScheme || currentScheme === 'normal') {
              this.captureError({
                type: 'theme',
                message: 'Theme toggle failed to apply changes',
                timestamp: Date.now()
              });
            }
          } catch (error) {
            this.captureError({
              type: 'theme',
              message: `Theme toggle error: ${error.message}`,
              timestamp: Date.now()
            });
          }
        }, 100);
      });
    }
  }

  reportError(error) {
    // In a real application, send to monitoring service
    // For now, store locally for debugging
    if (this.isDevelopment()) {
      const reports = JSON.parse(localStorage.getItem('error-reports') || '[]');
      reports.push(error);

      // Keep only last 100 reports
      if (reports.length > 100) {
        reports.splice(0, reports.length - 100);
      }

      localStorage.setItem('error-reports', JSON.stringify(reports));
    }
  }

  getErrorReport() {
    return {
      errors: this.errors,
      performance: this.performanceMetrics,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    };
  }

  clearErrors() {
    this.errors = [];
    if (this.isDevelopment()) {
      localStorage.removeItem('error-reports');
    }
  }

  isDevelopment() {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
  }

  // Method to check health status
  getHealthStatus() {
    const criticalErrors = this.errors.filter(error =>
      error.type === 'javascript' || error.type === 'resource'
    );

    const performanceIssues = [];
    if (this.performanceMetrics.lcp > 2500) {
      performanceIssues.push('LCP too slow');
    }
    if (this.performanceMetrics.fid > 100) {
      performanceIssues.push('FID too high');
    }
    if (this.performanceMetrics.cls > 0.1) {
      performanceIssues.push('CLS too high');
    }

    return {
      status: criticalErrors.length === 0 && performanceIssues.length === 0 ? 'healthy' : 'degraded',
      criticalErrors: criticalErrors.length,
      performanceIssues,
      totalErrors: this.errors.length
    };
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  window.ErrorMonitor = new ErrorMonitor();

  // Expose for debugging
  window.getErrorReport = () => window.ErrorMonitor.getErrorReport();
  window.getHealthStatus = () => window.ErrorMonitor.getHealthStatus();
  window.clearErrors = () => window.ErrorMonitor.clearErrors();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorMonitor;
}