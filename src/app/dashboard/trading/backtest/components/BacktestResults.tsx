"use client";

import { X, TrendingUp, TrendingDown, Target, BarChart3, DollarSign, BadgeIndianRupee } from "lucide-react";
import type { BacktestResult } from "@/types/database";

interface BacktestResultsProps {
  isOpen: boolean;
  onClose: () => void;
  backtest: BacktestResult | null;
  isDark: boolean;
}

export default function BacktestResults({ isOpen, onClose, backtest, isDark }: BacktestResultsProps) {
  if (!isOpen || !backtest) return null;

  const profit = backtest.final_capital - backtest.initial_capital;
  const profitPercentage = ((profit / backtest.initial_capital) * 100).toFixed(2);
  const isProfit = profit >= 0;

  // helper to format currency as +₹1,234.56 or -₹1,234.56
  const formatCurrency = (n: number) => {
    const sign = n > 0 ? "+" : n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const formatted = abs.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign}₹${formatted}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${isDark ? "border-slate-700" : "border-slate-200"
            }`}
        >
          <div>
            <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {backtest.strategy_name}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {backtest.date_range_start} → {backtest.date_range_end}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
              }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Profit Summary */}
          <div
            className={`p-4 sm:p-6 rounded-xl ${isProfit
              ? isDark
                ? "bg-green-900/20 border-2 border-green-500/30"
                : "bg-green-50 border-2 border-green-200"
              : isDark
                ? "bg-red-900/20 border-2 border-red-500/30"
                : "bg-red-50 border-2 border-red-200"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isProfit ? (
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                )}
                <div>
                  <div className={`text-xs sm:text-sm font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}>
                    Total Return
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(profit)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>ROI</div>
                <div className={`text-xl sm:text-2xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                  {isProfit ? "+" : ""}
                  {profitPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Capital Details */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Capital Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BadgeIndianRupee className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Initial Capital</span>
                </div>
                <div className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatCurrency(backtest.initial_capital)}
                </div>
              </div>

              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BadgeIndianRupee className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Final Capital</span>
                </div>
                <div className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatCurrency(backtest.final_capital)}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricBox
                icon={<Target className="w-4 h-4" />}
                label="Win Rate"
                value={`${backtest.win_rate.toFixed(1)}%`}
                color={backtest.win_rate >= 60 ? "green" : "orange"}
                isDark={isDark}
              />
              <MetricBox
                icon={<BarChart3 className="w-4 h-4" />}
                label="Total Trades"
                value={backtest.total_trades.toString()}
                isDark={isDark}
              />
              <MetricBox
                icon={<TrendingUp className="w-4 h-4" />}
                label="Winning"
                value={backtest.winning_trades.toString()}
                color="green"
                isDark={isDark}
              />
              <MetricBox
                icon={<TrendingDown className="w-4 h-4" />}
                label="Losing"
                value={backtest.losing_trades.toString()}
                color="red"
                isDark={isDark}
              />
              <MetricBox
                icon={<Target className="w-4 h-4" />}
                label="Profit Factor"
                value={backtest.profit_factor.toFixed(2)}
                color={backtest.profit_factor > 1 ? "green" : "red"}
                isDark={isDark}
              />
              {/* removed Max Drawdown as requested (unreliable calculation) */}
              <MetricBox
                icon={<DollarSign className="w-4 h-4" />}
                label="Expectancy"
                value={formatCurrency(backtest.expectancy)}
                color={backtest.expectancy > 0 ? "green" : "red"}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Notes */}
          {backtest.notes && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Notes</h3>
              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {backtest.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-6 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function MetricBox({ icon, label, value, color, isDark }: any) {
  const colors = {
    green: isDark
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-green-50 text-green-600 border-green-200",
    red: isDark
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-red-50 text-red-600 border-red-200",
    orange: isDark
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${color ? colors[color as keyof typeof colors] : isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
        }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{label}</div>
      </div>
      <div className={`text-base sm:text-lg font-bold ${color ? "" : isDark ? "text-white" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}
