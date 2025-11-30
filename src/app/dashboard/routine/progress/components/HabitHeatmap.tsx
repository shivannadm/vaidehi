// src/app/dashboard/routine/progress/components/HabitHeatmap.tsx
"use client";

import { Target, Flame } from "lucide-react";
import type { HabitHeatmapData } from "@/lib/supabase/progress-helpers";

interface HabitHeatmapProps {
  data: HabitHeatmapData[];
  isDark: boolean;
}

export default function HabitHeatmap({ data, isDark }: HabitHeatmapProps) {
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
          <Target className="w-5 h-5 text-indigo-500" />
          Habit Completion Heatmap (Last 90 Days)
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Visualize your habit consistency patterns
        </p>
      </div>

      {/* Habits List */}
      <div className="space-y-6">
        {data.map((habit) => (
          <div key={habit.habitId}>
            {/* Habit Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{habit.habitIcon}</span>
                <div>
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {habit.habitName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={isDark ? "text-slate-400" : "text-slate-600"}
                    >
                      <Flame className="w-3 h-3 inline mr-1 text-orange-500" />
                      {habit.currentStreak} day streak
                    </span>
                    <span
                      className={isDark ? "text-slate-400" : "text-slate-600"}
                    >
                      {habit.completionRate}% completion
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Score Badge */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  habit.completionRate >= 80
                    ? "bg-green-500/20 text-green-500"
                    : habit.completionRate >= 60
                    ? "bg-blue-500/20 text-blue-500"
                    : habit.completionRate >= 40
                    ? "bg-orange-500/20 text-orange-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {habit.completionRate}%
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-13 gap-1">
              {habit.completions.map((completion, index) => {
                const opacity = completion.completed ? 1 : 0.15;
                return (
                  <div
                    key={index}
                    className="aspect-square rounded-sm group relative cursor-pointer transition-transform hover:scale-125"
                    style={{
                      backgroundColor: habit.habitColor,
                      opacity,
                    }}
                    title={`${completion.date}: ${
                      completion.completed ? "Completed" : "Missed"
                    }`}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 ${
                        isDark
                          ? "bg-slate-900 text-white border border-slate-700"
                          : "bg-white text-slate-900 border border-slate-200 shadow-lg"
                      }`}
                    >
                      {completion.date}
                      <br />
                      {completion.completed ? "✓ Done" : "✗ Missed"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-xs">
        <span className={isDark ? "text-slate-400" : "text-slate-600"}>
          Less
        </span>
        <div className="flex gap-1">
          {[0.15, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: "#6366F1", opacity }}
            />
          ))}
        </div>
        <span className={isDark ? "text-slate-400" : "text-slate-600"}>
          More
        </span>
      </div>
    </div>
  );
}