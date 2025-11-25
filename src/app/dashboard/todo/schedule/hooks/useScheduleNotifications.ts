// src/app/dashboard/todo/schedule/hooks/useScheduleNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ScheduleEvent } from "@/types/database";
import { formatTimeTo12Hour } from "@/types/database";

export function useScheduleNotifications(events: ScheduleEvent[]) {
  const notifiedEvents = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkUpcomingEvents = async () => {
      try {
        const now = new Date();
        const currentTime = now.toTimeString().substring(0, 5);
        console.log(`⏰ Check at: ${now.toLocaleTimeString()}`);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.log("❌ No user");
          return;
        }

        // Today's date
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayDate = `${year}-${month}-${day}`;

        console.log(`📅 Today: ${todayDate}, Events:`, events.length);

        const todayEvents = events.filter(e => e.date === todayDate);
        console.log(`📋 Today's events:`, todayEvents.map(e => e.title));

        for (const event of todayEvents) {
          try {
            const eventTime = event.start_time.substring(0, 5);
            const [eventHours, eventMinutes] = eventTime.split(':').map(Number);

            // Calculate 30 min before
            let notifyHours = eventHours;
            let notifyMinutes = eventMinutes - 30;

            if (notifyMinutes < 0) {
              notifyHours -= 1;
              notifyMinutes += 60;
            }

            const notifyTime = `${String(notifyHours).padStart(2, '0')}:${String(notifyMinutes).padStart(2, '0')}`;
            const [currentH, currentM] = currentTime.split(':').map(Number);
            const [notifyH, notifyM] = notifyTime.split(':').map(Number);

            const timeDiff = Math.abs((currentH * 60 + currentM) - (notifyH * 60 + notifyM));

            console.log(`🔍 "${event.title}": Event=${eventTime}, Notify=${notifyTime}, Current=${currentTime}, Diff=${timeDiff}min`);

            if (timeDiff <= 1) {
              const notifKey = `${event.id}-${todayDate}`;

              if (notifiedEvents.current.has(notifKey)) {
                console.log(`⏭️ Already notified: ${event.title}`);
                continue;
              }

              console.log(`🎯 SENDING NOTIFICATION: ${event.title}`);
              notifiedEvents.current.add(notifKey);

              const eventTimeFormatted = formatTimeTo12Hour(event.start_time);
              const message = `⏰ Upcoming: "${event.title}" at ${eventTimeFormatted} (30 min)`;

              // 1. In-app notification
              try {
                const { data, error } = await supabase
                  .from('notifications')
                  .insert({
                    user_id: user.id,
                    message: message,
                    read: false,
                    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
                  })
                  .select()
                  .single();

                if (error) {
                  console.error("❌ In-app notification error:", error);
                } else {
                  console.log("✅ In-app notification created:", data);
                }
              } catch (err) {
                console.error("❌ In-app notification failed:", err);
              }

              // 2. Browser notification
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  const notif = new Notification("Schedule Reminder", {
                    body: message,
                    icon: "/favicon.ico",
                    tag: event.id,
                  });
                  console.log("✅ Browser notification sent");
                  setTimeout(() => notif.close(), 10000);
                } catch (err) {
                  console.error("❌ Browser notification failed:", err);
                }
              } else {
                console.log("⚠️ Browser permission:", typeof Notification !== "undefined" ? Notification.permission : "not supported");
              }
            }
          } catch (error) {
            console.error(`❌ Error processing event "${event.title}":`, error);
          }
        }
      } catch (error) {
        console.error("❌ Main error in checkUpcomingEvents:", error);
      }
    };

    console.log("🚀 Notification system started");
    checkUpcomingEvents();

    const interval = setInterval(checkUpcomingEvents, 60 * 1000);

    return () => {
      console.log("🛑 Notification system stopped");
      clearInterval(interval);
    };
  }, [events]);
}