// src/app/dashboard/todo/trends/components/PomodoroChart.tsx
// FIXED: 1. Scroll bar no longer crosses timeline (pb-6 padding)
//        2. Hover shows individual task only (stopPropagation + individual state)
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  };
}

interface PomodoroChartProps {
  startDate: string;
  endDate: string;
  isDark: boolean;
}

export default function PomodoroChart({
  startDate,
  endDate,
  isDark,
}: PomodoroChartProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  // FIXED: Individual hover state per session
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  // Fetch sessions directly from component
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
            tag: s.tasks?.tags || null
          }
        }));
        
        setSessions(mapped);
      } else {
        console.error('Error fetching sessions:', error);
      }

      setLoading(false);
    };

    fetchSessions();
  }, [startDate, endDate]);

  // Get unique dates that have sessions - SHOW LAST 30 DAYS
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
  const timeLabels = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return sessions.filter(s => s.date === dateStr);
  };

  // Get tag color
  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      red: '#DC2626',
      orange: '#F97316',
      yellow: '#F59E0B',
      green: '#10B981',
      teal: '#14B8A6',
      blue: '#3B82F6',
      indigo: '#6366F1',
      purple: '#A855F7',
      pink: '#EC4899',
      cyan: '#06B6D4',
      lime: '#84CC16',
      brown: '#78716C',
      gray: '#6B7280',
      slate: '#475569',
      violet: '#C026D3',
    };
    return colors[color] || '#94a3b8';
  };

  // Calculate position and width
  const getBlockStyle = (session: Session) => {
    const timeStr = session.start_time;
    let hours = 0;
    let minutes = 0;

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
    const width = Math.max((durationHours / 24) * 100, 0.3);
    const color = session.task.tag 
      ? getTagColor(session.task.tag.color)
      : '#94a3b8';

    return {
      left: `${left}%`,
      width: `${width}%`,
      backgroundColor: color,
    };
  };

  // Format date label
  const formatDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time for tooltip
  const formatTime = (timeStr: string, durationSeconds: number) => {
    let hours = 0;
    let minutes = 0;

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

  // Get unique tags for legend
  const getUniqueTags = () => {
    const tagMap = new Map<string, string>();
    sessions.forEach(s => {
      if (s.task.tag) {
        tagMap.set(s.task.tag.name, s.task.tag.color);
      }
    });
    return Array.from(tagMap.entries()).map(([name, color]) => ({ name, color }));
  };

  if (loading) {
    return (
      <div className={`rounded-xl border p-6 h-full flex items-center justify-center ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Loading sessions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-6 h-full flex flex-col ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Pomodoro Records
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Your focused work sessions timeline
        </p>
        {sessions.length > 0 && (
          <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Chart - FIXED: Added pb-6 to prevent scroll from crossing timeline */}
      {dates.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              No sessions recorded yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col pb-6">
          {/* Time labels */}
          <div className="flex items-center mb-2 pl-20 flex-shrink-0">
            {timeLabels.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center"
                style={{ minWidth: `${100 / timeLabels.length}%` }}
              >
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                  {hour}:00
                </span>
              </div>
            ))}
          </div>

          {/* Timeline rows - FIXED: Removed 'group' class that was causing hover conflicts */}
          <div className="flex-1 overflow-y-auto scrollbar-custom pr-2 space-y-2">
            {dates.map((date, index) => {
              const daySessions = getSessionsForDate(date);
              
              return (
                <div key={index} className="flex items-center">
                  {/* Date label */}
                  <div className="w-20 flex-shrink-0 pr-3 text-right">
                    <span className={`text-xs font-medium ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {formatDateLabel(date)}
                    </span>
                  </div>

                  {/* Timeline bar */}
                  <div className={`flex-1 h-10 rounded relative ${
                    isDark ? "bg-slate-700/30" : "bg-slate-100"
                  }`}>
                    {/* Grid lines */}
                    {timeLabels.map((hour) => (
                      <div
                        key={hour}
                        className={`absolute top-0 bottom-0 border-l ${
                          isDark ? "border-slate-700" : "border-slate-200"
                        }`}
                        style={{ left: `${(hour / 24) * 100}%` }}
                      />
                    ))}

                    {/* Session blocks - FIXED: Individual hover detection with stopPropagation */}
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className="absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:z-50 hover:scale-105 hover:shadow-lg"
                        style={getBlockStyle(session)}
                        // CRITICAL: Stop event bubbling to prevent row hover
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredSessionId(session.id);
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setHoveredSessionId(null);
                        }}
                      >
                        {/* FIXED: Tooltip shows ONLY for this specific session */}
                        {hoveredSessionId === session.id && (
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[100]"
                            style={{ 
                              bottom: '100%',
                              marginBottom: '8px'
                            }}
                          >
                            <div className={`px-3 py-2 rounded-lg shadow-2xl text-xs whitespace-nowrap border-2 ${
                              isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                            }`}>
                              <div className="font-bold mb-1">{session.task.title}</div>
                              {session.task.tag && (
                                <div className="opacity-75 mb-1">#{session.task.tag.name}</div>
                              )}
                              <div className="opacity-75">
                                {formatTime(session.start_time, session.duration)}
                              </div>
                              <div className="opacity-75">
                                {Math.round(session.duration / 60)}m
                              </div>
                              {/* Tooltip arrow pointing down */}
                              <div 
                                className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                                style={{
                                  top: '100%',
                                  borderLeft: '8px solid transparent',
                                  borderRight: '8px solid transparent',
                                  borderTop: `8px solid ${isDark ? '#1e293b' : '#ffffff'}`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend - Show Tags */}
      {sessions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 flex-shrink-0 border-t pt-3 border-slate-700">
          <span className={`text-xs font-medium ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Tags:
          </span>
          {getUniqueTags().map((tag, i) => (
            <div key={i} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: getTagColor(tag.color) }} 
              />
              <span className={`text-xs ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                #{tag.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}