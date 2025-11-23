// src/app/dashboard/todo/tasks/components/TaskItem.tsx
"use client";

import { useState } from "react";
import { Play, Star, Edit2, Trash2 } from "lucide-react";
import { completeTask, uncompleteTask, deleteTask } from "@/lib/supabase/task-helpers";
import { TAG_COLORS, daysSinceCreation, formatDuration, type TaskWithTag } from "@/types/database";

interface TaskItemProps {
  task: TaskWithTag;
  onTaskUpdated: () => void;
  onEditClick: (task: TaskWithTag) => void;
  onPlayClick: (taskId: string, taskTitle: string) => void;
  isDark: boolean;
  isCompleted?: boolean;
  isPast?: boolean;
  isRunning?: boolean; // NEW: Indicates if this task's timer is running
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onEditClick,
  onPlayClick,
  isDark,
  isCompleted = false,
  isPast = false,
  isRunning = false // NEW
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

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
      <div className={`p-3 rounded-lg border flex items-center justify-center ${
        isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className={`ml-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Deleting...
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition ${
      isCompleted
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
        disabled={isToggling || isPast}
        className="w-4 h-4 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
      />

      {/* Play Button - ALWAYS VISIBLE + RUNNING INDICATOR */}
      {!isCompleted && !isPast && (
        <button 
          className={`p-1.5 rounded-full transition relative ${
            isRunning 
              ? 'bg-orange-500/20 shadow-lg shadow-orange-500/50' // Orange glow when running
              : isDark 
                ? 'hover:bg-slate-600' 
                : 'hover:bg-slate-200'
          }`}
          onClick={() => onPlayClick(task.id, task.title)}
          title={isRunning ? "Already running" : "Start timer"}
          disabled={isRunning}
        >
          <Play className={`w-3.5 h-3.5 ${
            isRunning ? 'text-orange-500 fill-orange-500' : ''
          }`} />
          
          {/* Pulsing ring when running */}
          {isRunning && (
            <span className="absolute inset-0 rounded-full bg-orange-500 opacity-75 animate-ping" />
          )}
        </button>
      )}

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${
          isCompleted
            ? isDark ? 'text-slate-400 line-through' : 'text-slate-500 line-through'
            : isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {task.title}
        </div>
      </div>

      {/* Tag */}
      {task.tag && (
        <span 
          className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
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
        <Star className={`w-4 h-4 flex-shrink-0 ${
          isCompleted 
            ? 'fill-slate-500 text-slate-500' 
            : 'fill-yellow-500 text-yellow-500'
        }`} />
      )}

      {/* Edit Button - ALWAYS VISIBLE (not hover) */}
      {!isCompleted && !isPast && (
        <button 
          onClick={() => onEditClick(task)}
          className={`p-1.5 rounded transition ${
            isDark 
              ? 'hover:bg-slate-600 text-slate-400' 
              : 'hover:bg-slate-200 text-slate-500'
          }`}
          title="Edit task"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Delete Button - ALWAYS VISIBLE (not hover) */}
      <button 
        onClick={handleDelete}
        disabled={isPast}
        className={`p-1.5 rounded transition ${
          isDark 
            ? 'hover:bg-slate-600 text-slate-400' 
            : 'hover:bg-slate-200 text-slate-500'
        } disabled:cursor-not-allowed disabled:opacity-30`}
        title="Delete task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Time Spent (for completed) or Days Badge (for incomplete) */}
      {isCompleted ? (
        <span className={`text-xs flex-shrink-0 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {formatDuration(task.total_time_spent)}
        </span>
      ) : (
        <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded ${
          isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
        }`}>
          {daysSinceCreation(task.created_at)}d
        </span>
      )}
    </div>
  );
}