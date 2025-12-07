// src/app/dashboard/trading/rules/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Shield, Loader2 } from "lucide-react";
import { useRules } from "./hooks/useRules";
import CategoryFilter from "./components/CategoryFilter";
import RuleCard from "./components/RuleCard";
import AddRuleModal from "./components/AddRuleModal";
import EditRuleModal from "./components/EditRuleModal";
import type { TradingRule, RuleCategory } from "@/types/database";

export default function TradingRulesPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TradingRule | null>(null);

  const {
    rules,
    allRules,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    addRule,
    updateRule,
    deleteRule,
    toggleStatus,
  } = useRules(userId);

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

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<RuleCategory | "all", number> = {
      all: allRules.length,
      entry: 0,
      exit: 0,
      risk_management: 0,
      psychology: 0,
      time_management: 0,
    };

    allRules.forEach((rule) => {
      counts[rule.category]++;
    });

    return counts;
  }, [allRules]);

  const handleEdit = (rule: TradingRule) => {
    setEditingRule(rule);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (ruleId: string) => {
    await deleteRule(ruleId);
  };

  const handleToggleStatus = async (ruleId: string, isActive: boolean) => {
    await toggleStatus(ruleId, isActive);
  };

  if (!mounted) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
              <span className="leading-tight">Trading Rules</span>
            </h1>
            <p className={`text-xs md:text-sm mt-1 md:mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Define and track your trading discipline
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          isDark={isDark}
          counts={categoryCounts}
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
            className={`p-4 md:p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium text-sm md:text-base">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rules.length === 0 && (
          <div
            className={`text-center py-12 md:py-16 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <Shield className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              {selectedCategory === "all" ? "No Rules Yet" : `No ${selectedCategory.replace("_", " ")} Rules`}
            </h3>
            <p className={`text-xs md:text-sm mb-4 md:mb-6 px-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {selectedCategory === "all"
                ? "Create your first trading rule to maintain discipline"
                : "Add a rule in this category to get started"}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm md:text-base"
            >
              Create Your First Rule
            </button>
          </div>
        )}

        {/* Rules Grid */}
        {!loading && !error && rules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
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
      <AddRuleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRule}
        userId={userId || ""}
        isDark={isDark}
      />

      <EditRuleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRule(null);
        }}
        onUpdate={updateRule}
        rule={editingRule}
        isDark={isDark}
      />
    </div>
  );
}