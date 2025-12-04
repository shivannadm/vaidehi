// src/app/dashboard/trading/journal/hooks/useTrades.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTrades,
  getOpenTrades,
  getClosedTrades,
  createTrade,
  updateTrade,
  closeTrade,
  deleteTrade,
} from "@/lib/supabase/trading-helpers";
import type { Trade, TradeWithStrategy, CreateTrade, InstrumentType } from "@/types/database";

type FilterType = "all" | "open" | "closed";

export function useTrades(userId: string | null) {
  const [trades, setTrades] = useState<TradeWithStrategy[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<TradeWithStrategy[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trades based on filter
  const fetchTrades = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;
      if (filterType === "open") {
        result = await getOpenTrades(userId);
      } else if (filterType === "closed") {
        result = await getClosedTrades(userId);
      } else {
        result = await getTrades(userId);
      }

      if (result.error) {
        setError("Failed to load trades");
        console.error("Error fetching trades:", result.error);
        return;
      }

      setTrades(result.data || []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, filterType]);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Apply filters
  useEffect(() => {
    let filtered = [...trades];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((trade) =>
        trade.symbol.toLowerCase().includes(query) ||
        trade.setup_name?.toLowerCase().includes(query)
      );
    }

    // Instrument filter
    if (selectedInstrument !== "all") {
      filtered = filtered.filter((trade) => trade.instrument_type === selectedInstrument);
    }

    setFilteredTrades(filtered);
  }, [trades, searchQuery, selectedInstrument]);

  // Add new trade
  const addTrade = async (tradeData: CreateTrade) => {
    try {
      const { data, error: createError } = await createTrade(tradeData);

      if (createError) {
        throw new Error("Failed to create trade");
      }

      if (data) {
        await fetchTrades(); // Refresh to get strategy info
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating trade:", err);
      return { success: false, error: err };
    }
  };

  // Update trade
  const updateTradeData = async (tradeId: string, updates: Partial<Trade>) => {
    try {
      const { data, error: updateError } = await updateTrade(tradeId, updates);

      if (updateError) {
        throw new Error("Failed to update trade");
      }

      if (data) {
        await fetchTrades();
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error updating trade:", err);
      return { success: false, error: err };
    }
  };

  // Close trade
  const closeTradeData = async (
    tradeId: string,
    exitDetails: {
      exit_date: string;
      exit_time?: string;
      exit_price: number;
      post_trade_notes?: string;
      lessons_learned?: string;
    }
  ) => {
    try {
      const { data, error: closeError } = await closeTrade(tradeId, exitDetails);

      if (closeError) {
        throw new Error("Failed to close trade");
      }

      if (data) {
        await fetchTrades();
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error closing trade:", err);
      return { success: false, error: err };
    }
  };

  // Delete trade
  const deleteTradeData = async (tradeId: string) => {
    try {
      const { error: deleteError } = await deleteTrade(tradeId);

      if (deleteError) {
        throw new Error("Failed to delete trade");
      }

      setTrades((prev) => prev.filter((trade) => trade.id !== tradeId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting trade:", err);
      return { success: false, error: err };
    }
  };

  return {
    trades: filteredTrades,
    allTrades: trades,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    selectedInstrument,
    setSelectedInstrument,
    loading,
    error,
    addTrade,
    updateTrade: updateTradeData,
    closeTrade: closeTradeData,
    deleteTrade: deleteTradeData,
    refreshTrades: fetchTrades,
  };
}