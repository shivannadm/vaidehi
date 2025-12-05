// src/app/dashboard/trading/analytics/hooks/useAnalytics.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getTrades, getStrategies, calculateTradingStats } from "@/lib/supabase/trading-helpers";
import type { TradeWithStrategy, Strategy, TradingStats } from "@/types/database";

export interface AnalyticsData {
  // Core Stats
  stats: TradingStats | null;
  
  // Performance Metrics
  avgWin: number;
  avgLoss: number;
  winLossRatio: number;
  maxConsecutiveLosses: number;
  maxConsecutiveWins: number;
  maxDrawdown: number;
  recoveryFactor: number;
  
  // Charts Data
  cumulativePnL: { date: string; pnl: number; cumulative: number }[];
  winRateTrend: { month: string; winRate: number }[];
  tradeDistribution: { name: string; value: number; color: string }[];
  pnlHistogram: { range: string; count: number }[];
  
  // Strategy Analytics
  strategyComparison: {
    name: string;
    trades: number;
    winRate: number;
    totalPnl: number;
    avgPnl: number;
    profitFactor: number;
  }[];
  
  // Time Analysis
  dayPerformance: { day: string; winRate: number; avgPnl: number; trades: number }[];
  hourPerformance: { hour: string; winRate: number; avgPnl: number; trades: number }[];
  
  // Risk Metrics
  avgRiskPerTrade: number;
  largestWin: number;
  largestLoss: number;
  
  loading: boolean;
  error: string | null;
}

