// ============================================
// FILE: src/lib/supabase/trading-helpers.ts
// ONE comprehensive helper file for ALL trading operations
// ============================================

import { createClient } from "./client";
import type {
  TradingRule,
  CreateTradingRule,
  UpdateTradingRule,
  Strategy,
  CreateStrategy,
  UpdateStrategy,
  Trade,
  TradeWithStrategy,
  CreateTrade,
  UpdateTrade,
  QuickNote,
  CreateQuickNote,
  UpdateQuickNote,
  BacktestResult,
  CreateBacktestResult,
  UpdateBacktestResult,
  TradingNoteType,
  TradingSession,
  CreateTradingSession,
  TradingStats,
  TradingDashboard,
  TradingResponse,
} from "@/types/database";

const supabase = createClient();

// ============================================
// TRADING RULES
// Priority #1 - Build first
// ============================================

/**
 * Get all rules for a user
 */
export async function getTradingRules(
  userId: string
): Promise<TradingResponse<TradingRule[]>> {
  const { data, error } = await supabase
    .from("trading_rules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get rules by category
 */
export async function getRulesByCategory(
  userId: string,
  category: string
): Promise<TradingResponse<TradingRule[]>> {
  const { data, error } = await supabase
    .from("trading_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get active rules only
 */
export async function getActiveRules(
  userId: string
): Promise<TradingResponse<TradingRule[]>> {
  const { data, error } = await supabase
    .from("trading_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Create a new trading rule
 */
export async function createTradingRule(
  rule: CreateTradingRule
): Promise<TradingResponse<TradingRule>> {
  const { data, error } = await supabase
    .from("trading_rules")
    .insert(rule)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a trading rule
 */
export async function updateTradingRule(
  ruleId: string,
  updates: UpdateTradingRule
): Promise<TradingResponse<TradingRule>> {
  const { data, error } = await supabase
    .from("trading_rules")
    .update(updates)
    .eq("id", ruleId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a trading rule
 */
export async function deleteTradingRule(
  ruleId: string
): Promise<TradingResponse<null>> {
  const { error } = await supabase
    .from("trading_rules")
    .delete()
    .eq("id", ruleId);

  return { data: null, error };
}

/**
 * Toggle rule active status
 */
export async function toggleRuleStatus(
  ruleId: string,
  isActive: boolean
): Promise<TradingResponse<TradingRule>> {
  return updateTradingRule(ruleId, { is_active: isActive });
}

// ============================================
// STRATEGIES
// Priority #3
// ============================================

/**
 * Get all strategies for a user
 */
export async function getStrategies(
  userId: string
): Promise<TradingResponse<Strategy[]>> {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get active strategies only
 */
export async function getActiveStrategies(
  userId: string
): Promise<TradingResponse<Strategy[]>> {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get single strategy by ID
 */
export async function getStrategyById(
  strategyId: string
): Promise<TradingResponse<Strategy>> {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("id", strategyId)
    .single();

  return { data, error };
}

/**
 * Create a new strategy
 */
export async function createStrategy(
  strategy: CreateStrategy
): Promise<TradingResponse<Strategy>> {
  const { data, error } = await supabase
    .from("strategies")
    .insert(strategy)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a strategy
 */
export async function updateStrategy(
  strategyId: string,
  updates: UpdateStrategy
): Promise<TradingResponse<Strategy>> {
  const { data, error } = await supabase
    .from("strategies")
    .update(updates)
    .eq("id", strategyId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a strategy
 */
export async function deleteStrategy(
  strategyId: string
): Promise<TradingResponse<null>> {
  const { error } = await supabase
    .from("strategies")
    .delete()
    .eq("id", strategyId);

  return { data: null, error };
}

/**
 * Get strategy performance comparison
 */
export async function compareStrategies(
  userId: string
): Promise<TradingResponse<Strategy[]>> {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .gt("total_trades", 0)
    .order("win_rate", { ascending: false });

  return { data, error };
}

// ============================================
// TRADES (JOURNAL)
// Priority #2 - Core feature
// ============================================

/**
 * Get all trades for a user
 */
export async function getTrades(
  userId: string
): Promise<TradingResponse<TradeWithStrategy[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("entry_time", { ascending: false });

  return { data, error };
}

/**
 * Get trades with pagination
 */
export async function getTradesPaginated(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<TradingResponse<TradeWithStrategy[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("entry_time", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

/**
 * Get recent trades (last N)
 */
export async function getRecentTrades(
  userId: string,
  limit: number = 10
): Promise<TradingResponse<TradeWithStrategy[]>> {
  return getTradesPaginated(userId, limit, 0);
}

/**
 * Get single trade by ID
 */
export async function getTradeById(
  tradeId: string
): Promise<TradingResponse<TradeWithStrategy>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("id", tradeId)
    .single();

  return { data, error };
}

/**
 * Get trades by date range
 */
export async function getTradesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<TradingResponse<TradeWithStrategy[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("user_id", userId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: false });

  return { data, error };
}

/**
 * Get trades by strategy
 */
export async function getTradesByStrategy(
  strategyId: string
): Promise<TradingResponse<Trade[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("strategy_id", strategyId)
    .order("entry_date", { ascending: false });

  return { data, error };
}

/**
 * Get open trades (not closed)
 */
export async function getOpenTrades(
  userId: string
): Promise<TradingResponse<TradeWithStrategy[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("user_id", userId)
    .eq("is_closed", false)
    .order("entry_date", { ascending: false });

  return { data, error };
}

/**
 * Get closed trades
 */
export async function getClosedTrades(
  userId: string
): Promise<TradingResponse<TradeWithStrategy[]>> {
  const { data, error } = await supabase
    .from("trades")
    .select(`
      *,
      strategy:strategies(*)
    `)
    .eq("user_id", userId)
    .eq("is_closed", true)
    .order("exit_date", { ascending: false });

  return { data, error };
}

/**
 * Create a new trade
 */
export async function createTrade(
  trade: CreateTrade
): Promise<TradingResponse<Trade>> {
  const { data, error } = await supabase
    .from("trades")
    .insert(trade)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a trade
 */
export async function updateTrade(
  tradeId: string,
  updates: UpdateTrade
): Promise<TradingResponse<Trade>> {
  const { data, error } = await supabase
    .from("trades")
    .update(updates)
    .eq("id", tradeId)
    .select()
    .single();

  return { data, error };
}

/**
 * Close a trade (set exit details)
 */
export async function closeTrade(
  tradeId: string,
  exitDetails: {
    exit_date: string;
    exit_time?: string;
    exit_price: number;
    post_trade_notes?: string;
    lessons_learned?: string;
  }
): Promise<TradingResponse<Trade>> {
  return updateTrade(tradeId, {
    ...exitDetails,
    is_closed: true,
  });
}

/**
 * Delete a trade
 */
export async function deleteTrade(
  tradeId: string
): Promise<TradingResponse<null>> {
  const { error } = await supabase
    .from("trades")
    .delete()
    .eq("id", tradeId);

  return { data: null, error };
}

/**
 * Upload trade screenshot
 */
export async function uploadTradeScreenshot(
  userId: string,
  tradeId: string,
  file: File
): Promise<TradingResponse<string>> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${tradeId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('trade-screenshots')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('trade-screenshots')
      .getPublicUrl(fileName);

    // Update trade with new screenshot URL
    const { data: trade } = await getTradeById(tradeId);
    if (trade) {
      const screenshots = trade.screenshots || [];
      await updateTrade(tradeId, {
        screenshots: [...screenshots, publicUrl],
      });
    }

    return { data: publicUrl, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// ============================================
// QUICK NOTES
// Priority #5
// ============================================

/**
 * Get all quick notes for a user
 */
export async function getQuickNotes(
  userId: string
): Promise<TradingResponse<QuickNote[]>> {
  const { data, error } = await supabase
    .from("quick_notes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get notes by date
 */
export async function getQuickNotesByDate(
  userId: string,
  date: string
): Promise<TradingResponse<QuickNote[]>> {
  const { data, error } = await supabase
    .from("quick_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get notes by type
 */
export async function getQuickNotesByType(
  userId: string,
  noteType: TradingNoteType
): Promise<TradingResponse<QuickNote[]>> {
  const { data, error } = await supabase
    .from("quick_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("note_type", noteType)
    .order("date", { ascending: false });

  return { data, error };
}

/**
 * Create a quick note
 */
export async function createQuickNote(
  note: CreateQuickNote
): Promise<TradingResponse<QuickNote>> {
  const { data, error } = await supabase
    .from("quick_notes")
    .insert(note)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a quick note
 */
export async function updateQuickNote(
  noteId: string,
  updates: UpdateQuickNote
): Promise<TradingResponse<QuickNote>> {
  const { data, error } = await supabase
    .from("quick_notes")
    .update(updates)
    .eq("id", noteId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a quick note
 */
export async function deleteQuickNote(
  noteId: string
): Promise<TradingResponse<null>> {
  const { error } = await supabase
    .from("quick_notes")
    .delete()
    .eq("id", noteId);

  return { data: null, error };
}

// ============================================
// BACKTEST RESULTS
// Priority #4
// ============================================

/**
 * Get all backtest results
 */
export async function getBacktestResults(
  userId: string
): Promise<TradingResponse<BacktestResult[]>> {
  const { data, error } = await supabase
    .from("backtest_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get backtest result by ID
 */
export async function getBacktestById(
  backtestId: string
): Promise<TradingResponse<BacktestResult>> {
  const { data, error } = await supabase
    .from("backtest_results")
    .select("*")
    .eq("id", backtestId)
    .single();

  return { data, error };
}

/**
 * Get backtests for a strategy
 */
export async function getBacktestsByStrategy(
  strategyId: string
): Promise<TradingResponse<BacktestResult[]>> {
  const { data, error } = await supabase
    .from("backtest_results")
    .select("*")
    .eq("strategy_id", strategyId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Create a backtest result
 */
export async function createBacktestResult(
  result: CreateBacktestResult
): Promise<TradingResponse<BacktestResult>> {
  const { data, error } = await supabase
    .from("backtest_results")
    .insert(result)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a backtest result
 */
export async function updateBacktestResult(
  backtestId: string,
  updates: UpdateBacktestResult
): Promise<TradingResponse<BacktestResult>> {
  const { data, error } = await supabase
    .from("backtest_results")
    .update(updates)
    .eq("id", backtestId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a backtest result
 */
export async function deleteBacktestResult(
  backtestId: string
): Promise<TradingResponse<null>> {
  const { error } = await supabase
    .from("backtest_results")
    .delete()
    .eq("id", backtestId);

  return { data: null, error };
}

// ============================================
// TRADING SESSIONS (Timer Integration)
// ============================================

/**
 * Create a trading session
 */
export async function createTradingSession(
  session: CreateTradingSession
): Promise<TradingResponse<TradingSession>> {
  const { data, error } = await supabase
    .from("trading_sessions")
    .insert(session)
    .select()
    .single();

  return { data, error };
}

/**
 * End a trading session
 */
export async function endTradingSession(
  sessionId: string,
  endTime: string,
  duration: number
): Promise<TradingResponse<TradingSession>> {
  const { data, error } = await supabase
    .from("trading_sessions")
    .update({ end_time: endTime, duration })
    .eq("id", sessionId)
    .select()
    .single();

  return { data, error };
}

/**
 * Get sessions for a trade
 */
export async function getSessionsForTrade(
  tradeId: string
): Promise<TradingResponse<TradingSession[]>> {
  const { data, error } = await supabase
    .from("trading_sessions")
    .select("*")
    .eq("trade_id", tradeId)
    .order("start_time", { ascending: false });

  return { data, error };
}

// ============================================
// STATISTICS & ANALYTICS
// Priority #6 - Performance
// ============================================

/**
 * Calculate trading statistics for a user
 */
export async function calculateTradingStats(
  userId: string
): Promise<TradingResponse<TradingStats>> {
  try {
    const { data: trades, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId);

    if (error || !trades) {
      return { data: null, error };
    }

    const closedTrades = trades.filter(t => t.is_closed);
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.pnl || 0) <= 0);

    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalCommission = closedTrades.reduce((sum, t) => sum + (t.commission || 0) + (t.fees || 0), 0);
    
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
      : 0;
    
    const avgLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length
      : 0;

    const winRate = closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

    const expectancy = (avgWin * (winRate / 100)) + (avgLoss * ((100 - winRate) / 100));

    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

    // Calculate max drawdown (simplified)
    let peak = 0;
    let maxDrawdown = 0;
    let runningBalance = 0;
    
    closedTrades
      .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
      .forEach(trade => {
        runningBalance += trade.pnl || 0;
        if (runningBalance > peak) {
          peak = runningBalance;
        }
        const drawdown = peak - runningBalance;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      });

    const stats: TradingStats = {
      total_trades: trades.length,
      closed_trades: closedTrades.length,
      winning_trades: winningTrades.length,
      losing_trades: losingTrades.length,
      win_rate: Math.round(winRate * 100) / 100,
      total_pnl: Math.round(totalPnl * 100) / 100,
      avg_win: Math.round(avgWin * 100) / 100,
      avg_loss: Math.round(avgLoss * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
      profit_factor: Math.round(profitFactor * 100) / 100,
      max_drawdown: Math.round(maxDrawdown * 100) / 100,
      sharpe_ratio: null, // TODO: Implement Sharpe ratio
      best_trade: Math.max(...closedTrades.map(t => t.pnl || 0)),
      worst_trade: Math.min(...closedTrades.map(t => t.pnl || 0)),
      avg_trade_duration: 0, // TODO: Calculate
      total_commission: Math.round(totalCommission * 100) / 100,
      net_pnl: Math.round((totalPnl - totalCommission) * 100) / 100,
    };

    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get dashboard data (all-in-one)
 */
export async function getDashboardData(
  userId: string
): Promise<TradingResponse<TradingDashboard>> {
  try {
    const [statsResult, tradesResult, strategiesResult, rulesResult] = await Promise.all([
      calculateTradingStats(userId),
      getRecentTrades(userId, 5),
      getActiveStrategies(userId),
      getActiveRules(userId),
    ]);

    if (statsResult.error) throw statsResult.error;
    if (tradesResult.error) throw tradesResult.error;

    // Calculate rule adherence
    const rules = rulesResult.data || [];
    const totalRuleChecks = rules.reduce((sum, r) => sum + r.violation_count, 0);
    const avgAdherence = rules.length > 0
      ? rules.reduce((sum, r) => sum + r.adherence_rate, 0) / rules.length
      : 0;

    // TODO: Calculate equity curve from historical data
    const equityCurve: { date: string; balance: number }[] = [];

    // TODO: Calculate days active
    const daysActive = 0;

    const dashboard: TradingDashboard = {
      stats: statsResult.data!,
      recent_trades: tradesResult.data || [],
      active_strategies: strategiesResult.data || [],
      rule_adherence: {
        followed: 0, // TODO: Calculate from trades
        broken: totalRuleChecks,
        rate: Math.round(avgAdherence * 100) / 100,
      },
      equity_curve: equityCurve,
      days_active: daysActive,
    };

    return { data: dashboard, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Rules
  getTradingRules,
  getRulesByCategory,
  getActiveRules,
  createTradingRule,
  updateTradingRule,
  deleteTradingRule,
  toggleRuleStatus,

  // Strategies
  getStrategies,
  getActiveStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  compareStrategies,

  // Trades
  getTrades,
  getTradesPaginated,
  getRecentTrades,
  getTradeById,
  getTradesByDateRange,
  getTradesByStrategy,
  getOpenTrades,
  getClosedTrades,
  createTrade,
  updateTrade,
  closeTrade,
  deleteTrade,
  uploadTradeScreenshot,

  // Quick Notes
  getQuickNotes,
  getQuickNotesByDate,
  getQuickNotesByType,
  createQuickNote,
  updateQuickNote,
  deleteQuickNote,

  // Backtest
  getBacktestResults,
  getBacktestById,
  getBacktestsByStrategy,
  createBacktestResult,
  updateBacktestResult,
  deleteBacktestResult,

  // Sessions
  createTradingSession,
  endTradingSession,
  getSessionsForTrade,

  // Analytics
  calculateTradingStats,
  getDashboardData,
};