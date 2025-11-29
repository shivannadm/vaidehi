// src/app/dashboard/todo/tasks/page.tsx
// COMPLETE OPTIMIZED VERSION with Custom Dropdown
"use client";

import { useState, useEffect, useRef } from "react";
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
import { Play, Pause, Square, ChevronDown } from "lucide-react";
import AddTaskModal from "./components/AddTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import TagManager from "./components/TagManager";
import TaskItem from "./components/TaskItem";
import Timeline from "./components/Timeline";
import { useTimer } from "../../components/TimerContext";

// ============================================
// CUSTOM DROPDOWN COMPONENT
// Shows only ~7 items with smooth scrolling
// ============================================
function FocusGoalDropdown({ 
  value, 
  onChange, 
  disabled, 
  isDark 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  disabled: boolean; 
  isDark: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i + 1);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`px-3 py-1 rounded-lg font-bold border-2 text-center flex items-center gap-1 min-w-[60px] justify-between transition ${
          isDark
            ? "bg-slate-700 border-lime-500 text-lime-400 hover:bg-slate-600"
            : "bg-lime-50 border-lime-400 text-lime-700 hover:bg-lime-100"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>{value}h</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1 rounded-lg border-2 shadow-xl z-50 overflow-y-auto ${
            isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"
          }`}
          style={{ maxHeight: "280px", width: "80px" }}
        >
          <div className="py-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  onChange(h);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm font-medium transition ${
                  h === value
                    ? isDark
                      ? "bg-lime-600 text-white"
                      : "bg-lime-500 text-white"
                    : isDark
                      ? "hover:bg-slate-700 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [incompleteTasks, setIncompleteTasks] = useState<TaskWithTag[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskWithTag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sessions, setSessions] = useState<TaskSessionWithTask[]>([]);
  const [stats, setStats] = useState<DailyReportStats | null>(null);
  const [dayNote, setDayNote] = useState<string>("");
  const [goalHours, setGoalHours] = useState<number>(7);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithTag | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = useTimer();

  // Mount + auth + theme
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

    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Refresh when timer stops
  useEffect(() => {
    if (userId && mounted && !timer.isRunning && timer.taskId === null) {
      loadAllData(userId, formatDateToString(selectedDate));
    }
  }, [timer.isRunning, timer.taskId]);

  // Refresh on date change
  useEffect(() => {
    if (userId && mounted) {
      loadAllData(userId, formatDateToString(selectedDate));
    }
  }, [selectedDate, userId, mounted]);

  // Auto-save day note
  useEffect(() => {
    if (!userId || !mounted || !dayNote.trim()) return;

    const timeout = setTimeout(async () => {
      setSavingNote(true);
      try {
        const { error } = await upsertDayNote({
          user_id: userId,
          note_text: dayNote.trim(),
          date: formatDateToString(selectedDate),
        });
        if (error) console.error("Error saving day note:", error);
      } catch (err) {
        console.error("Error saving note:", err);
      } finally {
        setSavingNote(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [dayNote, userId, selectedDate, mounted]);

  // Listen to global project events
  useEffect(() => {
    if (!userId || !mounted) return;

    const refresh = () => loadAllData(userId, formatDateToString(selectedDate));

    window.addEventListener("projectTaskCreated", refresh);
    window.addEventListener("projectTaskUpdated", refresh);
    window.addEventListener("projectTaskDeleted", refresh);
    window.addEventListener("projectTimerStarted", refresh);
    window.addEventListener("projectTimerStopped", refresh);

    return () => {
      window.removeEventListener("projectTaskCreated", refresh);
      window.removeEventListener("projectTaskUpdated", refresh);
      window.removeEventListener("projectTaskDeleted", refresh);
      window.removeEventListener("projectTimerStarted", refresh);
      window.removeEventListener("projectTimerStopped", refresh);
    };
  }, [userId, mounted, selectedDate]);

  const loadAllData = async (uid: string, date: string) => {
    try {
      const [
        tasksRes,
        tagsRes,
        sessionsRes,
        statsRes,
        noteRes,
        goalRes,
      ] = await Promise.all([
        getTasksByDate(uid, date),
        getTags(uid),
        getSessionsByDate(uid, date),
        getDailyReportStats(uid, date),
        getDayNote(uid, date),
        getDailyGoal(uid, date),
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

  // Date helpers
  const handlePrevDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const handleNextDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  const handleToday = () => setSelectedDate(new Date());
  const handleDateSelect = (date: Date) => setSelectedDate(new Date(date));

  const handleEditTask = (task: TaskWithTag) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handlePlayTask = (taskId: string, taskTitle: string) => {
    if (userId) startTimer(taskId, taskTitle, userId, selectedDate);
  };

  const handleStopTimer = async () => {
    const success = await stopTimer();
    if (success && userId) loadAllData(userId, formatDateToString(selectedDate));
  };

  const handleGoalChange = async (hours: number) => {
    if (!userId) return;
    setGoalHours(hours);
    await upsertDailyGoal({ user_id: userId, goal_hours: hours, date: formatDateToString(selectedDate) });
    const { data } = await getDailyReportStats(userId, formatDateToString(selectedDate));
    if (data) setStats(data);
  };

  // Date comparison
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const compareDate = new Date(selectedDate); compareDate.setHours(0, 0, 0, 0);
  const isToday = compareDate.getTime() === today.getTime();
  const isPast = compareDate.getTime() < today.getTime();
  const isFuture = compareDate.getTime() > today.getTime();

  const weekDates = (() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  })();

  const goalCardColors = getGoalCardColor(stats?.goalPercentage || 0);

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <p className={`mt-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header - Date roller + Timer */}
      <div className={`rounded-xl border p-5 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button onClick={handlePrevDay} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="flex items-center gap-2">
            {weekDates.map((date, i) => {
              const selected = formatDateToString(date) === formatDateToString(selectedDate);
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(date)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition ${
                    selected ? "bg-cyan-500 text-white" : isDark ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <button onClick={handleNextDay} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {!isToday && (
            <button onClick={handleToday} className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
              Today
            </button>
          )}

          {/* Timer */}
          <div className="flex items-center gap-3 ml-auto">
            {timer.taskId && (
              <div className={`text-sm font-medium px-4 py-2 rounded-lg truncate max-w-xs ${isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                {timer.taskTitle}
              </div>
            )}
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-slate-700/50" : "bg-slate-200/50"}`}>
              <button
                onClick={() => timer.isRunning ? pauseTimer() : resumeTimer()}
                disabled={!timer.taskId}
                className={`p-2 rounded-lg transition ${timer.isRunning ? "bg-blue-600 hover:bg-blue-700 text-white" : isDark ? "bg-slate-600 hover:bg-slate-500 text-slate-200" : "bg-slate-300 hover:bg-slate-400 text-slate-700"} disabled:opacity-50`}
                title={timer.isRunning ? "Pause" : "Resume"}
              >
                {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={handleStopTimer} disabled={!timer.taskId} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50" title="Stop">
                <Square className="w-4 h-4" />
              </button>
              <div className={`text-2xl font-mono font-bold tabular-nums min-w-[90px] text-center ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatTime(timer.elapsedSeconds)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-5 lg:px-0 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-screen-1xl mx-auto">

          {/* LEFT - Tasks */}
          <div className="lg:col-span-5 space-y-5">
            {/* Incomplete */}
            <div className={`rounded-xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Task to complete</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  disabled={isPast}
                  className={`w-full text-left px-3 py-3 rounded-lg border border-dashed text-sm transition disabled:opacity-50 ${isDark ? "border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30" : "border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600 hover:bg-slate-50"}`}
                >
                  + Add task
                </button>

                {incompleteTasks.length === 0 ? (
                  <p className={`text-center py-8 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>No tasks yet. Add one to get started!</p>
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
                      isFuture={isFuture}
                      isRunning={timer.taskId === task.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Completed */}
            <div className={`rounded-xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Completed tasks</h2>
              {completedTasks.length === 0 ? (
                <p className={`text-center py-8 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>No completed tasks yet</p>
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
                      isFuture={isFuture}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER - Timeline */}
          <div className="lg:col-span-4">
            <div className={`rounded-xl border p-5 h-230 min-h-96 flex flex-col ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Today's Task time Record</h2>
              <div className="flex-1 min-h-0">
                <Timeline sessions={sessions} currentTime={currentTime} isDark={isDark} activeTaskId={timer.taskId} />
              </div>
            </div>
          </div>

          {/* RIGHT - Tags, Report, Note */}
          <div className="lg:col-span-3 space-y-5">
            {/* Tags */}
            <div className={`rounded-xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Tags</h2>
              <TagManager userId={userId || ""} tags={tags} onTagsChanged={() => userId && loadAllData(userId, formatDateToString(selectedDate))} isDark={isDark} />
            </div>

            {/* Report */}
            <div className={`rounded-xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Task Report</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Task Completed:</span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${isDark ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"}`}>
                    {stats?.completedCount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Task in progress:</span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${isDark ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"}`}>
                    {stats?.inProgressCount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Total focused time:</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {formatDuration(stats?.totalFocusedTime || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Day focus goal:</span>
                  <FocusGoalDropdown value={goalHours} onChange={handleGoalChange} disabled={isPast} isDark={isDark} />
                </div>

                <div className={`mt-4 p-4 rounded-xl border-2 ${goalCardColors.bg} ${goalCardColors.border}`}>
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-1 ${goalCardColors.text}`}>Goal achieved</div>
                    <div className={`text-3xl font-bold ${goalCardColors.text}`}>
                      {stats?.goalPercentage || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Note */}
            <div className={`rounded-xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Day Note</h2>
                {savingNote && <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Saving...</span>}
              </div>
              <textarea
                value={dayNote}
                onChange={e => setDayNote(e.target.value)}
                placeholder="Add your day key insights here..."
                rows={5}
                disabled={isPast}
                className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} ${isPast ? "opacity-60 cursor-not-allowed" : ""}`}
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
        onTaskCreated={() => userId && loadAllData(userId, formatDateToString(selectedDate))}
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
        onTaskUpdated={() => userId && loadAllData(userId, formatDateToString(selectedDate))}
        isDark={isDark}
      />
    </div>
  );
}