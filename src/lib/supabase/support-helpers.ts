// ============================================
// FILE: src/lib/supabase/support-helpers.ts
// Create this new file
// ============================================

import { createClient } from "./client";
import type { Feedback, HelpRequest, FeedbackCategory, HelpPriority } from "@/types/database";

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
 * Get all feedback (admin only)
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
 * Update feedback status
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
 * Get all help requests (admin only)
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
 * Update help request status
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