// src/app/dashboard/trading/journal/components/CloseTradeModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { TradeWithStrategy } from "@/types/database";

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseTrade: (
    tradeId: string,
    exitDetails: {
      exit_date: string;
      exit_time?: string;
      exit_price: number;
      post_trade_notes?: string;
      lessons_learned?: string;
    }
  ) => Promise<{ success: boolean }>;
  trade: TradeWithStrategy | null;
  isDark: boolean;
}

export default function CloseTradeModal({
  isOpen,
  onClose,
  onCloseTrade,
  trade,
  isDark,
}: CloseTradeModalProps) {
  const [exitDate, setExitDate] = useState(new Date().toISOString().split("T")[0]);
  const [exitTime, setExitTime] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [postTradeNotes, setPostTradeNotes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    });

    setIsSaving(false);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      alert("Failed to close trade. Please try again.");
    }
  };

  const resetForm = () => {
    setExitDate(new Date().toISOString().split("T")[0]);
    setExitTime("");
    setExitPrice("");
    setPostTradeNotes("");
    setLessonsLearned("");
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen || !trade) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Close Trade: {trade.symbol}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Exit Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Exit Date *
              </label>
              <input
                type="date"
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Exit Time
              </label>
              <input
                type="time"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Exit Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              placeholder="0.00"
              required
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Post-Trade Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Post-Trade Notes
            </label>
            <textarea
              value={postTradeNotes}
              onChange={(e) => setPostTradeNotes(e.target.value)}
              placeholder="How did the trade play out?"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Lessons Learned */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Lessons Learned
            </label>
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              placeholder="What did you learn from this trade?"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
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
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Closing..." : "Close Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}