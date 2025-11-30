// src/app/dashboard/routine/progress/components/InsightsPanel.tsx
"use client";

import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Target } from "lucide-react";
import type { ProgressOverview, WeeklySummary } from "@/lib/supabase/progress-helpers";

interface InsightsPanelProps {
  overview: ProgressOverview;
  weeklySummary: WeeklySummary;
  isDark: boolean;
}

export default function InsightsPanel({
  overview,
  weeklySummary,
  isDark,
}: InsightsPanelProps) {
  // Calculate insights
  const insights = generateInsights(overview, weeklySummary);

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-2 flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <Brain className="w-5 h-5 text-purple-500" />
          AI-Powered Insights
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Personalized recommendations based on your data
        </p>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} isDark={isDark} />
        ))}
      </div>

      {/* Performance Score */}
      <div
        className={`mt-6 p-4 rounded-lg border ${
          isDark
            ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
            : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-sm font-medium ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Overall Performance Score
          </span>
          <span
            className={`text-2xl font-bold ${
              getScoreColor(insights.length >= 3 ? 85 : 65)
            }`}
          >
            {insights.length >= 3 ? "85" : "65"}%
          </span>
        </div>
        <div
          className={`h-3 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${insights.length >= 3 ? 85 : 65}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ insight, isDark }: any) {
  const getIcon = () => {
    switch (insight.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "improvement":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case "action":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      default:
        return <Target className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${
        isDark
          ? "bg-slate-700/50 border-slate-600 hover:border-slate-500"
          : "bg-slate-50 border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4
            className={`font-semibold mb-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {insight.title}
          </h4>
          <p
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {insight.message}
          </p>
          {insight.action && (
            <button
              className={`mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              }`}
            >
              {insight.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// AI-powered insight generation
function generateInsights(overview: ProgressOverview, weekly: WeeklySummary) {
  const insights: any[] = [];

  // Streak insights
  if (overview.longestOverallStreak >= 30) {
    insights.push({
      type: "success",
      title: "🔥 Incredible Consistency!",
      message: `You've maintained a ${overview.longestOverallStreak}-day streak. This level of discipline puts you in the top 5% of users.`,
    });
  } else if (overview.longestOverallStreak >= 7) {
    insights.push({
      type: "improvement",
      title: "📈 Building Momentum",
      message: `Your ${overview.longestOverallStreak}-day streak shows commitment. Aim for 30 days to build lasting habits.`,
      action: "Set 30-Day Goal",
    });
  } else {
    insights.push({
      type: "action",
      title: "🎯 Start Your Streak",
      message:
        "Consistency is key. Log your routines daily for 7 days to build momentum.",
      action: "Start Today",
    });
  }

  // Morning vs Evening balance
  const morningEvening = overview.morningCompletionRate - overview.eveningCompletionRate;
  if (Math.abs(morningEvening) > 20) {
    insights.push({
      type: "warning",
      title: "⚖️ Routine Imbalance Detected",
      message:
        morningEvening > 0
          ? "Your morning routine is stronger. Focus on evening consistency for better sleep."
          : "Your evening routine is strong. Morning routines boost productivity—prioritize them!",
      action: "Balance Routines",
    });
  }

  // Wellness score
  const wellness =
    (overview.avgSleepQuality + overview.avgMoodRating + overview.avgEnergyLevel) / 3;
  if (wellness >= 8) {
    insights.push({
      type: "success",
      title: "💪 Peak Wellness",
      message: `Your wellness score of ${wellness.toFixed(1)}/10 is outstanding. Keep prioritizing self-care.`,
    });
  } else if (wellness < 6) {
    insights.push({
      type: "warning",
      title: "🧘 Wellness Needs Attention",
      message: `Your wellness score is ${wellness.toFixed(1)}/10. Prioritize sleep, exercise, and stress management.`,
      action: "View Health Tips",
    });
  }

  // Habit completion
  if (overview.habitCompletionRate >= 80) {
    insights.push({
      type: "success",
      title: "🏆 Habit Mastery",
      message: `${overview.habitCompletionRate}% habit completion is exceptional. You're building a strong foundation.`,
    });
  } else if (overview.habitCompletionRate < 50) {
    insights.push({
      type: "action",
      title: "📊 Improve Habit Consistency",
      message: `At ${overview.habitCompletionRate}%, there's room to grow. Start with 2-3 core habits daily.`,
      action: "Review Habits",
    });
  }

  // Weekly performance
  if (weekly.overallScore >= 80) {
    insights.push({
      type: "success",
      title: "🌟 Outstanding Week",
      message: `This week's ${weekly.overallScore}% score reflects strong commitment across all routines.`,
    });
  }

  // Meditation & Exercise
  if (overview.avgMeditationTime < 5 && overview.avgExerciseTime < 15) {
    insights.push({
      type: "action",
      title: "🧘 Boost Mind & Body",
      message:
        "Low meditation and exercise time detected. Even 10 minutes daily makes a huge difference.",
      action: "Set Daily Goal",
    });
  }

  return insights.slice(0, 5); // Show top 5 insights
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}