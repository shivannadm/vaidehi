// src/app/dashboard/todo/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import ScheduleCalendar from "./components/ScheduleCalendar";
import DayEventsList from "./components/DayEventsList";
import UpcomingEvents from "./components/UpcomingEvents";
import AddEventModal from "./components/AddEventModal";
import { useSchedule, useMonthEvents } from "./hooks/useSchedule";
import { useEventActions } from "./hooks/useEventActions";
import { useScheduleNotifications } from "./hooks/useScheduleNotifications";
import type { ScheduleEvent, EventFormData } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { getUpcomingEvents, getScheduleEventsForDate } from "@/lib/supabase/schedule-helpers";

// Helper function to format date correctly (fixes timezone issue)
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);
  const [allTodayEvents, setAllTodayEvents] = useState<ScheduleEvent[]>([]);

  // Get formatted date string (fixes timezone issue)
  const selectedDateString = formatDateForInput(selectedDate);

  // Fetch events for selected day
  const {
    events,
    loading: eventsLoading,
    refreshEvents,
  } = useSchedule(selectedDateString);

  // Fetch events for current month (for calendar dots)
  const {
    eventCounts,
    loading: monthLoading,
    refreshMonthEvents,
  } = useMonthEvents(currentMonth.getFullYear(), currentMonth.getMonth());

  // Event actions
  const { createEvent, updateEvent, deleteEvent, moveToTask, loading: actionLoading } =
    useEventActions();

  // Theme detection
  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch upcoming events and today's events for notifications
  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch upcoming events (for display)
        const { data: upcoming } = await getUpcomingEvents(user.id, 5);
        if (upcoming) {
          setUpcomingEvents(upcoming);
        }

        // Fetch ALL today's events (for notifications)
        const today = formatDateForInput(new Date());
        const { data: todayEvents } = await getScheduleEventsForDate(user.id, today);
        if (todayEvents) {
          setAllTodayEvents(todayEvents);
        }
      }
    };

    fetchEvents();
  }, [events]); // Refresh when events change

  // 🔔 Enable schedule notifications (checks every 1 minute)
  useScheduleNotifications(allTodayEvents);

  // Handlers
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
  };

  const handleAddEvent = () => {
    // Check if selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      alert("Cannot add events to past dates. Please select today or a future date.");
      return;
    }

    setEditingEvent(null);
    setIsAddModalOpen(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleUpcomingEventClick = (event: ScheduleEvent) => {
    // Jump to that event's date (fixed timezone parsing)
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    setSelectedDate(eventDate);
    setCurrentMonth(new Date(eventDate.getFullYear(), eventDate.getMonth()));
  };

  const handleSubmitEvent = async (formData: EventFormData) => {
    // Prevent scheduling in the past
    const [year, month, day] = formData.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today && !editingEvent) {
      alert("Cannot schedule events in the past.");
      return;
    }

    try {
      if (editingEvent) {
        // Update existing event
        const result = await updateEvent(editingEvent.id, formData);
        if (result.success) {
          refreshEvents();
          refreshMonthEvents();
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }
      } else {
        // Create new event
        const result = await createEvent(formData);
        if (result.success) {
          refreshEvents();
          refreshMonthEvents();
          setIsAddModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        refreshEvents();
        refreshMonthEvents();
      }
    }
  };

  const handleMoveToTask = async (eventId: string) => {
    const result = await moveToTask(eventId);
    if (result.success) {
      alert("Event moved to Tasks successfully!");
      refreshEvents();
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  // SSR placeholder
  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div
          className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? "border-indigo-400" : "border-indigo-600"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" suppressHydrationWarning>
      {/* Main Content - Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-5 overflow-hidden">
        {/* Calendar - Left Side (2 columns) */}
        <div className="lg:col-span-2 overflow-hidden">
          <ScheduleCalendar
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onDateSelect={handleDateSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            eventCounts={eventCounts}
            isDark={isDark}
            onTodayClick={handleTodayClick}
          />
        </div>

        {/* Right Side (5 columns) - Scrollable Events + Upcoming */}
        <div className="lg:col-span-5 overflow-y-auto scrollbar-custom space-y-5 pr-2">
          {/* Day Events - Top */}
          <DayEventsList
            selectedDate={selectedDate}
            events={events}
            loading={eventsLoading}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onMoveToTask={handleMoveToTask}
            isDark={isDark}
          />

          {/* Upcoming Events - Bottom */}
          {upcomingEvents.length > 0 && (
            <UpcomingEvents
              events={upcomingEvents}
              onEventClick={handleUpcomingEventClick}
              isDark={isDark}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal - Pass correct date string */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmitEvent}
        editingEvent={editingEvent}
        defaultDate={selectedDateString}
        isDark={isDark}
      />
    </div>
  );
}