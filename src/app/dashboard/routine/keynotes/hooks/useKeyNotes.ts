// src/app/dashboard/routine/keynotes/hooks/useKeyNotes.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type NoteType = 'insight' | 'lesson' | 'breakthrough' | 'idea' | 'quote' | 'reminder';
export type NoteCategory = 'personal' | 'work' | 'health' | 'finance' | 'relationships' | 'learning';

export interface KeyNote {
  id: string;
  user_id: string;

  // Core Content
  title: string;
  content: string;
  type: NoteType;
  category: NoteCategory;

  // Metadata
  tags: string[];
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;

  // Context
  source?: string | null; // Book, person, event, etc.
  linked_date?: string | null; // YYYY-MM-DD (link to routine day)

  // Action Items
  action_required: boolean;
  action_completed: boolean;
  action_deadline?: string | null;

  // Knowledge Management
  linked_notes: string[]; // IDs of related notes
  review_count: number;
  last_reviewed?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export function useKeyNotes(userId: string | null) {
  const [notes, setNotes] = useState<KeyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadNotes(userId);
  }, [userId]);

  const loadNotes = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('key_notes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message || 'Failed to load notes');
      } else {
        setNotes(data as KeyNote[] || []);
      }
    } catch (err) {
      setError('Unexpected error loading notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Omit<KeyNote, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'review_count'>) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const supabase = createClient();
      const { data, error: createError } = await supabase
        .from('key_notes')
        .insert({
          ...noteData,
          user_id: userId,
          review_count: 0,
        })
        .select()
        .single();

      if (createError) {
        return { success: false, error: createError.message };
      }

      await loadNotes(userId);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to create note' };
    }
  };

  const updateNote = async (noteId: string, updates: Partial<KeyNote>) => {
    try {
      const supabase = createClient();
      const { data, error: updateError } = await supabase
        .from('key_notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      await loadNotes(userId!);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to update note' };
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('key_notes')
        .delete()
        .eq('id', noteId);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      await loadNotes(userId!);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete note' };
    }
  };

  const togglePin = async (noteId: string, currentState: boolean) => {
    return await updateNote(noteId, { is_pinned: !currentState });
  };

  const toggleFavorite = async (noteId: string, currentState: boolean) => {
    return await updateNote(noteId, { is_favorite: !currentState });
  };

  const archiveNote = async (noteId: string) => {
    return await updateNote(noteId, { is_archived: true });
  };

  const incrementReview = async (noteId: string, currentCount: number) => {
    return await updateNote(noteId, {
      review_count: currentCount + 1,
      last_reviewed: new Date().toISOString(),
    });
  };

  return {
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
    refresh: () => loadNotes(userId!),
  };
}