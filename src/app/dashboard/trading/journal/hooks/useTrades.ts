// src/app/dashboard/trading/journal/hooks/useTrades.ts
"use client";

import { useState, useEffect } from "react";
import { getTradesGroupedByDate, createTrade } from "@/lib/supabase/trading-helpers";
import type { CreateTrade, InstrumentType, TradesByDate } from "@/types/database";

export function useTrades(userId: string | null) {
  const [groupedTrades, setGroupedTrades] = useState<TradesByDate[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trades
  const fetchTrades = async () => {
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
        return;
      }

      // Filter by instrument
      let filtered = data || [];
      if (selectedInstrument !== "all") {
        filtered = filtered
          .map((day) => ({
            ...day,
            trades: day.trades.filter((t) => t.instrument_type === selectedInstrument),
          }))
          .filter((day) => day.trades.length > 0);
      }

      setGroupedTrades(filtered);
    } catch (err) {
      setError("Failed to load trades");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when filter changes
  useEffect(() => {
    fetchTrades();
  }, [userId, selectedInstrument]);

  // Add trade
  const addTrade = async (tradeData: CreateTrade) => {
    try {
      const { data, error: createError } = await createTrade(tradeData);

      if (createError || !data) {
        throw new Error("Failed to create trade");
      }

      await fetchTrades();
      return { success: true, data };
    } catch (err) {
      console.error(err);
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