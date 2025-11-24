// src/app/dashboard/components/header/TopHeader.tsx
"use client";

import { useState, useEffect } from "react";
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
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

    // Only render after mount to avoid hydration issues
    useEffect(() => {
        setMounted(true);
        
        // Check actual theme from HTML element
        const isDark = document.documentElement.classList.contains('dark');
        setActualTheme(isDark ? 'dark' : 'light');
        
        // Watch for theme changes
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

    // Only start the clock after component mounts (client-side only)
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
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const isLight = theme === 'light';

    // Return placeholder during SSR
    if (!mounted) {
        return (
            <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {currentSection}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span>Loading...</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Placeholder elements */}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
            } border-b px-4 py-1 sticky top-0 z-20`}>
            <div className="flex items-center justify-between">

                {/* Left: Current Section */}
                <div>
                    <h1 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                        {currentSection}
                    </h1>
                </div>

                {/* Center: Date & Time */}
                <div className={`flex items-center gap-3 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                    {currentTime ? (
                        <>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{formatDate(currentTime)}</span>
                            </div>
                            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-mono font-medium">{formatTime(currentTime)}</span>
                            </div>
                        </>
                    ) : (
                        // Placeholder during SSR to prevent hydration mismatch
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Streak, Notifications, Profile */}
                <div className="flex items-center gap-3">

                    {/* Streak Counter */}
                    <StreakCounter theme={theme} />

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
        </header>
    );
}