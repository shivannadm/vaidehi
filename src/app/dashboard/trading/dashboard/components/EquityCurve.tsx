// src/app/dashboard/trading/dashboard/components/EquityCurve.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

interface EquityCurveProps {
  data: { date: string; balance: number }[];
  isDark: boolean;
}

export default function EquityCurve({ data, isDark }: EquityCurveProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Equity Curve
          </h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No trade data available</p>
        </div>
      </div>
    );
  }

  const startBalance = data[0]?.balance || 10000;
  const currentBalance = data[data.length - 1]?.balance || 10000;
  const change = currentBalance - startBalance;
  const changePercent = ((change / startBalance) * 100).toFixed(2);

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    balance: item.balance,
  }));

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
            <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Equity Curve
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Account balance over time
          </p>
        </div>

        {/* Current Balance */}
        <div className="text-right">
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            ${currentBalance.toLocaleString()}
          </div>
          <div
            className={`text-sm font-medium ${
              change >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {change >= 0 ? "+" : ""}${change.toLocaleString()} ({changePercent}%)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "12px" }}
              tickLine={false}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "12px" }}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
              itemStyle={{ color: "#6366f1" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#colorBalance)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}