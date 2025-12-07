// src/app/dashboard/trading/journal/components/CloseTradeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getActiveRulesForSelection } from "@/lib/supabase/trading-helpers";
import { formatIndianCurrency, calculatePnL } from "@/types/database";
import type { TradeWithStrategy, TradingRule } from "@/types/database";

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseTrade: (tradeId: string, exitDetails: any) => Promise<{ success: boolean }>;
  trade: TradeWithStrategy | null;
  isDark: boolean;
}

export default function CloseTradeModal({ isOpen, onClose, onCloseTrade, trade, isDark }: CloseTradeModalProps) {
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitTime, setExitTime] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [postTradeNotes, setPostTradeNotes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [rulesBroken, setRulesBroken] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && trade) {
      fetchRules();
      setExitDate(new Date().toISOString().split('T')[0]);
      setExitTime("");
      setExitPrice("");
      setPostTradeNotes("");
      setLessonsLearned("");
      setRulesBroken([]);
    }
  }, [isOpen, trade]);

  const fetchRules = async () => {
    if (!trade) return;
    const { data } = await getActiveRulesForSelection(trade.user_id);
    setRules(data || []);
  };

  const toggleRuleBroken = (ruleId: string) => {
    if (rulesBroken.includes(ruleId)) {
      setRulesBroken(rulesBroken.filter(id => id !== ruleId));
    } else {
      setRulesBroken([...rulesBroken, ruleId]);
    }
  };

  const calculatePnLDisplay = () => {
    if (!trade || !exitPrice) return null;
    
    const result = calculatePnL(
      trade.side,
      trade.entry_price,
      parseFloat(exitPrice),
      trade.quantity,
      trade.commission,
      trade.fees
    );
    
    return result;
  };

  const pnlData = calculatePnLDisplay();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trade || !exitPrice) {
      alert("Please enter exit price");
      return;
    }

    setIsSaving(true);

    const result = await onCloseTrade(trade.id, {
      exit_date: exitDate,
      exit_time: exitTime || undefined,
      exit_price: parseFloat(exitPrice),
      post_trade_notes: postTradeNotes.trim() || undefined,
      lessons_learned: lessonsLearned.trim() || undefined,
      rules_broken: rulesBroken.length > 0 ? rulesBroken : undefined,
    });

    setIsSaving(false);

    if (result.success) {
      onClose();
    } else {
      alert("Failed to close trade. Please try again.");
    }
  };

  if (!isOpen || !trade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className={`w-full max-w-2xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <div>
            <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Close Trade: {trade.symbol}
            </h2>
            <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Entry: {formatIndianCurrency(trade.entry_price)} • Qty: {trade.quantity}
            </p>
          </div>
          <button onClick={onClose} disabled={isSaving} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"} disabled:opacity-50`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Exit Price & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Exit Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="₹0.00"
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Exit Date *
              </label>
              <input
                type="date"
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
              />
            </div>
          </div>

          {/* P&L Preview */}
          {pnlData && (
            <div className={`p-4 rounded-lg border ${
              pnlData.pnl >= 0
                ? isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"
                : isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${pnlData.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                  Estimated P&L
                </span>
                <div className="text-right">
                  <div className={`text-xl md:text-2xl font-bold ${pnlData.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatIndianCurrency(pnlData.pnl)}
                  </div>
                  <div className={`text-sm ${pnlData.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {pnlData.pnl_percentage >= 0 ? "+" : ""}{pnlData.pnl_percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rules Broken (Optional) */}
          {rules.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Rules Broken During Exit (Optional)
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {rules.map((rule) => (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => toggleRuleBroken(rule.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      rulesBroken.includes(rule.id)
                        ? "bg-red-600 text-white"
                        : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{rule.title}</span>
                      {rulesBroken.includes(rule.id) && <span>✗</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Post-Trade Notes (Optional)
            </label>
            <textarea
              value={postTradeNotes}
              onChange={(e) => setPostTradeNotes(e.target.value)}
              placeholder="What happened during the trade?"
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border resize-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Lessons Learned (Optional)
            </label>
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              placeholder="What did you learn from this trade?"
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border resize-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-200 text-slate-900 hover:bg-slate-300"} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Closing..." : "Close Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}