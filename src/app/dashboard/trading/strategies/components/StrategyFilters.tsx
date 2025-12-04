// src/app/dashboard/trading/strategies/components/StrategyFilters.tsx
"use client";

import { Search, Filter } from "lucide-react";
import type { StrategyStatus } from "@/types/database";

type FilterType = "all" | StrategyStatus;
type SortBy = "win_rate" | "total_pnl" | "total_trades" | "created_at";

interface StrategyFiltersProps {
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  isDark: boolean;
  counts: {
    all: number;
    active: number;
    testing: number;
    archived: number;
  };
}

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "win_rate", label: "Win Rate" },
  { value: "total_pnl", label: "Total P&L" },
  { value: "total_trades", label: "Total Trades" },
  { value: "created_at", label: "Date Created" },
];

export default function StrategyFilters({
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  isDark,
  counts,
}: StrategyFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onFilterChange("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "all"
              ? "bg-indigo-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>All Strategies</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "all"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "active"
              ? "bg-green-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>Active</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "active"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.active}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("testing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "testing"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>Testing</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "testing"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.testing}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("archived")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "archived"
              ? "bg-slate-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>Archived</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "archived"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.archived}
          </span>
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search strategies..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <Filter
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className={`pl-10 pr-8 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}