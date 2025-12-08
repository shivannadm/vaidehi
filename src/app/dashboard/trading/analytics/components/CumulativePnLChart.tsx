// src/app/dashboard/trading/analytics/components/CumulativePnLChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface CumulativePnLChartProps {
  data: { date: string; pnl: number; cumulative?: number }[]; // incoming may be per-trade
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
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Cumulative P&L</h3>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No trade data available</p>
        </div>
      </div>
    );
  }

  // Helper: format currency for display: +₹1,234.56 or -₹1,234.56
  const formatCurrency = (n: number, decimals = 2) => {
    const sign = n > 0 ? "+" : n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const formatted = abs.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${sign}₹${formatted}`;
  };

  // Aggregate incoming data by calendar day (YYYY-MM-DD) -> sum pnl per day
  const dailyMap: Record<string, number> = {};
  data.forEach((item) => {
    const dt = new Date(item.date);
    let key: string;
    if (isNaN(dt.getTime())) {
      key = item.date.split("T")[0] || item.date;
    } else {
      key = dt.toISOString().slice(0, 10);
    }
    dailyMap[key] = (dailyMap[key] || 0) + (item.pnl ?? 0);
  });

  // Build sorted daily array and cumulative series
  const sortedDays = Object.keys(dailyMap).sort((a, b) => +new Date(a) - +new Date(b));
  const chartData = sortedDays.map((dayKey) => {
    const dayPnl = dailyMap[dayKey];
    return { dayKey, dayPnl };
  });

  let running = 0;
  const dailyCumulative = chartData.map((d) => {
    running += d.dayPnl;
    const dateLabel = new Date(d.dayKey).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return {
      date: dateLabel,
      cumulative: running,
      dayPnl: d.dayPnl,
      iso: d.dayKey,
    };
  });

  const finalPnL = dailyCumulative.length > 0 ? dailyCumulative[dailyCumulative.length - 1].cumulative : 0;
  const isProfit = finalPnL >= 0;

  // Y axis tick formatter: use k suffix for thousands but keep Indian grouping for small numbers
  const yTickFormatter = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  // Custom tooltip to show both daily net pnl and cumulative pnl
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0].payload;
    // p has: date (label), cumulative, dayPnl (net pnl for day)
    return (
      <div
        style={{
          background: isDark ? "#0b1220" : "#ffffff",
          color: isDark ? "#e2e8f0" : "#0f172a",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          padding: 10,
          borderRadius: 8,
          minWidth: 160,
          boxShadow: isDark ? "0 6px 18px rgba(2,6,23,0.6)" : "0 6px 18px rgba(15,23,42,0.06)",
        }}
      >
        <div style={{ fontSize: 12, marginBottom: 6, opacity: 0.85 }}>
          <strong>{`Date: ${p.iso ?? label}`}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Daily net P&L</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.dayPnl >= 0 ? "#10b981" : "#ef4444" }}>
            {formatCurrency(p.dayPnl, 2)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Cumulative</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.cumulative >= 0 ? "#10b981" : "#ef4444" }}>
            {formatCurrency(p.cumulative, 2)}
          </div>
        </div>
      </div>
    );
  };

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
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Cumulative P&L</h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Total profit/loss over time</p>
        </div>

        <div className="text-left sm:text-right">
          <div
            className={`text-2xl font-bold ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
          >
            {formatCurrency(finalPnL, 0)}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            From {data.length} trades
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyCumulative}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              style={{ fontSize: "11px" }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} style={{ fontSize: "11px" }} tickLine={false} tickFormatter={yTickFormatter} />
            <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1000 }} />
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
