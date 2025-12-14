// src/app/dashboard/components/header/TopHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Zap } from "lucide-react";
import StreakCounter from "./StreakCounter";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import type { Theme } from "@/types/database";

interface TopHeaderProps {
  onSettingsOpen: () => void;
  onProfileOpen: () => void;
  currentSection: string;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function TopHeader({
  onSettingsOpen,
  onProfileOpen,
  currentSection,
  theme,
  onThemeChange
}: TopHeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLight = theme === 'light';

  if (!mounted) {
    return (
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{currentSection}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>Loading...</span>
          </div>
          <div className="flex items-center gap-3" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
      } border-b px-3 sm:px-4 lg:px-6 py-2 sm:py-0.5 sticky top-0 z-20`}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Current Section - with responsive sizing */}
        <div className="flex-shrink min-w-0 ml-14 lg:ml-0">
          <h1
            className={`text-sm sm:text-base lg:text-xl font-bold truncate ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {currentSection}
          </h1>
        </div>

        {/* Center: Date & Time - hidden on small screens, visible on md+ */}
        <div
          className={`hidden lg:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          {currentTime ? (
            <>
              <div className="flex items-center gap-1.5 lg:gap-2">
                <svg
                  className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium whitespace-nowrap hidden lg:inline">
                  {formatDate(currentTime)}
                </span>
                <span className="font-medium whitespace-nowrap lg:hidden">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>
              <div className="flex items-center gap-1.5 lg:gap-2">
                <svg
                  className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-mono font-medium whitespace-nowrap">
                  {formatTime(currentTime)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Loading...</span>
            </div>
          )}
        </div>

        {/* Right: Docs, Go Pro, Streak, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          
          {/* Docs Button - NEW */}
          <button
            onClick={() => window.open('/dashboard/docs', '_blank')}
            className={`hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition text-xs sm:text-sm ${
              isLight 
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100' 
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-medium hidden lg:inline">Docs</span>
          </button>

          {/* Mobile Docs Button - Icon Only */}
          <button
            onClick={() => window.open('/dashboard/docs', '_blank')}
            className={`sm:hidden p-2 rounded-lg transition ${
              isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-700'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />
          </button>

          {/* Go Pro Button - NEW */}
          <button
            onClick={() => window.open('/dashboard/go-pro', '_blank')}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition shadow-lg shadow-orange-500/20 text-xs sm:text-sm"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-semibold">Pro</span>
          </button>
          
          {/* Streak Counter - Responsive */}
          <div className="hidden sm:block">
            <StreakCounter theme={theme} />
          </div>

          {/* Notifications */}
          <NotificationDropdown theme={theme} />

          {/* User Profile */}
          <ProfileDropdown
            onProfileClick={onProfileOpen}
            onSettingsClick={onSettingsOpen}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>

      {/* Mobile-only Date/Time bar - Shows below main header on small screens */}
      <div
        className={`lg:hidden flex items-center justify-center gap-3 text-xs mt-2 pt-2 border-t ${
          isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-slate-700'
        }`}
      >
        {currentTime && (
          <>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{formatDate(currentTime)}</span>
            </div>
            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-mono font-medium">{formatTime(currentTime)}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}