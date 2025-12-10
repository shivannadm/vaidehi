// src/lib/supabase/progress-helpers.ts
import { createClient } from "./client";
import type {
  MorningRoutineEntry,
  EveningRoutineEntry,
  HealthEntry,
  HabitWithStats,
} from "@/types/database";

const supabase = createClient();

// =====================================================
// PROGRESS OVERVIEW STATS
// =====================================================

export interface ProgressOverview {
  // Streaks
  currentMorningStreak: number;
  currentEveningStreak: number;
  currentHealthStreak: number;
  longestOverallStreak: number;

  // Completion Rates (Last 30 Days)
  morningCompletionRate: number;
  eveningCompletionRate: number;
  healthCompletionRate: number;
  habitCompletionRate: number;

  // Totals
  totalMorningEntries: number;
  totalEveningEntries: number;
  totalHealthEntries: number;
  totalHabitsTracked: number;

  // Averages
  avgMeditationTime: number;
  avgExerciseTime: number;
  avgSleepQuality: number;
  avgMoodRating: number;
  avgEnergyLevel: number;
}

export async function getProgressOverview(
  userId: string
): Promise<{ data: ProgressOverview | null; error: any }> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split("T")[0];

    const [morningRes, eveningRes, healthRes, habitsRes] = await Promise.all([
      supabase
        .from("morning_routine_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .order("date", { ascending: false }),

      supabase
        .from("evening_routine_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .order("date", { ascending: false }),

      supabase
        .from("health_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .order("date", { ascending: false }),

      supabase
        .from("habits")
        .select("*, habit_completions(*)")
        .eq("user_id", userId)
        .eq("is_active", true),
    ]);

    const morningEntries = morningRes.data || [];
    const eveningEntries = eveningRes.data || [];
    const healthEntries = healthRes.data || [];
    const habits = habitsRes.data || [];

    const currentMorningStreak =
      morningEntries.length > 0
        ? ((morningEntries[0] as any).morning_streak || 0)
        : 0;
    const currentEveningStreak =
      eveningEntries.length > 0
        ? ((eveningEntries[0] as any).evening_streak || 0)
        : 0;
    const currentHealthStreak =
      healthEntries.length > 0
        ? ((healthEntries[0] as any).health_streak || 0)
        : 0;

    const morningCompletionRate = (morningEntries.length / 30) * 100;
    const eveningCompletionRate = (eveningEntries.length / 30) * 100;
    const healthCompletionRate = (healthEntries.length / 30) * 100;

    let habitCompletionRate = 0;
    if (habits.length > 0) {
      const completions = habits.flatMap(
        (h: any) => h.habit_completions || []
      );
      const completedCount = completions.filter(
        (c: any) => c.completed
      ).length;
      const totalExpected = habits.length * 30;
      habitCompletionRate = (completedCount / totalExpected) * 100;
    }

    const avgMeditationTime =
      morningEntries.reduce(
        (sum, e: any) => sum + (e.meditation_time || 0),
        0
      ) / (morningEntries.length || 1);

    const avgExerciseTime =
      morningEntries.reduce((sum, e: any) => sum + (e.exercise_time || 0), 0) /
      (morningEntries.length || 1);

    const avgSleepQuality =
      healthEntries.reduce((sum, e: any) => sum + (e.sleep_quality || 0), 0) /
      (healthEntries.length || 1);

    const avgMoodRating =
      healthEntries.reduce((sum, e: any) => sum + (e.mood_rating || 0), 0) /
      (healthEntries.length || 1);

    const avgEnergyLevel =
      morningEntries.reduce((sum, e: any) => sum + (e.energy_level || 0), 0) /
      (morningEntries.length || 1);

    const overview: ProgressOverview = {
      currentMorningStreak,
      currentEveningStreak,
      currentHealthStreak,
      longestOverallStreak: Math.max(
        currentMorningStreak,
        currentEveningStreak,
        currentHealthStreak
      ),
      morningCompletionRate: Math.round(morningCompletionRate),
      eveningCompletionRate: Math.round(eveningCompletionRate),
      healthCompletionRate: Math.round(healthCompletionRate),
      habitCompletionRate: Math.round(habitCompletionRate),
      totalMorningEntries: morningEntries.length,
      totalEveningEntries: eveningEntries.length,
      totalHealthEntries: healthEntries.length,
      totalHabitsTracked: habits.length,
      avgMeditationTime: Math.round(avgMeditationTime),
      avgExerciseTime: Math.round(avgExerciseTime),
      avgSleepQuality: Math.round(avgSleepQuality * 10) / 10,
      avgMoodRating: Math.round(avgMoodRating * 10) / 10,
      avgEnergyLevel: Math.round(avgEnergyLevel * 10) / 10,
    };

    return { data: overview, error: null };
  } catch (error) {
    console.error("Error fetching progress overview:", error);
    return { data: null, error };
  }
}

// =====================================================
// ROUTINE CONSISTENCY DATA
// =====================================================

export interface RoutineConsistencyDay {
  date: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  healthCompleted: boolean;
  habitsCompleted: number;
  overallScore: number;
}

export async function getRoutineConsistency(
  userId: string,
  days: number = 30
): Promise<{ data: RoutineConsistencyDay[] | null; error: any }> {
  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const [morningRes, eveningRes, healthRes, habitsRes] = await Promise.all([
      supabase
        .from("morning_routine_entries")
        .select("date")
        .eq("user_id", userId)
        .gte("date", startDateStr),

      supabase
        .from("evening_routine_entries")
        .select("date")
        .eq("user_id", userId)
        .gte("date", startDateStr),

      supabase
        .from("health_entries")
        .select("date")
        .eq("user_id", userId)
        .gte("date", startDateStr),

      supabase
        .from("habit_completions")
        .select("date, completed")
        .eq("user_id", userId)
        .gte("date", startDateStr),
    ]);

    const morningDates = new Set(morningRes.data?.map((e) => e.date) || []);
    const eveningDates = new Set(eveningRes.data?.map((e) => e.date) || []);
    const healthDates = new Set(healthRes.data?.map((e) => e.date) || []);
    const habitsByDate: { [key: string]: number } = {};

    habitsRes.data?.forEach((h: any) => {
      if (!habitsByDate[h.date]) habitsByDate[h.date] = 0;
      if (h.completed) habitsByDate[h.date]++;
    });

    const { data: totalHabits } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true);

    const totalHabitsCount = totalHabits?.length || 1;
    const result: RoutineConsistencyDay[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0];

      const morningCompleted = morningDates.has(dateStr);
      const eveningCompleted = eveningDates.has(dateStr);
      const healthCompleted = healthDates.has(dateStr);
      const habitsCompleted =
        ((habitsByDate[dateStr] || 0) / totalHabitsCount) * 100;

      const overallScore = Math.round(
        ((morningCompleted ? 25 : 0) +
          (eveningCompleted ? 25 : 0) +
          (healthCompleted ? 25 : 0) +
          habitsCompleted * 0.25) *
          1
      );

      result.push({
        date: dateStr,
        morningCompleted,
        eveningCompleted,
        healthCompleted,
        habitsCompleted: Math.round(habitsCompleted),
        overallScore,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { data: result, error: null };
  } catch (error) {
    console.error("Error fetching routine consistency:", error);
    return { data: null, error };
  }
}

// =====================================================
// HEALTH TRENDS DATA
// =====================================================

export interface HealthTrendData {
  date: string;
  sleepQuality: number;
  moodRating: number;
  energyLevel: number;
  stressLevel: number;
  recoveryScore: number;
  activeMinutes: number;
  waterIntake: number;
}

export async function getHealthTrends(
  userId: string,
  days: number = 30
): Promise<{ data: HealthTrendData[] | null; error: any }> {
  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("health_entries")
      .select(
        "date, sleep_quality, mood_rating, stress_level, recovery_score, active_minutes, water_intake"
      )
      .eq("user_id", userId)
      .gte("date", startDateStr)
      .order("date", { ascending: true });

    if (error) return { data: null, error };

    const { data: morningData } = await supabase
      .from("morning_routine_entries")
      .select("date, energy_level")
      .eq("user_id", userId)
      .gte("date", startDateStr);

    const energyMap: { [key: string]: number } = {};
    morningData?.forEach((e: any) => {
      energyMap[e.date] = e.energy_level || 5;
    });

    const trends: HealthTrendData[] = (data || []).map((entry: any) => ({
      date: entry.date,
      sleepQuality: entry.sleep_quality || 0,
      moodRating: entry.mood_rating || 0,
      energyLevel: energyMap[entry.date] || 5,
      stressLevel: entry.stress_level || 0,
      recoveryScore: entry.recovery_score || 0,
      activeMinutes: entry.active_minutes || 0,
      waterIntake: entry.water_intake || 0,
    }));

    return { data: trends, error: null };
  } catch (error) {
    console.error("Error fetching health trends:", error);
    return { data: null, error };
  }
}

