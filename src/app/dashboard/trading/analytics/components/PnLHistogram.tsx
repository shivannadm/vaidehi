// src/app/dashboard/trading/analytics/components/PnLHistogram.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

interface PnLHistogramProps {
  data: { range: string; count: number }[];
  isDark: boolean;
}

export default function PnLHistogram({ data, isDark }: PnLHistogramProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            P&L Distribution
          </h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No distribution data available</p>
        </div>
      </div>
    );
  }

  const getBarColor = (range: string) => {
    if (range.includes('-') && !range.includes('$0')) return "#ef4444"; // Red for losses
    if (range.includes('$0 to')) return "#f59e0b"; // Orange for small wins
    return "#10b981"; // Green for wins
  };

  const totalTrades = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              P&L Distribution
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Trade outcomes by range
          </p>
        </div>

        <div className="text-right">
          <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {totalTrades}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Trades
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="range"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "11px" }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "12px" }}
              tickLine={false}
              label={{ value: 'Number of Trades', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f1f5f9" : "#0f172a", // ADD THIS
              }}
              itemStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }} // ADD THIS
              labelStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
              formatter={(value: number) => [`${value} trades`, "Count"]}
              cursor={{ fill: isDark ? "#1e293b50" : "#f1f5f950" }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}