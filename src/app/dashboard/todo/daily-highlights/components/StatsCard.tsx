// src/app/dashboard/todo/daily-highlights/components/StatsCard.tsx
"use client";

import { TrendingUp, Target, Flame, Award } from "lucide-react";

interface StatsCardProps {
  streak: number;
  highlightCompleted: boolean;
  isDark: boolean;
}

export default function StatsCard({ streak, highlightCompleted, isDark }: StatsCardProps) {
  const getStreakLevel = () => {
    if (streak >= 30) return { emoji: "🏆", label: "Legend!", color: "from-yellow-500 to-orange-500" };
    if (streak >= 14) return { emoji: "💎", label: "Diamond!", color: "from-cyan-500 to-blue-500" };
    if (streak >= 7) return { emoji: "⭐", label: "Star!", color: "from-indigo-500 to-purple-500" };
    if (streak >= 3) return { emoji: "🔥", label: "Hot!", color: "from-orange-500 to-red-500" };
    return { emoji: "🌱", label: "Starting!", color: "from-green-500 to-emerald-500" };
  };

  const level = getStreakLevel();

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Current Streak - ENHANCED */}
        <div className={`p-5 rounded-xl text-center relative overflow-hidden ${
          streak > 0
            ? `bg-gradient-to-br ${level.color} bg-opacity-10`
            : isDark ? 'bg-slate-700' : 'bg-slate-50'
        }`}>
          {streak > 0 && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          )}
          <div className="relative z-10">
            <Flame className={`w-8 h-8 mx-auto mb-2 ${
              streak > 0 ? 'text-orange-500 animate-pulse' : isDark ? 'text-slate-600' : 'text-slate-300'
            }`} />
            <div className={`text-3xl font-bold mb-1 ${
              streak > 0 ? 'text-orange-500' : isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {streak}
            </div>
            <div className={`text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Day Streak
            </div>
            {streak > 0 && (
              <div className="mt-2 text-xs font-bold text-orange-500">
                {level.emoji} {level.label}
              </div>
            )}
          </div>
        </div>

        {/* Today's Status */}
        <div className={`p-5 rounded-xl text-center ${
          highlightCompleted
            ? isDark
              ? 'bg-green-900/30 border-2 border-green-700'
              : 'bg-green-50 border-2 border-green-300'
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
          <div className={`text-xs font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Today's Status
          </div>
        </div>

        {/* Level Badge */}
        <div className={`p-5 rounded-xl text-center ${
          isDark ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-br from-purple-50 to-pink-50'
        }`}>
          <Award className={`w-8 h-8 mx-auto mb-2 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <div className={`text-2xl font-bold mb-1 ${
            isDark ? 'text-purple-300' : 'text-purple-700'
          }`}>
            {streak >= 30 ? 'Pro' : streak >= 14 ? 'Expert' : streak >= 7 ? 'Rising' : 'Starter'}
          </div>
          <div className={`text-xs font-medium ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            Level
          </div>
        </div>

        {/* Motivation */}
        <div className={`p-5 rounded-xl text-center ${
          isDark ? 'bg-gradient-to-br from-indigo-900/50 to-blue-900/50' : 'bg-gradient-to-br from-indigo-50 to-blue-50'
        }`}>
          <div className="text-3xl mb-2">
            {highlightCompleted ? "🎉" : streak > 0 ? "💪" : "🚀"}
          </div>
          <div className={`text-sm font-bold ${
            isDark ? 'text-indigo-300' : 'text-indigo-700'
          }`}>
            {highlightCompleted
              ? "Amazing!"
              : streak >= 7
                ? "Keep going!"
                : "You got this!"}
          </div>
        </div>

      </div>

      {/* Streak Message */}
      {streak > 0 && (
        <div className={`mt-4 p-4 rounded-lg text-center relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-l-4 border-orange-500'
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400'
        }`}>
          <p className={`text-sm font-bold relative z-10 ${
            isDark ? 'text-orange-300' : 'text-orange-700'
          }`}>
            {streak >= 30
              ? "🏆 Incredible! 30+ day streak - You're unstoppable!"
              : streak >= 14
                ? "💎 Outstanding! 2 weeks strong - Keep the momentum!"
                : streak >= 7
                  ? "⭐ Awesome! A full week - You're building great habits!"
                  : `🔥 You're on a ${streak}-day streak! Don't break the chain!`
            }
          </p>
        </div>
      )}

      {/* First Day Encouragement */}
      {streak === 0 && !highlightCompleted && (
        <div className={`mt-4 p-4 rounded-lg text-center ${
          isDark
            ? 'bg-indigo-900/20 border border-indigo-700'
            : 'bg-indigo-50 border border-indigo-200'
        }`}>
          <p className={`text-sm font-medium ${
            isDark ? 'text-indigo-300' : 'text-indigo-700'
          }`}>
            ✨ Complete today's highlight to start your streak!
          </p>
        </div>
      )}
    </div>
  );
}