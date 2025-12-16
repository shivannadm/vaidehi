// ============================================
// FILE: src/app/dashboard/components/DashboardShell.tsx
// ✅ FIXED: Shows "Home" and footer ONLY on /dashboard home page
// ============================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./sidebar/Sidebar";
import TopHeader from "./header/TopHeader";
import ProfileModal from "./modals/ProfileModal";
import SettingsModal from "./modals/SettingsModal";
import { TimerProvider } from "./TimerContext";
import type { Theme } from "@/types/database";

interface DashboardShellProps {
  children: React.ReactNode;
}

// Dashboard Footer Component (only shows on home page)
function DashboardFooter({ theme }: { theme: Theme }) {
  const currentYear = new Date().getFullYear();
  const isLight = theme === 'light';

  return (
    <footer className={`${isLight ? 'bg-white border-t border-slate-200' : 'bg-slate-900 border-t border-slate-700'} mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <img
                  src="/assets/logo/logo.png"
                  alt="Vaidehi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`font-bold text-xl ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-indigo-600">V</span>aidehi
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Minimal trading journal & routine optimizer. Built for traders who want to improve consistently.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Product</h4>
            <ul className="space-y-3">
              <li><a href="/docs" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Docs</a></li>
              <li><a href="/pnl-report" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>P&L Report</a></li>
              <li><a href="/todo" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>TODO</a></li>
              <li><a href="/routine" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Routine</a></li>
              <li><a href="/trading" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Trading</a></li>
              <li><a href="/#pricing" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Resources</h4>
            <ul className="space-y-3">
              <li><a href="/#how-it-works" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>How it works</a></li>
              <li><a href="/faq" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>FAQ</a></li>
              <li><a href="/support" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Support</a></li>
              <li><a href="/api" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>API</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Company</h4>
            <ul className="space-y-3">
              <li><a href="/about" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>About</a></li>
              <li><a href="/blog" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Blog</a></li>
              <li><a href="/contact" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Contact</a></li>
              <li><a href="/privacy" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Privacy</a></li>
              <li><a href="/terms" className={`text-sm ${isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${isLight ? 'border-slate-200' : 'border-slate-700'} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm text-center md:text-left ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            © {currentYear} Vaidehi. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className={`text-sm ${isLight ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Privacy Policy</a>
            <a href="/terms" className={`text-sm ${isLight ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Terms of Service</a>
            <a href="/contact" className={`text-sm ${isLight ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'} transition-colors`}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Home");
  const [currentSection, setCurrentSection] = useState("Home"); // ✅ Changed from "Dashboard"
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('vaidehi-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Get userId for TimerProvider
    const initUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    initUser();
  }, []);

  // Listen for custom header section update events
  useEffect(() => {
    const handleHeaderUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.section) {
        setCurrentSection(event.detail.section);
      }
    };

    window.addEventListener('updateHeaderSection', handleHeaderUpdate as EventListener);

    return () => {
      window.removeEventListener('updateHeaderSection', handleHeaderUpdate as EventListener);
    };
  }, []);

  // Set active item and section based on pathname
  useEffect(() => {
    if (!mounted) return;

    const path = pathname.toLowerCase();

    // ✅ Home - Show "Home" not "Dashboard"
    if (path === '/dashboard') {
      setActiveItem('Home');
      setCurrentSection('Home');
      return;
    }

    // TO DO Section
    if (path.includes('/todo/tasks')) {
      setActiveItem('Tasks');
      setCurrentSection('Tasks');
    } else if (path.includes('/todo/schedule')) {
      setActiveItem('Schedule');
      setCurrentSection('Schedule');
    } else if (path.includes('/todo/daily-highlights')) {
      setActiveItem('Daily Highlights');
      setCurrentSection('Daily Highlights');
    } else if (path.includes('/todo/projects')) {
      setActiveItem('Projects');
      setCurrentSection('Projects');
    } else if (path.includes('/todo/notes')) {
      setActiveItem('ToDo Notes');
      setCurrentSection('ToDo Notes');
    } else if (path.includes('/todo/trends')) {
      setActiveItem('Trends');
      setCurrentSection('Trends');
    }

    // ROUTINE Section
    else if (path.includes('/routine/morning')) {
      setActiveItem('Morning');
      setCurrentSection('Morning Routine');
    } else if (path.includes('/routine/evening')) {
      setActiveItem('Evening');
      setCurrentSection('Evening Routine');
    } else if (path.includes('/routine/health')) {
      setActiveItem('Health');
      setCurrentSection('Health Tracking');
    } else if (path.includes('/routine/habits')) {
      setActiveItem('Habits');
      setCurrentSection('Habits');
    } else if (path.includes('/routine/keynotes')) {
      setActiveItem('Key Notes');
      setCurrentSection('Key Notes');
    } else if (path.includes('/routine/progress')) {
      setActiveItem('Progress');
      setCurrentSection('Progress');
    }

    // TRADING Section
    else if (path.includes('/trading/dashboard')) {
      setActiveItem('Dashboard');
      setCurrentSection('Trading Dashboard');
    } else if (path.includes('/trading/rules')) {
      setActiveItem('Rules');
      setCurrentSection('Trading Rules');
    } else if (path.includes('/trading/strategies')) {
      setActiveItem('Strategies');
      setCurrentSection('Strategies');
    } else if (path.includes('/trading/journal')) {
      setActiveItem('Journal');
      setCurrentSection('Trading Journal');
    } else if (path.includes('/trading/backtest')) {
      setActiveItem('Backtest');
      setCurrentSection('Backtesting');
    } else if (path.includes('/trading/quick-notes')) {
      setActiveItem('Quick Notes');
      setCurrentSection('Quick Notes');
    } else if (path.includes('/trading/analytics')) {
      setActiveItem('Analytics');
      setCurrentSection('Analytics');
    }
  }, [pathname, mounted]);

  const handleItemClick = (item: string, section: string) => {
    setActiveItem(item);
    
    // ✅ Fixed mapping - "home" maps to "Home"
    const sectionMap: { [key: string]: string } = {
      'home': 'Home',
      'todo': item,
      'routine': item === 'Morning' ? 'Morning Routine' : 
                 item === 'Evening' ? 'Evening Routine' : 
                 item === 'Health' ? 'Health Tracking' : item,
      'trading': item === 'Dashboard' ? 'Trading Dashboard' :
                 item === 'Journal' ? 'Trading Journal' :
                 item === 'Rules' ? 'Trading Rules' : item
    };

    setCurrentSection(sectionMap[section] || item);
  };

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (newTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('vaidehi-theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-900">
        <div className="w-56 bg-slate-900 border-r border-slate-800"></div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-slate-800 border-b border-slate-700"></div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const isLight = theme === 'light';
  
  // ✅ Check if we're on the home page
  const isHomePage = pathname === '/dashboard';

  return (
    <TimerProvider userId={userId || null}>
      <div className={`flex h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleItemClick}
          theme={theme}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader
            onSettingsOpen={() => setIsSettingsOpen(true)}
            onProfileOpen={() => setIsProfileOpen(true)}
            currentSection={currentSection}
            theme={theme}
            onThemeChange={handleThemeChange}
          />

          {/* ✅ Conditional layout: footer only on home page */}
          {isHomePage ? (
            // Home page: scrollable content + footer
            <div className="flex-1 overflow-y-auto flex flex-col">
              <main className={`flex-1 ${isLight ? 'bg-slate-50' : 'bg-slate-900'} p-4 sm:p-6`}>
                {children}
              </main>
              <DashboardFooter theme={theme} />
            </div>
          ) : (
            // Other pages: just scrollable content, no footer
            <main className={`flex-1 overflow-y-auto ${isLight ? 'bg-slate-50' : 'bg-slate-900'} p-4 sm:p-6`}>
              {children}
            </main>
          )}
        </div>

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          theme={theme}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
        />
      </div>
    </TimerProvider>
  );
}