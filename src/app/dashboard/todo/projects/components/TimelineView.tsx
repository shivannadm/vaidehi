"use client";

import { Calendar } from "lucide-react";

interface TimelineViewProps {
  isDark: boolean;
}

export default function TimelineView({ isDark }: TimelineViewProps) {
  return (
    <div className="text-center py-12">
      <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Timeline View
      </h3>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Gantt-style timeline coming in Phase 2!
      </p>
    </div>
  );
}