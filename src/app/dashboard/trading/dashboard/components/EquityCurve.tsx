// src/app/dashboard/trading/dashboard/components/EquityCurve.tsx
"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Settings, X, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EquityCurveProps {
  data: { date: string; balance: number }[];
  isDark: boolean;
  initialCapital: number;
  userId: string | null;
  onCapitalUpdate: () => void;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, isDark, initialCapital }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const balance = data.balance;
  const dailyPnL = data.dailyPnL;

  return (
    <div
      className={`rounded-lg p-3 shadow-lg border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      <p className={`text-xs font-medium mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {data.fullDate}
      </p>
      
      {/* Cumulative Balance/P&L */}
      <div className="mb-1.5">
        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          {initialCapital > 0 ? "Balance" : "Cumulative P&L"}
        </p>
        <p className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {initialCapital > 0 ? "" : balance >= 0 ? "+" : ""}
          ₹{Math.abs(balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Daily P&L */}
      <div className="pt-1.5 border-t border-slate-700/50">
        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          Daily P&L
        </p>
        <p
          className={`text-sm font-semibold ${
            dailyPnL >= 0
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {dailyPnL >= 0 ? "+" : ""}₹{dailyPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default function EquityCurve({ data, isDark, initialCapital, userId, onCapitalUpdate }: EquityCurveProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [capital, setCapital] = useState(initialCapital.toString());
  const [saving, setSaving] = useState(false);

  const handleSaveCapital = async () => {
    if (!userId) return;
    
    const newCapital = parseFloat(capital) || 0;
    if (newCapital < 0) {
      alert("Initial capital cannot be negative");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ initial_capital: newCapital })
        .eq("id", userId);

      if (error) throw error;

      setShowSettings(false);
      onCapitalUpdate(); // Refresh dashboard data
    } catch (err) {
      console.error("Failed to update capital:", err);
      alert("Failed to update initial capital");
    } finally {
      setSaving(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Equity Curve
            </h3>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <Settings className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
          </button>
        </div>
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <p>No trade data available</p>
        </div>
      </div>
    );
  }

  // GROUP BY DAY - Take last balance of each day and calculate daily P&L
  const dayWiseData = data.reduce((acc, item) => {
    const dateKey = item.date;
    acc[dateKey] = item.balance;
    return acc;
  }, {} as Record<string, number>);

  const sortedDayData = Object.entries(dayWiseData)
    .map(([date, balance]) => ({ date, balance }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const startBalance = sortedDayData[0]?.balance || 0;
  const currentBalance = sortedDayData[sortedDayData.length - 1]?.balance || 0;
  const change = currentBalance - startBalance;
  const changePercent = startBalance !== 0 
    ? ((change / Math.abs(startBalance)) * 100).toFixed(2)
    : "0.00";

  // Calculate daily P&L for each day
  const chartData = sortedDayData.map((item, index) => {
    const prevBalance = index > 0 ? sortedDayData[index - 1].balance : (initialCapital > 0 ? initialCapital : 0);
    const dailyPnL = item.balance - prevBalance;

    return {
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: new Date(item.date).toLocaleDateString("en-US", { 
        weekday: "short",
        month: "short", 
        day: "numeric",
        year: "numeric" 
      }),
      balance: item.balance,
      dailyPnL: Math.round(dailyPnL * 100) / 100, // Round to 2 decimals
    };
  });

  // Dynamic label based on initial capital
  const balanceLabel = initialCapital > 0 ? "Balance" : "P&L";
  const yAxisFormatter = initialCapital > 0
    ? (value: number) => `₹${(value / 1000).toFixed(0)}k`
    : (value: number) => value >= 0 ? `+₹${(value / 1000).toFixed(0)}k` : `-₹${(Math.abs(value) / 1000).toFixed(0)}k`;

  return (
    <>
      <div
        className={`rounded-2xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          } shadow-lg`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {initialCapital > 0 ? "Equity Curve" : "P&L Curve"}
              </h3>
              <button
                onClick={() => setShowSettings(true)}
                className={`p-1.5 rounded-lg transition ml-auto sm:ml-2 ${
                  isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                }`}
                title="Set initial capital"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {initialCapital > 0 
                ? "Account balance over time" 
                : "Cumulative profit & loss (Set initial capital to see equity)"}
            </p>
          </div>

          {/* Current Balance/P&L */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {initialCapital > 0 ? "₹" : currentBalance >= 0 ? "+₹" : "-₹"}
              {Math.abs(currentBalance).toLocaleString("en-IN", { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <div
              className={`text-sm font-medium ${change >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
                }`}
            >
              {change >= 0 ? "+" : "-"}₹
              {Math.abs(change).toLocaleString("en-IN", { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} ({change >= 0 ? "+" : ""}{changePercent}%)
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
                tickFormatter={yAxisFormatter}
              />
              <Tooltip
                content={<CustomTooltip isDark={isDark} initialCapital={initialCapital} />}
                cursor={{ stroke: isDark ? "#475569" : "#cbd5e1", strokeWidth: 1 }}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 max-w-md w-full ${
              isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
            } shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Initial Capital Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-lg transition ${
                  isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                }`}
              >
                <X className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Initial Capital Amount
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    placeholder="0"
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none ${
                      isDark
                        ? "bg-slate-900 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <p className={`text-xs mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Set to 0 to show cumulative P&L instead of equity curve
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                    isDark
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCapital}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}