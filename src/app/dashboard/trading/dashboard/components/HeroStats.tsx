// src/app/dashboard/trading/dashboard/components/HeroStats.tsx
"use client";

import { TrendingUp, TrendingDown, Target, BarChart3, Award } from "lucide-react";
import type { TradingStats } from "@/types/database";

interface HeroStatsProps {
  stats: TradingStats | null;
  isDark: boolean;
}

export default function HeroStats({ stats, isDark }: HeroStatsProps) {
  if (!stats) return null;

  const isProfit = stats.total_pnl >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total P&L - CORRECT: +₹ or -₹ */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 ${
          isProfit
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
            : "bg-gradient-to-br from-red-500 to-red-600"
        } shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          {isProfit ? (
            <TrendingUp className="w-full h-full" />
          ) : (
            <TrendingDown className="w-full h-full" />
          )}
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-white" />
            ) : (
              <TrendingDown className="w-5 h-5 text-white" />
            )}
            <span className="text-sm font-medium text-white/90">Total P&L</span>
          </div>
          
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">
            {isProfit ? "+" : "-"}₹
            {Math.abs(stats.total_pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          
          <div className="text-sm text-white/80">
            Net: {stats.net_pnl >= 0 ? "+" : "-"}₹
            {Math.abs(stats.net_pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Win Rate */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Win Rate
              </span>
            </div>
          </div>
          
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className={isDark ? "text-slate-700" : "text-slate-200"}
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(stats.win_rate / 100) * 175.93} 175.93`}
                className={
                  stats.win_rate >= 60
                    ? "text-green-500"
                    : stats.win_rate >= 50
                    ? "text-blue-500"
                    : "text-orange-500"
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {stats.win_rate.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
          {stats.winning_trades}W / {stats.losing_trades}L
        </div>
        
        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          From {stats.closed_trades} trades
        </div>
      </div>

      {/* Total Trades */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Total Trades
          </span>
        </div>

        <div className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          {stats.total_trades}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>Open: </span>
            <span className={`font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}>
              {stats.total_trades - stats.closed_trades}
            </span>
          </div>
          <div>
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>Closed: </span>
            <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
              {stats.closed_trades}
            </span>
          </div>
        </div>
      </div>

      {/* Performance - CORRECT: +₹ or -₹ */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Performance
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Expectancy
            </div>
            <div className={`text-xl font-bold ${
              stats.expectancy >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {stats.expectancy >= 0 ? "+" : "-"}₹{Math.abs(stats.expectancy).toFixed(2)}
            </div>
          </div>

          <div>
            <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Profit Factor
            </div>
            <div className={`text-xl font-bold ${
              stats.profit_factor >= 2
                ? "text-emerald-600 dark:text-emerald-400"
                : stats.profit_factor >= 1
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {stats.profit_factor.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}