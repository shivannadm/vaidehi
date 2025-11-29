// src/app/dashboard/routine/morning/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMorningRoutine } from "./hooks/useMorningRoutine";
import MorningForm from "./components/MorningForm";
import { Heart, TrendingUp } from "lucide-react";

export default function MorningPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);

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

  // Initialize
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

    // ✅ FIXED: Real-time theme detection with MutationObserver
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    checkTheme();

    // Watch for theme changes in real-time
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading Morning Routine...</p>
      </div>
    );
  }

  if (error && !userId) {
    return (
      <div className={`p-6 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
        <p className={isDark ? 'text-red-300' : 'text-red-700'}>
          Authentication required. <a href="/login" className="underline">Sign in</a>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading your routine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
        <p className={isDark ? 'text-red-300' : 'text-red-700'}>Error: {error}</p>
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
    <div className={`space-y-6 p-6 max-w-7xl mx-auto space-y-5 ${isDark ? 'text-white bg-slate-900 min-h-screen' : 'text-slate-900 bg-slate-50 min-h-screen'}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Morning Routine
          <Heart className="w-6 h-6 text-pink-400" />
        </h1>

        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/30">
            <span className="text-orange-500 font-bold text-lg">
              {(entry as any).morning_streak || 1}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              Day Streak
            </span>
          </div>
          <span className="text-sm opacity-75">{selectedDate.toDateString()}</span>
        </div>
      </div>

      <MorningForm
        entry={entry}
        onUpdate={updateField}
        onSave={saveEntry}
        saving={saving}
        isDark={isDark}
      />

      {/* Quick Insights */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          This Week's Morning Insights
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg Wake Time</p>
            <p className="text-2xl font-bold mt-1">
              {entry.wake_time ? entry.wake_time.slice(0, 5) : '--:--'}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg Energy</p>
            <p className="text-2xl font-bold mt-1 flex items-center gap-2">
              {entry.energy_level || 5}/10
              {entry.energy_level && entry.energy_level >= 8 && ' High'}
              {entry.energy_level && entry.energy_level <= 4 && ' Low'}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Meditation</p>
            <p className="text-2xl font-bold mt-1">{entry.meditation_time || 0}m</p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Exercise</p>
            <p className="text-2xl font-bold mt-1">{entry.exercise_time || 0}m</p>
          </div>
        </div>

        <p className={`text-xs mt-4 ${isDark ? 'opacity-70' : 'opacity-60'}`}>
          You're doing <span className="font-bold text-orange-500">Great</span> · Keep going!
        </p>
      </div>
    </div>
  );
}