// src/app/dashboard/trading/analytics/components/WinRateTrend.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { Target } from "lucide-react";

interface WinRateTrendProps {
  data: { month: string; winRate: number }[];
  isDark: boolean;
}

export default function WinRateTrend({ data, isDark }: WinRateTrendProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Win Rate Trend
          </h3>
        </div>
        <div className={`text-center py-8 sm:py-12 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No trend data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => {
    const [year, month] = item.month.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
      winRate: item.winRate,
    };
  });

  const avgWinRate = Math.round(
    data.reduce((sum, item) => sum + item.winRate, 0) / data.length
  );

  return (
    <div
      className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Win Rate Trend
            </h3>
          </div>
          <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Monthly win rate performance
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div
            className={`text-xl sm:text-2xl font-bold ${
              avgWinRate >= 60
                ? "text-emerald-600 dark:text-emerald-400"
                : avgWinRate >= 50
                ? "text-blue-600 dark:text-blue-400"
                : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {avgWinRate}%
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Average
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "10px" }}
              tickLine={false}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "10px" }}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
              formatter={(value: number) => [`${value}%`, "Win Rate"]}
            />
            <ReferenceLine
              y={50}
              stroke={isDark ? "#64748b" : "#94a3b8"}
              strokeDasharray="3 3"
              label={{ value: "50%", fill: isDark ? "#64748b" : "#94a3b8", fontSize: 9 }}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorWinRate)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}