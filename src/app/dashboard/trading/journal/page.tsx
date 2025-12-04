// src/app/dashboard/trading/journal/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, BookOpen, Loader2 } from "lucide-react";
import { useTrades } from "./hooks/useTrades";
import TradeFilters from "./components/TradeFilters";
import TradeCard from "./components/TradeCard";
import AddTradeModal from "./components/AddTradeModal";
import EditTradeModal from "./components/EditTradeModal";
import CloseTradeModal from "./components/CloseTradeModal";
import TradeDetails from "./components/TradeDetails";
import type { TradeWithStrategy } from "@/types/database";

export default function TradingJournalPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradeWithStrategy | null>(null);
  const [closingTrade, setClosingTrade] = useState<TradeWithStrategy | null>(null);
  const [viewingTrade, setViewingTrade] = useState<TradeWithStrategy | null>(null);

  const {
    trades,
    allTrades,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    selectedInstrument,
    setSelectedInstrument,
    loading,
    error,
    addTrade,
    updateTrade,
    closeTrade,
    deleteTrade,
  } = useTrades(userId);

  // Auth and theme setup
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        window.location.href = "/login";
      }
    };

    init();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: allTrades.length,
      open: allTrades.filter((t) => !t.is_closed).length,
      closed: allTrades.filter((t) => t.is_closed).length,
    };
  }, [allTrades]);

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
    await deleteTrade(tradeId);
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold flex items-center gap-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <BookOpen className="w-8 h-8 text-indigo-500" />
              Trading Journal
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Log and analyze your trades
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Log Trade
          </button>
        </div>

        {/* Filters */}
        <TradeFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedInstrument={selectedInstrument}
          onInstrumentChange={setSelectedInstrument}
          isDark={isDark}
          counts={filterCounts}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trades.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <BookOpen
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              {searchQuery
                ? "No trades found"
                : filterType === "all"
                ? "No Trades Yet"
                : `No ${filterType} Trades`}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start logging your trades to build your trading journal"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Log Your First Trade
              </button>
            )}
          </div>
        )}

        {/* Trades Grid */}
        {!loading && !error && trades.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trades.map((trade) => (
              <div key={trade.id} onClick={() => handleViewDetails(trade)} className="cursor-pointer">
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

      {/* Modals */}
      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTrade}
        userId={userId || ""}
        isDark={isDark}
      />

      <EditTradeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrade(null);
        }}
        onUpdate={updateTrade}
        trade={editingTrade}
        isDark={isDark}
      />

      <CloseTradeModal
        isOpen={isCloseModalOpen}
        onClose={() => {
          setIsCloseModalOpen(false);
          setClosingTrade(null);
        }}
        onCloseTrade={closeTrade}
        trade={closingTrade}
        isDark={isDark}
      />

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