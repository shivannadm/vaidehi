"use client";

import type { TradeWithStrategy } from "@/types/database";
import { formatIndianCurrency } from "@/types/database";

interface DailyTradeRowProps {
  date: string;
  trades: TradeWithStrategy[];
  isDark: boolean;
  onClick: () => void;
}

export default function DailyTradeRow({ date, trades, isDark, onClick }: DailyTradeRowProps) {
  // Calculate daily totals
  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgPnLPercent = trades.reduce((sum, t) => sum + (t.pnl_percentage || 0), 0) / trades.length;
  const tradeCount = trades.length;
  const firstTrade = trades[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const barWidth = Math.min(Math.abs(avgPnLPercent) * 2, 100);

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 transition-all text-left ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4">
        {/* Date */}
        <div className={`text-sm font-semibold whitespace-nowrap min-w-[100px] ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}>
          {formatDate(date)}
        </div>

        {/* Trade Info */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
            {tradeCount} trade{tradeCount > 1 ? 's' : ''}
          </div>
          <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {firstTrade.symbol} • {firstTrade.instrument_type.charAt(0).toUpperCase() + firstTrade.instrument_type.slice(1)}
          </div>
        </div>

        {/* P&L Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 flex-1 min-w-[200px] max-w-[300px]">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            totalPnL >= 0 ? "bg-green-500" : "bg-red-500"
          }`} />
          
          <div className={`flex-1 h-2 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}>
            <div
              className={`h-full transition-all ${totalPnL >= 0 ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* P&L Amount */}
        <div className="text-right min-w-[110px]">
          <div className={`text-base md:text-lg font-bold ${
            totalPnL >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            {formatIndianCurrency(totalPnL)}
          </div>
          <div className={`text-xs md:text-sm ${
            totalPnL >= 0 ? "text-green-400" : "text-red-400"
          }`}>
            {totalPnL >= 0 ? "+" : ""}{avgPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Mobile P&L Bar */}
      <div className="md:hidden mt-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          totalPnL >= 0 ? "bg-green-500" : "bg-red-500"
        }`} />
        <div className={`flex-1 h-2 rounded-full overflow-hidden ${
          isDark ? "bg-slate-700" : "bg-slate-200"
        }`}>
          <div
            className={`h-full transition-all ${totalPnL >= 0 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </button>
  );
}
