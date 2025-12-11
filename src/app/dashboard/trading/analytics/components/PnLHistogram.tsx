// src/app/dashboard/trading/analytics/components/PnLHistogram.tsx
"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, Settings } from "lucide-react";

interface Trade {
  pnl: number | null;
}

interface PnLHistogramProps {
  closedTrades: Trade[];
  isDark: boolean;
}

export default function PnLHistogram({ closedTrades, isDark }: PnLHistogramProps) {
  const [binCount, setBinCount] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  // Smart currency formatter - MOVE BEFORE useMemo
  const formatINR = (val: number): string => {
    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : '';

    if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toFixed(1)}L`; // Lakhs
    } else if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)}K`; // Thousands
    } else if (abs >= 100) {
      return `${sign}₹${Math.round(abs)}`; // Hundreds
    } else {
      return `${sign}₹${abs.toFixed(0)}`; // Small amounts
    }
  };

  const formatRange = (start: number, end: number): string => {
    return `${formatINR(start)} to ${formatINR(end)}`;
  };

  // Color coding based on range position - MOVE BEFORE useMemo
  const getBarColor = (rangeStart: number, rangeEnd: number) => {
    const midpoint = (rangeStart + rangeEnd) / 2;

    if (midpoint < -500) return '#dc2626'; // Deep red for big losses
    if (midpoint < -100) return '#ef4444'; // Red for medium losses
    if (midpoint < 0) return '#f87171';     // Light red for small losses
    if (midpoint < 100) return '#fbbf24';   // Orange for small wins
    if (midpoint < 500) return '#22c55e';   // Green for medium wins
    return '#10b981';                        // Deep green for big wins
  };

  // Calculate dynamic histogram with smart bin sizing
  const histogramData = useMemo(() => {
    if (!closedTrades || closedTrades.length === 0) return [];

    const pnlValues = closedTrades
      .map(t => t.pnl)
      .filter((pnl): pnl is number => pnl !== null && pnl !== undefined);

    if (pnlValues.length === 0) return [];

    const minPnl = Math.min(...pnlValues);
    const maxPnl = Math.max(...pnlValues);
    const range = maxPnl - minPnl;

    // Smart bin size calculation based on P&L magnitude
    let binSize: number;
    const avgMagnitude = range / binCount;

    if (avgMagnitude < 50) {
      binSize = Math.ceil(avgMagnitude / 10) * 10; // Round to 10s for small accounts
    } else if (avgMagnitude < 500) {
      binSize = Math.ceil(avgMagnitude / 50) * 50; // Round to 50s for medium accounts
    } else if (avgMagnitude < 5000) {
      binSize = Math.ceil(avgMagnitude / 100) * 100; // Round to 100s for large accounts
    } else {
      binSize = Math.ceil(avgMagnitude / 1000) * 1000; // Round to 1000s for huge accounts
    }

    // Ensure minimum bin size
    if (binSize === 0) binSize = 1;

    // Start bins from a clean rounded number
    const binStart = Math.floor(minPnl / binSize) * binSize;

    // Calculate actual number of bins needed
    const actualBinCount = Math.ceil((maxPnl - binStart) / binSize);

    // Generate bins
    const bins = [];
    for (let i = 0; i < actualBinCount; i++) {
      const rangeStart = binStart + (i * binSize);
      const rangeEnd = rangeStart + binSize;

      // Count trades in this bin
      const tradesInBin = pnlValues.filter(pnl =>
        pnl >= rangeStart && pnl < rangeEnd
      );

      const count = tradesInBin.length;
      const avgPnl = count > 0 ? tradesInBin.reduce((a, b) => a + b, 0) / count : 0;

      bins.push({
        range: formatRange(rangeStart, rangeEnd),
        count,
        rangeStart,
        rangeEnd,
        avgPnl
      });
    }

    return bins.filter(b => b.count > 0); // Only show bins with trades
  }, [closedTrades, binCount]); // formatRange and formatINR are stable, no need to add as dependencies

  const totalTrades = closedTrades?.length || 0;

  // Empty state
  if (!closedTrades || closedTrades.length === 0) {
    return (
      <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>P&L Distribution</h3>
        </div>
        <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <p>No distribution data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-lg`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>P&L Distribution</h3>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Trade outcomes by range
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalTrades}
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Trades
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            title="Adjust detail level"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`mb-6 p-4 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
          <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
            Detail Level: <span className="font-bold">{binCount}</span>
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={binCount}
            onChange={(e) => setBinCount(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500 ${isDark ? 'bg-slate-600' : 'bg-slate-200'
              }`}
          />
          <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
            <span>5 (Broad)</span>
            <span>20 (Detailed)</span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="104%">
          <BarChart data={histogramData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="range"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '10px' }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '11px' }}
              tickLine={false}
              label={{
                value: 'Trades',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '11px', fill: isDark ? '#94a3b8' : '#64748b' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '12px',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
              itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
              formatter={(value: number, name: string, props: any) => {
                const avg = props.payload.avgPnl;
                return [
                  `${value} trades${avg !== 0 ? ` • Avg: ${formatINR(avg)}` : ''}`,
                  'Count'
                ];
              }}
              cursor={{ fill: isDark ? '#1e293b50' : '#f1f5f950' }}
            />
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            >
              {histogramData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.rangeStart, entry.rangeEnd)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Info Footer */}
      <div className={`mt-4 pt-4 border-t text-xs text-center ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
        💡 Bins auto-scale: Small accounts get narrow ranges, large accounts get wider ranges
      </div>
    </div>
  );
}