// ============================================
// FILE: src/lib/supabase/support-helpers.ts
// ✅ FIXED: Now sends to ALL users, not just admins
// ============================================

import { createClient } from "./client";
import type { Feedback, HelpRequest, FeedbackCategory, HelpPriority, ContactMessage } from "@/types/database";

// ============================================
// ADMIN CHECK
// ============================================

/**
 * Check if current user is admin
 */
export async function isUserAdmin() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  return !error && !!data;
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

/**
 * Send notification to ALL users in the system
 * ✅ FIXED: Now queries 'profiles' table instead of 'admin_users'
 * @param message - The notification message to send
 * @returns Object with data (sent status and count) or error
 */
export async function sendNotificationToAllUsers(message: string) {
  try {
    const supabase = createClient();
    
    // Verify admin user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Auth error:', userError);
      return { data: null, error: new Error('Not authenticated') };
    }

    console.log('✅ Authenticated as:', user.id);

    // Check admin status
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error('❌ Not authorized');
      return { data: null, error: new Error('Unauthorized: Admin access required') };
    }

    console.log('✅ Admin verified');

    // ============================================
    // Use RPC function to send notifications
    // This bypasses RLS completely
    // ============================================
    
    console.log('📤 Calling RPC function...');
    
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('send_notification_to_all_users', {
        notification_message: message.trim()
      });

    if (rpcError) {
      console.error('❌ RPC error:', rpcError);
      return { data: null, error: rpcError };
    }

    console.log('✅ RPC result:', rpcResult);

    // RPC function returns JSON with {sent, count, message}
    if (rpcResult && rpcResult.sent) {
      console.log(`✅ Successfully sent ${rpcResult.count} notifications`);
      
      return { 
        data: { 
          sent: true, 
          count: rpcResult.count 
        }, 
        error: null 
      };
    } else {
      console.error('❌ RPC failed:', rpcResult?.error);
      return { 
        data: null, 
        error: new Error(rpcResult?.error || 'Failed to send notifications') 
      };
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { data: null, error: error as Error };
  }
}

// ============================================
// FEEDBACK OPERATIONS
// ============================================

/**
 * Submit user feedback
 */
export async function submitFeedback(data: {
  user_id: string;
  user_name: string;
  user_email: string;
  category: FeedbackCategory;
  message: string;
}) {
  const supabase = createClient();

  const { data: feedback, error } = await supabase
    .from("feedback")
    .insert({
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      category: data.category,
      message: data.message,
      status: 'pending',
    })
    .select()
    .single();

  return { data: feedback, error };
}

/**
 * Get all feedback (admin can see all, users see only their own)
 */
export async function getAllFeedback() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get user's own feedback
 */
export async function getUserFeedback(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update feedback status (admin only)
 */
export async function updateFeedbackStatus(feedbackId: string, status: 'pending' | 'resolved') {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feedback")
    .update({ status })
    .eq("id", feedbackId)
    .select()
    .single();

  return { data, error };
}

// ============================================
// HELP REQUEST OPERATIONS
// ============================================

/**
 * Submit help request
 */
export async function submitHelpRequest(data: {
  user_id: string;
  user_name: string;
  user_email: string;
  priority: HelpPriority;
  subject: string;
  message: string;
}) {
  const supabase = createClient();

  const { data: helpRequest, error } = await supabase
    .from("help_requests")
    .insert({
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      priority: data.priority,
      subject: data.subject,
      message: data.message,
      status: 'pending',
    })
    .select()
    .single();

  return { data: helpRequest, error };
}

/**
 * Get all help requests (admin can see all, users see only their own)
 */
export async function getAllHelpRequests() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("help_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get user's own help requests
 */
export async function getUserHelpRequests(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("help_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update help request status (admin only)
 */
export async function updateHelpRequestStatus(requestId: string, status: 'pending' | 'resolved') {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("help_requests")
    .update({ status })
    .eq("id", requestId)
    .select()
    .single();

  return { data, error };
}

// ============================================
// CONTACT MESSAGE OPERATIONS
// ============================================

/**
 * Submit contact message (public - no auth required)
 */
export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = createClient();

  const { data: contactMessage, error } = await supabase
    .from("contact_messages")
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'pending',
    })
    .select()
    .single();

  return { data: contactMessage, error };
}

/**
 * Get all contact messages (admin only)
 */
export async function getAllContactMessages() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update contact message status (admin only)
 */
export async function updateContactMessageStatus(messageId: string, status: 'pending' | 'resolved') {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", messageId)
    .select()
    .single();

  return { data, error };
}

// ============================================
// ADMIN MANAGEMENT
// ============================================

/**
 * Add user as admin
 */
export async function addAdmin(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ user_id: userId })
    .select()
    .single();

  return { data, error };
}

/**
 * Remove admin status
 */
export async function removeAdmin(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("user_id", userId);

  return { error };
}

/**
 * Get all admins
 */
export async function getAllAdmins() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(`
      user_id,
      created_at
    `);

  return { data, error };
}

// ============================================
// ADMIN STATISTICS
// ============================================

/**
 * Get support statistics for admin dashboard
 */
export async function getSupportStatistics() {
  const supabase = createClient();

  const [feedbackResult, helpResult] = await Promise.all([
    supabase.from("feedback").select("status"),
    supabase.from("help_requests").select("status, priority")
  ]);

  const feedbackData = feedbackResult.data || [];
  const helpData = helpResult.data || [];

  return {
    feedback: {
      total: feedbackData.length,
      pending: feedbackData.filter(f => f.status === 'pending').length,
      resolved: feedbackData.filter(f => f.status === 'resolved').length,
    },
    helpRequests: {
      total: helpData.length,
      pending: helpData.filter(h => h.status === 'pending').length,
      resolved: helpData.filter(h => h.status === 'resolved').length,
      byPriority: {
        low: helpData.filter(h => h.priority === 'low').length,
        medium: helpData.filter(h => h.priority === 'medium').length,
        high: helpData.filter(h => h.priority === 'high').length,
      }
    }
  };
}