// src/lib/supabase/routine-helpers.ts
import { createClient } from "@/lib/supabase/client";
import type { MorningRoutineEntry } from "@/types/database";

const supabase = createClient();

// Get morning entry for a specific date
export async function getMorningEntryForDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from('morning_routine_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .limit(1);  // ← Safe: returns [] or [row]

  if (error) {
    return { data: null, error };
  }

  // Safely return the first (and only) entry, or null
  const entry = data && data.length > 0 ? data[0] : null;
  return { data: entry as MorningRoutineEntry | null, error: null };
}

// Get morning entries for a date range (e.g., for trends)
export async function getMorningEntriesForRange(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('morning_routine_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  return { data: data as MorningRoutineEntry[] | null, error };
}

// Create or update (UPSERT) morning entry
export async function upsertMorningEntry(entry: Partial<MorningRoutineEntry> & { user_id: string; date: string }) {
  const { data, error } = await supabase
    .from('morning_routine_entries')
    .upsert(entry, { onConflict: 'user_id,date' })
    .select()
    .single();

  return { data: data as MorningRoutineEntry | null, error };
}

// Delete morning entry
export async function deleteMorningEntry(entryId: string) {
  const { error } = await supabase
    .from('morning_routine_entries')
    .delete()
    .eq('id', entryId);

  return { error };
}