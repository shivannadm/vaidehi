// src/lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  // ✅ Daily habit check - runs once per day per user
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const lastCheck = request.cookies.get('last-habit-check')?.value
    const today = new Date().toISOString().split('T')[0]

    // If not checked today, ensure habit records exist
    if (lastCheck !== today) {
      // Set cookie to prevent repeated checks
      response.cookies.set('last-habit-check', today, {
        maxAge: 86400, // 24 hours
        path: '/',
        sameSite: 'lax'
      })

      // ✅ Ensure habit completion records exist for today
      // Don't await to avoid blocking the request
      ensureHabitCompletionRecordsInMiddleware(user.id, today, supabase).catch(err => {
        console.error('Error in daily habit check:', err)
      })
    }
  }

  return response
}

/**
 * ✅ Helper function to ensure habit completion records exist
 * This is called from middleware, so we use the existing supabase client
 */
async function ensureHabitCompletionRecordsInMiddleware(
  userId: string, 
  date: string,
  supabase: any
) {
  try {
    // Get all active habits
    const { data: habits } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!habits || habits.length === 0) return;

    // Check which habits already have records for this date
    const { data: existingRecords } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('date', date);

    const existingHabitIds = new Set(
      existingRecords?.map((r: { habit_id: string }) => r.habit_id) || []
    );

    // ✅ FIXED: Proper typing for filter and map
    const missingRecords = habits
      .filter((h: { id: string }) => !existingHabitIds.has(h.id))
      .map((h: { id: string }) => ({
        user_id: userId,
        habit_id: h.id,
        date: date,
        completed: false,
        created_at: new Date().toISOString()
      }));

    if (missingRecords.length > 0) {
      await supabase
        .from('habit_completions')
        .insert(missingRecords);
      
      console.log(`✅ Created ${missingRecords.length} habit completion records for ${date}`);
    }
  } catch (error) {
    console.error('Error ensuring habit completion records:', error);
  }
}