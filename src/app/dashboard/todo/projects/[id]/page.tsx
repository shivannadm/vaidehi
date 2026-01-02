// ============================================
// FILE: src/app/dashboard/todo/projects/[id]/page.tsx
// ✅ FIX: Keep "Projects" in header when viewing project details
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

const formatDateDisplay = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getDueInDisplay = (project: any) => {
  if (!project.target_end_date) {
    return null;
  }

  const isCompleted = project.status === 'completed';
  const targetDate = new Date(project.target_end_date);
  targetDate.setHours(23, 59, 59, 999);

  if (isCompleted) {
    const completionDate = project.actual_end_date
      ? new Date(project.actual_end_date)
      : new Date(project.updated_at);

    completionDate.setHours(0, 0, 0, 0);

    if (completionDate <= targetDate) {
      return {
        label: 'Completed on',
        text: formatDateDisplay(project.actual_end_date || project.updated_at),
        color: 'text-green-500',
        bgColor: 'bg-green-900/20 border-green-700',
        icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
      };
    } else {
      const daysLate = Math.ceil((completionDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        label: 'Completed (Late)',
        text: `${daysLate}d after deadline`,
        color: 'text-orange-500',
        bgColor: 'bg-orange-900/20 border-orange-700',
        icon: <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
      };
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      label: 'Overdue by',
      text: `${Math.abs(daysRemaining)}d`,
      color: 'text-red-500',
      bgColor: 'bg-red-900/20 border-red-600',
      icon: <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
    };
  }

  return {
    label: 'Due in',
    text: daysRemaining === 0 ? 'Today' : `${daysRemaining}d`,
    color: 'text-blue-500',
    bgColor: 'bg-blue-900/20 border-blue-600',
    icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />
  };
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "kanban" | "milestones">("tasks");

  const { project, loading, error, refetch } = useProjectDetail(projectId as string);

  // ✅ FIX: Update header to show "Projects" instead of project ID
  useEffect(() => {
    // Dispatch event to update header section to "Projects"
    window.dispatchEvent(new CustomEvent('updateHeaderSection', {
      detail: { section: 'Projects' }
    }));
  }, []); // Run once on mount

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'
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

  if (!project || error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
        <div className="text-center">
          <p className="text-4xl md:text-6xl mb-3 md:mb-4">😔</p>
          <h2 className={`text-lg md:text-2xl font-bold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-slate-900'
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

  const progress = project.total_tasks > 0
    ? Math.round((project.completed_tasks / project.total_tasks) * 100)
    : 0;

  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  const priorityConfig = PROJECT_PRIORITY_CONFIG[project.priority as keyof typeof PROJECT_PRIORITY_CONFIG];

  const dueInDisplay = getDueInDisplay(project);

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-8">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push("/dashboard/todo/projects")}
            className={`hover:underline ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Projects
          </button>
          <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>›</span>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Project Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0 w-full">
            <button
              onClick={() => router.push("/dashboard/todo/projects")}
              className={`p-2 md:p-3 rounded-xl transition flex-shrink-0 ${isDark
                ? 'hover:bg-slate-800 text-white'
                : 'hover:bg-slate-200 text-slate-900'
                }`}
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <h1 className={`text-xl md:text-3xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                  {project.title}
                </h1>

                <button
                  onClick={handleToggleFavorite}
                  className={`p-1.5 md:p-2 rounded-lg transition flex-shrink-0 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                    }`}
                  title={project.is_favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`w-5 h-5 md:w-6 md:h-6 ${project.is_favorite
                    ? "fill-yellow-500 text-yellow-500"
                    : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                </button>
              </div>

              <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {project.description || "No description"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsEditorOpen(true)}
              className={`flex-1 sm:flex-initial px-4 py-2 md:px-5 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition font-medium text-xs md:text-sm ${isDark
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="col-span-2 lg:col-span-1">
            <ProgressBar
              progress={progress}
              completedTasks={project.completed_tasks}
              totalTasks={project.total_tasks}
              isDark={isDark}
            />
          </div>

          <div className={`rounded-xl p-4 md:p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
              Status
            </p>
            <p className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              <span className="text-base md:text-2xl">{statusConfig.icon}</span>
              <span className="text-sm md:text-2xl">{statusConfig.label}</span>
            </p>
          </div>

          <div className={`rounded-xl p-4 md:p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
            <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
              Priority
            </p>
            <p className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              <span className="text-base md:text-2xl">{priorityConfig.icon}</span>
              <span className="text-sm md:text-2xl">{priorityConfig.label}</span>
            </p>
          </div>

          {dueInDisplay && (
            <div className={`rounded-xl p-4 md:p-6 border-2 ${isDark ? dueInDisplay.bgColor : dueInDisplay.bgColor
              }`}>
              <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'
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

        {/* Tabs Section */}
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
          <div className={`flex overflow-x-auto border-b scrollbar-hide ${isDark ? 'border-slate-700' : 'border-slate-200'
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
                className={`flex-shrink-0 px-3 py-2.5 md:px-6 md:py-4 font-medium flex items-center justify-center gap-1.5 md:gap-2 transition text-xs md:text-sm whitespace-nowrap ${activeTab === tab.id
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