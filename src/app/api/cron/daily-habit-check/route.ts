// src/app/api/cron/daily-habit-check/route.ts
// ✅ API Route to run daily (midnight) to ensure all habit records exist
// Can be triggered by Vercel Cron, external cron service, or manually

import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // ✅ Security: Verify cron secret (set in environment variables)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET 
      ? `Bearer ${process.env.CRON_SECRET}` 
      : null;
    
    // Skip auth check if CRON_SECRET is not set (development mode)
    if (expectedAuth && authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Get all users with active habits
    const { data: users, error: usersError } = await supabase
      .from('habits')
      .select('user_id')
      .eq('is_active', true);

    if (usersError) throw usersError;

    // Get unique user IDs
    const uniqueUserIds = [...new Set(users?.map(u => u.user_id) || [])];
    
    let recordsCreated = 0;
    let usersProcessed = 0;

    // Process each user
    for (const userId of uniqueUserIds) {
      try {
        // Get user's active habits
        const { data: habits } = await supabase
          .from('habits')
          .select('id')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (!habits || habits.length === 0) continue;

        // Check existing records for today
        const { data: existing } = await supabase
          .from('habit_completions')
          .select('habit_id')
          .eq('user_id', userId)
          .eq('completion_date', today);

        const existingIds = new Set(existing?.map(r => r.habit_id) || []);

        // Create missing records (marked as not completed)
        const missing = habits
          .filter(h => !existingIds.has(h.id))
          .map(h => ({
            user_id: userId,
            habit_id: h.id,
            completion_date: today,
            completed: false,
            created_at: new Date().toISOString()
          }));

        if (missing.length > 0) {
          const { error: insertError } = await supabase
            .from('habit_completions')
            .insert(missing);

          if (!insertError) {
            recordsCreated += missing.length;
          }
        }

        usersProcessed++;
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError);
        // Continue with next user
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      usersProcessed,
      recordsCreated,
      message: `Created ${recordsCreated} habit completion records for ${usersProcessed} users`
    });

  } catch (error) {
    console.error('Daily habit check error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ✅ Also allow POST for flexibility
export async function POST(request: Request) {
  return GET(request);
}