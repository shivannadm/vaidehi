"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

interface TopHeaderProps {
    onSettingsOpen: () => void;
}

export default function TopHeader({ onSettingsOpen }: TopHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

    // Live time update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        // Add theme logic here later
        setShowThemeMenu(false);
    };

    const handleSettingsClick = () => {
        setShowProfileMenu(false);
        onSettingsOpen();
    };

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">

                {/* Left: Current Section */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                </div>

                {/* Center: Date & Time */}
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{formatDate(currentTime)}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono font-medium">{formatTime(currentTime)}</span>
                    </div>
                </div>

                {/* Right: Streak, Profile, Theme */}
                <div className="flex items-center gap-4">

                    {/* Streak Counter */}
                    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                        <span className="text-2xl">🔥</span>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 uppercase tracking-wide">Streaks</span>
                            <span className="text-lg font-bold text-orange-600">7</span>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 hover:bg-slate-50 px-3 py-2 rounded-lg transition"
                        >
                            <span className="font-medium text-slate-700">The!</span>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                N
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                                <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Edit Profile
                                    </div>
                                </a>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </div>
                                </button>
                                <hr className="my-2 border-slate-200" />
                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowThemeMenu(!showThemeMenu)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            {theme === 'light' && <Sun className="w-5 h-5 text-slate-700" />}
                            {theme === 'dark' && <Moon className="w-5 h-5 text-slate-700" />}
                            {theme === 'system' && <Monitor className="w-5 h-5 text-slate-700" />}
                        </button>

                        {/* Theme Dropdown */}
                        {showThemeMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-3"
                                >
                                    <Sun className="w-4 h-4" />
                                    Light
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-3"
                                >
                                    <Moon className="w-4 h-4" />
                                    Dark
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-3"
                                >
                                    <Monitor className="w-4 h-4" />
                                    System
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}