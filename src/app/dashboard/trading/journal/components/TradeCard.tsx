// src/app/dashboard/trading/journal/components/TradeCard.tsx
"use client";

import { useState } from "react";
import { Edit2, Trash2, TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react";
import type { TradeWithStrategy } from "@/types/database";
import { getInstrumentIcon, getCountryFlag, formatCurrency, formatPercentage, getPnLColor } from "@/types/database";

interface TradeCardProps {
  trade: TradeWithStrategy;
  onEdit: (trade: TradeWithStrategy) => void;
  onDelete: (tradeId: string) => void;
  onClose: (trade: TradeWithStrategy) => void;
  isDark: boolean;
}

export default function TradeCard({ trade, onEdit, onDelete, onClose, isDark }: TradeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete trade ${trade.symbol}?`)) return;

    setIsDeleting(true);
    await onDelete(trade.id);
    setIsDeleting(false);
  };

  const isProfit = (trade.pnl || 0) >= 0;
  const pnlColor = getPnLColor(trade.pnl || 0);

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getInstrumentIcon(trade.instrument_type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {trade.symbol}
              </h3>
              <span className="text-lg">
                {getCountryFlag(trade.country)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trade.side === "long"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {trade.side.toUpperCase()}
              </span>
            </div>
            {trade.setup_name && (
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {trade.setup_name}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(trade);
            }}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
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
            disabled={isDeleting}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "hover:bg-red-900/30 text-red-400"
                : "hover:bg-red-50 text-red-600"
            } disabled:opacity-50`}
            title="Delete trade"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trade Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Entry Price */}
        <div>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Entry
          </div>
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            ${trade.entry_price.toFixed(2)}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            Qty: {trade.quantity}
          </div>
        </div>

        {/* Exit Price */}
        <div>
          <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Exit
          </div>
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : "—"}
          </div>
          {trade.is_closed && (
            <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              {trade.exit_date}
            </div>
          )}
        </div>
      </div>

      {/* P&L Display */}
      {trade.is_closed && trade.pnl !== null && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            isProfit
              ? isDark
                ? "bg-green-900/20 border border-green-500/30"
                : "bg-green-50 border border-green-200"
              : isDark
              ? "bg-red-900/20 border border-red-500/30"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${pnlColor}`}>P&L</span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${pnlColor}`}>
                {formatCurrency(trade.pnl, 'USD')}
              </div>
              {trade.pnl_percentage !== null && (
                <div className={`text-sm ${pnlColor}`}>
                  {formatPercentage(trade.pnl_percentage)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entry Date */}
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          <span className={isDark ? "text-slate-300" : "text-slate-600"}>
            {trade.entry_date}
          </span>
        </div>
        {trade.entry_time && (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            <span className={isDark ? "text-slate-300" : "text-slate-600"}>
              {trade.entry_time}
            </span>
          </div>
        )}
      </div>

      {/* Strategy Badge */}
      {trade.strategy && (
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isDark
                ? "bg-indigo-900/30 text-indigo-300 border border-indigo-500/30"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
            }`}
          >
            📊 {trade.strategy.name}
          </span>
        </div>
      )}

      {/* Status / Action */}
      <div className="pt-4 border-t border-slate-700">
        {trade.is_closed ? (
          <div
            className={`text-center py-2 rounded-lg font-medium ${
              isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
            }`}
          >
            ✓ Closed Trade
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(trade);
            }}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Close Trade
          </button>
        )}
      </div>
    </div>
  );
}