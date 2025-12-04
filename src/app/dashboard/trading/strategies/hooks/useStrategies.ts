// src/app/dashboard/trading/strategies/hooks/useStrategies.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStrategies,
  getActiveStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from "@/lib/supabase/trading-helpers";
import type { Strategy, StrategyStatus, CreateStrategy } from "@/types/database";

type FilterType = "all" | StrategyStatus;
type SortBy = "win_rate" | "total_pnl" | "total_trades" | "created_at";

export function useStrategies(userId: string | null) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("win_rate");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch strategies
  const fetchStrategies = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getStrategies(userId);

      if (result.error) {
        setError("Failed to load strategies");
        console.error("Error fetching strategies:", result.error);
        return;
      }

      setStrategies(result.data || []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...strategies];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (strategy) =>
          strategy.name.toLowerCase().includes(query) ||
          strategy.description?.toLowerCase().includes(query) ||
          strategy.market_type?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterType !== "all") {
      result = result.filter((strategy) => strategy.status === filterType);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "win_rate":
          return b.win_rate - a.win_rate;
        case "total_pnl":
          return b.total_pnl - a.total_pnl;
        case "total_trades":
          return b.total_trades - a.total_trades;
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredStrategies(result);
  }, [strategies, searchQuery, filterType, sortBy]);

  // Add new strategy
  const addStrategy = async (strategyData: CreateStrategy) => {
    try {
      const { data, error: createError } = await createStrategy(strategyData);

      if (createError) {
        throw new Error("Failed to create strategy");
      }

      if (data) {
        await fetchStrategies(); // Refresh list
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating strategy:", err);
      return { success: false, error: err };
    }
  };

  // Update strategy
  const updateStrategyData = async (strategyId: string, updates: Partial<Strategy>) => {
    try {
      const { data, error: updateError } = await updateStrategy(strategyId, updates);

      if (updateError) {
        throw new Error("Failed to update strategy");
      }

      if (data) {
        await fetchStrategies();
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error updating strategy:", err);
      return { success: false, error: err };
    }
  };

  // Delete strategy
  const deleteStrategyData = async (strategyId: string) => {
    try {
      const { error: deleteError } = await deleteStrategy(strategyId);

      if (deleteError) {
        throw new Error("Failed to delete strategy");
      }

      setStrategies((prev) => prev.filter((strategy) => strategy.id !== strategyId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting strategy:", err);
      return { success: false, error: err };
    }
  };

  // Toggle status (active <-> testing)
  const toggleStatus = async (strategyId: string, currentStatus: StrategyStatus) => {
    const newStatus: StrategyStatus = currentStatus === "active" ? "testing" : "active";
    return updateStrategyData(strategyId, { status: newStatus });
  };

  return {
    strategies: filteredStrategies,
    allStrategies: strategies,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    loading,
    error,
    addStrategy,
    updateStrategy: updateStrategyData,
    deleteStrategy: deleteStrategyData,
    toggleStatus,
    refreshStrategies: fetchStrategies,
  };
}