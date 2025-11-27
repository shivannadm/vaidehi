// src/app/dashboard/todo/trends/components/FocusTimeChart.tsx
"use client";

import { useState } from "react";
import type { FocusTimeData } from "@/lib/supabase/trends-helpers";

interface FocusTimeChartProps {
  data: FocusTimeData[];
  timeRange: 'daily' | 'weekly' | 'monthly';
  isDark: boolean;
}

export default function FocusTimeChart({
  data,
  timeRange,
  isDark,
}: FocusTimeChartProps) {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Get max hours for scaling
  const maxHours = Math.max(...data.map(d => d.totalHours), 1);

  // Format date label based on view
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (view === 'daily') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (view === 'weekly') {
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  // Group data based on view
  const getDisplayData = () => {
    if (view === 'daily') {
      return data.slice(-30); // Last 30 days
    } else if (view === 'weekly') {
      // Group by week
      const weeks: FocusTimeData[] = [];
      for (let i = 0; i < data.length; i += 7) {
        const weekData = data.slice(i, i + 7);
        const totalHours = weekData.reduce((sum, d) => sum + d.totalHours, 0);
        weeks.push({
          date: weekData[0].date,
          totalHours,
          projects: weekData.flatMap(d => d.projects),
        });
      }
      return weeks;
    } else {
      // Group by month
      const months = new Map<string, FocusTimeData>();
      data.forEach(d => {
        const month = d.date.substring(0, 7); // YYYY-MM
        if (!months.has(month)) {
          months.set(month, {
            date: month + '-01',
            totalHours: 0,
            projects: [],
          });
        }
        const monthData = months.get(month)!;
        monthData.totalHours += d.totalHours;
        monthData.projects.push(...d.projects);
      });
      return Array.from(months.values());
    }
  };

  const displayData = getDisplayData();

  // Get stacked bar segments for each day
  const getBarSegments = (item: FocusTimeData) => {
    const projectMap = new Map<string, { hours: number; color: string }>();
    
    item.projects.forEach(p => {
      if (!projectMap.has(p.name)) {
        projectMap.set(p.name, { hours: 0, color: p.color });
      }
      projectMap.get(p.name)!.hours += p.hours;
    });

    const segments = Array.from(projectMap.entries()).map(([name, data]) => ({
      name,
      hours: data.hours,
      color: data.color,
      percentage: (data.hours / item.totalHours) * 100,
    }));

    return segments.sort((a, b) => b.hours - a.hours);
  };

  return (
    <div
      className={`rounded-xl border p-6 h-full flex flex-col ${
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
            Focus Time Chart
          </h2>
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Time spent by date
          </p>
        </div>

        {/* View Selector */}
        <div
          className={`flex items-center rounded-lg border ${
            isDark
              ? "bg-slate-700 border-slate-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          {(['daily', 'weekly', 'monthly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                view === v
                  ? "bg-indigo-600 text-white"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-600"
                  : "text-slate-600 hover:bg-slate-100"
              } ${v === 'daily' ? 'rounded-l-lg' : v === 'monthly' ? 'rounded-r-lg' : ''}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart - Fixed Height with Scroll */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-custom pr-2">
        <div className="space-y-2">
          {displayData.length === 0 ? (
            <div className="text-center py-12">
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                No focus time data yet
              </p>
            </div>
          ) : (
            displayData.map((item, index) => {
              const segments = getBarSegments(item);
              const barHeight = (item.totalHours / maxHours) * 100;

              return (
                <div key={index} className="flex items-end gap-2">
                  {/* Date Label */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {formatDateLabel(item.date)}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 flex items-end h-16">
                    <div
                      className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse transition-all"
                      style={{ height: `${barHeight}%` }}
                    >
                      {segments.map((seg, i) => (
                        <div
                          key={i}
                          className="transition-all hover:opacity-80 cursor-pointer"
                          style={{
                            height: `${seg.percentage}%`,
                            backgroundColor: seg.color,
                          }}
                          title={`${seg.name}: ${seg.hours.toFixed(1)}h`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hours Label */}
                  <div className="w-12 flex-shrink-0">
                    <span
                      className={`text-xs font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.totalHours.toFixed(1)}h
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}