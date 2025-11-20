// src/app/dashboard/components/header/StreakCounter.tsx
"use client";

import { useState, useEffect } from "react";
import { getUserStreak, updateUserStreak } from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/client";

export default function StreakCounter() {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStreak();
    }, []);

    const loadStreak = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Update streak on page load (counts as activity)
            await updateUserStreak(user.id);

            // Get updated streak
            const { data, error } = await getUserStreak(user.id);

            if (error) {
                console.error("Error loading streak:", error);
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

    if (loading) {
        return (
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 animate-pulse">
                <span className="text-xl">🔥</span>
                <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-orange-600">-</span>
                    <span className="text-xs text-slate-600 font-medium">Streaks</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
            <span className="text-xl">🔥</span>
            <div className="flex items-center gap-1">
                <span className="text-base font-bold text-orange-600">{streak}</span>
                <span className="text-xs text-slate-600 font-medium">
                    {streak === 1 ? 'Streak' : 'Streaks'}
                </span>
            </div>
        </div>
    );
}