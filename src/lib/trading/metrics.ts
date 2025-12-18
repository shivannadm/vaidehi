// src/lib/trading/metrics.ts - UPDATED VERSION with data normalization

import type { Trade, DailyPnL, AdvancedMetrics } from '@/app/(landing)/pnl-report/types/analytics.types';

/**
 * Normalize trade data to ensure correct field names and types
 */
function normalizeTrade(trade: any): Trade {
  // Handle various possible field name formats
  const normalizeNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  return {
    trade_date: trade.trade_date || trade.tradeDate || trade.date || '',
    symbol: trade.symbol || trade.Symbol || '',
    trade_type: trade.trade_type || trade.tradeType || trade.type || '',
    segment: trade.segment || trade.Segment || '',
    quantity: normalizeNumber(trade.quantity || trade.Quantity || trade.qty),
    buy_value: normalizeNumber(trade.buy_value || trade.buyValue || trade.buy),
    sell_value: normalizeNumber(trade.sell_value || trade.sellValue || trade.sell),
    gross_pnl: normalizeNumber(trade.gross_pnl || trade.grossPnl || trade.grossPL),
    charges: normalizeNumber(trade.charges || trade.Charges || trade.fees),
    net_pnl: normalizeNumber(trade.net_pnl || trade.netPnl || trade.netPL),
    raw: trade,
  };
}

/**
 * Calculate all 33 advanced trading metrics from trade data
 */
