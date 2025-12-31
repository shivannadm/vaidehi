// src/app/dashboard/routine/health/hooks/useHealthTracking.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateToString } from "@/types/database";

export interface HealthEntry {
  id?: string;
  user_id: string;
  date: string;

  // Sleep Tracking (inspired by Oura Ring, Whoop)
  sleep_start?: string | null; // HH:mm
  sleep_end?: string | null; // HH:mm
  sleep_quality: number; // 1-10
  sleep_notes?: string | null;

  // Hydration (8 glasses = 2000ml standard)
  water_intake: number; // in ml

  // Nutrition
  meals_logged: number; // 0-5 meals
  protein_intake?: number | null; // grams
  calories_intake?: number | null;
  diet_quality: number; // 1-10 rating

  // Physical Activity
  steps_count?: number | null;
  active_minutes: number; // cardio/exercise minutes
  workout_type?: string | null; // "strength", "cardio", "yoga", etc.

  // Vitals & Recovery (inspired by Whoop, Fitbit)
  resting_heart_rate?: number | null; // BPM
  heart_rate_variability?: number | null; // ms
  recovery_score: number; // 1-10
  stress_level: number; // 1-10

  // Mental Wellness (inspired by Headspace)
  meditation_minutes: number;
  mood_rating: number; // 1-10
  anxiety_level: number; // 1-10

  // Body Metrics
  weight?: number | null; // kg
  body_temperature?: number | null; // celsius
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;

  // Habits & Lifestyle
  screen_time_limit_met: boolean;
  alcohol_units?: number | null;
  caffeine_intake?: number | null; // mg
  smoking_avoided: boolean;

  // Notes
  symptoms?: string | null;
  achievements?: string | null;
  notes?: string | null;

  // Streak
  health_streak?: number;

  created_at?: string;
  updated_at?: string;
}

export function useHealthTracking(userId: string | null, currentDate: Date) {
  const [entry, setEntry] = useState<Partial<HealthEntry>>({
    sleep_quality: 7,
    water_intake: 0,
    meals_logged: 0,
    diet_quality: 7,
    active_minutes: 0,
    recovery_score: 7,
    stress_level: 5,
    meditation_minutes: 0,
    mood_rating: 7,
    anxiety_level: 5,
    screen_time_limit_met: false,
    smoking_avoided: true,
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
        .from('health_entries')
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
          sleep_quality: existingEntry?.sleep_quality ?? 7,
          water_intake: existingEntry?.water_intake ?? 0,
          meals_logged: existingEntry?.meals_logged ?? 0,
          diet_quality: existingEntry?.diet_quality ?? 7,
          active_minutes: existingEntry?.active_minutes ?? 0,
          recovery_score: existingEntry?.recovery_score ?? 7,
          stress_level: existingEntry?.stress_level ?? 5,
          meditation_minutes: existingEntry?.meditation_minutes ?? 0,
          mood_rating: existingEntry?.mood_rating ?? 7,
          anxiety_level: existingEntry?.anxiety_level ?? 5,
          screen_time_limit_met: existingEntry?.screen_time_limit_met ?? false,
          smoking_avoided: existingEntry?.smoking_avoided ?? true,
          notes: existingEntry?.notes ?? '',
        });
      }
    } catch (err) {
      setError('Unexpected error loading entry');
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof HealthEntry>(
    field: K,
    value: HealthEntry[K]
  ) => {
    setEntry(prev => ({ ...prev, [field]: value } as Partial<HealthEntry>));
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
        .from('health_entries')
        .select('health_streak')
        .eq('user_id', userId)
        .eq('date', yesterdayStr)
        .limit(1);

      let newStreak = 1;
      if (yesterdayEntry && yesterdayEntry.length > 0) {
        newStreak = (yesterdayEntry[0].health_streak || 1) + 1;
      }

      const fullEntry: any = {
        ...entry,
        user_id: userId,
        date: dateStr,
        updated_at: new Date().toISOString(),
        health_streak: newStreak,
      };

      const { error: saveError } = await supabase
        .from('health_entries')
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