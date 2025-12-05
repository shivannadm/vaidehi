// src/app/dashboard/trading/dashboard/components/CalendarHeatmap.tsx
"use client";

import { Calendar } from "lucide-react";

interface CalendarHeatmapProps {
  data: { date: string; pnl: number }[];
  isDark: boolean;
}

export default function CalendarHeatmap({ data, isDark }: CalendarHeatmapProps) {
  // Generate last 90 days
  const today = new Date();
  const last90Days: Date[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last90Days.push(date);
  }

  // Create data map
  const dataMap = new Map<string, number>();
  data.forEach((item) => {
    dataMap.set(item.date, item.pnl);
  });

  // Get color intensity
  const getColorClass = (pnl: number | undefined) => {
    if (pnl === undefined) {
      return isDark ? "bg-slate-700/30" : "bg-slate-100";
    }
    
    if (pnl > 500) return "bg-emerald-600";
    if (pnl > 200) return "bg-emerald-500";
    if (pnl > 0) return "bg-emerald-400";
    if (pnl > -200) return "bg-red-400";
    if (pnl > -500) return "bg-red-500";
    return "bg-red-600";
  };

  // Group by weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  last90Days.forEach((date, index) => {
    currentWeek.push(date);
    if (date.getDay() === 6 || index === last90Days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const totalPnL = Array.from(dataMap.values()).reduce((sum, pnl) => sum + pnl, 0);
  const profitDays = Array.from(dataMap.values()).filter((pnl) => pnl > 0).length;

  return (
    <div
      className={`rounded-2xl p-6 border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Trading Calendar
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Last 90 days activity
          </p>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div
            className={`text-xl font-bold ${
              totalPnL >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            ${totalPnL >= 0 ? "+" : ""}
            {totalPnL.toLocaleString()}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {profitDays} profit days
          </div>
        </div>
      </div>

      {/* Day Labels */}
      <div className="flex gap-2 mb-2">
        <div className="w-8"></div>
        {["Mon", "Wed", "Fri"].map((day) => (
          <div
            key={day}
            className={`w-full text-xs text-center ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {/* Week number for first week of month */}
            {week[0] && week[0].getDate() <= 7 && (
              <div
                className={`text-xs mb-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {week[0].toLocaleDateString("en-US", { month: "short" })}
              </div>
            )}
            
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const date = week.find((d) => d.getDay() === dayIndex);
              if (!date) {
                return <div key={dayIndex} className="w-3 h-3" />;
              }

              const dateStr = date.toISOString().split("T")[0];
              const pnl = dataMap.get(dateStr);
              const colorClass = getColorClass(pnl);

              return (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-2 ring-indigo-500 transition cursor-pointer group relative`}
                  title={`${dateStr}: ${pnl !== undefined ? `$${pnl.toFixed(0)}` : "No trades"}`}
                >
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10">
                    <div
                      className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                        isDark ? "bg-slate-700 text-white" : "bg-slate-800 text-white"
                      }`}
                    >
                      <div className="font-medium">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div
                        className={
                          pnl && pnl > 0
                            ? "text-emerald-400"
                            : pnl && pnl < 0
                            ? "text-red-400"
                            : "text-slate-400"
                        }
                      >
                        {pnl !== undefined ? `$${pnl.toFixed(0)}` : "No trades"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs">
        <span className={isDark ? "text-slate-400" : "text-slate-600"}>Less</span>
        <div className={`w-3 h-3 rounded-sm ${isDark ? "bg-slate-700/30" : "bg-slate-100"}`} />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <span className={isDark ? "text-slate-400" : "text-slate-600"}>More</span>
      </div>
    </div>
  );
}