export function calculateAdvancedMetrics(rawTrades: any[]): AdvancedMetrics {
  if (!rawTrades || rawTrades.length === 0) {
    console.warn('No trades provided to calculateAdvancedMetrics');
    return getEmptyMetrics();
  }

  // Normalize all trades
  const trades = rawTrades.map(normalizeTrade);

  console.log('Normalized first trade:', trades[0]);
  console.log('Total normalized trades:', trades.length);

  // Separate winning and losing trades
  const winningTrades = trades.filter(t => t.net_pnl > 0);
  const losingTrades = trades.filter(t => t.net_pnl <= 0);

  console.log('Winning trades:', winningTrades.length);
  console.log('Losing trades:', losingTrades.length);

  // Core Performance Metrics
  const totalGrossPnL = trades.reduce((sum, t) => sum + t.gross_pnl, 0);
  const totalCharges = trades.reduce((sum, t) => sum + t.charges, 0);
  const totalNetPnL = trades.reduce((sum, t) => sum + t.net_pnl, 0);
  const totalTrades = trades.length;
  const winningTradesCount = winningTrades.length;
  const losingTradesCount = losingTrades.length;

  console.log('Total Net P&L:', totalNetPnL);
  console.log('Total Gross P&L:', totalGrossPnL);
  console.log('Total Charges:', totalCharges);

  // Win Rate
  const winRate = totalTrades > 0 ? (winningTradesCount / totalTrades) * 100 : 0;

  // Average Win and Loss
  const avgWin = winningTradesCount > 0 
    ? winningTrades.reduce((sum, t) => sum + t.net_pnl, 0) / winningTradesCount 
    : 0;

  const avgLoss = losingTradesCount > 0 
    ? losingTrades.reduce((sum, t) => sum + t.net_pnl, 0) / losingTradesCount 
    : 0;

  // Profit Factor
  const totalWins = winningTrades.reduce((sum, t) => sum + t.net_pnl, 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.net_pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

  console.log('Profit Factor:', profitFactor);

  // Expectancy
  const expectancy = (winRate / 100) * avgWin + ((100 - winRate) / 100) * avgLoss;

  // Payoff Ratio
  const payoffRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  // Kelly Criterion: (Win% * PayoffRatio - Loss%) / PayoffRatio
  const lossRate = 100 - winRate;
  const kellyCriterion = payoffRatio > 0 
    ? ((winRate / 100) * payoffRatio - (lossRate / 100)) / payoffRatio 
    : 0;

  // Drawdown Calculation
  const dailyPnL = aggregateByDay(trades);
  let peak = 0;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let cumulative = 0;
  let maxDrawdownDuration = 0;
  let currentDDDuration = 0;
  let inDrawdown = false;
  let drawdownStart = 0;

  dailyPnL.forEach((day, index) => {
    cumulative += day.pnl;
    
    if (cumulative > peak) {
      peak = cumulative;
      currentDDDuration = 0;
      inDrawdown = false;
    } else {
      if (!inDrawdown) {
        drawdownStart = index;
        inDrawdown = true;
      }
      currentDDDuration = index - drawdownStart;
    }
    
    const drawdown = peak - cumulative;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownDuration = currentDDDuration;
    }
  });

  const currentDrawdown = peak - cumulative;
  maxDrawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0;

  // Risk-adjusted Returns
  const returns = dailyPnL.map(d => d.pnl);
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  
  const variance = returns.length > 0
    ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    : 0;
  const stdDev = Math.sqrt(variance);

  // Sharpe Ratio (annualized, assuming 252 trading days)
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  // Sortino Ratio (uses downside deviation only)
  const negativeReturns = returns.filter(r => r < 0);
  const downsideVariance = negativeReturns.length > 0
    ? negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
    : 0;
  const downsideDev = Math.sqrt(downsideVariance);
  const sortinoRatio = downsideDev > 0 ? (avgReturn / downsideDev) * Math.sqrt(252) : 0;

  // Calmar Ratio (Return / Max Drawdown)
  const calmarRatio = maxDrawdown > 0 ? Math.abs(totalNetPnL / maxDrawdown) : 0;

  // Recovery Factor (Net Profit / Max Drawdown)
  const recoveryFactor = maxDrawdown > 0 ? Math.abs(totalNetPnL / maxDrawdown) : 0;

  // Omega Ratio
  const omegaRatio = calculateOmegaRatio(returns);

  // Streaks Analysis
  const streaks = calculateStreaks(trades);

  // Best and Worst Metrics
  const largestWin = trades.length > 0 ? Math.max(...trades.map(t => t.net_pnl)) : 0;
  const largestLoss = trades.length > 0 ? Math.min(...trades.map(t => t.net_pnl)) : 0;
  const bestDay = dailyPnL.length > 0 ? Math.max(...dailyPnL.map(d => d.pnl)) : 0;
  const worstDay = dailyPnL.length > 0 ? Math.min(...dailyPnL.map(d => d.pnl)) : 0;

  const bestTrade = trades.find(t => t.net_pnl === largestWin) || null;
  const worstTrade = trades.find(t => t.net_pnl === largestLoss) || null;

  // Duration Analysis
  const intradayTrades = trades.filter(t => isIntradayTrade(t));
  const intradayPercent = totalTrades > 0 ? (intradayTrades.length / totalTrades) * 100 : 0;

  const durations = trades
    .filter(t => !isIntradayTrade(t))
    .map(t => calculateTradeDuration(t));

  const avgTradeDuration = durations.length > 0 
    ? durations.reduce((a, b) => a + b, 0) / durations.length 
    : 0;

  const longestTrade = durations.length > 0 ? Math.max(...durations) : 0;

  // Date Range
  const dates = [...new Set(trades.map(t => t.trade_date).filter(Boolean))].sort();
  const startDate = dates[0] || '';
  const endDate = dates[dates.length - 1] || '';

  const result = {
    totalGrossPnL: round(totalGrossPnL, 2),
    totalCharges: round(totalCharges, 2),
    totalNetPnL: round(totalNetPnL, 2),
    totalTrades,
    winningTrades: winningTradesCount,
    losingTrades: losingTradesCount,
    winRate: round(winRate, 2),
    profitFactor: round(profitFactor, 2),
    expectancy: round(expectancy, 2),
    sharpeRatio: round(sharpeRatio, 2),
    sortinoRatio: round(sortinoRatio, 2),
    calmarRatio: round(calmarRatio, 2),
    recoveryFactor: round(recoveryFactor, 2),
    omegaRatio: round(omegaRatio, 2),
    maxDrawdown: round(maxDrawdown, 2),
    maxDrawdownPercent: round(maxDrawdownPercent, 2),
    currentDrawdown: round(currentDrawdown, 2),
    maxDrawdownDuration,
    avgWin: round(avgWin, 2),
    avgLoss: round(avgLoss, 2),
    largestWin: round(largestWin, 2),
    largestLoss: round(largestLoss, 2),
    payoffRatio: round(payoffRatio, 2),
    currentStreak: streaks.current,
    longestWinStreak: streaks.longestWin,
    longestLossStreak: streaks.longestLoss,
    bestDay: round(bestDay, 2),
    worstDay: round(worstDay, 2),
    bestTrade,
    worstTrade,
    avgTradeDuration: round(avgTradeDuration, 1),
    longestTrade,
    intradayPercent: round(intradayPercent, 1),
    kellyCriterion: round(kellyCriterion * 100, 2),
    startDate,
    endDate,
  };

  console.log('Final metrics result:', result);

  return result;
}

