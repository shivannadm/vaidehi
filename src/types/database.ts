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
  is_recurring: boolean;
  total_time_spent: number; // in seconds
  date: string; // YYYY-MM-DD format
  created_at: string;
  completed_at: string | null;
  updated_at: string;
  project_id?: string | null;
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

// ============================================================
// Schedule Things
// ============================================

// =====================================================
// SCHEDULE TYPES & INTERFACES
// Add these to your existing src/types/database.ts
// =====================================================

// Event Types
export type EventType = 'trading' | 'routine' | 'personal' | 'meeting' | 'break';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly';

// Event Type Colors Configuration
export interface EventTypeConfig {
  type: EventType;
  label: string;
  lightBg: string;
  darkBg: string;
  lightText: string;
  darkText: string;
  icon: string; // emoji or icon name
}

// Schedule Event
export interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  event_type: EventType;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:mm:ss format
  end_time: string; // HH:mm:ss format
  description: string | null;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  recurrence_end_date: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// FORM & UI TYPES
// =====================================================

// Event Form Data (for Add/Edit modal)
export interface EventFormData {
  title: string;
  event_type: EventType;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
}

// Calendar Day Data
export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  eventCount: number;
  events: ScheduleEvent[];
}

// Month View Data
export interface MonthViewData {
  month: number; // 0-11
  year: number;
  monthName: string;
  weeks: CalendarDay[][];
}

// =====================================================
// UTILITY TYPES
// =====================================================

// For creating new events
export type CreateScheduleEvent = Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>;

// For updating events
export type UpdateScheduleEvent = Partial<Omit<ScheduleEvent, 'id' | 'user_id' | 'created_at'>>;

// =====================================================
// EVENT TYPE COLOR CONFIGURATION
// =====================================================
export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  trading: {
    type: 'trading',
    label: 'Trading',
    lightBg: '#DBEAFE', // Blue
    darkBg: '#3B82F6',
    lightText: '#1E3A8A',
    darkText: '#DBEAFE',
    icon: '📈',
  },
  routine: {
    type: 'routine',
    label: 'Routine',
    lightBg: '#EDE9FE', // Purple
    darkBg: '#A855F7',
    lightText: '#6B21A8',
    darkText: '#EDE9FE',
    icon: '🔄',
  },
  personal: {
    type: 'personal',
    label: 'Personal',
    lightBg: '#D1FAE5', // Green
    darkBg: '#10B981',
    lightText: '#065F46',
    darkText: '#D1FAE5',
    icon: '👤',
  },
  meeting: {
    type: 'meeting',
    label: 'Meeting',
    lightBg: '#FFEDD5', // Orange
    darkBg: '#F97316',
    lightText: '#9A3412',
    darkText: '#FFEDD5',
    icon: '👥',
  },
  break: {
    type: 'break',
    label: 'Break',
    lightBg: '#F3F4F6', // Gray
    darkBg: '#6B7280',
    lightText: '#374151',
    darkText: '#F3F4F6',
    icon: '☕',
  },
};

// =====================================================
// HELPER FUNCTIONS FOR SCHEDULE
// =====================================================

// Format time from 24h to 12h format
export function formatTimeTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format time from 12h to 24h format
export function formatTimeTo24Hour(time12: string): string {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '00:00:00';

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

// Format event time range
export function formatEventTimeRange(startTime: string, endTime: string): string {
  return `${formatTimeTo12Hour(startTime)} - ${formatTimeTo12Hour(endTime)}`;
}

// Calculate event duration in minutes
export function calculateEventDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return endTotalMinutes - startTotalMinutes;
}

// Format duration to readable string
export function formatEventDuration(startTime: string, endTime: string): string {
  const minutes = calculateEventDuration(startTime, endTime);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

// Check if event is today
export function isEventToday(eventDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return eventDate === today;
}

// Get month name
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

// Get short month name
export function getShortMonthName(month: number): string {
  return getMonthName(month).substring(0, 3);
}

// Get day name
export function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// Get short day name
export function getShortDayName(date: Date): string {
  return getDayName(date).substring(0, 3);
}

// Generate calendar weeks for a month
export function generateMonthCalendar(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  for (let i = 0; i < 42; i++) { // 6 weeks max
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    currentWeek.push(currentDate);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    // Stop if we've passed the last day and completed the week
    if (currentDate > lastDay && currentWeek.length === 0) {
      break;
    }
  }

  return weeks;
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

// Sort events by start time
export function sortEventsByTime(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    return a.start_time.localeCompare(b.start_time);
  });
}

