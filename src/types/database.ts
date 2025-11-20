// Create this file: src/types/database.ts
// ============================================
// DATABASE TYPES & INTERFACES
// ============================================

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    timezone: string;
    subscription_tier: 'starter' | 'pro' | 'team';
    subscription_status: 'active' | 'cancelled' | 'expired';
    trial_ends_at: string;
    created_at: string;
    updated_at: string;
}

export interface UserStreak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    message: string;
    read: boolean;
    created_at: string;
    expires_at: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    theme: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
    updated_at: string;
}

export type Theme = 'light' | 'dark' | 'system';