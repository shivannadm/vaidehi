// src/app/dashboard/routine/progress/components/RoutineConsistency.tsx
"use client";

import { Calendar, Sunrise, Moon, Heart, Target } from "lucide-react";
import type { RoutineConsistencyDay } from "@/lib/supabase/progress-helpers";

interface RoutineConsistencyProps {
  data: RoutineConsistencyDay[];
  isDark: boolean;
}

export default function RoutineConsistency({
  data,
  isDark,
}: RoutineConsistencyProps) {
  // Group by weeks
  const weeks: RoutineConsistencyDay[][] = [];
  let currentWeek: RoutineConsistencyDay[] = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-2 flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <Calendar className="w-5 h-5 text-indigo-500" />
          Routine Consistency (Last 30 Days)
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Track your daily routine completion patterns
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-orange-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>
            Morning
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>
            Evening
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>
            Health
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>
            Habits
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-medium ${
                isDark ? "text-slate-500" : "text-slate-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <DayCell key={dayIndex} day={day} isDark={isDark} />
            ))}
            {/* Fill empty cells */}
            {week.length < 7 &&
              Array.from({ length: 7 - week.length }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Avg Score
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {Math.round(
              data.reduce((sum, d) => sum + d.overallScore, 0) / data.length
            )}
            %
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Perfect Days
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.filter((d) => d.overallScore === 100).length}
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Active Days
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.filter((d) => d.overallScore > 0).length}/{data.length}
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Consistency
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {Math.round(
              (data.filter((d) => d.overallScore > 0).length / data.length) *
                100
            )}
            %
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCell({
  day,
  isDark,
}: {
  day: RoutineConsistencyDay;
  isDark: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981"; // Green
    if (score >= 60) return "#3B82F6"; // Blue
    if (score >= 40) return "#F59E0B"; // Orange
    if (score > 0) return "#EF4444"; // Red
    return isDark ? "#334155" : "#E2E8F0"; // Gray
  };

  const bgColor = getScoreColor(day.overallScore);

  return (
    <div
      className="relative aspect-square rounded-lg p-2 group cursor-pointer transition-transform hover:scale-110"
      style={{
        backgroundColor: `${bgColor}20`,
        borderWidth: 2,
        borderColor: bgColor,
      }}
    >
      {/* Score */}
      <div
        className="text-xs font-bold text-center"
        style={{ color: bgColor }}
      >
        {day.overallScore}
      </div>

      {/* Completion Indicators */}
      <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-0.5">
        {day.morningCompleted && (
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        )}
        {day.eveningCompleted && (
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        )}
        {day.healthCompleted && (
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
        {day.habitsCompleted > 0 && (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 ${
          isDark
            ? "bg-slate-900 text-white border border-slate-700"
            : "bg-white text-slate-900 border border-slate-200 shadow-lg"
        }`}
      >
        <div className="font-bold mb-1">{day.date}</div>
        <div className="space-y-0.5">
          <div>Morning: {day.morningCompleted ? "✓" : "✗"}</div>
          <div>Evening: {day.eveningCompleted ? "✓" : "✗"}</div>
          <div>Health: {day.healthCompleted ? "✓" : "✗"}</div>
          <div>Habits: {day.habitsCompleted}%</div>
        </div>
      </div>
    </div>
  );
}