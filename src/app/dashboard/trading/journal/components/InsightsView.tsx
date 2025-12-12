// src/app/dashboard/trading/journal/components/InsightsView.tsx
"use client";

import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Target, Award, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import type { TradeWithStrategy } from "@/types/database";

interface InsightsViewProps {
  trades: TradeWithStrategy[];
  isDark: boolean;
  onBack: () => void;
}

export default function InsightsView({ trades, isDark, onBack }: InsightsViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; pnl: number; x: number; y: number } | null>(null);
  
  // Filter closed trades
  const closedTrades = trades.filter(t => t.is_closed);

  // Group trades by date and calculate daily P&L
  const dailyPnL: Record<string, number> = {};
  closedTrades.forEach(trade => {
    if (trade.pnl) {
      if (!dailyPnL[trade.entry_date]) {
        dailyPnL[trade.entry_date] = 0;
      }
      dailyPnL[trade.entry_date] += trade.pnl;
    }
  });

  // Create CUMULATIVE P&L curve
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

  if (closedTrades.length === 0) {
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

  // Calculate metrics
  const totalTrades = closedTrades.length;
  const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losses = closedTrades.filter(t => (t.pnl || 0) <= 0);
  const winCount = wins.length;
  const lossCount = losses.length;
  const winRate = ((winCount / totalTrades) * 100).toFixed(1);
  
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgWin = winCount > 0 ? wins.reduce((sum, t) => sum + (t.pnl || 0), 0) / winCount : 0;
  const avgLoss = lossCount > 0 ? Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0) / lossCount) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : '0.00';
  
  const largestWin = wins.length > 0 ? Math.max(...wins.map(t => t.pnl || 0)) : 0;
  const largestLoss = losses.length > 0 ? Math.min(...losses.map(t => t.pnl || 0)) : 0;

  // Calculate range for chart
  const maxPnL = Math.max(...equityCurve.map(d => d.cumulativePnL), 0);
  const minPnL = Math.min(...equityCurve.map(d => d.cumulativePnL), 0);
  const range = maxPnL - minPnL || 1;

  // Group trades by instrument
  const instrumentBreakdown = closedTrades.reduce((acc, trade) => {
    const inst = trade.instrument_type;
    if (!acc[inst]) {
      acc[inst] = { count: 0, pnl: 0 };
    }
    acc[inst].count++;
    acc[inst].pnl += trade.pnl || 0;
    return acc;
  }, {} as Record<string, { count: number; pnl: number }>);

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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 md:p-6 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-xs md:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Trades
              </span>
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {totalTrades}
            </div>
          </div>

          <div className={`p-4 md:p-6 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Target className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-xs md:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Win Rate
              </span>
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {winRate}%
            </div>
            <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {winCount}W / {lossCount}L
            </div>
          </div>

          <div className={`p-4 md:p-6 rounded-xl border ${
            totalPnL >= 0
              ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
              : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {totalPnL >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={`text-xs md:text-sm ${
                totalPnL >= 0
                  ? isDark ? "text-green-400" : "text-green-700"
                  : isDark ? "text-red-400" : "text-red-700"
              }`}>
                Net P&L
              </span>
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${
              totalPnL >= 0
                ? isDark ? "text-green-400" : "text-green-700"
                : isDark ? "text-red-400" : "text-red-700"
            }`}>
              ₹{Math.abs(totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className={`p-4 md:p-6 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Award className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-xs md:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Profit Factor
              </span>
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {profitFactor}
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
          
          <div className="relative w-full" style={{ height: '350px' }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-12 w-20 flex flex-col justify-between text-xs">
              <div className={`text-right pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ₹{maxPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className={`text-right pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ₹0
              </div>
              <div className={`text-right pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ₹{minPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>

            {/* Chart area */}
            <div className="ml-20 mr-4 h-full pb-12 relative">
              {/* Tooltip */}
              {hoveredPoint && (
                <div
                  className={`absolute z-50 px-3 py-2 rounded-lg shadow-xl border pointer-events-none ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                  }`}
                  style={{
                    left: `${hoveredPoint.x}px`,
                    top: `${hoveredPoint.y - 60}px`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className={`text-xs font-medium mb-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {new Date(hoveredPoint.date).toLocaleDateString('en-IN', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={`text-lg font-bold ${
                    hoveredPoint.pnl >= 0 
                      ? isDark ? "text-green-400" : "text-green-600"
                      : isDark ? "text-red-400" : "text-red-600"
                  }`}>
                    {hoveredPoint.pnl >= 0 ? '+' : ''}₹{hoveredPoint.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Cumulative P&L
                  </div>
                </div>
              )}

              <svg 
                className="w-full h-full" 
                viewBox="0 0 1000 300" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: totalPnL >= 0 ? '#22c55e' : '#ef4444', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: totalPnL >= 0 ? '#22c55e' : '#ef4444', stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(percent => (
                  <line
                    key={`grid-${percent}`}
                    x1="0"
                    y1={percent * 3}
                    x2="1000"
                    y2={percent * 3}
                    stroke={isDark ? '#334155' : '#e2e8f0'}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* Zero line */}
                {minPnL < 0 && maxPnL > 0 && (
                  <line
                    x1="0"
                    y1={((maxPnL - 0) / range) * 300}
                    x2="1000"
                    y2={((maxPnL - 0) / range) * 300}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {/* Area fill */}
                <path
                  d={`
                    M 0,${((maxPnL - 0) / range) * 300}
                    ${equityCurve.map((d, i) => {
                      const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                      const y = ((maxPnL - d.cumulativePnL) / range) * 300;
                      return `L ${x},${y}`;
                    }).join(' ')}
                    L 1000,${((maxPnL - 0) / range) * 300}
                    Z
                  `}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={equityCurve.map((d, i) => {
                    const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                    const y = ((maxPnL - d.cumulativePnL) / range) * 300;
                    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Interactive data points with larger hit areas */}
                {equityCurve.map((d, i) => {
                  const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                  const y = ((maxPnL - d.cumulativePnL) / range) * 300;
                  return (
                    <g key={`point-${i}`}>
                      {/* Invisible larger hit area */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const parent = e.currentTarget.closest('div');
                          const parentRect = parent?.getBoundingClientRect();
                          if (parentRect) {
                            setHoveredPoint({
                              date: d.date,
                              pnl: d.cumulativePnL,
                              x: (x / 1000) * (parentRect.width),
                              y: (y / 300) * (parentRect.height - 48)
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Visible dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#6366f1"
                        vectorEffect="non-scaling-stroke"
                        style={{ pointerEvents: 'none' }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-20 right-4 flex justify-between mt-2">
                {equityCurve
                  .filter((_, i) => {
                    const step = Math.max(1, Math.floor(equityCurve.length / 6));
                    return i % step === 0 || i === equityCurve.length - 1;
                  })
                  .map((d, idx) => (
                    <div 
                      key={`label-${idx}`} 
                      className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily P&L Bar Chart */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}>
          <h2 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Daily P&L
          </h2>
          
          <div className="relative w-full" style={{ height: '250px' }}>
            {/* Chart area */}
            <div className="h-full flex items-end justify-between gap-1 px-2">
              {Object.entries(dailyPnL)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, pnl]) => {
                  const maxAbsPnL = Math.max(...Object.values(dailyPnL).map(Math.abs));
                  const heightPercent = (Math.abs(pnl) / maxAbsPnL) * 100;
                  const isPositive = pnl >= 0;
                  
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className={`absolute bottom-full mb-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 ${
                        isDark ? "bg-slate-900 text-white border border-slate-700" : "bg-white text-slate-900 border border-slate-200"
                      }`}>
                        <div className="font-medium">
                          {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                        <div className={`font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : '-'}₹{Math.abs(pnl).toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t transition-all ${
                          isPositive 
                            ? 'bg-green-500 hover:bg-green-400' 
                            : 'bg-red-500 hover:bg-red-400'
                        }`}
                        style={{ 
                          height: `${Math.max(heightPercent, 2)}%`,
                          minHeight: '4px'
                        }}
                      />
                    </div>
                  );
                })}
            </div>

            {/* X-axis line */}
            <div className={`absolute bottom-0 left-0 right-0 h-px ${
              isDark ? "bg-slate-700" : "bg-slate-300"
            }`} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>Profit Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>Loss Days</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win/Loss Analysis */}
          <div className={`rounded-xl border p-4 md:p-6 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Win/Loss Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Average Win</span>
                <span className="text-lg font-bold text-green-500">
                  ₹{avgWin.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Average Loss</span>
                <span className="text-lg font-bold text-red-500">
                  ₹{avgLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Largest Win</span>
                <span className="text-lg font-bold text-green-500">
                  ₹{largestWin.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Largest Loss</span>
                <span className="text-lg font-bold text-red-500">
                  ₹{Math.abs(largestLoss).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Instrument Breakdown */}
          <div className={`rounded-xl border p-4 md:p-6 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              By Instrument
            </h3>
            <div className="space-y-3">
              {Object.entries(instrumentBreakdown)
                .sort(([, a], [, b]) => b.pnl - a.pnl)
                .map(([instrument, data]) => (
                  <div key={instrument} className={`p-3 rounded-lg ${
                    isDark ? "bg-slate-700/50" : "bg-slate-50"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium capitalize ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        {instrument}
                      </span>
                      <span className={`text-sm font-bold ${
                        data.pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        ₹{Math.abs(data.pnl).toFixed(2)}
                      </span>
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {data.count} trade{data.count > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}