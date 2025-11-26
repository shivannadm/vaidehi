// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProjectCard.tsx
// Create this new file
// ============================================

"use client";

import { useState } from "react";
import { 
  Star, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import type { Project } from "@/types/database";
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_PRIORITY_CONFIG,
  PROJECT_COLORS,
  calculateDaysRemaining,
  isProjectOverdue,
  formatProjectDateRange,
} from "@/types/database";

interface ProjectCardProps {
  project: Project;
  viewMode: "grid" | "list";
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
  onClick: (projectId: string) => void;
  isDark: boolean;
}

export default function ProjectCard({
  project,
  viewMode,
  onEdit,
  onDelete,
  onToggleFavorite,
  onClick,
  isDark,
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const priorityConfig = PROJECT_PRIORITY_CONFIG[project.priority];
  const colorTheme = PROJECT_COLORS[project.color];

  const daysRemaining = calculateDaysRemaining(project.target_end_date);
  const overdue = isProjectOverdue(project.target_end_date);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
    setShowMenu(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete project "${project.title}"?\n\nTasks will be unlinked (not deleted).`)) {
      await onDelete(project.id);
    }
    setShowMenu(false);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleFavorite(project.id);
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onClick(project.id)}
        className={`group cursor-pointer rounded-lg p-4 border-2 transition-all hover:shadow-md ${
          isDark
            ? "bg-slate-800 border-slate-700 hover:border-slate-600"
            : "bg-white border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Color Indicator */}
          <div
            className="w-1 h-16 rounded-full flex-shrink-0"
            style={{
              backgroundColor: isDark ? colorTheme.darkBorder : colorTheme.lightBorder,
            }}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3
                  className={`font-bold text-lg truncate ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {project.title}
                </h3>
                {project.is_favorite && (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                )}
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium flex-shrink-0">
                <span>{priorityConfig.icon}</span>
                <span style={{ color: priorityConfig.color }}>
                  {priorityConfig.label}
                </span>
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <p
                className={`text-sm line-clamp-1 mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {project.description}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm">
              {/* Status */}
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: isDark ? statusConfig.darkBg : statusConfig.lightBg,
                  color: isDark ? statusConfig.darkText : statusConfig.lightText,
                }}
              >
                <span>{statusConfig.icon}</span>
                <span className="font-medium">{statusConfig.label}</span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                  {project.completed_tasks}/{project.total_tasks} tasks
                </span>
                <span className="font-bold text-green-500">{project.progress}%</span>
              </div>

              {/* Timeline */}
              {project.target_end_date && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${overdue ? "text-red-500" : "text-blue-500"}`} />
                  <span
                    className={`font-medium ${
                      overdue
                        ? "text-red-500"
                        : isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {overdue
                      ? `${Math.abs(daysRemaining!)} days overdue`
                      : daysRemaining === 0
                      ? "Due today"
                      : `${daysRemaining} days left`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  project.is_favorite ? "fill-yellow-500 text-yellow-500" : ""
                }`}
                style={{
                  color: !project.is_favorite
                    ? isDark
                      ? "#94a3b8"
                      : "#64748b"
                    : undefined,
                }}
              />
            </button>
            <button
              onClick={handleEdit}
              className={`p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Edit2
                className="w-4 h-4"
                style={{ color: isDark ? "#94a3b8" : "#64748b" }}
              />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition ${
                isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"
              }`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div
            className={`h-2 rounded-full overflow-hidden ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div
      onClick={() => onClick(project.id)}
      className="group cursor-pointer rounded-xl p-5 border-2 transition-all hover:shadow-lg relative"
      style={{
        backgroundColor: isDark ? colorTheme.darkBg : colorTheme.lightBg,
        borderColor: isDark ? colorTheme.darkBorder : colorTheme.lightBorder,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-lg mb-1 truncate"
            style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
          >
            {project.title}
          </h3>
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: isDark ? statusConfig.darkBg : statusConfig.lightBg,
              color: isDark ? statusConfig.darkText : statusConfig.lightText,
            }}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Favorite Star */}
        <button
          onClick={handleToggleFavorite}
          className="p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100 hover:bg-black/10"
        >
          <Star
            className={`w-5 h-5 ${
              project.is_favorite ? "fill-yellow-500 text-yellow-500" : ""
            }`}
            style={{
              color: !project.is_favorite
                ? isDark
                  ? colorTheme.darkText
                  : colorTheme.lightText
                : undefined,
            }}
          />
        </button>
      </div>

      {/* Description */}
      {project.description && (
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{
            color: isDark ? colorTheme.darkText + "CC" : colorTheme.lightText + "CC",
          }}
        >
          {project.description}
        </p>
      )}

      {/* Stats */}
      <div className="space-y-3 mb-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-xs font-medium"
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              Progress
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              {project.progress}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: isDark
                ? colorTheme.darkBorder + "40"
                : colorTheme.lightBorder + "40",
            }}
          >
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Tasks Count */}
        <div className="flex items-center justify-between text-sm">
          <span
            style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
          >
            Tasks
          </span>
          <span
            className="font-bold"
            style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
          >
            {project.completed_tasks}/{project.total_tasks}
          </span>
        </div>

        {/* Timeline */}
        {project.target_end_date && (
          <div className="flex items-center justify-between text-sm">
            <span
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              {overdue ? "Overdue" : "Due in"}
            </span>
            <span
              className={`font-bold ${overdue ? "text-red-500" : ""}`}
              style={
                !overdue
                  ? { color: isDark ? colorTheme.darkText : colorTheme.lightText }
                  : undefined
              }
            >
              {overdue
                ? `${Math.abs(daysRemaining!)}d ago`
                : daysRemaining === 0
                ? "Today"
                : `${daysRemaining}d`}
            </span>
          </div>
        )}
      </div>

      {/* Priority Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium">
          <span>{priorityConfig.icon}</span>
          <span style={{ color: priorityConfig.color }}>{priorityConfig.label}</span>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 rounded transition hover:bg-black/10"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded transition hover:bg-black/10"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}