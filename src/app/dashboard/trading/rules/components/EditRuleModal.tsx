// src/app/dashboard/trading/rules/components/EditRuleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TradingRule, RuleCategory } from "@/types/database";

interface EditRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (ruleId: string, updates: Partial<TradingRule>) => Promise<{ success: boolean }>;
  rule: TradingRule | null;
  isDark: boolean;
}

const RULE_CATEGORIES: Array<{ value: RuleCategory; label: string }> = [
  { value: "entry", label: "Entry Rules" },
  { value: "exit", label: "Exit Rules" },
  { value: "risk_management", label: "Risk Management" },
  { value: "psychology", label: "Psychology" },
  { value: "time_management", label: "Time Management" },
];

export default function EditRuleModal({ isOpen, onClose, onUpdate, rule, isDark }: EditRuleModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RuleCategory>("entry");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when rule changes
  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setDescription(rule.description || "");
      setCategory(rule.category);
      setIsActive(rule.is_active);
    }
  }, [rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rule || !title.trim()) {
      alert("Please enter a rule title");
      return;
    }

    setIsSaving(true);

    const updates = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      is_active: isActive,
    };

    const result = await onUpdate(rule.id, updates);

    setIsSaving(false);

    if (result.success) {
      onClose();
    } else {
      alert("Failed to update rule. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isOpen || !rule) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Edit Rule
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            } disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="edit-title"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Rule Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Only trade with the trend"
              required
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="edit-category"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Category *
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as RuleCategory)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {RULE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this rule..."
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Active Rule
            </label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-indigo-600" : isDark ? "bg-slate-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}