// =====================================================
// ✅ HABIT HEATMAP DATA - COMPLETE 90-DAY FIX
// =====================================================

export interface HabitCompletion {
  date: string;
  completed: boolean;
}

export interface HabitHeatmapData {
  habitId: string;
  habitName: string;
  habitIcon: string;
  habitColor: string;
  completions: HabitCompletion[];
  currentStreak: number;
  completionRate: number;
}

/**
 * ✅ Generate complete 90-day array with actual completion status
 */
function generateComplete90DayArray(completedDates: Set<string>): HabitCompletion[] {
  const completions: HabitCompletion[] = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    completions.push({
      date: dateStr,
      completed: completedDates.has(dateStr)
    });
  }
  
  return completions;
}

/**
 * ✅ Calculate current streak from completion array
 */
function calculateCurrentStreak(completions: HabitCompletion[]): number {
  let streak = 0;
  
  for (let i = completions.length - 1; i >= 0; i--) {
    if (completions[i].completed) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * ✅ Fetch habit heatmap with complete 90-day history
 */
export async function getHabitHeatmapData(
  userId: string,
  days: number = 90
): Promise<{ data: HabitHeatmapData[] | null; error: any }> {
  try {
    // 1. Fetch all active habits
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id, name, icon, color")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (habitsError) throw habitsError;
    if (!habits || habits.length === 0) return { data: [], error: null };

    // 2. Calculate date range
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const startDate = ninetyDaysAgo.toISOString().split('T')[0];

    // 3. Fetch ALL completions
    const { data: completions, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id, date, completed')
      .eq('user_id', userId)
      .gte('date', startDate)
      .eq('completed', true);

    if (completionsError) throw completionsError;

    // 4. Group completions by habit_id
    const completionsByHabit = new Map<string, Set<string>>();
    
    if (completions) {
      completions.forEach((c: any) => {
        if (!completionsByHabit.has(c.habit_id)) {
          completionsByHabit.set(c.habit_id, new Set());
        }
        completionsByHabit.get(c.habit_id)!.add(c.date);
      });
    }

    // 5. Build complete heatmap data
    const heatmapData: HabitHeatmapData[] = habits.map(habit => {
      const completedDates = completionsByHabit.get(habit.id) || new Set<string>();
      
      // ✅ Generate complete 90-day array
      const completions = generateComplete90DayArray(completedDates);
      
      const currentStreak = calculateCurrentStreak(completions);
      const completedCount = completions.filter(c => c.completed).length;
      const completionRate = Math.round((completedCount / 90) * 100);

      return {
        habitId: habit.id,
        habitName: habit.name,
        habitIcon: habit.icon || '🎯',
        habitColor: habit.color || '#6366F1',
        currentStreak,
        completionRate,
        completions
      };
    });

    return { data: heatmapData, error: null };
  } catch (error) {
    console.error('Error fetching habit heatmap data:', error);
    return { data: null, error };
  }
}

/**
 * ✅ Ensure habit completion records exist (called daily)
 */
export async function ensureHabitCompletionRecords(userId: string, date: string) {
  try {
    const { data: habits } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!habits || habits.length === 0) return;

    const { data: existingRecords } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('date', date);

    const existingHabitIds = new Set(existingRecords?.map(r => r.habit_id) || []);

    const missingRecords = habits
      .filter(h => !existingHabitIds.has(h.id))
      .map(h => ({
        user_id: userId,
        habit_id: h.id,
        date: date,
        completed: false,
        created_at: new Date().toISOString()
      }));

    if (missingRecords.length > 0) {
      await supabase
        .from('habit_completions')
        .insert(missingRecords);
    }
  } catch (error) {
    console.error('Error ensuring habit completion records:', error);
  }
}

// =====================================================
// WEEKLY SUMMARY
// =====================================================

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  morningDays: number;
  eveningDays: number;
  healthDays: number;
  totalMeditationMinutes: number;
  totalExerciseMinutes: number;
  avgSleepQuality: number;
  avgMood: number;
  habitCompletionRate: number;
  overallScore: number;
}

export async function getWeeklySummary(
  userId: string
): Promise<{ data: WeeklySummary | null; error: any }> {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const [morningRes, eveningRes, healthRes, habitsRes] = await Promise.all([
      supabase
        .from("morning_routine_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", weekStartStr),

      supabase
        .from("evening_routine_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", weekStartStr),

      supabase
        .from("health_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("date", weekStartStr),

      supabase
        .from("habit_completions")
        .select("completed")
        .eq("user_id", userId)
        .gte("date", weekStartStr),
    ]);

    const morningEntries = morningRes.data || [];
    const eveningEntries = eveningRes.data || [];
    const healthEntries = healthRes.data || [];
    const habitCompletions = habitsRes.data || [];

    const totalMeditationMinutes = morningEntries.reduce(
      (sum, e: any) => sum + (e.meditation_time || 0),
      0
    );
    const totalExerciseMinutes = morningEntries.reduce(
      (sum, e: any) => sum + (e.exercise_time || 0),
      0
    );
    const avgSleepQuality =
      healthEntries.reduce((sum, e: any) => sum + (e.sleep_quality || 0), 0) /
      (healthEntries.length || 1);
    const avgMood =
      healthEntries.reduce((sum, e: any) => sum + (e.mood_rating || 0), 0) /
      (healthEntries.length || 1);

    const habitCompletionRate =
      (habitCompletions.filter((h: any) => h.completed).length /
        (habitCompletions.length || 1)) *
      100;

    const overallScore = Math.round(
      (morningEntries.length / 7) * 25 +
        (eveningEntries.length / 7) * 25 +
        (healthEntries.length / 7) * 25 +
        habitCompletionRate * 0.25
    );

    return {
      data: {
        weekStart: weekStartStr,
        weekEnd: now.toISOString().split("T")[0],
        morningDays: morningEntries.length,
        eveningDays: eveningEntries.length,
        healthDays: healthEntries.length,
        totalMeditationMinutes,
        totalExerciseMinutes,
        avgSleepQuality: Math.round(avgSleepQuality * 10) / 10,
        avgMood: Math.round(avgMood * 10) / 10,
        habitCompletionRate: Math.round(habitCompletionRate),
        overallScore,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    return { data: null, error };
  }
}