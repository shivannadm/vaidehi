// CREATE: src/lib/supabase/habits-helpers.ts
import { createClient } from "./client";
import type { 
  Habit, 
  HabitCompletion, 
  HabitWithStats,
  CreateHabit,
  UpdateHabit,
  HabitAnalytics,
  WeeklyHabitSummary
} from "@/types/database";
import { calculateStreak, calculateCompletionRate } from "@/types/database";

const supabase = createClient();

// =====================================================
// HABIT CRUD OPERATIONS
// =====================================================

// Get all habits for user
export async function getUserHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return { data: data as Habit[] | null, error };
}

// Get single habit
export async function getHabit(habitId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();

  return { data: data as Habit | null, error };
}

// Create new habit
export async function createHabit(habit: CreateHabit) {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();

  return { data: data as Habit | null, error };
}

// Update habit
export async function updateHabit(habitId: string, updates: UpdateHabit) {
  const { data, error } = await supabase
    .from('habits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', habitId)
    .select()
    .single();

  return { data: data as Habit | null, error };
}

// Delete habit (soft delete by setting is_active to false)
export async function deleteHabit(habitId: string) {
  const { error } = await supabase
    .from('habits')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', habitId);

  return { error };
}

// =====================================================
// HABIT COMPLETION OPERATIONS
// =====================================================

// Toggle habit completion for a specific date
export async function toggleHabitCompletion(
  habitId: string,
  userId: string,
  date: string
) {
  // Check if completion exists
  const { data: existing } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('habit_completions')
      .update({ completed: !existing.completed })
      .eq('id', existing.id)
      .select()
      .single();

    return { data: data as HabitCompletion | null, error };
  } else {
    // Create new completion
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: habitId,
        user_id: userId,
        date,
        completed: true
      })
      .select()
      .single();

    return { data: data as HabitCompletion | null, error };
  }
}

// Get habit completions for date range
export async function getHabitCompletions(
  habitId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  return { data: data as HabitCompletion[] | null, error };
}

// Get all completions for user on specific date
export async function getDailyCompletions(userId: string, date: string) {
  const { data, error } = await supabase
    .from('habit_completions')
    .select(`
      *,
      habits (*)
    `)
    .eq('user_id', userId)
    .eq('date', date);

  return { data, error };
}

// =====================================================
// HABIT STATISTICS
// =====================================================

// Get habit with calculated statistics
export async function getHabitWithStats(habitId: string): Promise<{
  data: HabitWithStats | null;
  error: any;
}> {
  try {
    // Get habit
    const { data: habit, error: habitError } = await getHabit(habitId);
    if (habitError || !habit) return { data: null, error: habitError };

    // Get last 90 days of completions
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data: completions } = await getHabitCompletions(
      habitId,
      startDate,
      endDate
    );

    const completionData = completions || [];

    // Calculate streaks
    const { current: currentStreak, best: bestStreak } = calculateStreak(
      completionData.map(c => ({ date: c.date, completed: c.completed }))
    );

    // Calculate completion rate
    const completionRate = calculateCompletionRate(
      completionData.map(c => ({ date: c.date, completed: c.completed }))
    );

    // Get today's completion
    const today = new Date().toISOString().split('T')[0];
    const todayCompletion = completionData.find(c => c.date === today);

    // Get this week's count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const thisWeekCount = completionData.filter(
      c => c.date >= weekStartStr && c.completed
    ).length;

    // Get this month's count
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    const thisMonthCount = completionData.filter(
      c => c.date >= monthStartStr && c.completed
    ).length;

    const habitWithStats: HabitWithStats = {
      ...habit,
      current_streak: currentStreak,
      best_streak: bestStreak,
      completion_rate: completionRate,
      total_completions: completionData.filter(c => c.completed).length,
      today_completed: todayCompletion?.completed || false,
      this_week_count: thisWeekCount,
      this_month_count: thisMonthCount
    };

    return { data: habitWithStats, error: null };
  } catch (error) {
    console.error('Error getting habit with stats:', error);
    return { data: null, error };
  }
}

// Get all habits with statistics for user
export async function getUserHabitsWithStats(userId: string): Promise<{
  data: HabitWithStats[] | null;
  error: any;
}> {
  try {
    const { data: habits, error: habitsError } = await getUserHabits(userId);
    if (habitsError || !habits) return { data: null, error: habitsError };

    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const { data } = await getHabitWithStats(habit.id);
        return data;
      })
    );

    return { 
      data: habitsWithStats.filter(Boolean) as HabitWithStats[], 
      error: null 
    };
  } catch (error) {
    console.error('Error getting habits with stats:', error);
    return { data: null, error };
  }
}

// =====================================================
// HABIT ANALYTICS
// =====================================================

// Get detailed analytics for a habit
export async function getHabitAnalytics(habitId: string): Promise<{
  data: HabitAnalytics | null;
  error: any;
}> {
  try {
    const { data: habit, error: habitError } = await getHabit(habitId);
    if (habitError || !habit) return { data: null, error: habitError };

    // Get last 30 days
    const endDate = new Date().toISOString().split('T')[0];
    const startDate30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data: completions30 } = await getHabitCompletions(
      habitId,
      startDate30,
      endDate
    );

    // Get last 7 days
    const startDate7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data: completions7 } = await getHabitCompletions(
      habitId,
      startDate7,
      endDate
    );

    const completionData30 = completions30 || [];
    const completionData7 = completions7 || [];

    // Calculate streaks
    const { current: currentStreak, best: bestStreak } = calculateStreak(
      completionData30.map(c => ({ date: c.date, completed: c.completed }))
    );

    // Calculate completion rate
    const completionRate = calculateCompletionRate(
      completionData30.map(c => ({ date: c.date, completed: c.completed }))
    );

    const analytics: HabitAnalytics = {
      habitId: habit.id,
      habitName: habit.name,
      last30Days: completionData30.map(c => ({
        date: c.date,
        completed: c.completed
      })),
      last7Days: completionData7.map(c => ({
        date: c.date,
        completed: c.completed
      })),
      currentStreak,
      bestStreak,
      completionRate,
      totalDays: completionData30.length,
      completedDays: completionData30.filter(c => c.completed).length
    };

    return { data: analytics, error: null };
  } catch (error) {
    console.error('Error getting habit analytics:', error);
    return { data: null, error };
  }
}

// Get weekly summary for all habits
export async function getWeeklyHabitSummary(userId: string): Promise<{
  data: WeeklyHabitSummary | null;
  error: any;
}> {
  try {
    const { data: habits, error: habitsError } = await getUserHabits(userId);
    if (habitsError || !habits) return { data: null, error: habitsError };

    // Get this week's date range
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const habitSummaries = await Promise.all(
      habits.map(async (habit) => {
        const { data: completions } = await getHabitCompletions(
          habit.id,
          weekStartStr,
          weekEndStr
        );

        const completedDays = completions?.filter(c => c.completed).length || 0;
        const targetDays = habit.target_count;
        const percentage = targetDays > 0 
          ? (completedDays / targetDays) * 100 
          : 0;

        return {
          habitId: habit.id,
          habitName: habit.name,
          completedDays,
          targetDays,
          percentage: Math.round(percentage)
        };
      })
    );

    const overallCompletionRate = habitSummaries.length > 0
      ? Math.round(
          habitSummaries.reduce((sum, h) => sum + h.percentage, 0) / 
          habitSummaries.length
        )
      : 0;

    const summary: WeeklyHabitSummary = {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      habits: habitSummaries,
      overallCompletionRate
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error getting weekly summary:', error);
    return { data: null, error };
  }
}