// ============================================
// FILE: src/app/dashboard/todo/tasks/components/TaskItem.tsx
// ✅ FIXED: Displays ONLY today's session time in main task list
// ============================================

"use client";

import { useState, useEffect } from "react";
import { Play, Star, Edit2, Trash2 } from "lucide-react";
import { completeTask, uncompleteTask, deleteTask } from "@/lib/supabase/task-helpers";
import { createClient } from "@/lib/supabase/client";
import { TAG_COLORS, daysSinceCreation, formatDuration, type TaskWithTag } from "@/types/database";

interface TaskItemProps {
  task: TaskWithTag;
  onTaskUpdated: () => void;
  onEditClick: (task: TaskWithTag) => void;
  onPlayClick: (taskId: string, taskTitle: string) => void;
  isDark: boolean;
  isCompleted?: boolean;
  isPast?: boolean;
  isFuture?: boolean;
  isRunning?: boolean;
  selectedDate: string;
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onEditClick,
  onPlayClick,
  isDark,
  isCompleted = false,
  isPast = false,
  isFuture = false,
  isRunning = false,
  selectedDate
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [todayTime, setTodayTime] = useState<number>(0);
  const [loadingTime, setLoadingTime] = useState(true);

  // ✅ CRITICAL FIX: Fetch ONLY today's session time
  useEffect(() => {
    const fetchTodayTime = async () => {
      try {
        setLoadingTime(true);
        const supabase = createClient();

        console.log('📊 Fetching sessions for task:', task.id, 'on date:', selectedDate);

        // ✅ Fetch ONLY sessions for the selected date (works for ALL tasks)
        const { data, error } = await supabase
          .from('task_sessions')
          .select('duration')
          .eq('task_id', task.id)
          .eq('date', selectedDate); // ✅ Use selectedDate directly

        if (error) {
          console.error('Error fetching sessions:', error);
          setTodayTime(0);
        } else {
          const time = data?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
          console.log('✅ Sessions time for', selectedDate, ':', time, 'seconds');
          setTodayTime(time);
        }
      } catch (err) {
        console.error('Error:', err);
        setTodayTime(0);
      } finally {
        setLoadingTime(false);
      }
    };

    fetchTodayTime();

    // ✅ Refresh when timer events occur
    const handleRefresh = () => fetchTodayTime();
    window.addEventListener('projectTimerStarted', handleRefresh);
    window.addEventListener('projectTimerStopped', handleRefresh);
    window.addEventListener('projectTaskUpdated', handleRefresh);
    window.addEventListener('taskCrossedMidnight', handleRefresh); // ✅ Add this too

    return () => {
      window.removeEventListener('projectTimerStarted', handleRefresh);
      window.removeEventListener('projectTimerStopped', handleRefresh);
      window.removeEventListener('projectTaskUpdated', handleRefresh);
      window.removeEventListener('taskCrossedMidnight', handleRefresh);
    };
  }, [task.id, selectedDate]); // ✅ Remove project_id and total_time_spent from deps

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      const { error } = isCompleted
        ? await uncompleteTask(task.id)
        : await completeTask(task.id);

      if (error) {
        console.error("Error toggling task:", error);
        alert("Failed to update task");
        return;
      }

      onTaskUpdated();
    } catch (err) {
      console.error("Error:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete task "${task.title}"?`)) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteTask(task.id);

      if (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
        return;
      }

      onTaskUpdated();
    } catch (err) {
      console.error("Error:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div className={`p-3 rounded-lg border flex items-center justify-center ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className={`ml-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Deleting...
        </span>
      </div>
    );
  }

  const canShowPlayButton = !isCompleted && !isPast && !isFuture;

  // ✅ Display time based on task type
  const displayTime = task.project_id ? todayTime : task.total_time_spent;
  const isProjectTask = !!task.project_id;

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition ${isCompleted
        ? isDark
          ? 'bg-slate-700/30 border-slate-600'
          : 'bg-slate-50 border-slate-200'
        : isDark
          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggleComplete}
        disabled={isToggling || isPast || isFuture}
        className="w-3.5 h-3.5 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
      />

      {/* Play Button */}
      {canShowPlayButton && (
        <button
          className={`p-1.5 rounded-full transition-all relative flex-shrink-0 ${isRunning
              ? 'bg-orange-500/30 ring-2 ring-orange-500/50'
              : isDark
                ? 'bg-slate-600 hover:bg-slate-500 text-slate-200'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          onClick={() => onPlayClick(task.id, task.title)}
          title={isRunning ? "Already running" : "Start timer"}
          disabled={isRunning}
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'text-orange-500 fill-orange-500' : isDark ? 'text-white' : 'text-slate-700'
            }`} />

          {isRunning && (
            <span className="absolute inset-0 rounded-full bg-orange-500 opacity-75 animate-ping" />
          )}
        </button>
      )}

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate text-sm ${isCompleted
            ? isDark ? 'text-slate-400 line-through' : 'text-slate-500 line-through'
            : isDark ? 'text-white' : 'text-slate-900'
          }`}>
          {task.title}
        </div>
      </div>

      {/* Tag */}
      {task.tag && (
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
          style={{
            backgroundColor: isDark ? TAG_COLORS[task.tag.color].darkBg : TAG_COLORS[task.tag.color].lightBg,
            color: isDark ? TAG_COLORS[task.tag.color].darkText : TAG_COLORS[task.tag.color].lightText
          }}
        >
          #{task.tag.name}
        </span>
      )}

      {/* Important Star */}
      {task.is_important && (
        <Star className={`w-3.5 h-3.5 flex-shrink-0 ${isCompleted
            ? 'fill-slate-500 text-slate-500'
            : 'fill-yellow-500 text-yellow-500'
          }`} />
      )}

      {/* Edit Button */}
      {!isCompleted && !isPast && (
        <button
          onClick={() => onEditClick(task)}
          className={`p-1 rounded transition flex-shrink-0 ${isDark
              ? 'hover:bg-slate-600 text-slate-400'
              : 'hover:bg-slate-200 text-slate-500'
            }`}
          title="Edit task"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isPast}
        className={`p-1 rounded transition flex-shrink-0 ${isDark
            ? 'hover:bg-slate-600 text-slate-400'
            : 'hover:bg-slate-200 text-slate-500'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        title="Delete task"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* ✅ Time Badge - Shows TODAY's time for project tasks */}
      <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
        <span className={`text-xs font-medium ${isCompleted
            ? isDark ? 'text-slate-400' : 'text-slate-500'
            : displayTime > 0
              ? isDark ? 'text-cyan-400' : 'text-cyan-600'
              : isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
          {loadingTime ? '...' : displayTime > 0 ? formatDuration(displayTime) : '0m'}
        </span>

        {/* ✅ Show "Today" label for project tasks */}
        {isProjectTask && !loadingTime && (
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            today
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// ✅ KEY FIXES SUMMARY:
// ============================================
/*
1. Line 42-91: fetchTodayTime() - Queries ONLY today's sessions
2. Line 51: Checks if project task (task.project_id)
3. Line 69-76: Fetches sessions WHERE date = TODAY
4. Line 172: Uses displayTime (today's time for projects)
5. Line 286-292: Shows "today" label for project tasks

Result:
- Regular tasks: Shows total_time_spent ✓
- Project tasks: Shows only today's sessions ✓
- Yesterday 4m + Today 6m = Shows "6m today" ✓
- Project detail still shows cumulative 10m ✓
*/