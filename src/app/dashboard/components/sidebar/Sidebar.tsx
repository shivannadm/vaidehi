"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Calendar,
  Lightbulb,
  FolderOpen,
  StickyNote,
  TrendingUp,
  Coffee,
  Moon,
  Heart,
  Target,
  Activity,
  BarChart3,
  BookOpen,
  TestTube,
  Layers,
  PieChart,
  FileText,
  Zap,
  Shield,
  LayoutDashboard
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string, section: string) => void;
  theme?: 'light' | 'dark' | 'system';
}

export default function Sidebar({ activeItem, onItemClick, theme = 'dark' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    todo: true,
    routine: true,
    trading: true
  });
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: 'todo' | 'routine' | 'trading') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogoClick = () => {
    onItemClick('Dashboard', 'trading');
    window.scrollTo(0, 0);
  };

  const isLight = theme === 'light';

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className="bg-slate-900 text-white h-screen sticky top-0 w-56 flex flex-col">
        <div className="p-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base">
              <span className="text-indigo-500">V</span>aidehi
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`${isLight ? 'bg-white border-r border-slate-200' : 'bg-slate-900'
        } text-${isLight ? 'slate-900' : 'white'} h-screen sticky top-0 transition-all duration-100 flex flex-col ${isCollapsed ? "w-16" : "w-56"
        }`}
      suppressHydrationWarning
    >
      {/* Logo Section */}
      <div className={`p-3 flex items-center justify-between ${isLight ? 'border-b border-slate-200' : 'border-b border-slate-800'}`}>
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-base">
              <span className="text-indigo-500">V</span>aidehi
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded transition`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Upgrade Button */}
      <div className={`p-3 ${isLight ? 'border-b border-slate-200' : 'border-b border-slate-800'}`}>
        {!isCollapsed ? (
          <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm">
            <Zap className="w-4 h-4" />
            Upgrade 🚀
          </button>
        ) : (
          <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 p-2 rounded-lg transition flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Navigation Sections with Custom Scrollbar */}
      <nav className={`flex-1 overflow-y-auto p-3 space-y-1 ${isLight ? 'scrollbar-custom-light' : 'scrollbar-custom'}`} suppressHydrationWarning>

        {/* TO DO Section */}
        <div>
          <button
            onClick={() => toggleSection('todo')}
            className={`w-full flex items-center justify-between p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'} ${isCollapsed ? 'hidden' : ''}`}>
              To Do
            </span>
            {!isCollapsed && (
              <ChevronRight className={`w-3 h-3 transition-transform ${openSections.todo ? 'rotate-90' : ''}`} />
            )}
          </button>

          {openSections.todo && (
            <div className="mt-1 space-y-0.5">
              <SidebarItem
                icon={<CheckSquare className="w-4 h-4" />}
                label="Tasks"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Tasks'}
                onClick={() => {
                  onItemClick('Tasks', 'todo');
                  window.location.href = '/dashboard/todo/tasks';
                }}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Calendar className="w-4 h-4" />}
                label="Schedule"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Schedule'}
                onClick={() => onItemClick('Schedule', 'todo')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Lightbulb className="w-4 h-4" />}
                label="Daily Highlights"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Daily Highlights'}
                onClick={() => onItemClick('Daily Highlights', 'todo')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<FolderOpen className="w-4 h-4" />}
                label="Projects"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Projects'}
                onClick={() => onItemClick('Projects', 'todo')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="ToDo Notes"
                displayLabel="ToDo Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'ToDo Notes'}
                onClick={() => onItemClick('ToDo Notes', 'todo')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<TrendingUp className="w-4 h-4" />}
                label="Trends"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Trends'}
                onClick={() => onItemClick('Trends', 'todo')}
                isLight={isLight}
              />
            </div>
          )}
        </div>

        {/* ROUTINE Section */}
        <div>
          <button
            onClick={() => toggleSection('routine')}
            className={`w-full flex items-center justify-between p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'} ${isCollapsed ? 'hidden' : ''}`}>
              Routine
            </span>
            {!isCollapsed && (
              <ChevronRight className={`w-3 h-3 transition-transform ${openSections.routine ? 'rotate-90' : ''}`} />
            )}
          </button>

          {openSections.routine && (
            <div className="mt-1 space-y-0.5">
              <SidebarItem
                icon={<Coffee className="w-4 h-4" />}
                label="Morning"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Morning'}
                onClick={() => onItemClick('Morning', 'routine')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Moon className="w-4 h-4" />}
                label="Evening"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Evening'}
                onClick={() => onItemClick('Evening', 'routine')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Heart className="w-4 h-4" />}
                label="Health"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Health'}
                onClick={() => onItemClick('Health', 'routine')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Target className="w-4 h-4" />}
                label="Habits"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Habits'}
                onClick={() => onItemClick('Habits', 'routine')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="Key Notes"
                displayLabel="Key Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Key Notes'}
                onClick={() => onItemClick('Key Notes', 'routine')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Activity className="w-4 h-4" />}
                label="Progress"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Progress'}
                onClick={() => onItemClick('Progress', 'routine')}
                isLight={isLight}
              />
            </div>
          )}
        </div>

        {/* TRADING Section */}
        <div>
          <button
            onClick={() => toggleSection('trading')}
            className={`w-full flex items-center justify-between p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'} ${isCollapsed ? 'hidden' : ''}`}>
              Trading
            </span>
            {!isCollapsed && (
              <ChevronRight className={`w-3 h-3 transition-transform ${openSections.trading ? 'rotate-90' : ''}`} />
            )}
          </button>

          {openSections.trading && (
            <div className="mt-1 space-y-0.5">
              <SidebarItem
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Dashboard"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Dashboard'}
                onClick={() => onItemClick('Dashboard', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Shield className="w-4 h-4" />}
                label="Rules"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Rules'}
                onClick={() => onItemClick('Rules', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<BookOpen className="w-4 h-4" />}
                label="Journal"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Journal'}
                onClick={() => onItemClick('Journal', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<TestTube className="w-4 h-4" />}
                label="Backtest"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Backtest'}
                onClick={() => onItemClick('Backtest', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Layers className="w-4 h-4" />}
                label="Strategies"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Strategies'}
                onClick={() => onItemClick('Strategies', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="Quick Notes"
                displayLabel="Quick Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Quick Notes'}
                onClick={() => onItemClick('Quick Notes', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<FileText className="w-4 h-4" />}
                label="Reports"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Reports'}
                onClick={() => onItemClick('Reports', 'trading')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<PieChart className="w-4 h-4" />}
                label="Performance"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Performance'}
                onClick={() => onItemClick('Performance', 'trading')}
                isLight={isLight}
              />
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  displayLabel,
  isCollapsed,
  isActive,
  onClick,
  isLight
}: {
  icon: React.ReactNode;
  label: string;
  displayLabel?: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  isLight: boolean;
}) {
  const showLabel = displayLabel || label;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition group text-sm ${isActive
        ? (isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600 text-white')
        : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800 hover:text-white')
        }`}
      title={isCollapsed ? showLabel : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && <span>{showLabel}</span>}
    </button>
  );
}