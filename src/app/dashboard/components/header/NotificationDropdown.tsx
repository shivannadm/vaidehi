// src/app/dashboard/components/header/NotificationDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/database";

export default function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadNotifications();

        // Set up real-time subscription
        const supabase = createClient();
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                () => {
                    loadNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }

        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showNotifications]);

    const loadNotifications = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await getNotifications(user.id);

            if (error) {
                console.error("Error loading notifications:", error);
                return;
            }

            setNotifications(data || []);
        } catch (error) {
            console.error("Error in loadNotifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        const { error } = await markNotificationAsRead(id);
        if (!error) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await markAllNotificationsAsRead(user.id);
        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleDeleteNotification = async (id: string) => {
        const { error } = await deleteNotification(id);
        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 max-h-96 overflow-y-auto z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            Loading...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            No notifications
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`relative group px-4 py-3 hover:bg-slate-50 transition border-b border-slate-100 ${!notif.read ? 'bg-indigo-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {!notif.read && (
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 pr-6">{notif.message}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {formatTime(notif.created_at)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNotification(notif.id)}
                                        className="absolute top-3 right-3 p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition"
                                    >
                                        <X className="w-4 h-4 text-slate-500" />
                                    </button>
                                </div>
                                {!notif.read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="absolute bottom-2 right-3 text-xs text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}