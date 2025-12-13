// src/app/dashboard/trading/journal/components/InsightsView.tsx - PART 1 (FIXED)
"use client";

import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Target, Award, Calendar } from "lucide-react";
import { useState } from "react";
import type { TradeWithStrategy } from "@/types/database";

interface InsightsViewProps {
  trades: TradeWithStrategy[];
  isDark: boolean;
  onBack: () => void;
}

export default function InsightsView({ trades, isDark, onBack }: InsightsViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; pnl: number; x: number; y: number } | null>(null);

  const closedTrades = trades.filter(t => t.is_closed);

  const dailyPnL: Record<string, number> = {};
  closedTrades.forEach(trade => {
    if (trade.pnl) {
      if (!dailyPnL[trade.entry_date]) dailyPnL[trade.entry_date] = 0;
      dailyPnL[trade.entry_date] += trade.pnl;
    }
  });

  const equityCurve = Object.entries(dailyPnL)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .reduce((acc, [date, pnl], idx) => {
      const prevPnL = idx === 0 ? 0 : acc[idx - 1].cumulativePnL;
      acc.push({ date, cumulativePnL: prevPnL + pnl });
      return acc;
    }, [] as Array<{ date: string; cumulativePnL: number }>);

  if (closedTrades.length === 0) {
    return (
      <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3 ${isDark ? "text-white" : "text-slate-900"
              }`}>
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
              <span className="hidden xs:inline">Trading Insights</span>
              <span className="xs:hidden">Insights</span>
            </h1>
            <button onClick={onBack} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
          <div className={`text-center py-12 sm:py-16 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <BarChart3 className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${isDark ? "text-slate-600" : "text-slate-300"
              }`} />
            <p className={`text-base sm:text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              No closed trades yet
            </p>
            <p className={`text-xs sm:text-sm mt-2 px-4 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              Close some trades to see your performance analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  // ✅ FIXED: Calculate proper range with padding
  const maxPnL = Math.max(...equityCurve.map(d => d.cumulativePnL), 0);
  const minPnL = Math.min(...equityCurve.map(d => d.cumulativePnL), 0);
  const range = Math.max(Math.abs(maxPnL), Math.abs(minPnL)) || 100;
  const paddedMax = range * 1.1; // Add 10% padding
  const paddedMin = -range * 1.1;

  const instrumentBreakdown = closedTrades.reduce((acc, trade) => {
    const inst = trade.instrument_type;
    if (!acc[inst]) acc[inst] = { count: 0, pnl: 0 };
    acc[inst].count++;
    acc[inst].pnl += trade.pnl || 0;
    return acc;
  }, {} as Record<string, { count: number; pnl: number }>);

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3 ${isDark ? "text-white" : "text-slate-900"
            }`}>
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
            <span className="hidden xs:inline">Trading Insights</span>
            <span className="xs:hidden">Insights</span>
          </h1>
          <button onClick={onBack} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-sm font-medium transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
            }`}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back to Journal</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          <div className={`p-3 sm:p-4 md:p-6 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Total Trades
              </span>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {totalTrades}
            </div>
          </div>

          <div className={`p-3 sm:p-4 md:p-6 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Target className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Win Rate
              </span>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {winRate}%
            </div>
            <div className={`text-[9px] sm:text-xs mt-0.5 sm:mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {winCount}W / {lossCount}L
            </div>
          </div>

          <div className={`p-3 sm:p-4 md:p-6 rounded-xl border transition-all hover:scale-[1.02] ${totalPnL >= 0
            ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
            : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
            }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              {totalPnL >= 0 ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />}
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${totalPnL >= 0 ? isDark ? "text-green-400" : "text-green-700" : isDark ? "text-red-400" : "text-red-700"
                }`}>
                Net P&L
              </span>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${totalPnL >= 0 ? isDark ? "text-green-400" : "text-green-700" : isDark ? "text-red-400" : "text-red-700"
              }`}>
              ₹{Math.abs(totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className={`p-3 sm:p-4 md:p-6 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Award className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Profit Factor
              </span>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {profitFactor}
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Equity Curve Chart */}
        <div className={`rounded-xl border p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <h2 className={`text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Cumulative P&L Over Time
          </h2>

          <div className="relative w-full" style={{ height: 'clamp(250px, 50vw, 350px)' }}>
            {/* ✅ FIXED: Y-axis labels aligned properly */}
            <div className="absolute left-0 top-0 bottom-8 sm:bottom-10 md:bottom-12 w-14 sm:w-16 md:w-20 flex flex-col justify-between text-[10px] sm:text-xs">
              <div className={`text-right pr-2 sm:pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ₹{(paddedMax / 1000).toFixed(1)}k
              </div>
              <div className={`text-right pr-2 sm:pr-3 font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                ₹0
              </div>
              <div className={`text-right pr-2 sm:pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ₹{(paddedMin / 1000).toFixed(1)}k
              </div>
            </div>

            {/* Chart area */}
            <div className="ml-14 sm:ml-16 md:ml-20 mr-2 sm:mr-4 h-full pb-8 sm:pb-10 md:pb-12 relative">
              {hoveredPoint && (
                <div className={`absolute z-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-xl border pointer-events-none whitespace-nowrap ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                  }`} style={{ left: `${hoveredPoint.x}px`, top: `${hoveredPoint.y - 60}px`, transform: 'translateX(-50%)' }}>
                  <div className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {new Date(hoveredPoint.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </div>
                  <div className={`text-base sm:text-lg font-bold ${hoveredPoint.pnl >= 0 ? isDark ? "text-green-400" : "text-green-600" : isDark ? "text-red-400" : "text-red-600"
                    }`}>
                    {hoveredPoint.pnl >= 0 ? '+' : ''}₹{hoveredPoint.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: totalPnL >= 0 ? '#22c55e' : '#ef4444', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: totalPnL >= 0 ? '#22c55e' : '#ef4444', stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(percent => (
                  <line key={`grid-${percent}`} x1="0" y1={percent * 3} x2="1000" y2={percent * 3}
                    stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}

                {/* ✅ FIXED: Zero line positioned correctly at 50% */}
                <line x1="0" y1="150" x2="1000" y2="150"
                  stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="2" strokeDasharray="8,4" vectorEffect="non-scaling-stroke" />

                {/* ✅ FIXED: Area fill with proper zero baseline */}
                <path d={`M 0,150 ${equityCurve.map((d, i) => {
                  const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                  const y = 150 - ((d.cumulativePnL / (paddedMax - paddedMin)) * 300);
                  return `L ${x},${y}`;
                }).join(' ')} L 1000,150 Z`} fill="url(#areaGradient)" />

                {/* ✅ FIXED: Line with proper zero baseline */}
                <path d={equityCurve.map((d, i) => {
                  const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                  const y = 150 - ((d.cumulativePnL / (paddedMax - paddedMin)) * 300);
                  return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
                }).join(' ')} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

                {/* Interactive points */}
                {equityCurve.map((d, i) => {
                  const x = (i / Math.max(1, equityCurve.length - 1)) * 1000;
                  const y = 150 - ((d.cumulativePnL / (paddedMax - paddedMin)) * 300);
                  return (
                    <g key={`point-${i}`}>
                      <circle cx={x} cy={y} r="20" fill="transparent" style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          const parent = e.currentTarget.closest('div');
                          const parentRect = parent?.getBoundingClientRect();
                          if (parentRect) setHoveredPoint({ date: d.date, pnl: d.cumulativePnL, x: (x / 1000) * parentRect.width, y: (y / 300) * (parentRect.height - 48) });
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          const parent = e.currentTarget.closest('div');
                          const parentRect = parent?.getBoundingClientRect();
                          if (parentRect) setHoveredPoint({ date: d.date, pnl: d.cumulativePnL, x: (x / 1000) * parentRect.width, y: (y / 300) * (parentRect.height - 48) });
                        }}
                        onTouchEnd={() => setHoveredPoint(null)}
                      />
                      <circle cx={x} cy={y} r="4" fill="#6366f1" vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }} />
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                {equityCurve.filter((_, i) => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                  const step = Math.max(1, Math.floor(equityCurve.length / (isMobile ? 4 : 6)));
                  return i % step === 0 || i === equityCurve.length - 1;
                }).map((d, idx) => (
                  <div key={`label-${idx}`} className={`text-[9px] sm:text-[10px] md:text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    style={{ transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                    {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTINUE TO PART 2... */}
        {/* ✅ FIXED: Daily P&L Bar Chart */}
        <div className={`rounded-xl border p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <h2 className={`text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Daily P&L
          </h2>

          <div className="relative w-full" style={{ height: 'clamp(220px, 45vw, 320px)' }}>
            {(() => {
              const allPnLValues = Object.values(dailyPnL);
              const maxPositive = Math.max(...allPnLValues.filter(v => v > 0), 0);
              const maxNegative = Math.abs(Math.min(...allPnLValues.filter(v => v < 0), 0));
              // ✅ FIXED: Proper scale with padding
              const maxScale = Math.max(maxPositive, maxNegative, 100) * 1.1;

              return (
                <>
                  {/* ✅ FIXED: Y-axis labels properly positioned */}
                  <div className="absolute left-0 top-0 bottom-8 sm:bottom-10 md:bottom-12 w-14 sm:w-16 md:w-20 flex flex-col justify-between text-[10px] sm:text-xs">
                    <div className={`text-right pr-2 sm:pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      ₹{(maxScale / 1000).toFixed(1)}k
                    </div>
                    <div className={`text-right pr-2 sm:pr-3 font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      ₹0
                    </div>
                    <div className={`text-right pr-2 sm:pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      -₹{(maxScale / 1000).toFixed(1)}k
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="ml-14 sm:ml-16 md:ml-20 mr-2 sm:mr-4 h-full relative pb-8 sm:pb-10 md:pb-12">
                    {/* ✅ FIXED: Grid lines with proper spacing */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                      <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                      <div className={`w-full h-0.5 ${isDark ? "bg-slate-600" : "bg-slate-400"}`} /> {/* Zero line - thicker */}
                      <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                      <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                    </div>

                    {/* ✅ FIXED: Bars with accurate positioning */}
                    <div className="absolute inset-0 flex items-center justify-between gap-0.5 sm:gap-1 md:gap-1.5">
                      {Object.entries(dailyPnL)
                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                        .map(([date, pnl]) => {
                          const isPositive = pnl >= 0;
                          // ✅ FIXED: Calculate height as percentage of maxScale (not half chart)
                          const heightPercent = (Math.abs(pnl) / maxScale) * 100;

                          return (
                            <div key={date} className="flex-1 h-full flex flex-col justify-center items-stretch group relative"
                              style={{ minWidth: '3px', maxWidth: '50px' }}>
                              {/* Tooltip */}
                              <div className={`absolute ${isPositive ? 'bottom-[55%] mb-2 sm:mb-3' : 'top-[55%] mt-2 sm:mt-3'
                                } left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 ${isDark ? "bg-slate-900 text-white border-2 border-slate-700" : "bg-white text-slate-900 border-2 border-slate-300"
                                }`}>
                                <div className={`text-[9px] sm:text-xs font-semibold mb-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                  {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </div>
                                <div className={`text-sm sm:text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                  {isPositive ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </div>
                              </div>

                              {/* ✅ FIXED: Bar container with proper flex behavior */}
                              <div className="flex-1 flex flex-col">
                                {/* Top half - positive bars grow downward from top */}
                                <div className="flex-1 flex flex-col justify-end items-stretch">
                                  {isPositive && (
                                    <div className="w-full rounded-t-md transition-all duration-300 bg-green-500 hover:bg-green-400 active:bg-green-600 cursor-pointer"
                                      style={{
                                        height: `${heightPercent}%`,
                                        minHeight: pnl > 0 ? '2px' : '0'
                                      }}
                                    />
                                  )}
                                </div>

                                {/* Bottom half - negative bars grow upward from bottom */}
                                <div className="flex-1 flex flex-col justify-start items-stretch">
                                  {!isPositive && (
                                    <div className="w-full rounded-b-md transition-all duration-300 bg-red-500 hover:bg-red-400 active:bg-red-600 cursor-pointer"
                                      style={{
                                        height: `${heightPercent}%`,
                                        minHeight: pnl < 0 ? '2px' : '0'
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* ✅ FIXED: X-axis labels with rotation */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                      {(() => {
                        const dates = Object.keys(dailyPnL).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                        const step = Math.max(1, Math.floor(dates.length / (isMobile ? 5 : 8)));
                        return dates
                          .filter((_, i) => i % step === 0 || i === dates.length - 1)
                          .map((date) => (
                            <div key={date} className={`text-[9px] sm:text-[10px] md:text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                              style={{ transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                              {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
              <div className={`text-[10px] sm:text-xs mb-0.5 sm:mb-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Avg Win
              </div>
              <div className="text-sm sm:text-base font-bold text-green-500">
                ₹{(() => {
                  const wins = Object.values(dailyPnL).filter(p => p > 0);
                  const avgWin = wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
                  return avgWin.toLocaleString('en-IN', { maximumFractionDigits: 0 });
                })()}
              </div>
            </div>
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
              <div className={`text-[10px] sm:text-xs mb-0.5 sm:mb-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Best Day
              </div>
              <div className="text-sm sm:text-base font-bold text-green-500">
                ₹{Math.max(...Object.values(dailyPnL), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
              <div className={`text-[10px] sm:text-xs mb-0.5 sm:mb-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Worst Day
              </div>
              <div className="text-sm sm:text-base font-bold text-red-500">
                ₹{Math.abs(Math.min(...Object.values(dailyPnL), 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Win/Loss Analysis */}
          <div className={`rounded-xl border p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Win/Loss Analysis
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <span className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Average Win</span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-green-500">₹{avgWin.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <span className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Average Loss</span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-red-500">₹{avgLoss.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <span className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Largest Win</span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-green-500">₹{largestWin.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <span className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Largest Loss</span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-red-500">₹{Math.abs(largestLoss).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Instrument Breakdown */}
          <div className={`rounded-xl border p-3 sm:p-4 md:p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              By Instrument
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              {Object.entries(instrumentBreakdown)
                .sort(([, a], [, b]) => b.pnl - a.pnl)
                .map(([instrument, data]) => (
                  <div key={instrument} className={`p-2.5 sm:p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-medium capitalize ${isDark ? "text-white" : "text-slate-900"}`}>
                        {instrument}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${data.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ₹{Math.abs(data.pnl).toFixed(2)}
                      </span>
                    </div>
                    <div className={`text-[10px] sm:text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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