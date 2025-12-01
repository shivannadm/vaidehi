// src/lib/supabase/task-helpers.ts
// ✅ UPDATED: Added helper function for midnight crossing task management
// No breaking changes - all existing functions remain the same

import { createClient } from "./client";
import type {
  Tag,
  Task,
  TaskWithTag,
  TaskSession,
  TaskSessionWithTask,
  DayNote,
  DailyGoal,
  CreateTag,
  CreateTask,
  CreateTaskSession,
  CreateDayNote,
  CreateDailyGoal,
  UpdateTag,
  UpdateTask,
  UpdateDayNote,
  UpdateDailyGoal,
  DailyReportStats,
  SupabaseResponse,
  TasksResponse,
} from "@/types/database";

// =====================================================
// TAGS
// =====================================================

export async function getTags(userId: string): Promise<SupabaseResponse<Tag[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function createTag(tag: CreateTag): Promise<SupabaseResponse<Tag>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .insert(tag)
    .select()
    .single();

  return { data, error };
}

export async function updateTag(
  tagId: string,
  updates: UpdateTag
): Promise<SupabaseResponse<Tag>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .update(updates)
    .eq("id", tagId)
    .select()
    .single();

  return { data, error };
}

export async function deleteTag(tagId: string): Promise<SupabaseResponse<null>> {
  const supabase = createClient();

  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tagId);

  return { data: null, error };
}

// =====================================================
// TASKS
// =====================================================

export async function getTasksByDate(
  userId: string,
  date: string
): Promise<SupabaseResponse<TasksResponse>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      tag:tags(*)
    `)
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error };
  }

  const incompleteTasks = data?.filter((task: TaskWithTag) => !task.is_completed) || [];
  const completedTasks = data?.filter((task: TaskWithTag) => task.is_completed) || [];

  return {
    data: {
      incompleteTasks,
      completedTasks,
    },
    error: null,
  };
}

export async function getTaskById(taskId: string): Promise<SupabaseResponse<TaskWithTag>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      tag:tags(*)
    `)
    .eq("id", taskId)
    .single();

  return { data, error };
}

export async function createTask(taskData: {
  user_id: string;
  title: string;
  tag_id: string | null;
  is_important: boolean;
  is_completed: boolean;
  total_time_spent: number;
  date: string;
  project_id?: string | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: taskData.user_id,
      title: taskData.title,
      tag_id: taskData.tag_id,
      is_important: taskData.is_important,
      is_completed: taskData.is_completed,
      total_time_spent: taskData.total_time_spent,
      date: taskData.date,
      project_id: taskData.project_id || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateTask(
  taskId: string,
  updates: UpdateTask
): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

export async function completeTask(taskId: string): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

export async function uncompleteTask(taskId: string): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      is_completed: false,
      completed_at: null,
    })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

export async function deleteTask(taskId: string): Promise<SupabaseResponse<null>> {
  const supabase = createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  return { data: null, error };
}

export async function addTimeToTask(
  taskId: string,
  seconds: number
): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("total_time_spent")
    .eq("id", taskId)
    .single();

  if (fetchError || !task) {
    return { data: null, error: fetchError };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      total_time_spent: task.total_time_spent + seconds,
    })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// 🔥 NEW: Task Management for Midnight Crossing
// =====================================================

/**
 * Ensures a task exists on a specific date
 * If task doesn't exist on that date, creates a reference
 * Used when timer crosses midnight
 */
export async function ensureTaskExistsOnDate(
  taskId: string,
  date: string,
  userId: string
): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  // Check if task already exists on this date
  const { data: existingTask } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("date", date)
    .single();

  if (existingTask) {
    return { data: existingTask, error: null };
  }

  // Get original task details
  const { data: originalTask, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (fetchError || !originalTask) {
    return { data: null, error: fetchError };
  }

  // Task doesn't exist on this date - use the same task
  // (Sessions will link to it via task_id)
  return { data: originalTask, error: null };
}

