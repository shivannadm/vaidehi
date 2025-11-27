// src/app/dashboard/routine/morning/components/MorningForm.tsx
"use client";

import { Clock, Activity, Target, StickyNote, Heart } from "lucide-react"; // Fixed: Import Heart
import type { MorningRoutineEntry } from "@/types/database";

interface MorningFormProps {
    entry: Partial<MorningRoutineEntry>;
    onUpdate: <K extends keyof MorningRoutineEntry>(field: K, value: MorningRoutineEntry[K]) => void;
    onSave: () => Promise<boolean>; // Return success for UX
    saving: boolean;
    isDark: boolean;
}

export default function MorningForm({ entry, onUpdate, onSave, saving, isDark }: MorningFormProps) {
    const handleSave = async () => {
        const success = await onSave();
        if (success) {
            // Optional: Show toast (add later for UX)
            console.log('Morning routine saved!');
        }
    };

    return (
        <div className={`p-6 rounded-xl shadow-md transition ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
            }`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'
                }`}>Morning Routine Log</h2>

            {/* Wake Time */}
            <div className="mb-4">
                <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    Wake Time
                </label>
                <input
                    type="time"
                    value={entry.wake_time || ''}
                    onChange={(e) => onUpdate('wake_time' as keyof MorningRoutineEntry, e.target.value)}
                    className={`mt-1 w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'
                        }`}
                    disabled={saving}
                    placeholder="e.g., 07:30"
                />
            </div>

            {/* Meditation Time */}
            <div className="mb-4">
                <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    <Target className="w-4 h-4 flex-shrink-0" />
                    Meditation (minutes)
                </label>
                <input
                    type="number"
                    min={0}
                    value={entry.meditation_time || 0}
                    onChange={(e) => onUpdate('meditation_time' as keyof MorningRoutineEntry, parseInt(e.target.value) || 0)}
                    className={`mt-1 w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                    disabled={saving}
                />
            </div>

            {/* Exercise Time */}
            <div className="mb-4">
                <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    <Activity className="w-4 h-4 flex-shrink-0" />
                    Exercise (minutes)
                </label>
                <input
                    type="number"
                    min={0}
                    value={entry.exercise_time || 0}
                    onChange={(e) => onUpdate('exercise_time' as keyof MorningRoutineEntry, parseInt(e.target.value) || 0)}
                    className={`mt-1 w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                    disabled={saving}
                />
            </div>

            {/* BEAUTIFUL ENERGY SLIDER + LABELS */}
            <div className="mb-8">
                <label className={`flex items-center gap-2 text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Heart className="w-5 h-5 text-pink-500" />
                    Energy Level Today
                </label>

                <div className="relative">
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={entry.energy_level || 5}
                        onChange={(e) => onUpdate('energy_level' as keyof MorningRoutineEntry, parseInt(e.target.value))}
                        disabled={saving}
                        className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, 
          #ef4444 0%, 
          #f59e0b 30%, 
          #10b981 70%, 
          #10b981 100%)`
                        }}
                    />

                    {/* Custom Thumb - Premium Look */}
                    <style jsx>{`
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: 28px;
        width: 28px;
        border-radius: 50%;
        background: white;
        border: 4px solid #6366f1;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        cursor: grab;
        transition: all 0.2s;
      }
      input[type="range"]::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.1);
      }
      input[type="range"]::-moz-range-thumb {
        height: 28px;
        width: 28px;
        border-radius: 50%;
        background: white;
        border: 4px solid #6366f1;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
    `}</style>
                </div>

                {/* Energy Labels */}
                <div className="flex justify-between mt-3 text-xs">
                    <span className="text-red-500 font-medium">Exhausted</span>
                    <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {entry.energy_level || 5}
                    </span>
                    <span className="text-green-500 font-medium">Energized!</span>
                </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
                <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    <StickyNote className="w-4 h-4 flex-shrink-0" />
                    Notes
                </label>
                <textarea
                    value={entry.notes || ''}
                    onChange={(e) => onUpdate('notes' as keyof MorningRoutineEntry, e.target.value)}
                    rows={4}
                    className={`mt-1 w-full p-3 rounded-lg border resize-none transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'
                        }`}
                    disabled={saving}
                    placeholder="How do you feel today? Any intentions?"
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${saving
                    ? 'bg-indigo-500 cursor-not-allowed opacity-70'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white`}
            >
                {saving ? 'Saving...' : 'Save Morning Routine'}
            </button>
        </div>
    );
}