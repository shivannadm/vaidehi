// src/app/dashboard/trading/analytics/components/StrategyComparison.tsx
"use client";

import { Target, TrendingUp, BarChart3, Award } from "lucide-react";

interface StrategyComparisonProps {
  data: {
    name: string;
    trades: number;
    winRate: number;
    totalPnl: number;
    avgPnl: number;
    profitFactor: number;
  }[];
  isDark: boolean;
}

export default function StrategyComparison({ data, isDark }: StrategyComparisonProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Strategy Comparison
          </h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No strategy data available</p>
          <p className="text-xs mt-2">Link trades to strategies to see comparison</p>
        </div>
      </div>
    );
  }

  // local currency formatter (INR) — +₹1,234.56 or -₹1,234.56
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
      className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Target className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Strategy Comparison
        </h3>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {data.map((strategy, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                {strategy.name}
              </h4>
              <div
                className={`text-lg font-bold ${strategy.totalPnl >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
                  }`}
              >
                {formatCurrency(strategy.totalPnl)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Trades:
                </span>
                <span className={`ml-2 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {strategy.trades}
                </span>
              </div>
              <div>
                <span className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Win Rate:
                </span>
                <span className={`ml-2 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {strategy.winRate}%
                </span>
              </div>
              <div>
                <span className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Avg P&L:
                </span>
                <span className={`ml-2 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatCurrency(strategy.avgPnl)}
                </span>
              </div>
              <div>
                <span className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  PF:
                </span>
                <span className={`ml-2 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {strategy.profitFactor}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${isDark ? "border-slate-700" : "border-slate-200"
                }`}
            >
              <th
                className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Strategy
              </th>
              <th
                className={`text-center py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Trades
                </div>
              </th>
              <th
                className={`text-center py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  Win Rate
                </div>
              </th>
              <th
                className={`text-right py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Total P&L
                </div>
              </th>
              <th
                className={`text-center py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Avg P&L
              </th>
              <th
                className={`text-center py-3 px-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  Profit Factor
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((strategy, index) => (
              <tr
                key={index}
                className={`border-b transition-colors ${isDark
                  ? "border-slate-700 hover:bg-slate-700/30"
                  : "border-slate-100 hover:bg-slate-50"
                  }`}
              >
                <td
                  className={`py-3 px-4 font-semibold ${isDark ? "text-white" : "text-slate-900"
                    }`}
                >
                  {strategy.name}
                </td>
                <td
                  className={`py-3 px-4 text-center ${isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                >
                  {strategy.trades}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${strategy.winRate >= 60
                      ? "bg-green-500/20 text-green-500"
                      : strategy.winRate >= 50
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-orange-500/20 text-orange-500"
                      }`}
                  >
                    {strategy.winRate}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`font-bold ${strategy.totalPnl >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {formatCurrency(strategy.totalPnl)}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-center ${isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                >
                  {formatCurrency(strategy.avgPnl)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-semibold ${strategy.profitFactor >= 2
                      ? "text-emerald-600 dark:text-emerald-400"
                      : strategy.profitFactor >= 1
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-orange-600 dark:text-orange-400"
                      }`}
                  >
                    {strategy.profitFactor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
