// ============================================
// FILE: src/app/dashboard/todo/projects/[id]/page.tsx
// COMPLETE FIXED VERSION - Theme + Edit Button
// ============================================

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

import { toggleProjectFavorite, deleteProject, updateProject } from "@/lib/supabase/project-helpers";
import { calculateDaysRemaining, isProjectOverdue, PROJECT_STATUS_CONFIG, PROJECT_PRIORITY_CONFIG } from "@/types/database";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "kanban" | "milestones">("tasks");

  const { project, loading, error, refetch } = useProjectDetail(projectId as string);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });
    
    return () => observer.disconnect();
  }, []);

  const handleToggleFavorite = async () => {
    if (!project) return;
    await toggleProjectFavorite(project.id, !project.is_favorite);
    refetch();
  };

  const handleDelete = async () => {
    if (!project) return;
    
    if (!confirm(`Delete "${project.title}" permanently?\n\nTasks will be unlinked (not deleted).`)) {
      return;
    }
    
    const result = await deleteProject(project.id, false);
    if (!result.error) {
      router.push("/dashboard/todo/projects");
    }
  };

  const handleSaveProject = async (projectData: any) => {
    if (!project) {
      return { success: false, error: "No project loaded" };
    }

    try {
      console.log("Updating project:", project.id, projectData);
      
      const result = await updateProject(project.id, projectData);
      
      if (result.error) {
        console.error("Update error:", result.error);
        return { success: false, error: result.error.message };
      }

      console.log("Update successful, refreshing...");
      await refetch();
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error in handleSaveProject:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update project" 
      };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!project || error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <p className="text-6xl mb-4">😔</p>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Project not found
          </h2>
          <button
            onClick={() => router.push("/dashboard/todo/projects")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Back Button */}
            <button 
              onClick={() => router.back()} 
              className={`p-3 rounded-xl transition flex-shrink-0 ${
                isDark 
                  ? 'hover:bg-slate-800 text-white' 
                  : 'hover:bg-slate-200 text-slate-900'
              }`}
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {/* Project Title */}
                <h1 className={`text-3xl font-bold truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {project.title}
                </h1>
                
                {/* Favorite Star */}
                <button 
                  onClick={handleToggleFavorite} 
                  className={`p-2 rounded-lg transition flex-shrink-0 ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                  }`}
                  title={project.is_favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`w-6 h-6 ${
                    project.is_favorite 
                      ? "fill-yellow-500 text-yellow-500" 
                      : isDark ? "text-slate-400" : "text-slate-500"
                  }`} />
                </button>
              </div>
              
              {/* Description */}
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {project.description || "No description"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <button 
              onClick={() => setIsEditorOpen(true)} 
              className={`px-5 py-3 rounded-lg flex items-center gap-2 transition font-medium ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              <Edit2 className="w-5 h-5" /> 
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition font-medium"
            >
              <Trash2 className="w-5 h-5" /> 
              Delete
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Progress Card */}
          <ProgressBar 
            progress={progress} 
            completedTasks={project.completed_tasks} 
            totalTasks={project.total_tasks} 
            isDark={isDark} 
          />
          
          {/* Status Card */}
          <div className={`rounded-xl p-6 border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Status
            </p>
            <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {statusConfig.icon} {statusConfig.label}
            </p>
          </div>
          
          {/* Priority Card */}
          <div className={`rounded-xl p-6 border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Priority
            </p>
            <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {priorityConfig.icon} {priorityConfig.label}
            </p>
          </div>
          
          {/* Due Date Card */}
          {daysRemaining !== null && (
            <div className={`rounded-xl p-6 border ${
              overdue 
                ? isDark 
                  ? "border-red-600 bg-red-900/20" 
                  : "border-red-400 bg-red-50"
                : isDark 
                  ? "bg-slate-800 border-slate-700" 
                  : "bg-white border-slate-200"
            }`}>
              <p className={`text-sm font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Due in
              </p>
              <p className={`text-2xl font-bold mt-2 ${
                overdue 
                  ? "text-red-500" 
                  : isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {overdue ? `${Math.abs(daysRemaining)}d ago` : `${daysRemaining}d`}
              </p>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Tab Navigation */}
          <div className={`flex border-b ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            {[
              { id: "tasks", label: "Tasks", icon: ListTodo },
              { id: "timeline", label: "Timeline", icon: Calendar },
              { id: "kanban", label: "Kanban", icon: LayoutGrid },
              { id: "milestones", label: "Milestones", icon: Calendar },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition ${
                  activeTab === tab.id 
                    ? 'text-indigo-500 border-b-2 border-indigo-500 bg-indigo-500/5' 
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === "tasks" && (
              <ProjectTaskList 
                projectId={projectId as string} 
                tasks={project.tasks || []} 
                onRefresh={refetch} 
                isDark={isDark} 
              />
            )}
            {activeTab === "timeline" && (
              <TimelineView 
                tasks={project.tasks || []} 
                projectStartDate={project.start_date} 
                projectEndDate={project.target_end_date} 
                isDark={isDark} 
              />
            )}
            {activeTab === "kanban" && (
              <KanbanBoard 
                tasks={project.tasks || []} 
                onRefresh={refetch} 
                isDark={isDark} 
              />
            )}
            {activeTab === "milestones" && (
              <MilestoneSection 
                projectId={projectId as string} 
                isDark={isDark} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Project Editor Modal */}
      <ProjectEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={project}
        onSave={handleSaveProject}
        isDark={isDark}
      />
    </div>
  );
}