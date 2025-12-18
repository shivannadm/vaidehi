// src/app/dashboard/trading/reports/hooks/useZerodhaImport.ts
import { useState } from 'react';
import type { AdvancedMetrics, TradeData, DailyPnL, MonthlyBreakdown } from '../types/analytics.types';

interface EquityCurvePoint {
  date: string;
  cumulative_pnl: number;
  peak: number;
  drawdown: number;
}

export function useZerodhaImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null);

  const analyzeZerodhaData = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate URL
      if (!url.includes('console.zerodha.com/verified/')) {
        throw new Error('Invalid Zerodha verified link');
      }

      // In production, you'd fetch from Zerodha API or scrape
      // For now, we'll simulate with mock data
      const response = await fetchZerodhaData(url);
      
      const calculatedMetrics = calculateAdvancedMetrics(response.trades, response.daily_pnl);
      setMetrics(calculatedMetrics);

      return {
        trades: response.trades,
        daily_pnl: response.daily_pnl,
        metrics: calculatedMetrics,
        equity_curve: response.equity_curve,
        monthly_breakdown: response.monthly_breakdown,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to analyze data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeZerodhaData, loading, error, metrics };
}

// ============================================
// DATA FETCHING (MOCK - Replace with real API)
// ============================================

async function fetchZerodhaData(url: string): Promise<{
  trades: TradeData[];
  daily_pnl: DailyPnL[];
  equity_curve: EquityCurvePoint[];
  monthly_breakdown: MonthlyBreakdown[];
}> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock trades data (replace with actual Zerodha API response)
  const trades: TradeData[] = generateMockTrades();
  const daily_pnl: DailyPnL[] = generateDailyPnL(trades);
  const equity_curve: EquityCurvePoint[] = generateEquityCurve(daily_pnl);
  const monthly_breakdown: MonthlyBreakdown[] = generateMonthlyBreakdown(trades);

  return { trades, daily_pnl, equity_curve, monthly_breakdown };
}

// ============================================
// ADVANCED METRICS CALCULATION
// ============================================

