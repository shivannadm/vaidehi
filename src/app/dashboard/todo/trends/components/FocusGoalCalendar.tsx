// src/app/dashboard/todo/trends/components/FocusGoalCalendar.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GoalDayData } from "@/lib/supabase/trends-helpers";

interface FocusGoalCalendarProps {
  goalDays: GoalDayData[];
  selectedYear: number;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  isDark: boolean;
}

export default function FocusGoalCalendar({
  goalDays,
  selectedYear,
  selectedMonth,
  onMonthChange,
  onYearChange,
  isDark,
}: FocusGoalCalendarProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Generate calendar grid
  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day (0 = Monday, 6 = Sunday)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6; // Sunday becomes 6
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = generateCalendar();

  // Get goal data for a specific day
  const getGoalData = (day: number): GoalDayData | undefined => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return goalDays.find(g => g.date === dateStr);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  // Calculate stats
  const completedDays = goalDays.filter(g => g.goalMet).length;
  const totalGoalDays = goalDays.length;
  const completionRate = totalGoalDays > 0 ? (completedDays / totalGoalDays) * 100 : 0;

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Focus Time Goal
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Goal: 7H
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span
              className={`${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Focus Days:
            </span>
            <span
              className={`ml-1 font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {totalGoalDays} days
            </span>
          </div>
          <div>
            <span
              className={`${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Completed Goal Days:
            </span>
            <span
              className={`ml-1 font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {completedDays} days
            </span>
          </div>
          <div>
            <span
              className={`${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Goal Completion Rate:
            </span>
            <span
              className={`ml-1 font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {completionRate.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className={`p-1 rounded hover:bg-slate-700 transition`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {monthNames[selectedMonth]} {selectedYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className={`p-1 rounded hover:bg-slate-700 transition`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const goalData = getGoalData(day);
            const hasGoal = goalData !== undefined;
            const goalMet = goalData?.goalMet || false;

            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all ${
                  hasGoal && goalMet
                    ? "bg-red-500 text-white border-2 border-red-600 hover:bg-red-600"
                    : hasGoal
                    ? isDark
                      ? "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
                      : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                    : isDark
                    ? "text-slate-500 hover:bg-slate-700"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
                title={
                  goalData
                    ? `${goalData.hoursWorked.toFixed(1)}h / ${goalData.goalHours}h${
                        goalMet ? " ✓" : ""
                      }`
                    : "No data"
                }
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-600" />
            <span
              className={isDark ? "text-slate-400" : "text-slate-600"}
            >
              Goal Met
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-4 h-4 rounded-full border ${
                isDark
                  ? "bg-slate-700 border-slate-600"
                  : "bg-slate-100 border-slate-300"
              }`}
            />
            <span
              className={isDark ? "text-slate-400" : "text-slate-600"}
            >
              Goal Not Met
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}