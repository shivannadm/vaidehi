// src/app/dashboard/routine/progress/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProgressData } from "./hooks/useProgressData";
import OverviewStats from "./components/OverviewStats";
import RoutineConsistency from "./components/RoutineConsistency";
import HealthTrends from "./components/HealthTrends";
import HabitHeatmap from "./components/HabitHeatmap";
import WeeklySummaryCard from "./components/WeeklySummary";
import { TrendingUp, Download, Camera, Loader2, FileJson } from "lucide-react";
import {
  captureProgressScreenshot,
  generateProgressPDF,
  exportProgressJSON,
  type ProgressReportData,
} from "@/lib/utils/progressExportUtils";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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
      } else {
        window.location.href = "/login";
      }
    };

    init();

    // Real-time theme detection
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

  // Export handlers
  const handleScreenshot = async () => {
    setExporting(true);
    try {
      await captureProgressScreenshot("progress-dashboard-content", {
        username: "User", // Get from profile if available
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
        username: "User", // Get from profile
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
        className={`flex items-center justify-center h-screen ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <p className={isDark ? "text-white" : "text-slate-900"}>
          Loading Progress Dashboard...
        </p>
      </div>
    );
  }

  if (error && !userId) {
    return (
      <div
        className={`p-6 rounded-xl ${
          isDark
            ? "bg-red-900/20 border border-red-500/30"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <p className={isDark ? "text-red-300" : "text-red-700"}>
          Authentication required.{" "}
          <a href="/login" className="underline">
            Sign in
          </a>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Analyzing your routine data...
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
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
        className={`p-6 rounded-xl ${
          isDark
            ? "bg-red-900/20 border border-red-500/30"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <p className={isDark ? "text-red-300" : "text-red-700"}>
          Error: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="progress-dashboard-content"
      className={`min-h-screen p-6 ${
        isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <TrendingUp className="w-8 h-8 text-indigo-500" />
              Routine Progress
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Comprehensive analytics of your daily routines and habits
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleScreenshot}
              disabled={loading || exporting}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
              } disabled:opacity-50`}
              title="Save as image"
            >
              <Camera className="w-4 h-4" />
              Screenshot
            </button>

            <button
              onClick={handlePDFExport}
              disabled={loading || exporting || !overview}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } disabled:opacity-50`}
              title="Export PDF report"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={handleJSONExport}
              disabled={loading || !overview}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              } disabled:opacity-50`}
              title="Export raw data"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        {overview && <OverviewStats data={overview} isDark={isDark} />}

        {/* Weekly Summary */}
        {weeklySummary && (
          <WeeklySummaryCard data={weeklySummary} isDark={isDark} />
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Routine Consistency */}
          {consistency.length > 0 && (
            <div className="lg:col-span-2">
              <RoutineConsistency data={consistency} isDark={isDark} />
            </div>
          )}

          {/* Health Trends */}
          {healthTrends.length > 0 && (
            <HealthTrends data={healthTrends} isDark={isDark} />
          )}

          {/* Habit Heatmap */}
          {habitHeatmap.length > 0 && (
            <HabitHeatmap data={habitHeatmap} isDark={isDark} />
          )}
        </div>

        {/* Empty State */}
        {!overview && !loading && (
          <div
            className={`text-center py-16 rounded-xl border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <TrendingUp
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              No Progress Data Yet
            </h3>
            <p
              className={`text-sm mb-4 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Start logging your daily routines to see your progress here
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/dashboard/routine/morning"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                Log Morning Routine
              </a>
              <a
                href="/dashboard/routine/evening"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Log Evening Routine
              </a>
            </div>
          </div>
        )}

        {/* Insights Footer */}
        {overview && (
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
                : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              💡 Key Insights
            </h3>
            <ul
              className={`space-y-2 text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <li>
                • Your longest streak is{" "}
                <strong className="text-indigo-500">
                  {overview.longestOverallStreak} days
                </strong>{" "}
                - incredible consistency!
              </li>
              <li>
                • You've logged{" "}
                <strong className="text-indigo-500">
                  {overview.totalMorningEntries +
                    overview.totalEveningEntries +
                    overview.totalHealthEntries}
                </strong>{" "}
                total routine entries
              </li>
              <li>
                • Your average wellness score is{" "}
                <strong className="text-indigo-500">
                  {Math.round(
                    ((overview.avgSleepQuality +
                      overview.avgMoodRating +
                      overview.avgEnergyLevel) /
                      3) *
                      10
                  )}
                  /10
                </strong>{" "}
                - keep prioritizing self-care
              </li>
              <li>
                • You're tracking{" "}
                <strong className="text-indigo-500">
                  {overview.totalHabitsTracked} active habits
                </strong>{" "}
                with a{" "}
                <strong className="text-indigo-500">
                  {overview.habitCompletionRate}%
                </strong>{" "}
                completion rate
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}