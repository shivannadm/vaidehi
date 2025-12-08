// src/app/dashboard/trading/journal/components/InsightsView.tsx
"use client";

import { ArrowLeft, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import type { TradeWithStrategy } from "@/types/database";

interface InsightsViewProps {
  trades: TradeWithStrategy[];
  isDark: boolean;
  onBack: () => void;
}

export default function InsightsView({ trades, isDark, onBack }: InsightsViewProps) {
  // Group trades by date and calculate daily P&L
  const dailyPnL: Record<string, number> = {};
  trades.forEach(trade => {
    if (trade.is_closed && trade.pnl) {
      if (!dailyPnL[trade.entry_date]) {
        dailyPnL[trade.entry_date] = 0;
      }
      dailyPnL[trade.entry_date] += trade.pnl;
    }
  });

  // Create CUMULATIVE P&L curve starting from 0
  const equityCurve = Object.entries(dailyPnL)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .reduce((acc, [date, pnl], idx) => {
      const prevPnL = idx === 0 ? 0 : acc[idx - 1].cumulativePnL;
      acc.push({
        date,
        cumulativePnL: prevPnL + pnl,
      });
      return acc;
    }, [] as Array<{ date: string; cumulativePnL: number }>);

  if (equityCurve.length === 0) {
    return (
      <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Insights
            </h1>
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Journal
            </button>
          </div>
          <div className={`text-center py-16 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-slate-600" : "text-slate-300"
            }`} />
            <p className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              No closed trades yet
            </p>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              Close some trades to see your performance analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate range for chart
  const maxPnL = Math.max(...equityCurve.map(d => d.cumulativePnL), 0);
  const minPnL = Math.min(...equityCurve.map(d => d.cumulativePnL), 0);
  const range = maxPnL - minPnL || 1;
  const finalPnL = equityCurve[equityCurve.length - 1].cumulativePnL;

  // Calculate stats
  const closedTrades = trades.filter(t => t.is_closed);
  const wins = closedTrades.filter(t => (t.pnl || 0) > 0).length;
  const winRate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : '0';

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
            Trading Insights
          </h1>
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium transition ${
              isDark
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-200 text-slate-900 hover:bg-slate-300"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Journal</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 md:p-6 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className={`text-xs md:text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Total Trades
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {closedTrades.length}
            </div>
          </div>

          <div className={`p-4 md:p-6 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className={`text-xs md:text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Win Rate
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {winRate}%
            </div>
          </div>

          <div className={`p-4 md:p-6 rounded-xl border ${
            finalPnL >= 0
              ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
              : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
          }`}>
            <div className={`text-xs md:text-sm mb-2 flex items-center gap-2 ${
              finalPnL >= 0
                ? isDark ? "text-green-400" : "text-green-700"
                : isDark ? "text-red-400" : "text-red-700"
            }`}>
              {finalPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>Net P&L</span>
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${
              finalPnL >= 0
                ? isDark ? "text-green-400" : "text-green-700"
                : isDark ? "text-red-400" : "text-red-700"
            }`}>
              ₹{Math.abs(finalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Equity Curve Chart */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}>
          <h2 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Cumulative P&L Over Time
          </h2>
          
          <div className="relative" style={{ height: '300px' }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-slate-400">
              <div className="text-right pr-2">₹{maxPnL.toFixed(0)}</div>
              <div className="text-right pr-2">₹0</div>
              <div className="text-right pr-2">₹{minPnL.toFixed(0)}</div>
            </div>

            {/* Chart area */}
            <div className="ml-16 h-full relative pb-8">
              <svg className="w-full h-full overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(percent => (
                  <line
                    key={percent}
                    x1="0"
                    y1={`${percent}%`}
                    x2="100%"
                    y2={`${percent}%`}
                    stroke={isDark ? '#334155' : '#e2e8f0'}
                    strokeWidth="1"
                  />
                ))}

                {/* Zero line */}
                {minPnL < 0 && maxPnL > 0 && (
                  <line
                    x1="0"
                    y1={`${((maxPnL - 0) / range) * 100}%`}
                    x2="100%"
                    y2={`${((maxPnL - 0) / range) * 100}%`}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                )}

                {/* Line path */}
                <polyline
                  points={equityCurve.map((d, i) => {
                    const x = (i / (equityCurve.length - 1)) * 100;
                    const y = ((maxPnL - d.cumulativePnL) / range) * 100;
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Area fill - positive */}
                {maxPnL > 0 && (
                  <polygon
                    points={[
                      `0%,${((maxPnL - 0) / range) * 100}%`,
                      ...equityCurve
                        .filter(d => d.cumulativePnL >= 0)
                        .map((d) => {
                          const actualIndex = equityCurve.indexOf(d);
                          const x = (actualIndex / (equityCurve.length - 1)) * 100;
                          const y = ((maxPnL - d.cumulativePnL) / range) * 100;
                          return `${x}%,${y}%`;
                        }),
                      `${((equityCurve.length - 1) / (equityCurve.length - 1)) * 100}%,${((maxPnL - 0) / range) * 100}%`
                    ].join(' ')}
                    fill="url(#gradientPositive)"
                    opacity="0.2"
                  />
                )}

                {/* Area fill - negative */}
                {minPnL < 0 && (
                  <polygon
                    points={[
                      `0%,${((maxPnL - 0) / range) * 100}%`,
                      ...equityCurve
                        .filter(d => d.cumulativePnL < 0)
                        .map((d) => {
                          const actualIndex = equityCurve.indexOf(d);
                          const x = (actualIndex / (equityCurve.length - 1)) * 100;
                          const y = ((maxPnL - d.cumulativePnL) / range) * 100;
                          return `${x}%,${y}%`;
                        }),
                      `${((equityCurve.length - 1) / (equityCurve.length - 1)) * 100}%,${((maxPnL - 0) / range) * 100}%`
                    ].join(' ')}
                    fill="url(#gradientNegative)"
                    opacity="0.2"
                  />
                )}

                <defs>
                  <linearGradient id="gradientPositive" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradientNegative" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 mt-2">
                {equityCurve.filter((_, i) => i % Math.max(1, Math.ceil(equityCurve.length / 5)) === 0).map(d => (
                  <div key={d.date} className="text-center">
                    {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}