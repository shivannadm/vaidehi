// src/app/dashboard/todo/trends/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import StatsCards from "./components/StatsCards";
import PomodoroChart from "./components/PomodoroChart";
import FocusTimeChart from "./components/FocusTimeChart";
import ProjectDistribution from "./components/ProjectDistribution";
import FocusGoalCalendar from "./components/FocusGoalCalendar";
import TimeRangeSelector from "./components/TimeRangeSelector";
import { useTrendsData } from "./hooks/useTrendsData";
import { useTrendsFilters } from "./hooks/useTrendsFilters";

export default function TrendsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Initialize filters
  const {
    timeRange,
    setTimeRange,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    startDate,
    endDate,
  } = useTrendsFilters();

  // Fetch data
  const {
    stats,
    sessions,
    focusData,
    projectDistribution,
    goalDays,
    loading,
    refreshData,
  } = useTrendsData(userId, timeRange, startDate, endDate, selectedYear, selectedMonth);

  // Initialize
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    init();

    // Theme detection
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="h-full overflow-y-auto p-3">
        <div className="max-w-7xl mx-auto space-y-5 ">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                📊 Trends
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Analyze your productivity patterns and progress
              </p>
            </div>

            {/* Time Range Selector */}
            <TimeRangeSelector
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              isDark={isDark}
            />
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} isDark={isDark} />

          {/* Main Grid - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left Column - Pomodoro Chart (2 cols) */}
            <div className="lg:col-span-2 h-[600px]">
              <PomodoroChart
                startDate={startDate}
                endDate={endDate}
                isDark={isDark}
              />
            </div>

            {/* Right Column - Focus Time Chart */}
            <div className="h-[600px]">
              <FocusTimeChart
                data={focusData}
                timeRange={timeRange}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Bottom Grid - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Project Distribution */}
            <ProjectDistribution
              data={projectDistribution}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              isDark={isDark}
            />

            {/* Focus Goal Calendar */}
            <FocusGoalCalendar
              goalDays={goalDays}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              isDark={isDark}
            />
          </div>

        </div>
      </div>
    </div>
  );
}