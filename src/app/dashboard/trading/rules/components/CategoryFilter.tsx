// src/app/dashboard/trading/rules/components/CategoryFilter.tsx
"use client";

import type { RuleCategory } from "@/types/database";
import { Shield, LogIn, LogOut, AlertTriangle, Brain, Clock } from "lucide-react";

interface CategoryFilterProps {
  selected: RuleCategory | "all";
  onSelect: (category: RuleCategory | "all") => void;
  isDark: boolean;
  counts: Record<RuleCategory | "all", number>;
}

const CATEGORIES: Array<{ value: RuleCategory | "all"; label: string; icon: React.ReactNode; shortLabel?: string }> = [
  { value: "all", label: "All Rules", shortLabel: "All", icon: <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
  { value: "entry", label: "Entry", icon: <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
  { value: "exit", label: "Exit", icon: <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
  { value: "risk_management", label: "Risk Management", shortLabel: "Risk", icon: <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
  { value: "psychology", label: "Psychology", shortLabel: "Psych", icon: <Brain className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
  { value: "time_management", label: "Time Management", shortLabel: "Time", icon: <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
];

export default function CategoryFilter({ selected, onSelect, isDark, counts }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.value;
        const count = counts[category.value] || 0;

        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {category.icon}
            {/* Show short label on mobile, full label on desktop */}
            <span className="hidden sm:inline">{category.label}</span>
            <span className="sm:hidden">{category.shortLabel || category.label}</span>
            <span
              className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-bold ${
                isSelected
                  ? "bg-white/20 text-white"
                  : isDark
                  ? "bg-slate-600 text-slate-300"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}