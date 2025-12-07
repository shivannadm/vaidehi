// src/app/dashboard/trading/journal/components/TradeRow.tsx
"use client";

import type { TradeWithStrategy } from "@/types/database";
import { formatIndianCurrency } from "@/types/database";

interface TradeRowProps {
  trade: TradeWithStrategy;
  isDark: boolean;
  onClick?: () => void;
}

export default function TradeRow({ trade, isDark, onClick }: TradeRowProps) {
  const isProfit = (trade.pnl || 0) >= 0;
  const pnlPercent = trade.pnl_percentage || 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate bar width based on P&L percentage (scale 0-100%)
  const barWidth = Math.min(Math.abs(pnlPercent) * 3, 100);

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
        <div className={`text-sm font-semibold whitespace-nowrap min-w-[90px] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {formatDate(trade.entry_date)}
        </div>

        {/* Symbol & Type */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
            {trade.symbol}
          </div>
          <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {trade.instrument_type.charAt(0).toUpperCase() + trade.instrument_type.slice(1)}
          </div>
        </div>

        {/* P&L Bar - Desktop only, with indicators */}
        <div className="hidden md:flex items-center gap-2 flex-1 min-w-[200px] max-w-[300px]">
          {/* Small circle indicator before bar */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isProfit ? "bg-green-500" : "bg-red-500"
          }`} />
          
          {/* Progress bar */}
          <div className={`flex-1 h-2 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}>
            <div
              className={`h-full transition-all ${isProfit ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* P&L Amount */}
        <div className="text-right min-w-[100px]">
          <div className={`text-base md:text-lg font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
            {trade.pnl ? formatIndianCurrency(trade.pnl) : "—"}
          </div>
          {trade.pnl_percentage !== null && (
            <div className={`text-xs md:text-sm ${isProfit ? "text-green-400" : "text-red-400"}`}>
              {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      {/* Mobile P&L Bar - Below on mobile */}
      <div className="md:hidden mt-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isProfit ? "bg-green-500" : "bg-red-500"
        }`} />
        <div className={`flex-1 h-2 rounded-full overflow-hidden ${
          isDark ? "bg-slate-700" : "bg-slate-200"
        }`}>
          <div
            className={`h-full transition-all ${isProfit ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </button>
  );
}