// Get events for specific date
export function getEventsForDate(events: ScheduleEvent[], date: string): ScheduleEvent[] {
  return events.filter(event => event.date === date);
}

// Get event type config
export function getEventTypeConfig(eventType: EventType): EventTypeConfig {
  return EVENT_TYPE_CONFIG[eventType];
}
// =====================================================
// DAILY HIGHLIGHTS TYPES
// Add these to your existing src/types/database.ts
// =====================================================

export type HighlightReason = 'urgency' | 'satisfaction' | 'joy';

// Daily Highlight
export interface DailyHighlight {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  highlight_text: string;
  highlight_completed: boolean;
  selection_reason: HighlightReason | null;
  yesterday_reflection: string | null;
  tomorrow_preview: string | null;
  created_at: string;
  updated_at: string;
}

// For creating new highlights
export type CreateDailyHighlight = Omit<DailyHighlight, 'id' | 'created_at' | 'updated_at'>;

// For updating highlights
export type UpdateDailyHighlight = Partial<Omit<DailyHighlight, 'id' | 'user_id' | 'created_at'>>;

// Yesterday's snapshot data
export interface YesterdaySnapshot {
  tasksCompleted: number;
  timeFocused: number; // in seconds
  reflection: string | null;
}

// Highlight reason configuration
export interface HighlightReasonConfig {
  reason: HighlightReason;
  label: string;
  description: string;
  icon: string;
  lightBg: string;
  darkBg: string;
  lightText: string;
  darkText: string;
  lightBorder: string;
  darkBorder: string;
}

// =====================================================
// HIGHLIGHT REASON CONFIGURATION
// =====================================================
export const HIGHLIGHT_REASONS: Record<HighlightReason, HighlightReasonConfig> = {
  urgency: {
    reason: 'urgency',
    label: 'Urgency',
    description: 'Has a deadline',
    icon: '⚡',
    lightBg: '#FEE2E2',
    darkBg: '#991B1B',
    lightText: '#991B1B',
    darkText: '#FEE2E2',
    lightBorder: '#DC2626',
    darkBorder: '#FCA5A5',
  },
  satisfaction: {
    reason: 'satisfaction',
    label: 'Satisfaction',
    description: 'Would feel great to complete',
    icon: '🎯',
    lightBg: '#DBEAFE',
    darkBg: '#1E3A8A',
    lightText: '#1E3A8A',
    darkText: '#DBEAFE',
    lightBorder: '#3B82F6',
    darkBorder: '#93C5FD',
  },
  joy: {
    reason: 'joy',
    label: 'Joy',
    description: 'Would bring happiness',
    icon: '✨',
    lightBg: '#FCE7F3',
    darkBg: '#831843',
    lightText: '#9F1239',
    darkText: '#FCE7F3',
    lightBorder: '#EC4899',
    darkBorder: '#F9A8D4',
  },
};

// =====================================================
// HELPER FUNCTIONS FOR HIGHLIGHTS
// =====================================================

// Get reason config
export function getHighlightReasonConfig(reason: HighlightReason): HighlightReasonConfig {
  return HIGHLIGHT_REASONS[reason];
}

// Format yesterday's snapshot for display
export function formatYesterdaySnapshot(snapshot: YesterdaySnapshot): string {
  const { tasksCompleted, timeFocused } = snapshot;
  return `${tasksCompleted} tasks completed • ${formatDuration(timeFocused)} focused`;
}

// highlights
// ADD TO: src/types/database.ts

// ============================================
// NOTES TYPES
// ============================================

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: NoteColor;
  is_pinned: boolean;
  is_archived: boolean;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export type NoteColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "purple"
  | "pink";

export const NOTE_COLORS: Record<
  NoteColor,
  {
    lightBg: string;
    darkBg: string;
    lightBorder: string;
    darkBorder: string;
    lightText: string;
    darkText: string;
  }
