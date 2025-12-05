// src/app/dashboard/trading/dashboard/hooks/useDashboardData.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTrades,
  getStrategies,
  getQuickNotes,
  calculateTradingStats,
} from "@/lib/supabase/trading-helpers";
import type { TradeWithStrategy, Strategy, QuickNote, TradingStats } from "@/types/database";

export interface DashboardData {
  stats: TradingStats | null;
  trades: TradeWithStrategy[];
  strategies: Strategy[];
  recentNotes: QuickNote[];
  equityCurve: { date: string; balance: number }[];
  monthlyPnL: { month: string; pnl: number }[];
  calendarData: { date: string; pnl: number }[];
  strategyPerformance: { name: string; winRate: number; pnl: number }[];
  bestTradingDays: { day: string; winRate: number; avgPnl: number }[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(userId: string | null) {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    trades: [],
    strategies: [],
    recentNotes: [],
    equityCurve: [],
    monthlyPnL: [],
    calendarData: [],
    strategyPerformance: [],
    bestTradingDays: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel
      const [statsResult, tradesResult, strategiesResult, notesResult] = await Promise.all([
        calculateTradingStats(userId),
        getTrades(userId),
        getStrategies(userId),
        getQuickNotes(userId),
      ]);

      if (statsResult.error || tradesResult.error || strategiesResult.error || notesResult.error) {
        throw new Error("Failed to load dashboard data");
      }

      const trades = tradesResult.data || [];
      const strategies = strategiesResult.data || [];
      const notes = notesResult.data || [];
      const stats = statsResult.data;

      // Calculate Equity Curve
      const closedTrades = trades.filter((t) => t.is_closed).sort((a, b) => 
        new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
      );
      
      let runningBalance = 10000; // Starting balance
      const equityCurve = closedTrades.map((trade) => {
        runningBalance += trade.pnl || 0;
        return {
          date: trade.exit_date || trade.entry_date,
          balance: Math.round(runningBalance),
        };
      });

      // Calculate Monthly P&L
      const monthlyMap = new Map<string, number>();
      closedTrades.forEach((trade) => {
        const date = new Date(trade.entry_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + (trade.pnl || 0));
      });

      const monthlyPnL = Array.from(monthlyMap.entries())
        .map(([month, pnl]) => ({ month, pnl: Math.round(pnl) }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      // Calculate Calendar Data (last 90 days)
      const calendarMap = new Map<string, number>();
      const last90Days = closedTrades.filter((trade) => {
        const tradeDate = new Date(trade.entry_date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 90;
      });

      last90Days.forEach((trade) => {
        const dateKey = trade.entry_date;
        calendarMap.set(dateKey, (calendarMap.get(dateKey) || 0) + (trade.pnl || 0));
      });

      const calendarData = Array.from(calendarMap.entries()).map(([date, pnl]) => ({
        date,
        pnl: Math.round(pnl),
      }));

      // Strategy Performance
      const strategyPerformance = strategies
        .filter((s) => s.total_trades > 0)
        .map((s) => ({
          name: s.name,
          winRate: Math.round(s.win_rate),
          pnl: Math.round(s.total_pnl),
        }))
        .sort((a, b) => b.pnl - a.pnl)
        .slice(0, 5);

      // Best Trading Days
      const dayMap = new Map<string, { trades: number; wins: number; totalPnl: number }>();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      closedTrades.forEach((trade) => {
        const dayName = dayNames[new Date(trade.entry_date).getDay()];
        const current = dayMap.get(dayName) || { trades: 0, wins: 0, totalPnl: 0 };
        dayMap.set(dayName, {
          trades: current.trades + 1,
          wins: current.wins + ((trade.pnl || 0) > 0 ? 1 : 0),
          totalPnl: current.totalPnl + (trade.pnl || 0),
        });
      });

      const bestTradingDays = Array.from(dayMap.entries())
        .map(([day, data]) => ({
          day,
          winRate: data.trades > 0 ? Math.round((data.wins / data.trades) * 100) : 0,
          avgPnl: data.trades > 0 ? Math.round(data.totalPnl / data.trades) : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate);

      // Recent notes (last 5)
      const recentNotes = notes
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setData({
        stats,
        trades: trades.slice(0, 10), // Recent 10 trades
        strategies,
        recentNotes,
        equityCurve,
        monthlyPnL,
        calendarData,
        strategyPerformance,
        bestTradingDays,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Dashboard data error:", err);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load dashboard data",
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { ...data, refresh: fetchDashboardData };
}