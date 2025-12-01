// src/app/dashboard/todo/trends/components/FocusGoalCalendar.tsx
// FIXED: Timezone issue - tasks now show on correct date
"use client";

import { useState } from "react";
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  // FIXED: Get goal data for a specific day - Now uses LOCAL timezone correctly
  const getGoalData = (day: number): GoalDayData | undefined => {
    // Create a date in LOCAL timezone for this day
    const localDate = new Date(selectedYear, selectedMonth, day);
    
    // Format as YYYY-MM-DD in LOCAL timezone (not UTC)
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(localDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    // Find matching goal day data
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

  // Get selected day info
  const selectedDayData = selectedDay ? getGoalData(selectedDay) : null;

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
            Day's Focus Time
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Click date for details
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
              Completed:
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
              Rate:
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
            className={`p-1 rounded hover:bg-slate-700 transition ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
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
            className={`p-1 rounded hover:bg-slate-700 transition ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
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
            const percentage = hasGoal 
              ? Math.min((goalData.hoursWorked / goalData.goalHours) * 100, 100)
              : 0;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square flex items-center justify-center relative cursor-pointer transition-all ${
                  selectedDay === day
                    ? isDark
                      ? "bg-slate-700"
                      : "bg-slate-100"
                    : isDark
                    ? "hover:bg-slate-700/50"
                    : "hover:bg-slate-50"
                } rounded-lg`}
              >
                {/* Circular Progress SVG */}
                {hasGoal && (
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    {/* Background Circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={isDark ? "#334155" : "#e2e8f0"}
                      strokeWidth="2"
                    />
                    
                    {/* Progress Circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={goalMet ? "#ef4444" : "#ff6900"}
                      strokeWidth="2.5"
                      strokeDasharray={`${percentage}, 100`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    
                    {/* Full Circle for 100% */}
                    {goalMet && (
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeDasharray="100, 100"
                      />
                    )}
                  </svg>
                )}
                
                {/* Day Number */}
                <span
                  className={`relative z-10 text-sm font-medium ${
                    hasGoal
                      ? isDark
                        ? "text-white"
                        : "text-slate-900"
                      : isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-red-500" />
            <span
              className={isDark ? "text-slate-400" : "text-slate-600"}
            >
              Goal Met
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-orange-500" />
            <span
              className={isDark ? "text-slate-400" : "text-slate-600"}
            >
              In Progress
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                isDark ? "border-slate-600" : "border-slate-300"
              }`}
            />
            <span
              className={isDark ? "text-slate-400" : "text-slate-600"}
            >
              No Goal
            </span>
          </div>
        </div>

        {/* Selected Day Info */}
        {selectedDayData && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              isDark
                ? "bg-slate-700 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  selectedDayData.goalMet
                    ? "bg-red-500/20 text-red-500"
                    : "bg-orange-500/20 text-orange-500"
                }`}
              >
                {selectedDayData.goalMet ? "✓ Goal Met" : "In Progress"}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span
                  className={isDark ? "text-slate-400" : "text-slate-600"}
                >
                  Hours Worked:
                </span>
                <span
                  className={`font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {selectedDayData.hoursWorked.toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDark ? "text-slate-400" : "text-slate-600"}
                >
                  Goal:
                </span>
                <span
                  className={`font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {selectedDayData.goalHours}h
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDark ? "text-slate-400" : "text-slate-600"}
                >
                  Progress:
                </span>
                <span
                  className={`font-bold ${
                    selectedDayData.goalMet
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                >
                  {Math.min(
                    (selectedDayData.hoursWorked / selectedDayData.goalHours) * 100,
                    100
                  ).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}