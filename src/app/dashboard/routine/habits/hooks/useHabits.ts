// CREATE: src/app/dashboard/routine/habits/hooks/useHabits.ts
import { useState, useEffect } from 'react';
import {
  getUserHabitsWithStats,
  toggleHabitCompletion,
  createHabit,
  updateHabit,
  deleteHabit,
  getWeeklyHabitSummary,
  getHabitAnalytics
} from '@/lib/supabase/habits-helpers';
import type {
  HabitWithStats,
  CreateHabit,
  UpdateHabit,
  HabitAnalytics,
  WeeklyHabitSummary
} from '@/types/database';

export function useHabits(userId: string | null) {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyHabitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load habits with stats
  const loadHabits = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getUserHabitsWithStats(userId);

      if (fetchError) {
        setError('Failed to load habits');
        console.error('Load habits error:', fetchError);
      } else if (data) {
        setHabits(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Load habits exception:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load weekly summary
  const loadWeeklySummary = async () => {
    if (!userId) return;

    try {
      const { data, error: fetchError } = await getWeeklyHabitSummary(userId);

      if (fetchError) {
        console.error('Load weekly summary error:', fetchError);
      } else if (data) {
        setWeeklyData(data);
      }
    } catch (err) {
      console.error('Load weekly summary exception:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadHabits();
    loadWeeklySummary();
  }, [userId]);

  // Toggle habit completion for today
  const toggleHabitToday = async (habitId: string) => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { error: toggleError } = await toggleHabitCompletion(
        habitId,
        userId,
        today
      );

      if (toggleError) {
        setError('Failed to update habit');
        console.error('Toggle habit error:', toggleError);
        return;
      }

      // Reload habits to get updated stats
      await loadHabits();
      await loadWeeklySummary();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Toggle habit exception:', err);
    }
  };

  // Create new habit
  const addHabit = async (habitData: CreateHabit) => {
    if (!userId) return null;

    try {
      const { data, error: createError } = await createHabit({
        ...habitData,
        user_id: userId
      });

      if (createError) {
        setError('Failed to create habit');
        console.error('Create habit error:', createError);
        return null;
      }

      // Reload habits
      await loadHabits();
      await loadWeeklySummary();

      return data;
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Create habit exception:', err);
      return null;
    }
  };

  // Update existing habit
  const editHabit = async (habitId: string, updates: UpdateHabit) => {
    try {
      const { data, error: updateError } = await updateHabit(habitId, updates);

      if (updateError) {
        setError('Failed to update habit');
        console.error('Update habit error:', updateError);
        return null;
      }

      // Reload habits
      await loadHabits();

      return data;
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Update habit exception:', err);
      return null;
    }
  };

  // Delete habit
  const removeHabit = async (habitId: string) => {
    try {
      const { error: deleteError } = await deleteHabit(habitId);

      if (deleteError) {
        setError('Failed to delete habit');
        console.error('Delete habit error:', deleteError);
        return false;
      }

      // Reload habits
      await loadHabits();
      await loadWeeklySummary();

      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Delete habit exception:', err);
      return false;
    }
  };

  // Get analytics for specific habit
  const getAnalytics = async (habitId: string): Promise<HabitAnalytics | null> => {
    try {
      const { data, error: analyticsError } = await getHabitAnalytics(habitId);

      if (analyticsError) {
        console.error('Get analytics error:', analyticsError);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Get analytics exception:', err);
      return null;
    }
  };

  // Calculate summary stats
  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.today_completed).length,
    avgCompletionRate: habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.completion_rate, 0) / habits.length
        )
      : 0,
    longestStreak: habits.length > 0
      ? Math.max(...habits.map(h => h.best_streak))
      : 0,
    activeStreaks: habits.filter(h => h.current_streak > 0).length
  };

  return {
    habits,
    weeklyData,
    stats,
    loading,
    error,
    toggleHabitToday,
    addHabit,
    editHabit,
    removeHabit,
    refreshHabits: loadHabits,
    getAnalytics
  };
}