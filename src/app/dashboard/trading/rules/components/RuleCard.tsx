// src/app/dashboard/trading/rules/components/RuleCard.tsx
"use client";

import { useState } from "react";
import { Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import type { TradingRule } from "@/types/database";
import { getRuleCategoryColor, getRuleCategoryLabel } from "@/types/database";

interface RuleCardProps {
  rule: TradingRule;
  onEdit: (rule: TradingRule) => void;
  onDelete: (ruleId: string) => void;
  onToggleStatus: (ruleId: string, isActive: boolean) => void;
  isDark: boolean;
}

export default function RuleCard({ rule, onEdit, onDelete, onToggleStatus, isDark }: RuleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete rule "${rule.title}"?`)) return;

    setIsDeleting(true);
    await onDelete(rule.id);
    setIsDeleting(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggleStatus(rule.id, !rule.is_active);
    setIsToggling(false);
  };

  const categoryColor = getRuleCategoryColor(rule.category);

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        rule.is_active
          ? isDark
            ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
            : "bg-white border-slate-200 hover:border-indigo-400"
          : isDark
          ? "bg-slate-800/50 border-slate-700/50 opacity-60"
          : "bg-slate-50 border-slate-200 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {rule.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
              {getRuleCategoryLabel(rule.category)}
            </span>
          </div>
          {rule.description && (
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {rule.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(rule)}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            title="Edit rule"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "hover:bg-red-900/30 text-red-400"
                : "hover:bg-red-50 text-red-600"
            } disabled:opacity-50`}
            title="Delete rule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Violation Count */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <TrendingDown className="w-4 h-4 text-red-500" />
          <div>
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Violations
            </div>
            <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {rule.violation_count || 0}
            </div>
          </div>
        </div>

        {/* Adherence Rate */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-green-500" />
          <div>
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Adherence
            </div>
            <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {Math.round(rule.adherence_rate || 0)}%
            </div>
          </div>
        </div>

        {/* Cost of Violations */}
        {rule.cost_of_violations > 0 && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDark ? "bg-red-900/20" : "bg-red-50"
            }`}
          >
            <div>
              <div className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                Cost
              </div>
              <div className={`text-lg font-bold ${isDark ? "text-red-300" : "text-red-700"}`}>
                ${rule.cost_of_violations.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adherence Progress Bar */}
      <div className="mb-4">
        <div
          className={`h-2 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}
        >
          <div
            className={`h-full transition-all duration-500 ${
              rule.adherence_rate >= 80
                ? "bg-green-500"
                : rule.adherence_rate >= 60
                ? "bg-blue-500"
                : rule.adherence_rate >= 40
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(rule.adherence_rate || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {rule.is_active ? "Active" : "Inactive"}
        </span>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            rule.is_active ? "bg-indigo-600" : isDark ? "bg-slate-600" : "bg-slate-300"
          } disabled:opacity-50`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              rule.is_active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}