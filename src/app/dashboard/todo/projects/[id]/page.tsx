// src/app/dashboard/todo/projects/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, Edit2, Trash2, ListTodo, Calendar, Columns, LayoutGrid } from "lucide-react";

import { useProjectDetail } from "../hooks/useProjects";
import ProjectEditor from "../components/ProjectEditor";
import ProjectTaskList from "../components/ProjectTaskList";
import ProgressBar from "../components/ProgressBar";
import TimelineView from "../components/TimelineView";
import KanbanBoard from "../components/KanbanBoard";
import MilestoneSection from "../components/MilestoneSection";

import { toggleProjectFavorite, deleteProject } from "@/lib/supabase/project-helpers";
import { calculateDaysRemaining, isProjectOverdue, PROJECT_STATUS_CONFIG, PROJECT_PRIORITY_CONFIG } from "@/types/database";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "kanban" | "milestones">("tasks");

  const { project, loading, error, refetch } = useProjectDetail(projectId as string);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const handleToggleFavorite = async () => {
    if (!project) return;
    await toggleProjectFavorite(project.id, !project.is_favorite);
    refetch();
  };

  const handleDelete = async () => {
    if (!project || !confirm(`Delete "${project.title}" permanently?`)) return;
    await deleteProject(project.id);
    router.push("/dashboard/todo/projects");
  };

  // ─────── LOADING & ERROR STATES ───────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <p className="text-6xl mb-4">😔</p>
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => router.push("/dashboard/todo/projects")}
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // ─────── SAFE ACCESS AFTER LOADING ───────
  const progress = project.total_tasks > 0
    ? Math.round((project.completed_tasks / project.total_tasks) * 100)
    : 0;

  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  const priorityConfig = PROJECT_PRIORITY_CONFIG[project.priority as keyof typeof PROJECT_PRIORITY_CONFIG];
  const daysRemaining = project.target_end_date ? calculateDaysRemaining(project.target_end_date) : null;
  const overdue = project.target_end_date ? isProjectOverdue(project.target_end_date) : false;

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 rounded-xl hover:bg-slate-800">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <button onClick={handleToggleFavorite} className="p-2 rounded-lg hover:bg-slate-800">
                  <Star className={`w-6 h-6 ${project.is_favorite ? "fill-yellow-500 text-yellow-500" : "text-slate-400"}`} />
                </button>
              </div>
              <p className="text-slate-400 mt-1">{project.description || "No description"}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setIsEditorOpen(true)} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2">
              <Edit2 className="w-5 h-5" /> Edit
            </button>
            <button onClick={handleDelete} className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProgressBar progress={progress} completedTasks={project.completed_tasks} totalTasks={project.total_tasks} isDark={isDark} />
          <div className={`rounded-xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <p className="text-sm text-slate-400">Status</p>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2">{statusConfig.icon} {statusConfig.label}</p>
          </div>
          <div className={`rounded-xl p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <p className="text-sm text-slate-400">Priority</p>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2">{priorityConfig.icon} {priorityConfig.label}</p>
          </div>
          {daysRemaining !== null && (
            <div className={`rounded-xl p-6 border ${overdue ? "border-red-600 bg-red-900/20" : isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <p className="text-sm text-slate-400">Due in</p>
              <p className={`text-2xl font-bold mt-2 ${overdue ? "text-red-500" : ""}`}>
                {overdue ? `${Math.abs(daysRemaining)}d ago` : `${daysRemaining}d`}
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
              { id: "kanban", label: "Kanban", icon: LayoutGrid },
              { id: "milestones", label: "Milestones", icon: Calendar },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 ${activeTab === tab.id ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 min-h-96">
            {activeTab === "tasks" && <ProjectTaskList projectId={projectId as string} tasks={project.tasks || []} onRefresh={refetch} isDark={isDark} />}
            {activeTab === "timeline" && <TimelineView tasks={project.tasks || []} projectStartDate={project.start_date} projectEndDate={project.target_end_date} isDark={isDark} />}
            {activeTab === "kanban" && <KanbanBoard tasks={project.tasks || []} onRefresh={refetch} isDark={isDark} />}
            {activeTab === "milestones" && <MilestoneSection projectId={projectId as string} isDark={isDark} />}
          </div>
        </div>
      </div>

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