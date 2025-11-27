// src/app/dashboard/routine/morning/hooks/useMorningRoutine.ts
import { useState, useEffect } from "react";
import { getMorningEntryForDate, upsertMorningEntry } from "@/lib/supabase/routine-helpers";
import type { MorningRoutineEntry } from "@/types/database";
import { formatDateToString } from "@/types/database";

export function useMorningRoutine(userId: string | null, currentDate: Date) {
    const [entry, setEntry] = useState<Partial<MorningRoutineEntry>>({
        meditation_time: 0,
        exercise_time: 0,
        energy_level: 5,
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        const dateStr = formatDateToString(currentDate);
        loadEntry(userId, dateStr);
    }, [userId, currentDate]); // Depend on date for re-fetch

    const loadEntry = async (userId: string, date: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await getMorningEntryForDate(userId, date);
            if (fetchError && fetchError.message !== 'JSON object requested, multiple (or no) rows returned by a query') {
                setError(fetchError.message || 'Failed to load entry');
            } else {
                setEntry({
                    ...data,
                    meditation_time: data?.meditation_time ?? 0,
                    exercise_time: data?.exercise_time ?? 0,
                    energy_level: data?.energy_level ?? 5,
                    notes: data?.notes ?? '',
                });
            }
        } catch (err) {
            setError('Unexpected error loading entry');
        } finally {
            setLoading(false);
        }
    };

    // Fixed: Strict typing with generics to avoid 'any'
    const updateField = <K extends keyof MorningRoutineEntry>(field: K, value: MorningRoutineEntry[K]) => {
        setEntry(prev => ({ ...prev, [field]: value } as Partial<MorningRoutineEntry>));
    };

    const saveEntry = async () => {
        if (!userId || saving) return false;

        setSaving(true);
        setError(null);

        try {
            const dateStr = formatDateToString(currentDate);
            const yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = formatDateToString(yesterday);

            // Get yesterday's entry to calculate streak
            const { data: yesterdayEntry } = await getMorningEntryForDate(userId, yesterdayStr);

            let newStreak = 1;
            if (yesterdayEntry) {
                newStreak = ((yesterdayEntry as any).morning_streak || 1) + 1;
            }

            const fullEntry: any = {
                ...entry,
                user_id: userId,
                date: dateStr,
                updated_at: new Date().toISOString(),
                morning_streak: newStreak,  // ← This is your Morning-only streak
            };

            const { error: saveError } = await upsertMorningEntry(fullEntry);
            if (saveError) {
                setError(saveError.message || 'Failed to save');
                return false;
            }

            await loadEntry(userId, dateStr);
            return true;
        } catch (err) {
            setError('Network error');
            return false;
        } finally {
            setSaving(false);
        }
    };

    return { entry, loading, saving, error, updateField, saveEntry };
}