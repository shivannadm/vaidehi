// src/app/dashboard/trading/dashboard/components/TopStrategies.tsx
"use client";

import { Trophy, Target, TrendingUp } from "lucide-react";

interface TopStrategiesProps {
  data: { name: string; winRate: number; pnl: number }[];
  bestDays: { day: string; winRate: number; avgPnl: number }[];
  isDark: boolean;
}

export default function TopStrategies({ data, bestDays, isDark }: TopStrategiesProps) {
  // Currency formatter (INR)
  const formatCurrency = (n: number) => {
    const sign = n > 0 ? "+" : n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const formatted = abs.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${sign}₹${formatted}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Strategies */}
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy className={`w-5 h-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Top Strategies
          </h3>
        </div>

        {data.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No strategy data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((strategy, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${isDark ? "bg-slate-700/50" : "bg-slate-50"
                  }`}
              >
                {/* Rank Badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0
                    ? "bg-yellow-500 text-white"
                    : index === 1
                      ? "bg-slate-400 text-white"
                      : index === 2
                        ? "bg-orange-600 text-white"
                        : isDark
                          ? "bg-slate-600 text-slate-300"
                          : "bg-slate-200 text-slate-700"
                    }`}
                >
                  {index + 1}
                </div>

                {/* Strategy Info */}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold truncate mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {strategy.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className={` ${isDark ? "text-slate-400" : "text-slate-600"} w-4 h-4`} />
                      <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                        Win: {strategy.winRate}%
                      </span>
                    </div>

                    {/* INR Output */}
                    <div
                      className={`font-semibold ${strategy.pnl >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                        }`}
                    >
                      {formatCurrency(strategy.pnl)}
                    </div>
                  </div>
                </div>

                {/* Win Rate Progress */}
                <div className="flex-shrink-0 w-16">
                  <div
                    className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-600" : "bg-slate-200"
                      }`}
                  >
                    <div
                      className={`h-full transition-all duration-500 ${strategy.winRate >= 60
                        ? "bg-green-500"
                        : strategy.winRate >= 50
                          ? "bg-blue-500"
                          : "bg-orange-500"
                        }`}
                      style={{ width: `${Math.min(strategy.winRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Trading Days */}
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Best Trading Days
          </h3>
        </div>

        {bestDays.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No trading day data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bestDays.map((day, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105 ${isDark ? "bg-slate-700/50" : "bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {/* Day Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                      ? "bg-green-500 text-white"
                      : isDark
                        ? "bg-slate-600 text-slate-300"
                        : "bg-slate-200 text-slate-700"
                      }`}
                  >
                    {day.day.slice(0, 3)}
                  </div>

                  <div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {day.day}
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Win Rate: {day.winRate}%
                    </div>
                  </div>
                </div>

                {/* INR Output for Avg P&L */}
                <div
                  className={`text-right font-bold ${day.avgPnl >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                    }`}
                >
                  {formatCurrency(day.avgPnl)}
                  <div className="text-xs opacity-60">avg</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
