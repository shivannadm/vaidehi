"use client";

import { useState, useEffect } from "react";
import { getProjectDistribution, type ProjectTimeDistribution } from "@/lib/supabase/trends-helpers";
import { createClient } from "@/lib/supabase/client";

interface ProjectDistributionProps {
  data: ProjectTimeDistribution[];
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

  useEffect(() => {
    if (!loading) {
      setData(initialData);
    }
  }, [initialData]);

  const createDonutPath = () => {
    const size = 200; // Increased from 180
    const radius = 70;  // Increased from 65
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

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
    }
  };

  // Calculate hours and minutes
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours % 1) * 60);

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 md:p-6 ${isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
        }`}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2
            className={`text-sm sm:text-base md:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            Time Distribution
          </h2>

          {/* Time Range Selector */}
          <div
            className={`flex items-center rounded-lg border ${isDark
                ? "bg-slate-700 border-slate-600"
                : "bg-slate-50 border-slate-200"
              }`}
          >
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                disabled={loading}
                className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium transition ${timeRange === range
                    ? "bg-indigo-600 text-white"
                    : isDark
                      ? "text-slate-300 hover:bg-slate-600"
                      : "text-slate-600 hover:bg-slate-100"
                  } ${range === 'daily' ? 'rounded-l-lg' : range === 'monthly' ? 'rounded-r-lg' : ''
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <p className={`text-[10px] sm:text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Time spent across projects - {getTimeRangeLabel()}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {data.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                No project data for selected period
              </p>
            </div>
          ) : (
            <>
              {/* Donut & Legend */}
              <div className="flex items-start gap-3 sm:gap-4 md:gap-8 mb-4 sm:mb-6 md:mb-8">
                {/* Donut - PERFECTLY CENTERED */}
                <div className="flex-shrink-0">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="w-40 h-40 sm:w-48 sm:h-48 md:w-[220px] md:h-[220px]">
                    {segments.map((seg, i) => (
                      <path
                        key={i}
                        d={seg.path}
                        fill={seg.color}
                        className={`transition-all cursor-pointer ${hoveredProject === seg.projectName ? 'opacity-100' : hoveredProject ? 'opacity-50' : 'opacity-100'
                          }`}
                        onMouseEnter={() => setHoveredProject(seg.projectName)}
                        onMouseLeave={() => setHoveredProject(null)}
                        onClick={() => setHoveredProject(hoveredProject === seg.projectName ? null : seg.projectName)}
                      />
                    ))}
                    <circle cx="100" cy="100" r="50" fill={isDark ? "#1e293b" : "#ffffff"} />

                    {/* ✅ PERFECTLY FITTED: "10h 44m" */}
                    <text x="100" y="108" textAnchor="middle" className={`text-xl sm:text-2xl md:text-2xl font-bold ${isDark ? "fill-white" : "fill-slate-900"}`}>
                      {hours}
                      <tspan className="text-sm sm:text-base md:text-lg font-normal fill-slate-500">h</tspan>
                      {minutes > 0 && (
                        <>
                          <tspan dx="2"> </tspan>
                          {minutes}
                          <tspan className="text-sm sm:text-base md:text-lg font-normal fill-slate-500">m</tspan>
                        </>
                      )}
                    </text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 md:space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {data.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between cursor-pointer transition-all ${hoveredProject === item.projectName ? 'scale-105' : hoveredProject ? 'opacity-50' : 'opacity-100'
                        }`}
                      onMouseEnter={() => setHoveredProject(item.projectName)}
                      onMouseLeave={() => setHoveredProject(null)}
                      onClick={() => setHoveredProject(hoveredProject === item.projectName ? null : item.projectName)}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className={`text-[10px] sm:text-xs md:text-sm truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {item.projectName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
                        <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {item.totalHours.toFixed(1)}h
                        </span>
                        <span className={`text-[10px] sm:text-xs font-bold min-w-[32px] text-right ${isDark ? "text-white" : "text-slate-900"}`}>
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className={`pt-3 sm:pt-4 md:pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xs sm:text-sm font-bold mb-2 sm:mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Time Comparison
                </h3>

                <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                  {data.map((item, i) => (
                    <div
                      key={i}
                      className={`cursor-pointer transition-all ${hoveredProject === item.projectName ? 'scale-102' : hoveredProject ? 'opacity-50' : 'opacity-100'
                        }`}
                      onMouseEnter={() => setHoveredProject(item.projectName)}
                      onMouseLeave={() => setHoveredProject(null)}
                      onClick={() => setHoveredProject(hoveredProject === item.projectName ? null : item.projectName)}
                    >
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <span className={`text-[10px] sm:text-xs font-medium truncate max-w-[60%] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {item.projectName}
                        </span>
                        <span className={`text-[10px] sm:text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {item.totalHours.toFixed(1)}h
                        </span>
                      </div>
                      <div className={`h-5 sm:h-6 md:h-8 rounded-lg overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                        <div
                          className="h-full transition-all duration-500 flex items-center justify-end pr-1.5 sm:pr-2"
                          style={{
                            width: `${(item.totalHours / maxHours) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        >
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">
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