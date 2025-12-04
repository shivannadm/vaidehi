// src/app/dashboard/trading/quick-notes/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, FileText, Loader2 } from "lucide-react";
import { useQuickNotes } from "./hooks/useQuickNotes";
import NoteFilters from "./components/NoteFilters";
import NoteCard from "./components/NoteCard";
import AddNoteModal from "./components/AddNoteModal";
import type { QuickNote } from "@/types/database";

export default function QuickNotesPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null);

  const {
    notes,
    allNotes,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
  } = useQuickNotes(userId);

  // Auth and theme setup
  useEffect(() => {
    setMounted(true);

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        window.location.href = "/login";
      }
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

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: allNotes.length,
      pre_market: allNotes.filter((n) => n.note_type === "pre_market").length,
      post_market: allNotes.filter((n) => n.note_type === "post_market").length,
      idea: allNotes.filter((n) => n.note_type === "idea").length,
      general: allNotes.filter((n) => n.note_type === "general").length,
    };
  }, [allNotes]);

  const handleEdit = (note: QuickNote) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (data.id) {
      // Update existing note
      return await updateNote(data.id, data.updates);
    } else {
      // Create new note
      return await addNote(data);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <FileText className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              Quick Notes
            </h1>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Capture your trading thoughts and observations
            </p>
          </div>

          <button
            onClick={() => {
              setEditingNote(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Filters */}
        <NoteFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          counts={filterCounts}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notes.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl border ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <FileText
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-slate-600" : "text-slate-300"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {searchQuery || filterType !== "all" ? "No notes found" : "No Notes Yet"}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Start capturing your trading observations and ideas"}
            </p>
            {!searchQuery && filterType === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Create Your First Note
              </button>
            )}
          </div>
        )}

        {/* Notes Grid */}
        {!loading && !error && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={deleteNote}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        userId={userId || ""}
        isDark={isDark}
        editingNote={editingNote}
      />
    </div>
  );
}