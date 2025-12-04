// src/app/dashboard/trading/quick-notes/components/NoteFilters.tsx
"use client";

import { Search, Sunrise, Sunset, Lightbulb, FileText } from "lucide-react";
import type { TradingNoteType } from "@/types/database";

type FilterType = "all" | TradingNoteType;

interface NoteFiltersProps {
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  counts: {
    all: number;
    pre_market: number;
    post_market: number;
    idea: number;
    general: number;
  };
}

const NOTE_TYPES: Array<{
  value: FilterType;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    value: "all",
    label: "All Notes",
    icon: <FileText className="w-4 h-4" />,
    color: "indigo",
  },
  {
    value: "pre_market",
    label: "Pre-Market",
    icon: <Sunrise className="w-4 h-4" />,
    color: "orange",
  },
  {
    value: "post_market",
    label: "Post-Market",
    icon: <Sunset className="w-4 h-4" />,
    color: "purple",
  },
  {
    value: "idea",
    label: "Ideas",
    icon: <Lightbulb className="w-4 h-4" />,
    color: "yellow",
  },
  {
    value: "general",
    label: "General",
    icon: <FileText className="w-4 h-4" />,
    color: "blue",
  },
];

export default function NoteFilters({
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isDark,
  counts,
}: NoteFiltersProps) {
  const getColorClasses = (color: string, isSelected: boolean) => {
    if (isSelected) {
      const colors: Record<string, string> = {
        indigo: "bg-indigo-600 text-white",
        orange: "bg-orange-600 text-white",
        purple: "bg-purple-600 text-white",
        yellow: "bg-yellow-600 text-white",
        blue: "bg-blue-600 text-white",
      };
      return colors[color];
    }

    return isDark
      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  return (
    <div className="space-y-4">
      {/* Type Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {NOTE_TYPES.map((type) => {
          const isSelected = filterType === type.value;
          const count = counts[type.value as keyof typeof counts] || 0;

          return (
            <button
              key={type.value}
              onClick={() => onFilterChange(type.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${getColorClasses(
                type.color,
                isSelected
              )} ${isSelected ? "shadow-lg scale-105" : ""}`}
            >
              {type.icon}
              <span>{type.label}</span>
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

      {/* Search Input */}
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
        />
      </div>
    </div>
  );
}