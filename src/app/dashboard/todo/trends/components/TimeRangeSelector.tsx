// src/app/dashboard/todo/trends/components/TimeRangeSelector.tsx
"use client";

interface TimeRangeSelectorProps {
  selectedRange: 'daily' | 'weekly' | 'monthly';
  onRangeChange: (range: 'daily' | 'weekly' | 'monthly') => void;
  isDark: boolean;
}

export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  isDark,
}: TimeRangeSelectorProps) {
  const ranges: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div
      className={`inline-flex items-center rounded-lg border ${isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
        }`}
    >
      {ranges.map((range, index) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-4 py-2 text-sm font-medium transition ${selectedRange === range.value
              ? "bg-indigo-600 text-white"
              : isDark
                ? "text-slate-300 hover:bg-slate-700"
                : "text-slate-600 hover:bg-slate-50"
            } ${index === 0
              ? "rounded-l-lg"
              : index === ranges.length - 1
                ? "rounded-r-lg"
                : ""
            }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}