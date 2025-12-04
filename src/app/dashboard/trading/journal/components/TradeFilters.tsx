// src/app/dashboard/trading/journal/components/TradeFilters.tsx
"use client";

import { Search } from "lucide-react";
import type { InstrumentType } from "@/types/database";

interface TradeFiltersProps {
  filterType: "all" | "open" | "closed";
  onFilterChange: (filter: "all" | "open" | "closed") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedInstrument: InstrumentType | "all";
  onInstrumentChange: (instrument: InstrumentType | "all") => void;
  isDark: boolean;
  counts: { all: number; open: number; closed: number };
}

const INSTRUMENTS: Array<{ value: InstrumentType | "all"; label: string }> = [
  { value: "all", label: "All Instruments" },
  { value: "stock", label: "Stocks" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
  { value: "forex", label: "Forex" },
];

export default function TradeFilters({
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedInstrument,
  onInstrumentChange,
  isDark,
  counts,
}: TradeFiltersProps) {
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
          <span>All Trades</span>
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
          onClick={() => onFilterChange("open")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "open"
              ? "bg-green-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>Open Trades</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "open"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.open}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("closed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            filterType === "closed"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : isDark
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>Closed Trades</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filterType === "closed"
                ? "bg-white/20 text-white"
                : isDark
                ? "bg-slate-600 text-slate-300"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {counts.closed}
          </span>
        </button>
      </div>

      {/* Search and Instrument Filter */}
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
            placeholder="Search by symbol or setup..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Instrument Filter */}
        <select
          value={selectedInstrument}
          onChange={(e) => onInstrumentChange(e.target.value as InstrumentType | "all")}
          className={`px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-white border-slate-300 text-slate-900"
          }`}
        >
          {INSTRUMENTS.map((instrument) => (
            <option key={instrument.value} value={instrument.value}>
              {instrument.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}