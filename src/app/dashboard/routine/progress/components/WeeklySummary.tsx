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
      className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            This Week's Summary
          </h2>
          <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
            {formatDate(data.weekStart)} - {formatDate(data.weekEnd)}
          </p>
        </div>

        {/* Score Badge */}
        <div
          className={`px-3 py-1.5 rounded-full text-sm font-bold ${data.overallScore >= 80
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

      {/* Compact 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <CompactStatCard
          icon={<Sunrise className="w-3 h-3 text-orange-500" />}
          label="Morning"
          value={`${data.morningDays}/7`}
          percentage={Math.round((data.morningDays / 7) * 100)}
          isDark={isDark}
        />
        <CompactStatCard
          icon={<Moon className="w-3 h-3 text-purple-500" />}
          label="Evening"
          value={`${data.eveningDays}/7`}
          percentage={Math.round((data.eveningDays / 7) * 100)}
          isDark={isDark}
        />
        <CompactStatCard
          icon={<Heart className="w-3 h-3 text-red-500" />}
          label="Health"
          value={`${data.healthDays}/7`}
          percentage={Math.round((data.healthDays / 7) * 100)}
          isDark={isDark}
        />
        <CompactStatCard
          icon={<Target className="w-3 h-3 text-blue-500" />}
          label="Habits"
          value={`${data.habitCompletionRate}%`}
          percentage={data.habitCompletionRate}
          isDark={isDark}
        />
      </div>

      {/* Activity Stats - Compact */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className={`p-3 rounded-lg border ${isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
            }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3 h-3 text-purple-500" />
            <span
              className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Meditation
            </span>
          </div>
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {data.totalMeditationMinutes}m
          </div>
          <div className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            {Math.round(data.totalMeditationMinutes / 7)}m daily avg
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border ${isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
            }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3 h-3 text-orange-500" />
            <span
              className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Exercise
            </span>
          </div>
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {data.totalExerciseMinutes}m
          </div>
          <div className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            {Math.round(data.totalExerciseMinutes / 7)}m daily avg
          </div>
        </div>
      </div>

      {/* Wellness Compact */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-2.5 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Sleep Quality
          </div>
          <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {data.avgSleepQuality}/10
          </div>
        </div>

        <div className={`p-2.5 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Avg Mood
          </div>
          <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {data.avgMood}/10
          </div>
        </div>
      </div>

      {/* Achievement Message - Compact */}
      <div
        className={`p-3 rounded-lg border ${isDark
            ? "bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-700/30"
            : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
          }`}
      >
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4
              className={`text-xs font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              {data.overallScore >= 80
                ? "🎉 Outstanding!"
                : data.overallScore >= 60
                  ? "💪 Strong Week!"
                  : data.overallScore >= 40
                    ? "📈 Keep Going!"
                    : "🌱 Fresh Start!"}
            </h4>
            <p
              className={`text-[10px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"
                }`}
            >
              {data.overallScore >= 80
                ? "Exceptional consistency! Keep it up."
                : data.overallScore >= 60
                  ? "Great progress. Focus on weak areas."
                  : data.overallScore >= 40
                    ? "Small steps lead to big results!"
                    : "Every journey starts somewhere. You got this!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactStatCard({
  icon,
  label,
  value,
  percentage,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentage: number;
  isDark: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span
          className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"
            }`}
        >
          {label}
        </span>
      </div>
      <div className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
        {value}
      </div>
      <div
        className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-slate-600" : "bg-slate-200"
          }`}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={`text-[9px] mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
        {percentage}% completion
      </div>
    </div>
  );
}