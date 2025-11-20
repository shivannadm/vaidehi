"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import SettingsModal from "./SettingsModal";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  // Handle system theme preference
  useEffect(() => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Apply system preference logic here
    }
  }, [theme]);

  const handleItemClick = (item: string, section: string) => {
    setActiveItem(item);
    setCurrentSection(item);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Theme persistence can be added here (localStorage, etc.)
  };

  return (
    <>
      <div className="flex h-screen bg-slate-50">
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
            currentSection={currentSection}
            theme={theme}
            onThemeChange={handleThemeChange}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}