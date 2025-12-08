// src/app/dashboard/routine/morning/components/MorningForm.tsx
"use client";

import { useState } from "react";
import { Clock, Activity, Target, StickyNote, Heart, Plus, X, Sunrise, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { MorningRoutineEntry } from "@/types/database";

interface MorningFormProps {
    entry: Partial<MorningRoutineEntry>;
    onUpdate: <K extends keyof MorningRoutineEntry>(
        field: K,
        value: MorningRoutineEntry[K]
    ) => void;
    onSave: () => Promise<boolean>;
    saving: boolean;
    isDark: boolean;
}

export default function MorningForm({
    entry,
    onUpdate,
    onSave,
    saving,
    isDark,
}: MorningFormProps) {
    const [newFieldName, setNewFieldName] = useState("");
    const [newFieldType, setNewFieldType] = useState<"text" | "number" | "boolean">("boolean");
    const [showCustomHabits, setShowCustomHabits] = useState(true);

    const handleSave = async () => {
        const success = await onSave();
        if (success) {
            console.log("Morning routine saved!");
        }
    };

    const addCustomField = () => {
        if (!newFieldName.trim()) return;

        const defaultValue =
            newFieldType === "boolean" ? false : newFieldType === "number" ? 0 : "";

        onUpdate("custom_fields", {
            ...(entry.custom_fields || {}),
            [newFieldName]: defaultValue,
        });

        setNewFieldName("");
    };

    const removeCustomField = (key: string) => {
        const { [key]: _, ...rest } = entry.custom_fields || {};
        onUpdate("custom_fields", rest);
    };

    const updateCustomField = (key: string, value: string | number | boolean) => {
        onUpdate("custom_fields", {
            ...(entry.custom_fields || {}),
            [key]: value,
        });
    };

    return (
        <div
            className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all ${isDark
                    ? "bg-slate-800/90 border border-slate-700"
                    : "bg-white border border-slate-200"
                }`}
        >
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 sm:mb-8 ${isDark ? "text-white" : "text-slate-900"}`}>
                Morning Routine Log
            </h2>

            {/* ===== DEFAULT FIELDS ===== */}
            <div className="space-y-5 sm:space-y-7 mb-8 sm:mb-10">
                {/* Wake Time */}
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        Wake Time
                    </label>
                    <input
                        type="time"
                        value={entry.wake_time || ""}
                        onChange={(e) => onUpdate("wake_time", e.target.value)}
                        disabled={saving}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                    />
                </div>

                {/* Meditation & Exercise - Stacked on mobile, side by side on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
                    {/* Meditation */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                            Meditation (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={entry.meditation_time || 0}
                            onChange={(e) => onUpdate("meditation_time", parseInt(e.target.value) || 0)}
                            disabled={saving}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                    ? "bg-slate-700/70 border-slate-600 text-white"
                                    : "bg-slate-50 border-slate-300 text-slate-900"
                                }`}
                        />
                    </div>

                    {/* Exercise */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                            Exercise (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={entry.exercise_time || 0}
                            onChange={(e) => onUpdate("exercise_time", parseInt(e.target.value) || 0)}
                            disabled={saving}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                    ? "bg-slate-700/70 border-slate-600 text-white"
                                    : "bg-slate-50 border-slate-300 text-slate-900"
                                }`}
                        />
                    </div>
                </div>

                {/* Energy Level Slider */}
                <div className="mb-6 sm:mb-8">
                    <label className={`flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                        Energy Level Today
                    </label>

                    <div className="relative px-1">
                        <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={entry.energy_level || 5}
                            onChange={(e) => onUpdate("energy_level", parseInt(e.target.value))}
                            disabled={saving}
                            className="w-full h-3 sm:h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 30%, #10b981 70%, #10b981 100%)`,
                            }}
                        />

                        <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                height: 28px;
                width: 28px;
                border-radius: 50%;
                background: white;
                border: 4px solid #6366f1;
                box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
                cursor: grab;
                transition: all 0.2s;
              }
              input[type="range"]::-webkit-slider-thumb:active {
                cursor: grabbing;
                transform: scale(1.15);
              }
              input[type="range"]::-moz-range-thumb {
                height: 28px;
                width: 28px;
                border-radius: 50%;
                background: white;
                border: 4px solid #6366f1;
                box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
              }
              @media (min-width: 640px) {
                input[type="range"]::-webkit-slider-thumb {
                  height: 32px;
                  width: 32px;
                  border: 5px solid #6366f1;
                }
                input[type="range"]::-moz-range-thumb {
                  height: 32px;
                  width: 32px;
                  border: 5px solid #6366f1;
                }
              }
            `}</style>
                    </div>

                    <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm font-medium px-1">
                        <span className="text-red-500">Exhausted</span>
                        <span className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {entry.energy_level || 5}
                        </span>
                        <span className="text-green-500">Energized!</span>
                    </div>
                </div>

                {/* 3 Things This Day Started With */}
                <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"}`}>
                    <h3 className={`font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>
                        <Sunrise className="w-4 h-4 sm:w-5 sm:h-5" />
                        3 Things This Day Started With
                    </h3>

                    <div className="space-y-2.5 sm:space-y-3">
                        <div className="relative">
                            <div className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3">
                                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-500"}`} />
                            </div>
                            <input
                                type="text"
                                value={(entry.custom_fields as any)?.morning_intention_1 || ""}
                                onChange={(e) => onUpdate("custom_fields", {
                                    ...(entry.custom_fields || {}),
                                    morning_intention_1: e.target.value
                                })}
                                placeholder="1. My main focus/intention..."
                                disabled={saving}
                                className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-indigo-500/50 ${isDark
                                        ? "bg-slate-800/70 border-slate-600 text-white placeholder-slate-400"
                                        : "bg-white border-indigo-200 text-slate-900 placeholder-indigo-400"
                                    }`}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3">
                                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-pink-400" : "text-pink-500"}`} />
                            </div>
                            <input
                                type="text"
                                value={(entry.custom_fields as any)?.morning_intention_2 || ""}
                                onChange={(e) => onUpdate("custom_fields", {
                                    ...(entry.custom_fields || {}),
                                    morning_intention_2: e.target.value
                                })}
                                placeholder="2. One person I want to connect with..."
                                disabled={saving}
                                className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-indigo-500/50 ${isDark
                                        ? "bg-slate-800/70 border-slate-600 text-white placeholder-slate-400"
                                        : "bg-white border-indigo-200 text-slate-900 placeholder-indigo-400"
                                    }`}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3">
                                <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
                            </div>
                            <input
                                type="text"
                                value={(entry.custom_fields as any)?.morning_intention_3 || ""}
                                onChange={(e) => onUpdate("custom_fields", {
                                    ...(entry.custom_fields || {}),
                                    morning_intention_3: e.target.value
                                })}
                                placeholder="3. Something that will make today great..."
                                disabled={saving}
                                className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-indigo-500/50 ${isDark
                                        ? "bg-slate-800/70 border-slate-600 text-white placeholder-slate-400"
                                        : "bg-white border-indigo-200 text-slate-900 placeholder-indigo-400"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CUSTOM FIELDS SECTION - Collapsible on Mobile ===== */}
            <div className={`border-t ${isDark ? "border-slate-700" : "border-slate-300"} pt-6 sm:pt-8`}>
                <button
                    onClick={() => setShowCustomHabits(!showCustomHabits)}
                    className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 mb-4 sm:mb-5"
                >
                    <h3 className={`text-base sm:text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Custom Habits
                    </h3>
                    {showCustomHabits ? <ChevronUp className="w-5 h-5 sm:hidden" /> : <ChevronDown className="w-5 h-5 sm:hidden" />}
                </button>

                <div className={`${showCustomHabits ? 'block' : 'hidden'} sm:block space-y-4 sm:space-y-5`}>
                    {Object.entries(entry.custom_fields || {}).filter(([key]) => 
                        !key.startsWith('morning_intention_')
                    ).length === 0 ? (
                        <p className={`text-center py-4 sm:py-6 ${isDark ? "text-slate-500" : "text-slate-400"} italic text-sm`}>
                            No custom habits yet. Add one below
                        </p>
                    ) : (
                        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                            {Object.entries(entry.custom_fields || {})
                                .filter(([key]) => !key.startsWith('morning_intention_'))
                                .map(([key, value]) => (
                                    <div
                                        key={key}
                                        className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${isDark ? "bg-slate-700/60" : "bg-slate-100"
                                            }`}
                                    >
                                        <span className={`font-medium text-sm sm:text-base truncate mr-3 ${isDark ? "text-white" : "text-slate-800"}`}>
                                            {key}
                                        </span>

                                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                            {typeof value === "boolean" ? (
                                                <button
                                                    onClick={() => updateCustomField(key, !value)}
                                                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition text-sm ${value
                                                            ? "bg-green-600 text-white"
                                                            : "bg-slate-600 text-slate-300"
                                                        }`}
                                                >
                                                    {value ? "Done" : "Not Yet"}
                                                </button>
                                            ) : (
                                                <input
                                                    type={typeof value === "number" ? "number" : "text"}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const val =
                                                            typeof value === "number"
                                                                ? parseFloat(e.target.value) || 0
                                                                : e.target.value;
                                                        updateCustomField(key, val);
                                                    }}
                                                    className={`w-20 sm:w-28 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-center font-medium text-sm ${isDark
                                                            ? "bg-slate-800 border-slate-600 text-white"
                                                            : "bg-white border-slate-300 text-slate-900"
                                                        }`}
                                                />
                                            )}

                                            <button
                                                onClick={() => removeCustomField(key)}
                                                className="text-red-400 hover:text-red-300 transition p-1"
                                            >
                                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Add New Field - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="text"
                            placeholder="e.g., Cold Shower, Gratitude"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addCustomField()}
                            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${isDark
                                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                                }`}
                        />
                        <div className="flex gap-2 sm:gap-3">
                            <select
                                value={newFieldType}
                                onChange={(e) => setNewFieldType(e.target.value as any)}
                                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${isDark
                                        ? "bg-slate-700 border-slate-600 text-white"
                                        : "bg-white border-slate-300 text-slate-900"
                                    }`}
                            >
                                <option value="boolean">Yes/No</option>
                                <option value="number">Number</option>
                                <option value="text">Text</option>
                            </select>
                            <button
                                onClick={addCustomField}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium flex items-center gap-2 transition text-sm sm:text-base whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== NOTES + SAVE ===== */}
            <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
                        Notes
                    </label>
                    <textarea
                        value={entry.notes || ""}
                        onChange={(e) => onUpdate("notes", e.target.value)}
                        rows={4}
                        placeholder="How do you feel today? Any intentions?"
                        disabled={saving}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border resize-none transition focus:ring-4 focus:ring-indigo-500/30 text-sm sm:text-base ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                            }`}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition transform hover:scale-105 active:scale-95 ${saving
                            ? "bg-indigo-500/70 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        } text-white shadow-lg`}
                >
                    {saving ? "Saving Your Morning..." : "Save Morning Routine"}
                </button>
            </div>
        </div>
    );
}