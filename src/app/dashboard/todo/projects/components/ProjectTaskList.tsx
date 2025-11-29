// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProjectTaskList.tsx
// ✅ FIXED: Tasks don't appear in main list until timer starts
// ============================================

"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Circle, Star, Edit2, Trash2, X, Play, Pause, StopCircle } from "lucide-react";
import { createTask, updateTask, deleteTask, completeTask, uncompleteTask } from "@/lib/supabase/task-helpers";
import { createClient } from "@/lib/supabase/client";
import { TAG_COLORS, formatDuration, type TaskWithTag } from "@/types/database";
import { useTimer } from "../../../components/TimerContext";

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
    const [userId, setUserId] = useState<string | null>(null);

    const { timer, startTimer, stopTimer } = useTimer();

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        init();
    }, []);

    const incompleteTasks = tasks.filter(t => !t.is_completed);
    const completedTasks = tasks.filter(t => t.is_completed);

    // ✅ FIX: Get TODAY's date in LOCAL timezone
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ✅ CRITICAL FIX: Calculate ONLY today's session time
    const getTodaySessionTime = async (taskId: string): Promise<number> => {
        try {
            const supabase = createClient();
            const todayDate = getTodayDateString();
            
            const { data, error } = await supabase
                .from('task_sessions')
                .select('duration')
                .eq('task_id', taskId)
                .eq('date', todayDate);

            if (error) {
                console.error('Error fetching today sessions:', error);
                return 0;
            }

            return data?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
        } catch (err) {
            console.error('Error:', err);
            return 0;
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim() || !userId) return;

        setAdding(true);
        try {
            console.log('✅ Creating project task with NO date (invisible in main list)');

            // ✅ CRITICAL FIX: Create task with date = NULL
            // Task will ONLY appear in main list when timer starts
            const { data, error } = await createTask({
                user_id: userId,
                title: newTaskTitle.trim(),
                project_id: projectId,
                date: null as any, // ✅ NULL = Not in main task list yet
                is_completed: false,
                is_important: false,
                total_time_spent: 0,
                tag_id: null,
            });

            if (error) {
                console.error('❌ Error creating task:', error);
                alert('Failed to create task');
                return;
            }

            console.log('✅ Task created (stays in project until timer starts):', data);

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
        if (!isCompleted && timer.taskId === taskId) {
            await stopTimer();
        }

        try {
            if (isCompleted) {
                await uncompleteTask(taskId);
            } else {
                await completeTask(taskId);
            }
            onRefresh();
            
            window.dispatchEvent(new CustomEvent('projectTaskUpdated'));
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (confirm("Delete this task?")) {
            if (timer.taskId === taskId) {
                await stopTimer();
            }

            try {
                await deleteTask(taskId);
                onRefresh();
                
                window.dispatchEvent(new CustomEvent('projectTaskDeleted'));
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    // ✅ CRITICAL FIX: Start timer AND set date to TODAY
    const handleStartTimer = async (task: TaskWithTag) => {
        if (!userId) return;

        try {
            const today = new Date();
            const todayDateString = getTodayDateString();

            console.log('🎯 Starting timer for project task:', {
                taskId: task.id,
                currentDate: task.date,
                todayDate: todayDateString
            });

            // ✅ CRITICAL: Update task date to TODAY (makes it appear in main list)
            if (task.date !== todayDateString) {
                console.log('📅 Updating task date to TODAY - will appear in main list now');
                
                const { error: updateError } = await updateTask(task.id, {
                    date: todayDateString
                });

                if (updateError) {
                    console.error('Error updating task date:', updateError);
                } else {
                    console.log('✅ Task date updated - now visible in main task list');
                }
            }

            // Stop existing timer if different task
            if (timer.taskId && timer.taskId !== task.id) {
                await stopTimer();
            }

            // ✅ Start timer with TODAY's date
            await startTimer(task.id, task.title, userId, today);
            
            console.log('✅ Timer started for project task');
            
            // Refresh to show changes
            onRefresh();
            
            // ✅ Notify main task page
            window.dispatchEvent(new CustomEvent('projectTimerStarted', {
                detail: { taskId: task.id, title: task.title, date: todayDateString }
            }));
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    };

    const handleStopTimer = async () => {
        const success = await stopTimer();
        if (success) {
            onRefresh();
            
            window.dispatchEvent(new CustomEvent('projectTimerStopped'));
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Active Timer Display */}
            {timer.taskId && (
                <div className={`rounded-xl border-2 p-4 ${
                    isDark 
                        ? 'bg-indigo-900/20 border-indigo-700' 
                        : 'bg-indigo-50 border-indigo-300'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    Timer Running
                                </p>
                                <p className={`font-bold text-lg ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                    {tasks.find(t => t.id === timer.taskId)?.title || timer.taskTitle || 'Unknown Task'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className={`text-3xl font-bold font-mono ${
                                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                                }`}>
                                    {formatDuration(timer.elapsedSeconds)}
                                </p>
                            </div>
                            <button
                                onClick={handleStopTimer}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-2"
                            >
                                <StopCircle className="w-4 h-4" />
                                Stop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Section */}
            <div>
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className={`w-full px-4 py-3 rounded-lg border-2 border-dashed transition text-sm font-medium flex items-center justify-center gap-2 ${
                            isDark
                                ? 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                                : 'border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        Add Task to Project
                    </button>
                ) : (
                    <div className={`rounded-lg border p-3 ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
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
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    isDark
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
                                className={`p-2 rounded-lg transition ${
                                    isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
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
                                onStartTimer={handleStartTimer}
                                isDark={isDark}
                                isTimerActive={timer.taskId === task.id}
                                getTodaySessionTime={getTodaySessionTime}
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
                                onStartTimer={handleStartTimer}
                                isDark={isDark}
                                isCompleted
                                isTimerActive={false}
                                getTodaySessionTime={getTodaySessionTime}
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

// ✅ Task Item Component - Shows TODAY's time only
function TaskItem({
    task,
    onToggle,
    onDelete,
    onStartTimer,
    isDark,
    isCompleted = false,
    isTimerActive = false,
    getTodaySessionTime,
}: {
    task: TaskWithTag;
    onToggle: (taskId: string, isCompleted: boolean) => void;
    onDelete: (taskId: string) => void;
    onStartTimer: (task: TaskWithTag) => void;
    isDark: boolean;
    isCompleted?: boolean;
    isTimerActive?: boolean;
    getTodaySessionTime: (taskId: string) => Promise<number>;
}) {
    const [todayTime, setTodayTime] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // ✅ Load TODAY's session time only
    useEffect(() => {
        const loadTodayTime = async () => {
            setLoading(true);
            const time = await getTodaySessionTime(task.id);
            setTodayTime(time);
            setLoading(false);
        };

        loadTodayTime();

        // Refresh on timer events
        const handleRefresh = () => loadTodayTime();
        window.addEventListener('projectTimerStarted', handleRefresh);
        window.addEventListener('projectTimerStopped', handleRefresh);

        return () => {
            window.removeEventListener('projectTimerStarted', handleRefresh);
            window.removeEventListener('projectTimerStopped', handleRefresh);
        };
    }, [task.id]);

    return (
        <div
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition ${
                isCompleted
                    ? isDark
                        ? 'bg-slate-700/30 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    : isTimerActive
                        ? isDark
                            ? 'bg-indigo-900/30 border-indigo-700'
                            : 'bg-indigo-50 border-indigo-300'
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
                        className={`font-medium text-sm truncate ${
                            isCompleted
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
                        <Star className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isCompleted ? 'fill-slate-500 text-slate-500' : 'fill-yellow-500 text-yellow-500'
                        }`} />
                    )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                    {task.tag && (
                        <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
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
                    {/* ✅ Show TODAY's time only */}
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Today: {loading ? '...' : formatDuration(todayTime)}
                    </span>
                    {/* Show cumulative time if different */}
                    {task.total_time_spent > todayTime && (
                        <span className={`text-xs font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            Total: {formatDuration(task.total_time_spent)}
                        </span>
                    )}
                </div>
            </div>

            {/* Timer Button & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {!isCompleted && (
                    <button
                        onClick={() => onStartTimer(task)}
                        disabled={isTimerActive}
                        className={`p-2 rounded-lg transition ${
                            isTimerActive
                                ? 'bg-indigo-600 text-white'
                                : isDark
                                    ? 'hover:bg-slate-600 text-slate-400'
                                    : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title={isTimerActive ? "Timer running" : "Start timer"}
                    >
                        <Play className="w-4 h-4" />
                    </button>
                )}

                <button
                    onClick={() => onDelete(task.id)}
                    className={`p-1.5 rounded transition opacity-0 group-hover:opacity-100 ${
                        isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ============================================
// ✅ KEY FIXES SUMMARY:
// ============================================
/*
1. Line 70: date: null (not today) - Task stays in project only
2. Line 157-175: handleStartTimer updates date to TODAY
3. Line 167: Task appears in main list when timer starts
4. Line 55-73: getTodaySessionTime() calculates only today's duration
5. Line 457-474: TaskItem shows "Today: 6m" + "Total: 10m"

Result:
- New tasks invisible in main list ✓
- Timer start → appears in main list ✓
- Shows today's time separately ✓
- Cumulative time in project detail ✓
*/