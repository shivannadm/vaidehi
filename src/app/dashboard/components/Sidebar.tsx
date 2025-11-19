"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CheckSquare,
    Calendar,
    Bell,
    Target,
    Heart,
    Coffee,
    TrendingUp,
    BookOpen,
    PieChart,
    FileText,
    Zap
} from "lucide-react";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState({
        todo: true,
        routine: true,
        trading: true
    });

    const toggleSection = (section: 'todo' | 'routine' | 'trading') => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <aside
            className={`bg-slate-900 text-white h-screen sticky top-0 transition-all duration-300 flex flex-col ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo Section */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-lg">
                            <span className="text-indigo-400">V</span>aidehi
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 hover:bg-slate-800 rounded transition"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Upgrade Button */}
            <div className="p-4 border-b border-slate-800">
                {!isCollapsed ? (
                    <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                        <Zap className="w-4 h-4" />
                        Upgrade 🚀
                    </button>
                ) : (
                    <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 p-2 rounded-lg transition flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">

                {/* TO DO Section */}
                <div>
                    <button
                        onClick={() => toggleSection('todo')}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <span className={`font-semibold text-sm uppercase tracking-wider text-slate-400 ${isCollapsed ? 'hidden' : ''}`}>
                            To Do
                        </span>
                        {!isCollapsed && (
                            <ChevronRight className={`w-4 h-4 transition-transform ${openSections.todo ? 'rotate-90' : ''}`} />
                        )}
                    </button>

                    {openSections.todo && (
                        <div className="mt-1 space-y-1">
                            <SidebarItem icon={<CheckSquare className="w-5 h-5" />} label="Tasks" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<Calendar className="w-5 h-5" />} label="Schedule" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<Bell className="w-5 h-5" />} label="Reminders" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<Target className="w-5 h-5" />} label="Goals" isCollapsed={isCollapsed} />
                        </div>
                    )}
                </div>

                {/* Routine Section */}
                <div>
                    <button
                        onClick={() => toggleSection('routine')}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <span className={`font-semibold text-sm uppercase tracking-wider text-slate-400 ${isCollapsed ? 'hidden' : ''}`}>
                            Routine
                        </span>
                        {!isCollapsed && (
                            <ChevronRight className={`w-4 h-4 transition-transform ${openSections.routine ? 'rotate-90' : ''}`} />
                        )}
                    </button>

                    {openSections.routine && (
                        <div className="mt-1 space-y-1">
                            <SidebarItem icon={<Coffee className="w-5 h-5" />} label="Morning" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<Heart className="w-5 h-5" />} label="Health" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<Target className="w-5 h-5" />} label="Habits" isCollapsed={isCollapsed} />
                        </div>
                    )}
                </div>

                {/* Trading Section */}
                <div>
                    <button
                        onClick={() => toggleSection('trading')}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <span className={`font-semibold text-sm uppercase tracking-wider text-slate-400 ${isCollapsed ? 'hidden' : ''}`}>
                            Trading
                        </span>
                        {!isCollapsed && (
                            <ChevronRight className={`w-4 h-4 transition-transform ${openSections.trading ? 'rotate-90' : ''}`} />
                        )}
                    </button>

                    {openSections.trading && (
                        <div className="mt-1 space-y-1">
                            <SidebarItem icon={<BookOpen className="w-5 h-5" />} label="Journal" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<PieChart className="w-5 h-5" />} label="Analytics" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<FileText className="w-5 h-5" />} label="Reports" isCollapsed={isCollapsed} />
                            <SidebarItem icon={<TrendingUp className="w-5 h-5" />} label="Performance" isCollapsed={isCollapsed} />
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

function SidebarItem({ icon, label, isCollapsed }: { icon: React.ReactNode; label: string; isCollapsed: boolean }) {
    return (
        <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition group"
            title={isCollapsed ? label : undefined}
        >
            <span className="flex-shrink-0">{icon}</span>
            {!isCollapsed && <span className="text-sm">{label}</span>}
        </a>
    );
}