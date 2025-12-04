// src/app/dashboard/trading/backtest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Calculator, Loader2, Search } from "lucide-react";
import { useBacktest } from "./hooks/useBacktest";
import BacktestForm from "./components/BacktestForm";
import BacktestCard from "./components/BacktestCard";
import BacktestResults from "./components/BacktestResults";
import type { BacktestResult } from "@/types/database";

export default function BacktestPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [viewingBacktest, setViewingBacktest] = useState<BacktestResult | null>(null);

  const {
    backtests,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addBacktest,
    deleteBacktest,
  } = useBacktest(userId);

  // Auth and theme setup
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        window.location.href = "/login";
      }
    };

    init();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleViewBacktest = (backtest: BacktestResult) => {
    setViewingBacktest(backtest);
    setIsResultsOpen(true);
  };

  const handleDelete = async (backtestId: string) => {
    await deleteBacktest(backtestId);
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
              Backtest
            </h1>
            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Test and validate your trading strategies
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>New Backtest</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by strategy name..."
            className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-4 sm:p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && backtests.length === 0 && (
          <div
            className={`text-center py-12 sm:py-16 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <Calculator
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              {searchQuery ? "No backtests found" : "No Backtests Yet"}
            </h3>
            <p className={`text-xs sm:text-sm mb-4 sm:mb-6 px-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {searchQuery
                ? "Try adjusting your search"
                : "Start testing your trading strategies"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-indigo-700 transition"
              >
                Create Your First Backtest
              </button>
            )}
          </div>
        )}

        {/* Backtests Grid */}
        {!loading && !error && backtests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {backtests.map((backtest) => (
              <BacktestCard
                key={backtest.id}
                backtest={backtest}
                onDelete={handleDelete}
                onView={handleViewBacktest}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <BacktestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addBacktest}
        userId={userId || ""}
        isDark={isDark}
      />

      <BacktestResults
        isOpen={isResultsOpen}
        onClose={() => {
          setIsResultsOpen(false);
          setViewingBacktest(null);
        }}
        backtest={viewingBacktest}
        isDark={isDark}
      />
    </div>
  );
}