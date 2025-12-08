// ============================================
// FILE: src/app/dashboard/todo/projects/[id]/page.tsx
// ✅ UPDATED: Shows completion date when completed, overdue status when applicable
// ============================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, Edit2, Trash2, ListTodo, Calendar, Columns, LayoutGrid, CheckCircle2, AlertCircle } from "lucide-react";

import { useProjectDetail } from "../hooks/useProjects";
import ProjectEditor from "../components/ProjectEditor";
import ProjectTaskList from "../components/ProjectTaskList";
import ProgressBar from "../components/ProgressBar";
import TimelineView from "../components/TimelineView";
import KanbanBoard from "../components/KanbanBoard";
import MilestoneSection from "../components/MilestoneSection";

import { toggleProjectFavorite, deleteProject, updateProject } from "@/lib/supabase/project-helpers";
import { calculateDaysRemaining, isProjectOverdue, PROJECT_STATUS_CONFIG, PROJECT_PRIORITY_CONFIG } from "@/types/database";

// Helper function to format date display
const formatDateDisplay = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

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
      const result = await updateProject(project.id, projectData);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }

      await refetch();
      
      return { success: true, data: result.data };
    } catch (error) {
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
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className={`mt-3 md:mt-4 text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!project || error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <p className="text-4xl md:text-6xl mb-3 md:mb-4">😔</p>
          <h2 className={`text-lg md:text-2xl font-bold mb-3 md:mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Project not found
          </h2>
          <button
            onClick={() => router.push("/dashboard/todo/projects")}
            className="px-5 py-2.5 md:px-6 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm md:text-base"
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
  
  // Enhanced Due Date Logic
  const getDueInDisplay = () => {
    if (!project.target_end_date) {
      return null;
    }

    const daysRemaining = calculateDaysRemaining(project.target_end_date);
    const overdue = isProjectOverdue(project.target_end_date);
    const isCompleted = project.status === 'completed';

    if (isCompleted) {
      // Check if completed within due date
      if (!overdue || daysRemaining! >= 0) {
        const completionDate = project.actual_end_date || project.updated_at;
        return {
          label: 'Completed on',
          text: formatDateDisplay(completionDate),
          color: 'text-green-500',
          bgColor: isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300',
          icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
        };
      } else {
        // Completed but was overdue
        const completionDate = project.actual_end_date || project.updated_at;
        return {
          label: 'Completed (Overdue)',
          text: formatDateDisplay(completionDate),
          color: 'text-orange-500',
          bgColor: isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-300',
          icon: <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
        };
      }
    }

    // Not completed
    if (overdue) {
      return {
        label: 'Overdue by',
        text: `${Math.abs(daysRemaining!)}d`,
        color: 'text-red-500',
        bgColor: isDark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-400',
        icon: <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
      };
    }

    return {
      label: 'Due in',
      text: daysRemaining === 0 ? 'Today' : `${daysRemaining}d`,
      color: isDark ? 'text-white' : 'text-slate-900',
      bgColor: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
      icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />
    };
  };

  const dueInDisplay = getDueInDisplay();

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-8">

        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0 w-full">
            {/* Back Button */}
            <button 
              onClick={() => router.back()} 
              className={`p-2 md:p-3 rounded-xl transition flex-shrink-0 ${
                isDark 
                  ? 'hover:bg-slate-800 text-white' 
                  : 'hover:bg-slate-200 text-slate-900'
              }`}
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                {/* Project Title */}
                <h1 className={`text-xl md:text-3xl font-bold truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {project.title}
                </h1>
                
                {/* Favorite Star */}
                <button 
                  onClick={handleToggleFavorite} 
                  className={`p-1.5 md:p-2 rounded-lg transition flex-shrink-0 ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                  }`}
                  title={project.is_favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`w-5 h-5 md:w-6 md:h-6 ${
                    project.is_favorite 
                      ? "fill-yellow-500 text-yellow-500" 
                      : isDark ? "text-slate-400" : "text-slate-500"
                  }`} />
                </button>
              </div>
              
              {/* Description */}
              <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {project.description || "No description"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button 
              onClick={() => setIsEditorOpen(true)} 
              className={`flex-1 sm:flex-initial px-4 py-2 md:px-5 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition font-medium text-xs md:text-sm ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              <Edit2 className="w-4 h-4 md:w-5 md:h-5" /> 
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="flex-1 sm:flex-initial px-4 py-2 md:px-5 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition font-medium text-xs md:text-sm"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" /> 
              Delete
            </button>
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {/* Progress Card */}
          <div className="col-span-2 lg:col-span-1">
            <ProgressBar 
              progress={progress} 
              completedTasks={project.completed_tasks} 
              totalTasks={project.total_tasks} 
              isDark={isDark} 
            />
          </div>
          
          {/* Status Card */}
          <div className={`rounded-xl p-4 md:p-6 border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`text-xs md:text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Status
            </p>
            <p className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="text-base md:text-2xl">{statusConfig.icon}</span>
              <span className="text-sm md:text-2xl">{statusConfig.label}</span>
            </p>
          </div>
          
          {/* Priority Card */}
          <div className={`rounded-xl p-4 md:p-6 border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`text-xs md:text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Priority
            </p>
            <p className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="text-base md:text-2xl">{priorityConfig.icon}</span>
              <span className="text-sm md:text-2xl">{priorityConfig.label}</span>
            </p>
          </div>
          
          {/* Due Date Card - Enhanced */}
          {dueInDisplay && (
            <div className={`rounded-xl p-4 md:p-6 border-2 ${dueInDisplay.bgColor}`}>
              <p className={`text-xs md:text-sm font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {dueInDisplay.label}
              </p>
              <div className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 ${dueInDisplay.color}`}>
                {dueInDisplay.icon}
                <span className="text-sm md:text-xl">{dueInDisplay.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Section - Mobile Optimized */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Tab Navigation - Scrollable on Mobile */}
          <div className={`flex overflow-x-auto border-b scrollbar-hide ${
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
                className={`flex-shrink-0 px-3 py-2.5 md:px-6 md:py-4 font-medium flex items-center justify-center gap-1.5 md:gap-2 transition text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-indigo-500 border-b-2 border-indigo-500 bg-indigo-500/5' 
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] md:min-h-96">
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