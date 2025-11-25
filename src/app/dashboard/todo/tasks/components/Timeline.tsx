// src/app/dashboard/todo/tasks/components/Timeline.tsx
"use client";

import { useMemo } from "react";
import { TAG_COLORS, type TaskSessionWithTask } from "@/types/database";

interface TimelineProps {
  sessions: TaskSessionWithTask[];
  currentTime: Date;
  isDark: boolean;
}

export default function Timeline({ sessions = [], currentTime, isDark }: TimelineProps) {
  
  // Smart timeline range
  const timelineHours = useMemo(() => {
    const currentHour = currentTime?.getHours() ?? new Date().getHours();
    
    let earliestHour = currentHour;
    let latestHour = currentHour;
    
    if (!Array.isArray(sessions)) {
      const hours = [];
      for (let i = Math.max(0, currentHour - 2); i <= currentHour + 1 && i <= 23; i++) {
        hours.push(i);
      }
      return hours;
    }
    
    sessions.forEach(session => {
      if (session?.start_time) {
        try {
          const start = new Date(session.start_time);
          if (!isNaN(start.getTime())) {
            earliestHour = Math.min(earliestHour, start.getHours());
          }
        } catch (e) {
          console.warn("Invalid start_time:", session.start_time);
        }
      }
      // Don't use end_time for range calculation
    });
    
    const startHour = Math.max(0, Math.min(earliestHour, currentHour - 2));
    const endHour = Math.min(23, Math.max(latestHour, currentHour));
    
    const hours = [];
    for (let i = startHour; i <= endHour + 1; i++) {
      if (i <= 23) hours.push(i);
    }
    
    return hours;
  }, [sessions, currentTime]);

  const startHour = timelineHours[0] ?? 8;
  const endHour = timelineHours[timelineHours.length - 1] ?? 20;
  const totalHours = Math.max(1, endHour - startHour);

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  // ⭐ THE FIX: Calculate position based ONLY on duration
  const getSessionPosition = (session: TaskSessionWithTask) => {
    try {
      const start = new Date(session.start_time);
      if (isNaN(start.getTime())) {
        return { top: '0%', height: '0%' };
      }
      
      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const timelineStartMinutes = startHour * 60;
      const timelineTotalMinutes = totalHours * 60;
      
      // TOP POSITION: Based on start time
      const topPercent = ((startMinutes - timelineStartMinutes) / timelineTotalMinutes) * 100;
      
      // HEIGHT: ONLY based on session.duration (in seconds)
      // This is the KEY - ignore start/end time difference
      const durationMinutes = session.duration / 60;
      let heightPercent = (durationMinutes / timelineTotalMinutes) * 100;
      
      // CRITICAL: Cap at current time (never show future)
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      const currentPercent = ((currentMinutes - timelineStartMinutes) / timelineTotalMinutes) * 100;
      const maxAllowedHeight = currentPercent - topPercent;
      
      // If block would extend past current time, cap it
      if (heightPercent > maxAllowedHeight) {
        heightPercent = Math.max(0, maxAllowedHeight);
      }
      
      // Minimum 2% for visibility (but only if duration > 0)
      const finalHeight = session.duration > 0 ? Math.max(heightPercent, 2) : 0;
      
      return {
        top: `${Math.max(0, topPercent)}%`,
        height: `${finalHeight}%`
      };
    } catch (e) {
      console.warn("Error calculating position:", e);
      return { top: '0%', height: '0%' };
    }
  };

  // Current time line position
  const getCurrentTimePosition = () => {
    try {
      if (!currentTime) return null;
      
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();
      
      if (hour < startHour || hour > endHour) return null;
      
      const currentMinutes = hour * 60 + minute;
      const timelineStartMinutes = startHour * 60;
      const timelineTotalMinutes = totalHours * 60;
      
      const topPercent = ((currentMinutes - timelineStartMinutes) / timelineTotalMinutes) * 100;
      
      return `${Math.max(0, Math.min(100, topPercent))}%`;
    } catch (e) {
      console.warn("Error calculating current time position:", e);
      return null;
    }
  };

  const currentTimePos = getCurrentTimePosition();
  
  const pixelsPerHour = 60;
  const totalHeight = totalHours * pixelsPerHour;

  return (
    <div className="relative h-full">
      <div className={`relative h-full overflow-y-auto timeline-scrollbar`}>
        <div className="relative pr-2" style={{ minHeight: `${totalHeight}px` }}>
          
          {/* Time Labels */}
          <div className="absolute left-0 top-0 w-14" style={{ height: `${totalHeight}px` }}>
            {Array.isArray(timelineHours) && timelineHours.map((hour, idx) => (
              <div 
                key={hour}
                className="absolute left-0"
                style={{ 
                  top: `${(idx / Math.max(1, totalHours)) * 100}%`,
                  transform: 'translateY(-6px)'
                }}
              >
                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Grid */}
          <div className="ml-14 relative" style={{ height: `${totalHeight}px` }}>
            
            {/* Hour Lines */}
            {Array.isArray(timelineHours) && timelineHours.map((hour, idx) => (
              <div
                key={`line-${hour}`}
                className={`absolute left-0 right-0 border-t ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
                style={{ 
                  top: `${(idx / Math.max(1, totalHours)) * 100}%`
                }}
              />
            ))}

            {/* Session Blocks */}
            {Array.isArray(sessions) && sessions
              .filter(s => s && s.duration > 0) // Only show sessions with actual duration
              .map((session, idx) => {
              const position = getSessionPosition(session);
              
              // Skip if height is 0
              if (position.height === '0%') return null;
              
              const tagColor = session.task?.tag 
                ? TAG_COLORS[session.task.tag.color]
                : { darkBg: '#f97316', lightBg: '#fed7aa', darkText: '#fff', lightText: '#000' };

              return (
                <div
                  key={`${session.id}-${idx}`}
                  className="absolute left-0 right-0 rounded-lg p-2.5 shadow-md"
                  style={{
                    top: position.top,
                    height: position.height,
                    backgroundColor: isDark ? tagColor.darkBg : tagColor.lightBg,
                    minHeight: '30px',
                    zIndex: 5
                  }}
                >
                  <div className="flex items-start justify-between h-full">
                    <div
                      className="text-sm font-semibold truncate flex-1"
                      style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}
                    >
                      {session.task?.title || 'Untitled'}
                    </div>
                    <div
                      className="text-xs font-bold ml-2 flex-shrink-0"
                      style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}
                    >
                      {formatDuration(session.duration || 0)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current Time Line */}
            {currentTimePos && (
              <div
                className="absolute left-0 right-0 flex items-center pointer-events-none"
                style={{ 
                  top: currentTimePos,
                  zIndex: 20
                }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 shadow-lg animate-pulse" />
                <div className="flex-1 h-0.5 bg-red-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {(!sessions || sessions.length === 0) && (
        <div className={`absolute inset-0 flex items-center justify-center text-center pointer-events-none ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <div>
            <p className="text-sm">No time records yet</p>
            <p className="text-xs mt-2">Start a task timer to see it here</p>
          </div>
        </div>
      )}
    </div>
  );
}