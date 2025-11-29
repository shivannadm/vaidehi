// src/lib/supabase/health-helpers.ts
import { createClient } from "@/lib/supabase/client";
import type { HealthEntry } from "@/types/database";

const supabase = createClient();

// Get health entry for a specific date
export async function getHealthEntryForDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from('health_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .limit(1);

  if (error) {
    return { data: null, error };
  }

  const entry = data && data.length > 0 ? data[0] : null;
  return { data: entry as HealthEntry | null, error: null };
}

// Get health entries for a date range
export async function getHealthEntriesForRange(
  userId: string, 
  startDate: string, 
  endDate: string
) {
  const { data, error } = await supabase
    .from('health_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  return { data: data as HealthEntry[] | null, error };
}

// Create or update (UPSERT) health entry
export async function upsertHealthEntry(
  entry: Partial<HealthEntry> & { user_id: string; date: string }
) {
  const { data, error } = await supabase
    .from('health_entries')
    .upsert(entry, { onConflict: 'user_id,date' })
    .select()
    .single();

  return { data: data as HealthEntry | null, error };
}

// Delete health entry
export async function deleteHealthEntry(entryId: string) {
  const { error } = await supabase
    .from('health_entries')
    .delete()
    .eq('id', entryId);

  return { error };
}

// Get weekly health stats
export async function getWeeklyHealthStats(userId: string) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  
  const startDate = weekAgo.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('health_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error || !data) {
    return {
      avgSleepQuality: 0,
      avgMood: 0,
      avgRecovery: 0,
      avgStress: 0,
      totalActiveMinutes: 0,
      avgWaterIntake: 0,
      activeDays: 0
    };
  }

  const avgSleepQuality = Math.round(
    data.reduce((sum, e) => sum + (e.sleep_quality || 0), 0) / data.length
  );
  
  const avgMood = Math.round(
    data.reduce((sum, e) => sum + (e.mood_rating || 0), 0) / data.length
  );
  
  const avgRecovery = Math.round(
    data.reduce((sum, e) => sum + (e.recovery_score || 0), 0) / data.length
  );

  const avgStress = Math.round(
    data.reduce((sum, e) => sum + (e.stress_level || 0), 0) / data.length
  );

  const totalActiveMinutes = data.reduce((sum, e) => sum + (e.active_minutes || 0), 0);
  
  const avgWaterIntake = Math.round(
    data.reduce((sum, e) => sum + (e.water_intake || 0), 0) / data.length
  );

  const activeDays = data.filter(e => (e.active_minutes || 0) >= 30).length;

  return {
    avgSleepQuality,
    avgMood,
    avgRecovery,
    avgStress,
    totalActiveMinutes,
    avgWaterIntake,
    activeDays
  };
}

// Calculate overall health score
export function calculateHealthScore(entry: Partial<HealthEntry>): number {
  const metrics = [
    entry.sleep_quality || 7,
    entry.diet_quality || 7,
    entry.recovery_score || 7,
    entry.mood_rating || 7,
    10 - (entry.stress_level || 5), // Invert stress (lower is better)
  ];

  const score = Math.round(
    metrics.reduce((sum, m) => sum + m, 0) / metrics.length
  );

  return Math.max(1, Math.min(10, score)); // Clamp between 1-10
}

// Get health trends (for visualization)
export async function getHealthTrends(userId: string, days: number = 30) {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - days);
  
  const startDate = pastDate.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('health_entries')
    .select('date, sleep_quality, mood_rating, recovery_score, stress_level, water_intake, active_minutes')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error || !data) {
    return { data: [], error };
  }

  // Calculate daily health scores
  const trends = data.map(entry => ({
    date: entry.date,
    healthScore: calculateHealthScore(entry),
    sleepQuality: entry.sleep_quality || 0,
    mood: entry.mood_rating || 0,
    recovery: entry.recovery_score || 0,
    stress: entry.stress_level || 0,
    waterIntake: entry.water_intake || 0,
    activeMinutes: entry.active_minutes || 0,
  }));

  return { data: trends, error: null };
}