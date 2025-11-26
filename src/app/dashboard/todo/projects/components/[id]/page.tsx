// ============================================
// FILE: src/app/dashboard/todo/projects/[id]/page.tsx
// Create this new file (dynamic route)
// ============================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowLeft, 
  Star, 
  Edit2, 
  Trash2, 
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  ListTodo
} 
from "lucide-react";
import { useProjectDetail } from "../hooks/useProjects";
import ProjectEditor from "../components/ProjectEditor";
import ProjectTaskList from "../components/ProjectTaskList";
import ProgressBar from "../components/ProgressBar";
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_PRIORITY_CONFIG,
  PROJECT_COLORS,
  calculateDaysRemaining,
  isProjectOverdue,
  formatProjectDateRange,
} from "@/types/database";
import { updateProject, toggleProjectFavorite, deleteProject } from "@/lib/supabase/project-helpers";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "notes">("tasks");

  const { project, loading, error, refetch } = useProjectDetail(projectId);

  // Initialize
  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    init();

    // Theme detection
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

  const handleBack = () => {
    router.push("/dashboard/todo/projects");
  };

  const handleEdit = () => {
    setIsEditorOpen(true);
  };

  const handleSave = async (projectData: any) => {
    const result = await updateProject(projectId, projectData);
    if (result.success) {
      await refetch();
    }
    return result;
  };

  const handleToggleFavorite = async () => {
    await toggleProjectFavorite(projectId, !project.is_favorite);
    await refetch();
  };

  const handleDelete = async () => {
    if (confirm(`Delete project "${project?.title}"?\n\nTasks will be unlinked (not deleted).`)) {
      const result = await deleteProject(projectId, false);
      if (result.error) {
        alert("Failed to delete project");
      } else {
        router.push("/dashboard/todo/projects");
      }
    }
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Project not found
          </h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This project may have been deleted or you don't have access to it.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const priorityConfig = PROJECT_PRIORITY_CONFIG[project.priority];
  const colorTheme = PROJECT_COLORS[project.color];
  const daysRemaining = calculateDaysRemaining(project.target_end_date);
  const overdue = isProjectOverdue(project.target_end_date);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className={`p-2 rounded-lg transition ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {project.title}
                  </h1>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-1.5 rounded-lg transition ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        project.is_favorite ? 'fill-yellow-500 text-yellow-500' : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    />
                  </button>
                </div>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {project.description || "No description"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status */}
            <div
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: isDark ? statusConfig.darkBg : statusConfig.lightBg,
                borderColor: isDark ? statusConfig.darkBorder : statusConfig.lightBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-semibold uppercase"
                  style={{ color: isDark ? statusConfig.darkText : statusConfig.lightText }}
                >
                  Status
                </span>
                <span className="text-2xl">{statusConfig.icon}</span>
              </div>
              <p
                className="text-lg font-bold"
                style={{ color: isDark ? statusConfig.darkText : statusConfig.lightText }}
              >
                {statusConfig.label}
              </p>
            </div>

            {/* Progress */}
            <div
              className={`rounded-xl p-4 border-2 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Progress
                </span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p className={`text-2xl font-bold text-green-500`}>
                {project.progress}%
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {project.completed_tasks}/{project.total_tasks} tasks
              </p>
            </div>

            {/* Priority */}
            <div
              className={`rounded-xl p-4 border-2 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Priority
                </span>
                <span className="text-2xl">{priorityConfig.icon}</span>
              </div>
              <p className="text-lg font-bold" style={{ color: priorityConfig.color }}>
                {priorityConfig.label}
              </p>
            </div>

            {/* Timeline */}
            <div
              className={`rounded-xl p-4 border-2 ${
                overdue
                  ? 'bg-red-900/20 border-red-700'
                  : isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold uppercase ${
                    overdue ? 'text-red-400' : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {overdue ? 'Overdue' : 'Due In'}
                </span>
                <Clock className={`w-5 h-5 ${overdue ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              {project.target_end_date ? (
                <>
                  <p
                    className={`text-2xl font-bold ${
                      overdue ? 'text-red-500' : isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {overdue ? `${Math.abs(daysRemaining!)}d` : daysRemaining === 0 ? 'Today' : `${daysRemaining}d`}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {new Date(project.target_end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No deadline set
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            progress={project.progress}
            completedTasks={project.completed_tasks}
            totalTasks={project.total_tasks}
            isDark={isDark}
          />

          {/* Tabs */}
          <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center gap-1 p-1 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === "tasks"
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                Tasks ({project.total_tasks})
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === "timeline"
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === "notes"
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                📝 Notes
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "tasks" && (
                <ProjectTaskList
                  projectId={projectId}
                  tasks={project.tasks || []}
                  onRefresh={refetch}
                  isDark={isDark}
                />
              )}

              {activeTab === "timeline" && (
                <div className="text-center py-12">
                  <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Timeline view coming soon!
                  </p>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Project notes coming soon!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Editor Modal */}
      <ProjectEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={project}
        onSave={handleSave}
        isDark={isDark}
      />
    </div>
  );
}