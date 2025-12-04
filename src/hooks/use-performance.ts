import { useCallback, useEffect } from "react";

export function usePerformance() {
  const logMetric = useCallback((name: string, value: number) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 ${name}:`, value);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // You can send to Google Analytics, Vercel Analytics, etc.
      // gtag('event', 'web_vitals', { name, value });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === "first-contentful-paint") {
          logMetric("FCP", entry.startTime);
        }
      });
    });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        logMetric("LCP", lastEntry.startTime);
      }
    });

    // First Input Delay
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const firstInputEntry = entry as PerformanceEntry & {
          processingStart?: number;
        };
        if (firstInputEntry.processingStart) {
          logMetric("FID", firstInputEntry.processingStart - entry.startTime);
        }
      });
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const layoutShiftEntry = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
        }
      });
      logMetric("CLS", clsValue);
    });

    try {
      fcpObserver.observe({ entryTypes: ["paint"] });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      fidObserver.observe({ entryTypes: ["first-input"] });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (error) {
      console.warn("Performance monitoring not supported:", error);
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      logMetric("TTFB", navigationEntry.responseStart - navigationEntry.requestStart);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [logMetric]);
}

// Hook for measuring component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        console.log(`⚡ ${componentName} render time:`, renderTime.toFixed(2), "ms");
      };
    }
  }, [componentName]);
}

// Hook for measuring function execution time
export function useFunctionTimer<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T {
  return useCallback(
    (...args: Parameters<T>) => {
      if (process.env.NODE_ENV === "development") {
        const startTime = performance.now();
        const result = fn(...args);
        const endTime = performance.now();
        console.log(`⚡ ${name} execution time:`, (endTime - startTime).toFixed(2), "ms");
        return result;
      }
      return fn(...args);
    },
    [fn, name]
  ) as T;
}
