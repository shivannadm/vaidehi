// src/app/dashboard/components/sidebar/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string, section: string) => void;
  theme?: 'light' | 'dark' | 'system';
}

export default function Sidebar({ activeItem, onItemClick, theme = 'dark' }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    todo: true,
    routine: true,
    trading: true
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (pathname.includes('/todo/tasks')) {
      onItemClick('Tasks', 'todo');
    } else if (pathname === '/dashboard') {
      onItemClick('Dashboard', 'trading');
    }
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: 'todo' | 'routine' | 'trading') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogoClick = () => {
    onItemClick('Dashboard', 'trading');
    router.push('/dashboard');
  };

  const handleNavigation = (item: string, section: string, path: string) => {
    onItemClick(item, section);
    router.push(path);
  };

  const isLight = theme === 'light';

  if (!mounted) {
    return (
      <aside className="hidden lg:block bg-slate-900 text-white h-screen sticky top-0 w-56 flex-col">
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

  const SidebarContent = () => (
    <>
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

        {/* Desktop collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:block p-1 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded transition`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className={`lg:hidden p-1 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded transition`}
        >
          <X className="w-5 h-5" />
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

      {/* Navigation with Custom Scrollbar */}
      <nav className={`flex-1 overflow-y-auto p-3 space-y-1 ${isLight ? 'scrollbar-custom-light' : 'scrollbar-custom'}`}>

        {/* TO DO Section */}
        <div>
          <button
            onClick={() => toggleSection('todo')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            {!isCollapsed && (
              <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                To Do
              </span>
            )}
            {isCollapsed && (
              <div className="w-8 h-px bg-gradient-to-r from-pink-500 to-pink-600" />
            )}
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
                onClick={() => handleNavigation('Tasks', 'todo', '/dashboard/todo/tasks')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Calendar className="w-4 h-4" />}
                label="Schedule"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Schedule'}
                onClick={() => handleNavigation('Schedule', 'todo', '/dashboard/todo/schedule')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Lightbulb className="w-4 h-4" />}
                label="Daily Highlights"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Daily Highlights'}
                onClick={() => handleNavigation('Daily Highlights', 'todo', '/dashboard/todo/daily-highlights')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<FolderOpen className="w-4 h-4" />}
                label="Projects"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Projects'}
                onClick={() => handleNavigation('Projects', 'todo', '/dashboard/todo/projects')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="ToDo Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'ToDo Notes'}
                onClick={() => handleNavigation('ToDo Notes', 'todo', '/dashboard/todo/notes')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<TrendingUp className="w-4 h-4" />}
                label="Trends"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Trends'}
                onClick={() => handleNavigation('Trends', 'todo', '/dashboard/todo/trends')}
                isLight={isLight}
              />
            </div>
          )}
        </div>

        {/* ROUTINE Section */}
        <div>
          <button
            onClick={() => toggleSection('routine')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            {!isCollapsed && (
              <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Routine
              </span>
            )}
            {isCollapsed && (
              <div className="w-8 h-px bg-gradient-to-r from-pink-500 to-pink-600" />
            )}
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
                onClick={() => handleNavigation('Morning', 'routine', '/dashboard/routine/morning')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Moon className="w-4 h-4" />}
                label="Evening"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Evening'}
                onClick={() => handleNavigation('Evening', 'routine', '/dashboard/routine/evening')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Heart className="w-4 h-4" />}
                label="Health"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Health'}
                onClick={() => handleNavigation('Health', 'routine', '/dashboard/routine/health')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Target className="w-4 h-4" />}
                label="Habits"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Habits'}
                onClick={() => handleNavigation('Habits', 'routine', '/dashboard/routine/habits')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="Key Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Key Notes'}
                onClick={() => handleNavigation('Key Notes', 'routine', '/dashboard/routine/keynotes')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Activity className="w-4 h-4" />}
                label="Progress"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Progress'}
                onClick={() => handleNavigation('Progress', 'routine', '/dashboard/routine/progress')}
                isLight={isLight}
              />
            </div>
          )}
        </div>

        {/* TRADING Section */}
        <div>
          <button
            onClick={() => toggleSection('trading')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} rounded-lg transition`}
          >
            {!isCollapsed && (
              <span className={`font-semibold text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Trading
              </span>
            )}
            {isCollapsed && (
              <div className="w-8 h-px bg-gradient-to-r from-pink-500 to-pink-600" />
            )}
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
                onClick={() => handleNavigation('Dashboard', 'trading', '/dashboard/trading/dashboard')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Shield className="w-4 h-4" />}
                label="Rules"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Rules'}
                onClick={() => handleNavigation('Rules', 'trading', '/dashboard/trading/rules')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<Layers className="w-4 h-4" />}
                label="Strategies"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Strategies'}
                onClick={() => handleNavigation('Strategies', 'trading', '/dashboard/trading/strategies')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<BookOpen className="w-4 h-4" />}
                label="Journal"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Journal'}
                onClick={() => handleNavigation('Journal', 'trading', '/dashboard/trading/journal')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<TestTube className="w-4 h-4" />}
                label="Backtest"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Backtest'}
                onClick={() => handleNavigation('Backtest', 'trading', '/dashboard/trading/backtest')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<StickyNote className="w-4 h-4" />}
                label="Quick Notes"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Quick Notes'}
                onClick={() => handleNavigation('Quick Notes', 'trading', '/dashboard/trading/quick-notes')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<FileText className="w-4 h-4" />}
                label="Reports"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Reports'}
                onClick={() => handleNavigation('Reports', 'trading', '/dashboard/trading/reports')}
                isLight={isLight}
              />
              <SidebarItem
                icon={<PieChart className="w-4 h-4" />}
                label="Analytics"
                isCollapsed={isCollapsed}
                isActive={activeItem === 'Analytics'}
                onClick={() => handleNavigation('Analytics', 'trading', '/dashboard/trading/analytics')}
                isLight={isLight}
              />
            </div>
          )}
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
          isLight ? 'bg-white border border-slate-200' : 'bg-slate-800 border border-slate-700'
        }`}
      >
        <Menu className={`w-6 h-6 ${isLight ? 'text-slate-900' : 'text-white'}`} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex ${
          isLight ? 'bg-white border-r border-slate-200' : 'bg-slate-900'
        } text-${isLight ? 'slate-900' : 'white'} h-screen sticky top-0 transition-all duration-100 flex-col ${
          isCollapsed ? "w-16" : "w-56"
        }`}
        suppressHydrationWarning
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 flex flex-col ${
          isLight ? 'bg-white' : 'bg-slate-900'
        } text-${isLight ? 'slate-900' : 'white'} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        suppressHydrationWarning
      >
        <SidebarContent />
      </aside>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  isCollapsed,
  isActive,
  onClick,
  isLight
}: {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  isLight: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition group text-sm ${
        isActive
          ? (isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600 text-white')
          : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800 hover:text-white')
      }`}
      title={isCollapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
}