> = {
  default: {
    lightBg: "#ffffff",
    darkBg: "#1e293b",
    lightBorder: "#e2e8f0",
    darkBorder: "#334155",
    lightText: "#0f172a",
    darkText: "#f1f5f9",
  },
  red: {
    lightBg: "#fee2e2",
    darkBg: "#7f1d1d",
    lightBorder: "#fca5a5",
    darkBorder: "#991b1b",
    lightText: "#7f1d1d",
    darkText: "#fecaca",
  },
  orange: {
    lightBg: "#ffedd5",
    darkBg: "#7c2d12",
    lightBorder: "#fdba74",
    darkBorder: "#9a3412",
    lightText: "#7c2d12",
    darkText: "#fed7aa",
  },
  yellow: {
    lightBg: "#fef3c7",
    darkBg: "#713f12",
    lightBorder: "#fde047",
    darkBorder: "#854d0e",
    lightText: "#713f12",
    darkText: "#fef08a",
  },
  green: {
    lightBg: "#d1fae5",
    darkBg: "#14532d",
    lightBorder: "#6ee7b7",
    darkBorder: "#166534",
    lightText: "#14532d",
    darkText: "#86efac",
  },
  teal: {
    lightBg: "#ccfbf1",
    darkBg: "#134e4a",
    lightBorder: "#5eead4",
    darkBorder: "#115e59",
    lightText: "#134e4a",
    darkText: "#99f6e4",
  },
  blue: {
    lightBg: "#dbeafe",
    darkBg: "#1e3a8a",
    lightBorder: "#93c5fd",
    darkBorder: "#1e40af",
    lightText: "#1e3a8a",
    darkText: "#bfdbfe",
  },
  purple: {
    lightBg: "#e9d5ff",
    darkBg: "#581c87",
    lightBorder: "#c084fc",
    darkBorder: "#6b21a8",
    lightText: "#581c87",
    darkText: "#d8b4fe",
  },
  pink: {
    lightBg: "#fce7f3",
    darkBg: "#831843",
    lightBorder: "#f9a8d4",
    darkBorder: "#9f1239",
    lightText: "#831843",
    darkText: "#fbcfe8",
  },
};

// ============================================
// ADD TO: src/types/database.ts
// Add these types at the end of the file
// ============================================

// ============================================
// PROJECTS TYPES
// ============================================

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  color: ProjectColor;
  is_favorite: boolean;
  start_date: string | null;
  target_end_date: string | null;
  progress: number;
  total_tasks: number;
  completed_tasks: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived';

export type ProjectPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ProjectColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'pink'
  | 'yellow';

// ============================================
// PROJECT STATUS CONFIG
// ============================================

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    icon: string;
    lightBg: string;
    darkBg: string;
    lightText: string;
    darkText: string;
    lightBorder: string;
    darkBorder: string;
  }
> = {
  planning: {
    label: 'Planning',
    icon: '📋',
    lightBg: '#e0e7ff',
    darkBg: '#312e81',
    lightText: '#3730a3',
    darkText: '#c7d2fe',
    lightBorder: '#a5b4fc',
    darkBorder: '#4338ca',
  },
  active: {
    label: 'Active',
    icon: '🟢',
    lightBg: '#d1fae5',
    darkBg: '#14532d',
    lightText: '#065f46',
    darkText: '#86efac',
    lightBorder: '#6ee7b7',
    darkBorder: '#166534',
  },
  on_hold: {
    label: 'On Hold',
    icon: '⏸️',
    lightBg: '#fef3c7',
    darkBg: '#713f12',
    lightText: '#92400e',
    darkText: '#fef08a',
    lightBorder: '#fde047',
    darkBorder: '#854d0e',
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    lightBg: '#dbeafe',
    darkBg: '#1e3a8a',
    lightText: '#1e40af',
    darkText: '#bfdbfe',
    lightBorder: '#93c5fd',
    darkBorder: '#1e40af',
  },
  archived: {
    label: 'Archived',
    icon: '📦',
    lightBg: '#e2e8f0',
    darkBg: '#334155',
    lightText: '#475569',
    darkText: '#cbd5e1',
    lightBorder: '#cbd5e1',
    darkBorder: '#475569',
  },
};

// ============================================
// PROJECT PRIORITY CONFIG
// ============================================

export const PROJECT_PRIORITY_CONFIG: Record<
  ProjectPriority,
  {
    label: string;
    icon: string;
    color: string;
  }
> = {
  low: {
    label: 'Low',
    icon: '⬇️',
    color: '#64748b',
  },
  medium: {
    label: 'Medium',
    icon: '➡️',
    color: '#3b82f6',
  },
  high: {
    label: 'High',
    icon: '⬆️',
    color: '#f59e0b',
  },
  critical: {
    label: 'Critical',
    icon: '🔴',
    color: '#ef4444',
  },
};

// ============================================
// PROJECT COLOR THEMES
// ============================================

export const PROJECT_COLORS: Record<
  ProjectColor,
  {
    lightBg: string;
    darkBg: string;
    lightBorder: string;
    darkBorder: string;
    lightText: string;
    darkText: string;
  }
