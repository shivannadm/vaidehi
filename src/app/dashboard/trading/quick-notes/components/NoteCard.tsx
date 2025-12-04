// src/app/dashboard/trading/quick-notes/components/NoteCard.tsx
"use client";

import { useState } from "react";
import { Edit2, Trash2, Calendar, Tag, Sunrise, Sunset, Lightbulb, FileText } from "lucide-react";
import type { QuickNote } from "@/types/database";

interface NoteCardProps {
  note: QuickNote;
  onEdit: (note: QuickNote) => void;
  onDelete: (noteId: string) => void;
  isDark: boolean;
}

export default function NoteCard({ note, onEdit, onDelete, isDark }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this note?")) return;

    setIsDeleting(true);
    await onDelete(note.id);
    setIsDeleting(false);
  };

  // Note type configuration
  const typeConfig = {
    pre_market: {
      icon: <Sunrise className="w-4 h-4" />,
      label: "Pre-Market",
      bg: isDark
        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
        : "bg-orange-50 text-orange-600 border-orange-200",
    },
    post_market: {
      icon: <Sunset className="w-4 h-4" />,
      label: "Post-Market",
      bg: isDark
        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
        : "bg-purple-50 text-purple-600 border-purple-200",
    },
    idea: {
      icon: <Lightbulb className="w-4 h-4" />,
      label: "Idea",
      bg: isDark
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    general: {
      icon: <FileText className="w-4 h-4" />,
      label: "General",
      bg: isDark
        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
        : "bg-blue-50 text-blue-600 border-blue-200",
    },
  };

  const config = typeConfig[note.note_type];

  return (
    <div
      className={`rounded-xl border p-5 transition-all hover:shadow-lg ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
          : "bg-white border-slate-200 hover:border-indigo-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${config.bg}`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(note)}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "hover:bg-slate-700 text-slate-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            title="Edit note"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "hover:bg-red-900/30 text-red-400"
                : "hover:bg-red-50 text-red-600"
            } disabled:opacity-50`}
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`text-sm mb-4 whitespace-pre-wrap ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {note.content}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                isDark
                  ? "bg-indigo-900/30 text-indigo-300"
                  : "bg-indigo-50 text-indigo-700"
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date */}
      <div
        className={`flex items-center gap-2 text-xs pt-4 border-t ${
          isDark
            ? "text-slate-400 border-slate-700"
            : "text-slate-600 border-slate-200"
        }`}
      >
        <Calendar className="w-3 h-3" />
        <span>{new Date(note.date).toLocaleDateString()}</span>
        <span className={isDark ? "text-slate-600" : "text-slate-400"}>•</span>
        <span>{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}