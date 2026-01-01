// src/app/dashboard/routine/progress/components/WeeklyActivityTrend.tsx
"use client";

import { TrendingUp, ArrowUp, ArrowDown, Minus, Trophy, AlertTriangle } from "lucide-react";
import type { RoutineConsistencyDay } from "@/lib/supabase/progress-helpers";

interface WeeklyActivityTrendProps {
  data: RoutineConsistencyDay[];
  isDark: boolean;
}

export default function WeeklyActivityTrend({ data, isDark }: WeeklyActivityTrendProps) {
  // Get last 7 days
  const last7Days = data.slice(-7);

  // Transform data
  const chartData = last7Days.map((day) => {
    const date = new Date(day.date);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      dayName: dayNames[date.getDay()],
      date: day.date,
      morning: day.morningCompleted ? 100 : 0,
      evening: day.eveningCompleted ? 100 : 0,
      health: day.healthCompleted ? 100 : 0,
      habits: day.habitsCompleted,
      overall: day.overallScore,
    };
  });

  // Calculate stats
  const currentWeekAvg = Math.round(
    chartData.reduce((sum, d) => sum + d.overall, 0) / chartData.length
  );

  const firstHalf = chartData.slice(0, 3);
  const secondHalf = chartData.slice(4, 7);
  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.overall, 0) / (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.overall, 0) / (secondHalf.length || 1);
  const trend = secondHalfAvg - firstHalfAvg;

  // Find best and worst days
  const bestDay = chartData.reduce((max, day) => (day.overall > max.overall ? day : max), chartData[0]);
  const worstDay = chartData.reduce((min, day) => (day.overall < min.overall ? day : min), chartData[0]);

  // Create smooth curve path
  const createSmoothPath = (dataKey: keyof typeof chartData[0], dataArray: typeof chartData) => {
    if (dataArray.length === 0) return "";

    const points = dataArray.map((d, i) => ({
      x: (i / (dataArray.length - 1)) * 100,
      y: 100 - (typeof d[dataKey] === 'number' ? d[dataKey] as number : 0),
    }));

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` Q ${controlX},${current.y} ${(current.x + next.x) / 2},${(current.y + next.y) / 2}`;
      path += ` Q ${controlX},${next.y} ${next.x},${next.y}`;
    }

    return path;
  };

  return (
    <div
      className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            7-Day Activity Trend
          </h3>
          <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
            Track your weekly routine patterns
          </p>
        </div>

        {/* Week Average */}
        <div className="text-right">
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Week Avg
          </div>
          <div className="text-xl font-bold text-indigo-500">{currentWeekAvg}%</div>
        </div>
      </div>

      {/* Chart Container with Proper Padding for Y-axis */}
      <div className="relative pl-6 pr-0 mb-3">
        {/* Y-axis labels - FIXED: Inside container with proper positioning */}
        <div className="absolute left-0 top-0 bottom-0 w-5 flex flex-col justify-between text-[9px] pt-1 pb-1">
          {[100, 75, 50, 25, 0].map((val) => (
            <span
              key={`y-${val}`}
              className={`${isDark ? "text-slate-500" : "text-slate-600"} text-right pr-1`}
            >
              {val}
            </span>
          ))}
        </div>

        {/* Smooth Area Chart */}
        <div className="relative h-56">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Gradients */}
              <linearGradient id="gradientMorning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="gradientEvening" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="gradientHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="gradientHabits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={`grid-${y}`}
                x1="0"
                y1={100 - y}
                x2="100"
                y2={100 - y}
                stroke={isDark ? "#334155" : "#E2E8F0"}
                strokeWidth="0.2"
                strokeDasharray="1,1"
              />
            ))}

            {/* Morning - Area with gradient */}
            <path
              d={`${createSmoothPath('morning', chartData)} L 100,100 L 0,100 Z`}
              fill="url(#gradientMorning)"
            />
            <path
              d={createSmoothPath('morning', chartData)}
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Evening - Area with gradient */}
            <path
              d={`${createSmoothPath('evening', chartData)} L 100,100 L 0,100 Z`}
              fill="url(#gradientEvening)"
            />
            <path
              d={createSmoothPath('evening', chartData)}
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Health - Area with gradient */}
            <path
              d={`${createSmoothPath('health', chartData)} L 100,100 L 0,100 Z`}
              fill="url(#gradientHealth)"
            />
            <path
              d={createSmoothPath('health', chartData)}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Habits - Area with gradient */}
            <path
              d={`${createSmoothPath('habits', chartData)} L 100,100 L 0,100 Z`}
              fill="url(#gradientHabits)"
            />
            <path
              d={createSmoothPath('habits', chartData)}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Dots */}
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100;
              return (
                <g key={`dots-${i}`}>
                  <circle cx={x} cy={100 - d.morning} r="1.5" fill="#F97316" />
                  <circle cx={x} cy={100 - d.evening} r="1.5" fill="#A855F7" />
                  <circle cx={x} cy={100 - d.health} r="1.5" fill="#EF4444" />
                  <circle cx={x} cy={100 - d.habits} r="1.5" fill="#3B82F6" />
                </g>
              );
            })}
          </svg>

          {/* X-axis labels - FIXED: Proper spacing */}
          <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] px-1">
            {chartData.map((d, i) => (
              <span key={`label-${i}`} className={isDark ? "text-slate-500" : "text-slate-600"}>
                {d.dayName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>Morning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>Evening</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>Health</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>Habits</span>
        </div>
      </div>

      {/* Best/Worst Days */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Best Day */}
        <div
          className={`p-3 rounded-lg border ${isDark
              ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50"
              : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-3 h-3 text-green-500" />
            <span className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Best Day
            </span>
          </div>
          <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {bestDay.dayName}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {bestDay.morning === 100 && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
            {bestDay.evening === 100 && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
            {bestDay.health === 100 && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            {bestDay.habits > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </div>
          <div className="text-lg font-bold text-green-500 mt-1">{bestDay.overall}%</div>
        </div>

        {/* Worst Day */}
        <div
          className={`p-3 rounded-lg border ${isDark
              ? "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-700/50"
              : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
            }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            <span className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Needs Focus
            </span>
          </div>
          <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {worstDay.dayName}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {worstDay.morning === 0 && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-30" />}
            {worstDay.evening === 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-30" />}
            {worstDay.health === 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-30" />}
          </div>
          <div className="text-lg font-bold text-orange-500 mt-1">{worstDay.overall}%</div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div
        className={`p-3 rounded-lg border ${isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {trend > 5 ? (
              <div className="p-1.5 rounded-lg bg-green-500/20">
                <ArrowUp className="w-3 h-3 text-green-500" />
              </div>
            ) : trend < -5 ? (
              <div className="p-1.5 rounded-lg bg-red-500/20">
                <ArrowDown className="w-3 h-3 text-red-500" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Minus className="w-3 h-3 text-blue-500" />
              </div>
            )}
            <div>
              <div className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {trend > 5
                  ? "📈 Improving Trend"
                  : trend < -5
                    ? "📉 Needs Attention"
                    : "➡️ Steady Progress"}
              </div>
              <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {trend > 5
                  ? "You're getting stronger!"
                  : trend < -5
                    ? "Let's turn this around"
                    : "Keep the consistency!"}
              </div>
            </div>
          </div>
          <div
            className={`text-base font-bold ${trend > 5 ? "text-green-500" : trend < -5 ? "text-red-500" : "text-blue-500"
              }`}
          >
            {trend > 0 ? "+" : ""}
            {trend.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className={`p-2 rounded-lg text-center ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {chartData.filter(d => d.overall >= 80).length}
          </div>
          <div className={`text-[9px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Great Days
          </div>
        </div>
        <div className={`p-2 rounded-lg text-center ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {chartData.filter(d => d.overall > 0).length}/{chartData.length}
          </div>
          <div className={`text-[9px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Active Days
          </div>
        </div>
        <div className={`p-2 rounded-lg text-center ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {Math.max(...chartData.map(d => d.overall)) - Math.min(...chartData.map(d => d.overall))}%
          </div>
          <div className={`text-[9px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Variance
          </div>
        </div>
      </div>
    </div>
  );
}