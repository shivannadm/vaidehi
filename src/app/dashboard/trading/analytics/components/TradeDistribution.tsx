// src/app/dashboard/trading/analytics/components/TradeDistribution.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Target } from "lucide-react";

interface TradeDistributionProps {
  data: { name: string; value: number; color: string }[];
  isDark: boolean;
}

export default function TradeDistribution({ data, isDark }: TradeDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Trade Distribution
          </h3>
        </div>
        <div className={`text-center py-8 sm:py-12 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No distribution data available</p>
        </div>
      </div>
    );
  }

  const totalTrades = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Trade Distribution
            </h3>
          </div>
          <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Win/Loss breakdown
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {totalTrades}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Total Trades
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const pct = ((percent || 0) * 100).toFixed(0);
                return `${name} ${pct}%`;
              }}
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "11px",
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
              itemStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
              labelStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
              formatter={(value: number, name: string) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}