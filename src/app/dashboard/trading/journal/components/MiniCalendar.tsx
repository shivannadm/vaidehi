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
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

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

  // Get P&L for a specific date
  const getPnLForDate = (date: Date) => {
    const year = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const dayTrades = trades.filter(t => t.entry_date === dateStr && t.is_closed);
    if (dayTrades.length === 0) return null;

    const totalPnl = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return { pnl: totalPnl, tradeCount: dayTrades.length };
  };

  const getDateColor = (date: Date) => {
    if (!isCurrentMonth(date)) return "";

    const data = getPnLForDate(date);
    if (!data) return "";

    if (data.pnl > 0) {
      return isDark ? "bg-green-900/40 text-green-300" : "bg-green-100 text-green-700";
    } else if (data.pnl < 0) {
      return isDark ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-700";
    }
    return "";
  };

  const handleDateClick = (date: Date) => {
    const data = getPnLForDate(date);
    if (data && isCurrentMonth(date)) {
      const year = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      onDateClick(dateStr);
    }
  };

  const handleMouseEnter = (date: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    const data = getPnLForDate(date);
    if (!data || !isCurrentMonth(date)) return;

    const year = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    setHoveredDate(dateStr);

    // Calculate tooltip position
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const calendarContainer = button.closest('.calendar-container');
    const containerRect = calendarContainer?.getBoundingClientRect();

    if (containerRect) {
      // Position relative to calendar container
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top;
      setTooltipPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
    setTooltipPosition(null);
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPnL = (pnl: number) => {
    const prefix = pnl >= 0 ? '+' : '-';
    return `${prefix}₹${Math.abs(pnl).toFixed(2)}`;
  };

  return (
    <div className={`rounded-xl border p-4 relative calendar-container ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {monthName}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className={`p-1 rounded transition ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
          >
            <ChevronLeft className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
          </button>
          <button
            onClick={goToNextMonth}
            className={`p-1 rounded transition ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
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
            className={`text-center text-xs font-semibold py-2 ${isDark ? "text-slate-400" : "text-slate-600"
              }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 relative">
        {days.map((date, index) => {
          const dateColor = getDateColor(date);
          const data = getPnLForDate(date);
          const hasTrades = data !== null;
          const year = date.getFullYear();
          const monthStr = String(date.getMonth() + 1).padStart(2, '0');
          const dayStr = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${monthStr}-${dayStr}`;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              onMouseEnter={(e) => handleMouseEnter(date, e)}
              onMouseLeave={handleMouseLeave}
              disabled={!hasTrades || !isCurrentMonth(date)}
              className={`
                aspect-square rounded p-1 text-sm font-medium transition-all relative
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

        {/* Tooltip */}
        {hoveredDate && tooltipPosition && (() => {
          const data = getPnLForDate(new Date(hoveredDate));
          if (!data) return null;

          const isProfit = data.pnl >= 0;

          // Calculate if tooltip would overflow
          const tooltipWidth = 140; // approximate width
          const tooltipHeight = 70; // approximate height
          const containerWidth = 280; // approximate calendar width

          // Adjust position to prevent overflow
          let adjustedX = tooltipPosition.x;
          let adjustedY = tooltipPosition.y - tooltipHeight - 8;

          // If tooltip would go off right edge, shift it left
          if (adjustedX + tooltipWidth / 2 > containerWidth) {
            adjustedX = containerWidth - tooltipWidth / 2 - 8;
          }

          // If tooltip would go off left edge, shift it right
          if (adjustedX - tooltipWidth / 2 < 0) {
            adjustedX = tooltipWidth / 2 + 8;
          }

          // If tooltip would go above calendar, show below instead
          if (adjustedY < 0) {
            adjustedY = tooltipPosition.y + 40;
          }

          return (
            <div
              className={`absolute z-50 px-3 py-2 rounded-lg shadow-xl border pointer-events-none transition-opacity duration-200 ${isDark
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
                }`}
              style={{
                left: `${adjustedX}px`,
                top: `${adjustedY}px`,
                transform: 'translateX(-50%)',
                minWidth: '140px'
              }}
            >
              {/* Content */}
              <div className="relative z-10">
                <div className={`text-xs font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"
                  }`}>
                  {formatTooltipDate(hoveredDate)}
                </div>
                <div className={`text-lg font-bold ${isProfit
                  ? isDark ? "text-green-400" : "text-green-600"
                  : isDark ? "text-red-400" : "text-red-600"
                  }`}>
                  {formatPnL(data.pnl)}
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"
                  }`}>
                  {data.tradeCount} trade{data.tradeCount > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className={`flex items-center gap-4 mt-4 pt-4 border-t text-xs ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-600"
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