/**
 * Aggregate trades by day to calculate daily P&L
 */
export function aggregateByDay(trades: Trade[]): DailyPnL[] {
  const dailyMap = new Map<string, { net_pnl: number; gross_pnl: number; charges: number; trades_count: number }>();
  
  trades.forEach(trade => {
    const date = trade.trade_date;
    if (date) {
      const existing = dailyMap.get(date) || { net_pnl: 0, gross_pnl: 0, charges: 0, trades_count: 0 };
      dailyMap.set(date, {
        net_pnl: existing.net_pnl + trade.net_pnl,
        gross_pnl: existing.gross_pnl + trade.gross_pnl,
        charges: existing.charges + trade.charges,
        trades_count: existing.trades_count + 1,
      });
    }
  });
  
  const sorted = Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  let cumulative = 0;
  
  return sorted.map(([date, data]) => {
    cumulative += data.net_pnl;
    return { date, pnl: data.net_pnl, cumulative, net_pnl: data.net_pnl, gross_pnl: data.gross_pnl, charges: data.charges, trades_count: data.trades_count };
  });
}

/**
 * Calculate winning and losing streaks
 */
function calculateStreaks(trades: Trade[]): { current: number; longestWin: number; longestLoss: number } {
  let current = 0;
  let longestWin = 0;
  let longestLoss = 0;
  let tempWin = 0;
  let tempLoss = 0;

  for (let i = trades.length - 1; i >= 0; i--) {
    const trade = trades[i];
    
    if (trade.net_pnl > 0) {
      if (i === trades.length - 1 || trades[i + 1].net_pnl > 0) {
        current++;
      }
      tempWin++;
      tempLoss = 0;
      longestWin = Math.max(longestWin, tempWin);
    } else {
      if (i === trades.length - 1 || trades[i + 1].net_pnl <= 0) {
        current--;
      }
      tempLoss++;
      tempWin = 0;
      longestLoss = Math.max(longestLoss, tempLoss);
    }
  }

  return { current, longestWin, longestLoss };
}

/**
 * Calculate Omega Ratio (probability-weighted ratio of gains to losses)
 */
function calculateOmegaRatio(returns: number[], threshold: number = 0): number {
  const gains = returns.filter(r => r > threshold).reduce((sum, r) => sum + (r - threshold), 0);
  const losses = returns.filter(r => r < threshold).reduce((sum, r) => sum + Math.abs(r - threshold), 0);
  return losses > 0 ? gains / losses : gains > 0 ? 999 : 0;
}

/**
 * Determine if a trade is intraday based on trade type or segment
 */
function isIntradayTrade(trade: Trade): boolean {
  const type = trade.trade_type?.toLowerCase() || '';
  const segment = trade.segment?.toLowerCase() || '';
  return type.includes('intraday') || segment.includes('intraday') || type.includes('day');
}

/**
 * Calculate trade duration in days (simplified version)
 */
function calculateTradeDuration(trade: Trade): number {
  // For intraday, return 0
  if (isIntradayTrade(trade)) {
    return 0;
  }
  
  // For simplicity, assume positional trades are 1+ days
  return 1;
}

