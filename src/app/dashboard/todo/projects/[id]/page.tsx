// src/app/dashboard/todo/projects/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Edit2,
  Trash2,
  Calendar,
  ListTodo,
  Columns
} from "lucide-react";

// FIXED PATH: ../../hooks not ../hooks
import { useProjectDetail } from "../hooks/useProjects";

import ProjectEditor from "../components/ProjectEditor";
import ProjectTaskList from "../components/ProjectTaskList";
import ProgressBar from "../components/ProgressBar";
import TimelineView from "../components/TimelineView";
import KanbanBoard from "../components/KanbanBoard";
import MilestoneSection from "../components/MilestoneSection";

import {
  PROJECT_STATUS_CONFIG,
  PROJECT_PRIORITY_CONFIG,
  PROJECT_COLORS,
  calculateDaysRemaining,
  isProjectOverdue,
} from "@/types/database";

import { toggleProjectFavorite, deleteProject } from "@/lib/supabase/project-helpers";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "kanban" | "milestones">("tasks");

  const { project, loading, error, refetch } = useProjectDetail(projectId);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading project...</div>;
  if (error || !project) return <div className="p-8 text-center text-red-500">Project not found</div>;

  // FIXED: Proper type assertion
  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  const priorityConfig = PROJECT_PRIORITY_CONFIG[project.priority as keyof typeof PROJECT_PRIORITY_CONFIG];
  const colorTheme = PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS];

  const daysRemaining = project.target_end_date ? calculateDaysRemaining(project.target_end_date) : null;
  const overdue = project.target_end_date ? isProjectOverdue(project.target_end_date) : false;
  const progress = project.total_tasks > 0
    ? Math.round((project.completed_tasks / project.total_tasks) * 100)
    : 0;

  const handleToggleFavorite = async () => {
    await toggleProjectFavorite(project.id, !project.is_favorite);
    refetch();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}" permanently?`)) return;
    await deleteProject(project.id);
    router.push("/dashboard/todo/projects");
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} text-slate-100`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-xl hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="text-slate-400 mt-1">{project.description || "No description"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleToggleFavorite} className="p-3 rounded-xl hover:bg-slate-800">
              <Star className={`w-6 h-6 ${project.is_favorite ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
            </button>
            <button onClick={() => setIsEditorOpen(true)} className="p-3 rounded-xl hover:bg-slate-800">
              <Edit2 className="w-6 h-6" />
            </button>
            <button onClick={handleDelete} className="p-3 rounded-xl hover:bg-red-500/20 text-red-500">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ProgressBar
            progress={progress}
            completedTasks={project.completed_tasks}
            totalTasks={project.total_tasks}
            isDark={isDark}
          />
          <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className="text-slate-400 text-sm">Status</p>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2">
              {statusConfig.icon} {statusConfig.label}
            </p>
          </div>
          <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className="text-slate-400 text-sm">Priority</p>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2">
              {priorityConfig.icon} {priorityConfig.label}
            </p>
          </div>
          {daysRemaining !== null && (
            <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className="text-slate-400 text-sm">Due</p>
              <p className={`text-2xl font-bold mt-2 ${overdue ? 'text-red-500' : ''}`}>
                {overdue ? `${Math.abs(daysRemaining)}d ago` : `${daysRemaining}d left`}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={`rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} overflow-hidden`}>
          <div className="flex border-b border-slate-700">
            {[
              { id: "tasks", label: "Tasks", icon: ListTodo },
              { id: "timeline", label: "Timeline", icon: Calendar },
              { id: "kanban", label: "Kanban", icon: Columns },
              { id: "milestones", label: "Milestones", icon: Calendar },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === tab.id
                  ? 'text-indigo-500 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-96">
            {activeTab === "tasks" && <ProjectTaskList projectId={projectId} tasks={project.tasks || []} onRefresh={refetch} isDark={isDark} />}
            {activeTab === "timeline" && <TimelineView isDark={isDark} />}
            {activeTab === "kanban" && <KanbanBoard isDark={isDark} />}
            {activeTab === "milestones" && <MilestoneSection projectId={projectId} isDark={isDark} />}
          </div>
        </div>
      </div>

      {/* Editor Modal – FIXED VERSION */}
      <ProjectEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={project}
        onSave={async () => {
          await refetch();
          return { success: true };
        }}
        isDark={isDark}
      />
    </div>
  );
}