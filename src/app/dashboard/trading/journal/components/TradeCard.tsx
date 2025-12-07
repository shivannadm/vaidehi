// src/app/dashboard/trading/journal/components/TradeCard.tsx
"use client";

import { Edit2, Trash2, TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { formatIndianCurrency, getInstrumentIcon } from "@/types/database";
import type { TradeWithStrategy } from "@/types/database";

interface TradeCardProps {
  trade: TradeWithStrategy;
  onEdit: (trade: TradeWithStrategy) => void;
  onDelete: (tradeId: string) => void;
  onClose: (trade: TradeWithStrategy) => void;
  isDark: boolean;
}

export default function TradeCard({
  trade,
  onEdit,
  onDelete,
  onClose,
  isDark,
}: TradeCardProps) {
  const isProfit = (trade.pnl || 0) >= 0;
  const isClosed = trade.is_closed;

  const handleDelete = async () => {
    if (!confirm(`Delete trade for ${trade.symbol}?`)) return;
    await onDelete(trade.id);
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all hover:shadow-lg ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getInstrumentIcon(trade.instrument_type)}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {trade.symbol}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  trade.side === "long"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {trade.side.toUpperCase()}
              </span>
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {trade.instrument_type.charAt(0).toUpperCase() + trade.instrument_type.slice(1)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            isClosed
              ? isDark
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-50 text-blue-600"
              : isDark
              ? "bg-orange-900/30 text-orange-400"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {isClosed ? "Closed" : "Open"}
        </span>
      </div>

      {/* P&L Display (if closed) */}
      {isClosed && trade.pnl !== null && (
        <div
          className={`p-4 rounded-lg mb-4 border ${
            isProfit
              ? isDark
                ? "bg-green-900/20 border-green-500/30"
                : "bg-green-50 border-green-200"
              : isDark
              ? "bg-red-900/20 border-red-500/30"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}>
                {isProfit ? "Profit" : "Loss"}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                {formatIndianCurrency(trade.pnl)}
              </div>
              {trade.pnl_percentage !== null && (
                <div className={`text-sm ${isProfit ? "text-green-400" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}{trade.pnl_percentage.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trade Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Entry Price
          </div>
          <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {formatIndianCurrency(trade.entry_price)}
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {isClosed ? "Exit Price" : "Current"}
          </div>
          <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {trade.exit_price ? formatIndianCurrency(trade.exit_price) : "—"}
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Quantity
          </div>
          <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {trade.quantity}
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Entry Date
          </div>
          <div className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
            {new Date(trade.entry_date).toLocaleDateString('en-IN', { 
              day: '2-digit', 
              month: 'short' 
            })}
          </div>
        </div>
      </div>

      {/* Strategy Badge (if exists) */}
      {trade.strategy && (
        <div
          className={`px-3 py-2 rounded-lg mb-4 text-sm ${
            isDark
              ? "bg-indigo-900/20 text-indigo-300 border border-indigo-500/30"
              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">{trade.strategy.name}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
        {!isClosed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(trade);
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isDark
                ? "bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            Close Trade
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(trade);
          }}
          className={`${isClosed ? "flex-1" : ""} p-2 rounded-lg transition ${
            isDark
              ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          title="Edit trade"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className={`p-2 rounded-lg transition ${
            isDark
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          title="Delete trade"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}