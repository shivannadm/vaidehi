// src/app/dashboard/todo/daily-highlights/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getDailyHighlight,
  getYesterdaySnapshot,
  upsertDailyHighlight,
  toggleHighlightCompletion,
  getHighlightStreak,
} from "@/lib/supabase/highlight-helpers";
import {
  formatDateToString,
  type YesterdaySnapshot,
  type HighlightReason,
} from "@/types/database";
import { Sparkles, CheckCircle2 } from "lucide-react";
import HighlightInput from "./components/HighlightInput";
import ReasonSelector from "./components/ReasonSelector";
import YesterdayCard from "./components/YesterdayCard";
import TomorrowCard from "./components/TomorrowCard";
import StatsCard from "./components/StatsCard";

export default function DailyHighlightsPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  // Data states
  const [yesterdaySnapshot, setYesterdaySnapshot] = useState<YesterdaySnapshot | null>(null);
  const [streak, setStreak] = useState<number>(0);

  // Form states
  const [highlightText, setHighlightText] = useState("");
  const [selectedReason, setSelectedReason] = useState<HighlightReason | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tomorrowText, setTomorrowText] = useState("");

  const today = formatDateToString(new Date());

  // Initialize
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        await loadAllData(user.id);
      }
      setLoading(false);
    };

    init();

    // Check theme
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

  const loadAllData = async (uid: string) => {
    try {
      const [highlightRes, snapshotRes, streakRes] = await Promise.all([
        getDailyHighlight(uid, today),
        getYesterdaySnapshot(uid),
        getHighlightStreak(uid),
      ]);

      if (highlightRes.data) {
        setHighlightText(highlightRes.data.highlight_text);
        setSelectedReason(highlightRes.data.selection_reason);
        setIsCompleted(highlightRes.data.highlight_completed);
        setTomorrowText(highlightRes.data.tomorrow_preview || "");
      }

      if (snapshotRes.data) {
        setYesterdaySnapshot(snapshotRes.data);
      }

      if (streakRes.data !== null) {
        setStreak(streakRes.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Auto-save highlight text
  useEffect(() => {
    if (!userId || !mounted || !highlightText.trim()) return;

    const timeout = setTimeout(async () => {
      try {
        await upsertDailyHighlight({
          user_id: userId,
          date: today,
          highlight_text: highlightText,
          highlight_completed: isCompleted,
          selection_reason: selectedReason,
          yesterday_reflection: yesterdaySnapshot?.reflection || null,
          tomorrow_preview: tomorrowText || null,
        });
      } catch (err) {
        console.error("Error saving highlight:", err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [highlightText, userId, mounted]);

  // Auto-save reason
  useEffect(() => {
    if (!userId || !mounted || !selectedReason || !highlightText.trim()) return;

    const save = async () => {
      try {
        await upsertDailyHighlight({
          user_id: userId,
          date: today,
          highlight_text: highlightText,
          highlight_completed: isCompleted,
          selection_reason: selectedReason,
          yesterday_reflection: yesterdaySnapshot?.reflection || null,
          tomorrow_preview: tomorrowText || null,
        });
      } catch (err) {
        console.error("Error saving reason:", err);
      }
    };

    save();
  }, [selectedReason, userId, mounted]);

  // Auto-save tomorrow preview
  useEffect(() => {
    if (!userId || !mounted) return;

    const timeout = setTimeout(async () => {
      if (!highlightText.trim()) return;

      try {
        await upsertDailyHighlight({
          user_id: userId,
          date: today,
          highlight_text: highlightText,
          highlight_completed: isCompleted,
          selection_reason: selectedReason,
          yesterday_reflection: yesterdaySnapshot?.reflection || null,
          tomorrow_preview: tomorrowText || null,
        });
      } catch (err) {
        console.error("Error saving tomorrow:", err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [tomorrowText, userId, mounted]);

  const handleToggleCompletion = async () => {
    if (!userId) return;

    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    try {
      await toggleHighlightCompletion(userId, today, newCompleted);

      // Reload streak if completed
      if (newCompleted) {
        const { data } = await getHighlightStreak(userId);
        if (data !== null) setStreak(data);
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
      setIsCompleted(!newCompleted);
    }
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Optimized Container - Fits Working Area */}
      <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">

          {/* Compact Header - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500" />
                Daily Highlights
              </h1>
              <p className={`mt-1 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Focus on the ONE thing that matters most today
              </p>
            </div>

            {/* Quick Streak Badge */}
            <div className={`px-4 py-2 rounded-lg border self-start sm:self-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="text-center">
                <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {streak}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  🔥 Streak
                </div>
              </div>
            </div>
          </div>

          {/* Main Highlight Card - Compact */}
          <div className={`rounded-xl border p-4 sm:p-5 md:p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                  🎯 Today's Highlight
                </h2>
                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  What's the ONE thing you want to accomplish?
                </p>
              </div>

              {/* Completion Toggle */}
              <button
                onClick={handleToggleCompletion}
                className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${isCompleted
                    ? 'bg-green-500/20 text-green-500 shadow-lg'
                    : isDark
                      ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? 'fill-green-500' : ''}`} />
              </button>
            </div>

            {/* Input Component */}
            <HighlightInput
              value={highlightText}
              onChange={setHighlightText}
              isCompleted={isCompleted}
              isDark={isDark}
            />

            {/* Reason Selector */}
            <div className="mt-5">
              <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                Why is this your highlight?
              </label>
              <ReasonSelector
                selectedReason={selectedReason}
                onSelect={setSelectedReason}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Two Column Layout - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <YesterdayCard snapshot={yesterdaySnapshot} isDark={isDark} />
            <TomorrowCard value={tomorrowText} onChange={setTomorrowText} isDark={isDark} />
          </div>

          {/* Stats Section */}
          <StatsCard streak={streak} highlightCompleted={isCompleted} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}