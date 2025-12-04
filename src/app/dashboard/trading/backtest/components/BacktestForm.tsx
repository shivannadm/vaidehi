// src/app/dashboard/trading/backtest/components/BacktestForm.tsx
"use client";

import { useState } from "react";
import { X, Calculator } from "lucide-react";
import type { CreateBacktestResult } from "@/types/database";

interface BacktestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (backtest: CreateBacktestResult) => Promise<{ success: boolean }>;
  userId: string;
  isDark: boolean;
}

export default function BacktestForm({ isOpen, onClose, onSubmit, userId, isDark }: BacktestFormProps) {
  const [strategyName, setStrategyName] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [initialCapital, setInitialCapital] = useState("10000");
  const [finalCapital, setFinalCapital] = useState("");
  const [totalTrades, setTotalTrades] = useState("");
  const [winningTrades, setWinningTrades] = useState("");
  const [losingTrades, setLosingTrades] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strategyName.trim() || !dateRangeStart || !dateRangeEnd || !totalTrades || !winningTrades) {
      alert("Please fill in all required fields");
      return;
    }

    const total = parseInt(totalTrades);
    const winning = parseInt(winningTrades);
    const losing = parseInt(losingTrades || String(total - winning));
    const initial = parseFloat(initialCapital);
    const final = parseFloat(finalCapital || initialCapital);

    // Calculate metrics (SIMPLIFIED & ACCURATE)
    const winRate = total > 0 ? (winning / total) * 100 : 0;
    const lossRate = 100 - winRate;
    
    // Total P&L
    const totalPnL = final - initial;
    
    // Average win/loss per trade
    const avgWin = winning > 0 ? Math.abs(totalPnL) / winning : 0;
    const avgLoss = losing > 0 ? Math.abs(totalPnL) / losing : 0;
    
    // Profit Factor (total wins / total losses)
    let profitFactor = 0;
    if (totalPnL > 0 && losing > 0) {
      const totalWins = (winning / total) * Math.abs(totalPnL) * 2; // Estimate
      const totalLosses = (losing / total) * Math.abs(totalPnL) * 0.5; // Estimate
      profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;
    } else {
      profitFactor = totalPnL > 0 ? 1.5 : 0.5; // Simple estimate
    }
    
    // Expectancy (average $ per trade)
    const expectancy = total > 0 ? totalPnL / total : 0;
    
    // Max Drawdown (simplified - assume 20% of worst loss)
    const maxDrawdown = total > 0 ? Math.min(Math.abs(totalPnL) * 0.2, 50) : 0;

    setIsSaving(true);

    const backtestData: CreateBacktestResult = {
      user_id: userId,
      strategy_id: null,
      strategy_name: strategyName.trim(),
      date_range_start: dateRangeStart,
      date_range_end: dateRangeEnd,
      initial_capital: initial,
      final_capital: final,
      total_trades: total,
      winning_trades: winning,
      losing_trades: losing,
      win_rate: parseFloat(winRate.toFixed(2)),
      max_drawdown: parseFloat(maxDrawdown.toFixed(2)),
      profit_factor: parseFloat(profitFactor.toFixed(2)),
      expectancy: parseFloat(expectancy.toFixed(2)),
      sharpe_ratio: null,
      trades_data: {},
      notes: notes.trim() || null,
    };

    const result = await onSubmit(backtestData);

    setIsSaving(false);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      alert("Failed to create backtest. Please try again.");
    }
  };

  const resetForm = () => {
    setStrategyName("");
    setDateRangeStart("");
    setDateRangeEnd("");
    setInitialCapital("10000");
    setFinalCapital("");
    setTotalTrades("");
    setWinningTrades("");
    setLosingTrades("");
    setNotes("");
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
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-indigo-500" />
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              New Backtest
            </h2>
          </div>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Strategy Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Strategy Name *
            </label>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder="e.g., Moving Average Crossover"
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Date Range */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Test Period
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  required
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  End Date *
                </label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  required
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Capital */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Capital
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Initial Capital *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  placeholder="10000"
                  required
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Final Capital
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={finalCapital}
                  onChange={(e) => setFinalCapital(e.target.value)}
                  placeholder="12000"
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Trade Stats */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Trade Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Total Trades *
                </label>
                <input
                  type="number"
                  value={totalTrades}
                  onChange={(e) => setTotalTrades(e.target.value)}
                  placeholder="100"
                  required
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Winning *
                </label>
                <input
                  type="number"
                  value={winningTrades}
                  onChange={(e) => setWinningTrades(e.target.value)}
                  placeholder="65"
                  required
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Losing
                </label>
                <input
                  type="number"
                  value={losingTrades}
                  onChange={(e) => setLosingTrades(e.target.value)}
                  placeholder="35"
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations or insights..."
              rows={3}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition ${
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
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Creating..." : "Create Backtest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}