// src/app/dashboard/routine/evening/hooks/useEveningRoutine.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateToString } from "@/types/database";

export interface EveningRoutineEntry {
  id?: string;
  user_id: string;
  date: string;
  shutdown_time?: string | null;
  screen_time: number; // minutes
  reading_time: number; // minutes
  reflection_rating: number; // 1-10
  tomorrow_top_3?: string | null;
  gratitude_1?: string | null;
  gratitude_2?: string | null;
  gratitude_3?: string | null;
  notes?: string | null;
  custom_fields?: Record<string, string | number | boolean>;
  evening_streak?: number;
  created_at?: string;
  updated_at?: string;
}

export function useEveningRoutine(userId: string | null, currentDate: Date) {
  const [entry, setEntry] = useState<Partial<EveningRoutineEntry>>({
    screen_time: 0,
    reading_time: 0,
    reflection_rating: 5,
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const dateStr = formatDateToString(currentDate);
    loadEntry(userId, dateStr);
  }, [userId, currentDate]);

  const loadEntry = async (userId: string, date: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('evening_routine_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .limit(1);

      if (fetchError && fetchError.message !== 'JSON object requested, multiple (or no) rows returned') {
        setError(fetchError.message || 'Failed to load entry');
      } else {
        const existingEntry = data && data.length > 0 ? data[0] : null;
        setEntry({
          ...existingEntry,
          screen_time: existingEntry?.screen_time ?? 0,
          reading_time: existingEntry?.reading_time ?? 0,
          reflection_rating: existingEntry?.reflection_rating ?? 5,
          notes: existingEntry?.notes ?? '',
        });
      }
    } catch (err) {
      setError('Unexpected error loading entry');
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof EveningRoutineEntry>(
    field: K,
    value: EveningRoutineEntry[K]
  ) => {
    setEntry(prev => ({ ...prev, [field]: value } as Partial<EveningRoutineEntry>));
  };

  const saveEntry = async () => {
    if (!userId || saving) return false;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const dateStr = formatDateToString(currentDate);
      
      // Calculate streak
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateToString(yesterday);

      const { data: yesterdayEntry } = await supabase
        .from('evening_routine_entries')
        .select('evening_streak')
        .eq('user_id', userId)
        .eq('date', yesterdayStr)
        .limit(1);

      let newStreak = 1;
      if (yesterdayEntry && yesterdayEntry.length > 0) {
        newStreak = (yesterdayEntry[0].evening_streak || 1) + 1;
      }

      const fullEntry: any = {
        ...entry,
        user_id: userId,
        date: dateStr,
        updated_at: new Date().toISOString(),
        evening_streak: newStreak,
      };

      const { error: saveError } = await supabase
        .from('evening_routine_entries')
        .upsert(fullEntry, { onConflict: 'user_id,date' })
        .select()
        .single();

      if (saveError) {
        setError(saveError.message || 'Failed to save');
        return false;
      }

      await loadEntry(userId, dateStr);
      return true;
    } catch (err) {
      setError('Network error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { entry, loading, saving, error, updateField, saveEntry };
}