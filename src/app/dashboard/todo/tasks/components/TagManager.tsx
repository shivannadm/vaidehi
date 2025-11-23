 
// src/app/dashboard/todo/tasks/components/TagManager.tsx
"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { createTag, deleteTag } from "@/lib/supabase/task-helpers";
import { TAG_COLORS, type Tag, type TagColor } from "@/types/database";

interface TagManagerProps {
  userId: string;
  tags: Tag[];
  onTagsChanged: () => void;
  isDark: boolean;
}

export default function TagManager({
  userId,
  tags,
  onTagsChanged,
  isDark
}: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState<TagColor>("blue");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

  const availableColors: TagColor[] = [
    "red", "pink", "purple", "indigo", "blue", 
    "cyan", "teal", "green", "lime", "yellow", 
    "orange", "brown", "gray", "slate", "violet"
  ];

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    // Check if tag name already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      setError("Tag name already exists");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { data, error: createError } = await createTag({
        user_id: userId,
        name: newTagName.trim(),
        color: selectedColor
      });

      if (createError) {
        setError(createError.message || "Failed to create tag");
        return;
      }

      // Success!
      setNewTagName("");
      setSelectedColor("blue");
      setIsAdding(false);
      onTagsChanged();
    } catch (err) {
      console.error("Error creating tag:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setDeletingTagId(tagId);

    try {
      const { error: deleteError } = await deleteTag(tagId);

      if (deleteError) {
        console.error("Error deleting tag:", deleteError);
        alert("Failed to delete tag");
        return;
      }

      // Success!
      onTagsChanged();
    } catch (err) {
      console.error("Error deleting tag:", err);
      alert("An unexpected error occurred");
    } finally {
      setDeletingTagId(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTagName("");
    setSelectedColor("blue");
    setError("");
  };

  return (
    <div className="space-y-3">
      {/* Existing Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 group relative"
            style={{
              backgroundColor: isDark
                ? TAG_COLORS[tag.color].darkBg
                : TAG_COLORS[tag.color].lightBg,
              color: isDark
                ? TAG_COLORS[tag.color].darkText
                : TAG_COLORS[tag.color].lightText,
            }}
          >
            #{tag.name}
            <button
              onClick={() => handleDeleteTag(tag.id)}
              disabled={deletingTagId === tag.id}
              className="opacity-70 hover:opacity-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete tag"
            >
              {deletingTagId === tag.id ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}

        {/* Add Tag Button/Form */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        ) : null}
      </div>

      {/* Add Tag Form (Inline) */}
      {isAdding && (
        <div
          className={`p-4 rounded-lg border ${
            isDark
              ? "bg-slate-700/50 border-slate-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="space-y-3">
            {/* Error Message */}
            {error && (
              <div
                className={`p-2 rounded text-sm ${
                  isDark
                    ? "bg-red-900/20 text-red-400"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {error}
              </div>
            )}

            {/* Tag Name Input */}
            <div>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name (e.g., work, study)"
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
                maxLength={20}
                disabled={saving}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>

            {/* Color Picker */}
            <div>
              <label
                className={`block text-xs font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Choose Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-full h-8 rounded-lg transition relative ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-indigo-500"
                        : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: isDark
                        ? TAG_COLORS[color].darkBg
                        : TAG_COLORS[color].lightBg,
                    }}
                    disabled={saving}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check
                        className="w-4 h-4 absolute inset-0 m-auto"
                        style={{
                          color: isDark
                            ? TAG_COLORS[color].darkText
                            : TAG_COLORS[color].lightText,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {newTagName.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Preview:
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: isDark
                      ? TAG_COLORS[selectedColor].darkBg
                      : TAG_COLORS[selectedColor].lightBg,
                    color: isDark
                      ? TAG_COLORS[selectedColor].darkText
                      : TAG_COLORS[selectedColor].lightText,
                  }}
                >
                  #{newTagName.trim()}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCancel}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isDark
                    ? "bg-slate-600 hover:bg-slate-500 text-slate-300"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={saving || !newTagName.trim()}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Tag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {tags.length === 0 && !isAdding && (
        <p
          className={`text-sm text-center py-2 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          No tags yet. Click "Add" to create your first tag!
        </p>
      )}
    </div>
  );
}