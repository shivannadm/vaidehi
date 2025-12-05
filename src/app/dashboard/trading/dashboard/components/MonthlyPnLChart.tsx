// src/app/dashboard/trading/dashboard/components/MonthlyPnLChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

interface MonthlyPnLChartProps {
  data: { month: string; pnl: number }[];
  isDark: boolean;
}

export default function MonthlyPnLChart({ data, isDark }: MonthlyPnLChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Monthly P&L
          </h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No monthly data available</p>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => {
    const [year, month] = item.month.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
      pnl: item.pnl,
    };
  });

  const totalPnL = data.reduce((sum, item) => sum + item.pnl, 0);
  const profitableMonths = data.filter((item) => item.pnl > 0).length;

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
            <BarChart3 className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Monthly P&L
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Last 6 months performance
          </p>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              totalPnL >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            ${totalPnL >= 0 ? "+" : ""}
            {totalPnL.toLocaleString()}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {profitableMonths}/{data.length} profitable
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "12px" }}
              tickLine={false}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "12px" }}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                return `$${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
              formatter={(value: number) => [
                `${value >= 0 ? "+" : ""}$${value.toLocaleString()}`,
                "P&L",
              ]}
              cursor={{ fill: isDark ? "#1e293b50" : "#f1f5f950" }}
            />
            <Bar dataKey="pnl" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}