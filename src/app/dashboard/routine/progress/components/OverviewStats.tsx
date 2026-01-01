// src/app/dashboard/routine/progress/components/OverviewStats.tsx
"use client";

import { Flame, TrendingUp, Target, Heart, Brain, Activity } from "lucide-react";
import type { ProgressOverview } from "@/lib/supabase/progress-helpers";

interface OverviewStatsProps {
  data: ProgressOverview;
  isDark: boolean;
}

export default function OverviewStats({ data, isDark }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Streaks */}
      <StatCard
        icon={<Flame className="w-6 h-6" />}
        label="Longest Streak"
        value={`${data.longestOverallStreak} days`}
        subtitle="Keep the momentum going!"
        color="#F59E0B"
        isDark={isDark}
      />

      {/* Morning Stats */}
      <StatCard
        icon={<Activity className="w-6 h-6" />}
        label="Morning Routine"
        value={`${data.morningCompletionRate}%`}
        subtitle={`${data.totalMorningEntries} entries`}
        color="#10B981"
        isDark={isDark}
      />

      {/* Evening Stats */}
      <StatCard
        icon={<Brain className="w-6 h-6" />}
        label="Evening Routine"
        value={`${data.eveningCompletionRate}%`}
        subtitle={`${data.totalEveningEntries} entries`}
        color="#8B5CF6"
        isDark={isDark}
      />

      {/* Health Stats */}
      <StatCard
        icon={<Heart className="w-6 h-6" />}
        label="Health Tracking"
        value={`${data.healthCompletionRate}%`}
        subtitle={`${data.totalHealthEntries} entries`}
        color="#EF4444"
        isDark={isDark}
      />

      {/* Habits */}
      <StatCard
        icon={<Target className="w-6 h-6" />}
        label="Habit Completion"
        value={`${data.habitCompletionRate}%`}
        subtitle={`${data.totalHabitsTracked} habits tracked`}
        color="#3B82F6"
        isDark={isDark}
      />

      {/* Meditation */}
      <StatCard
        icon={<Brain className="w-6 h-6" />}
        label="Avg Meditation"
        value={`${data.avgMeditationTime}m`}
        subtitle="Daily average"
        color="#A855F7"
        isDark={isDark}
      />

      {/* Exercise */}
      <StatCard
        icon={<Activity className="w-6 h-6" />}
        label="Avg Exercise"
        value={`${data.avgExerciseTime}m`}
        subtitle="Daily average"
        color="#F97316"
        isDark={isDark}
      />

      {/* Overall Wellness */}
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Overall Wellness"
        value={`${Math.round((data.avgSleepQuality + data.avgMoodRating + data.avgEnergyLevel) / 3 * 10)}/10`}
        subtitle="Sleep, Mood, Energy"
        color="#14B8A6"
        isDark={isDark}
      />
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, color, isDark }: any) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all hover:scale-105 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"
              }`}
          >
            {label}
          </div>
          <div
            className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"
              }`}
            style={{ color }}
          >
            {value}
          </div>
          <div
            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"
              }`}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}