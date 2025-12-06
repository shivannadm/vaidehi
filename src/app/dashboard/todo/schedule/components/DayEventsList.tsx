// src/app/dashboard/todo/schedule/components/DayEventsList.tsx
// ✅ MOBILE OPTIMIZED
"use client";

import { Plus, Calendar } from "lucide-react";
import EventCard from "./EventCard";
import type { ScheduleEvent } from "@/types/database";
import { getDayName, sortEventsByTime } from "@/types/database";

interface DayEventsListProps {
  selectedDate: Date;
  events: ScheduleEvent[];
  loading: boolean;
  onAddEvent: () => void;
  onEditEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onMoveToTask: (eventId: string) => void;
  isDark: boolean;
}

export default function DayEventsList({
  selectedDate,
  events,
  loading,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onMoveToTask,
  isDark,
}: DayEventsListProps) {
  const sortedEvents = sortEventsByTime(events);
  const dayName = getDayName(selectedDate);
  const dateString = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 md:p-5 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h2
              className={`text-base sm:text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {dayName}
            </h2>
          </div>
          <p
            className={`text-xs sm:text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {dateString}
          </p>
        </div>

        <button
          onClick={onAddEvent}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition ${
            isDark
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-2 sm:space-y-3">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div
              className={`inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 ${
                isDark ? "border-indigo-400" : "border-indigo-600"
              }`}
            ></div>
            <p
              className={`mt-2 sm:mt-3 text-xs sm:text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Loading events...
            </p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                isDark ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <Calendar
                className={`w-6 h-6 sm:w-8 sm:h-8 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              />
            </div>
            <h3
              className={`text-xs sm:text-sm font-semibold mb-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              No events scheduled
            </h3>
            <p
              className={`text-xs mb-3 sm:mb-4 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Add an event to get started
            </p>
            <button
              onClick={onAddEvent}
              className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add First Event
            </button>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onMoveToTask={onMoveToTask}
              isDark={isDark}
            />
          ))
        )}
      </div>
    </div>
  );
}