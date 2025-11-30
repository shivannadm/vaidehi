// src/app/dashboard/routine/progress/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/helpers"; // ✅ Already imported
import { useProgressData } from "./hooks/useProgressData";
import OverviewStats from "./components/OverviewStats";
import RoutineConsistency from "./components/RoutineConsistency";
import HealthTrends from "./components/HealthTrends";
import HabitHeatmap from "./components/HabitHeatmap";
import WeeklySummaryCard from "./components/WeeklySummary";
import InsightsPanel from "./components/InsightsPanel";
import WeeklyActivityTrend from "./components/WeeklyActivityTrend";
import { TrendingUp, Download, Camera, Loader2, FileJson, RefreshCw } from "lucide-react";
import {
  captureProgressScreenshot,
  generateProgressPDF,
  exportProgressJSON,
  type ProgressReportData,
} from "@/lib/utils/progressExportUtils";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [isDark, setIsDark] = useState(true);
  const [exporting, setExporting] = useState(false);

  const {
    overview,
    consistency,
    healthTrends,
    habitHeatmap,
    weeklySummary,
    loading,
    error,
    refreshData,
  } = useProgressData(userId);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        
        // ✅ FETCH USERNAME FROM PROFILE
        const { data: profile } = await getProfile(user.id);
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      } else {
        window.location.href = "/login";
      }
    };

    init();

    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleScreenshot = async () => {
    setExporting(true);
    try {
      await captureProgressScreenshot("progress-dashboard-content", {
        username: userName, // ✅ Now passes actual username
        appName: "VaiDehi Routine Tracker",
      });
    } catch (error) {
      console.error("Screenshot failed:", error);
      alert("Failed to capture screenshot");
    } finally {
      setExporting(false);
    }
  };

  const handlePDFExport = async () => {
    if (!overview || !weeklySummary) return;

    setExporting(true);
    try {
      const reportData: ProgressReportData = {
        username: userName, // ✅ Now passes actual username
        appName: "VaiDehi Routine Tracker",
        overview: {
          longestStreak: overview.longestOverallStreak,
          morningCompletionRate: overview.morningCompletionRate,
          eveningCompletionRate: overview.eveningCompletionRate,
          healthCompletionRate: overview.healthCompletionRate,
          habitCompletionRate: overview.habitCompletionRate,
          avgMeditationTime: overview.avgMeditationTime,
          avgExerciseTime: overview.avgExerciseTime,
          avgWellness: Math.round(
            ((overview.avgSleepQuality +
              overview.avgMoodRating +
              overview.avgEnergyLevel) /
              3) *
            10
          ),
          totalEntries:
            overview.totalMorningEntries +
            overview.totalEveningEntries +
            overview.totalHealthEntries,
        },
        weeklySummary: {
          weekStart: weeklySummary.weekStart,
          weekEnd: weeklySummary.weekEnd,
          morningDays: weeklySummary.morningDays,
          eveningDays: weeklySummary.eveningDays,
          healthDays: weeklySummary.healthDays,
          totalMeditationMinutes: weeklySummary.totalMeditationMinutes,
          totalExerciseMinutes: weeklySummary.totalExerciseMinutes,
          avgSleepQuality: weeklySummary.avgSleepQuality,
          avgMood: weeklySummary.avgMood,
          overallScore: weeklySummary.overallScore,
        },
      };

      await generateProgressPDF(reportData);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleJSONExport = () => {
    const exportData = {
      overview,
      consistency,
      healthTrends,
      habitHeatmap,
      weeklySummary,
      exportedAt: new Date().toISOString(),
    };
    exportProgressJSON(exportData);
  };

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="animate-pulse">
          <Loader2 className={`w-12 h-12 animate-spin ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
        </div>
      </div>
    );
  }

  if (error && !userId) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div
          className={`p-6 rounded-xl max-w-md w-full ${
            isDark
              ? "bg-red-900/20 border border-red-500/30"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className={`mb-4 ${isDark ? "text-red-300" : "text-red-700"}`}>
            Authentication required.{" "}
            <a href="/login" className="underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
          />
          <p
            className={`text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Analyzing your routine data...
          </p>
          <p
            className={`text-sm mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}
          >
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div
          className={`p-6 rounded-xl max-w-md w-full ${
            isDark
              ? "bg-red-900/20 border border-red-500/30"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className={`mb-4 ${isDark ? "text-red-300" : "text-red-700"}`}>
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="progress-dashboard-content"
      className={`min-h-screen p-4 lg:p-6 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="max-w-[1800px] mx-auto space-y-5">
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-500" />
              Routine Progress
            </h1>
            <p
              className={`text-xs lg:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Comprehensive analytics of your daily routines
            </p>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={refreshData}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
              } disabled:opacity-50`}
              title="Refresh data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleScreenshot}
              disabled={loading || exporting}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
              } disabled:opacity-50`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IMG</span>
            </button>

            <button
              onClick={handlePDFExport}
              disabled={loading || exporting || !overview}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } disabled:opacity-50`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleJSONExport}
              disabled={loading || !overview}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              } disabled:opacity-50`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
          </div>
        </div>

        {/* Overview Stats - Full Width */}
        {overview && <OverviewStats data={overview} isDark={isDark} />}

        {/* PERFECT 2-COLUMN LAYOUT - Fixed Alignment */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* LEFT COLUMN - 2 cols (66%) */}
          <div className="xl:col-span-2 space-y-5">
            {consistency.length > 0 && (
              <RoutineConsistency data={consistency} isDark={isDark} />
            )}

            {healthTrends.length > 0 && (
              <HealthTrends data={healthTrends} isDark={isDark} />
            )}

            {habitHeatmap.length > 0 && (
              <HabitHeatmap data={habitHeatmap} isDark={isDark} />
            )}
          </div>

          {/* RIGHT COLUMN - 1 col (33%) - Perfect Alignment */}
          <div className="xl:col-span-1 space-y-5">
            {weeklySummary && (
              <WeeklySummaryCard data={weeklySummary} isDark={isDark} />
            )}

            {overview && weeklySummary && (
              <InsightsPanel
                overview={overview}
                weeklySummary={weeklySummary}
                isDark={isDark}
              />
            )}

            {consistency.length > 0 && (
              <WeeklyActivityTrend data={consistency} isDark={isDark} />
            )}
          </div>
        </div>

        {/* Empty State */}
        {!overview && !loading && (
          <div
            className={`text-center py-12 lg:py-16 rounded-xl border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <TrendingUp
              className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`}
            />
            <h3
              className={`text-lg lg:text-xl font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              No Progress Data Yet
            </h3>
            <p
              className={`text-sm mb-4 px-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Start logging your routines to see analytics
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
              <a
                href="/dashboard/routine/morning"
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm font-medium"
              >
                Log Morning Routine
              </a>
              <a
                href="/dashboard/routine/evening"
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm font-medium"
              >
                Log Evening Routine
              </a>
            </div>
          </div>
        )}

        {/* Achievement Cards Footer */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Streak Achievement */}
            <div
              className={`p-5 rounded-xl border relative overflow-hidden group hover:scale-105 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700/50"
                  : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
              }`}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-10">🔥</div>
              <div className="relative">
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  Longest Streak
                </p>
                <p className="text-3xl font-bold mb-1">
                  {overview.longestOverallStreak}
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  consecutive days
                </p>
              </div>
            </div>

            {/* Total Entries */}
            <div
              className={`p-5 rounded-xl border relative overflow-hidden group hover:scale-105 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700/50"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
              }`}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-10">📝</div>
              <div className="relative">
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  Total Entries
                </p>
                <p className="text-3xl font-bold mb-1">
                  {overview.totalMorningEntries + overview.totalEveningEntries + overview.totalHealthEntries}
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  logged routines
                </p>
              </div>
            </div>

            {/* Wellness Score */}
            <div
              className={`p-5 rounded-xl border relative overflow-hidden group hover:scale-105 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              }`}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-10">💚</div>
              <div className="relative">
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                  Wellness Score
                </p>
                <p className="text-3xl font-bold mb-1">
                  {Math.round(((overview.avgSleepQuality + overview.avgMoodRating + overview.avgEnergyLevel) / 3) * 10)}/10
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  overall health
                </p>
              </div>
            </div>

            {/* Habit Completion */}
            <div
              className={`p-5 rounded-xl border relative overflow-hidden group hover:scale-105 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-700/50"
                  : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
              }`}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-10">🎯</div>
              <div className="relative">
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  Habit Success
                </p>
                <p className="text-3xl font-bold mb-1">
                  {overview.habitCompletionRate}%
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  completion rate
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}