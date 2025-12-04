// src/app/dashboard/trading/backtest/hooks/useBacktest.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBacktestResults,
  getBacktestsByStrategy,
  createBacktestResult,
  updateBacktestResult,
  deleteBacktestResult,
} from "@/lib/supabase/trading-helpers";
import type { BacktestResult, CreateBacktestResult } from "@/types/database";

export function useBacktest(userId: string | null) {
  const [backtests, setBacktests] = useState<BacktestResult[]>([]);
  const [filteredBacktests, setFilteredBacktests] = useState<BacktestResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all backtests
  const fetchBacktests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getBacktestResults(userId);

      if (fetchError) {
        setError("Failed to load backtest results");
        console.error("Error fetching backtests:", fetchError);
        return;
      }

      setBacktests(data || []);
      setFilteredBacktests(data || []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchBacktests();
  }, [fetchBacktests]);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredBacktests(
        backtests.filter(
          (bt) =>
            bt.strategy_name.toLowerCase().includes(query) ||
            bt.notes?.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredBacktests(backtests);
    }
  }, [searchQuery, backtests]);

  // Add new backtest
  const addBacktest = async (backtestData: CreateBacktestResult) => {
    try {
      const { data, error: createError } = await createBacktestResult(backtestData);

      if (createError) {
        throw new Error("Failed to create backtest");
      }

      if (data) {
        setBacktests((prev) => [data, ...prev]);
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating backtest:", err);
      return { success: false, error: err };
    }
  };

  // Update backtest
  const updateBacktest = async (backtestId: string, updates: Partial<BacktestResult>) => {
    try {
      const { data, error: updateError } = await updateBacktestResult(backtestId, updates);

      if (updateError) {
        throw new Error("Failed to update backtest");
      }

      if (data) {
        setBacktests((prev) =>
          prev.map((bt) => (bt.id === backtestId ? data : bt))
        );
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error updating backtest:", err);
      return { success: false, error: err };
    }
  };

  // Delete backtest
  const deleteBacktest = async (backtestId: string) => {
    try {
      const { error: deleteError } = await deleteBacktestResult(backtestId);

      if (deleteError) {
        throw new Error("Failed to delete backtest");
      }

      setBacktests((prev) => prev.filter((bt) => bt.id !== backtestId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting backtest:", err);
      return { success: false, error: err };
    }
  };

  return {
    backtests: filteredBacktests,
    allBacktests: backtests,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addBacktest,
    updateBacktest,
    deleteBacktest,
    refreshBacktests: fetchBacktests,
  };
}