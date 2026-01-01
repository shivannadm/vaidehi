// src/app/dashboard/routine/progress/components/RoutineConsistency.tsx
"use client";

import { Calendar } from "lucide-react";
import type { RoutineConsistencyDay } from "@/lib/supabase/progress-helpers";

interface RoutineConsistencyProps {
  data: RoutineConsistencyDay[];
  isDark: boolean;
}

export default function RoutineConsistency({
  data,
  isDark,
}: RoutineConsistencyProps) {
  // Get last 30 days
  const last30Days = data.slice(-30);

  // Calculate stats
  const perfectDays = last30Days.filter((d) => d.overallScore === 100).length;
  const activeDays = last30Days.filter((d) => d.overallScore > 0).length;
  const avgScore = Math.round(
    last30Days.reduce((sum, d) => sum + d.overallScore, 0) / (last30Days.length || 1)
  );

  // FIXED: Proper week grouping starting from Monday
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Create calendar grid with proper alignment
  const calendarGrid: (RoutineConsistencyDay | null)[][] = [];

  if (last30Days.length > 0) {
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDate = new Date(last30Days[0].date);
    let firstDayOfWeek = firstDate.getDay();

    // Convert Sunday (0) to 7 for easier calculation (Monday = 1, Sunday = 7)
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    // Calculate empty cells needed at the start (Monday = 1, so no empty; Tuesday = 2, so 1 empty, etc.)
    const emptyCellsAtStart = firstDayOfWeek - 1;

    // Create the grid
    let currentWeek: (RoutineConsistencyDay | null)[] = [];

    // Add empty cells at the start
    for (let i = 0; i < emptyCellsAtStart; i++) {
      currentWeek.push(null);
    }

    // Add all days
    last30Days.forEach((day) => {
      currentWeek.push(day);

      // If week is complete (7 days), start a new week
      if (currentWeek.length === 7) {
        calendarGrid.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Add remaining days if any
    if (currentWeek.length > 0) {
      // Fill the rest of the week with null
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendarGrid.push(currentWeek);
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
    >
      {/* COMPACT Header - Single Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            30-Day Consistency
          </h2>
          <p className={`hidden md:inline text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}>
            Track your daily routine completion patterns
          </p>
        </div>

        {/* Inline Compact Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-center">
            <div className="font-bold text-indigo-500">{avgScore}%</div>
            <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              Average
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-500">{perfectDays}</div>
            <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              Perfect
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-500">{activeDays}</div>
            <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-600"}`}>
              Active
            </div>
          </div>
        </div>
      </div>

      {/* ULTRA-COMPACT Legend - Single Line */}
      <div className="flex items-center justify-between mb-3 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className={isDark ? "text-slate-500" : "text-slate-600"}>Morning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className={isDark ? "text-slate-500" : "text-slate-600"}>Evening</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className={isDark ? "text-slate-500" : "text-slate-600"}>Health</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className={isDark ? "text-slate-500" : "text-slate-600"}>Habits</span>
          </div>
        </div>
      </div>

      {/* FIXED Calendar - Proper Week Alignment */}
      <div className="space-y-2">
        {/* Day Headers - Tiny */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center text-[9px] font-medium ${isDark ? "text-slate-600" : "text-slate-500"
                }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Weeks - PROPERLY ALIGNED */}
        {calendarGrid.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <div key={`cell-${weekIndex}-${dayIndex}`}>
                {day ? (
                  <CompactDayCell day={day} isDark={isDark} />
                ) : (
                  <div className="w-full h-10" /> // Empty cell
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ULTRA-COMPACT Day Cell
function CompactDayCell({
  day,
  isDark,
}: {
  day: RoutineConsistencyDay;
  isDark: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#3B82F6";
    if (score >= 40) return "#F59E0B";
    if (score > 0) return "#EF4444";
    return isDark ? "#475569" : "#CBD5E1";
  };

  const bgColor = getScoreColor(day.overallScore);
  const dayOfMonth = new Date(day.date).getDate();

  return (
    <div
      className="relative w-full h-15 rounded group cursor-pointer transition-all hover:scale-110 hover:z-20 hover:shadow-2xl"
      style={{
        backgroundColor: `${bgColor}10`,
        borderWidth: 1.5,
        borderColor: bgColor,
      }}
    >
      {/* Day Number - Top Left */}
      <div
        className="absolute top-0.5 left-0.5 text-[8px] font-bold opacity-60"
        style={{ color: bgColor }}
      >
        {dayOfMonth}
      </div>

      {/* Score - Center */}
      <div
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color: bgColor }}
      >
        {day.overallScore}
      </div>

      {/* Tiny Indicators - Bottom */}
      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
        {day.morningCompleted && <div className="w-1 h-1 rounded-full bg-orange-500" />}
        {day.eveningCompleted && <div className="w-1 h-1 rounded-full bg-purple-500" />}
        {day.healthCompleted && <div className="w-1 h-1 rounded-full bg-red-500" />}
        {day.habitsCompleted > 0 && <div className="w-1 h-1 rounded-full bg-blue-500" />}
      </div>

      {/* Enhanced Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 shadow-2xl min-w-[160px] ${isDark
            ? "bg-slate-950 text-white border-2 border-slate-700"
            : "bg-white text-slate-900 border-2 border-slate-300"
          }`}
      >
        <div className="font-bold mb-1.5 text-center border-b pb-1" style={{ borderColor: bgColor }}>
          {new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Morning</span>
            </div>
            <span className="font-medium">{day.morningCompleted ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Evening</span>
            </div>
            <span className="font-medium">{day.eveningCompleted ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Health</span>
            </div>
            <span className="font-medium">{day.healthCompleted ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Habits</span>
            </div>
            <span className="font-medium">{day.habitsCompleted}%</span>
          </div>
        </div>
        <div className="mt-1.5 pt-1.5 border-t text-center font-bold text-[10px]" style={{ borderColor: bgColor }}>
          Score: <span style={{ color: bgColor }}>{day.overallScore}%</span>
        </div>
      </div>
    </div>
  );
}