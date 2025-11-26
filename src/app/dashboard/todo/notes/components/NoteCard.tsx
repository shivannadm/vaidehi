// src/app/dashboard/todo/notes/components/NoteCard.tsx
"use client";

import { useState } from "react";
import { Pin, Trash2, Archive, MoreVertical } from "lucide-react";
import type { Note } from "@/types/database";
import { NOTE_COLORS } from "@/types/database";

interface NoteCardProps {
  note: Note;
  viewMode: "grid" | "list";
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
  isDark: boolean;
}

export default function NoteCard({
  note,
  viewMode,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  isDark
}: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const colorConfig = NOTE_COLORS[note.color];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete note "${note.title || 'Untitled'}"?`)) {
      await onDelete(note.id);
    }
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onTogglePin(note.id);
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleArchive(note.id);
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`group cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-lg ${
        viewMode === "list" ? "flex items-start gap-4" : ""
      }`}
      style={{
        backgroundColor: isDark ? colorConfig.darkBg : colorConfig.lightBg,
        borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
      }}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        {note.title && (
          <h3
            className="font-bold text-lg mb-2 truncate"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          >
            {note.title}
          </h3>
        )}

        {/* Content Preview */}
        {note.content && (
          <p
            className={`text-sm mb-3 ${
              viewMode === "grid" ? "line-clamp-4" : "line-clamp-2"
            }`}
            style={{
              color: isDark 
                ? colorConfig.darkText + "CC" 
                : colorConfig.lightText + "CC",
            }}
          >
            {note.content}
          </p>
        )}

        {/* Labels */}
        {note.labels && note.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.labels.map((label, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: isDark 
                    ? colorConfig.darkBorder 
                    : colorConfig.lightBorder,
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
              >
                #{label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions - Show on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Pin */}
        <button
          onClick={handlePin}
          className="p-1.5 rounded-lg transition hover:bg-black/10"
          title={note.is_pinned ? "Unpin" : "Pin"}
        >
          <Pin
            className={`w-4 h-4 ${
              note.is_pinned ? "fill-current" : ""
            }`}
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </button>

        {/* Archive */}
        <button
          onClick={handleArchive}
          className="p-1.5 rounded-lg transition hover:bg-black/10"
          title={note.is_archived ? "Unarchive" : "Archive"}
        >
          <Archive
            className="w-4 h-4"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg transition hover:bg-red-500/20"
          title="Delete"
        >
          <Trash2
            className="w-4 h-4"
            style={{
              color: isDark ? "#ef4444" : "#dc2626",
            }}
          />
        </button>
      </div>

      {/* Pinned Indicator */}
      {note.is_pinned && (
        <div className="absolute top-2 right-2">
          <Pin
            className="w-4 h-4 fill-current"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </div>
      )}
    </div>
  );
}