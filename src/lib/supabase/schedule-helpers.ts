// src/lib/supabase/schedule-helpers.ts
// ============================================
// SCHEDULE OPERATIONS
// ============================================

import { createClient } from "@/lib/supabase/client";
import type { ScheduleEvent, CreateScheduleEvent, UpdateScheduleEvent } from "@/types/database";

const supabase = createClient();

// ============================================
// GET OPERATIONS
// ============================================

// Get all events for a specific date
export async function getScheduleEventsForDate(userId: string, date: string) {
    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('start_time', { ascending: true });

    return { data: data as ScheduleEvent[] | null, error };
}

// Get events for date range (useful for month view)
export async function getScheduleEventsForRange(
    userId: string,
    startDate: string,
    endDate: string
) {
    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

    return { data: data as ScheduleEvent[] | null, error };
}

// Get single event by ID
export async function getScheduleEvent(eventId: string) {
    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('id', eventId)
        .single();

    return { data: data as ScheduleEvent | null, error };
}

// Get all upcoming events (from today onwards)
export async function getUpcomingEvents(userId: string, limit: number = 10) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(limit);

    return { data: data as ScheduleEvent[] | null, error };
}

// Get events by type
export async function getEventsByType(
    userId: string,
    eventType: string,
    startDate?: string,
    endDate?: string
) {
    let query = supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', eventType);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

    return { data: data as ScheduleEvent[] | null, error };
}

// Get recurring events
export async function getRecurringEvents(userId: string) {
    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .eq('is_recurring', true)
        .order('date', { ascending: true });

    return { data: data as ScheduleEvent[] | null, error };
}

// ============================================
// CREATE OPERATIONS
// ============================================

// Create a new event
export async function createScheduleEvent(eventData: CreateScheduleEvent) {
    const { data, error } = await supabase
        .from('schedule_events')
        .insert(eventData)
        .select()
        .single();

    return { data: data as ScheduleEvent | null, error };
}

// Create multiple events (for recurring events)
export async function createMultipleEvents(eventsData: CreateScheduleEvent[]) {
    const { data, error } = await supabase
        .from('schedule_events')
        .insert(eventsData)
        .select();

    return { data: data as ScheduleEvent[] | null, error };
}

// ============================================
// UPDATE OPERATIONS
// ============================================

// Update an event
export async function updateScheduleEvent(
    eventId: string,
    updates: UpdateScheduleEvent
) {
    const { data, error } = await supabase
        .from('schedule_events')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

    return { data: data as ScheduleEvent | null, error };
}

// Update event time
export async function updateEventTime(
    eventId: string,
    startTime: string,
    endTime: string
) {
    return updateScheduleEvent(eventId, { start_time: startTime, end_time: endTime });
}

// Update event date
export async function updateEventDate(eventId: string, date: string) {
    return updateScheduleEvent(eventId, { date });
}

// ============================================
// DELETE OPERATIONS
// ============================================

// Delete an event
export async function deleteScheduleEvent(eventId: string) {
    const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', eventId);

    return { error };
}

// Delete all recurring instances
export async function deleteRecurringEvents(userId: string, baseEventId: string) {
    // This would need custom logic to identify all instances
    // For now, just delete the single event
    return deleteScheduleEvent(baseEventId);
}

// Delete events by date range
export async function deleteEventsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
) {
    const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

    return { error };
}

// ============================================
// UTILITY OPERATIONS
// ============================================

// Check for time conflicts
export async function checkEventConflict(
    userId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeEventId?: string
) {
    let query = supabase
        .from('schedule_events')
        .select('id, title, start_time, end_time')
        .eq('user_id', userId)
        .eq('date', date);

    // Exclude current event if editing
    if (excludeEventId) {
        query = query.neq('id', excludeEventId);
    }

    const { data, error } = await query;

    if (error) return { hasConflict: false, conflictingEvent: null, error };

    // Check for time overlaps
    const hasConflict = data?.some(event => {
        return (
            (startTime >= event.start_time && startTime < event.end_time) ||
            (endTime > event.start_time && endTime <= event.end_time) ||
            (startTime <= event.start_time && endTime >= event.end_time)
        );
    });

    const conflictingEvent = hasConflict
        ? data?.find(event =>
            (startTime >= event.start_time && startTime < event.end_time) ||
            (endTime > event.start_time && endTime <= event.end_time) ||
            (startTime <= event.start_time && endTime >= event.end_time)
        )
        : null;

    return {
        hasConflict: hasConflict || false,
        conflictingEvent,
        error: null
    };
}

// Get event count for date (for calendar dots)
export async function getEventCountForDate(userId: string, date: string) {
    const { count, error } = await supabase
        .from('schedule_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('date', date);

    return { count: count || 0, error };
}

// Get event counts for month (for calendar)
export async function getEventCountsForMonth(
    userId: string,
    year: number,
    month: number
) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('schedule_events')
        .select('date')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) return { counts: {}, error };

    // Count events per date
    const counts: Record<string, number> = {};
    data?.forEach(event => {
        counts[event.date] = (counts[event.date] || 0) + 1;
    });

    return { counts, error: null };
}

// ============================================
// MOVE TO TASKS (Special Operation)
// ============================================

// Convert schedule event to task (when date is today)
export async function moveEventToTask(
    eventId: string,
    userId: string
): Promise<{ taskId: string | null; error: Error | null }> {
    try {
        // Get the event
        const { data: event, error: eventError } = await getScheduleEvent(eventId);

        if (eventError || !event) {
            return { taskId: null, error: eventError || new Error('Event not found') };
        }

        // Check if event is today
        const today = new Date().toISOString().split('T')[0];
        if (event.date !== today) {
            return {
                taskId: null,
                error: new Error('Can only move today\'s events to tasks')
            };
        }

        // Create task from event
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert({
                user_id: userId,
                title: event.title,
                tag_id: null, // User can assign tag later
                is_important: false,
                is_completed: false,
                total_time_spent: 0,
                date: event.date
            })
            .select()
            .single();

        if (taskError) {
            return { taskId: null, error: taskError };
        }

        // Optionally delete the event after moving
        // await deleteScheduleEvent(eventId);

        return { taskId: task.id, error: null };
    } catch (error) {
        return { taskId: null, error: error as Error };
    }
}