// src/app/dashboard/components/header/StreakCounter.tsx
"use client";

import { useState, useEffect } from "react";
import { getUserStreak, updateUserStreak } from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "@/types/database";

interface StreakCounterProps {
    theme: Theme;
}

export default function StreakCounter({ theme }: StreakCounterProps) {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStreak();
    }, []);

    const loadStreak = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Update streak on page load (counts as activity)
            await updateUserStreak(user.id);

            // Get updated streak
            const { data, error } = await getUserStreak(user.id);

            if (error) {
                console.error("Error loading streak:", error);
                setLoading(false);
                return;
            }

            if (data) {
                setStreak(data.current_streak);
            }
        } catch (error) {
            console.error("Error in loadStreak:", error);
        } finally {
            setLoading(false);
        }
    };

    const isLight = theme === 'light';

    if (loading) {
        return (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border animate-pulse ${isLight
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-orange-900/20 border-orange-800'
                }`}>
                <span className="text-xl">🔥</span>
                <div className="flex items-center gap-1">
                    <span className={`text-base font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'
                        }`}>-</span>
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'
                        }`}>Streaks</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${isLight
                ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                : 'bg-orange-900/15 border-orange-400/30 hover:bg-orange-900/30'
            }`}>
            <span className="text-xl">🔥</span>
            <div className="flex items-center gap-1">
                <span className={`text-base font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'
                    }`}>{streak}</span>
                <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                    {streak === 1 ? 'Streak' : 'Streaks'}
                </span>
            </div>
        </div>
    );
}