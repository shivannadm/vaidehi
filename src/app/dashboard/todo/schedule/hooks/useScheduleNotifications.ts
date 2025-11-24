// src/app/dashboard/todo/schedule/hooks/useScheduleNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/supabase/helpers";
import type { ScheduleEvent } from "@/types/database";
import { formatTimeTo12Hour } from "@/types/database";

export function useScheduleNotifications(events: ScheduleEvent[]) {
  const notifiedEvents = useRef<Set<string>>(new Set());
  const browserNotificationGranted = useRef(false);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        browserNotificationGranted.current = permission === "granted";
      });
    } else if (Notification.permission === "granted") {
      browserNotificationGranted.current = true;
    }
  }, []);

  // Check for upcoming events every 5 minutes
  useEffect(() => {
    const checkUpcomingEvents = async () => {
      const now = new Date();
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get today's date in YYYY-MM-DD format
      const todayDate = now.toISOString().split("T")[0];

      // Filter events for today only
      const todayEvents = events.filter((event) => event.date === todayDate);

      for (const event of todayEvents) {
        // Parse event start time
        const [hours, minutes] = event.start_time.split(":").map(Number);
        const eventTime = new Date(now);
        eventTime.setHours(hours, minutes, 0, 0);

        // Calculate time difference in minutes
        const diffMinutes = Math.floor(
          (eventTime.getTime() - now.getTime()) / (1000 * 60)
        );

        // Check if we should send notification (30 minutes before)
        // Allow 5 minute window (25-35 min) to catch the notification
        if (diffMinutes >= 25 && diffMinutes <= 35) {
          const notificationKey = `${event.id}-30min`;

          // Skip if already notified
          if (notifiedEvents.current.has(notificationKey)) continue;

          // Mark as notified
          notifiedEvents.current.add(notificationKey);

          // Send notifications
          await sendEventNotification(
            user.id,
            event,
            30,
            browserNotificationGranted.current
          );
        }
      }
    };

    // Check immediately on mount
    checkUpcomingEvents();

    // Then check every 5 minutes
    const interval = setInterval(checkUpcomingEvents, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [events]);
}

// Send both in-app and browser notifications
async function sendEventNotification(
  userId: string,
  event: ScheduleEvent,
  minutesBefore: number,
  sendBrowserNotif: boolean
) {
  const eventTime = formatTimeTo12Hour(event.start_time);
  const message = `⏰ Upcoming: "${event.title}" at ${eventTime} (${minutesBefore} min)`;

  try {
    // 1. Create in-app notification (appears in bell icon)
    await createNotification(userId, message);

    // 2. Send browser notification
    if (sendBrowserNotif && "Notification" in window) {
      new Notification("Schedule Reminder", {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: event.id,
        requireInteraction: false,
        silent: false,
      });
    }

    console.log("✅ Notification sent:", message);
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
}