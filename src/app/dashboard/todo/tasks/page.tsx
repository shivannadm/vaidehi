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
  getDailyGoal,
  upsertDayNote,
  upsertDailyGoal
} from "@/lib/supabase/task-helpers";
import { 
  formatDateToString, 
  formatDuration, 
  getGoalCardColor,
  type TaskWithTag,
  type Tag,
  type TaskSessionWithTask,
  type DailyReportStats
} from "@/types/database";
import { Play, Pause, Square } from "lucide-react";
import AddTaskModal from "./components/AddTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import TagManager from "./components/TagManager";
import TaskItem from "./components/TaskItem";
import Timeline from "./components/Timeline";
import { useTaskTimer } from "./hooks/useTaskTimer";

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data states
  const [incompleteTasks, setIncompleteTasks] = useState<TaskWithTag[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskWithTag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sessions, setSessions] = useState<TaskSessionWithTask[]>([]);
  const [stats, setStats] = useState<DailyReportStats | null>(null);
  const [dayNote, setDayNote] = useState<string>("");
  const [goalHours, setGoalHours] = useState<number>(7);

  // Modal states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithTag | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  // Timer hook
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = useTaskTimer(
    userId,
    selectedDate
  );

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

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Load data when date changes
  useEffect(() => {
    if (userId) {
      loadAllData(userId, formatDateToString(selectedDate));
    }
  }, [selectedDate, userId]);

  // Auto-save day note (debounced)
  useEffect(() => {
    if (!userId || !mounted) return;

    const timeout = setTimeout(async () => {
      setSavingNote(true);
      try {
        await upsertDayNote({
          user_id: userId,
          note_text: dayNote,
          date: formatDateToString(selectedDate)
        });
      } catch (err) {
        console.error("Error saving note:", err);
      } finally {
        setSavingNote(false);
      }
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timeout);
  }, [dayNote, userId, selectedDate, mounted]);

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

  const handleEditTask = (task: TaskWithTag) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handlePlayTask = (taskId: string, taskTitle: string) => {
    startTimer(taskId, taskTitle);
  };

  const handleStopTimer = async () => {
    const success = await stopTimer();
    if (success && userId) {
      // Reload data to show updated times
      await loadAllData(userId, formatDateToString(selectedDate));
    }
  };

  const handleGoalChange = async (hours: number) => {
    if (!userId) return;
    
    setGoalHours(hours);
    try {
      await upsertDailyGoal({
        user_id: userId,
        goal_hours: hours,
        date: formatDateToString(selectedDate)
      });
      // Reload stats
      const { data } = await getDailyReportStats(userId, formatDateToString(selectedDate));
      if (data) setStats(data);
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  const isToday = formatDateToString(selectedDate) === formatDateToString(new Date());
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const goalCardColors = getGoalCardColor(stats?.goalPercentage || 0);

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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Date Roller with Timer */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition ${
                    isSelected
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
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
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

          <button className={`p-2 rounded-lg transition ml-2 ${
            isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Timer Display */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex gap-2">
              <button 
                className={`p-2 rounded-lg transition ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                }`}
                onClick={() => timer.isRunning ? pauseTimer() : resumeTimer()}
                disabled={!timer.taskId}
                title={timer.isRunning ? "Pause" : "Resume"}
              >
                {timer.isRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button 
                className={`p-2 rounded-lg transition ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                }`}
                onClick={handleStopTimer}
                disabled={!timer.taskId}
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-3xl font-mono font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatTime(timer.elapsedSeconds)}
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
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Task to complete
              </h2>

              <div className="space-y-2">
                {/* Add Task Button */}
                <button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  disabled={isPast}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 border-dashed transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
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
                    <TaskItem
                      key={task.id}
                      task={task}
                      onTaskUpdated={() => userId && loadAllData(userId, formatDateToString(selectedDate))}
                      onEditClick={handleEditTask}
                      onPlayClick={handlePlayTask}
                      isDark={isDark}
                      isPast={isPast}
                      isRunning={timer.taskId === task.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
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
                    <TaskItem
                      key={task.id}
                      task={task}
                      onTaskUpdated={() => userId && loadAllData(userId, formatDateToString(selectedDate))}
                      onEditClick={handleEditTask}
                      onPlayClick={handlePlayTask}
                      isDark={isDark}
                      isCompleted
                      isPast={isPast}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER COLUMN - Timeline */}
          <div>
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Today's Task time Record
              </h2>
              
              <Timeline 
                sessions={sessions}
                currentTime={currentTime}
                isDark={isDark}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Extras */}
          <div className="space-y-6">
            {/* Tags */}
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tags
              </h2>
              <TagManager
                userId={userId || ""}
                tags={tags}
                onTagsChanged={() => {
                  if (userId) {
                    loadAllData(userId, formatDateToString(selectedDate));
                  }
                }}
                isDark={isDark}
              />
            </div>

            {/* Task Report */}
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Task Report
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Task Completed:
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${
                    isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
                  }`}>
                    {stats?.completedCount || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Task in progress:
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${
                    isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
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
                  <select
                    value={goalHours}
                    onChange={(e) => handleGoalChange(parseInt(e.target.value))}
                    disabled={isPast}
                    className={`px-3 py-1 rounded-lg font-bold border-2 text-center ${
                      isDark 
                        ? 'bg-slate-700 border-lime-500 text-lime-400' 
                        : 'bg-lime-50 border-lime-400 text-lime-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
                      <option key={h} value={h}>{h}h</option>
                    ))}
                  </select>
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
            <div className={`rounded-xl border p-5 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Day Note
                </h2>
                {savingNote && (
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Saving...
                  </span>
                )}
              </div>
              <textarea
                value={dayNote}
                onChange={(e) => setDayNote(e.target.value)}
                placeholder="Add your day key insights here...."
                rows={5}
                disabled={isPast}
                className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } ${isPast ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        tags={tags}
        onTaskUpdated={() => {
          if (userId) {
            loadAllData(userId, formatDateToString(selectedDate));
          }
        }}
        isDark={isDark}
      />
    </div>
  );
}