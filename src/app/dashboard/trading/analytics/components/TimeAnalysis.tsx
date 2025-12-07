// src/app/dashboard/trading/analytics/components/TimeAnalysis.tsx
"use client";

import { Clock, Calendar } from "lucide-react";

interface TimeAnalysisProps {
  dayPerformance: { day: string; winRate: number; avgPnl: number; trades: number }[];
  hourPerformance: { hour: string; winRate: number; avgPnl: number; trades: number }[];
  isDark: boolean;
}

// Indian currency formatter
function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000) {
    return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  
  return `${isNegative ? '-' : ''}₹${absAmount.toFixed(0)}`;
}

export default function TimeAnalysis({ dayPerformance, hourPerformance, isDark }: TimeAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Day Performance */}
      <div
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Performance by Day
          </h3>
        </div>

        {dayPerformance.length === 0 ? (
          <div className={`text-center py-6 sm:py-8 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p>No day data available</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {dayPerformance.map((day, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:scale-102 ${
                  isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm sm:text-base mb-1 truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    {day.day}
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {day.trades} trades
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Win Rate */}
                  <div className="text-center">
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        day.winRate >= 60
                          ? "text-emerald-600 dark:text-emerald-400"
                          : day.winRate >= 50
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {day.winRate}%
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      WR
                    </div>
                  </div>

                  {/* Avg P&L */}
                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
                        day.avgPnl >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatINR(day.avgPnl)}
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Avg
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hour Performance */}
      <div
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Performance by Hour
          </h3>
        </div>

        {hourPerformance.length === 0 ? (
          <div className={`text-center py-6 sm:py-8 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p>No hour data available</p>
            <p className="text-xs mt-1">Entry times not recorded</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-110 overflow-y-auto scrollbar-thin">
            {hourPerformance.map((hour, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:scale-102 ${
                  isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex-1">
                  <div className={`font-semibold text-sm sm:text-base mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {hour.hour}
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {hour.trades} trades
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Win Rate */}
                  <div className="text-center">
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        hour.winRate >= 60
                          ? "text-emerald-600 dark:text-emerald-400"
                          : hour.winRate >= 50
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {hour.winRate}%
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      WR
                    </div>
                  </div>

                  {/* Avg P&L */}
                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
                        hour.avgPnl >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatINR(hour.avgPnl)}
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Avg
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}