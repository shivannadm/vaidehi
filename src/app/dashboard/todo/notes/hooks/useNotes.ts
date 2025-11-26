// src/app/dashboard/todo/notes/hooks/useNotes.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Note } from "@/types/database";

export function useNotes(userId: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (noteData: Partial<Note>) => {
    if (!userId) return;

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          title: noteData.title || "",
          content: noteData.content || "",
          color: noteData.color || "default",
          labels: noteData.labels || [],
          is_pinned: false,
          is_archived: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateNote = async (noteData: Partial<Note>) => {
    if (!noteData.id) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("notes")
        .update({
          title: noteData.title,
          content: noteData.content,
          color: noteData.color,
          labels: noteData.labels,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteData.id);

      if (error) {
        console.error("Error updating note:", error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) {
        console.error("Error deleting note:", error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const togglePin = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("notes")
        .update({ is_pinned: !note.is_pinned })
        .eq("id", noteId);

      if (error) {
        console.error("Error toggling pin:", error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleArchive = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("notes")
        .update({ is_archived: !note.is_archived })
        .eq("id", noteId);

      if (error) {
        console.error("Error toggling archive:", error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
  };
}