// src/app/dashboard/routine/keynotes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useKeyNotes } from "./hooks/useKeyNotes";
import NoteCard from "./components/NoteCard";
import NoteEditor from "./components/NoteEditor";
import {
  Plus, Search, Filter, Star, Archive, Pin, Lightbulb,
  LayoutGrid, List, SlidersHorizontal
} from "lucide-react";
import type { KeyNote, NoteType, NoteCategory } from "./hooks/useKeyNotes";

export default function KeyNotesPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<KeyNote | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<NoteType | "all">("all");
  const [filterCategory, setFilterCategory] = useState<NoteCategory | "all">("all");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showActionsOnly, setShowActionsOnly] = useState(false);

  const {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    archiveNote,
    incrementReview,
  } = useKeyNotes(userId);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    init();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !note.title.toLowerCase().includes(query) &&
        !note.content.toLowerCase().includes(query) &&
        !note.tags.some((tag) => tag.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    if (filterType !== "all" && note.type !== filterType) return false;
    if (filterCategory !== "all" && note.category !== filterCategory) return false;
    if (showPinnedOnly && !note.is_pinned) return false;
    if (showFavoritesOnly && !note.is_favorite) return false;
    if (showActionsOnly && (!note.action_required || note.action_completed)) return false;

    return true;
  });

  // Separate pinned and regular notes
  const pinnedNotes = filteredNotes.filter((n) => n.is_pinned);
  const regularNotes = filteredNotes.filter((n) => !n.is_pinned);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: KeyNote) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (noteData: any) => {
    if (editingNote) {
      return await updateNote(editingNote.id, noteData);
    } else {
      return await createNote(noteData);
    }
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Loading notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                Key Notes
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your daily insights and learning journal
              </p>
            </div>

            <button
              onClick={handleCreateNote}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>

          {/* Filters & Actions Bar */}
          <div className={`rounded-xl border p-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="all">All Types</option>
                <option value="insight">💡 Insight</option>
                <option value="lesson">📚 Lesson</option>
                <option value="breakthrough">🚀 Breakthrough</option>
                <option value="idea">🎯 Idea</option>
                <option value="quote">💬 Quote</option>
                <option value="reminder">⏰ Reminder</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="all">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="relationships">Relationships</option>
                <option value="learning">Learning</option>
              </select>

              {/* Quick Filters */}
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  showPinnedOnly
                    ? 'bg-indigo-500/20 text-indigo-500 border-2 border-indigo-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Pin className={`w-4 h-4 ${showPinnedOnly ? 'fill-indigo-500' : ''}`} />
                Pinned
              </button>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  showFavoritesOnly
                    ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
                Favorites
              </button>

              <button
                onClick={() => setShowActionsOnly(!showActionsOnly)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  showActionsOnly
                    ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Actions
              </button>

              {/* View Toggle */}
              <div className={`flex items-center rounded-lg border ${
                isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-l-lg transition ${
                    viewMode === "grid"
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-r-lg transition ${
                    viewMode === "list"
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes Grid/List */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💡</div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {notes.length === 0 ? 'No notes yet' : 'No notes found'}
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {notes.length === 0
                  ? 'Start capturing your insights and learnings'
                  : 'Try adjusting your filters'}
              </p>
              {notes.length === 0 && (
                <button
                  onClick={handleCreateNote}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Create First Note
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Pin className="w-5 h-5 fill-indigo-500 text-indigo-500" />
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Pinned Notes
                    </h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {pinnedNotes.length}
                    </span>
                  </div>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-3"
                  }>
                    {pinnedNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onArchive={archiveNote}
                        onReview={incrementReview}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Notes */}
              {regularNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      All Notes
                    </h2>
                  )}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-3"
                  }>
                    {regularNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onArchive={archiveNote}
                        onReview={incrementReview}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Footer */}
          {notes.length > 0 && (
            <div className={`rounded-xl border p-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {notes.length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Total Notes
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-indigo-500`}>
                    {notes.filter(n => n.is_pinned).length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Pinned
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-yellow-500`}>
                    {notes.filter(n => n.is_favorite).length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Favorites
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-orange-500`}>
                    {notes.filter(n => n.action_required && !n.action_completed).length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Pending Actions
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        note={editingNote}
        onSave={handleSaveNote}
        isDark={isDark}
      />
    </div>
  );
}