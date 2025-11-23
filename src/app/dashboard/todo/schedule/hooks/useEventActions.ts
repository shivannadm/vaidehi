// src/app/dashboard/todo/schedule/hooks/useEventActions.ts
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createScheduleEvent,
  updateScheduleEvent,
  deleteScheduleEvent,
  moveEventToTask,
  checkEventConflict,
} from "@/lib/supabase/schedule-helpers";
import type { EventFormData, ScheduleEvent } from "@/types/database";

export function useEventActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new event
  const createEvent = async (formData: EventFormData) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return { success: false, data: null };
      }

      // Check for conflicts
      const { hasConflict, conflictingEvent } = await checkEventConflict(
        user.id,
        formData.date,
        formData.start_time,
        formData.end_time
      );

      if (hasConflict && conflictingEvent) {
        setError(
          `Time conflict with "${conflictingEvent.title}" (${conflictingEvent.start_time} - ${conflictingEvent.end_time})`
        );
        return { success: false, data: null };
      }

      const { data, error: createError } = await createScheduleEvent({
        user_id: user.id,
        title: formData.title,
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description || null,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.recurrence_pattern || null,
        recurrence_end_date: formData.recurrence_end_date || null,
      });

      if (createError) {
        setError(createError.message);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId: string, formData: Partial<EventFormData>) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return { success: false, data: null };
      }

      // Check for conflicts if time/date changed
      if (formData.date && formData.start_time && formData.end_time) {
        const { hasConflict, conflictingEvent } = await checkEventConflict(
          user.id,
          formData.date,
          formData.start_time,
          formData.end_time,
          eventId // Exclude current event
        );

        if (hasConflict && conflictingEvent) {
          setError(
            `Time conflict with "${conflictingEvent.title}" (${conflictingEvent.start_time} - ${conflictingEvent.end_time})`
          );
          return { success: false, data: null };
        }
      }

      const { data, error: updateError } = await updateScheduleEvent(eventId, {
        title: formData.title,
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.recurrence_pattern,
        recurrence_end_date: formData.recurrence_end_date,
      });

      if (updateError) {
        setError(updateError.message);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update event";
      setError(errorMessage);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await deleteScheduleEvent(eventId);

      if (deleteError) {
        setError(deleteError.message);
        return { success: false };
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete event";
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Move event to tasks (only if today)
  const moveToTask = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return { success: false, taskId: null };
      }

      const { taskId, error: moveError } = await moveEventToTask(
        eventId,
        user.id
      );

      if (moveError) {
        setError(moveError.message);
        return { success: false, taskId: null };
      }

      return { success: true, taskId };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to move event to task";
      setError(errorMessage);
      return { success: false, taskId: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    moveToTask,
    loading,
    error,
  };
}