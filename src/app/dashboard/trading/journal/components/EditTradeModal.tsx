// src/app/dashboard/trading/journal/components/EditTradeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TradeWithStrategy, InstrumentType, TradeSide } from "@/types/database";

interface EditTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (tradeId: string, updates: any) => Promise<{ success: boolean }>;
  trade: TradeWithStrategy | null;
  isDark: boolean;
}

const INSTRUMENTS: Array<{ value: InstrumentType; label: string }> = [
  { value: "stock", label: "Stock" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
  { value: "forex", label: "Forex" },
  { value: "commodity", label: "Commodity" },
  { value: "currency", label: "Currency" },
];

export default function EditTradeModal({ isOpen, onClose, onUpdate, trade, isDark }: EditTradeModalProps) {
  const [symbol, setSymbol] = useState("");
  const [instrumentType, setInstrumentType] = useState<InstrumentType>("stock");
  const [side, setSide] = useState<TradeSide>("long");
  const [entryDate, setEntryDate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [setupName, setSetupName] = useState("");
  const [preTradeNotes, setPreTradeNotes] = useState("");
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [optionStrike, setOptionStrike] = useState("");
  const [optionExpiry, setOptionExpiry] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when trade changes
  useEffect(() => {
    if (trade) {
      setSymbol(trade.symbol);
      setInstrumentType(trade.instrument_type);
      setSide(trade.side);
      setEntryDate(trade.entry_date);
      setEntryTime(trade.entry_time || "");
      setEntryPrice(trade.entry_price.toString());
      setQuantity(trade.quantity.toString());
      setStopLoss(trade.stop_loss?.toString() || "");
      setTakeProfit(trade.take_profit?.toString() || "");
      setSetupName(trade.setup_name || "");
      setPreTradeNotes(trade.pre_trade_notes || "");
      setOptionType(trade.option_type || "call");
      setOptionStrike(trade.option_strike?.toString() || "");
      setOptionExpiry(trade.option_expiry || "");
    }
  }, [trade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trade || !symbol.trim() || !entryPrice || !quantity) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    const updates = {
      symbol: symbol.trim().toUpperCase(),
      instrument_type: instrumentType,
      side,
      entry_date: entryDate,
      entry_time: entryTime || null,
      entry_price: parseFloat(entryPrice),
      quantity: parseFloat(quantity),
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
      setup_name: setupName.trim() || null,
      pre_trade_notes: preTradeNotes.trim() || null,
      option_type: instrumentType === "options" ? optionType : null,
      option_strike: instrumentType === "options" && optionStrike ? parseFloat(optionStrike) : null,
      option_expiry: instrumentType === "options" && optionExpiry ? optionExpiry : null,
    };

    const result = await onUpdate(trade.id, updates);

    setIsSaving(false);

    if (result.success) {
      onClose();
    } else {
      alert("Failed to update trade. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isOpen || !trade) return null;

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
          className={`flex items-center justify-between p-4 md:p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Edit Trade: {trade.symbol}
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
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Symbol *
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                required
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Instrument *
              </label>
              <select
                value={instrumentType}
                onChange={(e) => setInstrumentType(e.target.value as InstrumentType)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Side *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSide("long")}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                    side === "long"
                      ? "bg-green-600 text-white"
                      : isDark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setSide("short")}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                    side === "short"
                      ? "bg-red-600 text-white"
                      : isDark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Short
                </button>
              </div>
            </div>

            {/* Options Type - NEW */}
            {instrumentType === "options" && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Option Type *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOptionType("call")}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                      optionType === "call"
                        ? "bg-blue-600 text-white"
                        : isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    CALL
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionType("put")}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                      optionType === "put"
                        ? "bg-purple-600 text-white"
                        : isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    PUT
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Entry Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Entry Date *
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Entry Time
              </label>
              <input
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Entry Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                required
                placeholder="₹0.00"
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Quantity *
              </label>
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Stop Loss (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="₹0.00"
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Take Profit (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="₹0.00"
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Options Fields */}
          {instrumentType === "options" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Strike Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={optionStrike}
                  onChange={(e) => setOptionStrike(e.target.value)}
                  placeholder="₹0.00"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={optionExpiry}
                  onChange={(e) => setOptionExpiry(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Setup Name
              </label>
              <input
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Pre-Trade Notes
              </label>
              <textarea
                value={preTradeNotes}
                onChange={(e) => setPreTradeNotes(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-700">
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
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}