"use client";

import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, Target, Clock, Plus, Clipboard, ChartBar } from "lucide-react";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Show loading state during SSR
    if (!mounted) {
        return (
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Loading...
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5" suppressHydrationWarning>

            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Welcome back, Shiva! 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                    Here's what's happening with your trading today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total P&L */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-green-600 dark:text-green-400 text-xs font-semibold">+12.5%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">$0.00</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total P&L</div>
                </div>

                {/* Total Trades */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">0</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total Trades</div>
                </div>

                {/* Win Rate */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">0%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Win Rate</div>
                </div>

                {/* Days Active */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">0</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Days Active</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* Log a Trade */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition group">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition">
                            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 dark:text-white mb-0.5 text-sm">Log a Trade</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Add your latest trade</div>
                        </div>
                    </button>

                    {/* Check Routine */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition">
                            <Clipboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 dark:text-white mb-0.5 text-sm">Check Routine</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Review your checklist</div>
                        </div>
                    </button>

                    {/* View Analytics */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition group">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition">
                            <ChartBar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 dark:text-white mb-0.5 text-sm">View Analytics</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">See your performance</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}