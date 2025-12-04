// src/app/dashboard/trading/strategies/components/StrategyDetails.tsx
"use client";

import { X, TrendingUp, TrendingDown, BarChart3, Calendar, Activity, Target, Shield } from "lucide-react";
import type { Strategy } from "@/types/database";

interface StrategyDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: Strategy | null;
  onEdit: () => void;
  isDark: boolean;
}

export default function StrategyDetails({
  isOpen,
  onClose,
  strategy,
  onEdit,
  isDark,
}: StrategyDetailsProps) {
  if (!isOpen || !strategy) return null;

  const winRateColor = strategy.win_rate >= 60 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400";
  const pnlColor = strategy.total_pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl my-8 rounded-xl shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {strategy.name}
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {strategy.description || "No description"}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Performance Overview */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Performance Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricBox
                label="Total Trades"
                value={strategy.total_trades}
                icon={<BarChart3 className="w-4 h-4" />}
                isDark={isDark}
              />
              <MetricBox
                label="Winning Trades"
                value={strategy.winning_trades}
                icon={<TrendingUp className="w-4 h-4" />}
                color="green"
                isDark={isDark}
              />
              <MetricBox
                label="Losing Trades"
                value={strategy.losing_trades}
                icon={<TrendingDown className="w-4 h-4" />}
                color="red"
                isDark={isDark}
              />
              <MetricBox
                label="Win Rate"
                value={`${strategy.win_rate.toFixed(1)}%`}
                icon={<Target className="w-4 h-4" />}
                color={strategy.win_rate >= 60 ? "green" : "orange"}
                isDark={isDark}
              />
              <MetricBox
                label="Avg P&L"
                value={`$${strategy.avg_pnl.toFixed(2)}`}
                icon={<Activity className="w-4 h-4" />}
                isDark={isDark}
              />
              <MetricBox
                label="Total P&L"
                value={`$${strategy.total_pnl >= 0 ? "+" : ""}${strategy.total_pnl.toFixed(2)}`}
                icon={<TrendingUp className="w-4 h-4" />}
                color={strategy.total_pnl >= 0 ? "emerald" : "red"}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Strategy Details */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Strategy Details
            </h3>
            <div className="space-y-2">
              {strategy.market_type && (
                <DetailRow label="Market Type" value={strategy.market_type} isDark={isDark} />
              )}
              {strategy.timeframe && (
                <DetailRow label="Timeframe" value={strategy.timeframe} isDark={isDark} />
              )}
              <DetailRow
                label="Status"
                value={strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                isDark={isDark}
              />
              <DetailRow
                label="Created"
                value={new Date(strategy.created_at).toLocaleDateString()}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Entry Criteria */}
          {strategy.entry_criteria?.description && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Target className="w-4 h-4 text-green-500" />
                Entry Criteria
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-slate-700/50" : "bg-slate-50"
                }`}
              >
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {strategy.entry_criteria.description}
                </p>
              </div>
            </div>
          )}

          {/* Exit Criteria */}
          {strategy.exit_criteria?.description && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Activity className="w-4 h-4 text-blue-500" />
                Exit Criteria
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-slate-700/50" : "bg-slate-50"
                }`}
              >
                <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {strategy.exit_criteria.description}
                </p>
              </div>
            </div>
          )}

          {/* Risk Management */}
          {strategy.risk_management && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Shield className="w-4 h-4 text-orange-500" />
                Risk Management
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-orange-900/20 border border-orange-500/30" : "bg-orange-50 border border-orange-200"
                }`}
              >
                <p className={`text-sm ${isDark ? "text-orange-200" : "text-orange-900"}`}>
                  {strategy.risk_management}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Edit Strategy
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function MetricBox({ label, value, icon, color, isDark }: any) {
  const colors = {
    green: isDark
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-green-50 text-green-600 border-green-200",
    red: isDark
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-red-50 text-red-600 border-red-200",
    orange: isDark
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : "bg-orange-50 text-orange-600 border-orange-200",
    emerald: isDark
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        color ? colors[color as keyof typeof colors] : isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {label}
        </div>
      </div>
      <div className={`text-xl font-bold ${color ? "" : isDark ? "text-white" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}

function DetailRow({ label, value, isDark }: any) {
  return (
    <div
      className={`flex justify-between items-center py-2 border-b ${
        isDark ? "border-slate-700" : "border-slate-100"
      }`}
    >
      <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </span>
      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}