// src/app/dashboard/components/header/ProfileDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { getProfile, getUserPreferences, updateUserPreferences, signOut } from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Theme } from "@/types/database";

interface ProfileDropdownProps {
    onProfileClick: () => void;
    onSettingsClick: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export default function ProfileDropdown({
    onProfileClick,
    onSettingsClick,
    theme,
    onThemeChange
}: ProfileDropdownProps) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadProfile();
        loadUserTheme();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showMenu]);

    const loadProfile = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await getProfile(user.id);

            if (error) {
                console.error("Error loading profile:", error);
                return;
            }

            setProfile(data);
        } catch (error) {
            console.error("Error in loadProfile:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserTheme = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data } = await getUserPreferences(user.id);
            if (data?.theme) {
                onThemeChange(data.theme);
            }
        } catch (error) {
            console.error("Error loading theme:", error);
        }
    };

    const handleThemeChange = async (newTheme: Theme) => {
        onThemeChange(newTheme);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await updateUserPreferences(user.id, { theme: newTheme });
        }
    };

    const handleLogout = async () => {
        const { error } = await signOut();
        if (!error) {
            router.push('/');
        } else {
            console.error("Error logging out:", error);
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const displayName = profile?.full_name || 'User';
    const isLight = theme === 'light';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${isLight
                        ? 'hover:bg-slate-100'
                        : 'hover:bg-slate-700/50'
                    }`}
            >
                <span className={`font-medium text-sm ${isLight ? 'text-slate-700' : 'text-white'
                    }`}>{displayName}</span>
                {profile?.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-slate-700/20"
                    />
                ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {getInitials(displayName)}
                    </div>
                )}
            </button>

            {/* Profile Dropdown */}
            {showMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border py-2 z-50 ${isLight
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-800 border-slate-700'
                    }`}>
                    <button
                        onClick={() => {
                            setShowMenu(false);
                            onProfileClick();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition ${isLight
                                ? 'text-slate-700 hover:bg-slate-50'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4" />
                            Profile
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            setShowMenu(false);
                            onSettingsClick();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition ${isLight
                                ? 'text-slate-700 hover:bg-slate-50'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <SettingsIcon className="w-4 h-4" />
                            Settings
                        </div>
                    </button>

                    {/* Theme Toggle */}
                    <div className={`px-4 py-2 border-t mt-2 ${isLight ? 'border-slate-200' : 'border-slate-700'
                        }`}>
                        <p className={`text-xs uppercase tracking-wide mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}>Theme</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${theme === 'light'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : isLight
                                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${theme === 'dark'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : isLight
                                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => handleThemeChange('system')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${theme === 'system'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : isLight
                                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                Auto
                            </button>
                        </div>
                    </div>

                    <hr className={`my-2 ${isLight ? 'border-slate-200' : 'border-slate-700'
                        }`} />

                    <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm transition ${isLight
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-red-400 hover:bg-red-900/20'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}