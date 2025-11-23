// src/app/dashboard/todo/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ScheduleCalendar from "./components/ScheduleCalendar";
import DayEventsList from "./components/DayEventsList";
import AddEventModal from "./components/AddEventModal";
import { useSchedule, useMonthEvents } from "./hooks/useSchedule";
import { useEventActions } from "./hooks/useEventActions";
import { formatDateToString } from "@/types/database";
import type { ScheduleEvent, EventFormData } from "@/types/database";

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isDark, setIsDark] = useState(true);

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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
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

        {/* Day Events - Right Side (3 columns) */}
        <div className="lg:col-span-3">
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