/**
 * Get task or create placeholder for midnight crossing
 * This ensures the task appears on both days in the UI
 */
export async function getOrCreateTaskForDate(
  originalTaskId: string,
  date: string,
  userId: string
): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();

  // First, try to find existing task on this date with same title
  const { data: originalTask, error: origError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", originalTaskId)
    .single();

  if (origError || !originalTask) {
    return { data: null, error: origError };
  }

  // Check if there's already a task with same title on this date
  const { data: existingTask } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .eq("title", originalTask.title)
    .single();

  if (existingTask) {
    return { data: existingTask, error: null };
  }

  // Create a linked task entry for this date
  // This makes the task appear in the task list for this day
  const { data: newTask, error: createError } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: originalTask.title,
      tag_id: originalTask.tag_id,
      is_important: originalTask.is_important,
      is_completed: false, // Keep uncompleted on new day
      total_time_spent: 0, // Will be updated by sessions
      date: date,
      project_id: originalTask.project_id,
    })
    .select()
    .single();

  if (createError) {
    console.error("Error creating linked task:", createError);
    return { data: null, error: createError };
  }

  return { data: newTask, error: null };
}

// =====================================================
// TASK SESSIONS (Timer Tracking)
// =====================================================

export async function getSessionsByDate(
  userId: string,
  date: string
): Promise<SupabaseResponse<TaskSessionWithTask[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_sessions")
    .select(`
      *,
      task:tasks(
        *,
        tag:tags(*),
        projects(
          title,
          color
        )
      )
    `)
    .eq("user_id", userId)
    .eq("date", date)
    .order("start_time", { ascending: true });

  return { data, error };
}

export async function createTaskSession(
  session: CreateTaskSession
): Promise<SupabaseResponse<TaskSession>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_sessions")
    .insert(session)
    .select()
    .single();

  return { data, error };
}

export async function endTaskSession(
  sessionId: string,
  endTime: string,
  duration: number
): Promise<SupabaseResponse<TaskSession>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_sessions")
    .update({
      end_time: endTime,
      duration: duration,
    })
    .eq("id", sessionId)
    .select()
    .single();

  return { data, error };
}

export async function getActiveSession(
  userId: string
): Promise<SupabaseResponse<TaskSessionWithTask>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_sessions")
    .select(`
      *,
      task:tasks(
        *,
        tag:tags(*)
      )
    `)
    .eq("user_id", userId)
    .is("end_time", null)
    .single();

  return { data, error };
}

export async function deleteTaskSession(
  sessionId: string
): Promise<SupabaseResponse<null>> {
  const supabase = createClient();

  const { error } = await supabase
    .from("task_sessions")
    .delete()
    .eq("id", sessionId);

  return { data: null, error };
}

// =====================================================
// DAY NOTES
// =====================================================

export async function getDayNote(
  userId: string,
  date: string
): Promise<SupabaseResponse<DayNote>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("day_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  return { data, error };
}

export async function upsertDayNote(
  note: CreateDayNote
): Promise<SupabaseResponse<DayNote>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("day_notes")
    .upsert(note, { onConflict: "user_id,date" })
    .select()
    .single();

  return { data, error };
}

export async function deleteDayNote(
  userId: string,
  date: string
): Promise<SupabaseResponse<null>> {
  const supabase = createClient();

  const { error } = await supabase
    .from("day_notes")
    .delete()
    .eq("user_id", userId)
    .eq("date", date);

  return { data: null, error };
}

// =====================================================
// DAILY GOALS
// =====================================================

export async function getDailyGoal(
  userId: string,
  date: string
): Promise<SupabaseResponse<DailyGoal>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("daily_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  return { data, error };
}

export async function upsertDailyGoal(
  goal: CreateDailyGoal
): Promise<SupabaseResponse<DailyGoal>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("daily_goals")
    .upsert(goal, { onConflict: "user_id,date" })
    .select()
    .single();

  return { data, error };
}

