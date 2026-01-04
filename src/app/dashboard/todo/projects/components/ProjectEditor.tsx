// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProjectEditor.tsx
// ✅ MOBILE RESPONSIVE VERSION
// ============================================

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Tag, Palette } from "lucide-react";
import type { Project, ProjectStatus, ProjectPriority, ProjectColor } from "@/types/database";
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_PRIORITY_CONFIG,
  PROJECT_COLORS,
} from "@/types/database";

interface ProjectEditorProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (projectData: any) => Promise<{ success: boolean; error?: string }>;
  isDark: boolean;
}

export default function ProjectEditor({
  isOpen,
  onClose,
  project,
  onSave,
  isDark,
}: ProjectEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [priority, setPriority] = useState<ProjectPriority>("medium");
  const [color, setColor] = useState<ProjectColor>("blue");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setTitle(project.title);
        setDescription(project.description || "");
        setStatus(project.status);
        setPriority(project.priority);
        setColor(project.color);
        setStartDate(project.start_date || "");
        setTargetDate(project.target_end_date || "");
        setTags(project.tags || []);
      } else {
        setTitle("");
        setDescription("");
        setStatus("planning");
        setPriority("medium");
        setColor("blue");
        setStartDate("");
        setTargetDate("");
        setTags([]);
      }
      setError("");
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, project]);

  // Close on ESC
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

  // Close on click outside
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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    setSaving(true);
    setError("");

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      color,
      start_date: startDate || null,
      target_end_date: targetDate || null,
      tags,
    };

    const result = await onSave(projectData);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error || "Failed to save project");
    }

    setSaving(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStatus("planning");
    setPriority("medium");
    setColor("blue");
    setStartDate("");
    setTargetDate("");
    setTags([]);
    setNewTag("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const colorTheme = PROJECT_COLORS[color];
  const availableColors: ProjectColor[] = [
    "blue", "green", "orange", "purple", "red", "teal", "pink", "yellow"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        ref={modalRef}
        className={`w-full max-w-3xl rounded-t-2xl sm:rounded-xl shadow-2xl border-2 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 md:p-5 border-b-2 flex-shrink-0 ${isDark ? "border-slate-700" : "border-slate-200"
            }`}
        >
          <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {project ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={handleClose}
            className={`p-1.5 md:p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto flex-1 scrollbar-custom">
          {/* Error Message */}
          {error && (
            <div
              className={`p-3 rounded-lg border text-xs md:text-sm ${isDark
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
                }`}
            >
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Project Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Website Redesign"
              className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border resize-none text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Status */}
            <div>
              <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["planning", "active", "on_hold", "completed"] as ProjectStatus[]).map((s) => {
                  const config = PROJECT_STATUS_CONFIG[s];
                  const isSelected = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`p-2 md:p-2.5 rounded-lg text-xs md:text-sm font-medium transition border-2 ${isSelected
                          ? "border-indigo-500"
                          : isDark
                            ? "border-slate-600 text-slate-300 hover:border-slate-500"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      style={
                        isSelected
                          ? {
                            backgroundColor: isDark ? config.darkBg : config.lightBg,
                            color: isDark ? config.darkText : config.lightText,
                          }
                          : {}
                      }
                    >
                      {config.icon} {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["low", "medium", "high", "critical"] as ProjectPriority[]).map((p) => {
                  const config = PROJECT_PRIORITY_CONFIG[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-2 md:p-2.5 rounded-lg text-xs md:text-sm font-medium transition border-2 ${isSelected
                          ? "border-indigo-500"
                          : isDark
                            ? "border-slate-600 text-slate-300 hover:border-slate-500"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      style={
                        isSelected
                          ? {
                            color: config.color,
                            backgroundColor: config.color + "20",
                          }
                          : {}
                      }
                    >
                      {config.icon} {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                  }`}
              />
            </div>
            <div>
              <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                Target End Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={startDate || undefined}
                className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg border text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                  }`}
              />
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Palette className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
              Color Theme
            </label>
            <div className="grid grid-cols-8 gap-1.5 md:gap-2">
              {availableColors.map((c) => {
                const theme = PROJECT_COLORS[c];
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 md:h-10 rounded-lg transition hover:scale-110 ${isSelected ? "ring-2 ring-offset-2 ring-indigo-500" : ""
                      }`}
                    style={{
                      backgroundColor: isDark ? theme.darkBg : theme.lightBg,
                    }}
                    title={c}
                  />
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Tag className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
              Tags
            </label>

            {/* Existing Tags */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1 ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                    }`}
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70"
                  >
                    <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add tag..."
                className={`flex-1 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                maxLength={20}
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 md:px-4 md:py-1.5 bg-indigo-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-2 md:gap-3 p-4 md:p-5 border-t-2 flex-shrink-0 ${isDark ? "border-slate-700" : "border-slate-200"
            }`}
        >
          <button
            onClick={handleClose}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition ${isDark
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 sm:flex-initial px-5 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : project ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}