// src/app/dashboard/todo/trends/components/StatsCards.tsx
"use client";

import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import type { TrendsStats } from "@/lib/supabase/trends-helpers";

interface StatsCardsProps {
  stats: TrendsStats | null;
  isDark: boolean;
}

export default function StatsCards({ stats, isDark }: StatsCardsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const cards = [
    {
      title: "Total Focus Time",
      value: stats ? formatTime(stats.totalFocusTime) : "0m",
      subtitle: `This week: ${stats ? formatTime(stats.weekFocusTime) : "0m"}`,
      icon: Clock,
      color: "from-red-500 to-orange-500",
      bgLight: "bg-red-50",
      bgDark: "bg-red-900/20",
      iconColor: "text-red-600",
    },
    {
      title: "Focus Time of This Week",
      value: stats ? formatTime(stats.weekFocusTime) : "0m",
      subtitle: `Today: ${stats ? formatTime(stats.todayFocusTime) : "0m"}`,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
      bgDark: "bg-orange-900/20",
      iconColor: "text-orange-600",
    },
    {
      title: "Focus Time of Today",
      value: stats ? formatTime(stats.todayFocusTime) : "0m",
      subtitle: `Goal progress`,
      icon: Clock,
      color: "from-red-500 to-orange-500",
      bgLight: "bg-red-50",
      bgDark: "bg-red-900/20",
      iconColor: "text-red-600",
    },
    {
      title: "Total Completed Tasks",
      value: stats?.totalCompletedTasks.toString() || "0",
      subtitle: `This week: ${stats?.weekCompletedTasks || 0}`,
      icon: CheckCircle2,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      bgDark: "bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      title: "Tasks Completed This Week",
      value: stats?.weekCompletedTasks.toString() || "0",
      subtitle: `Today: ${stats?.todayCompletedTasks || 0}`,
      icon: CheckCircle2,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      bgDark: "bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      title: "Tasks Completed Today",
      value: stats?.todayCompletedTasks.toString() || "0",
      subtitle: `Keep going!`,
      icon: CheckCircle2,
      color: "from-cyan-500 to-blue-500",
      bgLight: "bg-cyan-50",
      bgDark: "bg-cyan-900/20",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-xl border p-4 transition-all hover:shadow-lg ${
            isDark
              ? "bg-slate-800 border-slate-700 hover:border-slate-600"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          {/* Icon & Title */}
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-lg ${
                isDark ? card.bgDark : card.bgLight
              }`}
            >
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-xs font-medium mb-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {card.title}
          </h3>

          {/* Value */}
          <div className="mb-1">
            <div
              className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
            >
              {card.value}
            </div>
          </div>

          {/* Subtitle */}
          <p
            className={`text-xs ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}