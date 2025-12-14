// src/app/dashboard/todo/schedule/components/UpcomingEvents.tsx
// ✅ MOBILE OPTIMIZED - FIXED
"use client";

import { Clock, ChevronRight } from "lucide-react";
import type { ScheduleEvent, EventType } from "@/types/database";
import {
  formatEventTimeRange,
  EVENT_TYPE_CONFIG,
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
  const upcomingEvents = events.slice(0, 5);

  if (upcomingEvents.length === 0) {
    return null;
  }

  const formatEventDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  // Helper function to safely get event type config
  const getEventTypeConfig = (eventType: EventType) => {
    const config = EVENT_TYPE_CONFIG[eventType];
    // Fallback config if undefined
    if (!config) {
      return {
        label: 'Other',
        icon: '📌',
        lightBg: '#F3F4F6',
        darkBg: '#6B7280',
        lightText: '#374151',
        darkText: '#F3F4F6',
      };
    }
    return config;
  };

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 md:p-5 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3
          className={`text-base sm:text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          📅 Upcoming Events
        </h3>
        <span
          className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full ${
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
              className={`w-full text-left p-2.5 sm:p-3 rounded-lg border transition group ${
                isDark
                  ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                  : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
              } ${isFirst ? "ring-2 ring-indigo-500/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Left: Event Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-xs sm:text-sm flex-shrink-0">{typeConfig.icon}</span>
                    <h4
                      className={`font-semibold text-xs sm:text-sm truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {event.title}
                    </h4>
                  </div>

                  {/* Time & Date */}
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">
                      {formatEventTimeRange(event.start_time, event.end_time)}
                    </span>
                    <span className="text-slate-500 hidden sm:inline">•</span>
                    <span className={`${isFirst ? "font-semibold text-indigo-400" : ""} sm:inline block mt-0.5 sm:mt-0`}>
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                </div>

                {/* Right: Type Badge & Arrow */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <span
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded-full font-medium whitespace-nowrap"
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
                    className={`w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  />
                </div>
              </div>

              {/* First event indicator */}
              {isFirst && (
                <div
                  className={`mt-2 pt-2 border-t text-[10px] sm:text-xs font-semibold ${
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
          className={`w-full mt-2 sm:mt-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition ${
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