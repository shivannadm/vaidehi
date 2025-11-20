"use client";

import { TrendingUp, BarChart3, Target, Clock, Plus, Clipboard, ChartBar } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-5">

            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Welcome back, The! 👋
                </h1>
                <p className="text-slate-600 mt-1 text-sm">
                    Here's what's happening with your trading today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total P&L */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-green-600 text-xs font-semibold">+12.5%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">$0.00</div>
                    <div className="text-xs text-slate-600">Total P&L</div>
                </div>

                {/* Total Trades */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                    <div className="text-xs text-slate-600">Total Trades</div>
                </div>

                {/* Win Rate */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">0%</div>
                    <div className="text-xs text-slate-600">Win Rate</div>
                </div>

                {/* Days Active */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                    <div className="text-xs text-slate-600">Days Active</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* Log a Trade */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                            <Plus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-0.5 text-sm">Log a Trade</div>
                            <div className="text-xs text-slate-600">Add your latest trade</div>
                        </div>
                    </button>

                    {/* Check Routine */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition group">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                            <Clipboard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-0.5 text-sm">Check Routine</div>
                            <div className="text-xs text-slate-600">Review your checklist</div>
                        </div>
                    </button>

                    {/* View Analytics */}
                    <button className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition group">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                            <ChartBar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-0.5 text-sm">View Analytics</div>
                            <div className="text-xs text-slate-600">See your performance</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}