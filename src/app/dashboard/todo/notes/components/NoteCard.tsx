// src/app/dashboard/todo/notes/components/NoteCard.tsx
"use client";

import { useState } from "react";
import { Pin, Trash2, Archive, MoreVertical, Calendar, Clock } from "lucide-react";
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If today
    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // If yesterday
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    
    // If within last week
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
    
    // If within current year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Full date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
      className={`group cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-lg relative ${
        viewMode === "list" ? "flex items-start gap-4" : ""
      }`}
      style={{
        backgroundColor: isDark ? colorConfig.darkBg : colorConfig.lightBg,
        borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
      }}
    >
      {/* Pinned Indicator */}
      {note.is_pinned && (
        <div className="absolute top-3 right-3">
          <Pin
            className="w-4 h-4 fill-current"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        {note.title && (
          <h3
            className="font-bold text-lg mb-2 truncate pr-8"
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
          <div className="flex flex-wrap gap-1 mb-3">
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

        {/* Date Information */}
        <div className="flex items-center gap-3 text-xs mt-2">
          {/* Created Date */}
          <div 
            className="flex items-center gap-1"
            style={{
              color: isDark 
                ? colorConfig.darkText + "99" 
                : colorConfig.lightText + "99",
            }}
            title={`Created: ${new Date(note.created_at).toLocaleString()}`}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(note.created_at)}</span>
          </div>

          {/* Edited Date (if different from created) */}
          {note.updated_at && note.updated_at !== note.created_at && (
            <>
              <span 
                style={{
                  color: isDark 
                    ? colorConfig.darkText + "66" 
                    : colorConfig.lightText + "66",
                }}
              >
                •
              </span>
              <div 
                className="flex items-center gap-1"
                style={{
                  color: isDark 
                    ? colorConfig.darkText + "99" 
                    : colorConfig.lightText + "99",
                }}
                title={`Edited: ${new Date(note.updated_at).toLocaleString()}`}
              >
                <Clock className="w-3 h-3" />
                <span>Edited {formatDate(note.updated_at)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions - Show on hover */}
      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3">
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
    </div>
  );
}