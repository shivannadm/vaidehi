// src/lib/supabase/evening-helpers.ts
import { createClient } from "@/lib/supabase/client";
import type { EveningRoutineEntry } from "@/types/database";

const supabase = createClient();

// Get evening entry for a specific date
export async function getEveningEntryForDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from('evening_routine_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .limit(1);

  if (error) {
    return { data: null, error };
  }

  const entry = data && data.length > 0 ? data[0] : null;
  return { data: entry as EveningRoutineEntry | null, error: null };
}

// Get evening entries for a date range
export async function getEveningEntriesForRange(
  userId: string, 
  startDate: string, 
  endDate: string
) {
  const { data, error } = await supabase
    .from('evening_routine_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  return { data: data as EveningRoutineEntry[] | null, error };
}

// Create or update (UPSERT) evening entry
export async function upsertEveningEntry(
  entry: Partial<EveningRoutineEntry> & { user_id: string; date: string }
) {
  const { data, error } = await supabase
    .from('evening_routine_entries')
    .upsert(entry, { onConflict: 'user_id,date' })
    .select()
    .single();

  return { data: data as EveningRoutineEntry | null, error };
}

// Delete evening entry
export async function deleteEveningEntry(entryId: string) {
  const { error } = await supabase
    .from('evening_routine_entries')
    .delete()
    .eq('id', entryId);

  return { error };
}

// Get weekly average stats
export async function getEveningWeeklyStats(userId: string) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  
  const startDate = weekAgo.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('evening_routine_entries')
    .select('screen_time, reading_time, reflection_rating, shutdown_time')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error || !data) {
    return { 
      avgScreenTime: 0, 
      avgReadingTime: 0, 
      avgReflection: 0,
      mostCommonShutdown: null 
    };
  }

  const avgScreenTime = Math.round(
    data.reduce((sum, e) => sum + (e.screen_time || 0), 0) / data.length
  );
  
  const avgReadingTime = Math.round(
    data.reduce((sum, e) => sum + (e.reading_time || 0), 0) / data.length
  );
  
  const avgReflection = Math.round(
    data.reduce((sum, e) => sum + (e.reflection_rating || 0), 0) / data.length
  );

  // Find most common shutdown time
  const shutdownTimes = data
    .filter(e => e.shutdown_time)
    .map(e => e.shutdown_time);
  
  const mostCommonShutdown = shutdownTimes.length > 0
    ? shutdownTimes.sort((a, b) =>
        shutdownTimes.filter(v => v === a).length -
        shutdownTimes.filter(v => v === b).length
      ).pop()
    : null;

  return { 
    avgScreenTime, 
    avgReadingTime, 
    avgReflection,
    mostCommonShutdown 
  };
}