// src/app/dashboard/trading/strategies/components/StrategyCard.tsx
"use client";

import { useState } from "react";
import { Edit2, Trash2, Eye, TrendingUp, TrendingDown, BarChart3, Calendar, Activity, Play, Pause, Archive } from "lucide-react";
import type { Strategy } from "@/types/database";

interface StrategyCardProps {
  strategy: Strategy;
  onView: (strategy: Strategy) => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (strategyId: string) => void;
  onToggleStatus: (strategyId: string) => void;
  isDark: boolean;
}

export default function StrategyCard({
  strategy,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isDark,
}: StrategyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete strategy "${strategy.name}"?`)) return;

    setIsDeleting(true);
    await onDelete(strategy.id);
    setIsDeleting(false);
  };

  // Status configuration
  const statusConfig = {
    active: {
      icon: <Play className="w-3 h-3" />,
      label: "Active",
      bg: isDark
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-green-50 text-green-600 border-green-200",
    },
    testing: {
      icon: <Activity className="w-3 h-3" />,
      label: "Testing",
      bg: isDark
        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
        : "bg-blue-50 text-blue-600 border-blue-200",
    },
    archived: {
      icon: <Archive className="w-3 h-3" />,
      label: "Archived",
      bg: isDark
        ? "bg-slate-500/20 text-slate-400 border-slate-500/30"
        : "bg-slate-100 text-slate-600 border-slate-300",
    },
  };

  const config = statusConfig[strategy.status];
  const winRateColor = strategy.win_rate >= 60 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400";
  const pnlColor = strategy.total_pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  return (
    <div
      onClick={() => onView(strategy)}
      className={`rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3
            className={`text-lg font-bold truncate mb-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {strategy.name}
          </h3>
          <p
            className={`text-xs line-clamp-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {strategy.description || "No description"}
          </p>
        </div>

        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border whitespace-nowrap ${config.bg}`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Win Rate */}
        <div
          className={`rounded-lg p-3 ${
            isDark ? "bg-slate-700/50" : "bg-slate-50"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Win Rate
          </div>
          <div className={`text-xl font-bold ${winRateColor}`}>
            {strategy.win_rate.toFixed(1)}%
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {strategy.winning_trades}W / {strategy.losing_trades}L
          </div>
        </div>

        {/* Total P&L */}
        <div
          className={`rounded-lg p-3 ${
            isDark ? "bg-slate-700/50" : "bg-slate-50"
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Total P&L
          </div>
          <div className={`text-xl font-bold ${pnlColor}`}>
            ${strategy.total_pnl >= 0 ? "+" : ""}
            {strategy.total_pnl.toFixed(0)}
          </div>
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Avg: ${strategy.avg_pnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div
        className={`flex items-center gap-3 text-xs mb-4 pb-4 border-b ${
          isDark ? "text-slate-400 border-slate-700" : "text-slate-600 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span>{strategy.total_trades} trades</span>
        </div>
        {strategy.timeframe && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{strategy.timeframe}</span>
          </div>
        )}
        {strategy.market_type && (
          <div className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
            {strategy.market_type}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(strategy);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isDark
              ? "bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(strategy);
          }}
          className={`p-2 rounded-lg transition ${
            isDark
              ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          title="Edit strategy"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
          className={`p-2 rounded-lg transition ${
            isDark
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          } disabled:opacity-50`}
          title="Delete strategy"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}