// src/app/dashboard/components/DashboardShell.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar/Sidebar";
import TopHeader from "./header/TopHeader";
import ProfileModal from "./modals/ProfileModal";
import SettingsModal from "./modals/SettingsModal";
import type { Theme } from "@/types/database";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("Home");
  const [activeItem, setActiveItem] = useState("Home");
  
  // Initialize theme from localStorage immediately (no flash)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || 'dark';
    }
    return 'dark';
  });
  const [mounted, setMounted] = useState(false);
  
  // Initialize actualTheme from localStorage
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return savedTheme === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  // Mount and watch for theme changes
  useEffect(() => {
    setMounted(true);
    
    // Check actual theme from HTML element
    const isDark = document.documentElement.classList.contains('dark');
    setActualTheme(isDark ? 'dark' : 'light');
    
    // Watch for theme changes on HTML element
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setActualTheme(isDark ? 'dark' : 'light');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Update section based on pathname
  useEffect(() => {
    if (pathname === '/dashboard') {
      setCurrentSection('Home');
      setActiveItem('Home');
    } else if (pathname.includes('/todo/')) {
      // Extract the page name from path
      const pageName = pathname.split('/').pop();
      const formattedName = pageName
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCurrentSection(formattedName || 'Tasks');
    } else if (pathname.includes('/routine/')) {
      const pageName = pathname.split('/').pop();
      const formattedName = pageName
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCurrentSection(formattedName || 'Morning');
    } else if (pathname.includes('/trading/')) {
      const pageName = pathname.split('/').pop();
      const formattedName = pageName
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCurrentSection(formattedName || 'Dashboard');
    }
  }, [pathname]);

  // Load saved theme from Supabase and sync with localStorage
  useEffect(() => {
    const loadAndSyncTheme = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { getUserPreferences } = await import("@/lib/supabase/helpers");
        
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await getUserPreferences(user.id);
          if (data?.theme) {
            setTheme(data.theme);
            localStorage.setItem('theme', data.theme);
            applyTheme(data.theme);
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadAndSyncTheme();
  }, []);

  // Apply theme function
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleItemClick = (item: string, section: string) => {
    setActiveItem(item);
    setCurrentSection(item);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const isLight = actualTheme === 'light';

  // Return placeholder during SSR
  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-900">
        <div className="w-56 bg-slate-900"></div>
        <div className="flex-1 flex flex-col">
          <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
            <h1 className="text-xl font-bold text-white">Loading...</h1>
          </header>
          <main className="flex-1 bg-slate-900"></main>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
        {/* Sidebar */}
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleItemClick}
          theme={theme}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <TopHeader
            onSettingsOpen={() => setIsSettingsOpen(true)}
            onProfileOpen={() => setIsProfileOpen(true)}
            currentSection={currentSection}
            theme={theme}
            onThemeChange={handleThemeChange}
          />

          {/* Page Content */}
          <main className={`flex-1 overflow-y-auto p-6 ${
            isLight ? 'bg-slate-50' : 'bg-slate-900'
          }`}>
            {children}
          </main>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
      />
    </>
  );
}