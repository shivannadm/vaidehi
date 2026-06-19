// src/app/dashboard/trading/dashboard/components/CalendarHeatmap.tsx
"use client";

import { Calendar } from "lucide-react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";

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

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function CalendarHeatmap({ data, isDark }: CalendarHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const [cellSize, setCellSize] = useState(14);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Full FY: Apr 1 → Mar 31 (all 365 days, including future)
  const { fyDates, fyStart, fyEnd } = useMemo(() => {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const start = new Date(fyStartYear, 3, 1);
    const end = new Date(fyStartYear + 1, 2, 31);

    const dates: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return { fyDates: dates, fyStart: start, fyEnd: end };
  }, [today]);

  // Map date → pnl
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      const key = item.date.split("T")[0];
      map.set(key, (map.get(key) || 0) + item.pnl);
    });
    return map;
  }, [data]);

  // Build week columns — all 53 weeks of the full FY
  const { columns, monthPositions } = useMemo(() => {
    const cols: (Date | null)[][] = [];
    let cur: (Date | null)[] = [];

    // Pad start so first date lands on correct day-of-week
    const firstDow = fyDates[0]?.getDay() ?? 0;
    for (let i = 0; i < firstDow; i++) cur.push(null);

    const monthPos: { month: number; startCol: number }[] = [];

    fyDates.forEach((date) => {
      if (date.getDate() === 1) {
        monthPos.push({ month: date.getMonth(), startCol: cols.length });
      }
      cur.push(date);
      if (cur.length === 7) {
        cols.push([...cur]);
        cur = [];
      }
    });

    if (cur.length > 0) {
      while (cur.length < 7) cur.push(null);
      cols.push(cur);
    }

    const totalCols = cols.length;

    // Compute midpoint column for each month label
    const monthPositions = monthPos.map((mp, i) => {
      const nextStart = i + 1 < monthPos.length ? monthPos[i + 1].startCol : totalCols;
      const midCol = Math.round((mp.startCol + nextStart - 1) / 2);
      return { month: mp.month, midCol };
    });

    return { columns: cols, monthPositions };
  }, [fyDates]);

  // Color scales (inline hex — no Tailwind purge issues)
  const profitScale = ["#bbf7d0","#86efac","#4ade80","#22c55e","#16a34a","#15803d"];
  const lossScale   = ["#fee2e2","#fca5a5","#f87171","#ef4444","#dc2626","#b91c1c"];

  const maxProfit = useMemo(() => {
    const vals = Array.from(dataMap.values()).filter(v => v > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [dataMap]);

  const maxLoss = useMemo(() => {
    const vals = Array.from(dataMap.values()).filter(v => v < 0);
    return vals.length ? Math.abs(Math.min(...vals)) : 1;
  }, [dataMap]);

  const getColor = useCallback((pnl: number | undefined, isFuture: boolean) => {
    if (isFuture || pnl === undefined) return null; // null = show empty box
    if (pnl === 0) return isDark ? "#334155" : "#cbd5e1";
    if (pnl > 0) return profitScale[Math.min(5, Math.floor((pnl / maxProfit) * 5.99))];
    return lossScale[Math.min(5, Math.floor((Math.abs(pnl) / maxLoss) * 5.99))];
  }, [dataMap, isDark, maxProfit, maxLoss]);

  // Responsive: compute cell size to exactly fill container width
  useEffect(() => {
    const compute = () => {
      if (!wrapperRef.current) return;
      const W = wrapperRef.current.clientWidth;
      const DAY_COL = 20; // day label column width
      const GAP = 2;
      const n = columns.length;
      // solve: DAY_COL + n*size + (n-1)*GAP = W
      const size = Math.max(8, Math.floor((W - DAY_COL - GAP * (n - 1)) / n));
      setCellSize(size);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [columns.length]);

  const { totalPnL, profitDays, lossDays } = useMemo(() => {
    let total = 0, p = 0, l = 0;
    dataMap.forEach(v => { total += v; if (v > 0) p++; else if (v < 0) l++; });
    return { totalPnL: total, profitDays: p, lossDays: l };
  }, [dataMap]);

  const handleEnter = useCallback((displayDate: string, pnl: number | undefined, isFuture: boolean, e: React.MouseEvent) => {
    if (isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({ displayDate, pnl, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const emptyBorder = isDark ? "#1e3a52" : "#cbd5e1";
  const emptyBg     = isDark ? "#0f1e2e" : "#f8fafc";
  const GAP = 2;
  const DAY_COL = 20;

  return (
    <div className={`rounded-2xl p-4 md:p-6 border shadow-lg ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Trading Calendar</h3>
          </div>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Financial Year Activity (12 Months)</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {totalPnL >= 0 ? "+" : "-"}₹{Math.abs(totalPnL).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <span className="text-emerald-500 font-semibold">{profitDays}P</span>
            {" / "}
            <span className="text-red-500 font-semibold">{lossDays}L</span>
            {" days traded"}
          </div>
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div ref={wrapperRef} style={{ width: "100%", overflowX: "auto", overflowY: "visible" }}>
        <div style={{ width: "100%", minWidth: `${DAY_COL + columns.length * (cellSize + GAP)}px` }}>

          {/* Month labels — centered over each month's column span */}
          <div style={{ position: "relative", height: "18px", paddingLeft: `${DAY_COL}px`, marginBottom: "4px" }}>
            {monthPositions.map((mp, i) => {
              // left offset = DAY_COL + midCol * (cellSize + GAP) + cellSize/2
              const leftPx = mp.midCol * (cellSize + GAP) + cellSize / 2;
              return (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${DAY_COL + leftPx}px`,
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: isDark ? "#94a3b8" : "#475569",
                    whiteSpace: "nowrap",
                    lineHeight: "18px",
                  }}
                >
                  {MONTH_NAMES[mp.month]}
                </span>
              );
            })}
          </div>

          {/* Day labels + grid */}
          <div style={{ display: "flex", width: "100%" }}>

            {/* Day-of-week labels: show all 7 */}
            <div style={{ width: `${DAY_COL}px`, flexShrink: 0, display: "flex", flexDirection: "column", gap: `${GAP}px` }}>
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{
                    height: `${cellSize}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "4px",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: isDark ? "#475569" : "#94a3b8",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns — flex:1 so they fill all remaining width */}
            <div style={{ display: "flex", gap: `${GAP}px`, flex: 1, minWidth: 0 }}>
              {columns.map((col, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: `${GAP}px`, flex: 1, minWidth: 0 }}>
                  {col.map((date, di) => {
                    if (!date) {
                      // padding cell — invisible
                      return (
                        <div key={di} style={{ height: `${cellSize}px`, flexShrink: 0, borderRadius: "3px" }} />
                      );
                    }

                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    const isFuture = date > today;
                    const pnl = dataMap.get(dateStr);
                    const color = getColor(pnl, isFuture);
                    const displayDate = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

                    return (
                      <div
                        key={di}
                        title={isFuture ? "" : undefined}
                        style={{
                          height: `${cellSize}px`,
                          borderRadius: "3px",
                          flexShrink: 0,
                          cursor: isFuture ? "default" : "pointer",
                          backgroundColor: color ?? emptyBg,
                          border: color === null ? `1px solid ${emptyBorder}` : "none",
                          transition: "opacity 0.1s",
                          opacity: isFuture ? 0.25 : 1,
                        }}
                        onMouseEnter={(e) => handleEnter(displayDate, pnl, isFuture, e)}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tooltip ── */}
      {hoveredCell && (
        <div style={{ position: "fixed", left: `${hoveredCell.x}px`, top: `${hoveredCell.y - 12}px`, transform: "translate(-50%, -100%)", pointerEvents: "none", zIndex: 9999 }}>
          <div style={{
            padding: "8px 12px", borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            whiteSpace: "nowrap",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#94a3b8" : "#64748b", marginBottom: "4px" }}>
              {hoveredCell.displayDate}
            </div>
            <div style={{
              fontSize: "14px", fontWeight: 700,
              color: hoveredCell.pnl !== undefined && hoveredCell.pnl > 0 ? "#10b981"
                : hoveredCell.pnl !== undefined && hoveredCell.pnl < 0 ? "#ef4444"
                : isDark ? "#475569" : "#94a3b8",
            }}>
              {hoveredCell.pnl !== undefined
                ? `${hoveredCell.pnl >= 0 ? "+" : "-"}₹${Math.abs(hoveredCell.pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "No trade"}
            </div>
          </div>
          <div style={{
            position: "absolute", left: "50%", bottom: "-4px",
            transform: "translateX(-50%) rotate(45deg)",
            width: "8px", height: "8px",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            borderRight: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          }} />
        </div>
      )}

      {/* ── Footer: FY range + Legend ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "10px", color: isDark ? "#334155" : "#94a3b8" }}>
          Apr {fyStart.getFullYear()} — Mar {fyEnd.getFullYear()}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "10px", color: isDark ? "#475569" : "#94a3b8" }}>Less</span>
          {/* Empty */}
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: emptyBg, border: `1px solid ${emptyBorder}` }} />
          {/* Profit shades */}
          {["#86efac","#22c55e","#15803d"].map((c,i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: c }} />
          ))}
          <span style={{ fontSize: "10px", color: isDark ? "#334155" : "#cbd5e1", margin: "0 2px" }}>|</span>
          {/* Loss shades */}
          {["#fca5a5","#ef4444","#b91c1c"].map((c,i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: c }} />
          ))}
          <span style={{ fontSize: "10px", color: isDark ? "#475569" : "#94a3b8" }}>More</span>
        </div>
      </div>
    </div>
  );
}