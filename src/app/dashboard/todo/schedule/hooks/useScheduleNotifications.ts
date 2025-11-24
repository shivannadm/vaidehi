// src/app/dashboard/todo/schedule/hooks/useScheduleNotifications.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/supabase/helpers";
import type { ScheduleEvent } from "@/types/database";
import { formatTimeTo12Hour } from "@/types/database";

export function useScheduleNotifications(events: ScheduleEvent[]) {
  const notifiedEvents = useRef<Set<string>>(new Set());
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request browser notification permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          setPermissionGranted(permission === "granted");
          console.log("🔔 Notification permission:", permission);
        } else if (Notification.permission === "granted") {
          setPermissionGranted(true);
          console.log("🔔 Notification permission: already granted");
        } else {
          console.log("🔔 Notification permission: denied");
        }
      } else {
        console.log("❌ Browser doesn't support notifications");
      }
    };

    requestPermission();
  }, []);

  // Check for upcoming events - runs immediately and every 1 minute
  useEffect(() => {
    const checkUpcomingEvents = async () => {
      const now = new Date();
      console.log(`🔍 Checking notifications at ${now.toLocaleTimeString()}`);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("❌ No user logged in");
        return;
      }

      // Get today's date in YYYY-MM-DD format
      const todayDate = now.toISOString().split("T")[0];

      // Filter events for today only
      const todayEvents = events.filter((event) => event.date === todayDate);

      console.log(`📅 Found ${todayEvents.length} events today:`, todayEvents.map(e => ({
        title: e.title,
        time: e.start_time,
        date: e.date
      })));

      for (const event of todayEvents) {
        // Parse event start time
        const [hours, minutes] = event.start_time.split(":").map(Number);
        const eventTime = new Date(now);
        eventTime.setHours(hours, minutes, 0, 0);

        // Calculate time difference in minutes
        const diffMs = eventTime.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        console.log(`📊 Event "${event.title}":`, {
          startTime: event.start_time,
          eventTime: eventTime.toLocaleTimeString(),
          diffMinutes,
          shouldNotify: diffMinutes >= 28 && diffMinutes <= 32
        });

        // Check if we should send notification (30 minutes before)
        // Allow 5 minute window (28-32 min) to catch the notification
        if (diffMinutes >= 28 && diffMinutes <= 32) {
          const notificationKey = `${event.id}-30min`;

          // Skip if already notified
          if (notifiedEvents.current.has(notificationKey)) {
            console.log(`⏭️ Already notified for: ${event.title}`);
            continue;
          }

          console.log(`✅ Sending notification for: ${event.title}`);

          // Mark as notified
          notifiedEvents.current.add(notificationKey);

          // Send notifications
          await sendEventNotification(
            user.id,
            event,
            30,
            permissionGranted
          );
        }
      }
    };

    // Check immediately on mount
    console.log("🚀 Notification system started");
    checkUpcomingEvents();

    // Then check every 1 minute (more frequent for testing)
    const interval = setInterval(checkUpcomingEvents, 60 * 1000); // 1 minute

    return () => {
      console.log("🛑 Notification system stopped");
      clearInterval(interval);
    };
  }, [events, permissionGranted]);

  // Log when events change
  useEffect(() => {
    console.log("📋 Events updated, total count:", events.length);
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

  console.log("📤 Sending notification:", message);

  try {
    // 1. Create in-app notification (appears in bell icon)
    const result = await createNotification(userId, message);
    console.log("✅ In-app notification created:", result);

    // 2. Send browser notification
    if (sendBrowserNotif && "Notification" in window && Notification.permission === "granted") {
      const notif = new Notification("Schedule Reminder", {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: event.id,
        requireInteraction: false,
        silent: false,
      });
      console.log("✅ Browser notification sent");

      // Auto-close after 10 seconds
      setTimeout(() => notif.close(), 10000);
    } else {
      console.log("⚠️ Browser notification not sent:", {
        hasWindow: "Notification" in window,
        permission: typeof Notification !== "undefined" ? Notification.permission : "N/A",
        shouldSend: sendBrowserNotif
      });
    }

    console.log("🎉 Notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
}