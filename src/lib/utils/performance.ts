// src/lib/utils/performance.ts

/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

const metrics: PerformanceMetric[] = [];

/**
 * Measure function execution time
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    metrics.push({ name, duration, timestamp: Date.now() });
    
    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Get performance report
 */
export function getPerformanceReport(): string {
  if (metrics.length === 0) return 'No metrics recorded';
  
  const report = metrics.map(m => 
    `${m.name}: ${m.duration.toFixed(2)}ms`
  ).join('\n');
  
  const total = metrics.reduce((sum, m) => sum + m.duration, 0);
  
  return `${report}\n\nTotal: ${total.toFixed(2)}ms`;
}

/**
 * Clear metrics
 */
export function clearMetrics() {
  metrics.length = 0;
}

/**
 * Debounce function for input optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memory-efficient array chunking
 */
export function* chunkArray<T>(array: T[], size: number): Generator<T[]> {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

/**
 * Lazy load image optimization
 */
export function lazyLoadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if element is in viewport (for lazy loading)
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Web Worker helper for heavy computations
 */
export function createWorker(fn: Function): Worker | null {
  if (typeof Worker === 'undefined') return null;
  
  const blob = new Blob([`self.onmessage = ${fn.toString()}`], {
    type: 'application/javascript',
  });
  
  return new Worker(URL.createObjectURL(blob));
}

/**
 * Optimize large arrays with virtual scrolling
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  buffer: number;
}

export function calculateVisibleRange(
  scrollTop: number,
  config: VirtualScrollConfig,
  totalItems: number
): { start: number; end: number } {
  const { itemHeight, containerHeight, buffer } = config;
  
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleItems + buffer * 2);
  
  return { start, end };
}

/**
 * Format large numbers efficiently
 */
const formatCache = new Map<string, string>();

export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions
): string {
  const cacheKey = `${num}-${JSON.stringify(options)}`;
  
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }
  
  const formatter = new Intl.NumberFormat('en-IN', options);
  const formatted = formatter.format(num);
  
  if (formatCache.size > 100) {
    formatCache.clear();
  }
  
  formatCache.set(cacheKey, formatted);
  return formatted;
}

/**
 * Batch updates for better performance
 */
export class BatchUpdater<T> {
  private queue: T[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private callback: (items: T[]) => void;
  private delay: number;

  constructor(callback: (items: T[]) => void, delay = 100) {
    this.callback = callback;
    this.delay = delay;
  }

  add(item: T): void {
    this.queue.push(item);
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush(): void {
    if (this.queue.length > 0) {
      this.callback([...this.queue]);
      this.queue = [];
    }
  }
}

/**
 * Monitor bundle size impact
 */
export function getBundleSizeEstimate(): string {
  const scripts = Array.from(document.scripts);
  let totalSize = 0;
  
  scripts.forEach(script => {
    if (script.src) {
      fetch(script.src, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length');
          if (size) totalSize += parseInt(size);
        });
    }
  });
  
  return `~${(totalSize / 1024).toFixed(2)} KB`;
}