// ============================================
// FILE: src/app/dashboard/todo/trends/components/ProjectDistribution.tsx
// ✅ UPDATED: Now has its own independent time range selector
// ============================================

"use client";

import { useState, useEffect } from "react";
import { getProjectDistribution, type ProjectTimeDistribution } from "@/lib/supabase/trends-helpers";
import { createClient } from "@/lib/supabase/client";

interface ProjectDistributionProps {
  data: ProjectTimeDistribution[]; // Initial data passed from parent
  isDark: boolean;
}

export default function ProjectDistribution({
  data: initialData,
  isDark,
}: ProjectDistributionProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [data, setData] = useState<ProjectTimeDistribution[]>(initialData);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch data when time range changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: projectData } = await getProjectDistribution(user.id, timeRange);
        if (projectData) {
          setData(projectData);
        }
      } catch (error) {
        console.error('Error fetching project distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Update data when parent data changes
  useEffect(() => {
    if (!loading) {
      setData(initialData);
    }
  }, [initialData]);

  // Calculate donut chart paths
  const createDonutPath = () => {
    const size = 200;
    const radius = 70;
    const center = size / 2;
    let currentAngle = -90;

    return data.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `
        M ${center} ${center}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;
      
      currentAngle = endAngle;
      
      return { ...item, path };
    });
  };

  const segments = createDonutPath();
  const totalHours = data.reduce((sum, d) => sum + d.totalHours, 0);
  const maxHours = Math.max(...data.map(d => d.totalHours), 1);

  // ✅ Format time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
    }
  };

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header with Time Range Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Project Time Distribution
          </h2>
          
          {/* ✅ Time Range Selector */}
          <div
            className={`flex items-center rounded-lg border ${
              isDark
                ? "bg-slate-700 border-slate-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                disabled={loading}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  timeRange === range
                    ? "bg-indigo-600 text-white"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-600"
                    : "text-slate-600 hover:bg-slate-100"
                } ${
                  range === 'daily' ? 'rounded-l-lg' : range === 'monthly' ? 'rounded-r-lg' : ''
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Time spent across projects - {getTimeRangeLabel()}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Chart & Legend */}
      {!loading && (
        <>
          {data.length === 0 ? (
            <div className="flex-1 text-center py-12">
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                No project data for selected period
              </p>
            </div>
          ) : (
            <>
              {/* TOP: Donut Chart & Legend */}
              <div className="flex items-center gap-8 mb-8">
                {/* Donut Chart */}
                <div className="flex-shrink-0">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Outer Ring */}
                    {segments.map((seg, i) => (
                      <path
                        key={i}
                        d={seg.path}
                        fill={seg.color}
                        className={`transition-all cursor-pointer ${
                          hoveredProject === seg.projectName
                            ? 'opacity-100'
                            : hoveredProject
                            ? 'opacity-50'
                            : 'opacity-100'
                        }`}
                        onMouseEnter={() => setHoveredProject(seg.projectName)}
                        onMouseLeave={() => setHoveredProject(null)}
                      />
                    ))}
                    
                    {/* Inner White Circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill={isDark ? "#1e293b" : "#ffffff"}
                    />
                    
                    {/* Center Text */}
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      className={`text-2xl font-bold ${
                        isDark ? "fill-white" : "fill-slate-900"
                      }`}
                    >
                      {totalHours.toFixed(0)}
                    </text>
                    <text
                      x="100"
                      y="110"
                      textAnchor="middle"
                      className={`text-xs ${
                        isDark ? "fill-slate-400" : "fill-slate-600"
                      }`}
                    >
                      hours
                    </text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {data.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between group cursor-pointer transition-all ${
                        hoveredProject === item.projectName
                          ? 'scale-105'
                          : hoveredProject
                          ? 'opacity-50'
                          : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredProject(item.projectName)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className={`text-sm truncate ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {item.projectName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-sm font-medium ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {item.totalHours.toFixed(1)}h
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM: BAR CHART */}
              <div className={`pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Time Comparison
                </h3>
                
                <div className="space-y-3">
                  {data.map((item, i) => (
                    <div
                      key={i}
                      className={`group cursor-pointer transition-all ${
                        hoveredProject === item.projectName
                          ? 'scale-102'
                          : hoveredProject
                          ? 'opacity-50'
                          : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredProject(item.projectName)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      {/* Project Name & Hours */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {item.projectName}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.totalHours.toFixed(1)}h
                        </span>
                      </div>

                      {/* Bar */}
                      <div
                        className={`h-8 rounded-lg overflow-hidden ${
                          isDark ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className="h-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{
                            width: `${(item.totalHours / maxHours) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        >
                          <span className="text-xs font-bold text-white">
                            {item.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// ✅ KEY CHANGES:
// ============================================
/*
1. Added local timeRange state (line 15)
2. Added loading state for time range changes (line 17)
3. Added useEffect to fetch data when timeRange changes (lines 21-42)
4. Added time range selector buttons in header (lines 125-148)
5. Component now independently manages its own time filter
6. Shows loading spinner when fetching new data
7. Updates subtitle to show current selection (line 152)

Now this component is completely independent from the global time filter!
*/