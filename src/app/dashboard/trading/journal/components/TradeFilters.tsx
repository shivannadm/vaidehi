"use client";

import { Search } from "lucide-react";
import type { InstrumentType } from "@/types/database";

interface TradeFiltersProps {
  selectedInstrument: InstrumentType | "all";
  onInstrumentChange: (instrument: InstrumentType | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
}

const INSTRUMENTS: Array<{ value: InstrumentType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "stock", label: "Stock" },
  { value: "options", label: "Options" },
  { value: "futures", label: "Futures" },
  { value: "forex", label: "Forex" },
  { value: "commodity", label: "Commodity" },
  { value: "currency", label: "Currency" },
];

export default function TradeFilters({
  selectedInstrument,
  onInstrumentChange,
  searchQuery,
  onSearchChange,
  isDark,
}: TradeFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by symbol or setup..."
          className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDark
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
        />
      </div>

      {/* Instrument Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {INSTRUMENTS.map((instrument) => (
          <button
            key={instrument.value}
            onClick={() => onInstrumentChange(instrument.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              selectedInstrument === instrument.value
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {instrument.label}
          </button>
        ))}
      </div>
    </div>
  );
}