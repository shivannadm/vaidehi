// src/app/dashboard/trading/reports/hooks/useAnalytics.ts
"use client";

import { useState, useCallback } from 'react';
import type { ComprehensiveAnalytics, ImportStatus } from '../types/analytics.types';

export function useAnalytics(userId: string | null) {
  const [data, setData] = useState<ComprehensiveAnalytics | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const analyzeFromLink = useCallback(async (zerodhaLink: string) => {
    if (!userId) {
      setImportStatus({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Validate link
    const zerodhaLinkRegex = /console\.zerodha\.com\/verified\/([a-zA-Z0-9]+)/;
    const match = zerodhaLink.match(zerodhaLinkRegex);

    if (!match) {
      setImportStatus({
        status: 'error',
        message: 'Invalid Zerodha Console link format',
      });
      return;
    }

    const verificationId = match[1];

    try {
      setLoading(true);
      setImportStatus({
        status: 'analyzing',
        message: 'Fetching your trading data...',
        progress: 20,
      });

      // Call API route
      const response = await fetch('/api/trading/import-zerodha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          verificationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from Zerodha');
      }

      setImportStatus({
        status: 'analyzing',
        message: 'Calculating advanced metrics...',
        progress: 60,
      });

      const result = await response.json();

      setImportStatus({
        status: 'analyzing',
        message: 'Generating visualizations...',
        progress: 80,
      });

      // Calculate comprehensive analytics
      const analytics = await calculateComprehensiveAnalytics(result.trades);

      setData(analytics);
      setImportStatus({
        status: 'success',
        message: `✓ Analysis complete! ${analytics.meta.tradesImported} trades analyzed.`,
        progress: 100,
      });

    } catch (error: any) {
      console.error('Analytics error:', error);
      setImportStatus({
        status: 'error',
        message: error.message || 'Failed to analyze trading data',
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const clearAnalytics = useCallback(() => {
    setData(null);
    setImportStatus({
      status: 'idle',
      message: '',
    });
  }, []);

  return {
    data,
    importStatus,
    loading,
    analyzeFromLink,
    clearAnalytics,
  };
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

async function calculateComprehensiveAnalytics(trades: any[]): Promise<ComprehensiveAnalytics> {
  // This would normally call your trading-helpers or analytics functions
  // For now, return mock data structure
  
  return {
    performance: {
      totalPnL: 53180,
      netPnL: 51130,
      winRate: 62.68,
      winningTrades: 89,
      losingTrades: 53,
      profitFactor: 3.36,
      expectancy: 304,
      avgPnL: 360,
    },
    risk: {
      sharpeRatio: 1.85,
      sortinoRatio: 2.34,
      calmarRatio: 4.31,
      recoveryFactor: 4.31,
      omegaRatio: 1.92,
    },
    drawdown: {
      maxDrawdown: -12340,
      maxDrawdownPercent: 15.2,
      currentDrawdown: -2450,
      maxDrawdownDuration: 18,
      avgDrawdown: -3200,
      drawdownRecoveryTime: 12,
    },
    winLoss: {
      avgWin: 850,
      avgLoss: -420,
      largestWin: 4200,
      largestLoss: -2100,
      payoffRatio: 2.02,
      kellyCriterion: 38.5,
      winLossRatio: 1.68,
    },
    streaks: {
      longestWinStreak: 9,
      longestLossStreak: 5,
      currentStreak: {
        type: 'win',
        count: 3,
      },
      avgWinStreak: 3.4,
      avgLossStreak: 2.1,
    },
    extremes: {
      bestTrade: 4200,
      worstTrade: -2100,
      bestTradePercent: 8.5,
      worstTradePercent: -4.2,
      bestDay: 6700,
      worstDay: -3200,
      bestWeek: 12500,
      worstWeek: -4800,
    },
    duration: {
      avgDuration: 3.5,
      longestTrade: 45,
      shortestTrade: 0,
      intradayPercent: 42,
      swingPercent: 35,
      positionPercent: 23,
    },
    timeAnalysis: {
      hourlyPerformance: generateHourlyData(),
      dailyPerformance: generateDailyData(),
      monthlyPerformance: generateMonthlyData(),
      bestTradingHour: 10,
      worstTradingHour: 15,
      bestTradingDay: 'Monday',
      worstTradingDay: 'Friday',
    },
    strategies: [
      {
        strategyId: '1',
        strategyName: 'Breakout Master',
        totalTrades: 45,
        winRate: 68.9,
        totalPnL: 18500,
        avgPnL: 411,
        profitFactor: 4.2,
      },
      {
        strategyId: '2',
        strategyName: 'Mean Reversion',
        totalTrades: 38,
        winRate: 57.9,
        totalPnL: 12300,
        avgPnL: 324,
        profitFactor: 2.8,
      },
    ],
    distribution: {
      winSizeDistribution: [
        { range: '$0-500', count: 35 },
        { range: '$500-1000', count: 28 },
        { range: '$1000-2000', count: 18 },
        { range: '$2000+', count: 8 },
      ],
      lossSizeDistribution: [
        { range: '$0-300', count: 28 },
        { range: '$300-600', count: 15 },
        { range: '$600-1000', count: 7 },
        { range: '$1000+', count: 3 },
      ],
      pnlHistogram: generatePnLHistogram(),
    },
    meta: {
      totalTrades: 156,
      openTrades: 14,
      closedTrades: 142,
      dateRange: 'Jan 2024 - Dec 2024',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tradesImported: 156,
      commission: 2050,
      fees: 430,
      tradingDays: 245,
    },
    equityCurve: generateEquityCurve(),
    cumulativePnL: generateCumulativePnL(),
  };
}

function generateHourlyData() {
  return Array.from({ length: 8 }, (_, i) => ({
    hour: i + 9,
    avgPnL: Math.round((Math.random() - 0.3) * 500),
    trades: Math.floor(Math.random() * 15) + 5,
  }));
}

function generateDailyData() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days.map(day => ({
    day,
    avgPnL: Math.round((Math.random() - 0.3) * 800),
    trades: Math.floor(Math.random() * 25) + 10,
  }));
}

function generateMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    totalPnL: Math.round((Math.random() - 0.2) * 5000),
    trades: Math.floor(Math.random() * 20) + 5,
  }));
}

function generatePnLHistogram() {
  const ranges = [
    '$-2000 to -1000',
    '$-1000 to -500',
    '$-500 to 0',
    '$0 to 500',
    '$500 to 1000',
    '$1000 to 2000',
    '$2000+',
  ];
  
  const counts = [3, 8, 42, 35, 28, 18, 8];
  const total = counts.reduce((a, b) => a + b, 0);
  
  return ranges.map((range, i) => ({
    range,
    count: counts[i],
    percentage: parseFloat(((counts[i] / total) * 100).toFixed(1)),
  }));
}

function generateEquityCurve() {
  let balance = 10000;
  return Array.from({ length: 100 }, (_, i) => {
    balance += (Math.random() - 0.45) * 500;
    const peak = Math.max(...Array.from({ length: i + 1 }, (_, j) => j).map(() => balance));
    const drawdown = balance - peak;
    return {
      date: `Day ${i + 1}`,
      balance: Math.round(balance),
      drawdown: Math.round(drawdown),
    };
  });
}

function generateCumulativePnL() {
  let pnl = 0;
  return Array.from({ length: 100 }, (_, i) => {
    pnl += (Math.random() - 0.45) * 500;
    return {
      date: `Day ${i + 1}`,
      pnl: Math.round(pnl),
    };
  });
}