// src/app/dashboard/routine/progress/components/HealthTrends.tsx
"use client";

import { Heart, TrendingUp } from "lucide-react";
import type { HealthTrendData } from "@/lib/supabase/progress-helpers";

interface HealthTrendsProps {
  data: HealthTrendData[];
  isDark: boolean;
}

export default function HealthTrends({ data, isDark }: HealthTrendsProps) {
  // Calculate averages
  const avgSleep =
    data.reduce((sum, d) => sum + d.sleepQuality, 0) / data.length;
  const avgMood = data.reduce((sum, d) => sum + d.moodRating, 0) / data.length;
  const avgEnergy =
    data.reduce((sum, d) => sum + d.energyLevel, 0) / data.length;
  const avgRecovery =
    data.reduce((sum, d) => sum + d.recoveryScore, 0) / data.length;

  // Get max value for scaling
  const maxValue = 10;

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
          <Heart className="w-5 h-5 text-red-500" />
          Health & Wellness Trends
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Track your daily health metrics over time
        </p>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-6">
        {/* Y-axis labels */}
        <div
          className={`absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs ${
            isDark ? "text-slate-500" : "text-slate-600"
          }`}
        >
          <div>10</div>
          <div>8</div>
          <div>6</div>
          <div>4</div>
          <div>2</div>
          <div>0</div>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 2, 4, 6, 8, 10].map((line) => (
              <div
                key={line}
                className={`absolute left-0 right-0 border-t ${
                  isDark ? "border-slate-700" : "border-slate-200"
                }`}
                style={{ bottom: `${(line / maxValue) * 100}%` }}
              />
            ))}
          </div>

          {/* Lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Sleep Quality */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${
                      100 - (d.sleepQuality / maxValue) * 100
                    }%`
                )
                .join(" ")}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="transition-all"
            />

            {/* Mood */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${
                      100 - (d.moodRating / maxValue) * 100
                    }%`
                )
                .join(" ")}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              className="transition-all"
            />

            {/* Energy */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${
                      100 - (d.energyLevel / maxValue) * 100
                    }%`
                )
                .join(" ")}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              className="transition-all"
            />

            {/* Recovery */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${
                      100 - (d.recoveryScore / maxValue) * 100
                    }%`
                )
                .join(" ")}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              className="transition-all"
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Sleep Quality"
          value={avgSleep.toFixed(1)}
          color="#3B82F6"
          isDark={isDark}
        />
        <MetricCard
          label="Mood"
          value={avgMood.toFixed(1)}
          color="#10B981"
          isDark={isDark}
        />
        <MetricCard
          label="Energy"
          value={avgEnergy.toFixed(1)}
          color="#F59E0B"
          isDark={isDark}
        />
        <MetricCard
          label="Recovery"
          value={avgRecovery.toFixed(1)}
          color="#8B5CF6"
          isDark={isDark}
        />
      </div>

      {/* Insights */}
      <div
        className={`mt-6 p-4 rounded-lg border ${
          isDark
            ? "bg-slate-700/50 border-slate-600"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4
              className={`font-semibold mb-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Health Insights
            </h4>
            <p
              className={`text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {avgSleep >= 7 && avgMood >= 7 && avgEnergy >= 7
                ? "🌟 Excellent! Your health metrics are consistently strong. Keep up the great work!"
                : avgSleep >= 6 && avgMood >= 6 && avgEnergy >= 6
                ? "💪 Good progress! Focus on maintaining consistency in your routines."
                : "💡 Your body needs attention. Prioritize sleep, stress management, and regular exercise."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  isDark,
}: {
  label: string;
  value: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className={`text-xs font-medium ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {label}
        </div>
      </div>
      <div
        className={`text-xl font-bold ${
          isDark ? "text-white" : "text-slate-900"
        }`}
        style={{ color }}
      >
        {value}/10
      </div>
    </div>
  );
}