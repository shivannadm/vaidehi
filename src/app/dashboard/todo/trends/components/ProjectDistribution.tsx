// src/app/dashboard/todo/trends/components/ProjectDistribution.tsx
"use client";

import { useState } from "react";
import type { ProjectTimeDistribution } from "@/lib/supabase/trends-helpers";

interface ProjectDistributionProps {
  data: ProjectTimeDistribution[];
  timeRange: 'daily' | 'weekly' | 'monthly';
  onTimeRangeChange: (range: 'daily' | 'weekly' | 'monthly') => void;
  isDark: boolean;
}

export default function ProjectDistribution({
  data,
  timeRange,
  onTimeRangeChange,
  isDark,
}: ProjectDistributionProps) {
  // Calculate donut chart paths
  const createDonutPath = () => {
    const size = 200;
    const radius = 70;
    const center = size / 2;
    let currentAngle = -90; // Start from top

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

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Project Time Distribution
          </h2>
        </div>

        {/* Time Range Selector */}
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
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                timeRange === range
                  ? "bg-indigo-600 text-white"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-600"
                  : "text-slate-600 hover:bg-slate-100"
              } ${
                range === 'daily' ? 'rounded-l-lg' : range === 'monthly' ? 'rounded-r-lg' : ''
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart & Legend */}
      <div className="flex items-center gap-8">
        {data.length === 0 ? (
          <div className="flex-1 text-center py-12">
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              No project data yet
            </p>
          </div>
        ) : (
          <>
            {/* Donut Chart */}
            <div className="flex-shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Outer Ring */}
                {segments.map((seg, i) => (
                  <path
                    key={i}
                    d={seg.path}
                    fill={seg.color}
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                  />
                ))}
                
                {/* Inner White Circle (creates donut effect) */}
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
                <div key={i} className="flex items-center justify-between group">
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
          </>
        )}
      </div>
    </div>
  );
}