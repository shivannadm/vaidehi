// src/types/database.ts
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

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface TopHeaderProps {
  onSettingsOpen: () => void;
  currentSection: string;
}

export interface StreakCounterProps {
  streak: number;
}

export interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export interface ProfileDropdownProps {
  profile: Profile | null;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface UploadAvatarResponse {
  url: string | null;
  error: Error | null;
}