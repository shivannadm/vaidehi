// src/app/dashboard/trading/strategies/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Target, Loader2 } from "lucide-react";
import { useStrategies } from "./hooks/useStrategies";
import StrategyFilters from "./components/StrategyFilters";
import StrategyCard from "./components/StrategyCard";
import AddStrategyModal from "./components/AddStrategyModal";
import EditStrategyModal from "./components/EditStrategyModal";
import StrategyDetails from "./components/StrategyDetails";
import type { Strategy } from "@/types/database";

export default function StrategiesPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [viewingStrategy, setViewingStrategy] = useState<Strategy | null>(null);

  const {
    strategies,
    allStrategies,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    loading,
    error,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    toggleStatus,
  } = useStrategies(userId);

  // Auth and theme setup
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: allStrategies.length,
      active: allStrategies.filter((s) => s.status === "active").length,
      testing: allStrategies.filter((s) => s.status === "testing").length,
      archived: allStrategies.filter((s) => s.status === "archived").length,
    };
  }, [allStrategies]);

  const handleViewDetails = (strategy: Strategy) => {
    setViewingStrategy(strategy);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsEditModalOpen(true);
  };

  const handleEditFromDetails = () => {
    if (viewingStrategy) {
      setIsDetailModalOpen(false);
      setEditingStrategy(viewingStrategy);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (strategyId: string) => {
    await deleteStrategy(strategyId);
  };

  const handleToggleStatus = async (strategyId: string) => {
    const strategy = allStrategies.find((s) => s.id === strategyId);
    if (strategy) {
      await toggleStatus(strategyId, strategy.status);
    }
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
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <Target className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Strategies
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Manage and analyze your trading strategies
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Strategy</span>
          </button>
        </div>

        {/* Filters */}
        <StrategyFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isDark={isDark}
          counts={filterCounts}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && strategies.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <Target
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {searchQuery || filterType !== "all"
                ? "No strategies found"
                : "No Strategies Yet"}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first trading strategy to get started"}
            </p>
            {!searchQuery && filterType === "all" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Create Your First Strategy
              </button>
            )}
          </div>
        )}

        {/* Strategies Grid */}
        {!loading && !error && strategies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {strategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onView={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStrategyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addStrategy}
        userId={userId || ""}
        isDark={isDark}
      />

      <EditStrategyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStrategy(null);
        }}
        onUpdate={updateStrategy}
        strategy={editingStrategy}
        isDark={isDark}
      />

      <StrategyDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingStrategy(null);
        }}
        strategy={viewingStrategy}
        onEdit={handleEditFromDetails}
        isDark={isDark}
      />
    </div>
  );
}