function calculateAdvancedMetrics(trades: TradeData[], daily_pnl: DailyPnL[]): AdvancedMetrics {
  const winning_trades = trades.filter(t => t.net_pnl > 0);
  const losing_trades = trades.filter(t => t.net_pnl <= 0);

  const total_gross_pnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const total_charges = trades.reduce((sum, t) => sum + t.charges, 0);
  const total_net_pnl = trades.reduce((sum, t) => sum + t.net_pnl, 0);

  const win_rate = trades.length > 0 ? (winning_trades.length / trades.length) * 100 : 0;

  const avg_win = winning_trades.length > 0 
    ? winning_trades.reduce((sum, t) => sum + t.net_pnl, 0) / winning_trades.length 
    : 0;

  const avg_loss = losing_trades.length > 0 
    ? losing_trades.reduce((sum, t) => sum + t.net_pnl, 0) / losing_trades.length 
    : 0;

  const total_wins = winning_trades.reduce((sum, t) => sum + t.net_pnl, 0);
  const total_losses = Math.abs(losing_trades.reduce((sum, t) => sum + t.net_pnl, 0));

  const profit_factor = total_losses > 0 ? total_wins / total_losses : total_wins > 0 ? 999 : 0;
  const expectancy = (win_rate / 100) * avg_win + ((100 - win_rate) / 100) * avg_loss;
  const payoff_ratio = avg_loss !== 0 ? Math.abs(avg_win / avg_loss) : 0;

  // Kelly Criterion: (Win% * PayoffRatio - Loss%) / PayoffRatio
  const loss_rate = 100 - win_rate;
  const kelly_criterion = payoff_ratio > 0 
    ? ((win_rate / 100) * payoff_ratio - (loss_rate / 100)) / payoff_ratio 
    : 0;

  // Drawdown calculation
  let peak = 0;
  let max_drawdown = 0;
  let cumulative = 0;

  daily_pnl.forEach(day => {
    cumulative += day.net_pnl;
    if (cumulative > peak) peak = cumulative;
    const drawdown = peak - cumulative;
    if (drawdown > max_drawdown) max_drawdown = drawdown;
  });

  const current_drawdown = peak - cumulative;
  const max_drawdown_percent = peak > 0 ? (max_drawdown / peak) * 100 : 0;

  // Risk-adjusted returns
  const daily_returns = daily_pnl.map(d => d.net_pnl);
  const avg_return = daily_returns.reduce((a, b) => a + b, 0) / daily_returns.length;
  const std_dev = Math.sqrt(
    daily_returns.reduce((sum, r) => sum + Math.pow(r - avg_return, 2), 0) / daily_returns.length
  );

  const sharpe_ratio = std_dev > 0 ? (avg_return / std_dev) * Math.sqrt(252) : 0;

  // Sortino (downside deviation only)
  const negative_returns = daily_returns.filter(r => r < 0);
  const downside_dev = negative_returns.length > 0 
    ? Math.sqrt(negative_returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negative_returns.length)
    : 1;
  const sortino_ratio = downside_dev > 0 ? (avg_return / downside_dev) * Math.sqrt(252) : 0;

  const calmar_ratio = max_drawdown > 0 ? (total_net_pnl / max_drawdown) : 0;
  const recovery_factor = max_drawdown > 0 ? (total_net_pnl / max_drawdown) : 0;
  const omega_ratio = calculateOmegaRatio(daily_returns);

  // Streaks
  const streaks = calculateStreaks(trades);

  // Best/Worst
  const largest_win = Math.max(...trades.map(t => t.net_pnl));
  const largest_loss = Math.min(...trades.map(t => t.net_pnl));
  const best_day = Math.max(...daily_pnl.map(d => d.net_pnl));
  const worst_day = Math.min(...daily_pnl.map(d => d.net_pnl));

  const best_trade = trades.find(t => t.net_pnl === largest_win) || null;
  const worst_trade = trades.find(t => t.net_pnl === largest_loss) || null;

  // Duration analysis
  const intraday_trades = trades.filter(t => t.buy_date === t.sell_date);
  const intraday_trades_percent = (intraday_trades.length / trades.length) * 100;
  const positional_trades_percent = 100 - intraday_trades_percent;

  const durations = trades
    .filter(t => t.buy_date !== t.sell_date)
    .map(t => {
      const buy = new Date(t.buy_date);
      const sell = new Date(t.sell_date);
      return Math.floor((sell.getTime() - buy.getTime()) / (1000 * 60 * 60 * 24));
    });

  const avg_trade_duration = durations.length > 0 
    ? durations.reduce((a, b) => a + b, 0) / durations.length 
    : 0;

  const dates = [...new Set(trades.flatMap(t => [t.buy_date, t.sell_date]))];
  const total_trading_days = dates.length;

  const start_date = trades.length > 0 ? trades[0].buy_date : '';
  const end_date = trades.length > 0 ? trades[trades.length - 1].sell_date : '';
  const date_range_display = start_date && end_date 
    ? `${formatDate(start_date)} → ${formatDate(end_date)}`
    : 'N/A';

  return {
    total_gross_pnl,
    total_charges,
    total_net_pnl,
    total_trades: trades.length,
    winning_trades: winning_trades.length,
    losing_trades: losing_trades.length,
    win_rate: Math.round(win_rate * 100) / 100,
    profit_factor: Math.round(profit_factor * 100) / 100,
    expectancy: Math.round(expectancy * 100) / 100,
    sharpe_ratio: Math.round(sharpe_ratio * 100) / 100,
    sortino_ratio: Math.round(sortino_ratio * 100) / 100,
    calmar_ratio: Math.round(calmar_ratio * 100) / 100,
    recovery_factor: Math.round(recovery_factor * 100) / 100,
    omega_ratio: Math.round(omega_ratio * 100) / 100,
    max_drawdown: Math.round(max_drawdown * 100) / 100,
    max_drawdown_percent: Math.round(max_drawdown_percent * 100) / 100,
    current_drawdown: Math.round(current_drawdown * 100) / 100,
    avg_win: Math.round(avg_win * 100) / 100,
    avg_loss: Math.round(avg_loss * 100) / 100,
    largest_win: Math.round(largest_win * 100) / 100,
    largest_loss: Math.round(largest_loss * 100) / 100,
    payoff_ratio: Math.round(payoff_ratio * 100) / 100,
    current_streak: streaks.current,
    longest_win_streak: streaks.longestWin,
    longest_loss_streak: streaks.longestLoss,
    best_day: Math.round(best_day * 100) / 100,
    worst_day: Math.round(worst_day * 100) / 100,
    best_trade,
    worst_trade,
    avg_trade_duration: Math.round(avg_trade_duration * 10) / 10,
    intraday_trades_percent: Math.round(intraday_trades_percent * 10) / 10,
    positional_trades_percent: Math.round(positional_trades_percent * 10) / 10,
    total_trading_days,
    kelly_criterion: Math.round(kelly_criterion * 1000) / 1000,
    start_date,
    end_date,
    date_range_display,
  };
}

