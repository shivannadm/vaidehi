"use client";

import { useState, useEffect, useCallback } from "react";
import { getProjectTasks } from "@/lib/supabase/project-helpers";
import type { TaskWithTag } from "@/types/database";

export function useProjectTasks(projectId: string | null) {
  const [tasks, setTasks] = useState<TaskWithTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getProjectTasks(projectId);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
}