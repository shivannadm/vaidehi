// src/app/dashboard/trading/rules/hooks/useRules.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTradingRules,
  createTradingRule,
  updateTradingRule,
  deleteTradingRule,
  toggleRuleStatus,
} from "@/lib/supabase/trading-helpers";
import type { TradingRule, RuleCategory, CreateTradingRule } from "@/types/database";

export function useRules(userId: string | null) {
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<TradingRule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all rules
  const fetchRules = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getTradingRules(userId);

      if (fetchError) {
        setError("Failed to load rules");
        console.error("Error fetching rules:", fetchError);
        return;
      }

      setRules(data || []);
      setFilteredRules(data || []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Filter rules by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredRules(rules);
    } else {
      setFilteredRules(rules.filter((rule) => rule.category === selectedCategory));
    }
  }, [selectedCategory, rules]);

  // Add new rule
  const addRule = async (ruleData: CreateTradingRule) => {
    try {
      const { data, error: createError } = await createTradingRule(ruleData);

      if (createError) {
        throw new Error("Failed to create rule");
      }

      if (data) {
        setRules((prev) => [data, ...prev]);
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating rule:", err);
      return { success: false, error: err };
    }
  };

  // Update rule
  const updateRule = async (ruleId: string, updates: Partial<TradingRule>) => {
    try {
      const { data, error: updateError } = await updateTradingRule(ruleId, updates);

      if (updateError) {
        throw new Error("Failed to update rule");
      }

      if (data) {
        setRules((prev) =>
          prev.map((rule) => (rule.id === ruleId ? data : rule))
        );
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error updating rule:", err);
      return { success: false, error: err };
    }
  };

  // Delete rule
  const deleteRule = async (ruleId: string) => {
    try {
      const { error: deleteError } = await deleteTradingRule(ruleId);

      if (deleteError) {
        throw new Error("Failed to delete rule");
      }

      setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting rule:", err);
      return { success: false, error: err };
    }
  };

  // Toggle active status
  const toggleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      const { data, error: toggleError } = await toggleRuleStatus(ruleId, isActive);

      if (toggleError) {
        throw new Error("Failed to toggle rule status");
      }

      if (data) {
        setRules((prev) =>
          prev.map((rule) => (rule.id === ruleId ? data : rule))
        );
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error toggling rule status:", err);
      return { success: false, error: err };
    }
  };

  return {
    rules: filteredRules,
    allRules: rules,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    addRule,
    updateRule,
    deleteRule,
    toggleStatus,
    refreshRules: fetchRules,
  };
}