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

      // Prepare event data with proper null handling
      const eventData = {
        user_id: user.id,
        title: formData.title.trim(),
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description?.trim() || null,
        is_recurring: formData.is_recurring || false,
        recurrence_pattern: formData.is_recurring ? (formData.recurrence_pattern || null) : null,
        recurrence_end_date: formData.is_recurring ? (formData.recurrence_end_date || null) : null,
      };

      console.log("Creating event with data:", eventData);

      const { data, error: createError } = await createScheduleEvent(eventData);

      if (createError) {
        console.error("Create error:", createError);
        const errorMsg = createError.message || 'Failed to create event';
        setError(errorMsg);
        alert(`Error creating event: ${errorMsg}`);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Caught error:", err);
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

      // Prepare update data with proper null handling
      const updateData: any = {};
      
      if (formData.title !== undefined) updateData.title = formData.title.trim();
      if (formData.event_type !== undefined) updateData.event_type = formData.event_type;
      if (formData.date !== undefined) updateData.date = formData.date;
      if (formData.start_time !== undefined) updateData.start_time = formData.start_time;
      if (formData.end_time !== undefined) updateData.end_time = formData.end_time;
      if (formData.description !== undefined) updateData.description = formData.description?.trim() || null;
      if (formData.is_recurring !== undefined) {
        updateData.is_recurring = formData.is_recurring;
        updateData.recurrence_pattern = formData.is_recurring ? (formData.recurrence_pattern || null) : null;
        updateData.recurrence_end_date = formData.is_recurring ? (formData.recurrence_end_date || null) : null;
      }

      console.log("Updating event with data:", updateData);

      const { data, error: updateError } = await updateScheduleEvent(eventId, updateData);

      if (updateError) {
        console.error("Update error:", updateError);
        setError(updateError.message);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Caught error:", err);
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