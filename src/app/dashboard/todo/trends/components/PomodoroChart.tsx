// src/app/dashboard/todo/trends/components/PomodoroChart.tsx
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
        
        console.log('Mapped sessions:', mapped);
        setSessions(mapped);
      } else {
        console.error('Error fetching sessions:', error);
      }

      setLoading(false);
    };

    fetchSessions();
  }, [startDate, endDate]);

  // Get unique dates that have sessions
  const getDatesWithSessions = () => {
    const uniqueDates = Array.from(new Set(sessions.map(s => s.date)))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Newest first
      .slice(0, 15); // Show max 15 days with data
    
    return uniqueDates.map(dateStr => new Date(dateStr + 'T00:00:00'));
  };

  const dates = getDatesWithSessions();
  const timeLabels = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
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
    // Parse start time - CRITICAL FIX
    const timeStr = session.start_time;
    let hours = 0;
    let minutes = 0;

    // Handle different time formats
    if (timeStr.includes('T')) {
      // ISO timestamp format: "2025-11-27T12:44:00"
      const date = new Date(timeStr);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      // Time string format: "12:44:00" or "12:44"
      const parts = timeStr.split(':');
      hours = parseInt(parts[0]) || 0;
      minutes = parseInt(parts[1]) || 0;
    }

    const startHours = hours + minutes / 60;

    // Duration in hours
    const durationHours = session.duration / 3600; // seconds to hours

    // Calculate percentages
    const left = (startHours / 24) * 100;
    const width = Math.max((durationHours / 24) * 100, 0.3); // Min 0.3% for visibility

    const color = session.task.tag 
      ? getTagColor(session.task.tag.color)
      : '#94a3b8';

    console.log(`Session: ${session.task.title}, Time: ${hours}:${minutes}, Left: ${left}%, Width: ${width}%`);

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
    
    // Start time
    const startPeriod = hours >= 12 ? 'PM' : 'AM';
    const startHour = hours % 12 || 12;
    const startMin = minutes.toString().padStart(2, '0');
    
    // End time
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

      {/* Chart */}
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
        <div className="flex-1 min-h-0 flex flex-col">
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

          {/* Timeline rows - ONLY DAYS WITH SESSIONS */}
          <div className="flex-1 overflow-y-auto scrollbar-custom pr-2 space-y-2">
            {dates.map((date, index) => {
              const daySessions = getSessionsForDate(date);
              
              return (
                <div key={index} className="flex items-center group">
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

                    {/* Session blocks */}
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className="absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:opacity-80 hover:shadow-lg hover:z-10"
                        style={getBlockStyle(session)}
                        title={`${session.task.title}${session.task.tag ? ` (#${session.task.tag.name})` : ''}\n${formatTime(session.start_time, session.duration)}\n${Math.round(session.duration / 60)}m`}
                      />
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