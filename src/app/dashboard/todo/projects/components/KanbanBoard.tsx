// ============================================
// FILE: src/app/dashboard/todo/projects/components/KanbanBoard.tsx
// FIXED: Drag & Drop now working properly
// ============================================

"use client";

import { useState } from "react";
import { Star, Clock, Trash2, GripVertical } from "lucide-react";
import { updateTask, completeTask, uncompleteTask, deleteTask } from "@/lib/supabase/task-helpers";
import { TAG_COLORS, formatDuration, type TaskWithTag } from "@/types/database";

interface KanbanBoardProps {
  tasks: TaskWithTag[];
  onRefresh: () => void;
  isDark: boolean;
}

type KanbanColumn = "todo" | "in_progress" | "completed";

export default function KanbanBoard({ tasks, onRefresh, isDark }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<TaskWithTag | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanColumn | null>(null);

  // Group tasks by status
  const tasksByColumn: Record<KanbanColumn, TaskWithTag[]> = {
    todo: tasks.filter(t => !t.is_completed && t.total_time_spent === 0),
    in_progress: tasks.filter(t => !t.is_completed && t.total_time_spent > 0),
    completed: tasks.filter(t => t.is_completed),
  };

  const columns: { id: KanbanColumn; title: string; color: string; icon: string }[] = [
    { id: "todo", title: "To Do", color: "slate", icon: "📋" },
    { id: "in_progress", title: "In Progress", color: "blue", icon: "⚡" },
    { id: "completed", title: "Completed", color: "green", icon: "✅" },
  ];

  const handleDragStart = (e: React.DragEvent, task: TaskWithTag) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: KanbanColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, column: KanbanColumn) => {
    e.preventDefault();
    if (!draggedTask) return;

    // Prevent dropping in same column
    const currentColumn = draggedTask.is_completed 
      ? "completed" 
      : draggedTask.total_time_spent > 0 
        ? "in_progress" 
        : "todo";

    if (currentColumn === column) {
      setDraggedTask(null);
      setDragOverColumn(null);
      return;
    }

    // Update task based on column
    try {
      if (column === "completed" && !draggedTask.is_completed) {
        await completeTask(draggedTask.id);
      } else if (column !== "completed" && draggedTask.is_completed) {
        await uncompleteTask(draggedTask.id);
      }
      // If moved to "in_progress" from "todo", the timer will need to be started
      // This is handled by the timer functionality in the task detail
      
      onRefresh();
    } catch (error) {
      console.error("Error moving task:", error);
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Delete this task?")) {
      await deleteTask(taskId);
      onRefresh();
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = tasksByColumn[column.id];
          const isOver = dragOverColumn === column.id;
          
          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`rounded-xl border-2 p-4 min-h-96 transition-all ${
                isOver
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : isDark
                    ? 'bg-slate-800/50 border-slate-700 border-dashed'
                    : 'bg-slate-50 border-slate-200 border-dashed'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{column.icon}</span>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {column.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className={`text-center py-8 text-sm ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {isOver ? 'Drop here' : 'No tasks'}
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const tagColor = task.tag ? TAG_COLORS[task.tag.color] : null;
                    const isDragging = draggedTask?.id === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-lg p-3 border cursor-move transition-all hover:shadow-md ${
                          isDragging 
                            ? 'opacity-50 scale-95'
                            : task.is_completed
                              ? isDark
                                ? 'bg-slate-700/50 border-slate-600'
                                : 'bg-slate-100 border-slate-200'
                              : isDark
                                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <GripVertical className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isDark ? 'text-slate-500' : 'text-slate-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-semibold text-sm mb-1 ${
                                  task.is_completed
                                    ? isDark
                                      ? 'text-slate-400 line-through'
                                      : 'text-slate-500 line-through'
                                    : isDark
                                      ? 'text-white'
                                      : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </h4>
                              {task.tag && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium inline-block"
                                  style={{
                                    backgroundColor: isDark ? tagColor!.darkBg : tagColor!.lightBg,
                                    color: isDark ? tagColor!.darkText : tagColor!.lightText,
                                  }}
                                >
                                  #{task.tag.name}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {task.is_important && (
                              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${
                                isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-100'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Task Footer */}
                        <div className="flex items-center justify-between text-xs">
                          <div className={`flex items-center gap-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {task.total_time_spent > 0 ? (
                              <span>{formatDuration(task.total_time_spent)}</span>
                            ) : (
                              <span>Not started</span>
                            )}
                          </div>
                          <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                            {new Date(task.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-lg border ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-blue-900'}`}>
          💡 <strong>Tip:</strong> Drag tasks between columns to change their status. Tasks in "In Progress" have time tracked.
        </p>
      </div>
    </div>
  );
}