// src/app/dashboard/todo/schedule/components/ScheduleCalendar.tsx
// ✅ MOBILE OPTIMIZED
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  generateMonthCalendar,
  getMonthName,
  isSameDay,
  formatDateToString,
} from "@/types/database";

interface ScheduleCalendarProps {
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
  eventCounts: Record<string, number>;
  isDark: boolean;
}

export default function ScheduleCalendar({
  selectedDate,
  currentMonth,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  onTodayClick,
  eventCounts,
  isDark,
}: ScheduleCalendarProps) {
  const today = new Date();
  const weeks = generateMonthCalendar(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 md:p-5 h-full flex flex-col ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2
          className={`text-base sm:text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
        </h2>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={onPrevMonth}
            className={`p-1 sm:p-1.5 rounded-lg transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-300"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onNextMonth}
            className={`p-1 sm:p-1.5 rounded-lg transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-300"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className={`text-center text-[10px] sm:text-xs font-semibold py-1 sm:py-2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-0.5 sm:gap-1 mb-3 sm:mb-4">
        {weeks.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const dateString = formatDateToString(date);
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentMonth =
              date.getMonth() === currentMonth.getMonth();
            const eventCount = eventCounts[dateString] || 0;

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => onDateSelect(date)}
                className={`
                  aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition
                  relative flex items-center justify-center
                  ${
                    isSelected
                      ? isDark
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-500 text-white"
                      : isToday
                      ? isDark
                        ? "bg-indigo-900/30 text-indigo-400 border border-indigo-500"
                        : "bg-indigo-50 text-indigo-600 border border-indigo-300"
                      : isDark
                      ? isCurrentMonth
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-600 hover:bg-slate-700/50"
                      : isCurrentMonth
                      ? "text-slate-900 hover:bg-slate-100"
                      : "text-slate-400 hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className="text-xs sm:text-sm">{date.getDate()}</span>
                  {eventCount > 0 && (
                    <div className="flex gap-0.5 mt-0.5 sm:mt-1">
                      {[...Array(Math.min(eventCount, 3))].map((_, i) => (
                        <div
                          key={i}
                          className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full ${
                            isSelected
                              ? "bg-white"
                              : isDark
                              ? "bg-indigo-400"
                              : "bg-indigo-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Today Button */}
      <button
        onClick={onTodayClick}
        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
          isDark
            ? "bg-slate-700 hover:bg-slate-600 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-900"
        }`}
      >
        Today
      </button>
    </div>
  );
}