// CREATE: src/app/dashboard/routine/habits/components/HabitCard.tsx
"use client";

import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Flame, TrendingUp, Edit, Trash2 } from "lucide-react";
import type { HabitWithStats } from "@/types/database";

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle: () => void;
  onViewDetails: () => void;
  isDark: boolean;
}

export default function HabitCard({
  habit,
  onToggle,
  onViewDetails,
  isDark,
}: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCompleted = habit.today_completed;

  return (
    <div
      className={`rounded-lg border transition-all ${
        isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
      }`}
    >
      {/* Main Card Content */}
      <div className="p-4 flex items-center gap-4">
        {/* Completion Toggle */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
        >
          {isCompleted ? (
            <CheckCircle
              className="w-8 h-8 transition"
              style={{ color: habit.color }}
            />
          ) : (
            <Circle
              className={`w-8 h-8 transition ${
                isDark ? "text-slate-500 hover:text-slate-400" : "text-slate-300 hover:text-slate-400"
              }`}
            />
          )}
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          {habit.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold ${
                isCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {habit.name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDark ? "bg-slate-600" : "bg-slate-200"
              }`}
            >
              {habit.category}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span
              className={`flex items-center gap-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              {habit.current_streak} day streak
            </span>
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              {habit.completion_rate}% completion
            </span>
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg transition ${
            isDark ? "hover:bg-slate-600" : "hover:bg-slate-200"
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div
          className={`px-4 pb-4 border-t ${
            isDark ? "border-slate-600" : "border-slate-200"
          }`}
        >
          <div className="pt-4 space-y-4">
            {/* Description */}
            {habit.description && (
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {habit.description}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`p-3 rounded-lg ${
                  isDark ? "bg-slate-600/50" : "bg-white"
                }`}
              >
                <div className="text-xs opacity-70 mb-1">Current Streak</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: habit.color }}
                >
                  {habit.current_streak}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark ? "bg-slate-600/50" : "bg-white"
                }`}
              >
                <div className="text-xs opacity-70 mb-1">Best Streak</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: habit.color }}
                >
                  {habit.best_streak}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark ? "bg-slate-600/50" : "bg-white"
                }`}
              >
                <div className="text-xs opacity-70 mb-1">Success Rate</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: habit.color }}
                >
                  {habit.completion_rate}%
                </div>
              </div>
            </div>

            {/* This Week Progress */}
            <div>
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>This Week</span>
                <span className="text-xs opacity-70">
                  {habit.this_week_count}/{habit.target_count} days
                </span>
              </div>
              <div
                className={`h-3 rounded-full overflow-hidden ${
                  isDark ? "bg-slate-600" : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (habit.this_week_count / habit.target_count) * 100,
                      100
                    )}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onViewDetails}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  isDark
                    ? "bg-slate-600 hover:bg-slate-500 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}