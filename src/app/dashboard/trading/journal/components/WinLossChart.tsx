// src/app/dashboard/trading/journal/components/WinLossChart.tsx
"use client";

import { useState } from "react";
import type { TradeWithStrategy } from "@/types/database";

interface WinLossChartProps {
    trades: TradeWithStrategy[];
    isDark: boolean;
}

export default function WinLossChart({ trades, isDark }: WinLossChartProps) {
    const [hoveredSegment, setHoveredSegment] = useState<'win' | 'loss' | null>(null);

    // Calculate win/loss stats
    const closedTrades = trades.filter(t => t.is_closed);
    const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
    const losses = closedTrades.filter(t => (t.pnl || 0) <= 0);

    const winCount = wins.length;
    const lossCount = losses.length;
    const totalCount = closedTrades.length;

    const winPercentage = totalCount > 0 ? (winCount / totalCount) * 100 : 0;
    const lossPercentage = totalCount > 0 ? (lossCount / totalCount) * 100 : 0;

    // Calculate total P&L for wins and losses
    const totalWinPnL = wins.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLossPnL = Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0));

    if (totalCount === 0) {
        return (
            <div className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}>
                <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Win/Loss Distribution
                </h3>
                <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <p className="text-sm">No closed trades yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <h3 className={`text-sm font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Win/Loss Distribution
            </h3>

            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-4 relative">
                <div className="relative w-36 h-36">
                    {/* Tooltip */}
                    {hoveredSegment && (
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-3 py-2 rounded-lg shadow-xl border whitespace-nowrap z-50 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                            }`}>
                            <div className={`text-xs font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"
                                }`}>
                                {hoveredSegment === 'win' ? 'Winning Trades' : 'Losing Trades'}
                            </div>
                            <div className={`text-lg font-bold ${hoveredSegment === 'win' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {hoveredSegment === 'win' ? winCount : lossCount} trade{(hoveredSegment === 'win' ? winCount : lossCount) > 1 ? 's' : ''}
                            </div>
                            <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                ₹{(hoveredSegment === 'win' ? totalWinPnL : totalLossPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}

                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={isDark ? "#1e293b" : "#f1f5f9"}
                            strokeWidth="20"
                        />

                        {/* Win segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="20"
                            strokeDasharray={`${(winPercentage / 100) * 251.2} 251.2`}
                            strokeLinecap="round"
                            className="cursor-pointer transition-all hover:stroke-[22] hover:brightness-110"
                            onMouseEnter={() => setHoveredSegment('win')}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />

                        {/* Loss segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                            strokeDasharray={`${(lossPercentage / 100) * 251.2} 251.2`}
                            strokeDashoffset={`-${(winPercentage / 100) * 251.2}`}
                            strokeLinecap="round"
                            className="cursor-pointer transition-all hover:stroke-[22] hover:brightness-110"
                            onMouseEnter={() => setHoveredSegment('loss')}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {winPercentage.toFixed(0)}%
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Win Rate
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
                {/* Wins */}
                <div
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${hoveredSegment === 'win'
                        ? isDark ? 'bg-green-900/20' : 'bg-green-50'
                        : ''
                        }`}
                    onMouseEnter={() => setHoveredSegment('win')}
                    onMouseLeave={() => setHoveredSegment(null)}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            Wins
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-green-500">
                            {winCount}
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            ₹{totalWinPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                {/* Losses */}
                <div
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${hoveredSegment === 'loss'
                        ? isDark ? 'bg-red-900/20' : 'bg-red-50'
                        : ''
                        }`}
                    onMouseEnter={() => setHoveredSegment('loss')}
                    onMouseLeave={() => setHoveredSegment(null)}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            Losses
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-red-500">
                            {lossCount}
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            ₹{totalLossPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                {/* Horizontal bar */}
                <div className="pt-2">
                    <div className={`h-2 rounded-full overflow-hidden flex ${isDark ? "bg-slate-700" : "bg-slate-200"
                        }`}>
                        <div
                            className="bg-green-500 transition-all duration-500"
                            style={{ width: `${winPercentage}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all duration-500"
                            style={{ width: `${lossPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}