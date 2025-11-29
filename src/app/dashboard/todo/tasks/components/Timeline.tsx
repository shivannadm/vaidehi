// src/app/dashboard/todo/tasks/components/Timeline.tsx
// ✅ FIXED: Shows 3 more future hours in timeline
"use client";

import { TAG_COLORS } from "@/types/database";
import type { TaskSessionWithTask } from "@/types/database";
import { useMemo, useEffect, useRef } from "react";

interface TimelineProps {
  sessions: TaskSessionWithTask[];
  currentTime: Date;
  isDark: boolean;
  activeTaskId?: string | null;
}

export default function Timeline({
  sessions = [],
  currentTime,
  isDark,
  activeTaskId = null
}: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentTimeLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount and updates
  useEffect(() => {
    if (scrollContainerRef.current && currentTimeLineRef.current) {
      const container = scrollContainerRef.current;
      const timeLine = currentTimeLineRef.current;

      const linePosition = timeLine.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollPosition = linePosition - (containerHeight / 2);

      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [currentTime]);

  // ✅ FIXED: Generate timeline hours with 3 MORE FUTURE HOURS
  const timelineHours = useMemo(() => {
    const currentHour = currentTime?.getHours() ?? new Date().getHours();

    let earliestHour = currentHour;
    let latestHour = currentHour;

    if (!Array.isArray(sessions)) {
      const hours = [];
      // ✅ Show 2 hours before and 3 hours AFTER current hour
      for (let i = Math.max(0, currentHour - 2); i <= Math.min(23, currentHour + 3); i++) {
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
    });

    // ✅ CRITICAL FIX: Extend latestHour by 3 more hours
    const startHour = Math.max(0, Math.min(earliestHour, currentHour - 2));
    const endHour = Math.min(23, Math.max(latestHour, currentHour + 3)); // ✅ +3 hours

    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
      if (i <= 23) hours.push(i);
    }

    return hours;
  }, [sessions, currentTime]);

  const startHour = timelineHours[0] ?? 8;
  const endHour = timelineHours[timelineHours.length - 1] ?? 20;
  const totalHours = Math.max(1, endHour - startHour);

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

  const getSessionPosition = (session: TaskSessionWithTask) => {
    try {
      const start = new Date(session.start_time);
      if (isNaN(start.getTime())) {
        return { top: '0%', height: '0%' };
      }

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const timelineStartMinutes = startHour * 60;
      const timelineTotalMinutes = totalHours * 60;

      const topPercent = ((startMinutes - timelineStartMinutes) / timelineTotalMinutes) * 100;

      const durationMinutes = session.duration / 60;
      let heightPercent = (durationMinutes / timelineTotalMinutes) * 100;

      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      const currentPercent = ((currentMinutes - timelineStartMinutes) / timelineTotalMinutes) * 100;

      const maxAllowedHeight = currentPercent - topPercent;

      if (heightPercent > maxAllowedHeight) {
        heightPercent = Math.max(0, maxAllowedHeight);
      }

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

  const pixelsPerHour = 120;
  const totalHeight = totalHours * pixelsPerHour;

  return (
    <div className="relative h-full">
      <div
        ref={scrollContainerRef}
        className="relative h-full overflow-y-auto timeline-scrollbar"
      >
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
                className={`absolute left-0 right-0 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                style={{
                  top: `${(idx / Math.max(1, totalHours)) * 100}%`
                }}
              />
            ))}

            {/* Session Blocks */}
            {Array.isArray(sessions) && sessions
              .filter(s => s && s.duration >= 60)
              .map((session, idx) => {
                const position = getSessionPosition(session);

                if (position.height === '0%') return null;

                const tagColor = session.task?.tag
                  ? TAG_COLORS[session.task.tag.color]
                  : { darkBg: '#f97316', lightBg: '#fed7aa', darkText: '#fff', lightText: '#000' };

                const heightPercent = parseFloat(position.height);
                const actualHeightPx = (heightPercent / 100) * totalHeight;
                const minHeightPx = session.duration < 120 ? Math.max(actualHeightPx, 20) : actualHeightPx;

                return (
                  <div
                    key={`${session.id}-${idx}`}
                    className="absolute left-0 right-0 rounded-lg p-1 px-3 py-0.5 overflow-hidden"
                    style={{
                      top: position.top,
                      height: position.height,
                      backgroundColor: isDark ? tagColor.darkBg : tagColor.lightBg,
                      minHeight: `${minHeightPx}px`,
                      zIndex: 5
                    }}
                  >
                    <div className="flex items-start justify-between h-full">
                      <div
                        className="text-xs truncate flex-1"
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

            {/* Active Task Indicator */}
            {activeTaskId && currentTimePos && (
              <div
                className="absolute left-0 right-0 rounded-lg p-2 px-3 border-1 border-orange-500/50 bg-orange-500/10 animate-pulse"
                style={{
                  top: currentTimePos,
                  height: '40px',
                  zIndex: 10
                }}
              >
                <div className="text-xs font-bold text-orange-500">
                  Timer Running...
                </div>
              </div>
            )}

            {/* Current Time Line */}
            {currentTimePos && (
              <div
                ref={currentTimeLineRef}
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
      {(!sessions || sessions.length === 0) && !activeTaskId && (
        <div className={`absolute inset-0 flex items-center justify-center text-center pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <div>
            <p className="text-sm">No time records yet</p>
            <p className="text-xs mt-2">Start a task timer to see it here</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ✅ KEY CHANGES FOR FUTURE HOURS:
// ============================================
/*
Line 45: Changed from currentHour + 1 to currentHour + 3
Line 64: Changed from currentHour to currentHour + 3

Example:
- Current time: 10:00
- Before: Showed 08:00-11:00 (3 hours)
- After: Shows 08:00-13:00 (5 hours) ✅

This gives 3 more hours of future visibility!
*/