> = {
  blue: {
    lightBg: '#dbeafe',
    darkBg: '#1e3a8a',
    lightBorder: '#93c5fd',
    darkBorder: '#1e40af',
    lightText: '#1e3a8a',
    darkText: '#bfdbfe',
  },
  green: {
    lightBg: '#d1fae5',
    darkBg: '#14532d',
    lightBorder: '#6ee7b7',
    darkBorder: '#166534',
    lightText: '#14532d',
    darkText: '#86efac',
  },
  orange: {
    lightBg: '#ffedd5',
    darkBg: '#7c2d12',
    lightBorder: '#fdba74',
    darkBorder: '#9a3412',
    lightText: '#7c2d12',
    darkText: '#fed7aa',
  },
  purple: {
    lightBg: '#e9d5ff',
    darkBg: '#581c87',
    lightBorder: '#c084fc',
    darkBorder: '#6b21a8',
    lightText: '#581c87',
    darkText: '#d8b4fe',
  },
  red: {
    lightBg: '#fee2e2',
    darkBg: '#7f1d1d',
    lightBorder: '#fca5a5',
    darkBorder: '#991b1b',
    lightText: '#7f1d1d',
    darkText: '#fecaca',
  },
  teal: {
    lightBg: '#ccfbf1',
    darkBg: '#134e4a',
    lightBorder: '#5eead4',
    darkBorder: '#115e59',
    lightText: '#134e4a',
    darkText: '#99f6e4',
  },
  pink: {
    lightBg: '#fce7f3',
    darkBg: '#831843',
    lightBorder: '#f9a8d4',
    darkBorder: '#9f1239',
    lightText: '#831843',
    darkText: '#fbcfe8',
  },
  yellow: {
    lightBg: '#fef3c7',
    darkBg: '#713f12',
    lightBorder: '#fde047',
    darkBorder: '#854d0e',
    lightText: '#713f12',
    darkText: '#fef08a',
  },
};

// ============================================
// PROJECT WITH TASKS (for detailed view)
// ============================================

