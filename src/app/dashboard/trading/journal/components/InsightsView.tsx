"use client";

import { BarChart3 } from "lucide-react";
import { formatIndianCurrency } from "@/types/database";
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
        cumulativePnL: prevPnL + pnl, // Cumulative P&L from zero
      });
      return acc;
    }, [] as Array<{ date: string; cumulativePnL: number }>);

  if (equityCurve.length === 0) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <BarChart3 className="w-8 h-8 text-indigo-500" />
              Trading Insights
            </h1>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition"
            >
              Back to Journal
            </button>
          </div>
          <div className={`text-center py-16 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              No closed trades yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate range for chart (now based on P&L, not balance)
  const maxPnL = Math.max(...equityCurve.map(d => d.cumulativePnL), 0);
  const minPnL = Math.min(...equityCurve.map(d => d.cumulativePnL), 0);
  const range = maxPnL - minPnL;
  const finalPnL = equityCurve[equityCurve.length - 1].cumulativePnL;

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            Trading Insights
          </h1>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition"
          >
            Back to Journal
          </button>
        </div>

        {/* Equity Curve */}
        <div className={`rounded-xl border p-6 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Cumulative P&L Over Time
          </h2>
          
          <div className="relative h-96">
            {/* Y-axis labels - now showing P&L */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
              <div>₹{maxPnL.toFixed(0)}</div>
              <div>₹0</div>
              <div>₹{minPnL.toFixed(0)}</div>
            </div>

            {/* Chart area */}
            <div className="ml-20 mr-4 h-full relative">
              <svg className="w-full h-full" style={{ height: 'calc(100% - 2rem)' }}>
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

                {/* Zero line (horizontal) - IMPORTANT! */}
                {minPnL < 0 && (
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

                {/* Equity curve line */}
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

                {/* Fill area - positive (above zero) */}
                {maxPnL > 0 && (
                  <polygon
                    points={[
                      `0%,${((maxPnL - 0) / range) * 100}%`,
                      ...equityCurve
                        .filter(d => d.cumulativePnL >= 0)
                        .map((d, i, arr) => {
                          const actualIndex = equityCurve.indexOf(d);
                          const x = (actualIndex / (equityCurve.length - 1)) * 100;
                          const y = ((maxPnL - d.cumulativePnL) / range) * 100;
                          return `${x}%,${y}%`;
                        }),
                      `100%,${((maxPnL - 0) / range) * 100}%`
                    ].join(' ')}
                    fill="url(#gradientPositive)"
                    opacity="0.2"
                  />
                )}

                {/* Fill area - negative (below zero) */}
                {minPnL < 0 && (
                  <polygon
                    points={[
                      `0%,${((maxPnL - 0) / range) * 100}%`,
                      ...equityCurve
                        .filter(d => d.cumulativePnL < 0)
                        .map((d, i, arr) => {
                          const actualIndex = equityCurve.indexOf(d);
                          const x = (actualIndex / (equityCurve.length - 1)) * 100;
                          const y = ((maxPnL - d.cumulativePnL) / range) * 100;
                          return `${x}%,${y}%`;
                        }),
                      `100%,${((maxPnL - 0) / range) * 100}%`
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
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                {equityCurve.filter((_, i) => i % Math.ceil(equityCurve.length / 5) === 0).map(d => (
                  <div key={d.date}>
                    {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Trades
              </div>
              <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {trades.filter(t => t.is_closed).length}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Win Rate
              </div>
              <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {(() => {
                  const closedTrades = trades.filter(t => t.is_closed);
                  const wins = closedTrades.filter(t => (t.pnl || 0) > 0).length;
                  return closedTrades.length > 0 ? `${((wins / closedTrades.length) * 100).toFixed(1)}%` : '0%';
                })()}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${
              finalPnL >= 0 ? "bg-green-900/20" : "bg-red-900/20"
            }`}>
              <div className={`text-xs mb-1 ${finalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                Net P&L
              </div>
              <div className={`text-xl font-bold ${finalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatIndianCurrency(finalPnL)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}