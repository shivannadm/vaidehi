// src/app/dashboard/todo/daily-highlights/components/ReasonSelector.tsx
"use client";

import { HIGHLIGHT_REASONS, type HighlightReason } from "@/types/database";

interface ReasonSelectorProps {
  selectedReason: HighlightReason | null;
  onSelect: (reason: HighlightReason) => void;
  isDark: boolean;
}

export default function ReasonSelector({
  selectedReason,
  onSelect,
  isDark
}: ReasonSelectorProps) {
  const reasons: HighlightReason[] = ['urgency', 'satisfaction', 'joy'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {reasons.map((reason) => {
        const config = HIGHLIGHT_REASONS[reason];
        const isSelected = selectedReason === reason;

        return (
          <button
            key={reason}
            onClick={() => onSelect(reason)}
            type="button"
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
              isSelected
                ? 'border-indigo-500 shadow-lg scale-105'
                : isDark
                  ? 'border-slate-600 hover:border-slate-500'
                  : 'border-slate-200 hover:border-slate-300'
            }`}
            style={{
              backgroundColor: isSelected
                ? isDark
                  ? config.darkBg + '40'
                  : config.lightBg
                : 'transparent',
            }}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">{config.icon}</div>
              <div
                className={`font-semibold mb-1 text-sm ${
                  isSelected
                    ? isDark
                      ? config.darkText
                      : config.lightText
                    : isDark
                      ? 'text-white'
                      : 'text-slate-900'
                }`}
              >
                {config.label}
              </div>
              <div
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {config.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}