"use client";

import { Flag } from "lucide-react";

interface MilestoneSectionProps {
  projectId: string;
  isDark: boolean;
}

export default function MilestoneSection({ projectId, isDark }: MilestoneSectionProps) {
  return (
    <div className="text-center py-12">
      <Flag className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Milestones
      </h3>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Break projects into phases - coming in Phase 2!
      </p>
    </div>
  );
}