// src/app/dashboard/trading/dashboard/components/CalendarHeatmap.tsx
"use client";

import { Calendar } from "lucide-react";
import { useState, useCallback, useMemo } from "react";

interface CalendarHeatmapProps {
  data: { date: string; pnl: number }[];
  isDark: boolean;
}

interface HoveredCell {
  displayDate: string;
  pnl: number | undefined;
  x: number;
  y: number;
}

export default function CalendarHeatmap({ data, isDark }: CalendarHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  // Generate full FY dates
  const fyDates = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const fyStart = new Date(fyStartYear, 3, 1);
    const fyEnd = new Date(fyStartYear + 1, 2, 31);

    const dates: Date[] = [];
    const current = new Date(fyStart);

    while (current <= fyEnd && current <= today) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }, []);

  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      map.set(item.date, item.pnl);
    });
    return map;
  }, [data]);

  // Dynamic slabs calculation
  const { profitColorForLevel, lossColorForLevel, hasPositive, hasNegative } = useMemo(() => {
    const positivePnLs = Array.from(dataMap.values()).filter((x) => x > 0);
    const negativePnLs = Array.from(dataMap.values()).filter((x) => x < 0);

    const hasPos = positivePnLs.length > 0;
    const minProfit = hasPos ? Math.min(...positivePnLs) : 0;
    const maxProfit = hasPos ? Math.max(...positivePnLs) : 0;
    const profitSingleValue = hasPos && minProfit === maxProfit;
    const profitStep = hasPos && !profitSingleValue ? (maxProfit - minProfit) / 5 : 0;

    const hasNeg = negativePnLs.length > 0;
    const negativeMagnitudes = negativePnLs.map((n) => Math.abs(n));
    const minLossAbs = hasNeg ? Math.min(...negativeMagnitudes) : 0;
    const maxLossAbs = hasNeg ? Math.max(...negativeMagnitudes) : 0;
    const lossSingleValue = hasNeg && minLossAbs === maxLossAbs;
    const lossStep = hasNeg && !lossSingleValue ? (maxLossAbs - minLossAbs) / 5 : 0;

    const profitColors = ["bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600", "bg-emerald-700"];
    const lossColors = ["bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700"];

    const getProfitColor = (pnl: number) => {
      if (!hasPos || profitSingleValue || profitStep === 0) return profitColors[5];
      let level = Math.floor((pnl - minProfit) / profitStep);
      level = Math.max(0, Math.min(4, level));
      const lastThreshold = minProfit + profitStep * 5;
      if (pnl >= lastThreshold) return profitColors[5];
      return profitColors[level];
    };

    const getLossColor = (pnl: number) => {
      if (!hasNeg || lossSingleValue || lossStep === 0) return lossColors[5];
      const absPnl = Math.abs(pnl);
      let level = Math.floor((absPnl - minLossAbs) / lossStep);
      level = Math.max(0, Math.min(4, level));
      const lastLossThreshold = minLossAbs + lossStep * 5;
      if (absPnl >= lastLossThreshold) return lossColors[5];
      return lossColors[level];
    };

    return {
      profitColorForLevel: getProfitColor,
      lossColorForLevel: getLossColor,
      hasPositive: hasPos,
      hasNegative: hasNeg,
    };
  }, [dataMap]);

  const getColorClass = useCallback((pnl: number | undefined) => {
    if (pnl === undefined) {
      return isDark ? "bg-slate-800/40 border border-slate-700/30" : "bg-slate-100 border border-slate-200";
    }

    if (pnl === 0) {
      return isDark ? "bg-slate-700" : "bg-slate-300";
    }

    if (pnl > 0) {
      return profitColorForLevel(pnl);
    }

    if (pnl < 0) {
      return lossColorForLevel(pnl);
    }

    return isDark ? "bg-slate-700" : "bg-slate-300";
  }, [isDark, profitColorForLevel, lossColorForLevel]);

  // Build weeks
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    let currentWeek: Date[] = [];

    const firstDayOfWeek = fyDates[0]?.getDay() || 0;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(new Date(0));
    }

    fyDates.forEach((date) => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0));
      }
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [fyDates]);

  const { totalPnL, profitDays } = useMemo(() => {
    const total = Array.from(dataMap.values()).reduce((sum, pnl) => sum + pnl, 0);
    const profit = Array.from(dataMap.values()).filter((pnl) => pnl > 0).length;
    return { totalPnL: total, profitDays: profit };
  }, [dataMap]);

  const getMonthLabel = useCallback((weekIndex: number) => {
    const week = weeks[weekIndex];
    const firstValidDate = week.find((d) => d.getTime() > 0);

    if (!firstValidDate) return null;

    if (firstValidDate.getDate() <= 7) {
      const monthStr = firstValidDate.toLocaleDateString("en-US", { month: "short" });

      if (weekIndex > 0) {
        const prevWeek = weeks[weekIndex - 1];
        const prevDate = prevWeek.find((d) => d.getTime() > 0);
        if (prevDate && prevDate.getMonth() === firstValidDate.getMonth()) {
          return null;
        }
      }

      return monthStr;
    }

    return null;
  }, [weeks]);

  // Optimized hover handler with consistent data flow
  const handleMouseEnter = useCallback((displayDate: string, pnl: number | undefined, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      displayDate,
      pnl,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  return (
    <div
      className={`rounded-2xl p-4 md:p-6 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Trading Calendar
            </h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Financial Year Activity (12 Months)
          </p>
        </div>

        <div className="text-right">
          <div
            className={`text-2xl md:text-3xl font-bold ${totalPnL >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
          >
            {totalPnL >= 0 ? "+" : "-"}₹{Math.abs(totalPnL).toLocaleString("en-IN")}
          </div>
          <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {profitDays} profit days
          </div>
        </div>
      </div>

      {/* Desktop Month Labels */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex mb-2 min-w-max">
            <div className="w-15 flex-shrink-0"></div>
            <div className="flex-1 flex justify-between px-1">
              {weeks.map((_, weekIndex) => (
                <div key={weekIndex} className="flex-1 text-center min-w-[12px]">
                  {getMonthLabel(weekIndex) && (
                    <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {getMonthLabel(weekIndex)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Grid Area */}
      <div className="overflow-x-auto pb-1 mb-4 scrollbar-thin" style={{ overflowY: "visible" }}>
        <div className="min-w-max">
          {/* Mobile Month Labels */}
          <div className="flex items-center mb-3 sm:hidden">
            <div className="w-10 flex-shrink-0"></div>
            <div className="flex gap-1">
              {weeks.map((_, wi) => (
                <div key={wi} className="min-w-[10px] text-center">
                  {getMonthLabel(wi) && (
                    <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {getMonthLabel(wi)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-1 min-w-max">
            {/* Day Labels - Desktop */}
            <div className="hidden sm:flex flex-col gap-1 justify-around pr-2 w-8 flex-shrink-0">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className={`text-[10px] text-right font-medium aspect-square flex items-center justify-end ${isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day Labels - Mobile */}
            <div className="sm:hidden flex flex-col gap-1 justify-between pr-2 w-4 flex-shrink-0 text-[7px]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className={`font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {day[0]}
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div
              className="hidden sm:grid gap-1"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`, width: "100%" }}
            >
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dayIndex) => {
                    const isEmpty = date.getTime() === 0;

                    if (isEmpty) {
                      return (
                        <div
                          key={dayIndex}
                          className={`aspect-square rounded-sm ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}
                        />
                      );
                    }

                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                      date.getDate()
                    ).padStart(2, "0")}`;
                    const pnl = dataMap.get(dateStr);
                    const colorClass = getColorClass(pnl);
                    const displayDate = date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={dayIndex}
                        className={`aspect-square rounded-sm ${colorClass} transition-colors duration-150 cursor-pointer will-change-transform`}
                        onMouseEnter={(e) => handleMouseEnter(displayDate, pnl, e)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile Grid */}
            <div className="sm:hidden flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 min-w-[13px]">
                  {week.map((date, dayIndex) => {
                    const isEmpty = date.getTime() === 0;
                    if (isEmpty) {
                      return (
                        <div
                          key={dayIndex}
                          className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}
                        />
                      );
                    }

                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                      date.getDate()
                    ).padStart(2, "0")}`;
                    const pnl = dataMap.get(dateStr);
                    const colorClass = getColorClass(pnl);

                    return <div key={dayIndex} className={`w-2.5 h-2.5 rounded-full ${colorClass} transition-all`} />;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip - Optimized */}
      {hoveredCell && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 10}px`,
            transform: 'translate(-50%, -100%) translateZ(0)',
            willChange: 'transform',
          }}
        >
          <div
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-2xl border-2 ${isDark ? "bg-slate-900 text-white border-slate-700" : "bg-white text-slate-900 border-slate-300"
              }`}
          >
            <div className="font-bold text-sm mb-1">
              {hoveredCell.displayDate}
            </div>
            <div
              className={`font-bold text-base ${hoveredCell.pnl && hoveredCell.pnl > 0
                ? "text-emerald-500"
                : hoveredCell.pnl && hoveredCell.pnl < 0
                  ? "text-red-500"
                  : isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
            >
              {hoveredCell.pnl !== undefined
                ? `${hoveredCell.pnl >= 0 ? "+" : "-"}₹${Math.abs(hoveredCell.pnl).toFixed(2)}`
                : "No trade"}
            </div>
          </div>
          <div
            className={`absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 ${isDark
              ? "bg-slate-900 border-r-2 border-b-2 border-slate-700"
              : "bg-white border-r-2 border-b-2 border-slate-300"
              }`}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs flex-wrap">
        <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Less</span>
        <div
          className={`w-3 h-3 rounded-sm ${isDark ? "bg-slate-800/40 border border-slate-700/30" : "bg-slate-100 border border-slate-200"
            }`}
        />
        <div className="w-3 h-3 rounded-sm bg-emerald-200" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <span className="mx-0.5 text-slate-500">|</span>
        <div className="w-3 h-3 rounded-sm bg-red-200" />
        <div className="w-3 h-3 rounded-sm bg-red-400" />
        <div className="w-3 h-3 rounded-sm bg-red-600" />
        <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>More</span>
      </div>
    </div>
  );
}