// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProjectCard.tsx
// ✅ FIXED: Overdue calculation for completed projects
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
  Target,
  AlertCircle
} from "lucide-react";
import type { Project } from "@/types/database";
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_PRIORITY_CONFIG,
  PROJECT_COLORS,
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

const formatDateDisplay = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// ✅ FIXED: Timeline display logic
const getTimelineDisplay = (project: Project) => {
  const isCompleted = project.status === 'completed';
  const hasTargetDate = !!project.target_end_date;
  
  if (!hasTargetDate) {
    return { text: '', color: '', icon: null, showClock: false };
  }

  const targetDate = new Date(project.target_end_date!);
  targetDate.setHours(23, 59, 59, 999); // End of target day

  // ✅ FIX: For completed projects
  if (isCompleted) {
    const completionDate = project.actual_end_date 
      ? new Date(project.actual_end_date) 
      : new Date(project.updated_at);
    
    completionDate.setHours(0, 0, 0, 0); // Start of completion day
    
    // Check if completed BEFORE or ON the target date
    if (completionDate <= targetDate) {
      return {
        text: formatDateDisplay(project.actual_end_date || project.updated_at),
        color: 'text-green-500',
        icon: <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500" />,
        showClock: false
      };
    } else {
      // Completed AFTER the target date
      const daysLate = Math.ceil((completionDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        text: `${daysLate}d late`,
        color: 'text-orange-500',
        icon: <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />,
        showClock: true
      };
    }
  }

  // ✅ For active projects, calculate from TODAY
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      text: `${Math.abs(daysRemaining)}d overdue`,
      color: 'text-red-500',
      icon: <Clock className="w-3 h-3 md:w-4 md:h-4 text-red-500" />,
      showClock: true
    };
  }

  return {
    text: daysRemaining === 0 ? 'Due today' : `${daysRemaining}d left`,
    color: 'text-blue-500',
    icon: <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />,
    showClock: true
  };
};

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

  const timelineDisplay = getTimelineDisplay(project);

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
        className={`group cursor-pointer rounded-lg p-3 md:p-4 border-2 transition-all hover:shadow-md ${
          isDark
            ? "bg-slate-800 border-slate-700 hover:border-slate-600"
            : "bg-white border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-start md:items-center gap-3 md:gap-4">
          <div
            className="w-0.5 md:w-1 h-12 md:h-16 rounded-full flex-shrink-0"
            style={{
              backgroundColor: isDark ? colorTheme.darkBorder : colorTheme.lightBorder,
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1.5 md:mb-2">
              <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm md:text-lg truncate ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {project.title}
                </h3>
                {project.is_favorite && (
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs font-medium flex-shrink-0">
                <span className="text-xs md:text-sm">{priorityConfig.icon}</span>
                <span className="hidden sm:inline text-xs md:text-sm" style={{ color: priorityConfig.color }}>
                  {priorityConfig.label}
                </span>
              </div>
            </div>

            {project.description && (
              <p
                className={`text-xs md:text-sm line-clamp-1 mb-1.5 md:mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
              <div
                className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs"
                style={{
                  backgroundColor: isDark ? statusConfig.darkBg : statusConfig.lightBg,
                  color: isDark ? statusConfig.darkText : statusConfig.lightText,
                }}
              >
                <span className="text-xs md:text-sm">{statusConfig.icon}</span>
                <span className="font-medium hidden sm:inline">{statusConfig.label}</span>
              </div>

              <div className="flex items-center gap-1 md:gap-1.5">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span className={`text-[10px] md:text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {project.completed_tasks}/{project.total_tasks}
                </span>
                <span className="font-bold text-green-500 text-[10px] md:text-sm">{project.progress}%</span>
              </div>

              {timelineDisplay.text && (
                <div className="flex items-center gap-1 md:gap-1.5">
                  <span className={timelineDisplay.color}>
                    {timelineDisplay.icon}
                  </span>
                  <span
                    className={`font-medium text-[10px] md:text-xs ${timelineDisplay.color}`}
                  >
                    {timelineDisplay.text}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-1 md:p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
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
              className={`p-1 md:p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Edit2
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                style={{ color: isDark ? "#94a3b8" : "#64748b" }}
              />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1 md:p-2 rounded-lg transition ${
                isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="mt-2 md:mt-3">
          <div
            className={`h-1.5 md:h-2 rounded-full overflow-hidden ${
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
      className="group cursor-pointer rounded-xl p-3 md:p-5 border-2 transition-all hover:shadow-lg relative"
      style={{
        backgroundColor: isDark 
          ? `${colorTheme.darkBg}40`
          : `${colorTheme.lightBg}80`,
        borderColor: isDark ? colorTheme.darkBorder : colorTheme.lightBorder,
      }}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3
            className="font-bold text-sm md:text-lg mb-1 truncate"
            style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
          >
            {project.title}
          </h3>
          <div
            className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-medium"
            style={{
              backgroundColor: isDark ? statusConfig.darkBg : statusConfig.lightBg,
              color: isDark ? statusConfig.darkText : statusConfig.lightText,
            }}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`p-1 md:p-1.5 rounded-lg transition md:opacity-0 md:group-hover:opacity-100 ${
            isDark ? 'md:hover:bg-black/10' : 'md:hover:bg-black/10'
          }`}
        >
          <Star
            className={`w-4 h-4 md:w-5 md:h-5 ${
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

      {project.description && (
        <p
          className="text-xs md:text-sm mb-3 md:mb-4 line-clamp-2"
          style={{
            color: isDark ? colorTheme.darkText + "CC" : colorTheme.lightText + "CC",
          }}
        >
          {project.description}
        </p>
      )}

      <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[10px] md:text-xs font-medium"
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              Progress
            </span>
            <span
              className="text-xs md:text-sm font-bold"
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              {project.progress}%
            </span>
          </div>
          <div
            className="h-1.5 md:h-2 rounded-full overflow-hidden"
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

        <div className="flex items-center justify-between text-[11px] md:text-sm">
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

        {timelineDisplay.text && (
          <div className="flex items-center justify-between text-[11px] md:text-sm">
            <span
              style={{ color: isDark ? colorTheme.darkText : colorTheme.lightText }}
            >
              {project.status === 'completed' ? 'Completed' : 'Due in'}
            </span>
            <span
              className={`font-bold ${timelineDisplay.color}`}
            >
              {timelineDisplay.text}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium">
          <span>{priorityConfig.icon}</span>
          <span style={{ color: priorityConfig.color }}>{priorityConfig.label}</span>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className={`p-0.5 md:p-1 rounded transition ${
              isDark ? 'md:hover:bg-black/10' : 'md:hover:bg-black/10'
            }`}
          >
            <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-0.5 md:p-1 rounded transition ${
              isDark ? 'md:hover:bg-black/10' : 'md:hover:bg-black/10'
            }`}
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}