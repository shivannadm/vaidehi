// src/app/dashboard/trading/analytics/components/TradeDistribution.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Target, TrendingUp, TrendingDown, Award } from "lucide-react";

interface TradeDistributionProps {
  data: { name: string; value: number; color: string }[];
  metrics: {
    avgWin: number;
    avgLoss: number;
    winLossRatio: number;
    largestWin: number;
    largestLoss: number;
    breakEven: number;
  };
  isDark: boolean;
}

// Indian currency formatter - compact version
function formatCompactINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000) {
    return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  
  return `${isNegative ? '-' : ''}₹${absAmount.toFixed(0)}`;
}

// Full INR formatter for tooltips
function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export default function TradeDistribution({ data, metrics, isDark }: TradeDistributionProps) {
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
  const winData = data.find(d => d.name === 'Wins');
  const lossData = data.find(d => d.name === 'Losses');
  const winPercentage = winData ? Math.round((winData.value / totalTrades) * 100) : 0;

  return (
    <div
      className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Trade Distribution
            </h3>
          </div>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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

      {/* Chart with Extreme Values */}
      <div className="relative h-56 sm:h-64 mb-3">
        {/* Largest Win Badge - Left Side */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <div
            className={`px-2 py-1 rounded-lg border ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <Award className={`w-3 h-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              <div className="text-xs font-medium">
                <div className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>Best</div>
                <div className={`font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  {formatCompactINR(metrics.largestWin)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Largest Loss Badge - Right Side */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <div
            className={`px-2 py-1 rounded-lg border ${
              isDark
                ? "bg-red-500/10 border-red-500/30"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <TrendingDown className={`w-3 h-3 ${isDark ? "text-red-400" : "text-red-600"}`} />
              <div className="text-xs font-medium">
                <div className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>Worst</div>
                <div className={`font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>
                  {formatCompactINR(metrics.largestLoss)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
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
              outerRadius={window.innerWidth < 640 ? 65 : 75}
              innerRadius={window.innerWidth < 640 ? 45 : 52}
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

      {/* Metrics Row */}
      <div
        className={`grid grid-cols-2 gap-2 mb-3 p-3 rounded-lg ${
          isDark ? "bg-slate-700/30" : "bg-slate-50"
        }`}
      >
        {/* Avg Win */}
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
            <TrendingUp className={`w-3 h-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          </div>
          <div>
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Avg Win</div>
            <div className={`text-sm font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              {formatCompactINR(metrics.avgWin)}
            </div>
          </div>
        </div>

        {/* Avg Loss */}
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
            <TrendingDown className={`w-3 h-3 ${isDark ? "text-red-400" : "text-red-600"}`} />
          </div>
          <div>
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Avg Loss</div>
            <div className={`text-sm font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>
              {formatCompactINR(metrics.avgLoss)}
            </div>
          </div>
        </div>

        {/* Win/Loss Ratio */}
        <div className="col-span-2 flex items-center justify-center gap-2 pt-2 border-t border-slate-600/20">
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Win/Loss Ratio:
          </div>
          <div
            className={`text-sm font-bold ${
              metrics.winLossRatio >= 2
                ? isDark ? "text-emerald-400" : "text-emerald-600"
                : metrics.winLossRatio >= 1
                ? isDark ? "text-blue-400" : "text-blue-600"
                : isDark ? "text-orange-400" : "text-orange-600"
            }`}
          >
            {metrics.winLossRatio.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}