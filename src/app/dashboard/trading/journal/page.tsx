// src/app/dashboard/trading/journal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, BookOpen, Loader2, Search } from "lucide-react";
import { createTradeWithRules } from "@/lib/supabase/trading-helpers";
import TradeRow from "./components/TradeRow";
import MiniCalendar from "./components/MiniCalendar";
import DayDetailView from "./components/DayDetailView";
import AddTradeModal from "./components/AddTradeModal";
import type { TradeWithStrategy, CreateTrade } from "@/types/database";

export default function TradingJournalPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [trades, setTrades] = useState<TradeWithStrategy[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<TradeWithStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchTrades(user.id);
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

  const fetchTrades = async (uid: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("trades")
      .select(`
        *,
        strategy:strategies(*)
      `)
      .eq("user_id", uid)
      .order("entry_date", { ascending: false })
      .limit(100);

    setTrades(data || []);
    setFilteredTrades(data || []);
    setLoading(false);
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = trades.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.setup_name?.toLowerCase().includes(query) ||
          t.instrument_type.toLowerCase().includes(query)
      );
      setFilteredTrades(filtered);
    } else {
      setFilteredTrades(trades);
    }
  }, [searchQuery, trades]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleBackToList = () => {
    setSelectedDate(null);
  };

  const handleAddTrade = async (tradeData: CreateTrade) => {
    try {
      const { data, error } = await createTradeWithRules(tradeData);
      
      if (error) {
        console.error("Error creating trade:", error);
        return { success: false };
      }

      if (data && userId) {
        await fetchTrades(userId);
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false };
    }
  };

  if (!mounted) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If date selected, show day detail view
  if (selectedDate) {
    return (
      <DayDetailView
        date={selectedDate}
        userId={userId || ""}
        onBack={handleBackToList}
        isDark={isDark}
      />
    );
  }

  return (
    <div className={`min-h-screen p-4 lg:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Journal
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Log and analyze your trades
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => alert("Insights coming soon!")}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Log Trade</span>
            </button>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Trade List - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`} />
              <input
                type="text"
                placeholder="Search by symbol or setup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Trades */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredTrades.length === 0 ? (
              <div className={`text-center py-16 rounded-xl border ${
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {searchQuery ? "No trades found" : "No Trades Yet"}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {searchQuery ? "Try a different search term" : "Start logging your trades"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Log Your First Trade
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrades.map((trade) => (
                  <TradeRow 
                    key={trade.id} 
                    trade={trade} 
                    isDark={isDark}
                    onClick={() => handleDateClick(trade.entry_date)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Calendar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <MiniCalendar 
              userId={userId || ""} 
              trades={trades} 
              isDark={isDark}
              onDateClick={handleDateClick}
            />
          </div>
        </div>

        {/* Mobile Calendar - Show below on mobile */}
        <div className="lg:hidden mt-6">
          <MiniCalendar 
            userId={userId || ""} 
            trades={trades} 
            isDark={isDark}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      {/* Add Trade Modal */}
      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTrade}
        userId={userId || ""}
        isDark={isDark}
      />
    </div>
  );
}