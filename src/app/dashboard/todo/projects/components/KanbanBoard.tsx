"use client";

import { Columns } from "lucide-react";

interface KanbanBoardProps {
  isDark: boolean;
}

export default function KanbanBoard({ isDark }: KanbanBoardProps) {
  return (
    <div className="text-center py-12">
      <Columns className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Kanban Board
      </h3>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Drag & drop task board coming in Phase 3!
      </p>
    </div>
  );
}