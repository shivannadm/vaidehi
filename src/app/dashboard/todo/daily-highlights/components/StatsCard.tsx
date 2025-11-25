// src/app/dashboard/todo/daily-highlights/components/StatsCard.tsx
"use client";

import { TrendingUp, Target, Flame } from "lucide-react";

interface StatsCardProps {
  streak: number;
  highlightCompleted: boolean;
  isDark: boolean;
}

export default function StatsCard({ streak, highlightCompleted, isDark }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-6 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <h3 className={`text-lg font-bold flex items-center gap-2 mb-6 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        Your Progress
      </h3>

      <div className="grid grid-cols-3 gap-4">
        
        {/* Current Streak */}
        <div className={`p-5 rounded-xl text-center ${
          isDark ? 'bg-slate-700' : 'bg-slate-50'
        }`}>
          <Flame className={`w-8 h-8 mx-auto mb-2 ${
            streak > 0 ? 'text-orange-500' : isDark ? 'text-slate-600' : 'text-slate-300'
          }`} />
          <div className={`text-3xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {streak}
          </div>
          <div className={`text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Day Streak
          </div>
        </div>

        {/* Today's Status */}
        <div className={`p-5 rounded-xl text-center ${
          highlightCompleted
            ? isDark
              ? 'bg-green-900/30'
              : 'bg-green-50'
            : isDark
              ? 'bg-slate-700'
              : 'bg-slate-50'
        }`}>
          <Target className={`w-8 h-8 mx-auto mb-2 ${
            highlightCompleted
              ? 'text-green-500'
              : isDark
                ? 'text-slate-600'
                : 'text-slate-300'
          }`} />
          <div className={`text-3xl font-bold mb-1 ${
            highlightCompleted
              ? 'text-green-500'
              : isDark
                ? 'text-white'
                : 'text-slate-900'
          }`}>
            {highlightCompleted ? '✓' : '—'}
          </div>
          <div className={`text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Today's Status
          </div>
        </div>

        {/* Motivation */}
        <div className={`p-5 rounded-xl text-center ${
          isDark ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'
        }`}>
          <div className="text-2xl mb-2">💪</div>
          <div className={`text-sm font-medium ${
            isDark ? 'text-indigo-300' : 'text-indigo-700'
          }`}>
            {highlightCompleted
              ? "Amazing work!"
              : streak > 0
                ? "Keep it going!"
                : "Start your streak!"}
          </div>
        </div>

      </div>

      {/* Streak Message */}
      {streak > 0 && (
        <div className={`mt-4 p-4 rounded-lg border-l-4 text-center ${
          isDark
            ? 'bg-orange-900/20 border-orange-500'
            : 'bg-orange-50 border-orange-400'
        }`}>
          <p className={`text-sm font-medium ${
            isDark ? 'text-orange-300' : 'text-orange-700'
          }`}>
            🔥 You're on a {streak}-day streak! Don't break the chain!
          </p>
        </div>
      )}
    </div>
  );
}