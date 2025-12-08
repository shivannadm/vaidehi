// src/app/dashboard/routine/habits/components/AddHabitModal.tsx
"use client";

import { useState } from "react";
import { X, Target, Calendar, Tag } from "lucide-react";
import type { CreateHabit, HabitCategory, HabitFrequency } from "@/types/database";
import { HABIT_CATEGORIES } from "@/types/database";

interface AddHabitModalProps {
  onClose: () => void;
  onSave: (habit: CreateHabit) => Promise<void>;
  isDark: boolean;
}

const POPULAR_ICONS = [
  "🧘", "📚", "💪", "🏃", "💧", "🥗", "😴", "🚭", "📵", "✍️",
  "🎯", "🧠", "💰", "🙏", "🎨", "🎵", "🌅", "🌙", "⏰", "🔥"
];

const COLORS = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Green", value: "#10B981" },
  { name: "Lime", value: "#84CC16" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Purple", value: "#A855F7" },
  { name: "Violet", value: "#8B5CF6" },
];

export default function AddHabitModal({
  onClose,
  onSave,
  isDark,
}: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("Custom");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [targetCount, setTargetCount] = useState(7);
  const [icon, setIcon] = useState("⭐");
  const [color, setColor] = useState("#A855F7");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        user_id: "", // Will be set in the hook
        name: name.trim(),
        description: description.trim() || null,
        category,
        frequency,
        target_count: targetCount,
        icon,
        color,
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving habit:", error);
      alert("Failed to save habit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
        // mobile: full height feel
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
      >
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-4 md:p-6 border-b ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold">Add New Habit</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Habit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation, Read 30 Pages"
              disabled={saving}
              className={`w-full px-4 py-3 rounded-lg border text-base transition ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about why this habit matters to you..."
              rows={3}
              disabled={saving}
              className={`w-full px-4 py-3 rounded-lg border text-base resize-none transition ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>

            {/* mobile: grid becomes horizontally scrollable for many categories */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.values(HABIT_CATEGORIES).map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setCategory(cat.category)}
                  disabled={saving}
                  className={`min-w-[120px] flex-shrink-0 p-3 rounded-lg border-2 transition ${category === cat.category ? "border-indigo-600" : isDark ? "border-slate-600 hover:border-slate-500" : "border-slate-200 hover:border-slate-300"}`}
                  style={{ backgroundColor: category === cat.category ? `${cat.color}20` : undefined }}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium truncate">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency & Target (stack on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                disabled={saving}
                className={`w-full px-4 py-3 rounded-lg border transition ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target ({frequency === "daily" ? "days/week" : frequency === "weekly" ? "times/week" : "times/month"})
              </label>
              <input
                type="number"
                min="1"
                max={frequency === "daily" ? 7 : frequency === "weekly" ? 7 : 31}
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                disabled={saving}
                className={`w-full px-4 py-3 rounded-lg border transition ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
              />
            </div>
          </div>

          {/* Icon Picker - mobile: horizontal scroll */}
          <div>
            <label className="block text-sm font-medium mb-2">Choose an Icon</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {POPULAR_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  disabled={saving}
                  className={`flex-shrink-0 w-12 h-12 text-2xl rounded-lg border-2 transition flex items-center justify-center ${icon === emoji ? "border-indigo-600 bg-indigo-600/20" : isDark ? "border-slate-600" : "border-slate-200"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker - mobile: grid collapses to rows */}
          <div>
            <label className="block text-sm font-medium mb-2">Choose a Color</label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  disabled={saving}
                  className={`aspect-square rounded-lg border-2 transition ${color === c.value ? "ring-2 ring-indigo-600" : "border-transparent"}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className={`p-3 rounded-lg border ${isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"}`}>
            <div className="text-sm font-medium mb-3">Preview</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: `${color}20` }}>{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{name || "Your Habit Name"}</div>
                <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{category} • {targetCount}x per {frequency === "daily" ? "week" : frequency}</div>
              </div>
            </div>
          </div>

          {/* Actions: mobile friendly full-width buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`w-full px-4 py-3 rounded-lg font-medium transition ${isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-900"} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
