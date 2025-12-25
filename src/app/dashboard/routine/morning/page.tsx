// src/app/dashboard/routine/morning/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMorningRoutine } from "./hooks/useMorningRoutine";
import MorningForm from "./components/MorningForm";
import { Heart, TrendingUp, Menu, X } from "lucide-react";

export default function MorningPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);
  const [showInsights, setShowInsights] = useState(false);

  const { entry, updateField, saveEntry, saving, loading, error } = useMorningRoutine(userId, selectedDate);

  const handleSave = async () => {
    if (!userId) {
      alert("User not authenticated. Please refresh and try again.");
      return;
    }

    const success = await saveEntry();
    if (success) {
      console.log("Morning routine saved successfully!");
    }
  };

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
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
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
        <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading Morning Routine...</p>
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

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading your routine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className={`p-4 sm:p-6 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
          <p className={isDark ? 'text-red-300' : 'text-red-700'}>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'text-white bg-slate-900' : 'text-slate-900 bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            Morning Routine
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
          </h1>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {/* Streak Badge - Compact on Mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-orange-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange-500/30">
              <span className="text-orange-500 font-bold text-base sm:text-lg">
                {(entry as any).morning_streak || 1}
              </span>
              <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                Day Streak
              </span>
            </div>

            {/* Date - Hidden on very small screens, shown on sm+ */}
            <span className="hidden sm:inline text-sm opacity-75">
              {selectedDate.toDateString()}
            </span>

            {/* Mobile Insights Toggle */}
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="sm:hidden p-2 rounded-lg bg-indigo-600 text-white"
              aria-label="Toggle insights"
            >
              {showInsights ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Date Display for Mobile */}
        <div className="sm:hidden text-xs opacity-75">
          {selectedDate.toDateString()}
        </div>

        {/* Main Form */}
        <MorningForm
          entry={entry}
          onUpdate={updateField}
          onSave={saveEntry}
          saving={saving}
          isDark={isDark}
        />

        {/* Quick Insights - Desktop always visible, Mobile toggleable */}
        <div className={`${showInsights ? 'block' : 'hidden'} sm:block`}>
          <div className={`p-4 sm:p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              This Week's Morning Insights
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Wake Time</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {entry.wake_time ? entry.wake_time.slice(0, 5) : '--:--'}
                </p>
              </div>

              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Energy</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 flex items-center gap-1 sm:gap-2">
                  {entry.energy_level || 5}/10
                  {entry.energy_level && entry.energy_level >= 8 && <span className="text-sm sm:text-base">High</span>}
                  {entry.energy_level && entry.energy_level <= 4 && <span className="text-sm sm:text-base">Low</span>}
                </p>
              </div>

              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Meditation</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{entry.meditation_time || 0}m</p>
              </div>

              <div className={`p-3 sm:p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Exercise</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{entry.exercise_time || 0}m</p>
              </div>
            </div>

            <p className={`text-xs mt-4 ${isDark ? 'opacity-70' : 'opacity-60'}`}>
              You're doing <span className="font-bold text-orange-500">Great</span> · Keep going!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}