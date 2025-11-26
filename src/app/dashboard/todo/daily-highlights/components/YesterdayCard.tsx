// src/app/dashboard/todo/daily-highlights/components/YesterdayCard.tsx
"use client";

import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { formatDuration, type YesterdaySnapshot } from "@/types/database";

interface YesterdayCardProps {
  snapshot: YesterdaySnapshot | null;
  isDark: boolean;
}

export default function YesterdayCard({ snapshot, isDark }: YesterdayCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <h3 className={`text-lg font-bold flex items-center gap-2 mb-4 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        <Calendar className="w-5 h-5 text-blue-500" />
        Yesterday's Snapshot
      </h3>

      {snapshot ? (
        <div className="space-y-3">
          {/* Tasks Completed */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Tasks Completed
              </span>
            </div>
            <span className={`font-bold text-xl ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {snapshot.tasksCompleted}
            </span>
          </div>

          {/* Time Focused */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Time Focused
              </span>
            </div>
            <span className={`font-bold text-xl ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {formatDuration(snapshot.timeFocused)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📅</div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            No data from yesterday
          </p>
          <p className={`text-xs mt-2 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Complete tasks to see your progress
          </p>
        </div>
      )}
    </div>
  );
}