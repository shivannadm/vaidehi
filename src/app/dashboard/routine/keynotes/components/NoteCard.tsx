// src/app/dashboard/routine/keynotes/components/NoteCard.tsx
"use client";

import { useState } from "react";
import {
  MoreVertical, Pin, Star, Archive, Trash2, Edit2,
  Link2, Calendar, Tag, CheckCircle, Clock, Eye
} from "lucide-react";
import type { KeyNote, NoteType, NoteCategory } from "../hooks/useKeyNotes";

interface NoteCardProps {
  note: KeyNote;
  onEdit: (note: KeyNote) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string, currentState: boolean) => void;
  onToggleFavorite: (noteId: string, currentState: boolean) => void;
  onArchive: (noteId: string) => void;
  onReview: (noteId: string, currentCount: number) => void;
  isDark: boolean;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onArchive,
  onReview,
  isDark,
}: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const typeConfig = getNoteTypeConfig(note.type);
  const categoryColor = getCategoryColor(note.category);

  const handleReview = () => {
    onReview(note.id, note.review_count);
  };

  return (
    <div
      className={`group relative rounded-xl p-5 border-2 transition-all hover:shadow-lg ${note.is_pinned
          ? isDark
            ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-600'
            : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-400'
          : isDark
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{typeConfig.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'
                }`}
            >
              {note.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
                  }`}
              >
                {typeConfig.label}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: isDark ? `${categoryColor}40` : `${categoryColor}20`,
                  color: isDark ? '#fff' : categoryColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDark ? categoryColor : `${categoryColor}60`,
                }}
              >
                {note.category}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onTogglePin(note.id, note.is_pinned)}
            className={`p-2 rounded-lg transition ${note.is_pinned ? 'text-indigo-500' : ''
              } ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            title={note.is_pinned ? "Unpin" : "Pin"}
          >
            <Pin className={`w-4 h-4 ${note.is_pinned ? 'fill-indigo-500' : ''}`} />
          </button>
          <button
            onClick={() => onToggleFavorite(note.id, note.is_favorite)}
            className={`p-2 rounded-lg transition ${note.is_favorite ? 'text-yellow-500' : ''
              } ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            title={note.is_favorite ? "Remove favorite" : "Add to favorites"}
          >
            <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-yellow-500' : ''}`} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border z-20 overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                >
                  <button
                    onClick={() => {
                      onEdit(note);
                      setShowMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50'
                      }`}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onArchive(note.id);
                      setShowMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50'
                      }`}
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this note permanently?')) {
                        onDelete(note.id);
                      }
                      setShowMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                      }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p
          className={`text-sm ${expanded ? '' : 'line-clamp-3'
            } ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
        >
          {note.content}
        </p>
        {note.content.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-xs font-medium mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium ${isDark
                  ? 'bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {note.source && (
            <div className="flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {note.source}
              </span>
            </div>
          )}
          {note.linked_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {new Date(note.linked_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {note.action_required && (
            <div
              className={`flex items-center gap-1 ${note.action_completed ? 'text-green-500' : 'text-orange-500'
                }`}
            >
              {note.action_completed ? (
                <CheckCircle className="w-3 h-3 fill-current" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <span className="font-medium">Action</span>
            </div>
          )}
        </div>

        <button
          onClick={handleReview}
          className={`flex items-center gap-1 px-2 py-1 rounded transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          title="Mark as reviewed"
        >
          <Eye className="w-3 h-3" />
          <span>{note.review_count}</span>
        </button>
      </div>

      {/* Action Deadline */}
      {note.action_required && note.action_deadline && !note.action_completed && (
        <div
          className={`mt-3 p-2 rounded-lg text-xs font-medium ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-700'
            }`}
        >
          ⏰ Due: {new Date(note.action_deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
    </div>
  );
}

// Helper functions
function getNoteTypeConfig(type: NoteType) {
  const configs = {
    insight: { label: 'Insight', emoji: '💡' },
    lesson: { label: 'Lesson', emoji: '📚' },
    breakthrough: { label: 'Breakthrough', emoji: '🚀' },
    idea: { label: 'Idea', emoji: '🎯' },
    quote: { label: 'Quote', emoji: '💬' },
    reminder: { label: 'Reminder', emoji: '⏰' },
  };
  return configs[type];
}

function getCategoryColor(category: NoteCategory) {
  const colors = {
    personal: '#ec4899',
    work: '#3b82f6',
    health: '#10b981',
    finance: '#f59e0b',
    relationships: '#8b5cf6',
    learning: '#06b6d4',
  };
  return colors[category];
}