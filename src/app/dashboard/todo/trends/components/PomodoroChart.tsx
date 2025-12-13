// ============================================
// FILE: PomodoroChart.tsx
// ✅ REAL MOBILE OPTIMIZATION
// ============================================

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";

const PROJECT_COLOR_MAP: Record<string, string> = {
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F97316',
  purple: '#A855F7',
  red: '#EF4444',
  teal: '#14B8A6',
  pink: '#EC4899',
  yellow: '#EAB308',
};

interface Session {
  id: string;
  date: string;
  start_time: string;
  duration: number;
  task: {
    title: string;
    tag: {
      name: string;
      color: string;
    } | null;
    project: {
      color: string;
    } | null;
  };
}

interface TooltipState {
  sessionId: string;
  x: number;
  y: number;
  task: {
    title: string;
    tag: { name: string; color: string } | null;
  };
  time: string;
  duration: number;
}

export default function PomodoroChart({
  startDate,
  endDate,
  isDark,
}: {
  startDate: string;
  endDate: string;
  isDark: boolean;
}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('task_sessions')
        .select(`
          id,
          date,
          start_time,
          duration,
          tasks (
            title,
            tags (
              name,
              color
            ),
            projects (
              color
            )
          )
        `)
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .not('end_time', 'is', null)
        .order('date', { ascending: false })
        .order('start_time', { ascending: true });

      if (data && !error) {
        const mapped = data.map((s: any) => ({
          id: s.id,
          date: s.date,
          start_time: s.start_time,
          duration: s.duration,
          task: {
            title: s.tasks?.title || 'Unknown',
            tag: s.tasks?.tags || null,
            project: s.tasks?.projects || null
          }
        }));

        setSessions(mapped);
      }

      setLoading(false);
    };

    fetchSessions();
  }, [startDate, endDate]);

  const getLast30Days = () => {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }

    return dates;
  };

  const dates = getLast30Days();
  // MOBILE: Only show 6, 12, 18, 24 on mobile
  const timeLabels = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  const getSessionsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return sessions.filter(s => s.date === dateStr);
  };

  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      red: '#DC2626', orange: '#F97316', yellow: '#F59E0B',
      green: '#10B981', teal: '#14B8A6', blue: '#3B82F6',
      indigo: '#6366F1', purple: '#A855F7', pink: '#EC4899',
      cyan: '#06B6D4', lime: '#84CC16', brown: '#78716C',
      gray: '#6B7280', slate: '#475569', violet: '#C026D3',
    };
    return colors[color] || '#94a3b8';
  };

  const getBlockStyle = (session: Session) => {
    const timeStr = session.start_time;
    let hours = 0, minutes = 0;

    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      const parts = timeStr.split(':');
      hours = parseInt(parts[0]) || 0;
      minutes = parseInt(parts[1]) || 0;
    }

    const startHours = hours + minutes / 60;
    const durationHours = session.duration / 3600;
    const left = (startHours / 24) * 100;
    const width = Math.max((durationHours / 24) * 100, 0.5);

    let color = '#94a3b8';

    if (session.task.project?.color) {
      color = PROJECT_COLOR_MAP[session.task.project.color] || color;
    } else if (session.task.tag?.color) {
      color = getTagColor(session.task.tag.color);
    }

    return { left: `${left}%`, width: `${width}%`, backgroundColor: color };
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    // MOBILE: Shorter date format
    const isMobile = window.innerWidth < 640;
    return date.toLocaleDateString('en-US', {
      month: isMobile ? 'numeric' : 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string, durationSeconds: number) => {
    let hours = 0, minutes = 0;

    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      const parts = timeStr.split(':');
      hours = parseInt(parts[0]) || 0;
      minutes = parseInt(parts[1]) || 0;
    }

    const startPeriod = hours >= 12 ? 'PM' : 'AM';
    const startHour = hours % 12 || 12;
    const startMin = minutes.toString().padStart(2, '0');

    const endMinutes = hours * 60 + minutes + Math.floor(durationSeconds / 60);
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const endHour = endHours % 12 || 12;

    return `${startHour}:${startMin} ${startPeriod} - ${endHour}:${endMins.toString().padStart(2, '0')} ${endPeriod}`;
  };

  const getUniqueTags = () => {
    const tagMap = new Map<string, string>();
    sessions.forEach(s => {
      if (s.task.tag) {
        tagMap.set(s.task.tag.name, s.task.tag.color);
      }
    });
    return Array.from(tagMap.entries()).map(([name, color]) => ({ name, color }));
  };

  const handleMouseEnter = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = rect.top;

    let y = rect.top - 10;

    if (spaceAbove < 100) {
      y = rect.bottom + 10;
    }

    setTooltip({
      sessionId: session.id,
      x: rect.left + rect.width / 2,
      y: y,
      task: session.task,
      time: formatTime(session.start_time, session.duration),
      duration: session.duration,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltip(null);
  };

  if (loading) {
    return (
      <div className={`rounded-xl border p-3 sm:p-4 md:p-6 h-full flex items-center justify-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-2 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Loading sessions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl border p-3 sm:p-4 md:p-6 h-full flex flex-col ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        {/* Header - MOBILE OPTIMIZED */}
        <div className="mb-3 sm:mb-4 flex-shrink-0">
          <h2 className={`text-sm sm:text-base md:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Timeline Records
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Your focused work sessions timeline
          </p>
          {sessions.length > 0 && (
            <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Chart */}
        {dates.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2">📊</div>
              <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                No sessions recorded yet
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col pb-3 sm:pb-4 md:pb-6">
            {/* Time labels - MOBILE: Smaller text */}
            <div className="flex items-center mb-2 pl-12 sm:pl-16 md:pl-20 flex-shrink-0">
              {timeLabels.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-center"
                  style={{ minWidth: `${100 / timeLabels.length}%` }}
                >
                  <span className={`text-[10px] sm:text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                    {hour}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline rows - MOBILE: Smaller */}
            <div className="flex-1 overflow-y-auto scrollbar-custom pr-1 sm:pr-2 space-y-1 sm:space-y-1.5 md:space-y-2">
              {dates.map((date, index) => {
                const daySessions = getSessionsForDate(date);

                return (
                  <div key={index} className="flex items-center">
                    {/* MOBILE: Narrower date label */}
                    <div className="w-12 sm:w-16 md:w-20 flex-shrink-0 pr-1.5 sm:pr-2 md:pr-3 text-right">
                      <span className={`text-[10px] sm:text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"
                        }`}>
                        {formatDateLabel(date)}
                      </span>
                    </div>

                    {/* MOBILE: Smaller height */}
                    <div className={`flex-1 h-6 sm:h-8 md:h-10 rounded relative ${isDark ? "bg-slate-700/30" : "bg-slate-100"
                      }`}>
                      {timeLabels.map((hour) => (
                        <div
                          key={hour}
                          className={`absolute top-0 bottom-0 border-l ${isDark ? "border-slate-700" : "border-slate-200"
                            }`}
                          style={{ left: `${(hour / 24) * 100}%` }}
                        />
                      ))}

                      {/* Session blocks */}
                      {daySessions.map((session) => (
                        <div
                          key={session.id}
                          className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 rounded cursor-pointer transition-all hover:z-50 hover:scale-105 hover:shadow-lg active:scale-95"
                          style={getBlockStyle(session)}
                          onMouseEnter={(e) => handleMouseEnter(e, session)}
                          onMouseLeave={handleMouseLeave}
                          onClick={(e) => handleMouseEnter(e, session)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend - MOBILE: Wrap, show fewer */}
        {sessions.length > 0 && (
          <div className={`mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0 border-t pt-2 sm:pt-3 ${isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
            <span className={`text-[10px] sm:text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"
              }`}>
              Tags:
            </span>
            {getUniqueTags().slice(0, 7).map((tag, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded"
                  style={{ backgroundColor: getTagColor(tag.color) }}
                />
                <span className={`text-[10px] sm:text-xs ${isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                  #{tag.name}
                </span>
              </div>
            ))}
            {getUniqueTags().length > 7 && (
              <span className="text-[10px] sm:text-xs text-slate-500">
                +{getUniqueTags().length - 7}
              </span>
            )}
          </div>
        )}
      </div>

      {/* PORTAL TOOLTIP - MOBILE FRIENDLY */}
      {mounted && tooltip && createPortal(
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-2xl text-[10px] sm:text-xs whitespace-nowrap border-2 max-w-[200px] ${isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
            }`}>
            <div className="font-bold mb-1 truncate">{tooltip.task.title}</div>
            {tooltip.task.tag && (
              <div className="opacity-75 mb-1">#{tooltip.task.tag.name}</div>
            )}
            <div className="opacity-75">{tooltip.time}</div>
            <div className="opacity-75">{Math.round(tooltip.duration / 60)}m</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}