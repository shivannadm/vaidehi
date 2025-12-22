// src/app/(landing)/pnl-report/utils/metricsWrapper.ts

import { calculateAdvancedMetrics } from '@/lib/trading/metrics';
import type { Trade } from './fileParser';

/**
 * Wrapper function to use your existing metrics.ts
 * This ensures we use the accurate calculation you already have
 */
export function calculateMetrics(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    throw new Error('No trades to analyze');
  }

  console.log('Calculating metrics for', trades.length, 'trades');
  console.log('Sample trade:', trades[0]);

  // Use your existing calculateAdvancedMetrics function
  const metrics = calculateAdvancedMetrics(trades);

  console.log('Calculated metrics:', metrics);

  return metrics;
}

/**
 * Export types from your metrics file
 */
export type { AdvancedMetrics } from '@/app/(landing)/pnl-report/types/analytics.types';