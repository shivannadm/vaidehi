// src/app/dashboard/components/DashboardShell.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import TopHeader from "./header/TopHeader";
import ProfileModal from "./modals/ProfileModal";
import SettingsModal from "./modals/SettingsModal";
import type { Theme } from "@/types/database";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [theme, setTheme] = useState<Theme>('dark');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Close modals when clicking outside (handled in individual modals)
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

  const isLight = theme === 'light';

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
          <main className={`flex-1 overflow-y-auto p-6 ${isLight ? 'bg-slate-50' : 'bg-slate-900'
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