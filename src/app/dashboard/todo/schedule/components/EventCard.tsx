// src/app/dashboard/todo/schedule/components/EventCard.tsx
"use client";

import { Clock, Edit2, Trash2, ArrowRight } from "lucide-react";
import type { ScheduleEvent } from "@/types/database";
import {
  formatEventTimeRange,
  formatEventDuration,
  getEventTypeConfig,
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
  const typeConfig = getEventTypeConfig(event.event_type);
  const canMoveToTask = isEventToday(event.date) && onMoveToTask;
  const duration = formatEventDuration(event.start_time, event.end_time);

  return (
    <div
      className={`rounded-lg p-4 border transition group ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-slate-600"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{typeConfig.icon}</span>
            <h3
              className={`font-semibold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {event.title}
            </h3>
          </div>

          {/* Time */}
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isDark ? "text-slate-400" : "text-slate-600"
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

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          {canMoveToTask && (
            <button
              onClick={() => onMoveToTask(event.id)}
              className={`p-1.5 rounded transition ${
                isDark
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
            className={`p-1.5 rounded transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            title="Edit Event"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className={`p-1.5 rounded transition ${
              isDark
                ? "hover:bg-red-900/30 text-red-400"
                : "hover:bg-red-50 text-red-600"
            }`}
            title="Delete Event"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Badge */}
      <div className="flex items-center gap-2">
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
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isDark
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
          className={`text-xs mt-2 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {event.description}
        </p>
      )}
    </div>
  );
}