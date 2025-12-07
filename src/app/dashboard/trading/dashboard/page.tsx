// src/app/dashboard/trading/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Loader2, RefreshCw, Camera } from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";
import { captureTradingScreenshot } from "@/lib/utils/tradingExportUtils";
import HeroStats from "./components/HeroStats";
import EquityCurve from "./components/EquityCurve";
import MonthlyPnLChart from "./components/MonthlyPnLChart";
import CalendarHeatmap from "./components/CalendarHeatmap";
import TopStrategies from "./components/TopStrategies";
import RecentActivity from "./components/RecentActivity";

export default function TradingDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [userName, setUserName] = useState<string>("Trader");

  const {
    stats,
    trades,
    recentNotes,
    equityCurve,
    monthlyPnL,
    calendarData,
    strategyPerformance,
    bestTradingDays,
    loading,
    error,
    refresh,
  } = useDashboardData(userId);

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

        // Get user profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name);
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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await captureTradingScreenshot("trading-analytics-dashboard", {
        username: userName,
        appName: "Trading Dashboard",
      });

      // Success notification (you can replace with toast)
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
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6" id="trading-analytics-dashboard">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              <LayoutDashboard className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Dashboard
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Overview of your trading performance
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
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
                } disabled:opacity-50`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Loading dashboard data...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-6 rounded-xl border ${isDark
              ? "bg-red-900/20 border-red-500/30 text-red-300"
              : "bg-red-50 border-red-200 text-red-700"
              }`}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && stats && (
          <>
            {/* Hero Stats */}
            <HeroStats stats={stats} isDark={isDark} />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EquityCurve data={equityCurve} isDark={isDark} />
              <MonthlyPnLChart data={monthlyPnL} isDark={isDark} />
            </div>

            {/* Calendar Heatmap - Full FY */}
            <CalendarHeatmap data={calendarData} isDark={isDark} />

            {/* Top Strategies & Best Days */}
            <TopStrategies
              data={strategyPerformance}
              bestDays={bestTradingDays}
              isDark={isDark}
            />

            {/* Recent Activity */}
            <RecentActivity trades={trades} notes={recentNotes} isDark={isDark} />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && !stats && (
          <div
            className={`text-center py-20 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}
          >
            <LayoutDashboard
              className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"
                }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              No Trading Data Yet
            </h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Start logging trades to see your dashboard
            </p>
            <a
              href="/dashboard/trading/journal"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Log Your First Trade
            </a>
          </div>
        )}
      </div>
    </div>
  );
}