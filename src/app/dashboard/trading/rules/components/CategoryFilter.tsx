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

const CATEGORIES: Array<{ value: RuleCategory | "all"; label: string; icon: React.ReactNode }> = [
  { value: "all", label: "All Rules", icon: <Shield className="w-4 h-4" /> },
  { value: "entry", label: "Entry", icon: <LogIn className="w-4 h-4" /> },
  { value: "exit", label: "Exit", icon: <LogOut className="w-4 h-4" /> },
  { value: "risk_management", label: "Risk", icon: <AlertTriangle className="w-4 h-4" /> },
  { value: "psychology", label: "Psychology", icon: <Brain className="w-4 h-4" /> },
  { value: "time_management", label: "Time", icon: <Clock className="w-4 h-4" /> },
];

export default function CategoryFilter({ selected, onSelect, isDark, counts }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.value;
        const count = counts[category.value] || 0;

        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              isSelected
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {category.icon}
            <span>{category.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
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