// ============================================
// FILE: src/app/dashboard/todo/projects/hooks/useProjects.ts
// Create this new file
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getProjects,
  getProjectById,
  getProjectWithTasks,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectFavorite,
  updateProjectStatus,
  getProjectStatistics,
} from "@/lib/supabase/project-helpers";
import type { Project, ProjectStatus, ProjectPriority, ProjectColor } from "@/types/database";

export function useProjects(userId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getProjects(userId);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create new project
  const handleCreateProject = async (projectData: {
    title: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    color?: ProjectColor;
    start_date?: string | null;
    target_end_date?: string | null;
    tags?: string[];
  }) => {
    if (!userId) return { success: false, error: "No user ID" };

    try {
      const { data, error: createError } = await createProject({
        user_id: userId,
        ...projectData,
      });

      if (createError) {
        return { success: false, error: createError.message };
      }

      await fetchProjects(); // Refresh list
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create project",
      };
    }
  };

  // Update existing project
  const handleUpdateProject = async (
    projectId: string,
    updates: Partial<Project>
  ) => {
    try {
      const { data, error: updateError } = await updateProject(projectId, updates);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      await fetchProjects(); // Refresh list
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update project",
      };
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: string, deleteTasks: boolean = false) => {
    try {
      const { error: deleteError } = await deleteProject(projectId, deleteTasks);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      await fetchProjects(); // Refresh list
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete project",
      };
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: "Project not found" };

    try {
      const { error: toggleError } = await toggleProjectFavorite(
        projectId,
        !project.is_favorite
      );

      if (toggleError) {
        return { success: false, error: toggleError.message };
      }

      await fetchProjects(); // Refresh list
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to toggle favorite",
      };
    }
  };

  // Update status
  const handleUpdateStatus = async (projectId: string, status: ProjectStatus) => {
    try {
      const { error: statusError } = await updateProjectStatus(projectId, status);

      if (statusError) {
        return { success: false, error: statusError.message };
      }

      await fetchProjects(); // Refresh list
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update status",
      };
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    toggleFavorite: handleToggleFavorite,
    updateStatus: handleUpdateStatus,
  };
}

// ============================================
// Hook for single project with tasks
// ============================================

export function useProjectDetail(projectId: string | null) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetail = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getProjectWithTasks(projectId);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetail();
  }, [fetchProjectDetail]);

  return {
    project,
    loading,
    error,
    refetch: fetchProjectDetail,
  };
}

// ============================================
// Hook for project statistics
// ============================================

export function useProjectStats(userId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      const { data } = await getProjectStatistics(userId);
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [userId]);

  return { stats, loading };
}