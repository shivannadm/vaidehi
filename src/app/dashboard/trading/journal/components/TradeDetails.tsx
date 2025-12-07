// src/app/dashboard/trading/journal/components/TradeDetails.tsx
"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, Calendar, Target, Shield } from "lucide-react";
import { getTradeWithDetails } from "@/lib/supabase/trading-helpers";
import { formatIndianCurrency, getInstrumentIcon } from "@/types/database";
import type { TradeWithStrategy, TradingRule } from "@/types/database";

interface TradeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeWithStrategy | null;
  isDark: boolean;
}

interface TradeWithRules extends TradeWithStrategy {
  followed_rules?: TradingRule[];
  broken_rules?: TradingRule[];
}

export default function TradeDetails({ isOpen, onClose, trade, isDark }: TradeDetailsProps) {
  const [tradeWithRules, setTradeWithRules] = useState<TradeWithRules | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && trade) {
      fetchTradeDetails();
    }
  }, [isOpen, trade]);

  const fetchTradeDetails = async () => {
    if (!trade) return;
    
    setLoading(true);
    const { data } = await getTradeWithDetails(trade.id);
    setTradeWithRules(data);
    setLoading(false);
  };

  if (!isOpen || !trade) return null;

  const displayTrade = tradeWithRules || trade;
  const isProfit = (displayTrade.pnl || 0) >= 0;
  const pnlPercentage = displayTrade.pnl_percentage ?? 0; // Fixed: Added null coalescing

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className={`w-full max-w-3xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getInstrumentIcon(displayTrade.instrument_type)}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {displayTrade.symbol}
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  displayTrade.side === "long" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}>
                  {displayTrade.side.toUpperCase()}
                </span>
              </div>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {displayTrade.instrument_type.charAt(0).toUpperCase() + displayTrade.instrument_type.slice(1)}
                {displayTrade.setup_name && ` • ${displayTrade.setup_name}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* P&L Card */}
          {displayTrade.is_closed && displayTrade.pnl !== null && (
            <div className={`p-6 rounded-xl border ${
              isProfit
                ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
                : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isProfit ? <TrendingUp className="w-8 h-8 text-green-500" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
                  <div>
                    <div className={`text-sm ${isProfit ? "text-green-500" : "text-red-500"}`}>
                      {isProfit ? "Profit" : "Loss"}
                    </div>
                    <div className={`text-3xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                      {formatIndianCurrency(displayTrade.pnl)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
                    {pnlPercentage >= 0 ? "+" : ""}{pnlPercentage.toFixed(2)}%
                  </div>
                  <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Return
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trade Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Entry</div>
              <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatIndianCurrency(displayTrade.entry_price)}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Exit</div>
              <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {displayTrade.exit_price ? formatIndianCurrency(displayTrade.exit_price) : "—"}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Quantity</div>
              <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {displayTrade.quantity}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status</div>
              <div className={`text-lg font-bold ${displayTrade.is_closed ? "text-blue-500" : "text-orange-500"}`}>
                {displayTrade.is_closed ? "Closed" : "Open"}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={`p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Entry: {displayTrade.entry_date}
                </span>
              </div>
              {displayTrade.is_closed && displayTrade.exit_date && (
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Exit: {displayTrade.exit_date}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Strategy */}
          {displayTrade.strategy && (
            <div className={`p-4 rounded-lg border ${isDark ? "bg-indigo-900/20 border-indigo-500/30" : "bg-indigo-50 border-indigo-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <span className={`font-semibold ${isDark ? "text-indigo-300" : "text-indigo-900"}`}>Strategy</span>
              </div>
              <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {displayTrade.strategy.name}
              </div>
              {displayTrade.strategy.description && (
                <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {displayTrade.strategy.description}
                </p>
              )}
            </div>
          )}

          {/* Rules Followed */}
          {tradeWithRules?.followed_rules && tradeWithRules.followed_rules.length > 0 && (
            <div className={`p-4 rounded-lg border ${isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <span className={`font-semibold ${isDark ? "text-green-300" : "text-green-900"}`}>
                  Rules Followed ({tradeWithRules.followed_rules.length})
                </span>
              </div>
              <div className="space-y-2">
                {tradeWithRules.followed_rules.map((rule) => (
                  <div key={rule.id} className={`text-sm px-3 py-2 rounded ${isDark ? "bg-green-900/30" : "bg-green-100"}`}>
                    ✓ {rule.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Broken */}
          {tradeWithRules?.broken_rules && tradeWithRules.broken_rules.length > 0 && (
            <div className={`p-4 rounded-lg border ${isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <span className={`font-semibold ${isDark ? "text-red-300" : "text-red-900"}`}>
                  Rules Broken ({tradeWithRules.broken_rules.length})
                </span>
              </div>
              <div className="space-y-2">
                {tradeWithRules.broken_rules.map((rule) => (
                  <div key={rule.id} className={`text-sm px-3 py-2 rounded ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
                    ✗ {rule.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {displayTrade.pre_trade_notes && (
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Pre-Trade Notes</h3>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{displayTrade.pre_trade_notes}</p>
            </div>
          )}
          {displayTrade.post_trade_notes && (
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Post-Trade Notes</h3>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{displayTrade.post_trade_notes}</p>
            </div>
          )}
          {displayTrade.lessons_learned && (
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Lessons Learned</h3>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{displayTrade.lessons_learned}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 md:p-6 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <button onClick={onClose} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}