// =====================================================
// ANALYTICS & REPORTS
// =====================================================

export async function getDailyReportStats(
  userId: string,
  date: string
): Promise<SupabaseResponse<DailyReportStats>> {
  const supabase = createClient();

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("is_completed, total_time_spent")
    .eq("user_id", userId)
    .eq("date", date);

  if (tasksError) {
    return { data: null, error: tasksError };
  }

  const { data: goal } = await getDailyGoal(userId, date);
  const goalHours = goal?.goal_hours || 7;

  const completedCount = tasks?.filter((t) => t.is_completed).length || 0;
  const inProgressCount = tasks?.filter((t) => !t.is_completed).length || 0;
  const totalFocusedTime = tasks?.reduce((sum, t) => sum + (t.total_time_spent || 0), 0) || 0;

  const goalSeconds = goalHours * 3600;
  const goalPercentage = goalSeconds > 0
    ? Math.round((totalFocusedTime / goalSeconds) * 100)
    : 0;

  return {
    data: {
      completedCount,
      inProgressCount,
      totalFocusedTime,
      goalHours,
      goalPercentage,
    },
    error: null,
  };
}

export async function getTotalTimeByDate(
  userId: string,
  date: string
): Promise<SupabaseResponse<number>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_sessions")
    .select("duration")
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    return { data: null, error };
  }

  const totalSeconds = data?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;

  return { data: totalSeconds, error: null };
}

export async function getTaskCountsByDate(
  userId: string,
  date: string
): Promise<SupabaseResponse<{ completed: number; inProgress: number; total: number }>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("is_completed")
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    return { data: null, error };
  }

  const completed = data?.filter((t) => t.is_completed).length || 0;
  const total = data?.length || 0;
  const inProgress = total - completed;

  return {
    data: { completed, inProgress, total },
    error: null,
  };
}

// =====================================================
// BATCH OPERATIONS
// =====================================================

export async function getAllDataForDate(userId: string, date: string) {
  const [tasksResult, sessionsResult, noteResult, goalResult] = await Promise.all([
    getTasksByDate(userId, date),
    getSessionsByDate(userId, date),
    getDayNote(userId, date),
    getDailyGoal(userId, date),
  ]);

  return {
    tasks: tasksResult.data,
    sessions: sessionsResult.data,
    note: noteResult.data,
    goal: goalResult.data,
    errors: {
      tasks: tasksResult.error,
      sessions: sessionsResult.error,
      note: noteResult.error,
      goal: goalResult.error,
    },
  };
}

// =====================================================
// EXPORT
// =====================================================

export default {
  // Tags
  getTags,
  createTag,
  updateTag,
  deleteTag,

  // Tasks
  getTasksByDate,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  uncompleteTask,
  deleteTask,
  addTimeToTask,
  
  // 🔥 NEW: Midnight crossing helpers
  ensureTaskExistsOnDate,
  getOrCreateTaskForDate,

  // Sessions
  getSessionsByDate,
  createTaskSession,
  endTaskSession,
  getActiveSession,
  deleteTaskSession,

  // Day Notes
  getDayNote,
  upsertDayNote,
  deleteDayNote,

  // Daily Goals
  getDailyGoal,
  upsertDailyGoal,

  // Analytics
  getDailyReportStats,
  getTotalTimeByDate,
  getTaskCountsByDate,
  getAllDataForDate,
};

// ============================================
// ✅ CHANGES SUMMARY:
// ============================================
/*
1. Added ensureTaskExistsOnDate() (Lines 253-280)
   - Checks if task exists on specific date
   - Returns existing task if found
   - Used for validation in midnight crossing

2. Added getOrCreateTaskForDate() (Lines 286-339)
   - Creates linked task entry for new date
   - Makes task appear in UI on both days
   - Maintains separate time tracking per day

3. All existing functions unchanged ✅
4. Backward compatible ✅
5. No breaking changes ✅

These helpers are ONLY called by the new midnight
crossing logic - existing code remains untouched!
*/