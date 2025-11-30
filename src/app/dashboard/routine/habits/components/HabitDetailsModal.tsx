// CREATE: src/app/dashboard/routine/habits/components/HabitDetailsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, Calendar, Flame, Award, Edit, Trash2, BarChart3 } from "lucide-react";
import type { HabitAnalytics, UpdateHabit } from "@/types/database";

interface HabitDetailsModalProps {
  habitId: string;
  onClose: () => void;
  onEdit: (habitId: string, updates: UpdateHabit) => Promise<any>;
  onDelete: () => Promise<void>;
  getAnalytics: (habitId: string) => Promise<HabitAnalytics | null>;
  isDark: boolean;
}

export default function HabitDetailsModal({
  habitId,
  onClose,
  onEdit,
  onDelete,
  getAnalytics,
  isDark,
}: HabitDetailsModalProps) {
  const [analytics, setAnalytics] = useState<HabitAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [habitId]);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getAnalytics(habitId);
    setAnalytics(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    await onDelete();
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`rounded-xl p-8 ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`rounded-xl p-8 ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>
            Failed to load analytics
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{analytics.habitName}</h2>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Detailed Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={<Flame className="w-6 h-6" />}
              label="Current Streak"
              value={`${analytics.currentStreak} days`}
              color="#F59E0B"
              isDark={isDark}
            />
            <StatBox
              icon={<Award className="w-6 h-6" />}
              label="Best Streak"
              value={`${analytics.bestStreak} days`}
              color="#8B5CF6"
              isDark={isDark}
            />
            <StatBox
              icon={<TrendingUp className="w-6 h-6" />}
              label="Completion Rate"
              value={`${analytics.completionRate}%`}
              color="#10B981"
              isDark={isDark}
            />
            <StatBox
              icon={<Calendar className="w-6 h-6" />}
              label="Total Days"
              value={`${analytics.completedDays}/${analytics.totalDays}`}
              color="#3B82F6"
              isDark={isDark}
            />
          </div>

          {/* Last 7 Days */}
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-slate-700/50 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Last 7 Days
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {analytics.last7Days.map((day, i) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("en-US", {
                  weekday: "short",
                });
                return (
                  <div key={i} className="text-center">
                    <div
                      className={`text-xs mb-2 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {dayName}
                    </div>
                    <div
                      className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition ${
                        day.completed
                          ? "bg-green-500"
                          : isDark
                          ? "bg-slate-600"
                          : "bg-slate-200"
                      }`}
                    >
                      {day.completed ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last 30 Days */}
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-slate-700/50 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Last 30 Days</h3>
            <div className="grid grid-cols-10 gap-1">
              {analytics.last30Days.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded transition ${
                    day.completed
                      ? "bg-green-500"
                      : isDark
                      ? "bg-slate-600"
                      : "bg-slate-200"
                  }`}
                  title={`${day.date}: ${day.completed ? "Completed" : "Missed"}`}
                />
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-slate-700/50 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Progress Overview</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Completion</span>
                  <span className="font-bold">{analytics.completionRate}%</span>
                </div>
                <div
                  className={`h-4 rounded-full overflow-hidden ${
                    isDark ? "bg-slate-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${analytics.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-slate-600" : "bg-white"
                  }`}
                >
                  <div className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Days Completed
                  </div>
                  <div className="text-2xl font-bold text-green-500 mt-1">
                    {analytics.completedDays}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-slate-600" : "bg-white"
                  }`}
                >
                  <div className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Days Missed
                  </div>
                  <div className="text-2xl font-bold text-red-500 mt-1">
                    {analytics.totalDays - analytics.completedDays}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                  : "bg-red-50 hover:bg-red-100 text-red-600"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Habit
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div
            className={`rounded-xl p-6 max-w-md mx-4 ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Delete Habit?</h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Are you sure you want to delete "{analytics.habitName}"? This action cannot be undone and will delete all history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value, color, isDark }: any) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color }}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}