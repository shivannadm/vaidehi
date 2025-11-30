// src/app/dashboard/routine/progress/components/WeeklySummary.tsx
"use client";

import { Calendar, Sunrise, Moon, Heart, Target, Brain, Activity, Award } from "lucide-react";
import type { WeeklySummary } from "@/lib/supabase/progress-helpers";

interface WeeklySummaryProps {
  data: WeeklySummary;
  isDark: boolean;
}

export default function WeeklySummaryCard({ data, isDark }: WeeklySummaryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Calendar className="w-5 h-5 text-indigo-500" />
            This Week's Summary
          </h2>

          {/* Overall Score Badge */}
          <div
            className={`px-4 py-2 rounded-full font-bold ${
              data.overallScore >= 80
                ? "bg-green-500/20 text-green-500"
                : data.overallScore >= 60
                ? "bg-blue-500/20 text-blue-500"
                : data.overallScore >= 40
                ? "bg-orange-500/20 text-orange-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {data.overallScore}%
          </div>
        </div>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {formatDate(data.weekStart)} - {formatDate(data.weekEnd)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Morning Days */}
        <div
          className={`p-4 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-4 h-4 text-orange-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Morning
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.morningDays}/7
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {Math.round((data.morningDays / 7) * 100)}% completion
          </div>
        </div>

        {/* Evening Days */}
        <div
          className={`p-4 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-purple-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Evening
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.eveningDays}/7
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {Math.round((data.eveningDays / 7) * 100)}% completion
          </div>
        </div>

        {/* Health Days */}
        <div
          className={`p-4 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Health
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.healthDays}/7
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {Math.round((data.healthDays / 7) * 100)}% completion
          </div>
        </div>

        {/* Habits */}
        <div
          className={`p-4 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Habits
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.habitCompletionRate}%
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Average completion
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Meditation */}
        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Total Meditation
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.totalMeditationMinutes}m
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {Math.round(data.totalMeditationMinutes / 7)}m daily avg
          </div>
        </div>

        {/* Exercise */}
        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-orange-500" />
            <span
              className={`text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Total Exercise
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.totalExerciseMinutes}m
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {Math.round(data.totalExerciseMinutes / 7)}m daily avg
          </div>
        </div>
      </div>

      {/* Wellness Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
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
            Avg Sleep Quality
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.avgSleepQuality}/10
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
            Avg Mood
          </div>
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {data.avgMood}/10
          </div>
        </div>
      </div>

      {/* Weekly Achievement */}
      <div
        className={`p-4 rounded-lg border ${
          isDark
            ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
            : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4
              className={`font-semibold mb-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {data.overallScore >= 80
                ? "🎉 Outstanding Week!"
                : data.overallScore >= 60
                ? "💪 Strong Week!"
                : data.overallScore >= 40
                ? "📈 Keep Building!"
                : "🌱 Fresh Start Ahead!"}
            </h4>
            <p
              className={`text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {data.overallScore >= 80
                ? "You've maintained exceptional consistency across all routines. Your dedication is paying off!"
                : data.overallScore >= 60
                ? "Great progress this week! Focus on the areas that need more attention to reach peak performance."
                : data.overallScore >= 40
                ? "You're making progress! Small consistent steps lead to big transformations. Keep going!"
                : "Every expert was once a beginner. Use this week's insights to build better habits moving forward."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}