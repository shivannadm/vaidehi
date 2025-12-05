// ============================================
// FILE: src/app/dashboard/todo/projects/page.tsx
// ✅ MOBILE RESPONSIVE VERSION
// ============================================

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Grid3x3, List, Filter, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectCard from "./components/ProjectCard";
import ProjectEditor from "./components/ProjectEditor";
import { useProjects } from "./hooks/useProjects";
import type { Project, ProjectStatus, ProjectPriority } from "@/types/database";

export default function ProjectsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    toggleFavorite,
  } = useProjects(userId);

  // Initialize - Load view mode from localStorage
  useEffect(() => {
    setMounted(true);
    
    // Load saved view mode
    const savedViewMode = localStorage.getItem('projectsViewMode');
    if (savedViewMode === 'list' || savedViewMode === 'grid') {
      setViewMode(savedViewMode);
    }
    
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

  // Filter projects
  const filteredProjects = projects
    .filter(project => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !project.title.toLowerCase().includes(query) &&
          !project.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== "all" && project.priority !== priorityFilter) {
        return false;
      }

      if (showFavoritesOnly && !project.is_favorite) {
        return false;
      }

      return true;
    });

  const favoriteProjects = showFavoritesOnly 
    ? filteredProjects
    : filteredProjects.filter(p => p.is_favorite);
  
  const otherProjects = showFavoritesOnly 
    ? []
    : filteredProjects.filter(p => !p.is_favorite);

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleSaveProject = async (projectData: any) => {
    if (editingProject) {
      return await updateProject(editingProject.id, projectData);
    } else {
      return await createProject(projectData);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    return await deleteProject(projectId, false);
  };

  const handleToggleFavorite = async (projectId: string) => {
    return await toggleFavorite(projectId);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/todo/projects/${projectId}`);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem('projectsViewMode', mode);
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="h-full overflow-y-auto p-3 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          
          {/* Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className={`text-xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🎯 Projects
              </h1>
              <p className={`mt-1 text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Organize your work into manageable projects
              </p>
            </div>

            <button
              onClick={handleCreateProject}
              className="w-full sm:w-auto px-4 py-2 md:px-5 md:py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              New Project
            </button>
          </div>

          {/* Filters & Actions Bar - Mobile Optimized */}
          <div className={`rounded-xl border p-3 md:p-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3">
              {/* Search */}
              <div className="w-full md:flex-1 md:min-w-[200px]">
                <div className="relative">
                  <Search className={`absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className={`w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 rounded-lg border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex gap-2 flex-wrap">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className={`flex-1 min-w-[100px] px-2 md:px-3 py-1.5 md:py-2 rounded-lg border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="planning">📋 Planning</option>
                  <option value="active">🟢 Active</option>
                  <option value="on_hold">⸻ On Hold</option>
                  <option value="completed">✅ Completed</option>
                  <option value="archived">📦 Archived</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className={`flex-1 min-w-[100px] px-2 md:px-3 py-1.5 md:py-2 rounded-lg border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="all">All Priority</option>
                  <option value="low">⬇️ Low</option>
                  <option value="medium">➡️ Medium</option>
                  <option value="high">⬆️ High</option>
                  <option value="critical">🔴 Critical</option>
                </select>

                {/* Favorites Toggle */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition flex items-center gap-1.5 md:gap-2 ${
                    showFavoritesOnly
                      ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 md:w-4 md:h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
                  <span className="hidden sm:inline">Favorites</span>
                </button>

                {/* View Toggle */}
                <div className={`flex items-center rounded-lg border ${
                  isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => handleViewModeChange("grid")}
                    className={`p-1.5 md:p-2 rounded-l-lg transition ${
                      viewMode === "grid"
                        ? 'bg-indigo-600 text-white'
                        : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange("list")}
                    className={`p-1.5 md:p-2 rounded-r-lg transition ${
                      viewMode === "list"
                        ? 'bg-indigo-600 text-white'
                        : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎯</div>
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || showFavoritesOnly
                  ? 'No projects found'
                  : 'No projects yet'}
              </h3>
              <p className={`text-xs md:text-sm mb-4 md:mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || showFavoritesOnly
                  ? 'Try adjusting your filters'
                  : 'Click "New Project" to create your first project'}
              </p>
              {!searchQuery && statusFilter === "all" && priorityFilter === "all" && !showFavoritesOnly && (
                <button
                  onClick={handleCreateProject}
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
                >
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {/* Favorite Projects Section */}
              {favoriteProjects.length > 0 && (
                <div>
                  {(showFavoritesOnly || otherProjects.length > 0) && (
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
                      <h2 className={`text-base md:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {showFavoritesOnly ? 'Favorite Projects' : 'Favorites'}
                      </h2>
                      <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-bold ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {favoriteProjects.length}
                      </span>
                    </div>
                  )}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
                    : "space-y-2 md:space-y-3"
                  }>
                    {favoriteProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        viewMode={viewMode}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleProjectClick}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Projects Section */}
              {otherProjects.length > 0 && !showFavoritesOnly && (
                <div>
                  {favoriteProjects.length > 0 && (
                    <h2 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      All Projects
                    </h2>
                  )}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
                    : "space-y-2 md:space-y-3"
                  }>
                    {otherProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        viewMode={viewMode}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleProjectClick}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Footer - Mobile Optimized */}
          {projects.length > 0 && (
            <div className={`rounded-xl border p-3 md:p-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="grid grid-cols-2 md:flex md:items-center md:justify-center gap-4 md:gap-8 text-xs md:text-sm">
                <div className="text-center">
                  <div className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {projects.length}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Total Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl md:text-2xl font-bold text-green-500`}>
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl md:text-2xl font-bold text-blue-500`}>
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl md:text-2xl font-bold text-yellow-500`}>
                    {projects.filter(p => p.is_favorite).length}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Favorites
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Project Editor Modal */}
      <ProjectEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSave={handleSaveProject}
        isDark={isDark}
      />
    </div>
  );
}