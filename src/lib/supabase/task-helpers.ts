// src/lib/supabase/task-helpers.ts
// =====================================================
// VAIDEHI - TASK FEATURE HELPER FUNCTIONS
// =====================================================

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

/**
 * Get all tags for a user
 */
export async function getTags(userId: string): Promise<SupabaseResponse<Tag[]>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return { data, error };
}

/**
 * Create a new tag
 */
export async function createTag(tag: CreateTag): Promise<SupabaseResponse<Tag>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("tags")
    .insert(tag)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a tag
 */
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

/**
 * Delete a tag
 */
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

/**
 * Get tasks for a specific date
 */
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

  // Separate incomplete and completed tasks
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

/**
 * Get a single task by ID
 */
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

/**
 * Create a new task
 */
export async function createTask(task: CreateTask): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a task
 */
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

/**
 * Mark task as completed
 */
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

/**
 * Mark task as incomplete (undo completion)
 */
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

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<SupabaseResponse<null>> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  return { data: null, error };
}

/**
 * Add time to task's total_time_spent
 */
export async function addTimeToTask(
  taskId: string,
  seconds: number
): Promise<SupabaseResponse<Task>> {
  const supabase = createClient();
  
  // First get current time
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("total_time_spent")
    .eq("id", taskId)
    .single();

  if (fetchError || !task) {
    return { data: null, error: fetchError };
  }

  // Update with new total
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
// TASK SESSIONS (Timer Tracking)
// =====================================================

/**
 * Get sessions for a specific date
 */
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
        tag:tags(*)
      )
    `)
    .eq("user_id", userId)
    .eq("date", date)
    .order("start_time", { ascending: true });

  return { data, error };
}

/**
 * Create a new task session (start timer)
 */
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

/**
 * Update task session (end timer)
 */
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

/**
 * Get active session (end_time is null)
 */
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

/**
 * Delete a task session
 */
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

/**
 * Get day note for a specific date
 */
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

/**
 * Create or update day note
 */
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

/**
 * Delete day note
 */
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

/**
 * Get daily goal for a specific date
 */
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

/**
 * Create or update daily goal
 */
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

/**
 * Get daily report statistics
 */
export async function getDailyReportStats(
  userId: string,
  date: string
): Promise<SupabaseResponse<DailyReportStats>> {
  const supabase = createClient();
  
  // Get tasks for the date
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("is_completed, total_time_spent")
    .eq("user_id", userId)
    .eq("date", date);

  if (tasksError) {
    return { data: null, error: tasksError };
  }

  // Get daily goal
  const { data: goal } = await getDailyGoal(userId, date);
  const goalHours = goal?.goal_hours || 7; // Default 7 hours

  // Calculate stats
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

/**
 * Get total time spent on a specific date (sum of all task sessions)
 */
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

/**
 * Get task count by status for a date
 */
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

/**
 * Get all data for a specific date (tasks, sessions, note, goal)
 */
export async function getAllDataForDate(userId: string, date: string) {
  const supabase = createClient();

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