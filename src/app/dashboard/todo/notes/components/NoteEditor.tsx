"use client";

import { useState, useEffect, useRef } from "react";
import { X, Palette, Tag } from "lucide-react";
import type { Note, NoteColor } from "@/types/database";
import { NOTE_COLORS } from "@/types/database";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (noteData: Partial<Note>) => Promise<void>;
  isDark: boolean;
}

export default function NoteEditor({
  isOpen,
  onClose,
  note,
  onSave,
  isDark
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<NoteColor>("default");
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color);
        setLabels(note.labels || []);
      } else {
        setTitle("");
        setContent("");
        setColor("default");
        setLabels([]);
      }
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter(l => l !== label));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        id: note?.id,
        title: title.trim(),
        content: content.trim(),
        color,
        labels,
      });
      handleClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setColor("default");
    setLabels([]);
    setNewLabel("");
    setShowColorPicker(false);
    onClose();
  };

  if (!isOpen) return null;

  const colorConfig = NOTE_COLORS[color];
  const availableColors: NoteColor[] = [
    "default", "red", "orange", "yellow", "green", 
    "teal", "blue", "purple", "pink"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        ref={modalRef}
        className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl border-2 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        style={{
          backgroundColor: isDark ? colorConfig.darkBg : colorConfig.lightBg,
          borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
        }}
      >
        {/* Header - MOBILE: Compact */}
        <div
          className="flex items-center justify-between p-3 sm:p-4 border-b-2 flex-shrink-0"
          style={{
            borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 sm:p-2 rounded-lg transition hover:bg-black/10 active:scale-95"
                title="Change color"
              >
                <Palette
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{
                    color: isDark ? colorConfig.darkText : colorConfig.lightText,
                  }}
                />
              </button>

              {showColorPicker && (
                <div
                  className="absolute top-full left-0 mt-2 p-2 sm:p-3 rounded-lg shadow-xl border-2 z-50"
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                  }}
                >
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {availableColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition hover:scale-110 active:scale-95 ${
                          color === c ? "ring-2 ring-indigo-500" : ""
                        }`}
                        style={{
                          backgroundColor: isDark 
                            ? NOTE_COLORS[c].darkBg 
                            : NOTE_COLORS[c].lightBg,
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-lg transition hover:bg-black/10 active:scale-95"
          >
            <X
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{
                color: isDark ? colorConfig.darkText : colorConfig.lightText,
              }}
            />
          </button>
        </div>

        {/* Form - MOBILE: Scrollable */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-0 py-2 text-xl sm:text-2xl font-bold bg-transparent border-0 focus:outline-none placeholder-opacity-50"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
            maxLength={100}
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Take a note..."
            rows={8}
            className="w-full px-0 py-2 text-sm sm:text-base bg-transparent border-0 resize-none focus:outline-none placeholder-opacity-50"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          />

          {/* Labels */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
              />
              <span
                className="text-xs sm:text-sm font-medium"
                style={{
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
              >
                Labels
              </span>
            </div>

            {/* Existing Labels */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
              {labels.map((label) => (
                <span
                  key={label}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: isDark 
                      ? colorConfig.darkBorder 
                      : colorConfig.lightBorder,
                    color: isDark ? colorConfig.darkText : colorConfig.lightText,
                  }}
                >
                  #{label}
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    className="hover:opacity-70 active:scale-95"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Label */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
                placeholder="Add label..."
                className="flex-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-transparent border focus:outline-none"
                style={{
                  borderColor: isDark 
                    ? colorConfig.darkBorder 
                    : colorConfig.lightBorder,
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
                maxLength={20}
              />
              <button
                onClick={handleAddLabel}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition hover:opacity-80 active:scale-95"
                style={{
                  backgroundColor: isDark 
                    ? colorConfig.darkBorder 
                    : colorConfig.lightBorder,
                  color: isDark ? colorConfig.darkText : colorConfig.lightText,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer - MOBILE: Compact */}
        <div
          className="flex items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 border-t-2 flex-shrink-0"
          style={{
            borderColor: isDark ? colorConfig.darkBorder : colorConfig.lightBorder,
          }}
        >
          <button
            onClick={handleClose}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition hover:bg-black/10 active:scale-95"
            style={{
              color: isDark ? colorConfig.darkText : colorConfig.lightText,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (!title.trim() && !content.trim())}
            className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {saving ? "Saving..." : note ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}