// src/app/dashboard/todo/trends/components/FocusTimeChart.tsx
// ✅ REAL MOBILE OPTIMIZATION - Compact view, readable bars
"use client";

import { useState, useEffect, useRef } from "react";
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserScrollRef = useRef<number>(0);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      const handleUserScroll = () => {
        lastUserScrollRef.current = Date.now();
      };

      container.addEventListener('scroll', handleUserScroll, { passive: true });

      const timeSinceUserScroll = Date.now() - lastUserScrollRef.current;
      if (timeSinceUserScroll > 10000 && data.length > 0) {
        container.scrollTop = container.scrollHeight;
      }

      return () => {
        container.removeEventListener('scroll', handleUserScroll);
      };
    }
  }, [data]);

  const maxHours = Math.max(...data.map(d => d.totalHours), 1);

  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    const date = new Date(year, month, day);

    // MOBILE: Shorter formats
    const isMobile = window.innerWidth < 640;

    if (view === 'daily') {
      return date.toLocaleDateString('en-US', {
        month: isMobile ? 'numeric' : 'short',
        day: 'numeric'
      });
    } else if (view === 'weekly') {
      return isMobile ? `W${Math.ceil(date.getDate() / 7)}` : `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  const getDisplayData = () => {
    if (view === 'daily') {
      return data.slice(-30);
    } else if (view === 'weekly') {
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
      const months = new Map<string, FocusTimeData>();
      data.forEach(d => {
        const month = d.date.substring(0, 7);
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
      className={`rounded-xl border p-3 sm:p-4 md:p-6 h-full flex flex-col ${isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
        }`}
    >
      {/* Header - MOBILE OPTIMIZED */}
      <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2
              className={`text-sm sm:text-base md:text-lg font-bold ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Focused Time
            </h2>
            <p
              className={`text-[10px] sm:text-xs md:text-sm ${isDark ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Time spent by date
            </p>
          </div>
        </div>

        {/* View Selector - MOBILE: Full width */}
        <div
          className={`flex items-center rounded-lg border ${isDark
              ? "bg-slate-700 border-slate-600"
              : "bg-slate-50 border-slate-200"
            }`}
        >
          {(['daily', 'weekly', 'monthly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium transition ${view === v
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

      {/* Chart - MOBILE: Smaller bars */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
          {displayData.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p
                className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"
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
                <div key={index} className="flex items-end gap-1 sm:gap-1.5 md:gap-2">
                  {/* Date Label - MOBILE: Narrower */}
                  <div className="w-10 sm:w-14 md:w-16 flex-shrink-0 text-right">
                    <span
                      className={`text-[9px] sm:text-[10px] md:text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                      {formatDateLabel(item.date)}
                    </span>
                  </div>

                  {/* Bar - MOBILE: Smaller height */}
                  <div className="flex-1 flex items-end h-10 sm:h-12 md:h-16">
                    <div
                      className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse transition-all"
                      style={{ height: `${barHeight}%` }}
                    >
                      {segments.map((seg, i) => (
                        <div
                          key={i}
                          className="transition-all hover:opacity-80 cursor-pointer active:scale-95"
                          style={{
                            height: `${seg.percentage}%`,
                            backgroundColor: seg.color,
                          }}
                          title={`${seg.name}: ${seg.hours.toFixed(1)}h`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hours Label - MOBILE: Narrower */}
                  <div className="w-8 sm:w-10 md:w-12 flex-shrink-0">
                    <span
                      className={`text-[9px] sm:text-[10px] md:text-xs font-bold ${isDark ? "text-white" : "text-slate-900"
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