"use client";

import { useState, useEffect } from "react";
import { recalculateProjectProgress } from "@/lib/supabase/project-helpers";

export function useProjectProgress(projectId: string | null) {
  const [calculating, setCalculating] = useState(false);

  const recalculate = async () => {
    if (!projectId) return;

    setCalculating(true);
    try {
      await recalculateProjectProgress(projectId);
    } catch (error) {
      console.error("Error recalculating progress:", error);
    } finally {
      setCalculating(false);
    }
  };

  return {
    recalculate,
    calculating,
  };
}