// src/app/dashboard/routine/morning/components/MorningForm.tsx
"use client";

import { useState } from "react";
import { Clock, Activity, Target, StickyNote, Heart, Plus, X } from "lucide-react";
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
            className={`p-6 rounded-xl shadow-lg transition-all ${isDark
                    ? "bg-slate-800/90 border border-slate-700"
                    : "bg-white border border-slate-200"
                }`}
        >
            <h2 className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-slate-900"}`}>
                Morning Routine Log
            </h2>

            {/* ===== DEFAULT FIELDS ===== */}
            <div className="space-y-7 mb-10">
                {/* Wake Time */}
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <Clock className="w-5 h-5" />
                        Wake Time
                    </label>
                    <input
                        type="time"
                        value={entry.wake_time || ""}
                        onChange={(e) => onUpdate("wake_time", e.target.value)}
                        disabled={saving}
                        className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                    />
                </div>

                {/* Meditation */}
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <Target className="w-5 h-5" />
                        Meditation (minutes)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={entry.meditation_time || 0}
                        onChange={(e) => onUpdate("meditation_time", parseInt(e.target.value) || 0)}
                        disabled={saving}
                        className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                    />
                </div>

                {/* Exercise */}
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <Activity className="w-5 h-5" />
                        Exercise (minutes)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={entry.exercise_time || 0}
                        onChange={(e) => onUpdate("exercise_time", parseInt(e.target.value) || 0)}
                        disabled={saving}
                        className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                    />
                </div>

                {/* Energy Level — PREMIUM SLIDER */}
                <div className="mb-8">
                    <label className={`flex items-center gap-3 text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        <Heart className="w-6 h-6 text-pink-500" />
                        Energy Level Today
                    </label>

                    <div className="relative">
                        <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={entry.energy_level || 5}
                            onChange={(e) => onUpdate("energy_level", parseInt(e.target.value))}
                            disabled={saving}
                            className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 30%, #10b981 70%, #10b981 100%)`,
                            }}
                        />

                        <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                height: 32px;
                width: 32px;
                border-radius: 50%;
                background: white;
                border: 5px solid #6366f1;
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
                cursor: grab;
                transition: all 0.2s;
              }
              input[type="range"]::-webkit-slider-thumb:active {
                cursor: grabbing;
                transform: scale(1.15);
              }
              input[type="range"]::-moz-range-thumb {
                height: 32px;
                width:32px;
                border-radius:50%;
                background:white;
                border:5px solid #6366f1;
                box-shadow:0 6px 20px rgba(99,102,241,0.5);
              }
            `}</style>
                    </div>

                    <div className="flex justify-between mt-4 text-sm font-medium">
                        <span className="text-red-500">Exhausted</span>
                        <span className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {entry.energy_level || 5}
                        </span>
                        <span className="text-green-500">Energized!</span>
                    </div>
                </div>
            </div>

            {/* ===== CUSTOM FIELDS SECTION ===== */}
            <div className={`border-t ${isDark ? "border-slate-700" : "border-slate-300"} pt-8`}>
                <h3 className={`text-lg font-semibold mb-5 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Custom Habits
                </h3>

                {Object.entries(entry.custom_fields || {}).length === 0 ? (
                    <p className={`text-center py-6 ${isDark ? "text-slate-500" : "text-slate-400"} italic`}>
                        No custom habits yet. Add one below
                    </p>
                ) : (
                    <div className="space-y-3 mb-6">
                        {Object.entries(entry.custom_fields || {}).map(([key, value]) => (
                            <div
                                key={key}
                                className={`flex items-center justify-between p-4 rounded-xl ${isDark ? "bg-slate-700/60" : "bg-slate-100"
                                    }`}
                            >
                                <span className={`font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
                                    {key}
                                </span>

                                <div className="flex items-center gap-3">
                                    {typeof value === "boolean" ? (
                                        <button
                                            onClick={() => updateCustomField(key, !value)}
                                            className={`px-5 py-2 rounded-full font-medium transition ${value
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
                                            className={`w-28 px-4 py-2 rounded-lg border text-center font-medium ${isDark
                                                    ? "bg-slate-800 border-slate-600 text-white"
                                                    : "bg-white border-slate-300 text-slate-900"
                                                }`}
                                        />
                                    )}

                                    <button
                                        onClick={() => removeCustomField(key)}
                                        className="text-red-400 hover:text-red-300 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Field */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="e.g., Cold Shower, Gratitude, Read Pages"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomField()}
                        className={`flex-1 px-4 py-3 rounded-xl border ${isDark
                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                            }`}
                    />
                    <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as any)}
                        className={`px-4 py-3 rounded-xl border ${isDark
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
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium flex items-center gap-2 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add
                    </button>
                </div>
            </div>

            {/* ===== NOTES + SAVE ===== */}
            <div className="mt-10 space-y-6">
                <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <StickyNote className="w-5 h-5" />
                        Notes
                    </label>
                    <textarea
                        value={entry.notes || ""}
                        onChange={(e) => onUpdate("notes", e.target.value)}
                        rows={4}
                        placeholder="How do you feel today? Any intentions?"
                        disabled={saving}
                        className={`w-full px-4 py-3 rounded-xl border resize-none transition focus:ring-4 focus:ring-indigo-500/30 ${isDark
                                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                            }`}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 active:scale-95 ${saving
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