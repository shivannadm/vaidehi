// src/app/dashboard/todo/trends/components/PomodoroChart.tsx
"use client";

import { useState } from "react";
import type { PomodoroSession } from "@/lib/supabase/trends-helpers";

interface PomodoroChartProps {
  sessions: PomodoroSession[];
  startDate: string;
  endDate: string;
  isDark: boolean;
}

export default function PomodoroChart({
  sessions,
  startDate,
  endDate,
  isDark,
}: PomodoroChartProps) {
  // Generate date labels (last 7-30 days)
  const generateDates = () => {
    const dates: Date[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates.reverse().slice(0, 30); // Show max 30 days
  };

  const dates = generateDates();

  // Generate time labels (0:00 to 24:00)
  const timeLabels = Array.from({ length: 13 }, (_, i) => i * 2);

  // Group sessions by date
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(s => s.date === dateStr);
  };

  // Convert time string to position (0-24 hours)
  const timeToPosition = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Calculate block width and position
  const getBlockStyle = (session: PomodoroSession) => {
    const startPos = timeToPosition(session.startTime);
    const duration = session.duration / 60; // Convert minutes to hours
    
    const left = (startPos / 24) * 100;
    const width = (duration / 24) * 100;
    
    return {
      left: `${left}%`,
      width: `${Math.max(width, 0.5)}%`, // Minimum 0.5% width for visibility
      backgroundColor: session.color,
    };
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Pomodoro Records
        </h2>
        <p
          className={`text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Your focused work sessions timeline
        </p>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Time Labels (Top) */}
        <div className="flex items-center mb-2 pl-20">
          {timeLabels.map((hour) => (
            <div
              key={hour}
              className="flex-1 text-center"
              style={{ minWidth: `${100 / timeLabels.length}%` }}
            >
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {hour}:00
              </span>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-custom">
          {dates.map((date, index) => {
            const daySessions = getSessionsForDate(date);
            
            return (
              <div key={index} className="flex items-center group">
                {/* Date Label */}
                <div className="w-20 flex-shrink-0 pr-3 text-right">
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {formatDateLabel(date)}
                  </span>
                </div>

                {/* Timeline Row */}
                <div
                  className={`flex-1 h-8 rounded relative ${
                    isDark ? "bg-slate-700/30" : "bg-slate-100"
                  }`}
                >
                  {/* Grid Lines */}
                  {timeLabels.map((hour) => (
                    <div
                      key={hour}
                      className={`absolute top-0 bottom-0 border-l ${
                        isDark
                          ? "border-slate-700"
                          : "border-slate-200"
                      }`}
                      style={{ left: `${(hour / 24) * 100}%` }}
                    />
                  ))}

                  {/* Session Blocks */}
                  {daySessions.map((session, i) => (
                    <div
                      key={i}
                      className="absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:opacity-80 hover:z-10"
                      style={getBlockStyle(session)}
                      title={`${session.taskTitle} - ${session.duration}m`}
                    />
                  ))}

                  {/* Empty State */}
                  {daySessions.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span
                        className={`text-xs ${
                          isDark ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        No sessions
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`text-xs font-medium ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Project colors:
          </span>
          {Array.from(new Set(sessions.map(s => s.projectName)))
            .filter(Boolean)
            .slice(0, 5)
            .map((projectName, i) => {
              const session = sessions.find(s => s.projectName === projectName);
              return (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: session?.color }}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {projectName}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}