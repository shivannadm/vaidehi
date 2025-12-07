// src/app/dashboard/trading/journal/components/TradeCalendar.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTradesGroupedByDate } from "@/lib/supabase/trading-helpers";
import type { TradesByDate } from "@/lib/supabase/trading-helpers";

interface TradeCalendarProps {
  userId: string;
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  isDark: boolean;
}

export default function TradeCalendar({ userId, onDateSelect, selectedDate, isDark }: TradeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tradesData, setTradesData] = useState<TradesByDate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trades for current month
  useEffect(() => {
    const fetchTrades = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      setLoading(true);
      const { data } = await getTradesGroupedByDate(userId, startDate, endDate);
      setTradesData(data || []);
      setLoading(false);
    };

    if (userId) {
      fetchTrades();
    }
  }, [userId, currentMonth]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
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

    return days;
  };

  const days = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const getTradeCountForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = tradesData.find(d => d.date === dateStr);
    return dayData ? dayData.trades.length : 0;
  };

  const getPnLForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = tradesData.find(d => d.date === dateStr);
    return dayData ? dayData.total_pnl : 0;
  };

  return (
    <div className={`rounded-xl border p-4 md:p-6 ${
      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {monthName}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
              isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className={`text-center text-xs md:text-sm font-semibold py-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((date, index) => {
          const tradeCount = getTradeCountForDate(date);
          const pnl = getPnLForDate(date);
          const hasProfit = pnl > 0;
          const hasLoss = pnl < 0;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date.toISOString().split('T')[0])}
              disabled={!isCurrentMonth(date) || tradeCount === 0}
              className={`
                relative aspect-square rounded-lg p-1 md:p-2 text-sm transition-all
                ${!isCurrentMonth(date) ? "opacity-40" : ""}
                ${isToday(date) ? (isDark ? "ring-2 ring-indigo-500" : "ring-2 ring-indigo-400") : ""}
                ${isSelected(date) ? "bg-indigo-600 text-white" : ""}
                ${!isSelected(date) && tradeCount > 0 ? (
                  isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"
                ) : ""}
                ${!isSelected(date) && tradeCount === 0 ? (
                  isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                ) : ""}
                ${isDark ? "text-white" : "text-slate-900"}
                disabled:cursor-not-allowed disabled:hover:bg-transparent
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs md:text-sm font-semibold">{date.getDate()}</span>
                
                {tradeCount > 0 && (
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    <div className={`text-xs font-medium ${
                      isSelected(date) ? "text-white" : isDark ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {tradeCount}
                    </div>
                    {(hasProfit || hasLoss) && (
                      <div className={`w-1 h-1 rounded-full ${
                        hasProfit ? "bg-green-500" : "bg-red-500"
                      }`} />
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`flex flex-wrap items-center gap-4 mt-4 pt-4 border-t text-xs ${
        isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-600"
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Profitable Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Loss Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ring-2 ${isDark ? "ring-indigo-500" : "ring-indigo-400"}`} />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}