/**
 * Round number to specified decimal places
 */
function round(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Return empty metrics object (all zeros)
 */
function getEmptyMetrics(): AdvancedMetrics {
  return {
    totalGrossPnL: 0,
    totalCharges: 0,
    totalNetPnL: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    profitFactor: 0,
    expectancy: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    calmarRatio: 0,
    recoveryFactor: 0,
    omegaRatio: 0,
    maxDrawdown: 0,
    maxDrawdownPercent: 0,
    currentDrawdown: 0,
    maxDrawdownDuration: 0,
    avgWin: 0,
    avgLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    payoffRatio: 0,
    currentStreak: 0,
    longestWinStreak: 0,
    longestLossStreak: 0,
    bestDay: 0,
    worstDay: 0,
    bestTrade: null,
    worstTrade: null,
    avgTradeDuration: 0,
    longestTrade: 0,
    intradayPercent: 0,
    kellyCriterion: 0,
    startDate: '',
    endDate: '',
  };
}

// Export other helper functions (same as before)
export function buildDailyEquity(dailyPnL: DailyPnL[], startingCapital: number = 0): Array<{ date: string; equity: number }> {
  let equity = startingCapital;
  return dailyPnL.map(day => {
    equity += day.pnl;
    return { date: day.date, equity: round(equity, 2) };
  });
}

export function maxDrawdown(equityCurve: Array<{ date: string; equity: number }>): { maxDD: number; maxDDPercent: number; duration: number } {
  let peak = 0;
  let maxDD = 0;
  let maxDDPercent = 0;
  let duration = 0;
  let currentDuration = 0;

  equityCurve.forEach(point => {
    if (point.equity > peak) {
      peak = point.equity;
      currentDuration = 0;
    } else {
      currentDuration++;
    }

    const dd = peak - point.equity;
    if (dd > maxDD) {
      maxDD = dd;
      duration = currentDuration;
      maxDDPercent = peak > 0 ? (dd / peak) * 100 : 0;
    }
  });

  return { maxDD: round(maxDD, 2), maxDDPercent: round(maxDDPercent, 2), duration };
}

export function summaryBasic(trades: any[]): any {
  const normalized = trades.map(normalizeTrade);
  const totalGross = normalized.reduce((sum, t) => sum + t.gross_pnl, 0);
  const totalCharges = normalized.reduce((sum, t) => sum + t.charges, 0);
  const totalNet = normalized.reduce((sum, t) => sum + t.net_pnl, 0);
  const winningTrades = normalized.filter(t => t.net_pnl > 0).length;
  const losingTrades = normalized.filter(t => t.net_pnl <= 0).length;

  return {
    totalGross: round(totalGross, 2),
    totalCharges: round(totalCharges, 2),
    totalNet: round(totalNet, 2),
    totalTrades: normalized.length,
    winningTrades,
    losingTrades,
  };
}

export function profitFactor(trades: any[]): number {
  const normalized = trades.map(normalizeTrade);
  const wins = normalized.filter(t => t.net_pnl > 0);
  const losses = normalized.filter(t => t.net_pnl < 0);
  const totalWins = wins.reduce((sum, t) => sum + t.net_pnl, 0);
  const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.net_pnl, 0));
  return totalLosses > 0 ? round(totalWins / totalLosses, 2) : totalWins > 0 ? 999 : 0;
}

export function expectancy(trades: any[]): any {
  const normalized = trades.map(normalizeTrade);
  const wins = normalized.filter(t => t.net_pnl > 0);
  const losses = normalized.filter(t => t.net_pnl <= 0);
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.net_pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + t.net_pnl, 0) / losses.length : 0;
  const winRate = normalized.length > 0 ? wins.length / normalized.length : 0;
  const expectancyValue = winRate * avgWin + (1 - winRate) * avgLoss;
  return { avgWin: round(avgWin, 2), avgLoss: round(avgLoss, 2), expectancy: round(expectancyValue, 2) };
}

export function streaks(trades: any[]): any {
  return calculateStreaks(trades.map(normalizeTrade));
}