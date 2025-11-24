// src/app/dashboard/todo/schedule/hooks/useScheduleNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/supabase/helpers";
import type { ScheduleEvent } from "@/types/database";
import { formatTimeTo12Hour } from "@/types/database";

export function useScheduleNotifications(events: ScheduleEvent[]) {
  const notifiedEvents = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request browser notification permission immediately
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Browser notification permission:", permission);
      });
    }

    const checkUpcomingEvents = async () => {
      const now = new Date();
      const currentTime = now.toTimeString().substring(0, 5); // HH:mm format
      console.log(`⏰ Check at: ${now.toLocaleTimeString()}`);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;

      console.log(`📅 Today: ${todayDate}, Events:`, events.length);

      // Filter only today's events
      const todayEvents = events.filter(e => e.date === todayDate);
      console.log(`📋 Today's events:`, todayEvents.map(e => ({
        title: e.title,
        time: e.start_time,
        date: e.date
      })));

      for (const event of todayEvents) {
        try {
          // Get event time in HH:mm format
          const eventTime = event.start_time.substring(0, 5);
          const [eventHours, eventMinutes] = eventTime.split(':').map(Number);
          
          // Calculate notification time (30 minutes before)
          let notifyHours = eventHours;
          let notifyMinutes = eventMinutes - 30;
          
          if (notifyMinutes < 0) {
            notifyHours -= 1;
            notifyMinutes += 60;
          }
          
          const notifyTime = `${String(notifyHours).padStart(2, '0')}:${String(notifyMinutes).padStart(2, '0')}`;
          
          // Check if current time matches notification time (within 1 minute window)
          const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
          const [notifyH, notifyM] = notifyTime.split(':').map(Number);
          
          const timeDiff = Math.abs((currentHours * 60 + currentMinutes) - (notifyH * 60 + notifyM));
          
          console.log(`🔍 "${event.title}": Event=${eventTime}, Notify=${notifyTime}, Current=${currentTime}, Diff=${timeDiff}min`);
          
          if (timeDiff <= 1) { // Within 1 minute window
            const notifKey = `${event.id}-${todayDate}`;
            
            if (notifiedEvents.current.has(notifKey)) {
              console.log(`⏭️ Already notified: ${event.title}`);
              continue;
            }

            console.log(`🎯 SENDING NOTIFICATION: ${event.title}`);
            notifiedEvents.current.add(notifKey);

            // Send notification
            const eventTimeFormatted = formatTimeTo12Hour(event.start_time);
            const message = `⏰ Upcoming: "${event.title}" at ${eventTimeFormatted} (30 min)`;

            // 1. In-app notification
            try {
              await createNotification(user.id, message);
              console.log("✅ In-app notification created");
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
                  requireInteraction: false,
                });
                console.log("✅ Browser notification sent");
                
                // Auto-close after 10 seconds
                setTimeout(() => notif.close(), 10000);
              } catch (err) {
                console.error("❌ Browser notification failed:", err);
              }
            } else {
              console.log("⚠️ Browser notifications not granted");
            }
          }
        } catch (error) {
          console.error(`❌ Error processing event "${event.title}":`, error);
        }
      }
    };

    // Check immediately
    console.log("🚀 Notification system started");
    checkUpcomingEvents();

    // Check every 1 minute
    const interval = setInterval(checkUpcomingEvents, 60 * 1000);

    return () => {
      console.log("🛑 Notification system stopped");
      clearInterval(interval);
    };
  }, [events]);
}