// src/app/dashboard/todo/schedule/hooks/useSchedule.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getScheduleEventsForDate,
  getScheduleEventsForRange,
  getEventCountsForMonth,
} from "@/lib/supabase/schedule-helpers";
import type { ScheduleEvent } from "@/types/database";

export function useSchedule(selectedDate: string) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      const { data, error: fetchError } = await getScheduleEventsForDate(
        user.id,
        selectedDate
      );

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refreshEvents = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refreshEvents,
  };
}

// Hook for fetching events for a month (for calendar view)
export function useMonthEvents(year: number, month: number) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      // Get first and last day of month
      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        lastDay
      ).padStart(2, "0")}`;

      // Fetch events for the month
      const { data, error: fetchError } = await getScheduleEventsForRange(
        user.id,
        startDate,
        endDate
      );

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setEvents(data || []);

      // Get event counts per date
      const { counts, error: countsError } = await getEventCountsForMonth(
        user.id,
        year,
        month
      );

      if (countsError) {
        console.error("Error fetching event counts:", countsError);
      } else {
        setEventCounts(counts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthEvents();
  }, [fetchMonthEvents]);

  const refreshMonthEvents = useCallback(() => {
    fetchMonthEvents();
  }, [fetchMonthEvents]);

  return {
    events,
    eventCounts,
    loading,
    error,
    refreshMonthEvents,
  };
}