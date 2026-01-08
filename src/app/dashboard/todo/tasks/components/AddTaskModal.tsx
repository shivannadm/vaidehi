// src/app/dashboard/todo/tasks/components/AddTaskModal.tsx
// ✅ MOBILE RESPONSIVE VERSION
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Star, Repeat } from "lucide-react";
import { createTask } from "@/lib/supabase/task-helpers";
import { TAG_COLORS, type Tag, type TagColor } from "@/types/database";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    selectedDate: string;
    tags: Tag[];
    onTaskCreated: () => void;
    isDark: boolean;
}

export default function AddTaskModal({
    isOpen,
    onClose,
    userId,
    selectedDate,
    tags,
    onTaskCreated,
    isDark
}: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [isImportant, setIsImportant] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const modalRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setSelectedTagId(null);
            setIsImportant(false);
            setIsRecurring(false);
            setError("");
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const { data, error: createError } = await createTask({
                user_id: userId,
                title: title.trim(),
                tag_id: selectedTagId,
                is_important: isImportant,
                is_completed: false,
                is_recurring: isRecurring,
                total_time_spent: 0,
                date: selectedDate
            });

            if (createError) {
                setError(createError.message || "Failed to create task");
                return;
            }

            onTaskCreated();
            onClose();
        } catch (err) {
            console.error("Error creating task:", err);
            setError("An unexpected error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
            <div
                ref={modalRef}
                className={`w-full max-w-md max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border ${isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200"
                    }`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-3 sm:p-5 border-b sticky top-0 z-10 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                        }`}
                >
                    <h2
                        className={`text-base sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                            }`}
                    >
                        Add New Task
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-1.5 sm:p-2 rounded-lg transition ${isDark
                            ? "hover:bg-slate-700 text-slate-400"
                            : "hover:bg-slate-100 text-slate-500"
                            }`}
                        disabled={saving}
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div
                            className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${isDark
                                ? "bg-red-900/20 border-red-800 text-red-400"
                                : "bg-red-50 border-red-200 text-red-700"
                                }`}
                        >
                            {error}
                        </div>
                    )}

                    {/* Task Title */}
                    <div>
                        <label
                            className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                        >
                            Task Title *
                        </label>
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm ${isDark
                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                                }`}
                            disabled={saving}
                            maxLength={200}
                        />
                    </div>

                    {/* Tag Selection */}
                    <div>
                        <label
                            className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                        >
                            Tag (Optional)
                        </label>
                        {tags.length === 0 ? (
                            <p
                                className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-500"
                                    }`}
                            >
                                No tags available. Create tags first!
                            </p>
                        ) : (
                            <select
                                value={selectedTagId || ""}
                                onChange={(e) =>
                                    setSelectedTagId(e.target.value || null)
                                }
                                className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm ${isDark
                                    ? "bg-slate-700 border-slate-600 text-white"
                                    : "bg-white border-slate-300 text-slate-900"
                                    }`}
                                disabled={saving}
                            >
                                <option value="">No tag</option>
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        #{tag.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Tag Preview */}
                    {selectedTagId && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Preview:</span>
                            {(() => {
                                const tag = tags.find((t) => t.id === selectedTagId);
                                if (!tag) return null;
                                return (
                                    <span
                                        className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium"
                                        style={{
                                            backgroundColor: isDark
                                                ? TAG_COLORS[tag.color].darkBg
                                                : TAG_COLORS[tag.color].lightBg,
                                            color: isDark
                                                ? TAG_COLORS[tag.color].darkText
                                                : TAG_COLORS[tag.color].lightText,
                                        }}
                                    >
                                        #{tag.name}
                                    </span>
                                );
                            })()}
                        </div>
                    )}

                    {/* Important Toggle */}
                    <div className="flex items-center justify-between">
                        <label
                            className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                        >
                            Mark as Important
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsImportant(!isImportant)}
                            className={`p-1.5 sm:p-2 rounded-lg transition ${isImportant
                                ? "bg-yellow-500/20 text-yellow-500"
                                : isDark
                                    ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            disabled={saving}
                        >
                            <Star
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${isImportant ? "fill-yellow-500" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <label
                                className={`text-xs sm:text-sm font-medium block ${isDark ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Daily Recurring Task
                            </label>
                            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                                Task will appear every day until completed
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={`p-1.5 sm:p-2 rounded-lg transition ml-2 ${isRecurring
                                ? "bg-indigo-500/20 text-indigo-500"
                                : isDark
                                    ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            disabled={saving}
                        >
                            <Repeat
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecurring ? "animate-pulse" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 sm:gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg font-medium transition text-xs sm:text-sm ${isDark
                                ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
                            disabled={saving || !title.trim()}
                        >
                            {saving ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Add Task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}