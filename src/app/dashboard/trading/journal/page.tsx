// src/app/dashboard/trading/journal/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, BookOpen, Loader2, Calendar } from "lucide-react";
import DailyTradeRow from "./components/DailyTradeRow";
import TradeFilters from "./components/TradeFilters";
import NetPnLCard from "./components/NetPnLCard";
import MiniCalendar from "./components/MiniCalendar";
import DayDetailView from "./components/DayDetailView";
import AddTradeModal from "./components/AddTradeModal";
import InsightsView from "./components/InsightsView";
import WinLossChart from "./components/WinLossChart";
import type { TradeWithStrategy, InstrumentType } from "@/types/database";

export default function TradingJournalPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [trades, setTrades] = useState<TradeWithStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

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
    setLoading(false);
  };

  // Group trades by date
  const groupedTrades = useMemo(() => {
    const groups: Record<string, TradeWithStrategy[]> = {};
    
    trades.forEach(trade => {
      if (!groups[trade.entry_date]) {
        groups[trade.entry_date] = [];
      }
      groups[trade.entry_date].push(trade);
    });

    return groups;
  }, [trades]);

  // Get today's date
  const todayDate = new Date().toISOString().split('T')[0];
  const todayTrades = groupedTrades[todayDate] || [];
  const todayPnL = todayTrades
    .filter(t => t.is_closed && t.pnl)
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  // Filter and search (exclude today's trades from list) - LIMIT TO 7 ROWS
  const filteredGroupedTrades = useMemo(() => {
    let filtered = Object.entries(groupedTrades).filter(([date]) => date !== todayDate);

    if (selectedInstrument !== "all") {
      filtered = filtered.filter(([_, dayTrades]) => 
        dayTrades.some(t => t.instrument_type === selectedInstrument)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(([_, dayTrades]) =>
        dayTrades.some(t =>
          t.symbol.toLowerCase().includes(query) ||
          t.setup_name?.toLowerCase().includes(query)
        )
      );
    }

    // Sort and limit to 7 rows
    return filtered
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
  }, [groupedTrades, selectedInstrument, searchQuery, todayDate]);

  // Calculate net P&L
  const netPnL = useMemo(() => {
    return trades
      .filter(t => t.is_closed && t.pnl)
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
  }, [trades]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleBackToList = () => {
    setSelectedDate(null);
  };

  const handleAddTrade = async (tradeData: any) => {
    if (userId) {
      await fetchTrades(userId);
    }
    return { success: true };
  };

  if (!mounted) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (showInsights) {
    return (
      <InsightsView
        trades={trades}
        isDark={isDark}
        onBack={() => setShowInsights(false)}
      />
    );
  }

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
    <div className={`min-h-screen p-4 lg:p-6 ${
      isDark ? "bg-slate-900" : "bg-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Trading Journal
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Log and analyze your trades
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowInsights(true)}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Trade List */}
          <div className="lg:col-span-2 space-y-4">
            <TradeFilters
              selectedInstrument={selectedInstrument}
              onInstrumentChange={setSelectedInstrument}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isDark={isDark}
            />

            {/* TODAY'S TRADES CARD */}
            <button
              onClick={() => handleDateClick(todayDate)}
              className={`w-full rounded-xl border p-5 transition-all hover:shadow-lg text-left ${
                isDark
                  ? "bg-indigo-900/20 border-indigo-500/50 hover:border-indigo-500"
                  : "bg-indigo-50 border-indigo-300 hover:border-indigo-400"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className={`w-6 h-6 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                  <div>
                    <div className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      Today's Trades
                    </div>
                    <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {new Date().toLocaleDateString('en-IN', { 
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <Plus className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                  <div className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Trades
                  </div>
                  <div className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {todayTrades.length}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  todayPnL >= 0
                    ? isDark ? "bg-green-900/30" : "bg-green-100"
                    : isDark ? "bg-red-900/30" : "bg-red-100"
                }`}>
                  <div className={`text-xs mb-1 ${
                    todayPnL >= 0
                      ? isDark ? "text-green-400" : "text-green-700"
                      : isDark ? "text-red-400" : "text-red-700"
                  }`}>
                    P&L
                  </div>
                  <div className={`text-xl font-bold ${
                    todayPnL >= 0
                      ? isDark ? "text-green-400" : "text-green-700"
                      : isDark ? "text-red-400" : "text-red-700"
                  }`}>
                    ₹{Math.abs(todayPnL).toFixed(2)}
                  </div>
                </div>
              </div>
            </button>

            {/* Previous Trades - LIMITED TO 7 WITH SCROLLING */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredGroupedTrades.length === 0 ? (
              <div className={`text-center py-16 rounded-xl border ${
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-slate-600" : "text-slate-300"
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {searchQuery || selectedInstrument !== "all" ? "No trades found" : "No Previous Trades"}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {searchQuery || selectedInstrument !== "all" 
                    ? "Try a different search term or filter" 
                    : "Start logging your trades"}
                </p>
              </div>
            ) : (
              <div 
                className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50"
                style={{ maxHeight: 'calc(160vh - 520px)', minHeight: '400px' }}
              >
                {filteredGroupedTrades.map(([date, dayTrades]) => (
                  <DailyTradeRow
                    key={date}
                    date={date}
                    trades={dayTrades}
                    isDark={isDark}
                    onClick={() => handleDateClick(date)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Stats */}
          <div className="space-y-4">
            <NetPnLCard netPnL={netPnL} isDark={isDark} />
            <MiniCalendar 
              userId={userId || ""} 
              trades={trades} 
              isDark={isDark}
              onDateClick={handleDateClick}
            />
            <WinLossChart trades={trades} isDark={isDark} />
          </div>
        </div>
      </div>

      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTrade}
        userId={userId || ""}
        isDark={isDark}
        prefilledDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}