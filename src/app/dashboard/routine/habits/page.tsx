// src/app/dashboard/routine/habits/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useHabits } from "./hooks/useHabits";
import HabitCard from "./components/HabitCard";
import AddHabitModal from "./components/AddHabitModal";
import HabitDetailsModal from "./components/HabitDetailsModal";
import HabitInsightsModal from "./components/HabitInsightsModal";
import WeeklyProgress from "./components/WeeklyProgress";
import { 
  Target, 
  Plus, 
  CheckCircle, 
  TrendingUp, 
  Flame, 
  Award,
  Calendar,
  BarChart3,
  Sparkles
} from "lucide-react";

export default function HabitsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const {
    habits,
    weeklyData,
    stats,
    loading,
    error,
    toggleHabitToday,
    addHabit,
    editHabit,
    removeHabit,
    refreshHabits,
    getAnalytics
  } = useHabits(userId);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else {
        window.location.href = '/login';
      }
    };

    init();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading Habits...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Loading your habits...
          </p>
        </div>
      </div>
    );
  }

  if (error && !userId) {
    return (
      <div className="p-4 sm:p-6">
        <div className={`p-4 sm:p-6 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
          <p className={isDark ? 'text-red-300' : 'text-red-700'}>
            Authentication required. <a href="/login" className="underline">Sign in</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
              Habit Tracker
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Build consistency, one day at a time
            </p>
          </div>
          
          {/* Action Buttons - Stack on Mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowInsightsModal(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium transition shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Life-Changing Insights</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Habit
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`p-3 sm:p-4 rounded-lg border text-sm ${
            isDark ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />}
            label="Today's Progress"
            value={`${stats.completedToday}/${stats.totalHabits}`}
            color="#10B981"
            isDark={isDark}
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />}
            label="Avg Completion"
            value={`${stats.avgCompletionRate}%`}
            color="#3B82F6"
            isDark={isDark}
          />
          <StatCard
            icon={<Flame className="w-4 h-4 sm:w-6 sm:h-6" />}
            label="Longest Streak"
            value={`${stats.longestStreak} days`}
            color="#F59E0B"
            isDark={isDark}
          />
          <StatCard
            icon={<Award className="w-4 h-4 sm:w-6 sm:h-6" />}
            label="Active Habits"
            value={stats.totalHabits}
            color="#A855F7"
            isDark={isDark}
          />
        </div>

        {/* Today's Habits */}
        <div className={`rounded-xl border p-4 sm:p-6 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            Today's Habits
          </h2>
          
          {habits.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Target className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                No habits yet
              </h3>
              <p className={`text-xs sm:text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Start building better habits by adding your first one
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowInsightsModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition font-medium text-sm"
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Get Ideas
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
                >
                  Add Your First Habit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleHabitToday(habit.id)}
                  onViewDetails={() => setSelectedHabitId(habit.id)}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        {habits.length > 0 && weeklyData && (
          <WeeklyProgress
            data={weeklyData}
            habits={habits}
            isDark={isDark}
          />
        )}

        {/* Monthly Overview */}
        {habits.length > 0 && (
          <div className={`rounded-xl border p-4 sm:p-6 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              Monthly Performance
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {habits.map(habit => {
                const percentage = habit.completion_rate;
                
                return (
                  <div key={habit.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl">{habit.icon}</span>
                        <span className="font-medium text-sm sm:text-base truncate">{habit.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold flex-shrink-0 ml-2" style={{ color: habit.color }}>
                        {percentage}%
                      </span>
                    </div>
                    <div className={`h-2.5 sm:h-3 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: habit.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {showAddModal && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onSave={async (habitData: any) => {
            const result = await addHabit(habitData);
            if (result) {
              setShowAddModal(false);
            }
          }}
          isDark={isDark}
        />
      )}

      {showInsightsModal && (
        <HabitInsightsModal
          onClose={() => setShowInsightsModal(false)}
          onAddHabit={async (habitData) => {
            const result = await addHabit(habitData);
            if (result) {
              // Modal stays open
            }
          }}
          isDark={isDark}
        />
      )}

      {selectedHabitId && (
        <HabitDetailsModal
          habitId={selectedHabitId}
          onClose={() => setSelectedHabitId(null)}
          onEdit={editHabit}
          onDelete={async () => {
            const success = await removeHabit(selectedHabitId);
            if (success) {
              setSelectedHabitId(null);
            }
          }}
          getAnalytics={getAnalytics}
          isDark={isDark}
        />
      )}
    </div>
  );
}

// Stat Card Component - Mobile Optimized
function StatCard({ icon, label, value, color, isDark }: any) {
  return (
    <div className={`rounded-xl border p-3 sm:p-4 transition-all hover:scale-105 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="p-2 sm:p-3 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[10px] sm:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
          </div>
          <div className="text-lg sm:text-2xl font-bold truncate" style={{ color }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}