// src/app/dashboard/trading/journal/components/AddTradeModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { InstrumentType, TradeSide, CountryCode, CreateTrade } from "@/types/database";

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: CreateTrade) => Promise<{ success: boolean }>;
  userId: string;
  isDark: boolean;
}

const INSTRUMENTS: Array<{ value: InstrumentType; label: string }> = [
  { value: "stock", label: "Stock" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
  { value: "forex", label: "Forex" },
];

const COUNTRIES: Array<{ value: CountryCode; label: string }> = [
  { value: "US", label: "🇺🇸 United States" },
  { value: "IN", label: "🇮🇳 India" },
  { value: "UK", label: "🇬🇧 United Kingdom" },
  { value: "EU", label: "🇪🇺 European Union" },
  { value: "JP", label: "🇯🇵 Japan" },
  { value: "OTHER", label: "🌍 Other" },
];

export default function AddTradeModal({ isOpen, onClose, onAdd, userId, isDark }: AddTradeModalProps) {
  // Basic Info
  const [symbol, setSymbol] = useState("");
  const [instrumentType, setInstrumentType] = useState<InstrumentType>("stock");
  const [country, setCountry] = useState<CountryCode>("US");
  const [side, setSide] = useState<TradeSide>("long");
  
  // Entry Details
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  
  // Risk Management
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  
  // Costs
  const [commission, setCommission] = useState("0");
  const [fees, setFees] = useState("0");
  
  // Strategy & Notes
  const [setupName, setSetupName] = useState("");
  const [preTradeNotes, setPreTradeNotes] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol.trim() || !entryPrice || !quantity) {
      alert("Please fill in all required fields: Symbol, Entry Price, Quantity");
      return;
    }

    setIsSaving(true);

    const newTrade: CreateTrade = {
      user_id: userId,
      symbol: symbol.trim().toUpperCase(),
      instrument_type: instrumentType,
      country,
      side,
      entry_date: entryDate,
      entry_time: entryTime || null,
      entry_price: parseFloat(entryPrice),
      quantity: parseFloat(quantity),
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
      commission: parseFloat(commission),
      fees: parseFloat(fees),
      setup_name: setupName.trim() || null,
      pre_trade_notes: preTradeNotes.trim() || null,
      exit_date: null,
      exit_time: null,
      exit_price: null,
      strategy_id: null,
      market_condition: null,
      emotional_state: null,
      confidence_level: null,
      discipline_score: null,
      rules_followed: null,
      rules_broken: null,
      mistakes_tags: null,
      post_trade_notes: null,
      lessons_learned: null,
      screenshots: null,
      risk_reward_ratio: null
    };

    const result = await onAdd(newTrade);

    setIsSaving(false);

    if (result.success) {
      // Reset form
      resetForm();
      onClose();
    } else {
      alert("Failed to create trade. Please try again.");
    }
  };

  const resetForm = () => {
    setSymbol("");
    setInstrumentType("stock");
    setCountry("US");
    setSide("long");
    setEntryDate(new Date().toISOString().split('T')[0]);
    setEntryTime("");
    setEntryPrice("");
    setQuantity("");
    setStopLoss("");
    setTakeProfit("");
    setCommission("0");
    setFees("0");
    setSetupName("");
    setPreTradeNotes("");
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-2xl my-8 rounded-xl shadow-2xl ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Log New Trade
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            } disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Trade Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Symbol */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Symbol *
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL"
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Instrument Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Instrument *
                </label>
                <select
                  value={instrumentType}
                  onChange={(e) => setInstrumentType(e.target.value as InstrumentType)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                >
                  {INSTRUMENTS.map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as CountryCode)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Side */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Side *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSide("long")}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      side === "long"
                        ? "bg-green-600 text-white"
                        : isDark
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide("short")}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      side === "short"
                        ? "bg-red-600 text-white"
                        : isDark
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Details Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Entry Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Entry Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Entry Date *
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              {/* Entry Time */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Entry Time (Optional)
                </label>
                <input
                  type="time"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              {/* Entry Price */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Entry Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Stop Loss (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Take Profit */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Take Profit (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Strategy & Notes */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Additional Info
            </h3>
            <div className="space-y-4">
              {/* Setup Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Setup Name (Optional)
                </label>
                <input
                  type="text"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="e.g., Breakout, Pullback, Reversal"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Pre-Trade Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Pre-Trade Notes (Optional)
                </label>
                <textarea
                  value={preTradeNotes}
                  onChange={(e) => setPreTradeNotes(e.target.value)}
                  placeholder="Why are you taking this trade? What's your analysis?"
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Logging Trade..." : "Log Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}