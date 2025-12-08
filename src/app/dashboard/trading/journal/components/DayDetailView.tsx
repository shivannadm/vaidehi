// src/app/dashboard/trading/journal/components/DayDetailView.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Plus } from "lucide-react";
import { getTradesByDate, updateTrade, deleteTrade, closeTradeWithRules } from "@/lib/supabase/trading-helpers";
import TradeCard from "./TradeCard";
import EditTradeModal from "./EditTradeModal";
import CloseTradeModal from "./CloseTradeModal";
import TradeDetails from "./TradeDetails";
import AddTradeModal from "./AddTradeModal";
import { formatIndianCurrency } from "@/types/database";
import type { TradeWithStrategy } from "@/types/database";

interface DayDetailViewProps {
  date: string;
  userId: string;
  onBack: () => void;
  isDark: boolean;
}

export default function DayDetailView({ date, userId, onBack, isDark }: DayDetailViewProps) {
  const [trades, setTrades] = useState<TradeWithStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // States
  const [editingTrade, setEditingTrade] = useState<TradeWithStrategy | null>(null);
  const [closingTrade, setClosingTrade] = useState<TradeWithStrategy | null>(null);
  const [viewingTrade, setViewingTrade] = useState<TradeWithStrategy | null>(null);

  useEffect(() => {
    fetchTrades();
  }, [userId, date]);

  const fetchTrades = async () => {
    setLoading(true);
    const { data } = await getTradesByDate(userId, date);
    setTrades(data || []);
    setLoading(false);
  };

  const handleAddTrade = async (tradeData: any) => {
    await fetchTrades();
    return { success: true };
  };

  const handleCloseTrade = (trade: TradeWithStrategy) => {
    setClosingTrade(trade);
    setIsCloseModalOpen(true);
  };

  const handleEditTrade = (trade: TradeWithStrategy) => {
    setEditingTrade(trade);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (trade: TradeWithStrategy) => {
    setViewingTrade(trade);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (tradeId: string) => {
    if (!confirm("Delete this trade?")) return;
    
    const { error } = await deleteTrade(tradeId);
    if (!error) {
      setTrades(trades.filter(t => t.id !== tradeId));
    } else {
      alert("Failed to delete trade");
    }
  };

  const handleUpdateTrade = async (tradeId: string, updates: any) => {
    const { data, error } = await updateTrade(tradeId, updates);
    if (!error && data) {
      await fetchTrades();
      return { success: true };
    }
    return { success: false };
  };

  const handleCloseTradeSubmit = async (tradeId: string, exitDetails: any) => {
    const { data, error } = await closeTradeWithRules(tradeId, exitDetails);
    if (!error && data) {
      await fetchTrades();
      return { success: true };
    }
    return { success: false };
  };

  // Calculate stats
  const totalPnL = trades
    .filter(t => t.is_closed && t.pnl)
    .reduce((sum, t) => sum + (t.pnl || 0), 0);
  
  const winningTrades = trades.filter(t => t.is_closed && (t.pnl || 0) > 0).length;
  const losingTrades = trades.filter(t => t.is_closed && (t.pnl || 0) <= 0).length;

  const dateDisplay = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Check if this is today
  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header with Back Button and Log Trade */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg transition ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Journal</span>
            </button>

            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {dateDisplay}
            </h1>
          </div>

          {/* Log Trade Button - Always visible */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Log Trade</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl border p-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Total Trades
            </div>
            <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {trades.length}
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Win / Loss
            </div>
            <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {winningTrades} / {losingTrades}
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${
            totalPnL >= 0
              ? isDark
                ? "bg-green-900/20 border-green-500/30"
                : "bg-green-50 border-green-200"
              : isDark
              ? "bg-red-900/20 border-red-500/30"
              : "bg-red-50 border-red-200"
          }`}>
            <div className={`text-sm mb-1 flex items-center gap-2 ${
              totalPnL >= 0
                ? isDark ? "text-green-400" : "text-green-600"
                : isDark ? "text-red-400" : "text-red-600"
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span>Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${
              totalPnL >= 0
                ? isDark ? "text-green-400" : "text-green-600"
                : isDark ? "text-red-400" : "text-red-600"
            }`}>
              {formatIndianCurrency(totalPnL)}
            </div>
          </div>
        </div>

        {/* Trades Grid */}
        {loading ? (
          <div className={`text-center py-16 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : trades.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`text-lg mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              No trades found for this date
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Log Your First Trade
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {trades.map((trade) => (
              <div key={trade.id} onClick={() => handleViewDetails(trade)}>
                <TradeCard
                  trade={trade}
                  onEdit={handleEditTrade}
                  onDelete={handleDelete}
                  onClose={handleCloseTrade}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Trade Modal - Pre-fill with current date */}
      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTrade}
        userId={userId}
        isDark={isDark}
        prefilledDate={date}
      />

      {/* Edit Modal */}
      <EditTradeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrade(null);
        }}
        onUpdate={handleUpdateTrade}
        trade={editingTrade}
        isDark={isDark}
      />

      {/* Close Modal */}
      <CloseTradeModal
        isOpen={isCloseModalOpen}
        onClose={() => {
          setIsCloseModalOpen(false);
          setClosingTrade(null);
        }}
        onCloseTrade={handleCloseTradeSubmit}
        trade={closingTrade}
        isDark={isDark}
      />

      {/* Details Modal */}
      <TradeDetails
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingTrade(null);
        }}
        trade={viewingTrade}
        isDark={isDark}
      />
    </div>
  );
}