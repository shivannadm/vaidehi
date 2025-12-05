// src/app/dashboard/trading/analytics/components/TimeAnalysis.tsx
"use client";

import { Clock, Calendar } from "lucide-react";

interface TimeAnalysisProps {
  dayPerformance: { day: string; winRate: number; avgPnl: number; trades: number }[];
  hourPerformance: { hour: string; winRate: number; avgPnl: number; trades: number }[];
  isDark: boolean;
}

export default function TimeAnalysis({ dayPerformance, hourPerformance, isDark }: TimeAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Day Performance */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Performance by Day
          </h3>
        </div>

        {dayPerformance.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No day data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPerformance.map((day, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102 ${
                  isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {day.day}
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {day.trades} trades
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Win Rate */}
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
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
                      Win Rate
                    </div>
                  </div>

                  {/* Avg P&L */}
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        day.avgPnl >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ${day.avgPnl >= 0 ? "+" : ""}
                      {day.avgPnl}
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Avg P&L
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
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Performance by Hour
          </h3>
        </div>

        {hourPerformance.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No hour data available</p>
            <p className="text-xs mt-1">Entry times not recorded</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
            {hourPerformance.map((hour, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102 ${
                  isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {hour.hour}
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {hour.trades} trades
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Win Rate */}
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
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
                      className={`text-sm font-bold ${
                        hour.avgPnl >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ${hour.avgPnl >= 0 ? "+" : ""}
                      {hour.avgPnl}
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