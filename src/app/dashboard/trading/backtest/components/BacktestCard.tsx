// src/app/dashboard/trading/backtest/components/BacktestCard.tsx
"use client";

import { useState } from "react";
import { Trash2, TrendingUp, TrendingDown, Target, BarChart3, Calendar } from "lucide-react";
import type { BacktestResult } from "@/types/database";

interface BacktestCardProps {
  backtest: BacktestResult;
  onDelete: (backtestId: string) => void;
  onView: (backtest: BacktestResult) => void;
  isDark: boolean;
}

export default function BacktestCard({ backtest, onDelete, onView, isDark }: BacktestCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete backtest "${backtest.strategy_name}"?`)) return;

    setIsDeleting(true);
    await onDelete(backtest.id);
    setIsDeleting(false);
  };

  const profit = backtest.final_capital - backtest.initial_capital;
  const profitPercentage = ((profit / backtest.initial_capital) * 100).toFixed(2);
  const isProfit = profit >= 0;

  return (
    <div
      onClick={() => onView(backtest)}
      className={`rounded-xl border p-4 sm:p-5 transition-all cursor-pointer ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-bold truncate mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            {backtest.strategy_name}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              {backtest.date_range_start} → {backtest.date_range_end}
            </span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-2 rounded-lg transition ${
            isDark
              ? "hover:bg-red-900/30 text-red-400"
              : "hover:bg-red-50 text-red-600"
          } disabled:opacity-50`}
          title="Delete backtest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Profit Display */}
      <div
        className={`p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 ${
          isProfit
            ? isDark
              ? "bg-green-900/20 border border-green-500/30"
              : "bg-green-50 border border-green-200"
            : isDark
            ? "bg-red-900/20 border border-red-500/30"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}>
              Return
            </span>
          </div>
          <div className="text-right">
            <div className={`text-lg sm:text-xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
              {isProfit ? "+" : ""}${profit.toFixed(0)}
            </div>
            <div className={`text-xs sm:text-sm ${isProfit ? "text-green-500" : "text-red-500"}`}>
              {isProfit ? "+" : ""}{profitPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {/* Win Rate */}
        <div className={`rounded-lg p-2 sm:p-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <Target className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Win Rate
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-bold ${backtest.win_rate >= 60 ? "text-green-500" : "text-orange-500"}`}>
            {backtest.win_rate.toFixed(1)}%
          </div>
        </div>

        {/* Total Trades */}
        <div className={`rounded-lg p-2 sm:p-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <BarChart3 className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Trades
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {backtest.total_trades}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
        <div className="flex justify-between">
          <span className={isDark ? "text-slate-400" : "text-slate-600"}>Winning:</span>
          <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
            {backtest.winning_trades}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? "text-slate-400" : "text-slate-600"}>Losing:</span>
          <span className={`font-semibold ${isDark ? "text-red-400" : "text-red-600"}`}>
            {backtest.losing_trades}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? "text-slate-400" : "text-slate-600"}>Profit Factor:</span>
          <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            {backtest.profit_factor.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? "text-slate-400" : "text-slate-600"}>Max DD:</span>
          <span className={`font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}>
            {backtest.max_drawdown.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}