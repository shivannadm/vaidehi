// src/app/dashboard/trading/analytics/components/CumulativePnLChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp } from "lucide-react";

interface CumulativePnLChartProps {
  data: { date: string; pnl: number; cumulative: number }[];
  isDark: boolean;
}

export default function CumulativePnLChart({ data, isDark }: CumulativePnLChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Cumulative P&L
          </h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No trade data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    cumulative: item.cumulative,
  }));

  const finalPnL = data[data.length - 1]?.cumulative || 0;
  const isProfit = finalPnL >= 0;

  return (
    <div
      className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Cumulative P&L
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Total profit/loss over time
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div
            className={`text-2xl font-bold ${isProfit
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
              }`}
          >
            {finalPnL >= 0 ? "+" : ""}₹{finalPnL.toLocaleString("en-IN")}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            From {data.length} trades
          </div>
        </div>
      </div>

      {/* Chart - Increased height */}
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "11px" }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "11px" }}
              tickLine={false}
              tickFormatter={(value) => {
                if (Math.abs(value) >= 1000) {
                  return `₹${(value / 1000).toFixed(1)}k`;
                }
                return `₹${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
              formatter={(value: number) => [
                `₹${value >= 0 ? "+" : ""}${value.toLocaleString("en-IN")}`,
                "Cumulative P&L",
              ]}
            />
            <ReferenceLine y={0} stroke={isDark ? "#64748b" : "#94a3b8"} strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke={isProfit ? "#10b981" : "#ef4444"}
              strokeWidth={3}
              dot={{ fill: isProfit ? "#10b981" : "#ef4444", r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}