// src/app/dashboard/trading/strategies/components/AddStrategyModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CreateStrategy, StrategyStatus, MarketCondition } from "@/types/database";

interface AddStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (strategy: CreateStrategy) => Promise<{ success: boolean }>;
  userId: string;
  isDark: boolean;
}

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"];

const MARKET_TYPES: Array<{ value: MarketCondition; label: string }> = [
  { value: "trending", label: "Trending" },
  { value: "ranging", label: "Ranging" },
  { value: "volatile", label: "Volatile" },
  { value: "quiet", label: "Quiet" },
];

const STATUS_OPTIONS: Array<{ value: StrategyStatus; label: string }> = [
  { value: "testing", label: "Testing" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export default function AddStrategyModal({
  isOpen,
  onClose,
  onAdd,
  userId,
  isDark,
}: AddStrategyModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [marketType, setMarketType] = useState<MarketCondition>("trending");
  const [timeframe, setTimeframe] = useState("15m");
  const [status, setStatus] = useState<StrategyStatus>("testing");
  const [entryCriteria, setEntryCriteria] = useState("");
  const [exitCriteria, setExitCriteria] = useState("");
  const [riskManagement, setRiskManagement] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a strategy name");
      return;
    }

    setIsSaving(true);

    const newStrategy: CreateStrategy = {
      user_id: userId,
      name: name.trim(),
      description: description.trim() || null,
      market_type: marketType,
      timeframe,
      entry_criteria: entryCriteria.trim() ? { description: entryCriteria.trim() } : {},
      exit_criteria: exitCriteria.trim() ? { description: exitCriteria.trim() } : {},
      risk_management: riskManagement.trim() || null,
      status,
    };

    const result = await onAdd(newStrategy);

    setIsSaving(false);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      alert("Failed to create strategy. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setMarketType("trending");
    setTimeframe("15m");
    setStatus("testing");
    setEntryCriteria("");
    setExitCriteria("");
    setRiskManagement("");
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
            Create New Strategy
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Strategy Name */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Strategy Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Breakout Master, Mean Reversion Pro"
              required
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your strategy..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Market Type & Timeframe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Market Type
              </label>
              <select
                value={marketType}
                onChange={(e) => setMarketType(e.target.value as MarketCondition)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                {MARKET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                {TIMEFRAMES.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Entry Criteria */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Entry Criteria
            </label>
            <textarea
              value={entryCriteria}
              onChange={(e) => setEntryCriteria(e.target.value)}
              placeholder="What conditions must be met to enter a trade?"
              rows={2}
              className={`w-full px-4 py-2.5 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Exit Criteria */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Exit Criteria
            </label>
            <textarea
              value={exitCriteria}
              onChange={(e) => setExitCriteria(e.target.value)}
              placeholder="When do you exit the trade?"
              rows={2}
              className={`w-full px-4 py-2.5 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Risk Management */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Risk Management
            </label>
            <input
              type="text"
              value={riskManagement}
              onChange={(e) => setRiskManagement(e.target.value)}
              placeholder="e.g., Risk 1% per trade"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Status */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StrategyStatus)}
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition ${
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
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Creating..." : "Create Strategy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}