// src/lib/supabase/trends-helpers.ts
import { createClient } from "./client";
import type { 
  TaskWithTag,
  TaskSession,
  Project,
} from "@/types/database";

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
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Start of week (Monday)
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when day is Sunday
    startOfWeek.setDate(now.getDate() + diff);
    const weekStart = startOfWeek.toISOString().split('T')[0];

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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        date,
        total_time_spent,
        project_id,
        projects (
          title,
          color
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching focus time data:', error);
      return { data: [], error };
    }

    if (!tasks) return { data: [], error: null };

    // Group by date with type-safe handling
    const grouped: { [key: string]: FocusTimeData } = {};

    tasks.forEach(task => {
      const taskData = task as any; // Cast to handle nested structure
      const project = taskData.projects;

      if (!grouped[task.date]) {
        grouped[task.date] = {
          date: task.date,
          totalHours: 0,
          projects: []
        };
      }

      const hours = (task.total_time_spent || 0) / 3600;
      grouped[task.date].totalHours += hours;

      const projectName = project?.title || 'No Project';
      const projectColor = project?.color ? getProjectColor(project.color) : '#94a3b8';
      const existing = grouped[task.date].projects.find(p => p.name === projectName);

      if (existing) {
        existing.hours += hours;
      } else {
        grouped[task.date].projects.push({
          name: projectName,
          hours,
          color: projectColor
        });
      }
    });

    // Fill in missing dates with zero data
    const result: FocusTimeData[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push(grouped[dateStr] || {
        date: dateStr,
        totalHours: 0,
        projects: []
      });
    }

    return { data: result, error: null };
  } catch (error) {
    console.error('Error fetching focus time data:', error);
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
      .gte('date', startDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching project distribution:', error);
      return { data: [], error };
    }

    if (!tasks) return { data: [], error: null };

    // Group by project with type-safe handling
    const projectMap: { [key: string]: { hours: number; color: string } } = {};

    tasks.forEach(task => {
      const taskData = task as any; // Cast to handle nested structure
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

    // Get goals for the month
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;

    const { data: goals } = await supabase
      .from('daily_goals')
      .select('date, goal_hours')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    const { data: tasks } = await supabase
      .from('tasks')
      .select('date, total_time_spent')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (!goals || !tasks) return { data: [], error: null };

    const goalMap = new Map(goals.map(g => [g.date, g.goal_hours]));
    const workMap = new Map<string, number>();

    tasks.forEach(task => {
      const hours = (task.total_time_spent || 0) / 3600;
      workMap.set(task.date, (workMap.get(task.date) || 0) + hours);
    });

    const result: GoalDayData[] = [];
    goalMap.forEach((goalHours, date) => {
      const hoursWorked = workMap.get(date) || 0;
      result.push({
        date,
        goalMet: hoursWorked >= goalHours,
        hoursWorked,
        goalHours
      });
    });

    return { data: result, error: null };
  } catch (error) {
    console.error('Error fetching goal days:', error);
    return { data: [], error };
  }
}

// =====================================================
// HELPER FUNCTION - Convert project color to hex
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