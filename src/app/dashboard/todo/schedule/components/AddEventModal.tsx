// src/app/dashboard/todo/schedule/components/AddEventModal.tsx
// ✅ MOBILE RESPONSIVE VERSION
"use client";

import { useState, useEffect } from "react";
import { X, Clock, Calendar as CalendarIcon, Type, AlignLeft, Repeat } from "lucide-react";
import type { ScheduleEvent, EventFormData, EventType, RecurrencePattern } from "@/types/database";
import { EVENT_TYPE_CONFIG } from "@/types/database";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EventFormData) => Promise<void>;
  editingEvent?: ScheduleEvent | null;
  defaultDate?: string;
  isDark: boolean;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  editingEvent,
  defaultDate,
  isDark,
}: AddEventModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    event_type: "personal",
    date: defaultDate || today,
    start_time: "09:00:00",
    end_time: "10:00:00",
    description: "",
    is_recurring: false,
    recurrence_pattern: undefined,
    recurrence_end_date: undefined,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        event_type: editingEvent.event_type,
        date: editingEvent.date,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
        description: editingEvent.description || "",
        is_recurring: editingEvent.is_recurring,
        recurrence_pattern: editingEvent.recurrence_pattern || undefined,
        recurrence_end_date: editingEvent.recurrence_end_date || undefined,
      });
    } else if (defaultDate) {
      setFormData((prev) => ({ ...prev, date: defaultDate }));
    }
  }, [editingEvent, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.end_time <= formData.start_time) {
      alert("End time must be after start time");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      event_type: "personal",
      date: defaultDate || today,
      start_time: "09:00:00",
      end_time: "10:00:00",
      description: "",
      is_recurring: false,
      recurrence_pattern: undefined,
      recurrence_end_date: undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-xl shadow-2xl border max-h-[95vh] overflow-y-auto scrollbar-custom ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-3 sm:p-5 border-b sticky top-0 z-10 ${
            isDark 
              ? "border-slate-700 bg-slate-800" 
              : "border-slate-200 bg-white"
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={handleClose}
            className={`p-1 sm:p-1 rounded-lg transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-3 sm:space-y-4">
          {/* Title */}
          <div>
            <label
              className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <Type className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter event title"
              className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Date */}
          <div>
            <label
              className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={editingEvent ? undefined : today}
              required
              className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label
                className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time.substring(0, 5)}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value + ":00" })
                }
                required
                className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            <div>
              <label
                className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                End Time *
              </label>
              <input
                type="time"
                value={formData.end_time.substring(0, 5)}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value + ":00" })
                }
                required
                className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label
              className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Event Type *
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((type) => {
                const config = EVENT_TYPE_CONFIG[type];
                const isSelected = formData.event_type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, event_type: type })}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${
                      isSelected
                        ? isDark
                          ? "border-indigo-500 text-white"
                          : "border-indigo-500 text-indigo-600"
                        : isDark
                        ? "border-slate-700 text-slate-400 hover:border-slate-600"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: isDark
                              ? config.darkBg + "20"
                              : config.lightBg,
                          }
                        : {}
                    }
                  >
                    <span className="text-sm sm:text-base">{config.icon}</span>
                    <span className="hidden sm:inline ml-1">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <AlignLeft className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add details about this event"
              rows={3}
              className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm resize-none ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Recurring */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) =>
                  setFormData({ ...formData, is_recurring: e.target.checked })
                }
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                <Repeat className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Recurring Event
              </span>
            </label>

            {formData.is_recurring && (
              <div className="mt-2 sm:mt-3 ml-5 sm:ml-6 space-y-2 sm:space-y-3">
                <select
                  value={formData.recurrence_pattern || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence_pattern: e.target.value as RecurrencePattern,
                    })
                  }
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Select pattern</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                <input
                  type="date"
                  value={formData.recurrence_end_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence_end_date: e.target.value,
                    })
                  }
                  min={formData.date}
                  placeholder="End date (optional)"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
                isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting
                ? "Saving..."
                : editingEvent
                ? "Update Event"
                : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}