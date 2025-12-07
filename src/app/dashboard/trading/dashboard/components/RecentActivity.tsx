// src/app/dashboard/trading/dashboard/components/RecentActivity.tsx
"use client";

import { Activity, FileText, Calendar } from "lucide-react";
import type { TradeWithStrategy, QuickNote } from "@/types/database";
import { getInstrumentIcon, getCountryFlag } from "@/types/database";

interface RecentActivityProps {
  trades: TradeWithStrategy[];
  notes: QuickNote[];
  isDark: boolean;
}

export default function RecentActivity({ trades, notes, isDark }: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Trades */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Recent Trades
            </h3>
          </div>
          <a
            href="/dashboard/trading/journal"
            className={`text-sm font-medium hover:underline ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            View All →
          </a>
        </div>

        {trades.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No recent trades</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.slice(0, 5).map((trade) => (
              <div
                key={trade.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-102 ${
                  isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {/* Icon */}
                <div className="text-2xl">{getInstrumentIcon(trade.instrument_type)}</div>

                {/* Trade Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {trade.symbol}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        trade.side === "long"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {trade.side.toUpperCase()}
                    </span>
                  </div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {new Date(trade.entry_date).toLocaleDateString()} • Qty: {trade.quantity}
                  </div>
                </div>

                {/* P&L with INR */}
                {trade.is_closed && trade.pnl !== null && (
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        trade.pnl >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {trade.pnl >= 0 ? "+" : ""}₹
                      {trade.pnl.toFixed(0)}
                    </div>
                    {trade.pnl_percentage !== null && (
                      <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {trade.pnl_percentage >= 0 ? "+" : ""}
                        {trade.pnl_percentage.toFixed(1)}%
                      </div>
                    )}
                  </div>
                )}

                {!trade.is_closed && (
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark
                        ? "bg-orange-900/30 text-orange-400"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    Open
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notes */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Recent Notes
            </h3>
          </div>
          <a
            href="/dashboard/trading/quick-notes"
            className={`text-sm font-medium hover:underline ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          >
            View All →
          </a>
        </div>

        {notes.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">No recent notes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => {
              const typeConfig = {
                pre_market: { label: "Pre-Market", color: "orange" },
                post_market: { label: "Post-Market", color: "purple" },
                idea: { label: "Idea", color: "yellow" },
                general: { label: "General", color: "blue" },
              };

              const config = typeConfig[note.note_type];

              return (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg transition-all hover:scale-102 ${
                    isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  {/* Note Type Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        config.color === "orange"
                          ? isDark
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-orange-50 text-orange-600"
                          : config.color === "purple"
                          ? isDark
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-purple-50 text-purple-600"
                          : config.color === "yellow"
                          ? isDark
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-yellow-50 text-yellow-600"
                          : isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {config.label}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {new Date(note.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Note Content */}
                  <p
                    className={`text-sm line-clamp-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-xs ${
                            isDark
                              ? "bg-slate-600 text-slate-300"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}