export function useAnalytics(userId: string | null) {
  const [data, setData] = useState<AnalyticsData>({
    stats: null,
    avgWin: 0,
    avgLoss: 0,
    winLossRatio: 0,
    maxConsecutiveLosses: 0,
    maxConsecutiveWins: 0,
    maxDrawdown: 0,
    recoveryFactor: 0,
    cumulativePnL: [],
    winRateTrend: [],
    tradeDistribution: [],
    pnlHistogram: [],
    strategyComparison: [],
    dayPerformance: [],
    hourPerformance: [],
    avgRiskPerTrade: 0,
    largestWin: 0,
    largestLoss: 0,
    loading: true,
    error: null,
  });

  const fetchAnalytics = useCallback(async () => {
    if (!userId) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const [statsResult, tradesResult, strategiesResult] = await Promise.all([
        calculateTradingStats(userId),
        getTrades(userId),
        getStrategies(userId),
      ]);

      if (statsResult.error || tradesResult.error || strategiesResult.error) {
        throw new Error("Failed to load analytics data");
      }

      const stats = statsResult.data;
      const allTrades = tradesResult.data || [];
      const strategies = strategiesResult.data || [];
      const closedTrades = allTrades.filter((t) => t.is_closed && t.pnl !== null);

      // Calculate Performance Metrics
      const wins = closedTrades.filter((t) => (t.pnl || 0) > 0);
      const losses = closedTrades.filter((t) => (t.pnl || 0) <= 0);
      
      const avgWin = wins.length > 0 
        ? wins.reduce((sum, t) => sum + (t.pnl || 0), 0) / wins.length 
        : 0;
      
      const avgLoss = losses.length > 0
        ? Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0) / losses.length)
        : 0;
      
      const winLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

      // Calculate Consecutive Streaks
      let currentStreak = 0;
      let maxWinStreak = 0;
      let maxLossStreak = 0;
      let currentType: 'win' | 'loss' | null = null;

      closedTrades.forEach((trade) => {
        const isWin = (trade.pnl || 0) > 0;
        
        if (currentType === null) {
          currentType = isWin ? 'win' : 'loss';
          currentStreak = 1;
        } else if ((currentType === 'win' && isWin) || (currentType === 'loss' && !isWin)) {
          currentStreak++;
        } else {
          if (currentType === 'win') maxWinStreak = Math.max(maxWinStreak, currentStreak);
          if (currentType === 'loss') maxLossStreak = Math.max(maxLossStreak, currentStreak);
          currentType = isWin ? 'win' : 'loss';
          currentStreak = 1;
        }
      });

      if (currentType === 'win') maxWinStreak = Math.max(maxWinStreak, currentStreak);
      if (currentType === 'loss') maxLossStreak = Math.max(maxLossStreak, currentStreak);

      // Calculate Max Drawdown
      let peak = 0;
      let maxDrawdown = 0;
      let runningBalance = 0;

      closedTrades
        .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
        .forEach((trade) => {
          runningBalance += trade.pnl || 0;
          if (runningBalance > peak) peak = runningBalance;
          const drawdown = peak - runningBalance;
          if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

      const recoveryFactor = maxDrawdown > 0 ? Math.abs((stats?.total_pnl || 0) / maxDrawdown) : 0;

      // Cumulative P&L Chart
      let cumulative = 0;
      const cumulativePnL = closedTrades
        .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
        .map((trade) => {
          cumulative += trade.pnl || 0;
          return {
            date: trade.entry_date,
            pnl: Math.round(trade.pnl || 0),
            cumulative: Math.round(cumulative),
          };
        });

      // Win Rate Trend (by month)
      const monthlyMap = new Map<string, { wins: number; total: number }>();
      closedTrades.forEach((trade) => {
        const date = new Date(trade.entry_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthlyMap.get(monthKey) || { wins: 0, total: 0 };
        monthlyMap.set(monthKey, {
          wins: current.wins + ((trade.pnl || 0) > 0 ? 1 : 0),
          total: current.total + 1,
        });
      });

      const winRateTrend = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({
          month,
          winRate: Math.round((data.wins / data.total) * 100),
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

      // Trade Distribution (Pie Chart)
      const breakEven = closedTrades.filter((t) => (t.pnl || 0) === 0).length;
      const tradeDistribution = [
        { name: 'Wins', value: wins.length, color: '#10b981' },
        { name: 'Losses', value: losses.length, color: '#ef4444' },
        ...(breakEven > 0 ? [{ name: 'Break-even', value: breakEven, color: '#6b7280' }] : []),
      ];

      // P&L Histogram
      const pnlRanges = [
        { range: '<-$500', min: -Infinity, max: -500 },
        { range: '-$500 to -$200', min: -500, max: -200 },
        { range: '-$200 to $0', min: -200, max: 0 },
        { range: '$0 to $200', min: 0, max: 200 },
        { range: '$200 to $500', min: 200, max: 500 },
        { range: '>$500', min: 500, max: Infinity },
      ];

      const pnlHistogram = pnlRanges.map((range) => ({
        range: range.range,
        count: closedTrades.filter((t) => {
          const pnl = t.pnl || 0;
          return pnl > range.min && pnl <= range.max;
        }).length,
      }));

      // Strategy Comparison
      const strategyComparison = strategies
        .filter((s) => s.total_trades > 0)
        .map((s) => {
          const stratTrades = closedTrades.filter((t) => t.strategy_id === s.id);
          const stratWins = stratTrades.filter((t) => (t.pnl || 0) > 0);
          const stratLosses = stratTrades.filter((t) => (t.pnl || 0) < 0);
          const totalWins = stratWins.reduce((sum, t) => sum + (t.pnl || 0), 0);
          const totalLosses = Math.abs(stratLosses.reduce((sum, t) => sum + (t.pnl || 0), 0));

          return {
            name: s.name,
            trades: s.total_trades,
            winRate: Math.round(s.win_rate),
            totalPnl: Math.round(s.total_pnl),
            avgPnl: Math.round(s.avg_pnl),
            profitFactor: totalLosses > 0 ? Math.round((totalWins / totalLosses) * 100) / 100 : 0,
          };
        })
        .sort((a, b) => b.totalPnl - a.totalPnl);

      // Day Performance
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayMap = new Map<string, { wins: number; total: number; totalPnl: number }>();

      closedTrades.forEach((trade) => {
        const dayName = dayNames[new Date(trade.entry_date).getDay()];
        const current = dayMap.get(dayName) || { wins: 0, total: 0, totalPnl: 0 };
        dayMap.set(dayName, {
          wins: current.wins + ((trade.pnl || 0) > 0 ? 1 : 0),
          total: current.total + 1,
          totalPnl: current.totalPnl + (trade.pnl || 0),
        });
      });

      const dayPerformance = Array.from(dayMap.entries()).map(([day, data]) => ({
        day,
        winRate: Math.round((data.wins / data.total) * 100),
        avgPnl: Math.round(data.totalPnl / data.total),
        trades: data.total,
      }));

      // Hour Performance (if entry_time available)
      const hourMap = new Map<number, { wins: number; total: number; totalPnl: number }>();
      closedTrades.forEach((trade) => {
        if (trade.entry_time) {
          const hour = parseInt(trade.entry_time.split(':')[0]);
          const current = hourMap.get(hour) || { wins: 0, total: 0, totalPnl: 0 };
          hourMap.set(hour, {
            wins: current.wins + ((trade.pnl || 0) > 0 ? 1 : 0),
            total: current.total + 1,
            totalPnl: current.totalPnl + (trade.pnl || 0),
          });
        }
      });

      const hourPerformance = Array.from(hourMap.entries())
        .map(([hour, data]) => ({
          hour: `${hour}:00`,
          winRate: Math.round((data.wins / data.total) * 100),
          avgPnl: Math.round(data.totalPnl / data.total),
          trades: data.total,
        }))
        .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

      // Risk Metrics
      const avgRiskPerTrade = closedTrades.length > 0
        ? closedTrades.reduce((sum, t) => {
            if (t.stop_loss && t.entry_price) {
              const risk = Math.abs(t.entry_price - t.stop_loss) * t.quantity;
              return sum + risk;
            }
            return sum;
          }, 0) / closedTrades.length
        : 0;

      const largestWin = Math.max(...closedTrades.map((t) => t.pnl || 0), 0);
      const largestLoss = Math.min(...closedTrades.map((t) => t.pnl || 0), 0);

      setData({
        stats,
        avgWin: Math.round(avgWin),
        avgLoss: Math.round(avgLoss),
        winLossRatio: Math.round(winLossRatio * 100) / 100,
        maxConsecutiveLosses: maxLossStreak,
        maxConsecutiveWins: maxWinStreak,
        maxDrawdown: Math.round(maxDrawdown),
        recoveryFactor: Math.round(recoveryFactor * 100) / 100,
        cumulativePnL,
        winRateTrend,
        tradeDistribution,
        pnlHistogram,
        strategyComparison,
        dayPerformance,
        hourPerformance,
        avgRiskPerTrade: Math.round(avgRiskPerTrade),
        largestWin: Math.round(largestWin),
        largestLoss: Math.round(largestLoss),
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Analytics error:", err);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load analytics data",
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { ...data, refresh: fetchAnalytics };
}