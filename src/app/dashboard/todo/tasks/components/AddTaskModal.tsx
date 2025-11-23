
// src/app/dashboard/todo/tasks/components/AddTaskModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Star } from "lucide-react";
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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const modalRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setSelectedTagId(null);
            setIsImportant(false);
            setError("");
            // Focus title input
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on ESC key
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

    // Close on click outside
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
                total_time_spent: 0,
                date: selectedDate
            });

            if (createError) {
                setError(createError.message || "Failed to create task");
                return;
            }

            // Success!
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className={`w-full max-w-md mx-4 rounded-xl shadow-2xl border ${isDark
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-5 border-b ${isDark ? "border-slate-700" : "border-slate-200"
                        }`}
                >
                    <h2
                        className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                            }`}
                    >
                        Add New Task
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition ${isDark
                                ? "hover:bg-slate-700 text-slate-400"
                                : "hover:bg-slate-100 text-slate-500"
                            }`}
                        disabled={saving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div
                            className={`p-3 rounded-lg border text-sm ${isDark
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
                            className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
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
                            className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
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
                            className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                        >
                            Tag (Optional)
                        </label>
                        {tags.length === 0 ? (
                            <p
                                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"
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
                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
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
                            <span className="text-sm text-slate-500">Preview:</span>
                            {(() => {
                                const tag = tags.find((t) => t.id === selectedTagId);
                                if (!tag) return null;
                                return (
                                    <span
                                        className="text-sm px-3 py-1 rounded-full font-medium"
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
                            className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                        >
                            Mark as Important
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsImportant(!isImportant)}
                            className={`p-2 rounded-lg transition ${isImportant
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : isDark
                                        ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            disabled={saving}
                        >
                            <Star
                                className={`w-5 h-5 ${isImportant ? "fill-yellow-500" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2.5 border rounded-lg font-medium transition ${isDark
                                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={saving || !title.trim()}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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