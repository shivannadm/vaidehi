// src/app/dashboard/trading/journal/components/TradeListItem.tsx
"use client";

import { ChevronRight } from "lucide-react";
import { formatIndianCurrency } from "@/types/database";
import type { TradesByDate } from "@/lib/supabase/trading-helpers";

interface TradeListItemProps {
  dayData: TradesByDate;
  onClick: () => void;
  isDark: boolean;
}

export default function TradeListItem({ dayData, onClick, isDark }: TradeListItemProps) {
  const date = new Date(dayData.date);
  const dateStr = date.toLocaleDateString('en-IN', { 
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const isProfit = dayData.total_pnl >= 0;
  const pnlPercentage = dayData.trades[0]?.pnl_percentage || 0;

  // Get first trade details for display
  const firstTrade = dayData.trades[0];
  const symbol = firstTrade?.symbol || "";
  const instrument = firstTrade?.instrument_type || "";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 transition-all hover:shadow-lg ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Date and Trade Info */}
        <div className="flex-1 text-left space-y-1">
          <div className={`text-sm md:text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            {dateStr}
          </div>
          <div className={`text-xs md:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {symbol} • {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
          </div>
        </div>

        {/* Middle: P&L Bar (only on desktop) */}
        <div className="hidden md:block flex-1">
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className={`h-full transition-all ${
                isProfit ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(Math.abs(pnlPercentage) * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Right: P&L Amount */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-base md:text-lg font-bold ${
              isProfit ? "text-green-500" : "text-red-500"
            }`}>
              {formatIndianCurrency(dayData.total_pnl)}
            </div>
            <div className={`text-xs md:text-sm ${
              isProfit ? "text-green-400" : "text-red-400"
            }`}>
              {isProfit ? "+" : ""}{pnlPercentage.toFixed(2)}%
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        </div>
      </div>
    </button>
  );
}