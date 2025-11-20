"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

interface TopHeaderProps {
    onSettingsOpen: () => void;
    currentSection: string;
    theme: 'light' | 'dark' | 'system';
    onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export default function TopHeader({ onSettingsOpen, currentSection, theme, onThemeChange }: TopHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            message: 'Your subscription expires in 7 days',
            timestamp: new Date(),
            read: false
        },
        {
            id: '2',
            message: 'New feature: Backtest module is now available!',
            timestamp: new Date(Date.now() - 3600000),
            read: false
        }
    ]);

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

    const handleSettingsClick = () => {
        setShowProfileMenu(false);
        onSettingsOpen();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
            <div className="flex items-center justify-between">

                {/* Left: Current Section */}
                <div>
                    <h1 className="text-xl font-bold text-slate-900">{currentSection}</h1>
                </div>

                {/* Center: Date & Time */}
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{formatDate(currentTime)}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono font-medium">{formatTime(currentTime)}</span>
                    </div>
                </div>

                {/* Right: Streak, Notifications, Profile, Theme */}
                <div className="flex items-center gap-3">

                    {/* Streak Counter */}
                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                        <span className="text-xl">🔥</span>
                        <div className="flex items-center gap-1">
                            <span className="text-base font-bold text-orange-600">7</span>
                            <span className="text-xs text-slate-600 font-medium">Streaks</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            <Bell className="w-5 h-5 text-slate-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 max-h-96 overflow-y-auto">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <button
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition border-b border-slate-100 ${
                                                !notif.read ? 'bg-indigo-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {!notif.read && (
                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-700">{notif.message}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {notif.timestamp.toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition"
                        >
                            <span className="font-medium text-slate-700 text-sm">The!</span>
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                                        Profile
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

                                {/* Theme Toggle Inside Dropdown */}
                                <div className="px-4 py-2 border-t border-slate-200 mt-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Theme</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onThemeChange('light')}
                                            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                                                theme === 'light' 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            Light
                                        </button>
                                        <button
                                            onClick={() => onThemeChange('dark')}
                                            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                                                theme === 'dark' 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            Dark
                                        </button>
                                        <button
                                            onClick={() => onThemeChange('system')}
                                            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                                                theme === 'system' 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            Auto
                                        </button>
                                    </div>
                                </div>

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
                </div>
            </div>
        </header>
    );
}