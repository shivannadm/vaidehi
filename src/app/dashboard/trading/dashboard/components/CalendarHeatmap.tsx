// src/app/dashboard/trading/dashboard/components/CalendarHeatmap.tsx
"use client";

import { Calendar } from "lucide-react";

interface CalendarHeatmapProps {
  data: { date: string; pnl: number }[];
  isDark: boolean;
}

export default function CalendarHeatmap({ data, isDark }: CalendarHeatmapProps) {
  // Generate full FY dates (same as original)
  const generateFYDates = () => {
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
  };

  const fyDates = generateFYDates();

  const dataMap = new Map<string, number>();
  data.forEach((item) => {
    dataMap.set(item.date, item.pnl);
  });

  const getColorClass = (pnl: number | undefined) => {
    if (pnl === undefined) {
      return isDark ? "bg-slate-800/40 border border-slate-700/30" : "bg-slate-100 border border-slate-200";
    }

    if (pnl > 5000) return "bg-emerald-700";
    if (pnl > 2000) return "bg-emerald-600";
    if (pnl > 1000) return "bg-emerald-500";
    if (pnl > 500) return "bg-emerald-400";
    if (pnl > 100) return "bg-emerald-300";
    if (pnl > 0) return "bg-emerald-200";

    if (pnl === 0) return isDark ? "bg-slate-700" : "bg-slate-300";

    if (pnl > -100) return "bg-red-200";
    if (pnl > -500) return "bg-red-300";
    if (pnl > -1000) return "bg-red-400";
    if (pnl > -2000) return "bg-red-500";
    if (pnl > -5000) return "bg-red-600";
    return "bg-red-700";
  };

  // Build weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  const firstDayOfWeek = fyDates[0]?.getDay() || 0;
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(new Date(0));
  }

  fyDates.forEach((date) => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(0));
    }
    weeks.push(currentWeek);
  }

  const totalPnL = Array.from(dataMap.values()).reduce((sum, pnl) => sum + pnl, 0);
  const profitDays = Array.from(dataMap.values()).filter((pnl) => pnl > 0).length;

  // Prevent duplicate month labels (same logic as before)
  const getMonthLabel = (weekIndex: number) => {
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
  };

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

      {/* ---------- DESKTOP MONTH LABELS: UNCHANGED & outside scroller ---------- */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex mb-2 min-w-max">
            <div className="w-10 flex-shrink-0"></div>
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

      {/* ---------- SCROLLABLE AREA (contains mobile month labels + grid) ---------- */}
      <div className="overflow-x-auto pb-1 mb-4 scrollbar-thin" style={{ overflowY: "visible" }}>
        <div className="min-w-max">
          {/* MOBILE month labels INSIDE scroll so they move with grid (only on sm:hidden) */}
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
            {/* LEFT day labels: desktop (full abbreviations) */}
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

            {/* LEFT day labels: mobile compact (single letters) */}
            <div className="sm:hidden flex flex-col gap-1 justify-between pr-2 w-4 flex-shrink-0 text-[7px]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className={`font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {day[0]}
                </div>
              ))}
            </div>

            {/* ---------------- DESKTOP GRID (UNCHANGED): visible on sm+ ----------------
                This keeps your original grid behavior: columns distribute using CSS grid (repeat N, 1fr).
                Desktop layout is untouched. */}
            <div className="hidden sm:grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`, width: "100%" }}>
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

                    const dateStr = date.toISOString().split("T")[0];
                    const pnl = dataMap.get(dateStr);
                    const colorClass = getColorClass(pnl);

                    const showBelow = dayIndex < 3;
                    const nearRightEdge = weekIndex >= weeks.length - 10;

                    return (
                      <div
                        key={dayIndex}
                        className={`aspect-square rounded-sm ${colorClass} hover:ring-2 hover:ring-indigo-400 hover:brightness-110 transition-all cursor-pointer group relative z-10 hover:z-[9999]`}
                      >
                        {/* TOOLTIP - desktop unchanged */}
                        <div
                          className={`hidden group-hover:block absolute ${showBelow ? "top-full mt-2" : "bottom-full mb-2"
                            } ${nearRightEdge ? "right-0" : "left-1/2 -translate-x-1/2"
                            } pointer-events-none`}
                          style={{ zIndex: 99999 }}
                        >
                          <div
                            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-2xl border-2 ${isDark
                              ? "bg-slate-900 text-white border-slate-700"
                              : "bg-white text-slate-900 border-slate-300"
                              }`}
                          >
                            <div className="font-bold text-sm mb-1">
                              {date.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div
                              className={`font-bold text-base ${pnl && pnl > 0 ? "text-emerald-500" : pnl && pnl < 0 ? "text-red-500" : isDark ? "text-slate-400" : "text-slate-600"
                                }`}
                            >
                              {pnl !== undefined ? `${pnl >= 0 ? "+" : "-"}₹${Math.abs(pnl).toFixed(2)}` : "No trade"}
                            </div>
                          </div>
                          <div
                            className={`absolute ${nearRightEdge ? "right-2" : "left-1/2 -translate-x-1/2"
                              } ${showBelow ? "-top-1" : "-bottom-1"
                              } w-2 h-2 ${showBelow ? "rotate-45" : "-rotate-45"} ${isDark
                                ? `bg-slate-900 ${showBelow ? "border-l-2 border-t-2" : "border-r-2 border-b-2"} border-slate-700`
                                : `bg-white ${showBelow ? "border-l-2 border-t-2" : "border-r-2 border-b-2"} border-slate-300`
                              }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ---------------- MOBILE GRID: visible only on small screens ----------------
                Each week is a narrow column (min-w) so the whole grid scrolls horizontally
                and the mobile month labels above (inside this scroller) move in sync. */}
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

                    const dateStr = date.toISOString().split("T")[0];
                    const pnl = dataMap.get(dateStr);
                    const colorClass = getColorClass(pnl);

                    // no mobile tooltip (avoid overlap); desktop tooltips remain unchanged
                    return (
                      <div
                        key={dayIndex}
                        className={`w-2.5 h-2.5 rounded-full ${colorClass} transition-all`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            {/* end mobile grid */}
          </div>
        </div>
      </div>

      {/* Legend (unchanged, minor spacing preserved) */}
      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs flex-wrap">
        <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Less</span>
        <div className={`w-3 h-3 rounded-sm ${isDark ? "bg-slate-800/40 border border-slate-700/30" : "bg-slate-100 border border-slate-200"}`} />
        <div className="w-3 h-3 rounded-sm bg-emerald-200" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <span className={`mx-0.5 text-slate-500`}>|</span>
        <div className="w-3 h-3 rounded-sm bg-red-200" />
        <div className="w-3 h-3 rounded-sm bg-red-400" />
        <div className="w-3 h-3 rounded-sm bg-red-600" />
        <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>More</span>
      </div>
    </div>
  );
}
