// src/app/dashboard/trading/journal/hooks/useTrades.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTradesGroupedByDate,
  createTrade,
} from "@/lib/supabase/trading-helpers";
import type { CreateTrade, InstrumentType, TradesByDate } from "@/types/database";

export function useTrades(userId: string | null) {
  const [groupedTrades, setGroupedTrades] = useState<TradesByDate[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch grouped trades
  const fetchTrades = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getTradesGroupedByDate(userId);

      if (fetchError) {
        setError("Failed to load trades");
        console.error("Error fetching trades:", fetchError);
        return;
      }

      // Filter by instrument if needed
      let filtered = data || [];
      if (selectedInstrument !== "all") {
        filtered = filtered.map(day => ({
          ...day,
          trades: day.trades.filter(t => t.instrument_type === selectedInstrument),
        })).filter(day => day.trades.length > 0);
      }

      setGroupedTrades(filtered);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedInstrument]);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Add new trade
  const addTrade = async (tradeData: CreateTrade) => {
    try {
      const { data, error: createError } = await createTrade(tradeData);

      if (createError) {
        throw new Error("Failed to create trade");
      }

      if (data) {
        await fetchTrades(); // Refresh
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating trade:", err);
      return { success: false, error: err };
    }
  };

  return {
    groupedTrades,
    selectedInstrument,
    setSelectedInstrument,
    loading,
    error,
    addTrade,
    refreshTrades: fetchTrades,
  };
}