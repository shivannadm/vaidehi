// ============================================
// FILE: src/app/dashboard/todo/trends/page.tsx
// ✅ FIXED: Better error handling for exports
// ============================================

"use client";

import { useState, useEffect } from "react";
import { Camera, FileDown, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/helpers";
import { captureFullPageScreenshot, generatePDFReport, type ReportData } from "@/lib/utils/exportUtils";
import StatsCards from "./components/StatsCards";
import PomodoroChart from "./components/PomodoroChart";
import FocusTimeChart from "./components/FocusTimeChart";
import ProjectDistribution from "./components/ProjectDistribution";
import FocusGoalCalendar from "./components/FocusGoalCalendar";
import { useTrendsData } from "./hooks/useTrendsData";
import { useTrendsFilters } from "./hooks/useTrendsFilters";

const APP_NAME = "VaiDehi Todo";

export default function TrendsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isDark, setIsDark] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // ✅ Toast notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  const {
    stats,
    sessions,
    focusData,
    projectDistribution,
    goalDays,
    loading,
    refreshData,
  } = useTrendsData(userId, timeRange, startDate, endDate, selectedYear, selectedMonth);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        const { data: profile } = await getProfile(user.id);
        setUserName(profile?.full_name || 'User');
      }
    };
    init();

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

  // ✅ Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ============================================
  // EXPORT HANDLERS (IMPROVED)
  // ============================================

  const handleScreenshot = async () => {
    setExporting(true);
    setNotification({ type: 'success', message: 'Capturing screenshot...' });
    
    try {
      await captureFullPageScreenshot('trends-dashboard-content', {
        username: userName,
        appName: APP_NAME,
      });
      
      setNotification({ 
        type: 'success', 
        message: '✅ Screenshot saved successfully!' 
      });
    } catch (error) {
      console.error('Screenshot failed:', error);
      setNotification({ 
        type: 'error', 
        message: '❌ Screenshot failed. Please try again.' 
      });
    } finally {
      setExporting(false);
    }
  };

  const handleReport = async () => {
    if (!stats || !projectDistribution) {
      setNotification({ 
        type: 'error', 
        message: 'Please wait for data to load' 
      });
      return;
    }

    setExporting(true);
    setNotification({ type: 'success', message: 'Generating PDF report...' });
    
    try {
      const projectsData = projectDistribution.map(p => ({
        name: p.projectName,
        daily: p.totalHours / 30,
        weekly: p.totalHours / 4,
        monthly: p.totalHours,
      }));

      const completedGoalDays = goalDays.filter(g => g.goalMet).length;
      const focusGoalData = goalDays.length > 0 ? {
        totalDays: goalDays.length,
        completedDays: completedGoalDays,
        rate: (completedGoalDays / goalDays.length) * 100,
      } : undefined;

      const reportData: ReportData = {
        username: userName,
        appName: APP_NAME,
        stats: {
          totalFocusTime: stats.totalFocusTime,
          weekFocusTime: stats.weekFocusTime,
          todayFocusTime: stats.todayFocusTime,
          totalCompletedTasks: stats.totalCompletedTasks,
          weekCompletedTasks: stats.weekCompletedTasks,
          todayCompletedTasks: stats.todayCompletedTasks,
        },
        projects: projectsData,
        focusGoal: focusGoalData,
      };

      await generatePDFReport(reportData);
      
      setNotification({ 
        type: 'success', 
        message: '✅ PDF report downloaded!' 
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      setNotification({ 
        type: 'error', 
        message: '❌ PDF generation failed. Please try again.' 
      });
    } finally {
      setExporting(false);
    }
  };

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
      {/* ✅ Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border ${
              notification.type === 'success'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-red-600 border-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div id="trends-dashboard-content" className="h-full overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

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

            {/* Export Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleScreenshot}
                disabled={exporting}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg ${
                  exporting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 active:scale-95'
                } bg-indigo-600 text-white hover:bg-indigo-700`}
                title="Save dashboard as image"
              >
                <Camera className="w-4 h-4" />
                {exporting ? 'Saving...' : 'Save'}
              </button>

              <button
                onClick={handleReport}
                disabled={exporting || !stats}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg ${
                  exporting || !stats
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 active:scale-95'
                } bg-emerald-600 text-white hover:bg-emerald-700`}
                title="Generate PDF report"
              >
                <FileDown className="w-4 h-4" />
                {exporting ? 'Generating...' : 'Report'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} isDark={isDark} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 h-[600px]">
              <PomodoroChart
                startDate={startDate}
                endDate={endDate}
                isDark={isDark}
              />
            </div>

            <div className="h-[600px]">
              <FocusTimeChart
                data={focusData}
                timeRange={timeRange}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProjectDistribution
              data={projectDistribution}
              isDark={isDark}
            />

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