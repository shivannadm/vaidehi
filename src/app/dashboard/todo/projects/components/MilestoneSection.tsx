// ============================================
// FILE: src/app/dashboard/todo/projects/components/MilestoneSection.tsx
// ✅ MOBILE RESPONSIVE - FIXED ALIGNMENT & LAYOUT
// ============================================

"use client";

import { useState, useEffect } from "react";
import { Flag, Plus, CheckCircle2, Circle, Trash2, Calendar, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  description: string;
  is_completed: boolean;
  created_at: string;
}

interface MilestoneSectionProps {
  projectId: string;
  isDark: boolean;
}

export default function MilestoneSection({ projectId, isDark }: MilestoneSectionProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    due_date: "",
    description: "",
  });

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true, nullsFirst: false });

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Failed to load milestones");
        return;
      }

      if (data) {
        setMilestones(data);
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setError("An error occurred while loading milestones");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim()) {
      setError("Milestone title is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const milestoneData = {
        project_id: projectId,
        title: newMilestone.title.trim(),
        due_date: newMilestone.due_date || null,
        description: newMilestone.description.trim() || "",
        is_completed: false,
      };

      const { data, error: insertError } = await supabase
        .from("milestones")
        .insert(milestoneData)
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        setError(`Failed to create milestone: ${insertError.message}`);
        return;
      }

      setNewMilestone({ title: "", due_date: "", description: "" });
      setIsAdding(false);
      await fetchMilestones();
    } catch (error) {
      console.error("Error creating milestone:", error);
      setError("An error occurred while creating the milestone");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (milestone: Milestone) => {
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("milestones")
        .update({ is_completed: !milestone.is_completed })
        .eq("id", milestone.id);

      if (updateError) {
        console.error("Update error:", updateError);
        setError("Failed to update milestone");
        return;
      }

      await fetchMilestones();
    } catch (error) {
      console.error("Error updating milestone:", error);
      setError("An error occurred while updating the milestone");
    }
  };

  const handleDelete = async (milestoneId: string) => {
    if (!confirm("Delete this milestone?")) return;

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("milestones")
        .delete()
        .eq("id", milestoneId);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        setError("Failed to delete milestone");
        return;
      }

      await fetchMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      setError("An error occurred while deleting the milestone");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-indigo-600"></div>
        <p className={`mt-2 text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Loading milestones...
        </p>
      </div>
    );
  }

  const completedCount = milestones.filter(m => m.is_completed).length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className={`text-base md:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            🏁 Milestones
          </h3>
          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Break your project into phases
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setError(null);
            }}
            className="w-full sm:w-auto px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1.5 md:gap-2"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Add Milestone
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={`rounded-lg border p-2.5 md:p-3 flex items-start gap-2 text-xs md:text-sm ${isDark
            ? 'bg-red-900/20 border-red-800 text-red-400'
            : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs md:text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {milestones.length > 0 && (
        <div className={`rounded-xl border p-3 md:p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs md:text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Overall Progress
            </span>
            <span className={`text-xs md:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {completedCount}/{milestones.length} completed
            </span>
          </div>
          <div className={`h-2.5 md:h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Milestone Form */}
      {isAdding && (
        <div className={`rounded-xl border p-3 md:p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
          <div className="space-y-2.5 md:space-y-3">
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="Milestone title..."
              className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              disabled={saving}
            />
            <textarea
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              placeholder="Description (optional)..."
              rows={2}
              className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              disabled={saving}
            />
            <input
              type="date"
              value={newMilestone.due_date}
              onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
              className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
                }`}
              disabled={saving}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewMilestone({ title: "", due_date: "", description: "" });
                  setError(null);
                }}
                disabled={saving}
                className={`flex-1 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMilestone}
                disabled={!newMilestone.title.trim() || saving}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestones List */}
      {milestones.length === 0 && !isAdding ? (
        <div className="text-center py-8 md:py-12 px-4">
          <Flag className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-base md:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No Milestones Yet
          </h3>
          <p className={`text-xs md:text-sm mb-4 md:mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Break your project into phases with milestones
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-5 py-2.5 md:px-6 md:py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
          >
            Create First Milestone
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 md:space-y-3">
          {milestones.map((milestone) => {
            const isPast = milestone.due_date && new Date(milestone.due_date) < new Date();

            return (
              <div
                key={milestone.id}
                className={`group rounded-xl border p-3 md:p-4 transition ${milestone.is_completed
                    ? isDark
                      ? 'bg-green-900/20 border-green-800'
                      : 'bg-green-50 border-green-200'
                    : isPast
                      ? isDark
                        ? 'bg-red-900/20 border-red-800'
                        : 'bg-red-50 border-red-200'
                      : isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                  }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(milestone)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {milestone.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500 fill-green-500" />
                    ) : (
                      <Circle className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-base md:text-lg mb-1 break-words ${milestone.is_completed
                          ? isDark
                            ? 'text-green-400 line-through'
                            : 'text-green-700 line-through'
                          : isDark
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}
                    >
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className={`text-xs md:text-sm mb-2 break-words ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {milestone.description}
                      </p>
                    )}
                    {milestone.due_date && (
                      <div className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm ${isPast && !milestone.is_completed
                          ? 'text-red-500 font-medium'
                          : isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>
                          Due {new Date(milestone.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {isPast && !milestone.is_completed && " (Overdue)"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions - Always visible on mobile */}
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className={`p-1.5 md:p-2 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                      }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}