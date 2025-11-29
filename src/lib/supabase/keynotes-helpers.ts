// src/lib/supabase/keynotes-helpers.ts
import { createClient } from "@/lib/supabase/client";
import type { KeyNote, NoteType, NoteCategory } from "@/types/database";

const supabase = createClient();

// Get all non-archived notes for a user
export async function getKeyNotes(userId: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Get a single note by ID
export async function getKeyNoteById(noteId: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('id', noteId)
    .single();

  return { data: data as KeyNote | null, error };
}

// Create a new note
export async function createKeyNote(
  noteData: Omit<KeyNote, 'id' | 'created_at' | 'updated_at' | 'review_count'>
) {
  const { data, error } = await supabase
    .from('key_notes')
    .insert({
      ...noteData,
      review_count: 0,
    })
    .select()
    .single();

  return { data: data as KeyNote | null, error };
}

// Update an existing note
export async function updateKeyNote(noteId: string, updates: Partial<KeyNote>) {
  const { data, error } = await supabase
    .from('key_notes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .select()
    .single();

  return { data: data as KeyNote | null, error };
}

// Delete a note
export async function deleteKeyNote(noteId: string) {
  const { error } = await supabase
    .from('key_notes')
    .delete()
    .eq('id', noteId);

  return { error };
}

// Toggle pin status
export async function toggleNotePin(noteId: string, currentState: boolean) {
  return await updateKeyNote(noteId, { is_pinned: !currentState });
}

// Toggle favorite status
export async function toggleNoteFavorite(noteId: string, currentState: boolean) {
  return await updateKeyNote(noteId, { is_favorite: !currentState });
}

// Archive a note
export async function archiveKeyNote(noteId: string) {
  return await updateKeyNote(noteId, { is_archived: true });
}

// Increment review count
export async function incrementReviewCount(noteId: string) {
  const { data: note } = await getKeyNoteById(noteId);
  if (!note) return { data: null, error: { message: 'Note not found' } };

  return await updateKeyNote(noteId, {
    review_count: note.review_count + 1,
    last_reviewed: new Date().toISOString(),
  });
}

// Get notes by type
export async function getNotesByType(userId: string, type: NoteType) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Get notes by category
export async function getNotesByCategory(userId: string, category: NoteCategory) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Get pinned notes
export async function getPinnedNotes(userId: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_pinned', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Get favorite notes
export async function getFavoriteNotes(userId: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Get notes with pending actions
export async function getPendingActionNotes(userId: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('action_required', true)
    .eq('action_completed', false)
    .eq('is_archived', false)
    .order('action_deadline', { ascending: true, nullsFirst: false });

  return { data: data as KeyNote[] | null, error };
}

// Get notes linked to a specific date
export async function getNotesForDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('linked_date', date)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return { data: data as KeyNote[] | null, error };
}

// Search notes (full-text search)
export async function searchKeyNotes(userId: string, query: string) {
  const { data, error } = await supabase
    .rpc('search_key_notes', {
      p_user_id: userId,
      p_query: query,
    });

  return { data: data as KeyNote[] | null, error };
}

// Get notes statistics
export async function getNotesStatistics(userId: string) {
  const { data: notes, error } = await supabase
    .from('key_notes')
    .select('type, category, is_pinned, is_favorite, action_required, action_completed')
    .eq('user_id', userId)
    .eq('is_archived', false);

  if (error || !notes) {
    return {
      total: 0,
      byType: {},
      byCategory: {},
      pinned: 0,
      favorites: 0,
      pendingActions: 0,
    };
  }

  const stats = {
    total: notes.length,
    byType: notes.reduce((acc, note) => {
      acc[note.type] = (acc[note.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    pinned: notes.filter(n => n.is_pinned).length,
    favorites: notes.filter(n => n.is_favorite).length,
    pendingActions: notes.filter(n => n.action_required && !n.action_completed).length,
  };

  return stats;
}

// Get recently reviewed notes
export async function getRecentlyReviewedNotes(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .not('last_reviewed', 'is', null)
    .order('last_reviewed', { ascending: false })
    .limit(limit);

  return { data: data as KeyNote[] | null, error };
}

// Get most reviewed notes
export async function getMostReviewedNotes(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('key_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .gt('review_count', 0)
    .order('review_count', { ascending: false })
    .limit(limit);

  return { data: data as KeyNote[] | null, error };
}