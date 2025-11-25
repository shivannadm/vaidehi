// src/lib/supabase/highlight-helpers.ts
// =====================================================
// DAILY HIGHLIGHTS OPERATIONS
// =====================================================

import { createClient } from "./client";
import type {
  DailyHighlight,
  CreateDailyHighlight,
  UpdateDailyHighlight,
  YesterdaySnapshot,
  SupabaseResponse,
} from "@/types/database";
import { formatDateToString } from "@/types/database";

const supabase = createClient();

// =====================================================
// GET OPERATIONS
// =====================================================

/**
 * Get daily highlight for a specific date
 */
export async function getDailyHighlight(
  userId: string,
  date: string
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data, error } = await supabase
    .from("daily_highlights")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  return { data, error };
}

/**
 * Get yesterday's highlight
 */
export async function getYesterdayHighlight(
  userId: string
): Promise<SupabaseResponse<DailyHighlight>> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = formatDateToString(yesterday);

  return getDailyHighlight(userId, yesterdayDate);
}

/**
 * Get highlights for date range (for trends)
 */
export async function getHighlightsForRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<SupabaseResponse<DailyHighlight[]>> {
  const { data, error } = await supabase
    .from("daily_highlights")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  return { data, error };
}

// =====================================================
// CREATE/UPDATE OPERATIONS
// =====================================================

/**
 * Create or update daily highlight (upsert)
 */
export async function upsertDailyHighlight(
  highlight: CreateDailyHighlight
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data, error } = await supabase
    .from("daily_highlights")
    .upsert(highlight, { onConflict: "user_id,date" })
    .select()
    .single();

  return { data, error };
}

/**
 * Update highlight text only
 */
export async function updateHighlightText(
  userId: string,
  date: string,
  text: string
): Promise<SupabaseResponse<DailyHighlight>> {
  return upsertDailyHighlight({
    user_id: userId,
    date,
    highlight_text: text,
    highlight_completed: false,
    selection_reason: null,
    yesterday_reflection: null,
    tomorrow_preview: null,
  });
}

/**
 * Update highlight reason
 */
export async function updateHighlightReason(
  userId: string,
  date: string,
  reason: 'urgency' | 'satisfaction' | 'joy'
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data: existing } = await getDailyHighlight(userId, date);
  
  if (!existing) {
    return { data: null, error: new Error("Highlight not found") };
  }

  return upsertDailyHighlight({
    ...existing,
    selection_reason: reason,
  });
}

/**
 * Mark highlight as completed/incomplete
 */
export async function toggleHighlightCompletion(
  userId: string,
  date: string,
  completed: boolean
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data: existing } = await getDailyHighlight(userId, date);
  
  if (!existing) {
    return { data: null, error: new Error("Highlight not found") };
  }

  return upsertDailyHighlight({
    ...existing,
    highlight_completed: completed,
  });
}

/**
 * Update yesterday reflection
 */
export async function updateYesterdayReflection(
  userId: string,
  date: string,
  reflection: string
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data: existing } = await getDailyHighlight(userId, date);
  
  if (!existing) {
    return { data: null, error: new Error("Highlight not found") };
  }

  return upsertDailyHighlight({
    ...existing,
    yesterday_reflection: reflection,
  });
}

/**
 * Update tomorrow preview
 */
export async function updateTomorrowPreview(
  userId: string,
  date: string,
  preview: string
): Promise<SupabaseResponse<DailyHighlight>> {
  const { data: existing } = await getDailyHighlight(userId, date);
  
  if (!existing) {
    return { data: null, error: new Error("Highlight not found") };
  }

  return upsertDailyHighlight({
    ...existing,
    tomorrow_preview: preview,
  });
}

// =====================================================
// DELETE OPERATIONS
// =====================================================

/**
 * Delete daily highlight
 */
export async function deleteDailyHighlight(
  userId: string,
  date: string
): Promise<SupabaseResponse<null>> {
  const { error } = await supabase
    .from("daily_highlights")
    .delete()
    .eq("user_id", userId)
    .eq("date", date);

  return { data: null, error };
}

// =====================================================
// ANALYTICS OPERATIONS
// =====================================================

/**
 * Get yesterday's snapshot (tasks completed, time focused)
 */
export async function getYesterdaySnapshot(
  userId: string
): Promise<SupabaseResponse<YesterdaySnapshot>> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = formatDateToString(yesterday);

  // Get tasks for yesterday
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("is_completed, total_time_spent")
    .eq("user_id", userId)
    .eq("date", yesterdayDate);

  if (tasksError) {
    return { data: null, error: tasksError };
  }

  // Get yesterday's highlight reflection
  const { data: highlight } = await getYesterdayHighlight(userId);

  const tasksCompleted = tasks?.filter((t) => t.is_completed).length || 0;
  const timeFocused = tasks?.reduce((sum, t) => sum + (t.total_time_spent || 0), 0) || 0;

  return {
    data: {
      tasksCompleted,
      timeFocused,
      reflection: highlight?.yesterday_reflection || null,
    },
    error: null,
  };
}

/**
 * Get highlight completion streak
 */
export async function getHighlightStreak(
  userId: string
): Promise<SupabaseResponse<number>> {
  const today = new Date();
  let streak = 0;

  // Check backwards from today
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateString = formatDateToString(checkDate);

    const { data, error } = await getDailyHighlight(userId, dateString);

    if (error || !data || !data.highlight_completed) {
      break;
    }

    streak++;
  }

  return { data: streak, error: null };
}

/**
 * Get completion rate for last N days
 */
export async function getHighlightCompletionRate(
  userId: string,
  days: number = 7
): Promise<SupabaseResponse<number>> {
  const endDate = formatDateToString(new Date());
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateString = formatDateToString(startDate);

  const { data, error } = await getHighlightsForRange(userId, startDateString, endDate);

  if (error || !data) {
    return { data: 0, error };
  }

  const completed = data.filter((h) => h.highlight_completed).length;
  const total = data.length;

  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { data: rate, error: null };
}

// =====================================================
// EXPORT
// =====================================================

export default {
  getDailyHighlight,
  getYesterdayHighlight,
  getHighlightsForRange,
  upsertDailyHighlight,
  updateHighlightText,
  updateHighlightReason,
  toggleHighlightCompletion,
  updateYesterdayReflection,
  updateTomorrowPreview,
  deleteDailyHighlight,
  getYesterdaySnapshot,
  getHighlightStreak,
  getHighlightCompletionRate,
};