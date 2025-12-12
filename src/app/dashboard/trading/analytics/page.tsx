// src/app/dashboard/trading/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Camera, Loader2, RefreshCw } from "lucide-react";
import { useAnalytics } from "./hooks/useAnalytics";
import { captureTradingScreenshot } from "@/lib/utils/tradingExportUtils";
import PerformanceMetrics from "./components/PerformanceMetrics";
import CumulativePnLChart from "./components/CumulativePnLChart";
import WinRateTrend from "./components/WinRateTrend";
import TradeDistribution from "./components/TradeDistribution";
import PnLHistogram from "./components/PnLHistogram";
import StrategyComparison from "./components/StrategyComparison";
import TimeAnalysis from "./components/TimeAnalysis";
import { getTrades } from "@/lib/supabase/trading-helpers";

// Helper function for Indian currency formatting
export function formatIndianCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const [intPart, decPart] = absAmount.toFixed(2).split('.');

  let formatted = '';
  let count = 0;

  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      formatted = ',' + formatted;
    }
    formatted = intPart[i] + formatted;
    count++;
  }

  return `${isNegative ? '-' : ''}₹${formatted}.${decPart}`;
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [userName, setUserName] = useState<string>("Trader");
  const [closedTrades, setClosedTrades] = useState<any[]>([]);

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
    tradeDistributionMetrics,
    strategyComparison,
    dayPerformance,
    hourPerformance,
    loading,
    error,
    refresh,
  } = useAnalytics(userId);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        // Get user profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name);
        }

        // Get closed trades for PnLHistogram
        const tradesResult = await getTrades(user.id);
        if (tradesResult.data) {
          const closed = tradesResult.data.filter(t => t.is_closed && t.pnl !== null);
          setClosedTrades(closed);
        }
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

    // Refresh closed trades too
    if (userId) {
      const tradesResult = await getTrades(userId);
      if (tradesResult.data) {
        const closed = tradesResult.data.filter(t => t.is_closed && t.pnl !== null);
        setClosedTrades(closed);
      }
    }

    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await captureTradingScreenshot("trading-analytics", {
        username: userName,
        appName: "Trading Analytics",
      });

      // Success notification
      alert("📸 Screenshot saved successfully!");
    } catch (error) {
      console.error("Screenshot error:", error);
      alert("❌ Failed to capture screenshot. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-50"
          }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div id="trading-analytics" className="space-y-6">
      <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1
                className={`text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3 ${isDark ? "text-white" : "text-slate-900"
                  }`}
              >
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
                Trading Analytics
              </h1>
              <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Advanced performance metrics and insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Screenshot Button */}
              <button
                onClick={handleCapture}
                disabled={isCapturing || loading}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCapturing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Screenshot</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className={`flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg font-medium transition text-sm sm:text-base ${isDark
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
                  } disabled:opacity-50`}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-600 mx-auto mb-3 sm:mb-4" />
                <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Calculating analytics...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div
              className={`p-4 sm:p-6 rounded-xl border text-sm sm:text-base ${isDark
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <CumulativePnLChart data={cumulativePnL} isDark={isDark} />
                <WinRateTrend data={winRateTrend} isDark={isDark} />
              </div>

              {/* Charts Row 2 - Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <TradeDistribution
                  data={tradeDistribution}
                  metrics={tradeDistributionMetrics}
                  isDark={isDark}
                />
                <PnLHistogram closedTrades={closedTrades} isDark={isDark} />
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
              className={`text-center py-12 sm:py-20 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}
            >
              <BarChart3
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${isDark ? "text-slate-600" : "text-slate-300"
                  }`}
              />
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"
                  }`}
              >
                No Trading Data Yet
              </h3>
              <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Close some trades to see your analytics
              </p>
              <a
                href="/dashboard/trading/journal"
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Go to Journal
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}