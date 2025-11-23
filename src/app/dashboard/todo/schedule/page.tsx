// src/app/dashboard/todo/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ScheduleCalendar from "./components/ScheduleCalendar";
import DayEventsList from "./components/DayEventsList";
import UpcomingEvents from "./components/UpcomingEvents";
import AddEventModal from "./components/AddEventModal";
import { useSchedule, useMonthEvents } from "./hooks/useSchedule";
import { useEventActions } from "./hooks/useEventActions";
import { formatDateToString } from "@/types/database";
import type { ScheduleEvent, EventFormData } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { getUpcomingEvents } from "@/lib/supabase/schedule-helpers";

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);

  // Fetch events for selected day
  const {
    events,
    loading: eventsLoading,
    refreshEvents,
  } = useSchedule(formatDateToString(selectedDate));

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

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcoming = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await getUpcomingEvents(user.id, 5);
        if (data) {
          setUpcomingEvents(data);
        }
      }
    };

    fetchUpcoming();
  }, [events]); // Refresh when events change

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
    setEditingEvent(null);
    setIsAddModalOpen(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleUpcomingEventClick = (event: ScheduleEvent) => {
    // Jump to that event's date
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    setSelectedDate(eventDate);
    setCurrentMonth(new Date(eventDate.getFullYear(), eventDate.getMonth()));
  };

  const handleSubmitEvent = async (formData: EventFormData) => {
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

  // SSR placeholder
  if (!mounted) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Loading Schedule...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar
            className={`w-6 h-6 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Schedule
          </h1>
        </div>

        <button
          onClick={() => setSelectedDate(new Date())}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-900"
          }`}
        >
          Today
        </button>
      </div>

      {/* Main Layout - Calendar + Events + Upcoming in same row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        {/* Calendar - Left Side (2 columns) */}
        <div className="lg:col-span-2">
          <ScheduleCalendar
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onDateSelect={handleDateSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            eventCounts={eventCounts}
            isDark={isDark}
          />
        </div>

        {/* Right Side (5 columns) - Events + Upcoming stacked */}
        <div className="lg:col-span-5 space-y-5">
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

          {/* Upcoming Events - Bottom (Pink Region) */}
          {upcomingEvents.length > 0 && (
            <UpcomingEvents
              events={upcomingEvents}
              onEventClick={handleUpcomingEventClick}
              isDark={isDark}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmitEvent}
        editingEvent={editingEvent}
        defaultDate={formatDateToString(selectedDate)}
        isDark={isDark}
      />
    </div>
  );
}