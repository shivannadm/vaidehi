// src/lib/supabase/helpers.ts
// ============================================
// SUPABASE HELPER FUNCTIONS
// ============================================

import { createClient } from "@/lib/supabase/client";
import type { Profile, UserStreak, Notification, UserPreferences } from "@/types/database";

const supabase = createClient();

// ============================================
// PROFILE OPERATIONS
// ============================================

export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return { data: data as Profile | null, error };
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

    return { data: data as Profile | null, error };
}

export async function uploadAvatar(userId: string, file: File) {
    try {
        // Delete old avatar if exists
        const { data: oldFiles } = await supabase.storage
            .from('avatars')
            .list(userId);

        if (oldFiles && oldFiles.length > 0) {
            await supabase.storage
                .from('avatars')
                .remove(oldFiles.map(f => `${userId}/${f.name}`));
        }

        // Upload new avatar
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        return { url: publicUrl, error: null };
    } catch (error) {
        return { url: null, error: error as Error };
    }
}

// ============================================
// STREAK OPERATIONS
// ============================================

export async function getUserStreak(userId: string) {
    const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

    return { data: data as UserStreak | null, error };
}

export async function updateUserStreak(userId: string) {
    const { error } = await supabase.rpc('update_user_streak', {
        p_user_id: userId
    });

    return { error };
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export async function getNotifications(userId: string) {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    return { data: data as Notification[] | null, error };
}

export async function markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    return { error };
}

export async function markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

    return { error };
}

export async function deleteNotification(notificationId: string) {
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

    return { error };
}

export async function createNotification(userId: string, message: string) {
    const { data, error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            message,
            expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
        })
        .select()
        .single();

    return { data: data as Notification | null, error };
}

// ============================================
// USER PREFERENCES OPERATIONS
// ============================================

export async function getUserPreferences(userId: string) {
    const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

    return { data: data as UserPreferences | null, error };
}

export async function updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
) {
    const { data, error } = await supabase
        .from('user_preferences')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

    return { data: data as UserPreferences | null, error };
}

// ============================================
// AUTH OPERATIONS
// ============================================

export async function updatePassword(currentPassword: string, newPassword: string) {
    // First verify current password by attempting to sign in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
        return { error: new Error('No user found') };
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
    });

    if (signInError) {
        return { error: new Error('Current password is incorrect') };
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    return { error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}