// src/lib/supabase/trends-helpers.ts
// ✅ COMPLETE FIX: Ensures Focus Time Chart shows TODAY's data
import { createClient } from "./client";
import type {
  TaskWithTag,
  TaskSession,
  Project,
} from "@/types/database";

// =====================================================
// CRITICAL: LOCAL DATE HELPER - USE EVERYWHERE
// =====================================================

export function getLocalDateString(date: Date = new Date()): string {
  // ✅ Get LOCAL timezone date parts (not UTC)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// =====================================================
// TRENDS STATISTICS
// =====================================================

export interface TrendsStats {
  totalFocusTime: number;      // in minutes
  weekFocusTime: number;
  todayFocusTime: number;
  totalCompletedTasks: number;
  weekCompletedTasks: number;
  todayCompletedTasks: number;
}

export async function getTrendsStats(userId: string): Promise<{ data: TrendsStats | null; error: any }> {
  try {
    const supabase = createClient();
    
    // ✅ FIXED: Use local date helper
    const today = getLocalDateString();
    const weekStart = getLocalDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    // Get all tasks
    const { data: allTasks } = await supabase
      .from('tasks')
      .select('total_time_spent, is_completed, date')
      .eq('user_id', userId);

    if (!allTasks) return { data: null, error: 'No tasks found' };

    // Calculate stats
    const totalFocusTime = allTasks.reduce((sum, t) => sum + (t.total_time_spent || 0), 0);
    const weekFocusTime = allTasks
      .filter(t => t.date >= weekStart)
      .reduce((sum, t) => sum + (t.total_time_spent || 0), 0);
    const todayFocusTime = allTasks
      .filter(t => t.date === today)
      .reduce((sum, t) => sum + (t.total_time_spent || 0), 0);

    const totalCompletedTasks = allTasks.filter(t => t.is_completed).length;
    const weekCompletedTasks = allTasks.filter(t => t.is_completed && t.date >= weekStart).length;
    const todayCompletedTasks = allTasks.filter(t => t.is_completed && t.date === today).length;

    return {
      data: {
        totalFocusTime: Math.round(totalFocusTime / 60), // convert to minutes
        weekFocusTime: Math.round(weekFocusTime / 60),
        todayFocusTime: Math.round(todayFocusTime / 60),
        totalCompletedTasks,
        weekCompletedTasks,
        todayCompletedTasks
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching trends stats:', error);
    return { data: null, error };
  }
}

// =====================================================
// POMODORO SESSIONS (Task Sessions)
// =====================================================

export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  duration: number;           // in minutes
  taskTitle: string;
  projectName?: string;
  color: string;
}

export async function getTaskSessions(
  userId: string,
  startDate: string,
  endDate: string
): Promise<{ data: PomodoroSession[] | null; error: any }> {
  try {
    const supabase = createClient();

    const { data: sessions, error } = await supabase
      .from('task_sessions')
      .select(`
        id,
        start_time,
        duration,
        date,
        task_id,
        tasks!inner (
          title,
          project_id,
          projects (
            title,
            color
          )
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .not('end_time', 'is', null)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching sessions:', error);
      return { data: [], error };
    }

    if (!sessions) return { data: [], error: null };

    // Type-safe mapping with proper checks
    const formatted: PomodoroSession[] = sessions.map(s => {
      // Cast to any first to handle the nested structure
      const session = s as any;
      const task = session.tasks;
      const project = task?.projects;

      return {
        id: s.id,
        date: s.date,
        startTime: s.start_time,
        duration: Math.round((s.duration || 0) / 60), // convert to minutes
        taskTitle: task?.title || 'Unknown Task',
        projectName: project?.title,
        color: project?.color ? getProjectColor(project.color) : '#94a3b8'
      };
    });

    return { data: formatted, error: null };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { data: [], error };
  }
}

// =====================================================
// FOCUS TIME DATA (Bar Chart)
// ✅ CRITICAL FIX: Complete rewrite to ensure TODAY shows
// =====================================================

export interface FocusTimeData {
  date: string;
  totalHours: number;
  projects: {
    name: string;
    hours: number;
    color: string;
  }[];
}

export async function getFocusTimeData(
  userId: string,
  days: number = 30
): Promise<{ data: FocusTimeData[] | null; error: any }> {
  try {
    const supabase = createClient();
    
    // Calculate INCLUSIVE date range with local timezone
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));
    
    startDate.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    const startDateStr = getLocalDateString(startDate);
    const endDateStr = getLocalDateString(today);

    console.log('📅 Focus Time Data Range:', { startDateStr, endDateStr, today: getLocalDateString() });

    // ✅ FIX: Query task_sessions instead of tasks
    // This ensures we get the CORRECT duration per day (already split at midnight)
    const { data: sessions, error } = await supabase
      .from('task_sessions')
      .select(`
        date,
        duration,
        task_id,
        tasks!inner (
          project_id,
          projects (
            title,
            color
          )
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .not('end_time', 'is', null) // Only completed sessions
      .order('date', { ascending: true });

    if (error) {
      console.error('❌ Error fetching focus time data:', error);
      return { data: [], error };
    }

    console.log('✅ Fetched sessions:', sessions?.length || 0, 'records');

    if (!sessions) return { data: [], error: null };

    // ✅ Group by date with correct duration
    const grouped: { [key: string]: FocusTimeData } = {};

    sessions.forEach(session => {
      const sessionData = session as any;
      const project = sessionData.tasks?.projects;

      if (!grouped[session.date]) {
        grouped[session.date] = {
          date: session.date,
          totalHours: 0,
          projects: []
        };
      }

      // ✅ CRITICAL: Use session.duration (already split at midnight)
      const hours = (session.duration || 0) / 3600;
      grouped[session.date].totalHours += hours;

      const projectName = project?.title || 'No Project';
      const projectColor = project?.color ? getProjectColor(project.color) : '#94a3b8';
      const existing = grouped[session.date].projects.find(p => p.name === projectName);

      if (existing) {
        existing.hours += hours;
      } else {
        grouped[session.date].projects.push({
          name: projectName,
          hours,
          color: projectColor
        });
      }
    });

    // Fill in ALL dates from start to TODAY (inclusive)
    const result: FocusTimeData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = getLocalDateString(currentDate);
      
      result.push(grouped[dateStr] || {
        date: dateStr,
        totalHours: 0,
        projects: []
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('✅ Generated', result.length, 'days of data');
    console.log('📊 Last 3 dates:', result.slice(-3).map(r => ({ date: r.date, hours: r.totalHours })));

    // ✅ VALIDATION: Check for impossible hours
    const invalidDays = result.filter(r => r.totalHours > 24);
    if (invalidDays.length > 0) {
      console.error('❌ IMPOSSIBLE HOURS DETECTED:', invalidDays);
    }

    return { data: result, error: null };
  } catch (error) {
    console.error('❌ Error fetching focus time data:', error);
    return { data: [], error };
  }
}

// =====================================================
// PROJECT TIME DISTRIBUTION (Donut Chart)
// =====================================================

export interface ProjectTimeDistribution {
  projectName: string;
  totalHours: number;
  percentage: number;
  color: string;
}

export async function getProjectDistribution(
  userId: string,
  timeRange: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<{ data: ProjectTimeDistribution[] | null; error: any }> {
  try {
    const supabase = createClient();
    const now = new Date();
    let startDate: Date;

    // Calculate start date based on time range
    switch (timeRange) {
      case 'daily':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate = new Date(now);
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate.setDate(now.getDate() + diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const startDateStr = getLocalDateString(startDate);

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        total_time_spent,
        project_id,
        date,
        projects (
          title,
          color
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDateStr);

    if (error) {
      console.error('Error fetching project distribution:', error);
      return { data: [], error };
    }

    if (!tasks) return { data: [], error: null };

    // Group by project with type-safe handling
    const projectMap: { [key: string]: { hours: number; color: string } } = {};

    tasks.forEach(task => {
      const taskData = task as any;
      const project = taskData.projects;
      const projectName = project?.title || 'No Project';
      const hours = (task.total_time_spent || 0) / 3600;
      const color = project?.color ? getProjectColor(project.color) : '#94a3b8';

      if (!projectMap[projectName]) {
        projectMap[projectName] = { hours: 0, color };
      }

      projectMap[projectName].hours += hours;
    });

    const totalHours = Object.values(projectMap).reduce((sum, p) => sum + p.hours, 0);

    const distribution: ProjectTimeDistribution[] = Object.entries(projectMap)
      .map(([name, data]) => ({
        projectName: name,
        totalHours: data.hours,
        percentage: totalHours > 0 ? (data.hours / totalHours) * 100 : 0,
        color: data.color
      }))
      .sort((a, b) => b.totalHours - a.totalHours);

    return { data: distribution, error: null };
  } catch (error) {
    console.error('Error fetching project distribution:', error);
    return { data: [], error };
  }
}

// =====================================================
// GOAL TRACKING DATA (Calendar)
// =====================================================

export interface GoalDayData {
  date: string;
  goalMet: boolean;
  hoursWorked: number;
  goalHours: number;
}

export async function getGoalDays(
  userId: string,
  year: number,
  month: number
): Promise<{ data: GoalDayData[] | null; error: any }> {
  try {
    const supabase = createClient();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const startDateStr = getLocalDateString(startDate);
    const endDateStr = getLocalDateString(endDate);

    const { data: sessions, error: sessionsError } = await supabase
      .from('task_sessions')
      .select('date, duration')
      .eq('user_id', userId)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .not('end_time', 'is', null);

    if (sessionsError) return { data: null, error: sessionsError };

    const { data: goals, error: goalsError } = await supabase
      .from('daily_goals')
      .select('date, goal_hours')
      .eq('user_id', userId)
      .gte('date', startDateStr)
      .lte('date', endDateStr);

    if (goalsError) return { data: null, error: goalsError };

    const dateMap = new Map<string, { totalSeconds: number; goalHours: number }>();

    sessions?.forEach(s => {
      if (!dateMap.has(s.date)) {
        dateMap.set(s.date, { totalSeconds: 0, goalHours: 7 });
      }
      dateMap.get(s.date)!.totalSeconds += s.duration || 0;
    });

    goals?.forEach(g => {
      if (!dateMap.has(g.date)) {
        dateMap.set(g.date, { totalSeconds: 0, goalHours: g.goal_hours });
      } else {
        dateMap.get(g.date)!.goalHours = g.goal_hours;
      }
    });

    const result: GoalDayData[] = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      hoursWorked: data.totalSeconds / 3600,
      goalHours: data.goalHours,
      goalMet: (data.totalSeconds / 3600) >= data.goalHours,
    }));

    return { data: result, error: null };
  } catch (error) {
    console.error('Error fetching goal days:', error);
    return { data: null, error };
  }
}

// =====================================================
// HELPER FUNCTION
// =====================================================

function getProjectColor(color: string): string {
  const colorMap: { [key: string]: string } = {
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F97316',
    purple: '#A855F7',
    red: '#EF4444',
    teal: '#14B8A6',
    pink: '#EC4899',
    yellow: '#EAB308'
  };

  return colorMap[color] || '#94a3b8';
}

// =====================================================
// ✅ KEY CHANGES IN THIS FIX:
// =====================================================
/*
1. Line 177-178: Changed from (days) to (days - 1) to make range INCLUSIVE
   - Before: 30 days = Nov 28 - 30 days = Oct 29 (doesn't include Nov 28)
   - After: 30 days = Nov 28 - 29 days = Oct 30 (INCLUDES Nov 28)

2. Line 186: Added console logs to debug date range

3. Line 239-248: Changed date filling loop to use while() with <=
   - Ensures TODAY is ALWAYS included in the result

4. Line 250-251: Added debug logs to verify last dates

This ensures Nov 28 (today) will ALWAYS appear in Focus Time Chart!
*/