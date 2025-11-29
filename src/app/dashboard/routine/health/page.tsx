// src/app/dashboard/routine/health/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useHealthTracking } from "./hooks/useHealthTracking";
import HealthForm from "./components/HealthForm";
import { Heart, TrendingUp, Activity, Droplets, Moon, Brain, Flame } from "lucide-react";

export default function HealthPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(true);

  const { entry, updateField, saveEntry, saving, loading, error } = useHealthTracking(userId, selectedDate);

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

    // Real-time theme detection
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
      <div className={`flex items-center justify-center h-64 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading Health Tracker...</p>
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
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading your data...</p>
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

  // Calculate health score (simple average of key metrics)
  const healthScore = Math.round((
    (entry.sleep_quality || 7) +
    (entry.diet_quality || 7) +
    (entry.recovery_score || 7) +
    (entry.mood_rating || 7) +
    (10 - (entry.stress_level || 5))
  ) / 5);

  return (
    <div className={`space-y-6 p-6 max-w-7xl mx-auto space-y-5 ${isDark ? 'text-white bg-slate-900 min-h-screen' : 'text-slate-900 bg-slate-50 min-h-screen'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Health Tracking
            <Heart className="w-6 h-6 text-red-500" />
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive wellness monitoring
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Health Streak */}
          <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
            <Flame className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-bold text-lg">
              {(entry as any).health_streak || 1}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Day Streak
            </span>
          </div>
          <span className="text-sm opacity-75">{selectedDate.toDateString()}</span>
        </div>
      </div>

      {/* Health Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Health Score */}
        <div className={`p-6 rounded-xl border text-center ${
          isDark ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        }`}>
          <div className="text-5xl font-bold text-green-500 mb-2">
            {healthScore}
          </div>
          <div className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            Health Score
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Out of 10
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStat
          icon={<Moon className="w-6 h-6" />}
          label="Sleep"
          value={`${entry.sleep_quality || 7}/10`}
          color="blue"
          isDark={isDark}
        />
        <QuickStat
          icon={<Droplets className="w-6 h-6" />}
          label="Hydration"
          value={`${Math.floor((entry.water_intake || 0) / 250)}/8`}
          color="cyan"
          isDark={isDark}
        />
        <QuickStat
          icon={<Activity className="w-6 h-6" />}
          label="Active"
          value={`${entry.active_minutes || 0}m`}
          color="orange"
          isDark={isDark}
        />
        <QuickStat
          icon={<Brain className="w-6 h-6" />}
          label="Mood"
          value={`${entry.mood_rating || 7}/10`}
          color="purple"
          isDark={isDark}
        />
      </div>

      {/* Main Form */}
      <HealthForm
        entry={entry}
        onUpdate={updateField}
        onSave={saveEntry}
        saving={saving}
        isDark={isDark}
      />

      {/* Weekly Insights */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          Weekly Health Insights
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg Sleep</p>
            <p className="text-2xl font-bold mt-1">
              {entry.sleep_quality || 7}/10
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg Mood</p>
            <p className="text-2xl font-bold mt-1">
              {entry.mood_rating || 7}/10
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Active Days</p>
            <p className="text-2xl font-bold mt-1">
              {entry.active_minutes ? '5/7' : '0/7'}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Recovery</p>
            <p className="text-2xl font-bold mt-1">
              {entry.recovery_score || 7}/10
            </p>
          </div>
        </div>

        <p className={`text-xs mt-4 ${isDark ? 'opacity-70' : 'opacity-60'}`}>
          You're doing <span className="font-bold text-green-500">Excellent</span> · Keep up the healthy habits!
        </p>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, color, isDark }: any) {
  const colorMap: any = {
    blue: { bg: isDark ? '#1e3a8a20' : '#dbeafe', text: '#3b82f6', border: isDark ? '#1e40af' : '#93c5fd' },
    cyan: { bg: isDark ? '#164e6320' : '#cffafe', text: '#06b6d4', border: isDark ? '#0e7490' : '#67e8f9' },
    orange: { bg: isDark ? '#7c2d1220' : '#ffedd5', text: '#f97316', border: isDark ? '#9a3412' : '#fdba74' },
    purple: { bg: isDark ? '#581c8720' : '#e9d5ff', text: '#a855f7', border: isDark ? '#6b21a8' : '#c084fc' },
  };

  const colors = colorMap[color];

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: colors.text }}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </div>
    </div>
  );
}