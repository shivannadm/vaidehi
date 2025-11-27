// ============================================
// REPLACE the TimelineView.tsx file with this safer version
// FILE: src/app/dashboard/todo/projects/components/TimelineView.tsx
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
      <div className="text-center py-12">
        <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Set Project Timeline
        </h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Add start and end dates to view timeline
        </p>
      </div>
    );
  }

  // No tasks
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          No Tasks Yet
        </h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }

    return labels;
  }, [timelineRange]);

  return (
    <div className="p-6 space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Project Timeline
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {timelineRange.totalDays} days • {tasks.filter(t => t.is_completed).length}/{tasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>In Progress</span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Month Labels */}
        <div className="flex items-center mb-4">
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
        <div className={`relative h-2 rounded-full mb-6 ${
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

        {/* Tasks */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            if (position === null) return null;

            return (
              <div
                key={task.id}
                className="relative"
              >
                {/* Task Bar */}
                <div
                  className={`absolute h-10 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${
                    task.is_completed
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-blue-500/20 border-blue-500'
                  }`}
                  style={{
                    left: `${position}%`,
                    width: '120px',
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
                  <div className="flex items-center gap-2">
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