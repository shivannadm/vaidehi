// src/app/dashboard/trading/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import { useAnalytics } from "./hooks/useAnalytics";
import PerformanceMetrics from "./components/PerformanceMetrics";
import CumulativePnLChart from "./components/CumulativePnLChart";
import WinRateTrend from "./components/WinRateTrend";
import TradeDistribution from "./components/TradeDistribution";
import PnLHistogram from "./components/PnLHistogram";
import StrategyComparison from "./components/StrategyComparison";
import TimeAnalysis from "./components/TimeAnalysis";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    avgWin,
    avgLoss,
    winLossRatio,
    maxConsecutiveWins,
    maxConsecutiveLosses,
    maxDrawdown,
    recoveryFactor,
    largestWin,
    largestLoss,
    avgRiskPerTrade,
    cumulativePnL,
    winRateTrend,
    tradeDistribution,
    pnlHistogram,
    strategyComparison,
    dayPerformance,
    hourPerformance,
    loading,
    error,
    refresh,
  } = useAnalytics(userId);

  // Auth and theme setup
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        window.location.href = "/login";
      }
    };

    init();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Analytics
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Advanced performance metrics and insights
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
              isDark
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
            } disabled:opacity-50`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Calculating analytics...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Analytics Content */}
        {!loading && !error && (
          <>
            {/* Performance Metrics Grid */}
            <PerformanceMetrics
              avgWin={avgWin}
              avgLoss={avgLoss}
              winLossRatio={winLossRatio}
              maxConsecutiveWins={maxConsecutiveWins}
              maxConsecutiveLosses={maxConsecutiveLosses}
              maxDrawdown={maxDrawdown}
              recoveryFactor={recoveryFactor}
              largestWin={largestWin}
              largestLoss={largestLoss}
              avgRiskPerTrade={avgRiskPerTrade}
              isDark={isDark}
            />

            {/* Charts Row 1 - P&L Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CumulativePnLChart data={cumulativePnL} isDark={isDark} />
              <WinRateTrend data={winRateTrend} isDark={isDark} />
            </div>

            {/* Charts Row 2 - Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradeDistribution data={tradeDistribution} isDark={isDark} />
              <PnLHistogram data={pnlHistogram} isDark={isDark} />
            </div>

            {/* Strategy Comparison Table */}
            <StrategyComparison data={strategyComparison} isDark={isDark} />

            {/* Time Analysis */}
            <TimeAnalysis
              dayPerformance={dayPerformance}
              hourPerformance={hourPerformance}
              isDark={isDark}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && cumulativePnL.length === 0 && (
          <div
            className={`text-center py-20 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <BarChart3
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              No Trading Data Yet
            </h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Close some trades to see your analytics
            </p>
            <a
              href="/dashboard/trading/journal"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Go to Journal
            </a>
          </div>
        )}
      </div>
    </div>
  );
}