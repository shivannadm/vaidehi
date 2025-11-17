"use client";

import { useEffect, useState } from "react";

export default function HeroMockup() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
            {/* Floating background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-10 right-10 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute bottom-10 left-10 w-80 h-60 bg-blue-300/15 rounded-full blur-6xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
                        transition: "transform 0.3s ease-out",
                        animationDelay: "2s",
                    }}
                />
            </div>

            {/* Main mockup container */}
            <div
                className="relative z-10"
                style={{
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
                    transition: "transform 0.3s ease-out",
                }}
            >
                {/* CARD 3 - Top Right (Journal Entry Card) */}
                <div
                    className="absolute top-0 -right-32 w-80 rotate-12 z-0"
                    style={{
                        transform: `rotate(12deg) scale(0.85)`,
                    }}
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Browser chrome */}
                        <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 rounded-t-xl">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                        </div>

                        {/* Journal Content */}
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 h-64">
                            <h3 className="font-bold text-lg text-purple-900 mb-3">Trading Journal</h3>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-600 font-medium">Entry #127</span>
                                        <span className="text-xs text-green-600 font-bold">+$450</span>
                                    </div>
                                    <div className="text-xs text-slate-500">AAPL • Long • 2:30 PM</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-600 font-medium">Entry #126</span>
                                        <span className="text-xs text-blue-600 font-bold">+$280</span>
                                    </div>
                                    <div className="text-xs text-slate-500">TSLA • Short • 11:45 AM</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-600 font-medium">Entry #125</span>
                                        <span className="text-xs text-red-600 font-bold">-$120</span>
                                    </div>
                                    <div className="text-xs text-slate-500">NVDA • Long • 9:20 AM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD 2 - Bottom Left (Routine Checklist Card) */}
                <div
                    className="absolute -bottom-12 -left-40 w-80 -rotate-12 z-0"
                    style={{
                        transform: `rotate(-12deg) scale(0.85)`,
                    }}
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Browser chrome */}
                        <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 rounded-t-xl">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                        </div>

                        {/* Routine Checklist Content */}
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 h-64">
                            <h3 className="font-bold text-lg text-blue-900 mb-3">Morning Routine</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-200">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                    <span className="text-sm text-slate-700">Market analysis review</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-200">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                    <span className="text-sm text-slate-700">Check economic calendar</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-200">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                    <span className="text-sm text-slate-700">Set daily trading goals</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-200">
                                    <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs"></div>
                                    <span className="text-sm text-slate-400">Review risk parameters</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD 1 - Main Dashboard (Center - ORIGINAL) */}
                <div className="relative w-full max-w-lg z-10">
                    {/* Browser chrome */}
                    <div className="bg-slate-800 rounded-t-xl px-4 py-3 flex items-center gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 bg-slate-700 rounded px-3 py-1 text-xs text-slate-400 ml-4">
                            vaidehijournal.app/dashboard
                        </div>
                    </div>

                    {/* Dashboard content */}
                    <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Today's Performance</h3>
                                    <p className="text-sm text-indigo-100">+2.4% · $1,240 profit</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
                                    5 trades
                                </div>
                            </div>
                        </div>

                        {/* Chart area */}
                        <div className="p-6 bg-slate-50">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                {/* Simplified chart */}
                                <div className="flex items-end gap-1 h-32">
                                    {[40, 65, 50, 80, 70, 90, 75, 95, 85].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-500"
                                            style={{
                                                height: `${height}%`,
                                                animationDelay: `${i * 0.1}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-between text-xs text-slate-500">
                                    <span>9:00</span>
                                    <span>12:00</span>
                                    <span>15:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats cards */}
                        <div className="p-6 grid grid-cols-3 gap-3">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                                <div className="text-xs text-green-700 font-medium">Win Rate</div>
                                <div className="text-xl font-bold text-green-800 mt-1">68%</div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                <div className="text-xs text-blue-700 font-medium">Avg Win</div>
                                <div className="text-xl font-bold text-blue-800 mt-1">$248</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                                <div className="text-xs text-purple-700 font-medium">Streak</div>
                                <div className="text-xl font-bold text-purple-800 mt-1">4 days</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating cards (ORIGINAL) */}
                <div
                    className="absolute -right-8 top-20 bg-white rounded-lg shadow-xl p-4 w-48 border border-slate-200 z-20"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                            ✓
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Latest Trade</div>
                            <div className="font-semibold text-green-600">+$320</div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute -left-8 bottom-16 bg-white rounded-lg shadow-xl p-4 w-44 border border-slate-200 z-20"
                    style={{
                        transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * -0.4}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                >
                    <div className="text-xs text-slate-500 mb-2">Routine Completion</div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-full w-4/5 rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-indigo-600">80%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}