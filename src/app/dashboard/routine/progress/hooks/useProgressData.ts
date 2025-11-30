// src/app/dashboard/routine/progress/hooks/useProgressData.ts
"use client";

import { useState, useEffect } from "react";
import {
  getProgressOverview,
  getRoutineConsistency,
  getHealthTrends,
  getHabitHeatmapData,
  getWeeklySummary,
  type ProgressOverview,
  type RoutineConsistencyDay,
  type HealthTrendData,
  type HabitHeatmapData,
  type WeeklySummary,
} from "@/lib/supabase/progress-helpers";

export function useProgressData(userId: string | null) {
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [consistency, setConsistency] = useState<RoutineConsistencyDay[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthTrendData[]>([]);
  const [habitHeatmap, setHabitHeatmap] = useState<HabitHeatmapData[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [overviewRes, consistencyRes, trendsRes, heatmapRes, weeklyRes] =
        await Promise.all([
          getProgressOverview(userId),
          getRoutineConsistency(userId, 30),
          getHealthTrends(userId, 30),
          getHabitHeatmapData(userId, 90),
          getWeeklySummary(userId),
        ]);

      if (overviewRes.data) setOverview(overviewRes.data);
      if (consistencyRes.data) setConsistency(consistencyRes.data);
      if (trendsRes.data) setHealthTrends(trendsRes.data);
      if (heatmapRes.data) setHabitHeatmap(heatmapRes.data);
      if (weeklyRes.data) setWeeklySummary(weeklyRes.data);

      if (
        overviewRes.error ||
        consistencyRes.error ||
        trendsRes.error ||
        heatmapRes.error ||
        weeklyRes.error
      ) {
        setError("Failed to load some data");
      }
    } catch (err) {
      console.error("Error fetching progress data:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  return {
    overview,
    consistency,
    healthTrends,
    habitHeatmap,
    weeklySummary,
    loading,
    error,
    refreshData: fetchAllData,
  };
}