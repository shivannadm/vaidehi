// src/app/dashboard/trading/quick-notes/components/AddNoteModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Sunrise, Sunset, Lightbulb, FileText } from "lucide-react";
import type { QuickNote, TradingNoteType, CreateQuickNote } from "@/types/database";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: CreateQuickNote | { id: string; updates: Partial<QuickNote> }) => Promise<{ success: boolean }>;
  userId: string;
  isDark: boolean;
  editingNote?: QuickNote | null;
}

const NOTE_TYPES: Array<{ value: TradingNoteType; label: string; icon: React.ReactNode }> = [
  { value: "pre_market", label: "Pre-Market", icon: <Sunrise className="w-5 h-5" /> },
  { value: "post_market", label: "Post-Market", icon: <Sunset className="w-5 h-5" /> },
  { value: "idea", label: "Trading Idea", icon: <Lightbulb className="w-5 h-5" /> },
  { value: "general", label: "General Note", icon: <FileText className="w-5 h-5" /> },
];

export default function AddNoteModal({
  isOpen,
  onClose,
  onSave,
  userId,
  isDark,
  editingNote,
}: AddNoteModalProps) {
  const [noteType, setNoteType] = useState<TradingNoteType>("general");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingNote) {
      setNoteType(editingNote.note_type);
      setContent(editingNote.content);
      setDate(editingNote.date);
      setTags(editingNote.tags?.join(", ") || "");
    } else {
      resetForm();
    }
  }, [editingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter note content");
      return;
    }

    setIsSaving(true);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      // Update existing note
      const result = await onSave({
        id: editingNote.id,
        updates: {
          note_type: noteType,
          content: content.trim(),
          date,
          tags: tagArray.length > 0 ? tagArray : null,
        },
      } as any);

      setIsSaving(false);

      if (result.success) {
        resetForm();
        onClose();
      } else {
        alert("Failed to update note");
      }
    } else {
      // Create new note
      const newNote: CreateQuickNote = {
        user_id: userId,
        note_type: noteType,
        content: content.trim(),
        date,
        tags: tagArray.length > 0 ? tagArray : null,
      };

      const result = await onSave(newNote as any);

      setIsSaving(false);

      if (result.success) {
        resetForm();
        onClose();
      } else {
        alert("Failed to create note");
      }
    }
  };

  const resetForm = () => {
    setNoteType("general");
    setContent("");
    setDate(new Date().toISOString().split("T")[0]);
    setTags("");
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-2xl my-8 rounded-xl shadow-2xl ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {editingNote ? "Edit Note" : "Add Quick Note"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            } disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Note Type Selection */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Note Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {NOTE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setNoteType(type.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                    noteType === type.value
                      ? "border-indigo-500 bg-indigo-500/10"
                      : isDark
                      ? "border-slate-700 hover:border-slate-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={
                      noteType === type.value
                        ? "text-indigo-500"
                        : isDark
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  >
                    {type.icon}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      noteType === type.value
                        ? "text-indigo-500"
                        : isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Content */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Note Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              required
              className={`w-full px-4 py-2.5 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Tags */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., SPY, breakout, trend (comma separated)"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
            <p className={`text-xs mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Separate multiple tags with commas
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition ${
                isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editingNote ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}