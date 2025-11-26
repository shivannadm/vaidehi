// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProjectTaskList.tsx
// ============================================

"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, Star, Edit2, Trash2, X } from "lucide-react";
import { createTask, updateTask, deleteTask, completeTask, uncompleteTask } from "@/lib/supabase/task-helpers";
import { TAG_COLORS, formatDuration, type TaskWithTag } from "@/types/database";

interface ProjectTaskListProps {
    projectId: string;
    tasks: TaskWithTag[];
    onRefresh: () => void;
    isDark: boolean;
}

export default function ProjectTaskList({
    projectId,
    tasks,
    onRefresh,
    isDark,
}: ProjectTaskListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [adding, setAdding] = useState(false);

    const incompleteTasks = tasks.filter(t => !t.is_completed);
    const completedTasks = tasks.filter(t => t.is_completed);

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;

        setAdding(true);
        try {
            // Get user ID
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Get today's date
            const today = new Date();
            const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            await createTask({
                user_id: user.id,
                title: newTaskTitle.trim(),
                project_id: projectId,
                date: dateString,
                is_completed: false,
                is_important: false,
                total_time_spent: 0,
                tag_id: null,
            });

            setNewTaskTitle("");
            setIsAdding(false);
            onRefresh();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setAdding(false);
        }
    };

    const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
        try {
            if (isCompleted) {
                await uncompleteTask(taskId);
            } else {
                await completeTask(taskId);
            }
            onRefresh();
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (confirm("Delete this task?")) {
            try {
                await deleteTask(taskId);
                onRefresh();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Add Task Section */}
            <div>
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className={`w-full px-4 py-3 rounded-lg border-2 border-dashed transition text-sm font-medium flex items-center justify-center gap-2 ${isDark
                                ? 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                                : 'border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        Add Task to Project
                    </button>
                ) : (
                    <div className={`rounded-lg border p-3 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddTask();
                                    if (e.key === 'Escape') {
                                        setIsAdding(false);
                                        setNewTaskTitle("");
                                    }
                                }}
                                placeholder="Task title..."
                                autoFocus
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                    }`}
                            />
                            <button
                                onClick={handleAddTask}
                                disabled={adding || !newTaskTitle.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {adding ? "Adding..." : "Add"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewTaskTitle("");
                                }}
                                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                                    }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tasks to Complete */}
            {incompleteTasks.length > 0 && (
                <div>
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        To Complete ({incompleteTasks.length})
                    </h3>
                    <div className="space-y-2">
                        {incompleteTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleComplete}
                                onDelete={handleDeleteTask}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div>
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Completed ({completedTasks.length})
                    </h3>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleComplete}
                                onDelete={handleDeleteTask}
                                isDark={isDark}
                                isCompleted
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {tasks.length === 0 && !isAdding && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        No tasks yet
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Add your first task to get started!
                    </p>
                </div>
            )}
        </div>
    );
}

// Task Item Component
function TaskItem({
    task,
    onToggle,
    onDelete,
    isDark,
    isCompleted = false,
}: {
    task: TaskWithTag;
    onToggle: (taskId: string, isCompleted: boolean) => void;
    onDelete: (taskId: string) => void;
    isDark: boolean;
    isCompleted?: boolean;
}) {
    return (
        <div
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition ${isCompleted
                    ? isDark
                        ? 'bg-slate-700/30 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    : isDark
                        ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(task.id, isCompleted)}
                className="flex-shrink-0"
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500" />
                ) : (
                    <Circle className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                )}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span
                        className={`font-medium text-sm truncate ${isCompleted
                                ? isDark
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-500 line-through'
                                : isDark
                                    ? 'text-white'
                                    : 'text-slate-900'
                            }`}
                    >
                        {task.title}
                    </span>
                    {task.is_important && (
                        <Star className={`w-3.5 h-3.5 flex-shrink-0 ${isCompleted ? 'fill-slate-500 text-slate-500' : 'fill-yellow-500 text-yellow-500'
                            }`} />
                    )}
                </div>
                {task.tag && (
                    <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1"
                        style={{
                            backgroundColor: isDark
                                ? TAG_COLORS[task.tag.color].darkBg
                                : TAG_COLORS[task.tag.color].lightBg,
                            color: isDark
                                ? TAG_COLORS[task.tag.color].darkText
                                : TAG_COLORS[task.tag.color].lightText,
                        }}
                    >
                        #{task.tag.name}
                    </span>
                )}
            </div>

            {/* Time & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {task.total_time_spent > 0 && (
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatDuration(task.total_time_spent)}
                    </span>
                )}

                <button
                    onClick={() => onDelete(task.id)}
                    className={`p-1.5 rounded transition opacity-0 group-hover:opacity-100 ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}