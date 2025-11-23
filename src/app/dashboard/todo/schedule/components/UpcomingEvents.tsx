// src/app/dashboard/todo/schedule/components/UpcomingEvents.tsx
"use client";

import { Clock, Calendar, ChevronRight } from "lucide-react";
import type { ScheduleEvent } from "@/types/database";
import {
  formatEventTimeRange,
  getEventTypeConfig,
} from "@/types/database";

interface UpcomingEventsProps {
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  isDark: boolean;
}

export default function UpcomingEvents({
  events,
  onEventClick,
  isDark,
}: UpcomingEventsProps) {
  // Take only first 5 events (already sorted by date/time)
  const upcomingEvents = events.slice(0, 5);

  if (upcomingEvents.length === 0) {
    return null; // Don't show section if no upcoming events
  }

  const formatEventDate = (dateString: string) => {
    // Parse date correctly - YYYY-MM-DD format from database
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in JS
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    // Otherwise show day name and date
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div
      className={`rounded-xl border p-5 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          📅 Upcoming Events
        </h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isDark
              ? "bg-indigo-900/30 text-indigo-400"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          Next {upcomingEvents.length}
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {upcomingEvents.map((event, index) => {
          const typeConfig = getEventTypeConfig(event.event_type);
          const isFirst = index === 0;

          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`w-full text-left p-3 rounded-lg border transition group ${
                isDark
                  ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                  : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
              } ${isFirst ? "ring-2 ring-indigo-500/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Event Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{typeConfig.icon}</span>
                    <h4
                      className={`font-semibold text-sm truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {event.title}
                    </h4>
                  </div>

                  {/* Time & Date */}
                  <div
                    className={`flex items-center gap-2 text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatEventTimeRange(event.start_time, event.end_time)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className={isFirst ? "font-semibold text-indigo-400" : ""}>
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                </div>

                {/* Right: Type Badge & Arrow */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: isDark
                        ? typeConfig.darkBg + "40"
                        : typeConfig.lightBg,
                      color: isDark ? typeConfig.darkText : typeConfig.lightText,
                    }}
                  >
                    {typeConfig.label}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  />
                </div>
              </div>

              {/* First event indicator */}
              {isFirst && (
                <div
                  className={`mt-2 pt-2 border-t text-xs font-semibold ${
                    isDark
                      ? "border-slate-600 text-indigo-400"
                      : "border-slate-200 text-indigo-600"
                  }`}
                >
                  ⚡ Next Up
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* View All Link */}
      {events.length > 5 && (
        <button
          className={`w-full mt-3 py-2 rounded-lg text-xs font-semibold transition ${
            isDark
              ? "text-indigo-400 hover:bg-slate-700"
              : "text-indigo-600 hover:bg-slate-50"
          }`}
        >
          View all {events.length} upcoming events →
        </button>
      )}
    </div>
  );
}