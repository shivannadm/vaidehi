// ============================================
// FILE: src/lib/supabase/project-helpers.ts
// Create this new file
// ============================================

import { createClient } from "./client";
import type { Project, ProjectStatus, ProjectPriority, ProjectColor } from "@/types/database";

// ============================================
// FETCH OPERATIONS
// ============================================

/**
 * Get all projects for a user
 */
export async function getProjects(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("is_favorite", { ascending: false })
    .order("updated_at", { ascending: false });

  return { data, error };
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  return { data, error };
}

/**
 * Get project with its tasks
 */
export async function getProjectWithTasks(projectId: string) {
  const supabase = createClient();

  // Get project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return { data: null, error: projectError };
  }

  // Get tasks with tags
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      *,
      tag:tags(*)
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (tasksError) {
    return { data: null, error: tasksError };
  }

  return {
    data: {
      ...project,
      tasks: tasks || [],
    },
    error: null,
  };
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(userId: string, status: ProjectStatus) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .order("updated_at", { ascending: false });

  return { data, error };
}

/**
 * Get favorite projects
 */
export async function getFavoriteProjects(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favorite", true)
    .order("updated_at", { ascending: false });

  return { data, error };
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new project
 */
export async function createProject(projectData: {
  user_id: string;
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  color?: ProjectColor;
  start_date?: string | null;
  target_end_date?: string | null;
  tags?: string[];
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: projectData.user_id,
      title: projectData.title,
      description: projectData.description || "",
      status: projectData.status || "planning",
      priority: projectData.priority || "medium",
      color: projectData.color || "blue",
      start_date: projectData.start_date || null,
      target_end_date: projectData.target_end_date || null,
      tags: projectData.tags || [],
      is_favorite: false,
      progress: 0,
      total_tasks: 0,
      completed_tasks: 0,
    })
    .select()
    .single();

  return { data, error };
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();

  return { data, error };
}

/**
 * Toggle project favorite status
 */
export async function toggleProjectFavorite(projectId: string, isFavorite: boolean) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({ is_favorite: isFavorite })
    .eq("id", projectId)
    .select()
    .single();

  return { data, error };
}

/**
 * Update project status
 */
export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .select()
    .single();

  return { data, error };
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a project (and optionally its tasks)
 */
export async function deleteProject(projectId: string, deleteTasks: boolean = false) {
  const supabase = createClient();

  if (deleteTasks) {
    // Delete all tasks in this project first
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("project_id", projectId);

    if (tasksError) {
      return { error: tasksError };
    }
  } else {
    // Just unlink tasks from project
    const { error: unlinkError } = await supabase
      .from("tasks")
      .update({ project_id: null })
      .eq("project_id", projectId);

    if (unlinkError) {
      return { error: unlinkError };
    }
  }

  // Now delete the project
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  return { error };
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Assign a task to a project
 */
export async function assignTaskToProject(taskId: string, projectId: string | null) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({ project_id: projectId })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

/**
 * Get all tasks for a project
 */
export async function getProjectTasks(projectId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      tag:tags(*)
    `)
    .eq("project_id", projectId)
    .order("is_completed", { ascending: true })
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Manually recalculate project progress
 * (Usually auto-calculated by trigger, but useful for manual refresh)
 */
export async function recalculateProjectProgress(projectId: string) {
  const supabase = createClient();

  // Call the PostgreSQL function
  const { data, error } = await supabase.rpc("calculate_project_progress", {
    project_uuid: projectId,
  });

  return { data, error };
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get project statistics for a user
 */
export async function getProjectStatistics(userId: string) {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("status, priority")
    .eq("user_id", userId);

  if (error || !projects) {
    return { data: null, error };
  }

  const stats = {
    total: projects.length,
    byStatus: {
      planning: projects.filter(p => p.status === "planning").length,
      active: projects.filter(p => p.status === "active").length,
      on_hold: projects.filter(p => p.status === "on_hold").length,
      completed: projects.filter(p => p.status === "completed").length,
      archived: projects.filter(p => p.status === "archived").length,
    },
    byPriority: {
      low: projects.filter(p => p.priority === "low").length,
      medium: projects.filter(p => p.priority === "medium").length,
      high: projects.filter(p => p.priority === "high").length,
      critical: projects.filter(p => p.priority === "critical").length,
    },
  };

  return { data: stats, error: null };
}