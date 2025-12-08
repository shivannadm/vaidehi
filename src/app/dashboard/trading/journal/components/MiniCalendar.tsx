// src/app/dashboard/trading/journal/components/MiniCalendar.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TradeWithStrategy } from "@/types/database";

interface MiniCalendarProps {
  userId: string;
  trades: TradeWithStrategy[];
  isDark: boolean;
  onDateClick: (date: string) => void;
}

export default function MiniCalendar({ trades, isDark, onDateClick }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  // Get P&L for a specific date - FIX: Use local date string without timezone conversion
  const getPnLForDate = (date: Date) => {
    // Create date string in YYYY-MM-DD format WITHOUT timezone conversion
    const year = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    const dayTrades = trades.filter(t => t.entry_date === dateStr && t.is_closed);
    if (dayTrades.length === 0) return null;
    
    const totalPnl = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return totalPnl;
  };

  const getDateColor = (date: Date) => {
    if (!isCurrentMonth(date)) return "";
    
    const pnl = getPnLForDate(date);
    if (pnl === null) return "";
    
    if (pnl > 0) {
      // Profit - Green shades
      return isDark ? "bg-green-900/40 text-green-300" : "bg-green-100 text-green-700";
    } else if (pnl < 0) {
      // Loss - Red shades
      return isDark ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-700";
    }
    return "";
  };

  const handleDateClick = (date: Date) => {
    const pnl = getPnLForDate(date);
    if (pnl !== null && isCurrentMonth(date)) {
      // FIX: Create date string without timezone conversion
      const year = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      onDateClick(dateStr);
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${
      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {monthName}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className={`p-1 rounded transition ${
              isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <ChevronLeft className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
          </button>
          <button
            onClick={goToNextMonth}
            className={`p-1 rounded transition ${
              isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <ChevronRight className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateColor = getDateColor(date);
          const hasTrades = getPnLForDate(date) !== null;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!hasTrades || !isCurrentMonth(date)}
              className={`
                aspect-square rounded p-1 text-sm font-medium transition-all
                ${!isCurrentMonth(date) ? "opacity-30" : ""}
                ${isToday(date) ? "ring-2 ring-indigo-500" : ""}
                ${dateColor || (isDark ? "hover:bg-slate-700" : "hover:bg-slate-50")}
                ${isDark ? "text-white" : "text-slate-900"}
                ${!hasTrades && isCurrentMonth(date) ? "cursor-default" : "cursor-pointer"}
                disabled:cursor-not-allowed disabled:opacity-50
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`flex items-center gap-4 mt-4 pt-4 border-t text-xs ${
        isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-600"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${isDark ? "bg-green-900/40" : "bg-green-100"}`} />
          <span>Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${isDark ? "bg-red-900/40" : "bg-red-100"}`} />
          <span>Loss</span>
        </div>
      </div>
    </div>
  );
}