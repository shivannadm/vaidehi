// src/app/dashboard/routine/keynotes/components/NoteEditor.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Tag, Plus, Calendar, Link2, CheckSquare } from "lucide-react";
import type { KeyNote, NoteType, NoteCategory } from "../hooks/useKeyNotes";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note: KeyNote | null;
  onSave: (noteData: any) => Promise<{ success: boolean; error?: string }>;
  isDark: boolean;
}

export default function NoteEditor({
  isOpen,
  onClose,
  note,
  onSave,
  isDark,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>("insight");
  const [category, setCategory] = useState<NoteCategory>("personal");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [source, setSource] = useState("");
  const [linkedDate, setLinkedDate] = useState("");
  const [actionRequired, setActionRequired] = useState(false);
  const [actionDeadline, setActionDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setType(note.type);
        setCategory(note.category);
        setTags(note.tags || []);
        setSource(note.source || "");
        setLinkedDate(note.linked_date || "");
        setActionRequired(note.action_required);
        setActionDeadline(note.action_deadline || "");
      } else {
        resetForm();
      }
      setError("");
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("insight");
    setCategory("personal");
    setTags([]);
    setNewTag("");
    setSource("");
    setLinkedDate("");
    setActionRequired(false);
    setActionDeadline("");
    setError("");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      type,
      category,
      tags,
      source: source.trim() || null,
      linked_date: linkedDate || null,
      action_required: actionRequired,
      action_completed: note?.action_completed || false,
      action_deadline: actionDeadline || null,
      linked_notes: note?.linked_notes || [],
      is_pinned: note?.is_pinned || false,
      is_favorite: note?.is_favorite || false,
      is_archived: false,
    };

    const result = await onSave(noteData);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error || "Failed to save note");
    }

    setSaving(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const noteTypes: { value: NoteType; label: string; emoji: string }[] = [
    { value: "insight", label: "Insight", emoji: "💡" },
    { value: "lesson", label: "Lesson", emoji: "📚" },
    { value: "breakthrough", label: "Breakthrough", emoji: "🚀" },
    { value: "idea", label: "Idea", emoji: "🎯" },
    { value: "quote", label: "Quote", emoji: "💬" },
    { value: "reminder", label: "Reminder", emoji: "⏰" },
  ];

  const categories: { value: NoteCategory; label: string; color: string }[] = [
    { value: "personal", label: "Personal", color: "#ec4899" },
    { value: "work", label: "Work", color: "#3b82f6" },
    { value: "health", label: "Health", color: "#10b981" },
    { value: "finance", label: "Finance", color: "#f59e0b" },
    { value: "relationships", label: "Relationships", color: "#8b5cf6" },
    { value: "learning", label: "Learning", color: "#06b6d4" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className={`w-full max-w-3xl rounded-xl shadow-2xl border-2 overflow-hidden max-h-[90vh] overflow-y-auto ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b-2 sticky top-0 z-10 ${
            isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {note ? "Edit Key Note" : "Create New Key Note"}
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {error && (
            <div
              className={`p-3 rounded-lg border text-sm ${
                isDark
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Learned about compound interest"
              className={`w-full px-4 py-3 rounded-lg border text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
              maxLength={100}
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Note Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {noteTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`p-2.5 rounded-lg text-sm font-medium transition border-2 ${
                      type === t.value
                        ? isDark
                          ? "border-indigo-400 bg-indigo-500/20 text-indigo-300"
                          : "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : isDark
                        ? "border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-700/50"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`p-2.5 rounded-lg text-sm font-medium transition border-2 ${
                      category === c.value
                        ? isDark
                          ? "border-indigo-400 text-white"
                          : "border-indigo-500"
                        : isDark
                        ? "border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-700/50"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                    style={
                      category === c.value
                        ? { backgroundColor: isDark ? c.color + "30" : c.color + "20", borderColor: c.color }
                        : {}
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your key insight, lesson, or idea here..."
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
                maxLength={20}
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Source & Linked Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Link2 className="w-4 h-4 inline mr-1" />
                Source (optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Book, person, event..."
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Calendar className="w-4 h-4 inline mr-1" />
                Link to Date (optional)
              </label>
              <input
                type="date"
                value={linkedDate}
                onChange={(e) => setLinkedDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* Action Required */}
          <div className={`p-4 rounded-lg border ${
            isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <label className={`flex items-center gap-2 text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                <CheckSquare className="w-4 h-4" />
                Requires Action
              </label>
              <button
                type="button"
                onClick={() => setActionRequired(!actionRequired)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  actionRequired
                    ? "bg-orange-600 text-white"
                    : isDark
                    ? "bg-slate-600 text-slate-300"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {actionRequired ? "Yes" : "No"}
              </button>
            </div>
            {actionRequired && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Action Deadline
                </label>
                <input
                  type="date"
                  value={actionDeadline}
                  onChange={(e) => setActionDeadline(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 p-5 border-t-2 sticky bottom-0 ${
            isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
          }`}
        >
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : note ? "Update Note" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
}