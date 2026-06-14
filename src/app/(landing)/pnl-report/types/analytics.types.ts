// src/app/(landing)/pnl-report/types/analytics.types.ts

export interface Trade {
  trade_date: string;
  symbol: string;
  trade_type: string;
  segment: string;
  quantity: number;
  buy_value: number;
  sell_value: number;
  gross_pnl: number;
  charges: number;
  net_pnl: number;
  raw?: any;
}

export interface DailyPnL {
  net_pnl: number;
  gross_pnl: any;
  charges: any;
  trades_count: number;
  date: string;
  pnl: number;
  cumulative: number;
}

export interface AdvancedMetrics {
  // Core Performance
  totalGrossPnL: number;
  totalCharges: number;
  totalNetPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;

  // Risk Metrics
  profitFactor: number;
  expectancy: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  recoveryFactor: number;
  omegaRatio: number;

  // Drawdown
  maxDrawdown: number;
  maxDrawdownPercent: number;
  currentDrawdown: number;
  maxDrawdownDuration: number;

  // Win/Loss Analysis
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  payoffRatio: number;

  // Streaks
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;

  // Best/Worst
  bestDay: number;
  worstDay: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;

  // Duration & Patterns
  avgTradeDuration: number;
  longestTrade: number;
  intradayPercent: number;

  // Kelly Criterion
  kellyCriterion: number;

  // Date Range
  startDate: string;
  endDate: string;
}

export interface ImportStatus {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  message: string;
  progress?: number;
}

export interface AnalyticsData {
  financialYear: string;
  trades: Trade[];
  metrics: AdvancedMetrics;
  dailyPnL: DailyPnL[];
}

// ============================================================
// COMPREHENSIVE ANALYTICS
// Structured namespace used by reports, export, and PDF utils
// ============================================================

export interface PerformanceAnalytics {
  totalPnL: number;
  /** Alias for totalPnL — required by TradingAnalyticsData in tradingExportUtils */
  netPnL: number;
  totalGrossPnL: number;
  totalCharges: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;            // percentage, e.g. 62.5
  profitFactor: number;
  expectancy: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  payoffRatio: number;
  bestDay: number;
  worstDay: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
}

export interface RiskAnalytics {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  recoveryFactor: number;
  omegaRatio: number;
  kellyCriterion: number;
  intradayPercent: number;
  avgTradeDuration: number;
  longestTrade: number;
}

export interface DrawdownAnalytics {
  maxDrawdown: number;
  maxDrawdownPercent: number;
  currentDrawdown: number;
  maxDrawdownDuration: number; // in days
}

export interface StreakAnalytics {
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
}

export interface MetaAnalytics {
  startDate: string;          // YYYY-MM-DD
  endDate: string;            // YYYY-MM-DD
  financialYear?: string;
  generatedAt?: string;       // ISO timestamp
}

/** Top-level object consumed by useExport, PDF generator, and screenshot util */
export interface ComprehensiveAnalytics {
  performance: PerformanceAnalytics;
  risk: RiskAnalytics;
  drawdown: DrawdownAnalytics;
  streaks: StreakAnalytics;
  meta: MetaAnalytics;
  /** Raw daily series — optional, included when available */
  dailyPnL?: DailyPnL[];
  /** Raw trade list — optional, included when available */
  trades?: Trade[];
}

// ============================================================
// EXPORT OPTIONS
// Passed to screenshot / PDF / share helpers
// ============================================================

export interface ExportOptions {
  /** Display name shown in the exported report header */
  username: string;
  /** App / brand name shown in the footer */
  appName: string;
  /** Optional file name override (without extension) */
  fileName?: string;
  /** Optional date range label, e.g. "FY 2024-25" */
  dateRangeLabel?: string;
}

// ============================================================
// HELPER: Build ComprehensiveAnalytics from AdvancedMetrics
// Use this wherever you already have AdvancedMetrics to avoid
// duplicating mapping logic across the codebase.
// ============================================================

export function toComprehensiveAnalytics(
  metrics: AdvancedMetrics,
  overrides?: Partial<MetaAnalytics>
): ComprehensiveAnalytics {
  return {
    performance: {
      totalPnL: metrics.totalNetPnL,
      netPnL: metrics.totalNetPnL,       // alias required by tradingExportUtils
      totalGrossPnL: metrics.totalGrossPnL,
      totalCharges: metrics.totalCharges,
      totalTrades: metrics.totalTrades,
      winningTrades: metrics.winningTrades,
      losingTrades: metrics.losingTrades,
      winRate: metrics.winRate,
      profitFactor: metrics.profitFactor,
      expectancy: metrics.expectancy,
      avgWin: metrics.avgWin,
      avgLoss: metrics.avgLoss,
      largestWin: metrics.largestWin,
      largestLoss: metrics.largestLoss,
      payoffRatio: metrics.payoffRatio,
      bestDay: metrics.bestDay,
      worstDay: metrics.worstDay,
      bestTrade: metrics.bestTrade,
      worstTrade: metrics.worstTrade,
    },
    risk: {
      sharpeRatio: metrics.sharpeRatio,
      sortinoRatio: metrics.sortinoRatio,
      calmarRatio: metrics.calmarRatio,
      recoveryFactor: metrics.recoveryFactor,
      omegaRatio: metrics.omegaRatio,
      kellyCriterion: metrics.kellyCriterion,
      intradayPercent: metrics.intradayPercent,
      avgTradeDuration: metrics.avgTradeDuration,
      longestTrade: metrics.longestTrade,
    },
    drawdown: {
      maxDrawdown: metrics.maxDrawdown,
      maxDrawdownPercent: metrics.maxDrawdownPercent,
      currentDrawdown: metrics.currentDrawdown,
      maxDrawdownDuration: metrics.maxDrawdownDuration,
    },
    streaks: {
      currentStreak: metrics.currentStreak,
      longestWinStreak: metrics.longestWinStreak,
      longestLossStreak: metrics.longestLossStreak,
    },
    meta: {
      startDate: metrics.startDate,
      endDate: metrics.endDate,
      generatedAt: new Date().toISOString(),
      ...overrides,
    },
  };
}