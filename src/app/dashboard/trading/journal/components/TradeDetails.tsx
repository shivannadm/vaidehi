// src/app/dashboard/trading/journal/components/TradeDetails.tsx
"use client";

import { X, TrendingUp, TrendingDown, Calendar, Clock, DollarSign, Target, AlertTriangle } from "lucide-react";
import type { TradeWithStrategy } from "@/types/database";
import { getInstrumentIcon, getCountryFlag, formatCurrency, formatPercentage, getPnLColor } from "@/types/database";

interface TradeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeWithStrategy | null;
  isDark: boolean;
}

export default function TradeDetails({ isOpen, onClose, trade, isDark }: TradeDetailsProps) {
  if (!isOpen || !trade) return null;

  const isProfit = (trade.pnl || 0) >= 0;
  const pnlColor = getPnLColor(trade.pnl || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getInstrumentIcon(trade.instrument_type)}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {trade.symbol}
                </h2>
                <span className="text-2xl">{getCountryFlag(trade.country)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.side === "long"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {trade.side.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.is_closed
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-orange-500/20 text-orange-500"
                  }`}
                >
                  {trade.is_closed ? "Closed" : "Open"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* P&L Display (if closed) */}
          {trade.is_closed && trade.pnl !== null && (
            <div
              className={`p-6 rounded-xl ${
                isProfit
                  ? isDark
                    ? "bg-green-900/20 border-2 border-green-500/30"
                    : "bg-green-50 border-2 border-green-200"
                  : isDark
                  ? "bg-red-900/20 border-2 border-red-500/30"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isProfit ? (
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <div className={`text-sm font-medium ${pnlColor}`}>Profit & Loss</div>
                    <div className={`text-3xl font-bold ${pnlColor}`}>
                      {formatCurrency(trade.pnl, "USD")}
                    </div>
                  </div>
                </div>
                {trade.pnl_percentage !== null && (
                  <div className="text-right">
                    <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Return
                    </div>
                    <div className={`text-2xl font-bold ${pnlColor}`}>
                      {formatPercentage(trade.pnl_percentage)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trade Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Entry Details */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-slate-700/50" : "bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Entry
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Price:
                  </span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    ${trade.entry_price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Quantity:
                  </span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {trade.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Date:
                  </span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {trade.entry_date}
                  </span>
                </div>
                {trade.entry_time && (
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Time:
                    </span>
                    <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {trade.entry_time}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Exit Details */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-slate-700/50" : "bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Exit
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Price:
                  </span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Date:
                  </span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {trade.exit_date || "—"}
                  </span>
                </div>
                {trade.exit_time && (
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Time:
                    </span>
                    <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {trade.exit_time}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Management */}
            {(trade.stop_loss || trade.take_profit) && (
              <div
                className={`col-span-2 p-4 rounded-xl ${
                  isDark ? "bg-slate-700/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className={`w-5 h-5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                  <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Risk Management
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {trade.stop_loss && (
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Stop Loss:
                      </span>
                      <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        ${trade.stop_loss.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {trade.take_profit && (
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Take Profit:
                      </span>
                      <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        ${trade.take_profit.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Strategy Badge */}
          {trade.strategy && (
            <div
              className={`p-4 rounded-xl ${isDark ? "bg-indigo-900/30 border border-indigo-500/30" : "bg-indigo-50 border border-indigo-200"}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <div>
                  <div className={`text-xs ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>
                    Strategy
                  </div>
                  <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {trade.strategy.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup Name */}
          {trade.setup_name && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Setup
              </h3>
              <div
                className={`p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {trade.setup_name}
                </p>
              </div>
            </div>
          )}

          {/* Pre-Trade Notes */}
          {trade.pre_trade_notes && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Pre-Trade Analysis
              </h3>
              <div
                className={`p-4 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {trade.pre_trade_notes}
                </p>
              </div>
            </div>
          )}

          {/* Post-Trade Notes */}
          {trade.post_trade_notes && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Post-Trade Review
              </h3>
              <div
                className={`p-4 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {trade.post_trade_notes}
                </p>
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {trade.lessons_learned && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Lessons Learned
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-yellow-900/20 border border-yellow-500/30" : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-yellow-200" : "text-yellow-900"}`}>
                  {trade.lessons_learned}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}