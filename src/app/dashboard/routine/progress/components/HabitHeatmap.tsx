// src/app/dashboard/routine/progress/components/HabitHeatmap.tsx
"use client";

import { 
  Target, Flame, TrendingUp, TrendingDown, Award, 
  Zap, Calendar, BarChart3, Star, AlertCircle 
} from "lucide-react";
import type { HabitHeatmapData } from "@/lib/supabase/progress-helpers";

interface HabitHeatmapProps {
  data: HabitHeatmapData[];
  isDark: boolean;
}

export default function HabitHeatmap({ data, isDark }: HabitHeatmapProps) {
  // Calculate analytics
  const bestHabit = [...data].sort((a, b) => b.completionRate - a.completionRate)[0];
  const longestStreak = [...data].sort((a, b) => b.currentStreak - a.currentStreak)[0];
  const needsAttention = [...data].sort((a, b) => a.completionRate - b.completionRate)[0];
  const avgCompletionRate = Math.round(
    data.reduce((sum, h) => sum + h.completionRate, 0) / data.length
  );

  return (
    <div
      className={`rounded-xl border p-5 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Target className="w-5 h-5 text-indigo-500" />
            Habit Heatmap (Last 90 Days)
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Visualize consistency patterns
          </p>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg text-indigo-500">{data.length}</div>
            <div className={isDark ? "text-slate-400" : "text-slate-600"}>Habits</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-500">{avgCompletionRate}%</div>
            <div className={isDark ? "text-slate-400" : "text-slate-600"}>Avg Rate</div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Simple Heatmap List - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {data.map((habit) => (
            <div key={habit.habitId}>
              {/* Habit Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{habit.habitIcon}</span>
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {habit.habitName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                        <Flame className="w-3 h-3 inline mr-1 text-orange-500" />
                        {habit.currentStreak}d
                      </span>
                      <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {habit.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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

              {/* Heatmap Grid - Last 30 days */}
              <div className="grid grid-cols-20 gap-0">
                {habit.completions.slice(-30).map((completion, index) => {
                  const opacity = completion.completed ? 1 : 0.15;
                  return (
                    <div
                      key={`${habit.habitId}-${completion.date}-${index}`}
                      className="aspect-square rounded-sm group relative cursor-pointer transition-all hover:scale-150 hover:z-10"
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
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 ${
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

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs pt-2">
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>Less</span>
            <div className="flex gap-1">
              {[0.15, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
                <div
                  key={`legend-${i}`}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#6366F1", opacity }}
                />
              ))}
            </div>
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>More</span>
          </div>
        </div>

        {/* RIGHT: Rich Insights Panel - 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top Performer Card
          <div
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Star className="w-4 h-4 text-green-500" />
              </div>
              <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                🏆 Top Performer
              </h4>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{bestHabit.habitIcon}</span>
              <div>
                <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {bestHabit.habitName}
                </div>
                <div className="text-lg font-bold text-green-500">
                  {bestHabit.completionRate}%
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {bestHabit.currentStreak} day streak
                </div>
              </div>
            </div>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Outstanding consistency! You're mastering this habit.
            </p>
          </div> */}

          {/* Longest Streak
          <div
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-700/50"
                : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                🔥 Longest Streak
              </h4>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{longestStreak.habitIcon}</span>
              <div>
                <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {longestStreak.habitName}
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {longestStreak.currentStreak} days
                </div>
              </div>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDark ? "bg-slate-700" : "bg-slate-200"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                style={{ width: `${Math.min((longestStreak.currentStreak / 30) * 100, 100)}%` }}
              />
            </div>
            <div className={`text-xs mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Keep the fire burning! 🔥
            </div>
          </div> */}

          {/* Needs Attention */}
          {needsAttention.completionRate < 50 && (
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-700/50"
                  : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  ⚠️ Needs Attention
                </h4>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{needsAttention.habitIcon}</span>
                <div>
                  <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {needsAttention.habitName}
                  </div>
                  <div className="text-lg font-bold text-red-500">
                    {needsAttention.completionRate}%
                  </div>
                </div>
              </div>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Let's focus on this habit. Small daily steps lead to big results!
              </p>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3 h-3 text-indigo-500" />
                <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Avg Rate
                </span>
              </div>
              <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {avgCompletionRate}%
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-blue-500" />
                <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Total
                </span>
              </div>
              <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {data.length}
              </div>
            </div>
          </div>

          {/* Completion Rate Bars */}
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-slate-700/50 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h4
              className={`text-xs font-semibold mb-3 flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <TrendingUp className="w-3 h-3 text-indigo-500" />
              Completion Rates
            </h4>
            <div className="space-y-2">
              {data.slice(0, 4).map((habit) => (
                <div key={`rate-${habit.habitId}`}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="text-sm">{habit.habitIcon}</span>
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                        {habit.habitName.length > 12
                          ? habit.habitName.slice(0, 12) + "..."
                          : habit.habitName}
                      </span>
                    </span>
                    <span className="font-bold" style={{ color: habit.habitColor }}>
                      {habit.completionRate}%
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full overflow-hidden ${
                      isDark ? "bg-slate-600" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${habit.completionRate}%`,
                        backgroundColor: habit.habitColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Insight */}
          <div
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
                : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  💪 Keep Going!
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {avgCompletionRate >= 70
                    ? "You're doing amazing! Your consistency is paying off. Keep up this momentum!"
                    : avgCompletionRate >= 50
                    ? "Good progress! Focus on your top habits and the rest will follow."
                    : "Every journey starts somewhere. Small steps daily = big results over time!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}