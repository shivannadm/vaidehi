"use client";

import { useState } from "react";
import { Pin, Trash2, Archive, Calendar, Clock } from "lucide-react";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      className={`group cursor-pointer rounded-xl p-3 sm:p-4 border-2 transition-all hover:shadow-lg active:scale-[0.98] relative ${viewMode === "list" ? "flex items-start gap-3 sm:gap-4" : ""
        }`}
      style={{
        backgroundColor: isDark ? colorConfig.darkBg : colorConfig.lightBg,
        borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
      }}
    >
      {/* Pinned Indicator */}
      {note.is_pinned && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <Pin
            className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
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
            className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 truncate pr-6 sm:pr-8"
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
            className={`text-xs sm:text-sm mb-2 sm:mb-3 ${viewMode === "grid" ? "line-clamp-3 sm:line-clamp-4" : "line-clamp-2"
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
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {note.labels.slice(0, 3).map((label, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium"
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
            {note.labels.length > 3 && (
              <span
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: isDark
                    ? colorConfig.darkBorder
                    : colorConfig.lightBorder,
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
              >
                +{note.labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Date Information - MOBILE: Smaller text */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs mt-2">
          <div
            className="flex items-center gap-1"
            style={{
              color: isDark
                ? colorConfig.darkText + "99"
                : colorConfig.lightText + "99",
            }}
            title={`Created: ${new Date(note.created_at).toLocaleString()}`}
          >
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">{formatDate(note.created_at)}</span>
            <span className="sm:hidden">{formatDate(note.created_at).split(' ')[0]}</span>
          </div>

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
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Edited {formatDate(note.updated_at)}</span>
                <span className="sm:hidden">Edit</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions - MOBILE: Always show on touch, hover on desktop */}
      <div className="flex items-start gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute top-2 sm:top-3 right-2 sm:right-3">
        <button
          onClick={handlePin}
          className="p-1 sm:p-1.5 rounded-lg transition hover:bg-black/10 active:scale-95"
          title={note.is_pinned ? "Unpin" : "Pin"}
        >
          <Pin
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${note.is_pinned ? "fill-current" : ""}`}
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </button>

        <button
          onClick={handleArchive}
          className="p-1 sm:p-1.5 rounded-lg transition hover:bg-black/10 active:scale-95"
          title={note.is_archived ? "Unarchive" : "Archive"}
        >
          <Archive
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />
        </button>

        <button
          onClick={handleDelete}
          className="p-1 sm:p-1.5 rounded-lg transition hover:bg-red-500/20 active:scale-95"
          title="Delete"
        >
          <Trash2
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            style={{
              color: isDark ? "#ef4444" : "#dc2626",
            }}
          />
        </button>
      </div>
    </div>
  );
}