// Helper functions
function calculateStreaks(trades: TradeData[]): { current: number; longestWin: number; longestLoss: number } {
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

function calculateOmegaRatio(returns: number[], threshold: number = 0): number {
  const gains = returns.filter(r => r > threshold).reduce((sum, r) => sum + (r - threshold), 0);
  const losses = returns.filter(r => r < threshold).reduce((sum, r) => sum + Math.abs(r - threshold), 0);
  return losses > 0 ? gains / losses : gains > 0 ? 999 : 0;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// MOCK DATA GENERATORS (Replace with real API)
// ============================================

function generateMockTrades(): TradeData[] {
  const trades: TradeData[] = [];
  const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN'];
  
  for (let i = 0; i < 50; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const buyPrice = 1000 + Math.random() * 2000;
    const sellPrice = buyPrice + (Math.random() - 0.45) * buyPrice * 0.1;
    const quantity = Math.floor(Math.random() * 50) + 1;
    const pnl = (sellPrice - buyPrice) * quantity;
    const charges = Math.abs(pnl) * 0.02;
    
    trades.push({
      symbol,
      quantity,
      buy_price: buyPrice,
      sell_price: sellPrice,
      buy_date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      sell_date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      pnl,
      charges,
      net_pnl: pnl - charges,
      type: Math.random() > 0.5 ? 'equity' : 'fno',
    });
  }
  
  return trades.sort((a, b) => a.buy_date.localeCompare(b.buy_date));
}

function generateDailyPnL(trades: TradeData[]): DailyPnL[] {
  const dailyMap = new Map<string, DailyPnL>();
  
  trades.forEach(trade => {
    const date = trade.sell_date;
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        gross_pnl: 0,
        charges: 0,
        net_pnl: 0,
        trades_count: 0,
      });
    }
    
    const day = dailyMap.get(date)!;
    day.gross_pnl += trade.pnl;
    day.charges += trade.charges;
    day.net_pnl += trade.net_pnl;
    day.trades_count += 1;
  });
  
  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function generateEquityCurve(daily_pnl: DailyPnL[]): EquityCurvePoint[] {
  let cumulative = 0;
  let peak = 0;
  
  return daily_pnl.map(day => {
    cumulative += day.net_pnl;
    if (cumulative > peak) peak = cumulative;
    const drawdown = peak - cumulative;
    
    return {
      date: day.date,
      cumulative_pnl: cumulative,
      peak,
      drawdown,
    };
  });
}

function generateMonthlyBreakdown(trades: TradeData[]): MonthlyBreakdown[] {
  const monthlyMap = new Map<string, { gross: number; net: number; count: number; wins: number }>();
  
  trades.forEach(trade => {
    const month = trade.sell_date.substring(0, 7);
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { gross: 0, net: 0, count: 0, wins: 0 });
    }
    
    const data = monthlyMap.get(month)!;
    data.gross += trade.pnl;
    data.net += trade.net_pnl;
    data.count += 1;
    if (trade.net_pnl > 0) data.wins += 1;
  });
  
  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      gross_pnl: data.gross,
      net_pnl: data.net,
      trades: data.count,
      win_rate: (data.wins / data.count) * 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}