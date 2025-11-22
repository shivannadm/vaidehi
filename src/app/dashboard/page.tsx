"use client";

import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, Target, Clock, Plus, Clipboard, ChartBar } from "lucide-react";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    // Initialize based on localStorage immediately
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
            if (theme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            return theme !== 'light';
        }
        return true;
    });

    useEffect(() => {
        setMounted(true);
        
        // Double-check actual theme from HTML element
        const checkTheme = () => {
            const dark = document.documentElement.classList.contains('dark');
            setIsDark(dark);
        };
        
        checkTheme();
        
        // Watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        return () => observer.disconnect();
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
                <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Welcome back, Raa&jee! 👋
                </h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Here's what's happening with your trading today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total P&L */}
                <div className={`rounded-xl p-5 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                            <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>+12.5%</span>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>$0.00</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total P&L</div>
                </div>

                {/* Total Trades */}
                <div className={`rounded-xl p-5 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>0</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Trades</div>
                </div>

                {/* Win Rate */}
                <div className={`rounded-xl p-5 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <Target className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>0%</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Win Rate</div>
                </div>

                {/* Days Active */}
                <div className={`rounded-xl p-5 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                            <Clock className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                        </div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>0</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Days Active</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-xl p-5 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* Log a Trade */}
                    <button className={`flex items-start gap-3 p-4 border-2 rounded-xl transition group ${
                        isDark 
                            ? 'border-slate-700 hover:bg-indigo-900/20 hover:border-indigo-300' 
                            : 'border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                    }`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                            isDark 
                                ? 'bg-indigo-900/30 group-hover:bg-indigo-800/50' 
                                : 'bg-indigo-100 group-hover:bg-indigo-200'
                        }`}>
                            <Plus className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <div className="text-left">
                            <div className={`font-semibold mb-0.5 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Log a Trade</div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Add your latest trade</div>
                        </div>
                    </button>

                    {/* Check Routine */}
                    <button className={`flex items-start gap-3 p-4 border-2 rounded-xl transition group ${
                        isDark 
                            ? 'border-slate-700 hover:bg-blue-900/20 hover:border-blue-300' 
                            : 'border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                            isDark 
                                ? 'bg-blue-900/30 group-hover:bg-blue-800/50' 
                                : 'bg-blue-100 group-hover:bg-blue-200'
                        }`}>
                            <Clipboard className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div className="text-left">
                            <div className={`font-semibold mb-0.5 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Check Routine</div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Review your checklist</div>
                        </div>
                    </button>

                    {/* View Analytics */}
                    <button className={`flex items-start gap-3 p-4 border-2 rounded-xl transition group ${
                        isDark 
                            ? 'border-slate-700 hover:bg-green-900/20 hover:border-green-300' 
                            : 'border-slate-200 hover:bg-green-50 hover:border-green-300'
                    }`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                            isDark 
                                ? 'bg-green-900/30 group-hover:bg-green-800/50' 
                                : 'bg-green-100 group-hover:bg-green-200'
                        }`}>
                            <ChartBar className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <div className="text-left">
                            <div className={`font-semibold mb-0.5 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>View Analytics</div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>See your performance</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}