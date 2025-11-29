// CREATE: src/app/dashboard/routine/habits/components/WeeklyProgress.tsx
"use client";

import { Calendar, TrendingUp } from "lucide-react";
import type { WeeklyHabitSummary, HabitWithStats } from "@/types/database";

interface WeeklyProgressProps {
  data: WeeklyHabitSummary;
  habits: HabitWithStats[];
  isDark: boolean;
}

export default function WeeklyProgress({
  data,
  habits,
  isDark,
}: WeeklyProgressProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getHabitColor = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    return habit?.color || "#94A3B8";
  };

  const getHabitIcon = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    return habit?.icon || "⭐";
  };

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Weekly Progress
          </h2>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {formatDate(data.weekStart)} - {formatDate(data.weekEnd)}
          </p>
        </div>

        {/* Overall Rate */}
        <div
          className={`px-4 py-2 rounded-lg border ${
            isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="text-xs opacity-70 mb-1">Overall Completion</div>
          <div className="text-2xl font-bold text-indigo-500">
            {data.overallCompletionRate}%
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {data.habits.map((habitData) => {
          const color = getHabitColor(habitData.habitId);
          const icon = getHabitIcon(habitData.habitId);
          const percentage = habitData.percentage;

          return (
            <div key={habitData.habitId} className="group">
              {/* Habit Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium">{habitData.habitName}</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold" style={{ color }}>
                    {habitData.completedDays}/{habitData.targetDays}
                  </span>
                  <span className={`ml-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    ({percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className={`h-4 rounded-full overflow-hidden ${
                  isDark ? "bg-slate-700" : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full transition-all duration-500 ease-out group-hover:brightness-110"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>

              {/* Status Badge */}
              <div className="mt-2 flex items-center gap-2">
                {percentage >= 100 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                    ✓ Goal Met!
                  </span>
                )}
                {percentage >= 75 && percentage < 100 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 font-medium">
                    On Track
                  </span>
                )}
                {percentage >= 50 && percentage < 75 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-medium">
                    Keep Going
                  </span>
                )}
                {percentage < 50 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-500 font-medium">
                    Needs Attention
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div
        className={`mt-6 p-4 rounded-lg border ${
          isDark
            ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
            : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Weekly Insights</h4>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {data.overallCompletionRate >= 80 ? (
                <>
                  <span className="font-bold text-green-500">Excellent work!</span> You're
                  crushing your habits this week. Keep up the momentum! 🔥
                </>
              ) : data.overallCompletionRate >= 60 ? (
                <>
                  <span className="font-bold text-blue-500">Great progress!</span> You're
                  on the right track. A few more completions and you'll hit your targets!
                </>
              ) : data.overallCompletionRate >= 40 ? (
                <>
                  <span className="font-bold text-yellow-500">Keep pushing!</span> You've
                  made progress, but there's room to improve. You've got this! 💪
                </>
              ) : (
                <>
                  <span className="font-bold text-red-500">Need a boost?</span> This week
                  has been challenging. Remember why you started and take it one day at a
                  time.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}