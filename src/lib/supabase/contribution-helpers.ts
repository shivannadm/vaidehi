// ============================================
// FILE: src/lib/supabase/contribution-helpers.ts
// 💝 Complete contribution system with leaderboard & badges
// ============================================

import { createClient } from "./client";
import type { Contribution, CreateContribution } from "@/types/database";

// ============================================
// CREATE CONTRIBUTION
// ============================================
export async function createContribution(
  contribution: CreateContribution
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .insert(contribution)
    .select()
    .single();

  return { data, error };
}

// ============================================
// GET ALL CONTRIBUTIONS (Admin Only)
// ============================================
export async function getAllContributions() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

// ============================================
// GET USER CONTRIBUTIONS
// ============================================
export async function getUserContributions(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "success")
    .order("created_at", { ascending: false });

  return { data, error };
}

// ============================================
// GET CONTRIBUTION BY PAYMENT ID
// ============================================
export async function getContributionByPaymentId(paymentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("razorpay_payment_id", paymentId)
    .single();

  return { data, error };
}

// ============================================
// UPDATE CONTRIBUTION STATUS
// ============================================
export async function updateContributionStatus(
  paymentId: string,
  status: "success" | "pending" | "failed"
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_payment_id", paymentId)
    .select()
    .single();

  return { data, error };
}

// ============================================
// GET CONTRIBUTION STATS (Admin Dashboard)
// ============================================
export async function getContributionStats() {
  const supabase = createClient();

  // Get all successful contributions
  const { data: contributions, error } = await supabase
    .from("contributions")
    .select("amount, created_at")
    .eq("status", "success");

  if (error || !contributions) {
    return {
      data: {
        totalRaised: 0,
        totalContributors: 0,
        thisMonth: 0,
        thisMonthCount: 0,
        average: 0,
        lastContribution: null
      },
      error
    };
  }

  // Calculate stats
  const totalRaised = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalContributors = contributions.length;
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisMonthContributions = contributions.filter(
    c => new Date(c.created_at) >= firstDayOfMonth
  );
  
  const thisMonth = thisMonthContributions.reduce((sum, c) => sum + c.amount, 0);
  const thisMonthCount = thisMonthContributions.length;
  
  const average = totalContributors > 0 
    ? Math.round(totalRaised / totalContributors) 
    : 0;

  const lastContribution = contributions.length > 0 
    ? contributions[0].created_at 
    : null;

  return {
    data: {
      totalRaised,
      totalContributors,
      thisMonth,
      thisMonthCount,
      average,
      lastContribution
    },
    error: null
  };
}

// ============================================
// GET LEADERBOARD (Top 10 Contributors)
// ============================================
export async function getContributionLeaderboard(limit: number = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("user_name, user_email, amount, created_at")
    .eq("status", "success")
    .order("amount", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return { data: [], error };
  }

  // Group by user_email and sum amounts
  const leaderboardMap = new Map<string, {
    user_name: string;
    user_email: string;
    total_amount: number;
    contribution_count: number;
    last_contribution: string;
  }>();

  data.forEach(contribution => {
    const existing = leaderboardMap.get(contribution.user_email);
    
    if (existing) {
      existing.total_amount += contribution.amount;
      existing.contribution_count += 1;
      if (new Date(contribution.created_at) > new Date(existing.last_contribution)) {
        existing.last_contribution = contribution.created_at;
      }
    } else {
      leaderboardMap.set(contribution.user_email, {
        user_name: contribution.user_name,
        user_email: contribution.user_email,
        total_amount: contribution.amount,
        contribution_count: 1,
        last_contribution: contribution.created_at
      });
    }
  });

  // Convert to array and sort by total_amount
  const leaderboard = Array.from(leaderboardMap.values())
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, limit);

  return { data: leaderboard, error: null };
}

// ============================================
// GET USER BADGE
// ============================================
export function getUserBadge(totalContributed: number): {
  name: string;
  icon: string;
  color: string;
  description: string;
} | null {
  if (totalContributed >= 5000) {
    return {
      name: "Diamond Supporter",
      icon: "💎",
      color: "from-cyan-400 to-blue-500",
      description: "Elite supporter with ₹5000+ contributions"
    };
  } else if (totalContributed >= 2000) {
    return {
      name: "Gold Supporter",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
      description: "Premium supporter with ₹2000+ contributions"
    };
  } else if (totalContributed >= 1000) {
    return {
      name: "Silver Supporter",
      icon: "⭐",
      color: "from-slate-300 to-slate-400",
      description: "Valued supporter with ₹1000+ contributions"
    };
  } else if (totalContributed >= 500) {
    return {
      name: "Bronze Supporter",
      icon: "🎖️",
      color: "from-orange-400 to-red-400",
      description: "Growing supporter with ₹500+ contributions"
    };
  } else if (totalContributed >= 100) {
    return {
      name: "Supporter",
      icon: "💝",
      color: "from-pink-400 to-rose-500",
      description: "Generous supporter with ₹100+ contributions"
    };
  }
  
  return null;
}

// ============================================
// GET RECENT CONTRIBUTIONS (For Activity Feed)
// ============================================
export async function getRecentContributions(limit: number = 5) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("user_name, amount, message, created_at")
    .eq("status", "success")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

// ============================================
// SEND THANK YOU NOTIFICATION
// ============================================
export async function sendContributionThankYou(
  userId: string | null,
  contributorName: string,
  amount: number
) {
  if (!userId) return { data: null, error: null }; // Skip if not logged in

  const supabase = createClient();

  const message = `🙏 Thank you ${contributorName} for your generous contribution of ₹${amount}! Your support helps us build and maintain Vaidehi. We're incredibly grateful! 💜`;

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      message,
      read: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });

  return { data, error };
}

// ============================================
// EXPORT CONTRIBUTIONS TO CSV (Admin)
// ============================================
export async function exportContributionsToCSV() {
  const { data: contributions, error } = await getAllContributions();

  if (error || !contributions) {
    return { data: null, error };
  }

  // CSV headers
  const headers = [
    "Date",
    "Name",
    "Email",
    "Amount (INR)",
    "Status",
    "Payment ID",
    "Message"
  ];

  // CSV rows
  const rows = contributions.map(c => [
    new Date(c.created_at).toLocaleString(),
    c.user_name,
    c.user_email,
    c.amount.toString(),
    c.status,
    c.razorpay_payment_id,
    c.message || ""
  ]);

  // Build CSV string
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(field => `"${field}"`).join(","))
  ].join("\n");

  return { data: csvContent, error: null };
}

// ============================================
// HELPER: Format Currency
// ============================================
export function formatIndianRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}