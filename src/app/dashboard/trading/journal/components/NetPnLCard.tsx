"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { formatIndianCurrency } from "@/types/database";

interface NetPnLCardProps {
  netPnL: number;
  isDark: boolean;
}

export default function NetPnLCard({ netPnL, isDark }: NetPnLCardProps) {
  return (
    <div className={`rounded-xl border p-6 ${
      netPnL >= 0
        ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
        : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {netPnL >= 0 ? (
            <TrendingUp className="w-8 h-8 text-green-500" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-500" />
          )}
          <div>
            <div className={`text-sm ${netPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
              Net P&L
            </div>
            <div className={`text-3xl font-bold ${netPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatIndianCurrency(netPnL)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
