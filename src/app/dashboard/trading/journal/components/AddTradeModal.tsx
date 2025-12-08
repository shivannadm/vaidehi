// src/app/dashboard/trading/journal/components/AddTradeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getActiveRulesForSelection, getStrategies } from "@/lib/supabase/trading-helpers";
import type { InstrumentType, TradeSide, TradingRule, Strategy } from "@/types/database";

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: any) => Promise<{ success: boolean }>;
  userId: string;
  isDark: boolean;
  prefilledDate?: string;
}

const INSTRUMENTS: Array<{ value: InstrumentType; label: string; icon: string }> = [
  { value: "stock", label: "Stock", icon: "📈" },
  { value: "futures", label: "Futures", icon: "⏳" },
  { value: "options", label: "Options", icon: "📊" },
  { value: "forex", label: "Forex", icon: "💱" },
  { value: "commodity", label: "Commodity", icon: "🥇" },
  { value: "currency", label: "Currency", icon: "💰" },
];

export default function AddTradeModal({ isOpen, onClose, onAdd, userId, isDark, prefilledDate }: AddTradeModalProps) {
  const [symbol, setSymbol] = useState("");
  const [instrumentType, setInstrumentType] = useState<InstrumentType>("stock");
  const [side, setSide] = useState<TradeSide>("long");
  const [entryDate, setEntryDate] = useState(prefilledDate || new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [optionExpiry, setOptionExpiry] = useState("");
  const [optionStrike, setOptionStrike] = useState("");
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [rulesFollowed, setRulesFollowed] = useState<string[]>([]);
  const [rulesBroken, setRulesBroken] = useState<string[]>([]);
  const [setupName, setSetupName] = useState("");
  const [preTradeNotes, setPreTradeNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (prefilledDate) {
      setEntryDate(prefilledDate);
    }
  }, [prefilledDate]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchStrategiesAndRules();
    }
  }, [isOpen, userId]);

  const fetchStrategiesAndRules = async () => {
    const [stratResult, rulesResult] = await Promise.all([
      getStrategies(userId),
      getActiveRulesForSelection(userId)
    ]);
    
    setStrategies(stratResult.data || []);
    setRules(rulesResult.data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol.trim() || !entryPrice || !quantity) {
      alert("Please fill: Symbol, Entry Price, and Quantity");
      return;
    }

    const overlap = rulesFollowed.filter(id => rulesBroken.includes(id));
    if (overlap.length > 0) {
      alert("A rule cannot be both followed and broken!");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      
      // Insert trade directly
      const { data: trade, error } = await supabase
        .from("trades")
        .insert({
          user_id: userId,
          symbol: symbol.trim().toUpperCase(),
          instrument_type: instrumentType,
          side,
          entry_date: entryDate,
          entry_time: entryTime || null,
          entry_price: parseFloat(entryPrice),
          quantity: parseFloat(quantity),
          stop_loss: stopLoss ? parseFloat(stopLoss) : null,
          take_profit: takeProfit ? parseFloat(takeProfit) : null,
          commission: 0,
          fees: 0,
          strategy_id: selectedStrategy || null,
          setup_name: setupName.trim() || null,
          pre_trade_notes: preTradeNotes.trim() || null,
          rules_followed: rulesFollowed.length > 0 ? rulesFollowed : null,
          rules_broken: rulesBroken.length > 0 ? rulesBroken : null,
          option_expiry: instrumentType === "options" && optionExpiry ? optionExpiry : null,
          option_strike: instrumentType === "options" && optionStrike ? parseFloat(optionStrike) : null,
          option_type: instrumentType === "options" ? optionType : null,
          is_closed: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Trade created successfully:", trade);

      // Call parent callback to refresh
      await onAdd(trade);
      
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating trade:", error);
      alert(`Failed to create trade: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSymbol("");
    setInstrumentType("stock");
    setSide("long");
    setEntryDate(prefilledDate || new Date().toISOString().split('T')[0]);
    setEntryTime("");
    setEntryPrice("");
    setQuantity("");
    setStopLoss("");
    setTakeProfit("");
    setOptionExpiry("");
    setOptionStrike("");
    setOptionType("call");
    setSelectedStrategy("");
    setRulesFollowed([]);
    setRulesBroken([]);
    setSetupName("");
    setPreTradeNotes("");
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  const toggleRuleFollowed = (ruleId: string) => {
    if (rulesFollowed.includes(ruleId)) {
      setRulesFollowed(rulesFollowed.filter(id => id !== ruleId));
    } else {
      setRulesFollowed([...rulesFollowed, ruleId]);
      setRulesBroken(rulesBroken.filter(id => id !== ruleId));
    }
  };

  const toggleRuleBroken = (ruleId: string) => {
    if (rulesBroken.includes(ruleId)) {
      setRulesBroken(rulesBroken.filter(id => id !== ruleId));
    } else {
      setRulesBroken([...rulesBroken, ruleId]);
      setRulesFollowed(rulesFollowed.filter(id => id !== ruleId));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className={`w-full max-w-2xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
        <div className={`flex items-center justify-between p-4 md:p-6 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Log New Trade</h2>
          <button onClick={handleClose} disabled={isSaving} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"} disabled:opacity-50`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Instrument *</label>
              <select value={instrumentType} onChange={(e) => setInstrumentType(e.target.value as InstrumentType)} className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
                {INSTRUMENTS.map((inst) => (
                  <option key={inst.value} value={inst.value}>{inst.icon} {inst.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Side *</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSide("long")} className={`flex-1 py-2.5 rounded-lg font-medium transition ${side === "long" ? "bg-green-600 text-white" : isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>Long</button>
                <button type="button" onClick={() => setSide("short")} className={`flex-1 py-2.5 rounded-lg font-medium transition ${side === "short" ? "bg-red-600 text-white" : isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>Short</button>
              </div>
            </div>

            {/* Option Type - Show for Options */}
            {instrumentType === "options" && (
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Option Type *</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOptionType("call")} className={`flex-1 py-2.5 rounded-lg font-medium transition ${optionType === "call" ? "bg-blue-600 text-white" : isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>CALL</button>
                  <button type="button" onClick={() => setOptionType("put")} className={`flex-1 py-2.5 rounded-lg font-medium transition ${optionType === "put" ? "bg-purple-600 text-white" : isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>PUT</button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Symbol *</label>
              <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="RELIANCE" required className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Entry Price *</label>
              <input type="number" step="0.01" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="₹0.00" required className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Quantity *</label>
              <input type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="100" required className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Entry Date *</label>
              <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`} />
            </div>
          </div>

          {instrumentType === "options" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Expiry</label>
                <input type="date" value={optionExpiry} onChange={(e) => setOptionExpiry(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Strike</label>
                <input type="number" step="0.01" value={optionStrike} onChange={(e) => setOptionStrike(e.target.value)} placeholder="₹0.00" className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Type</label>
                <select value={optionType} onChange={(e) => setOptionType(e.target.value as "call" | "put")} className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
                  <option value="call">Call</option>
                  <option value="put">Put</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Strategy (Optional)</label>
            <select value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
              <option value="">Select Strategy</option>
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {rules.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Rules (Optional)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {rules.map((rule) => (
                  <div key={rule.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-50"}`}>
                    <span className={`flex-1 text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{rule.title}</span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button type="button" onClick={() => toggleRuleFollowed(rule.id)} className={`flex-1 sm:flex-none px-3 py-1 text-xs rounded ${rulesFollowed.includes(rule.id) ? "bg-green-600 text-white" : isDark ? "bg-slate-600 text-slate-300" : "bg-slate-200 text-slate-700"}`}>✓ Followed</button>
                      <button type="button" onClick={() => toggleRuleBroken(rule.id)} className={`flex-1 sm:flex-none px-3 py-1 text-xs rounded ${rulesBroken.includes(rule.id) ? "bg-red-600 text-white" : isDark ? "bg-slate-600 text-slate-300" : "bg-slate-200 text-slate-700"}`}>✗ Broken</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={handleClose} disabled={isSaving} className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-200 text-slate-900 hover:bg-slate-300"} disabled:opacity-50`}>Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50">
              {isSaving ? "Logging..." : "Log Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}