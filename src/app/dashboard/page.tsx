"use client";

import { TrendingUp, BarChart3, Target, Clock, Plus, Clipboard, ChartBar } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">

            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    Welcome back, The! 👋
                </h1>
                <p className="text-slate-600 mt-1">
                    Here's what's happening with your trading today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total P&L */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-green-600 text-sm font-semibold">+12.5%</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">$0.00</div>
                    <div className="text-sm text-slate-600">Total P&L</div>
                </div>

                {/* Total Trades */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">0</div>
                    <div className="text-sm text-slate-600">Total Trades</div>
                </div>

                {/* Win Rate */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">0%</div>
                    <div className="text-sm text-slate-600">Win Rate</div>
                </div>

                {/* Days Active */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">0</div>
                    <div className="text-sm text-slate-600">Days Active</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Log a Trade */}
                    <button className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                            <Plus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-1">Log a Trade</div>
                            <div className="text-sm text-slate-600">Add your latest trade</div>
                        </div>
                    </button>

                    {/* Check Routine */}
                    <button className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition group">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                            <Clipboard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-1">Check Routine</div>
                            <div className="text-sm text-slate-600">Review your checklist</div>
                        </div>
                    </button>

                    {/* View Analytics */}
                    <button className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition group">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                            <ChartBar className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-slate-900 mb-1">View Analytics</div>
                            <div className="text-sm text-slate-600">See your performance</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}