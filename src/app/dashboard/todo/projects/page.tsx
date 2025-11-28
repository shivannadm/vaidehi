// ============================================
// FILE: src/app/dashboard/todo/projects/page.tsx
// FIXED: Favorites filter now works correctly
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
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !project.title.toLowerCase().includes(query) &&
          !project.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && project.priority !== priorityFilter) {
        return false;
      }

      // Favorites filter - ONLY show favorites when toggled ON
      if (showFavoritesOnly && !project.is_favorite) {
        return false;
      }

      return true;
    });

  // Separate favorites and other projects for display
  const favoriteProjects = showFavoritesOnly 
    ? filteredProjects  // When filtering, all filtered projects are favorites
    : filteredProjects.filter(p => p.is_favorite); // When not filtering, get just favorites
  
  const otherProjects = showFavoritesOnly 
    ? []  // When filtering by favorites, hide other projects
    : filteredProjects.filter(p => !p.is_favorite); // When not filtering, show others

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

  // Save view mode to localStorage when it changes
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem('projectsViewMode', mode);
  };

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🎯 Projects
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Organize your work into manageable projects
              </p>
            </div>

            <button
              onClick={handleCreateProject}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          {/* Filters & Actions Bar */}
          <div className={`rounded-xl border p-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="planning">📋 Planning</option>
                <option value="active">🟢 Active</option>
                <option value="on_hold">⏸️ On Hold</option>
                <option value="completed">✅ Completed</option>
                <option value="archived">📦 Archived</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
                className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  showFavoritesOnly
                    ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
                Favorites
              </button>

              {/* View Toggle */}
              <div className={`flex items-center rounded-lg border ${
                isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`p-2 rounded-l-lg transition ${
                    viewMode === "grid"
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`p-2 rounded-r-lg transition ${
                    viewMode === "list"
                      ? 'bg-indigo-600 text-white'
                      : isDark ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || showFavoritesOnly
                  ? 'No projects found'
                  : 'No projects yet'}
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || showFavoritesOnly
                  ? 'Try adjusting your filters'
                  : 'Click "New Project" to create your first project'}
              </p>
              {!searchQuery && statusFilter === "all" && priorityFilter === "all" && !showFavoritesOnly && (
                <button
                  onClick={handleCreateProject}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Favorite Projects Section */}
              {favoriteProjects.length > 0 && (
                <div>
                  {/* Show header with count when filtering OR when there are other projects */}
                  {(showFavoritesOnly || otherProjects.length > 0) && (
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {showFavoritesOnly ? 'Favorite Projects' : 'Favorites'}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {favoriteProjects.length}
                      </span>
                    </div>
                  )}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-3"
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

              {/* Other Projects Section - Only show when NOT filtering by favorites */}
              {otherProjects.length > 0 && !showFavoritesOnly && (
                <div>
                  {favoriteProjects.length > 0 && (
                    <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      All Projects
                    </h2>
                  )}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-3"
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

          {/* Stats Footer */}
          {projects.length > 0 && (
            <div className={`rounded-xl border p-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {projects.length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Total Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-green-500`}>
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-blue-500`}>
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-yellow-500`}>
                    {projects.filter(p => p.is_favorite).length}
                  </div>
                  <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
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