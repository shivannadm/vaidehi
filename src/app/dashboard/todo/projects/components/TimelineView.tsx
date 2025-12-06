// ============================================
// FILE: src/app/dashboard/todo/projects/components/TimelineView.tsx
// ✅ MOBILE RESPONSIVE - FIXED LAYOUT ISSUES
// ============================================

"use client";

import { useMemo } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { formatDuration, type TaskWithTag } from "@/types/database";

interface TimelineViewProps {
  tasks: TaskWithTag[];
  projectStartDate: string | null;
  projectEndDate: string | null;
  isDark: boolean;
}

export default function TimelineView({ 
  tasks, 
  projectStartDate, 
  projectEndDate,
  isDark 
}: TimelineViewProps) {
  // Calculate timeline range
  const timelineRange = useMemo(() => {
    if (!projectStartDate || !projectEndDate) {
      return null;
    }

    const start = new Date(projectStartDate);
    const end = new Date(projectEndDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return { start, end, totalDays };
  }, [projectStartDate, projectEndDate]);

  // Get task position on timeline
  const getTaskPosition = (task: TaskWithTag) => {
    if (!timelineRange) return null;

    const taskDate = new Date(task.date);
    const daysSinceStart = Math.ceil((taskDate.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const position = (daysSinceStart / timelineRange.totalDays) * 100;

    return Math.max(0, Math.min(100, position));
  };

  // No timeline if dates not set
  if (!timelineRange) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <Calendar className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h3 className={`text-base md:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Set Project Timeline
        </h3>
        <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Add start and end dates to view timeline
        </p>
      </div>
    );
  }

  // No tasks
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <Calendar className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h3 className={`text-base md:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          No Tasks Yet
        </h3>
        <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Add tasks to see them on the timeline
        </p>
      </div>
    );
  }

  // Generate month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    const current = new Date(timelineRange.start);
    const end = timelineRange.end;

    while (current <= end) {
      labels.push({
        date: new Date(current),
        label: current.toLocaleDateString('en-US', { 
          month: 'short',
          year: window.innerWidth < 768 ? undefined : 'numeric' // Hide year on mobile
        })
      });
      current.setMonth(current.getMonth() + 1);
    }

    return labels;
  }, [timelineRange]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Timeline Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className={`text-base md:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Project Timeline
          </h3>
          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {timelineRange.totalDays} days • {tasks.filter(t => t.is_completed).length}/{tasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Done</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500"></div>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Active</span>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical List, Desktop: Timeline View */}
      <div className="block md:hidden space-y-3">
        {/* Mobile: Simple vertical task list */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-lg p-3 border ${
              task.is_completed
                ? isDark
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-green-50 border-green-200'
                : isDark
                  ? 'bg-blue-900/20 border-blue-700'
                  : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {task.is_completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm mb-1 ${
                  task.is_completed
                    ? 'text-green-500'
                    : isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  {task.tag && (
                    <span className={`px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{task.tag.name}
                    </span>
                  )}
                  {task.total_time_spent > 0 && (
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {formatDuration(task.total_time_spent)}
                    </span>
                  )}
                </div>
                <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {new Date(task.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Timeline View - Fixed overflow */}
      <div className="hidden md:block relative overflow-x-auto pb-4">
        {/* Month Labels */}
        <div className="flex items-center mb-4 min-w-[800px]">
          {monthLabels.map((month, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center text-xs font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Timeline Track */}
        <div className={`relative h-2 rounded-full mb-6 min-w-[800px] ${
          isDark ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          {/* Current day indicator */}
          {(() => {
            const today = new Date();
            const todayPosition = ((today.getTime() - timelineRange.start.getTime()) / (timelineRange.end.getTime() - timelineRange.start.getTime())) * 100;
            
            if (todayPosition >= 0 && todayPosition <= 100) {
              return (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{ left: `${todayPosition}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-red-500 whitespace-nowrap">
                    Today
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Tasks - Fixed positioning to prevent overflow */}
        <div className="space-y-3 min-w-[800px]">
          {tasks.map((task, index) => {
            const position = getTaskPosition(task);
            if (position === null) return null;

            // Adjust position if too close to edge
            const adjustedPosition = position > 85 ? 85 : position;

            return (
              <div
                key={task.id}
                className="relative min-h-[100px]"
              >
                {/* Task Bar */}
                <div
                  className={`absolute h-10 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer z-10 ${
                    task.is_completed
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-blue-500/20 border-blue-500'
                  }`}
                  style={{
                    left: `${adjustedPosition}%`,
                    width: 'auto',
                    minWidth: '120px',
                    maxWidth: '200px',
                  }}
                  title={task.title}
                >
                  <div className="flex items-center gap-2 px-3 h-full">
                    {task.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium truncate ${
                        task.is_completed
                          ? 'text-green-500'
                          : isDark
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>

                {/* Task Label (below bar) */}
                <div className={`pt-12 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{task.title}</span>
                    {task.tag && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{task.tag.name}
                      </span>
                    )}
                    {task.total_time_spent > 0 && (
                      <span className="text-xs">• {formatDuration(task.total_time_spent)}</span>
                    )}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5">
                    {new Date(task.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}