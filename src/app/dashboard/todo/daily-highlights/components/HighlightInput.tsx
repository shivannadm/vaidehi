// src/app/dashboard/todo/daily-highlights/components/HighlightInput.tsx
"use client";

interface HighlightInputProps {
  value: string;
  onChange: (value: string) => void;
  isCompleted: boolean;
  isDark: boolean;
}

export default function HighlightInput({
  value,
  onChange,
  isCompleted,
  isDark
}: HighlightInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., Complete the trading dashboard UI design and implement responsive layouts"
      rows={4}
      className={`w-full px-5 py-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg ${
        isDark
          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
      } ${isCompleted ? 'line-through opacity-60' : ''}`}
      maxLength={500}
    />
  );
}