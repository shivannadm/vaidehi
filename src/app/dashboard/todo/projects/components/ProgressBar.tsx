// ============================================
// FILE: src/app/dashboard/todo/projects/components/ProgressBar.tsx
// ============================================

"use client";

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  isDark: boolean;
}

export default function ProgressBar({
  progress,
  completedTasks,
  totalTasks,
  isDark,
}: ProgressBarProps) {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 75) return "from-green-500 to-emerald-500";
    if (progress >= 50) return "from-blue-500 to-cyan-500";
    if (progress >= 25) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getProgressMessage = () => {
    if (progress === 0) return "Just getting started!";
    if (progress < 25) return "Making progress...";
    if (progress < 50) return "Quarter way there!";
    if (progress < 75) return "Halfway done!";
    if (progress < 100) return "Almost there!";
    return "Complete! 🎉";
  };

  return (
    <div
      className={`rounded-xl border p-5 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3
            className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Overall Progress
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {getProgressMessage()}
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              progress === 100
                ? "text-green-500"
                : isDark
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            {progress}%
          </div>
          <div
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            {completedTasks}/{totalTasks} tasks
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`h-4 rounded-full overflow-hidden ${
          isDark ? "bg-slate-700" : "bg-slate-200"
        }`}
      >
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Milestones */}
      <div className="flex items-center justify-between mt-2 px-1">
        {[0, 25, 50, 75, 100].map((milestone) => (
          <div key={milestone} className="text-center">
            <div
              className={`w-2 h-2 rounded-full mb-1 ${
                progress >= milestone
                  ? "bg-green-500"
                  : isDark
                  ? "bg-slate-600"
                  : "bg-slate-300"
              }`}
            />
            <span
              className={`text-xs ${
                progress >= milestone
                  ? "text-green-500 font-semibold"
                  : isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {milestone}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}