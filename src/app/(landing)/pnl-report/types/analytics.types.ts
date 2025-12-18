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