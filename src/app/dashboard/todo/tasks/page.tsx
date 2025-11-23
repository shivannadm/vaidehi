// src/app/dashboard/todo/tasks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getTasksByDate,
  getTags,
  getSessionsByDate,
  getDailyReportStats,
  getDayNote,
  getDailyGoal
} from "@/lib/supabase/task-helpers";
import {
  formatDateToString,
  formatDuration,
  daysSinceCreation,
  calculateGoalPercentage,
  getGoalCardColor,
  TAG_COLORS,
  type TaskWithTag,
  type Tag,
  type TaskSessionWithTask,
  type DailyReportStats,
  type DayNote,
  type DailyGoal
} from "@/types/database";
import { Play, Pause, Square, Star, Edit2, Trash2, Plus } from "lucide-react";
import AddTaskModal from "./components/AddTaskModal";

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);

  // Data states
  const [incompleteTasks, setIncompleteTasks] = useState<TaskWithTag[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskWithTag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sessions, setSessions] = useState<TaskSessionWithTask[]>([]);
  const [stats, setStats] = useState<DailyReportStats | null>(null);
  const [dayNote, setDayNote] = useState<string>("");
  const [goalHours, setGoalHours] = useState<number>(7);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Modal states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Initialize
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadAllData(user.id, formatDateToString(selectedDate));
      }
      setLoading(false);
    };
    init();

    // Check theme
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Load data when date changes
  useEffect(() => {
    if (userId) {
      loadAllData(userId, formatDateToString(selectedDate));
    }
  }, [selectedDate, userId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadAllData = async (uid: string, date: string) => {
    try {
      const [tasksRes, tagsRes, sessionsRes, statsRes, noteRes, goalRes] = await Promise.all([
        getTasksByDate(uid, date),
        getTags(uid),
        getSessionsByDate(uid, date),
        getDailyReportStats(uid, date),
        getDayNote(uid, date),
        getDailyGoal(uid, date)
      ]);

      if (tasksRes.data) {
        setIncompleteTasks(tasksRes.data.incompleteTasks);
        setCompletedTasks(tasksRes.data.completedTasks);
      }
      if (tagsRes.data) setTags(tagsRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (noteRes.data) setDayNote(noteRes.data.note_text || "");
      if (goalRes.data) setGoalHours(goalRes.data.goal_hours);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = formatDateToString(selectedDate) === formatDateToString(new Date());
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  // Generate week dates for date roller
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3); // 3 days before

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  const goalCardColors = getGoalCardColor(stats?.goalPercentage || 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Date Roller with Timer */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Week dates display */}
          <div className="flex items-center gap-2">
            {weekDates.map((date, idx) => {
              const isSelected = formatDateToString(date) === formatDateToString(selectedDate);
              const dateNum = date.getDate();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition ${isSelected
                      ? 'bg-cyan-500 text-white'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {dateNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextDay}
            className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {!isToday && (
            <button
              onClick={handleToday}
              className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Today
            </button>
          )}

          <button className={`p-2 rounded-lg transition ml-2 ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Timer Display - Moved Here */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                disabled={!activeTaskId}
              >
                {isTimerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                  setActiveTaskId(null);
                }}
                disabled={!activeTaskId}
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-3xl font-mono font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN - Tasks */}
          <div className="space-y-6">
            {/* Task to Complete */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Task to complete
                </h2>
                <div className="flex items-center gap-2">
                  <button className="text-yellow-500 hover:text-yellow-400">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className={`${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'}`}>
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className={`${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'}`}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                    2d
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Add Task Button */}
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 border-dashed transition text-sm ${isDark
                      ? 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                      : 'border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600 hover:bg-slate-50'
                    }`}>
                  + Add task
                </button>

                {/* Task Items */}
                {incompleteTasks.length === 0 ? (
                  <p className={`text-center py-8 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    No tasks yet. Add one to get started!
                  </p>
                ) : (
                  incompleteTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border group ${isDark
                          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <button
                        className={`p-1.5 rounded transition opacity-0 group-hover:opacity-100 ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'
                          }`}
                        onClick={() => {
                          setActiveTaskId(task.id);
                          setIsTimerRunning(true);
                        }}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {task.title}
                        </div>
                      </div>
                      {task.tag && (
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: isDark ? TAG_COLORS[task.tag.color].darkBg : TAG_COLORS[task.tag.color].lightBg,
                            color: isDark ? TAG_COLORS[task.tag.color].darkText : TAG_COLORS[task.tag.color].lightText
                          }}
                        >
                          #{task.tag.name}
                        </span>
                      )}
                      {task.is_important && (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      )}
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {daysSinceCreation(task.created_at)}d
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Completed tasks
              </h2>

              {completedTasks.length === 0 ? (
                <p className={`text-center py-8 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No completed tasks yet
                </p>
              ) : (
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${isDark
                          ? 'bg-slate-700/50 border-slate-600'
                          : 'bg-slate-50 border-slate-200'
                        }`}
                    >
                      <input type="checkbox" checked className="w-4 h-4 rounded" readOnly />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium line-through truncate ${isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          {task.title}
                        </div>
                      </div>
                      {task.tag && (
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: isDark ? TAG_COLORS[task.tag.color].darkBg : TAG_COLORS[task.tag.color].lightBg,
                            color: isDark ? TAG_COLORS[task.tag.color].darkText : TAG_COLORS[task.tag.color].lightText
                          }}
                        >
                          #{task.tag.name}
                        </span>
                      )}
                      {task.is_important && (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      )}
                      <button className={isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatDuration(task.total_time_spent)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER COLUMN - Timeline */}
          <div>
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Today's Task time Record
              </h2>

              {sessions.length === 0 ? (
                <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p className="text-sm">No time records yet</p>
                  <p className="text-xs mt-2">Start a task timer to see it here</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Timeline blocks will go here */}
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Timeline visualization coming next...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Extras */}
          <div className="space-y-6">
            {/* Tags */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                <button className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}>
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>

                {tags.map(tag => (
                  <div
                    key={tag.id}
                    className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                    style={{
                      backgroundColor: isDark ? TAG_COLORS[tag.color].darkBg : TAG_COLORS[tag.color].lightBg,
                      color: isDark ? TAG_COLORS[tag.color].darkText : TAG_COLORS[tag.color].lightText
                    }}
                  >
                    #{tag.name}
                    <button className="hover:opacity-70">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Report */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Task Report
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Task Completed:
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
                    }`}>
                    {stats?.completedCount || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Task in progress:
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
                    }`}>
                    {stats?.inProgressCount || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Total focused time:
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatDuration(stats?.totalFocusedTime || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Day focus goal:
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold border-2 ${isDark
                      ? 'bg-slate-700 border-lime-500 text-lime-400'
                      : 'bg-lime-50 border-lime-400 text-lime-700'
                    }`}>
                    {goalHours}h
                  </span>
                </div>

                {/* Goal Card */}
                <div className={`mt-4 p-4 rounded-xl border-2 ${goalCardColors.bg} ${goalCardColors.border}`}>
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-1 ${goalCardColors.text}`}>Goal</div>
                    <div className={`text-3xl font-bold ${goalCardColors.text}`}>
                      {stats?.goalPercentage || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Note */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Day Note
              </h2>
              <textarea
                value={dayNote}
                onChange={(e) => setDayNote(e.target.value)}
                placeholder="Add your day key insights here...."
                rows={5}
                disabled={isPast}
                className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  } ${isPast ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        userId={userId || ""}
        selectedDate={formatDateToString(selectedDate)}
        tags={tags}
        onTaskCreated={() => {
          if (userId) {
            loadAllData(userId, formatDateToString(selectedDate));
          }
        }}
        isDark={isDark}
      />
    </div>
  );
}