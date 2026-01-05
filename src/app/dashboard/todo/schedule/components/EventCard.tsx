// src/app/dashboard/todo/schedule/components/EventCard.tsx
// ✅ MOBILE RESPONSIVE - Always show action buttons on mobile - FIXED
"use client";

import { Clock, Edit2, Trash2, ArrowRight } from "lucide-react";
import type { ScheduleEvent, EventType } from "@/types/database";
import {
  formatEventTimeRange,
  formatEventDuration,
  EVENT_TYPE_CONFIG,
  isEventToday,
} from "@/types/database";

interface EventCardProps {
  event: ScheduleEvent;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (eventId: string) => void;
  onMoveToTask?: (eventId: string) => void;
  isDark: boolean;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onMoveToTask,
  isDark,
}: EventCardProps) {
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

  const typeConfig = getEventTypeConfig(event.event_type);
  const canMoveToTask = isEventToday(event.date) && onMoveToTask;
  const duration = formatEventDuration(event.start_time, event.end_time);

  // Check if event is in the past
  const isEventPast = () => {
    const now = new Date();
    const [year, month, day] = event.date.split('-').map(Number);
    const [hours, minutes] = event.end_time.split(':').map(Number);

    const eventEndTime = new Date(year, month - 1, day, hours, minutes);
    return eventEndTime < now;
  };

  const isPast = isEventPast();

  return (
    <div
      className={`rounded-lg p-3 sm:p-4 border transition group ${isDark
          ? "bg-slate-800 border-slate-700 hover:border-slate-600"
          : "bg-white border-slate-200 hover:border-slate-300"
        } ${isPast ? "opacity-60" : ""}`}
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base sm:text-lg">{typeConfig.icon}</span>
            <h3
              className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              {event.title}
            </h3>
            {isPast && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-500 whitespace-nowrap">
                Past
              </span>
            )}
          </div>

          {/* Time */}
          <div
            className={`flex items-center gap-1.5 text-xs ${isDark ? "text-slate-400" : "text-slate-600"
              }`}
          >
            <Clock className="w-3 h-3" />
            <span>
              {formatEventTimeRange(event.start_time, event.end_time)}
            </span>
            <span className="text-slate-500">•</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Actions - Always visible on mobile, hover on desktop */}
        {!isPast && (
          <div className={`flex items-center gap-1 flex-shrink-0 ${
            // Always visible on mobile (< lg), hover on desktop
            "lg:opacity-0 lg:group-hover:opacity-100"
            } transition`}>
            {canMoveToTask && (
              <button
                onClick={() => onMoveToTask(event.id)}
                className={`p-1.5 rounded transition ${isDark
                    ? "hover:bg-green-900/30 text-green-400"
                    : "hover:bg-green-50 text-green-600"
                  }`}
                title="Move to Tasks"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onEdit(event)}
              className={`p-1.5 rounded transition ${isDark
                  ? "hover:bg-slate-700 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
                }`}
              title="Edit Event"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className={`p-1.5 rounded transition ${isDark
                  ? "hover:bg-red-900/30 text-red-400"
                  : "hover:bg-red-50 text-red-600"
                }`}
              title="Delete Event"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Type Badge & Recurring */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: isDark ? typeConfig.darkBg : typeConfig.lightBg,
            color: isDark ? typeConfig.darkText : typeConfig.lightText,
          }}
        >
          {typeConfig.label}
        </span>

        {event.is_recurring && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark
                ? "bg-purple-900/30 text-purple-400"
                : "bg-purple-50 text-purple-600"
              }`}
          >
            🔄 {event.recurrence_pattern}
          </span>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <p
          className={`text-xs mt-2 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"
            }`}
        >
          {event.description}
        </p>
      )}
    </div>
  );
}