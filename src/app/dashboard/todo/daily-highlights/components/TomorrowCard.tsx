// src/app/dashboard/todo/daily-highlights/components/TomorrowCard.tsx
"use client";

import { Sunrise } from "lucide-react";

interface TomorrowCardProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

export default function TomorrowCard({ value, onChange, isDark }: TomorrowCardProps) {
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'
        }`}>
        <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
        Tomorrow's Preview
      </h3>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What will be your highlight tomorrow?"
        rows={3}
        className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${isDark
            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
          }`}
        maxLength={300}
      />

      <div className="flex items-center justify-between mt-2">
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
          Set your intention before you end today
        </p>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
          {value.length}/300
        </span>
      </div>
    </div>
  );
}