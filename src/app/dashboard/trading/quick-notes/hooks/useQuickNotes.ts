// src/app/dashboard/trading/quick-notes/hooks/useQuickNotes.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getQuickNotes,
  getQuickNotesByType,
  createQuickNote,
  updateQuickNote,
  deleteQuickNote,
} from "@/lib/supabase/trading-helpers";
import type { QuickNote, TradingNoteType, CreateQuickNote } from "@/types/database";

type FilterType = "all" | TradingNoteType;

export function useQuickNotes(userId: string | null) {
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<QuickNote[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getQuickNotes(userId);

      if (result.error) {
        setError("Failed to load notes");
        console.error("Error fetching notes:", result.error);
        return;
      }

      setNotes(result.data || []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Apply filters
  useEffect(() => {
    let result = [...notes];

    // Type filter
    if (filterType !== "all") {
      result = result.filter((note) => note.note_type === filterType);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((note) =>
        note.content.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + (a.created_at || '00:00:00')).getTime();
      const dateB = new Date(b.date + 'T' + (b.created_at || '00:00:00')).getTime();
      return dateB - dateA;
    });

    setFilteredNotes(result);
  }, [notes, filterType, searchQuery]);

  // Add note
  const addNote = async (noteData: CreateQuickNote) => {
    try {
      const { data, error: createError } = await createQuickNote(noteData);

      if (createError) {
        throw new Error("Failed to create note");
      }

      if (data) {
        await fetchNotes();
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error creating note:", err);
      return { success: false, error: err };
    }
  };

  // Update note
  const updateNoteData = async (noteId: string, updates: Partial<QuickNote>) => {
    try {
      const { data, error: updateError } = await updateQuickNote(noteId, updates);

      if (updateError) {
        throw new Error("Failed to update note");
      }

      if (data) {
        await fetchNotes();
        return { success: true, data };
      }

      return { success: false };
    } catch (err) {
      console.error("Error updating note:", err);
      return { success: false, error: err };
    }
  };

  // Delete note
  const deleteNoteData = async (noteId: string) => {
    try {
      const { error: deleteError } = await deleteQuickNote(noteId);

      if (deleteError) {
        throw new Error("Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting note:", err);
      return { success: false, error: err };
    }
  };

  return {
    notes: filteredNotes,
    allNotes: notes,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addNote,
    updateNote: updateNoteData,
    deleteNote: deleteNoteData,
    refreshNotes: fetchNotes,
  };
}