// Create this file: src/types/database.ts
// ============================================
// DATABASE TYPES & INTERFACES
// ============================================
export type Theme = 'light' | 'dark' | 'system';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    timezone: string;
    subscription_tier: 'starter' | 'pro' | 'team';
    subscription_status: 'active' | 'cancelled' | 'expired';
    trial_ends_at: string;
    created_at: string;
    updated_at: string;
}

export interface UserStreak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    message: string;
    read: boolean;
    created_at: string;
    expires_at: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    theme: Theme;
    notifications_enabled: boolean;
    updated_at: string;
}

export type TagColor = 
  | 'red' 
  | 'pink' 
  | 'purple' 
  | 'indigo' 
  | 'blue' 
  | 'cyan' 
  | 'teal' 
  | 'green' 
  | 'lime' 
  | 'yellow' 
  | 'orange' 
  | 'brown' 
  | 'gray' 
  | 'slate' 
  | 'violet';

// Color Configuration for UI
export interface TagColorConfig {
  name: TagColor;
  lightBg: string;
  darkBg: string;
  lightText: string;
  darkText: string;
}

// Tag
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: TagColor;
  created_at: string;
  updated_at: string;
}

// Task
export interface Task {
  id: string;
  user_id: string;
  title: string;
  tag_id: string | null;
  is_important: boolean;
  is_completed: boolean;
  total_time_spent: number; // in seconds
  date: string; // YYYY-MM-DD format
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

// Task with Tag (for joins)
export interface TaskWithTag extends Task {
  tag: Tag | null;
}

// Task Session (Timer tracking)
export interface TaskSession {
  id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration: number; // in seconds
  date: string; // YYYY-MM-DD format
  created_at: string;
}

// Task Session with Task details (for timeline)
export interface TaskSessionWithTask extends TaskSession {
  task: TaskWithTag;
}

// Day Note
export interface DayNote {
  id: string;
  user_id: string;
  note_text: string | null;
  date: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

// Daily Goal
export interface DailyGoal {
  id: string;
  user_id: string;
  goal_hours: number;
  date: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

// =====================================================
// FORM & UI TYPES
// =====================================================

// Task Form Data (for Add/Edit modal)
export interface TaskFormData {
  title: string;
  tag_id: string | null;
  is_important: boolean;
}

// Tag Form Data
export interface TagFormData {
  name: string;
  color: TagColor;
}

// Daily Report Stats
export interface DailyReportStats {
  completedCount: number;
  inProgressCount: number;
  totalFocusedTime: number; // in seconds
  goalHours: number;
  goalPercentage: number;
}

// Timeline Block Data (for Kanban view)
export interface TimelineBlock {
  id: string;
  taskTitle: string;
  tagColor: TagColor;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
}

// Active Timer State
export interface ActiveTimer {
  taskId: string;
  taskTitle: string;
  startTime: Date;
  elapsedSeconds: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface TasksResponse {
  incompleteTasks: TaskWithTag[];
  completedTasks: TaskWithTag[];
}

// =====================================================
// UTILITY TYPES
// =====================================================

// For creating new records (without auto-generated fields)
export type CreateTag = Omit<Tag, 'id' | 'created_at' | 'updated_at'>;
export type CreateTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type CreateTaskSession = Omit<TaskSession, 'id' | 'created_at'>;
export type CreateDayNote = Omit<DayNote, 'id' | 'created_at' | 'updated_at'>;
export type CreateDailyGoal = Omit<DailyGoal, 'id' | 'created_at' | 'updated_at'>;

// For updating records (all fields optional except id)
export type UpdateTag = Partial<Omit<Tag, 'id' | 'user_id' | 'created_at'>>;
export type UpdateTask = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;
export type UpdateTaskSession = Partial<Omit<TaskSession, 'id' | 'task_id' | 'user_id' | 'created_at'>>;
export type UpdateDayNote = Partial<Omit<DayNote, 'id' | 'user_id' | 'created_at'>>;
export type UpdateDailyGoal = Partial<Omit<DailyGoal, 'id' | 'user_id' | 'created_at'>>;

// =====================================================
// COLOR CONFIGURATION CONSTANT
// =====================================================
export const TAG_COLORS: Record<TagColor, TagColorConfig> = {
  red: {
    name: 'red',
    lightBg: '#FEE2E2',
    darkBg: '#DC2626',
    lightText: '#991B1B',
    darkText: '#FEE2E2',
  },
  pink: {
    name: 'pink',
    lightBg: '#FCE7F3',
    darkBg: '#EC4899',
    lightText: '#9F1239',
    darkText: '#FCE7F3',
  },
  purple: {
    name: 'purple',
    lightBg: '#EDE9FE',
    darkBg: '#A855F7',
    lightText: '#6B21A8',
    darkText: '#EDE9FE',
  },
  indigo: {
    name: 'indigo',
    lightBg: '#E0E7FF',
    darkBg: '#6366F1',
    lightText: '#3730A3',
    darkText: '#E0E7FF',
  },
  blue: {
    name: 'blue',
    lightBg: '#DBEAFE',
    darkBg: '#3B82F6',
    lightText: '#1E3A8A',
    darkText: '#DBEAFE',
  },
  cyan: {
    name: 'cyan',
    lightBg: '#CFFAFE',
    darkBg: '#06B6D4',
    lightText: '#164E63',
    darkText: '#CFFAFE',
  },
  teal: {
    name: 'teal',
    lightBg: '#CCFBF1',
    darkBg: '#14B8A6',
    lightText: '#134E4A',
    darkText: '#CCFBF1',
  },
  green: {
    name: 'green',
    lightBg: '#D1FAE5',
    darkBg: '#10B981',
    lightText: '#065F46',
    darkText: '#D1FAE5',
  },
  lime: {
    name: 'lime',
    lightBg: '#ECFCCB',
    darkBg: '#84CC16',
    lightText: '#3F6212',
    darkText: '#ECFCCB',
  },
  yellow: {
    name: 'yellow',
    lightBg: '#FEF3C7',
    darkBg: '#F59E0B',
    lightText: '#78350F',
    darkText: '#FEF3C7',
  },
  orange: {
    name: 'orange',
    lightBg: '#FFEDD5',
    darkBg: '#F97316',
    lightText: '#9A3412',
    darkText: '#FFEDD5',
  },
  brown: {
    name: 'brown',
    lightBg: '#E7E5E4',
    darkBg: '#78716C',
    lightText: '#44403C',
    darkText: '#E7E5E4',
  },
  gray: {
    name: 'gray',
    lightBg: '#F3F4F6',
    darkBg: '#6B7280',
    lightText: '#374151',
    darkText: '#F3F4F6',
  },
  slate: {
    name: 'slate',
    lightBg: '#E2E8F0',
    darkBg: '#475569',
    lightText: '#1E293B',
    darkText: '#E2E8F0',
  },
  violet: {
    name: 'violet',
    lightBg: '#F3E8FF',
    darkBg: '#C026D3',
    lightText: '#701A75',
    darkText: '#F3E8FF',
  },
};

// =====================================================
// HELPER FUNCTIONS FOR TYPES
// =====================================================

// Format seconds to "2h 43m" format
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return '0m';
  }
}

// Calculate days since creation
export function daysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Format date to YYYY-MM-DD
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Parse date string to Date object
export function parseDateString(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

// Calculate goal percentage
export function calculateGoalPercentage(focusedSeconds: number, goalHours: number): number {
  const goalSeconds = goalHours * 3600;
  return goalSeconds > 0 ? Math.round((focusedSeconds / goalSeconds) * 100) : 0;
}

// Get goal card color based on percentage
export function getGoalCardColor(percentage: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (percentage < 30) {
    return {
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500/30',
    };
  } else if (percentage < 50) {
    return {
      bg: 'bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/30',
    };
  } else if (percentage < 85) {
    return {
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500/30',
    };
  } else {
    return {
      bg: 'bg-green-600/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-600/50',
    };
  }
}