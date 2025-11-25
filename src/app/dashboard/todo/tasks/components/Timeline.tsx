// src/app/dashboard/todo/tasks/components/Timeline.tsx
"use client";

import { useMemo } from "react";
import { TAG_COLORS, type TaskSessionWithTask } from "@/types/database";

interface TimelineProps {
  sessions: TaskSessionWithTask[];
  currentTime: Date;
  isDark: boolean;
  activeSession?: { id: string; elapsedSeconds: number } | null; // ← CRITICAL
}

export default function Timeline({ 
  sessions = [], 
  currentTime, 
  isDark,
  activeSession 
}: TimelineProps) {

  // ── SMART TIMELINE RANGE (Fixed + Optimized) ─────────────────────
  const { timelineHours, startHour, totalMinutes } = useMemo(() => {
    const nowHour = currentTime.getHours();
    let earliest = nowHour - 2;
    let latest = nowHour + 4;

    sessions.forEach(s => {
      if (s.start_time) {
        const h = new Date(s.start_time).getHours();
        earliest = Math.min(earliest, h);
        if (s.end_time) {
          latest = Math.max(latest, new Date(s.end_time).getHours());
        }
      }
    });

    earliest = Math.max(0, earliest);
    latest = Math.min(23, latest);

    const hours = [];
    for (let i = earliest; i <= latest; i++) hours.push(i);

    return {
      timelineHours: hours,
      startHour: earliest,
      totalMinutes: (latest - earliest + 1) * 60,
    };
  }, [sessions, currentTime]);

  // ── REAL Duration Logic (This is the magic) ──────────────────────
  const getActualDurationSeconds = (session: TaskSessionWithTask): number => {
    // Case 1: This is the currently running session → use live timer
    if (activeSession && activeSession.id === session.id) {
      return activeSession.elapsedSeconds;
    }

    // Case 2: Session is completed → trust stored duration (but not zero)
    if (session.end_time && session.duration > 60) { // > 60s = real session
      return session.duration;
    }

    // Case 3: Very short or abandoned → ignore (under 60 seconds)
    if (session.duration < 60) {
      return 0;
    }

    return session.duration;
  };

  // ── Position & Height (Now Perfect) ──────────────────────────────
  const getSessionStyle = (session: TaskSessionWithTask) => {
    const start = new Date(session.start_time);
    if (isNaN(start.getTime())) return { top: "0%", height: "0%" };

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const timelineStartMinutes = startHour * 60;
    const topPct = ((startMinutes - timelineStartMinutes) / totalMinutes) * 100;

    const actualDurationSec = getActualDurationSeconds(session);
    if (actualDurationSec === 0) return { top: "0%", height: "0%" };

    let heightPct = (actualDurationSec / 60 / totalMinutes) * 100;

    // Never go past current time
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const currentPct = ((nowMinutes - timelineStartMinutes) / totalMinutes) * 100;
    const maxAllowedHeight = currentPct - topPct;
    heightPct = Math.min(heightPct, Math.max(1.5, maxAllowedHeight)); // min visibility

    return {
      top: `${Math.max(0, topPct)}%`,
      height: `${heightPct}%`,
    };
  };

  // ── Current Time Position ───────────────────────────────────────
  const currentTimeTop = useMemo(() => {
    const nowM = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startM = startHour * 60;
    const pct = ((nowM - startM) / totalMinutes) * 100;
    return `${Math.min(100, Math.max(0, pct))}%`;
  }, [currentTime, startHour, totalMinutes]);

  const containerHeight = timelineHours.length * 80;

  return (
    <div className="relative h-full">
      <div className="relative h-full overflow-y-auto timeline-scrollbar">
        <div className="relative pr-2" style={{ minHeight: `${containerHeight}px` }}>
          {/* Time Labels */}
          <div className="absolute left-0 top-0 w-14" style={{ height: `${containerHeight}px` }}>
            {timelineHours.map((h, i) => (
              <div key={h} className="absolute left-0" style={{ top: `${(i / timelineHours.length) * 100}%`, transform: "translateY(-8px)" }}>
                <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {h.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          <div className="ml-14 relative" style={{ height: `${containerHeight}px` }}>
            {/* Hour Lines */}
            {timelineHours.map((_, i) => (
              <div key={i} className={`absolute inset-x-0 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`} style={{ top: `${(i / timelineHours.length) * 100}%` }} />
            ))}

            {/* Sessions */}
            {sessions.filter(s => getActualDurationSeconds(s) >= 60).map(session => {
              const style = getSessionStyle(session);
              if (style.height === "0%") return null;

              const isRunning = activeSession?.id === session.id;
              const tagColor = session.task?.tag ? TAG_COLORS[session.task.tag.color] : { darkBg: "#f97316", lightBg: "#fed7aa", darkText: "#fff", lightText: "#000" };

              return (
                <div
                  key={session.id}
                  className={`absolute inset-x-0 rounded-lg p-2.5 shadow-md transition-all ${isRunning ? "ring-2 ring-orange-500 animate-pulse" : ""}`}
                  style={{
                    ...style,
                    backgroundColor: isDark ? tagColor.darkBg : tagColor.lightBg,
                    minHeight: "38px",
                    zIndex: isRunning ? 20 : 10,
                  }}
                >
                  <div className="flex items-center justify-between h-full">
                    <span className="text-sm font-semibold truncate" style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}>
                      {session.task?.title}
                    </span>
                    <span className="text-xs font-bold ml-2" style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}>
                      {(() => {
                        const sec = getActualDurationSeconds(session);
                        const m = Math.floor(sec / 60);
                        return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
                      })()}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Current Time Red Line */}
            <div className="absolute inset-x-0 flex items-center pointer-events-none z-30" style={{ top: currentTimeTop }}>
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg animate-pulse" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          </div>
        </div>
      </div>

      {sessions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>No time records yet</p>
            <p className="text-xs mt-1 text-slate-500">Start a task timer to see it here</p>
          </div>
        </div>
      )}
    </div>
  );
}