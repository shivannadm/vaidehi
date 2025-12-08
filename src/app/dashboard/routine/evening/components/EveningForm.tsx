// src/app/dashboard/routine/evening/components/EveningForm.tsx
"use client";

import { useState } from "react";
import { Moon, BookOpen, Smartphone, Star, CheckCircle, StickyNote, Plus, X, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import type { EveningRoutineEntry } from "../hooks/useEveningRoutine";

interface EveningFormProps {
  entry: Partial<EveningRoutineEntry>;
  onUpdate: <K extends keyof EveningRoutineEntry>(
    field: K,
    value: EveningRoutineEntry[K]
  ) => void;
  onSave: () => Promise<boolean>;
  saving: boolean;
  isDark: boolean;
}

export default function EveningForm({
  entry,
  onUpdate,
  onSave,
  saving,
  isDark,
}: EveningFormProps) {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "boolean">("boolean");
  const [showCustomHabits, setShowCustomHabits] = useState(true);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      console.log("Evening routine saved!");
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
      className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all ${
        isDark
          ? "bg-slate-800/90 border border-slate-700"
          : "bg-white border border-slate-200"
      }`}
    >
      <h2 className={`text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
        <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
        Evening Wind Down
      </h2>

      {/* ===== DEFAULT FIELDS ===== */}
      <div className="space-y-5 sm:space-y-7 mb-8 sm:mb-10">
        {/* Shutdown Time */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            Shutdown Time
          </label>
          <input
            type="time"
            value={entry.shutdown_time || ""}
            onChange={(e) => onUpdate("shutdown_time", e.target.value)}
            disabled={saving}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${
              isDark
                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
        </div>

        {/* Screen & Reading Time - Stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
          {/* Screen Time */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              Screen Time (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={entry.screen_time || 0}
              onChange={(e) => onUpdate("screen_time", parseInt(e.target.value) || 0)}
              disabled={saving}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${
                isDark
                  ? "bg-slate-700/70 border-slate-600 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Reading Time */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              Reading Time (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={entry.reading_time || 0}
              onChange={(e) => onUpdate("reading_time", parseInt(e.target.value) || 0)}
              disabled={saving}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-base sm:text-lg font-medium transition focus:ring-4 focus:ring-indigo-500/30 ${
                isDark
                  ? "bg-slate-700/70 border-slate-600 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Reflection Rating */}
        <div className="mb-6 sm:mb-8">
          <label className={`flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            Day Reflection Rating
          </label>

          <div className="relative px-1">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={entry.reflection_rating || 5}
              onChange={(e) => onUpdate("reflection_rating", parseInt(e.target.value))}
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
              @media (min-width: 640px) {
                input[type="range"]::-webkit-slider-thumb {
                  height: 32px;
                  width: 32px;
                  border: 5px solid #6366f1;
                }
              }
            `}</style>
          </div>

          <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm font-medium px-1">
            <span className="text-red-500">Poor Day</span>
            <span className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {entry.reflection_rating || 5}
            </span>
            <span className="text-green-500">Great Day!</span>
          </div>
        </div>

        {/* Tomorrow's Top 3 */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5" />
            Tomorrow's Top 3 Priorities
          </label>
          <textarea
            value={entry.tomorrow_top_3 || ""}
            onChange={(e) => onUpdate("tomorrow_top_3", e.target.value)}
            rows={3}
            placeholder="1. &#10;2. &#10;3. "
            disabled={saving}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border resize-none transition focus:ring-4 focus:ring-indigo-500/30 text-sm sm:text-base ${
              isDark
                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
            }`}
          />
        </div>

        {/* Gratitude Journal */}
        <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? "bg-slate-700/50 border-slate-600" : "bg-amber-50 border-amber-200"}`}>
          <h3 className={`font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? "text-amber-400" : "text-amber-700"}`}>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            3 Things I'm Grateful For
          </h3>
          
          <div className="space-y-2.5 sm:space-y-3">
            <input
              type="text"
              value={entry.gratitude_1 || ""}
              onChange={(e) => onUpdate("gratitude_1", e.target.value)}
              placeholder="1. Something that made you smile today..."
              disabled={saving}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-amber-500/50 ${
                isDark
                  ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-amber-300 text-slate-900 placeholder-amber-600"
              }`}
            />
            <input
              type="text"
              value={entry.gratitude_2 || ""}
              onChange={(e) => onUpdate("gratitude_2", e.target.value)}
              placeholder="2. A person who helped you..."
              disabled={saving}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-amber-500/50 ${
                isDark
                  ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-amber-300 text-slate-900 placeholder-amber-600"
              }`}
            />
            <input
              type="text"
              value={entry.gratitude_3 || ""}
              onChange={(e) => onUpdate("gratitude_3", e.target.value)}
              placeholder="3. An opportunity you had..."
              disabled={saving}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm transition focus:ring-2 focus:ring-amber-500/50 ${
                isDark
                  ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-amber-300 text-slate-900 placeholder-amber-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ===== CUSTOM FIELDS - Collapsible on Mobile ===== */}
      <div className={`border-t ${isDark ? "border-slate-700" : "border-slate-300"} pt-6 sm:pt-8`}>
        <button
          onClick={() => setShowCustomHabits(!showCustomHabits)}
          className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 mb-4 sm:mb-5"
        >
          <h3 className={`text-base sm:text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            Custom Evening Habits
          </h3>
          {showCustomHabits ? <ChevronUp className="w-5 h-5 sm:hidden" /> : <ChevronDown className="w-5 h-5 sm:hidden" />}
        </button>

        <div className={`${showCustomHabits ? 'block' : 'hidden'} sm:block space-y-4 sm:space-y-5`}>
          {Object.entries(entry.custom_fields || {}).length === 0 ? (
            <p className={`text-center py-4 sm:py-6 ${isDark ? "text-slate-500" : "text-slate-400"} italic text-sm`}>
              No custom habits yet. Add one below!
            </p>
          ) : (
            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
              {Object.entries(entry.custom_fields || {}).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                    isDark ? "bg-slate-700/60" : "bg-slate-100"
                  }`}
                >
                  <span className={`font-medium text-sm sm:text-base truncate mr-3 ${isDark ? "text-white" : "text-slate-800"}`}>
                    {key}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {typeof value === "boolean" ? (
                      <button
                        onClick={() => updateCustomField(key, !value)}
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition text-sm ${
                          value
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
                        className={`w-20 sm:w-28 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-center font-medium text-sm ${
                          isDark
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
              placeholder="e.g., Journaled, Stretch"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomField()}
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
              }`}
            />
            <div className="flex gap-2 sm:gap-3">
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${
                  isDark
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
            Evening Reflection Notes
          </label>
          <textarea
            value={entry.notes || ""}
            onChange={(e) => onUpdate("notes", e.target.value)}
            rows={4}
            placeholder="What went well? What could be improved tomorrow?"
            disabled={saving}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border resize-none transition focus:ring-4 focus:ring-indigo-500/30 text-sm sm:text-base ${
              isDark
                ? "bg-slate-700/70 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
            }`}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition transform hover:scale-105 active:scale-95 ${
            saving
              ? "bg-indigo-500/70 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          } text-white shadow-lg`}
        >
          {saving ? "Saving Your Evening..." : "Save Evening Routine"}
        </button>
      </div>
    </div>
  );
}