export interface ProjectWithTasks extends Project {
  tasks: TaskWithTag[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProjectStatusConfig(status: ProjectStatus) {
  return PROJECT_STATUS_CONFIG[status];
}

export function getProjectPriorityConfig(priority: ProjectPriority) {
  return PROJECT_PRIORITY_CONFIG[priority];
}

export function getProjectColorTheme(color: ProjectColor) {
  return PROJECT_COLORS[color];
}

export function calculateDaysRemaining(targetDate: string | null): number | null {
  if (!targetDate) return null;

  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function isProjectOverdue(targetDate: string | null): boolean {
  const daysRemaining = calculateDaysRemaining(targetDate);
  return daysRemaining !== null && daysRemaining < 0;
}

export function formatProjectDateRange(
  startDate: string | null,
  endDate: string | null
): string {
  if (!startDate && !endDate) return 'No timeline set';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (startDate && endDate) {
    return `${formatDate(startDate)} → ${formatDate(endDate)}`;
  } else if (startDate) {
    return `Started ${formatDate(startDate)}`;
  } else {
    return `Due ${formatDate(endDate!)}`;
  }
}

// Add to src/types/database.ts

// Morning Routine Entry Type (for journaling wake-up, habits, energy)
export interface MorningRoutineEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  wake_time?: string | null; // e.g., "07:30"
  meditation_time: number; // minutes
  exercise_time: number; // minutes
  energy_level: number; // 1-10
  notes?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Add to MorningRoutineEntry interface
export interface MorningRoutineEntry {
  // ... existing fields
  custom_fields?: Record<string, string | number | boolean>;
  morning_streak?: number;
}

// ============================================
// EVENING ROUTINE TYPES
// ============================================

export interface EveningRoutineEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  shutdown_time?: string | null; // HH:mm
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
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// ============================================
// HEALTH TRACKING TYPES
// ============================================

export interface HealthEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD

  // Sleep Tracking
  sleep_start?: string | null; // HH:mm
  sleep_end?: string | null; // HH:mm
  sleep_quality: number; // 1-10
  sleep_notes?: string | null;

  // Hydration
  water_intake: number; // in ml

  // Nutrition
  meals_logged: number; // 0-5 meals
  protein_intake?: number | null; // grams
  calories_intake?: number | null;
  diet_quality: number; // 1-10 rating

  // Physical Activity
  steps_count?: number | null;
  active_minutes: number; // cardio/exercise minutes
  workout_type?: string | null;

  // Vitals & Recovery
  resting_heart_rate?: number | null; // BPM
  heart_rate_variability?: number | null; // ms
  recovery_score: number; // 1-10
  stress_level: number; // 1-10

  // Mental Wellness
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

  created_at: string;
  updated_at: string;
}

// ============================================
// HABITS TYPES
// ============================================

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type HabitCategory =
  | 'Health'
  | 'Fitness'
  | 'Mental Health'
  | 'Learning'
  | 'Productivity'
  | 'Social'
  | 'Finance'
  | 'Spiritual'
  | 'Digital Wellness'
  | 'Custom';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  category: HabitCategory;
  frequency: HabitFrequency;
  target_count: number; // e.g., 7 for daily weekly target
  icon: string; // emoji
  color: string; // hex color
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string | null;
  created_at: string;
}

// Habit with completion data
export interface HabitWithStats extends Habit {
  current_streak: number;
  best_streak: number;
  completion_rate: number; // percentage
  total_completions: number;
  today_completed: boolean;
  this_week_count: number;
  this_month_count: number;
}

// For creating new habits
export type CreateHabit = Omit<Habit, 'id' | 'created_at' | 'updated_at'>;

// For updating habits
export type UpdateHabit = Partial<Omit<Habit, 'id' | 'user_id' | 'created_at'>>;

// Habit analytics data
export interface HabitAnalytics {
  habitId: string;
  habitName: string;
  last30Days: {
    date: string;
    completed: boolean;
  }[];
  last7Days: {
    date: string;
    completed: boolean;
  }[];
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
}

// Weekly habit summary
export interface WeeklyHabitSummary {
  weekStart: string;
  weekEnd: string;
  habits: {
    habitId: string;
    habitName: string;
    completedDays: number;
    targetDays: number;
    percentage: number;
  }[];
  overallCompletionRate: number;
}

// ============================================
// HABIT CATEGORIES CONFIG
// ============================================

export interface HabitCategoryConfig {
  category: HabitCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const HABIT_CATEGORIES: Record<HabitCategory, HabitCategoryConfig> = {
  'Health': {
    category: 'Health',
    label: 'Health',
    icon: '❤️',
    color: '#EF4444',
    description: 'Physical health and wellness'
  },
  'Fitness': {
    category: 'Fitness',
    label: 'Fitness',
    icon: '💪',
    color: '#F97316',
    description: 'Exercise and physical activity'
  },
  'Mental Health': {
    category: 'Mental Health',
    label: 'Mental Health',
    icon: '🧘',
    color: '#8B5CF6',
    description: 'Mindfulness and mental wellness'
  },
  'Learning': {
    category: 'Learning',
    label: 'Learning',
    icon: '📚',
    color: '#3B82F6',
    description: 'Education and skill development'
  },
  'Productivity': {
    category: 'Productivity',
    label: 'Productivity',
    icon: '⚡',
    color: '#EAB308',
    description: 'Work and productivity habits'
  },
  'Social': {
    category: 'Social',
    label: 'Social',
    icon: '👥',
    color: '#EC4899',
    description: 'Relationships and social connections'
  },
  'Finance': {
    category: 'Finance',
    label: 'Finance',
    icon: '💰',
    color: '#10B981',
    description: 'Money management and savings'
  },
  'Spiritual': {
    category: 'Spiritual',
    label: 'Spiritual',
    icon: '🙏',
    color: '#6366F1',
    description: 'Spiritual practice and growth'
  },
  'Digital Wellness': {
    category: 'Digital Wellness',
    label: 'Digital Wellness',
    icon: '📵',
    color: '#14B8A6',
    description: 'Screen time and digital health'
  },
  'Custom': {
    category: 'Custom',
    label: 'Custom',
    icon: '⭐',
    color: '#A855F7',
    description: 'Custom habit category'
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate streak from completion history
export function calculateStreak(
  completions: { date: string; completed: boolean }[]
): { current: number; best: number } {
  if (!completions.length) return { current: 0, best: 0 };

  // Sort by date descending
  const sorted = [...completions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak from today backwards
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date(today);

  for (const completion of sorted) {
    const compDate = new Date(completion.date);
    const checkDateStr = checkDate.toISOString().split('T')[0];

    if (completion.date === checkDateStr && completion.completed) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (completion.date === checkDateStr) {
      break; // Streak broken
    }
  }

  // Calculate best streak
  for (const completion of completions) {
    if (completion.completed) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, best: bestStreak };
}

// Calculate completion rate
export function calculateCompletionRate(
  completions: { date: string; completed: boolean }[]
): number {
  if (!completions.length) return 0;

  const completed = completions.filter(c => c.completed).length;
  return Math.round((completed / completions.length) * 100);
}

// Get habit color by category
export function getHabitCategoryColor(category: HabitCategory): string {
  return HABIT_CATEGORIES[category]?.color || '#94A3B8';
}

// Format habit frequency for display
export function formatHabitFrequency(frequency: HabitFrequency, target: number): string {
  switch (frequency) {
    case 'daily':
      return `${target}x per week`;
    case 'weekly':
      return `${target}x per week`;
    case 'monthly':
      return `${target}x per month`;
    default:
      return frequency;
  }
}

// ============================================
// KEY NOTES TYPES
// ============================================

export type NoteType = 'insight' | 'lesson' | 'breakthrough' | 'idea' | 'quote' | 'reminder';
export type NoteCategory = 'personal' | 'work' | 'health' | 'finance' | 'relationships' | 'learning';

export interface KeyNote {
  id: string;
  user_id: string;

  // Core Content
  title: string;
  content: string;
  type: NoteType;
  category: NoteCategory;

  // Metadata
  tags: string[];
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;

  // Context
  source?: string | null; // Book, person, event, etc.
  linked_date?: string | null; // YYYY-MM-DD (link to routine day)

  // Action Items
  action_required: boolean;
  action_completed: boolean;
  action_deadline?: string | null;

  // Knowledge Management
  linked_notes: string[]; // IDs of related notes
  review_count: number;
  last_reviewed?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// ADD TO: src/types/database.ts
// Trading Section - Type Definitions
// Place this at the END of your database.ts file
// ============================================

// ============================================
// TRADING ENUMS
// ============================================

export type InstrumentType = 'stock' | 'futures' | 'options' | 'forex' | 'commodity' | 'currency';
export type CountryCode = 'US' | 'IN' | 'UK' | 'EU' | 'JP' | 'OTHER';
export type TradeSide = 'long' | 'short';
export type MarketCondition = 'trending' | 'ranging' | 'volatile' | 'quiet';
export type RuleCategory = 'entry' | 'exit' | 'risk_management' | 'psychology' | 'time_management';
export type TradingNoteType = 'pre_market' | 'post_market' | 'idea' | 'general';
export type StrategyStatus = 'active' | 'testing' | 'archived';
export type EmotionalState = 'calm' | 'confident' | 'anxious' | 'fearful' | 'greedy' | 'frustrated' | 'neutral';

// ============================================
// TRADING RULES
// ============================================

export interface TradingRule {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: RuleCategory;
  is_active: boolean;
  violation_count: number;
  adherence_rate: number;
  cost_of_violations: number;
  created_at: string;
  updated_at: string;
}

export type CreateTradingRule = Omit<TradingRule, 'id' | 'violation_count' | 'adherence_rate' | 'cost_of_violations' | 'created_at' | 'updated_at'>;
export type UpdateTradingRule = Partial<Omit<TradingRule, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// STRATEGIES
// ============================================

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  market_type: MarketCondition | null;
  timeframe: string | null;
  entry_criteria: any; // JSON
  exit_criteria: any; // JSON
  risk_management: string | null;
  status: StrategyStatus;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  avg_pnl: number;
  total_pnl: number;
  created_at: string;
  updated_at: string;
}

export type CreateStrategy = Omit<Strategy, 'id' | 'total_trades' | 'winning_trades' | 'losing_trades' | 'win_rate' | 'avg_pnl' | 'total_pnl' | 'created_at' | 'updated_at'>;
export type UpdateStrategy = Partial<Omit<Strategy, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// TRADES
// ============================================

export interface Trade {
  id: string;
  user_id: string;

  // Instrument
  symbol: string;
  instrument_type: InstrumentType;
  // country: CountryCode;

  // Trade Details
  side: TradeSide;
  quantity: number;

  // Entry
  entry_date: string;
  entry_time: string | null;
  entry_price: number;

  // Exit
  exit_date: string | null;
  exit_time: string | null;
  exit_price: number | null;

  // Risk
  stop_loss: number | null;
  take_profit: number | null;
  risk_reward_ratio: number | null;

  // Costs
  commission: number;
  fees: number;

  // P&L (auto-calculated)
  pnl: number | null;
  pnl_percentage: number | null;

  // Strategy & Rules
  strategy_id: string | null;
  setup_name: string | null;
  market_condition: MarketCondition | null;

  // Psychology
  emotional_state: EmotionalState | null;
  confidence_level: number | null;
  discipline_score: number | null;

  // Rule Tracking
  // rules_followed: any; // JSON array
  // rules_broken: any; // JSON array

  // Tags
  mistakes_tags: string[] | null;

  // Notes
  pre_trade_notes: string | null;
  post_trade_notes: string | null;
  lessons_learned: string | null;

  // Media
  screenshots: string[] | null;

  // Status
  is_closed: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Options-specific fields
  rules_followed: string[] | null;  // NEW
  rules_broken: string[] | null;    // NEW
  option_expiry: string | null;     // NEW
  option_strike: number | null;     // NEW
  option_type: 'call' | 'put' | null; // NEW

  
}

export interface TradeWithStrategy extends Trade {
  strategy: Strategy | null;
}

export type CreateTrade = Omit<Trade, 'id' | 'pnl' | 'pnl_percentage' | 'is_closed' | 'created_at' | 'updated_at'>;
export type UpdateTrade = Partial<Omit<Trade, 'id' | 'user_id' | 'created_at'>>;


// ============================================
// STRATEGY SPECIAL VALUES
// ============================================

export const SPECIAL_STRATEGIES = {
  NO_STRATEGY: 'no_strategy',
  OTHER: 'other'
} as const;

// Helper to check if strategy is special
export function isSpecialStrategy(strategyId: string | null): boolean {
  return strategyId === SPECIAL_STRATEGIES.NO_STRATEGY ||
    strategyId === SPECIAL_STRATEGIES.OTHER;
}
// ============================================
// QUICK NOTES
// ============================================

// Add Indian currency formatter
export function formatIndianCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const [intPart, decPart] = absAmount.toFixed(2).split('.');

  let formatted = '';
  let count = 0;

  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      formatted = ',' + formatted;
    }
    formatted = intPart[i] + formatted;
    count++;
  }

  return `${isNegative ? '-' : ''}₹${formatted}.${decPart}`;
}

export function formatIndianPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export interface QuickNote {
  id: string;
  user_id: string;
  date: string;
  note_type: TradingNoteType;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export type CreateQuickNote = Omit<QuickNote, 'id' | 'created_at' | 'updated_at'>;
export type UpdateQuickNote = Partial<Omit<QuickNote, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// BACKTEST RESULTS
// ============================================

export interface BacktestResult {
  id: string;
  user_id: string;
  strategy_id: string | null;
  strategy_name: string;
  date_range_start: string;
  date_range_end: string;
  initial_capital: number;
  final_capital: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  max_drawdown: number;
  profit_factor: number;
  expectancy: number;
  sharpe_ratio: number | null;
  trades_data: any; // JSON
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateBacktestResult = Omit<BacktestResult, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBacktestResult = Partial<Omit<BacktestResult, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// TRADING SESSIONS
// ============================================

export interface TradingSession {
  id: string;
  user_id: string;
  trade_id: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  activity_type: string | null;
  created_at: string;
}

export type CreateTradingSession = Omit<TradingSession, 'id' | 'created_at'>;

// ============================================
// PERFORMANCE SNAPSHOTS
// ============================================

export interface PerformanceSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  avg_win: number;
  avg_loss: number;
  expectancy: number;
  profit_factor: number;
  max_drawdown: number;
  sharpe_ratio: number | null;
  rules_adherence_rate: number;
  created_at: string;
}

// ============================================
// TRADING STATISTICS (Calculated)
// ============================================

export interface TradingStats {
  total_trades: number;
  closed_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  avg_win: number;
  avg_loss: number;
  expectancy: number;
  profit_factor: number;
  max_drawdown: number;
  sharpe_ratio: number | null;
  best_trade: number;
  worst_trade: number;
  avg_trade_duration: number; // in days
  total_commission: number;
  net_pnl: number;
}

// ============================================
// DASHBOARD DATA
// ============================================

export interface TradingDashboard {
  stats: TradingStats;
  recent_trades: TradeWithStrategy[];
  active_strategies: Strategy[];
  rule_adherence: {
    followed: number;
    broken: number;
    rate: number;
  };
  equity_curve: {
    date: string;
    balance: number;
  }[];
  days_active: number;
}

// ============================================
// HELPER FUNCTIONS FOR CALCULATIONS
// ============================================

/**
 * Calculate P&L for a trade
 */
export function calculatePnL(
  side: TradeSide,
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  commission: number = 0,
  fees: number = 0
): { pnl: number; pnl_percentage: number } {
  let pnl = 0;

  if (side === 'long') {
    pnl = (exitPrice - entryPrice) * quantity - commission - fees;
  } else {
    pnl = (entryPrice - exitPrice) * quantity - commission - fees;
  }

  const pnl_percentage = (pnl / (entryPrice * quantity)) * 100;

  return {
    pnl: Math.round(pnl * 100) / 100,
    pnl_percentage: Math.round(pnl_percentage * 100) / 100
  };
}

/**
 * Calculate win rate
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100 * 100) / 100; // 2 decimal places
}

/**
 * Calculate expectancy (average expected profit per trade)
 */
export function calculateExpectancy(
  avgWin: number,
  avgLoss: number,
  winRate: number
): number {
  const lossRate = 100 - winRate;
  return (avgWin * (winRate / 100)) + (avgLoss * (lossRate / 100));
}

/**
 * Calculate profit factor (gross profit / gross loss)
 */
export function calculateProfitFactor(
  totalWins: number,
  totalLosses: number
): number {
  if (totalLosses === 0) return totalWins > 0 ? Infinity : 0;
  return Math.abs(totalWins / totalLosses);
}

/**
 * Calculate Risk/Reward Ratio
 */
export function calculateRiskRewardRatio(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  side: TradeSide
): number {
  let risk = 0;
  let reward = 0;

  if (side === 'long') {
    risk = Math.abs(entryPrice - stopLoss);
    reward = Math.abs(takeProfit - entryPrice);
  } else {
    risk = Math.abs(stopLoss - entryPrice);
    reward = Math.abs(entryPrice - takeProfit);
  }

  if (risk === 0) return 0;
  return Math.round((reward / risk) * 100) / 100;
}

/**
 * Format currency based on locale
 */
export function formatCurrency(
  amount: number,
  currency: 'USD' | 'INR' | 'EUR' = 'USD'
): string {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  };

  return formatters[currency].format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Get color for P&L display
 */
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return 'text-green-500';
  if (pnl < 0) return 'text-red-500';
  return 'text-gray-500';
}

/**
 * Get icon for instrument type
 */
// export function getInstrumentIcon(type: InstrumentType): string {
//   const icons = {
//     stock: '📈',
//     futures: '⏳',
//     options: '📊',
//     forex: '💱',
//     commodity: '🏭',
//     currency: '💰',
//   };
//   return icons[type] || '📊';
// }

const INSTRUMENT_CONFIG = {
  stock: { label: 'Stock', icon: '📈', color: 'blue' },
  futures: { label: 'Futures', icon: '⏳', color: 'purple' },
  options: { label: 'Options', icon: '📊', color: 'orange' },
  forex: { label: 'Forex', icon: '💱', color: 'green' },
  commodity: { label: 'Commodity', icon: '🥇', color: 'yellow' },
  currency: { label: 'Currency', icon: '💰', color: 'teal' },
} as const;

export function getInstrumentConfig(type: InstrumentType) {
  return INSTRUMENT_CONFIG[type];
}

export function getInstrumentIcon(type: InstrumentType): string {
  return INSTRUMENT_CONFIG[type].icon;
}

/**
 * Get flag emoji for country
 */
export function getCountryFlag(country: CountryCode): string {
  const flags = {
    US: '🇺🇸',
    IN: '🇮🇳',
    UK: '🇬🇧',
    EU: '🇪🇺',
    JP: '🇯🇵',
    OTHER: '🌍',
  };
  return flags[country] || '🌍';
}

/**
 * Get color for rule category
 */
export function getRuleCategoryColor(category: RuleCategory): string {
  const colors = {
    entry: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    exit: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    risk_management: 'bg-red-500/20 text-red-500 border-red-500/30',
    psychology: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    time_management: 'bg-green-500/20 text-green-500 border-green-500/30',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-500 border-gray-500/30';
}

/**
 * Get label for rule category
 */
export function getRuleCategoryLabel(category: RuleCategory): string {
  const labels = {
    entry: 'Entry Rules',
    exit: 'Exit Rules',
    risk_management: 'Risk Management',
    psychology: 'Psychology',
    time_management: 'Time Management',
  };
  return labels[category] || category;
}

/**
 * Get icon for emotional state
 */
export function getEmotionalIcon(state: EmotionalState): string {
  const icons = {
    calm: '😌',
    confident: '😎',
    anxious: '😰',
    fearful: '😨',
    greedy: '🤑',
    frustrated: '😤',
    neutral: '😐',
  };
  return icons[state] || '😐';
}

/**
 * Calculate trade duration in days
 */
export function calculateTradeDuration(entryDate: string, exitDate: string | null): number {
  if (!exitDate) return 0;
  const entry = new Date(entryDate);
  const exit = new Date(exitDate);
  const diffTime = Math.abs(exit.getTime() - entry.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================
// RESPONSE TYPES (for helper functions)
// ============================================

export interface TradingResponse<T> {
  data: T | null;
  error: Error | null;
}

// ============================================
// END OF TRADING TYPES
// ============================================