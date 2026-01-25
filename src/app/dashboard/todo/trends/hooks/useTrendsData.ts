// src/app/dashboard/todo/trends/hooks/useTrendsData.ts
"use client";

import { useState, useEffect } from "react";
import {
  getTrendsStats,
  getTaskSessions,
  getFocusTimeData,
  getProjectDistribution,
  getGoalDays,
  type TrendsStats,
  type PomodoroSession,
  type FocusTimeData,
  type ProjectTimeDistribution,
  type GoalDayData,
} from "@/lib/supabase/trends-helpers";

export function useTrendsData(
  userId: string | null,
  timeRange: 'daily' | 'weekly' | 'monthly',
  startDate: string,
  endDate: string,
  selectedYear: number,
  selectedMonth: number
) {
  const [stats, setStats] = useState<TrendsStats | null>(null);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [focusData, setFocusData] = useState<FocusTimeData[]>([]);
  const [projectDistribution, setProjectDistribution] = useState<ProjectTimeDistribution[]>([]);
  const [goalDays, setGoalDays] = useState<GoalDayData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsRes, sessionsRes, focusRes, projectsRes, goalsRes] = await Promise.all([
        getTrendsStats(userId),
        getTaskSessions(userId, startDate, endDate),
        getFocusTimeData(userId, 30), // Last 30 days
        getProjectDistribution(userId, timeRange),
        getGoalDays(userId, selectedYear, selectedMonth),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (focusRes.data) setFocusData(focusRes.data);
      if (projectsRes.data) setProjectDistribution(projectsRes.data);
      if (goalsRes.data) setGoalDays(goalsRes.data);
    } catch (error) {
      console.error('Error fetching trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [userId, timeRange, startDate, endDate, selectedYear, selectedMonth]);

  return {
    stats,
    sessions,
    focusData,
    projectDistribution,
    goalDays,
    loading,
    refreshData: fetchAllData,
  };
}