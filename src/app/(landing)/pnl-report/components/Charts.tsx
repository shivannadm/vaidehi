// src/app/(landing)/pnl-report/components/Charts.tsx
'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { Trade, AdvancedMetrics } from '../types/analytics.types';

interface ChartsProps {
  trades: Trade[];
  metrics: AdvancedMetrics;
}

export function EquityCurveChart({ trades }: { trades: Trade[] }) {
  // Build equity curve from trades
  const equityCurve = [];
  let cumulative = 0;
  let peak = 0;

  trades.forEach((trade, index) => {
    cumulative += trade.net_pnl;
    if (cumulative > peak) peak = cumulative;
    const drawdown = peak - cumulative;

    equityCurve.push({
      index: index + 1,
      equity: Math.round(cumulative),
      drawdown: Math.round(drawdown),
      peak: Math.round(peak),
    });
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">📈 Equity Curve & Drawdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={equityCurve}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="index" 
            stroke="#94a3b8"
            label={{ value: 'Trade Number', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
            labelFormatter={(label) => `Trade #${label}`}
          />
          <Legend 
            wrapperStyle={{ color: '#94a3b8' }}
          />
          <Area 
            type="monotone" 
            dataKey="equity" 
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#colorEquity)" 
            name="Cumulative P&L"
          />
          <Area 
            type="monotone" 
            dataKey="drawdown" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorDrawdown)" 
            name="Drawdown"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WinLossPieChart({ metrics }: { metrics: AdvancedMetrics }) {
  const data = [
    { name: 'Winning Trades', value: metrics.winningTrades, color: '#10b981' },
    { name: 'Losing Trades', value: metrics.losingTrades, color: '#ef4444' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">🎯 Win/Loss Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{metrics.winRate.toFixed(1)}%</p>
        </div>
        <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Loss Rate</p>
          <p className="text-2xl font-bold text-red-400">{(100 - metrics.winRate).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}

export function MonthlyPnLBarChart({ trades }: { trades: Trade[] }) {
  // Aggregate by month
  const monthlyData = new Map<string, { gross: number; net: number; trades: number }>();

  trades.forEach(trade => {
    const month = trade.trade_date ? trade.trade_date.substring(0, 7) : '2024-01';
    const existing = monthlyData.get(month) || { gross: 0, net: 0, trades: 0 };
    existing.gross += trade.gross_pnl;
    existing.net += trade.net_pnl;
    existing.trades += 1;
    monthlyData.set(month, existing);
  });

  const chartData = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      'Gross P&L': Math.round(data.gross),
      'Net P&L': Math.round(data.net),
      trades: data.trades,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">📊 Monthly P&L Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8"
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return monthNames[parseInt(month) - 1];
            }}
          />
          <YAxis 
            stroke="#94a3b8"
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
          <Bar dataKey="Gross P&L" fill="#8b5cf6" />
          <Bar dataKey="Net P&L" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TradeDistributionChart({ trades }: { trades: Trade[] }) {
  // Create P&L distribution buckets
  const buckets = [
    { range: '< -5000', min: -Infinity, max: -5000, count: 0, color: '#dc2626' },
    { range: '-5000 to -2000', min: -5000, max: -2000, count: 0, color: '#ef4444' },
    { range: '-2000 to -500', min: -2000, max: -500, count: 0, color: '#f87171' },
    { range: '-500 to 0', min: -500, max: 0, count: 0, color: '#fca5a5' },
    { range: '0 to 500', min: 0, max: 500, count: 0, color: '#86efac' },
    { range: '500 to 2000', min: 500, max: 2000, count: 0, color: '#4ade80' },
    { range: '2000 to 5000', min: 2000, max: 5000, count: 0, color: '#22c55e' },
    { range: '> 5000', min: 5000, max: Infinity, count: 0, color: '#16a34a' },
  ];

  trades.forEach(trade => {
    const pnl = trade.net_pnl;
    for (const bucket of buckets) {
      if (pnl >= bucket.min && pnl < bucket.max) {
        bucket.count++;
        break;
      }
    }
  });

  const chartData = buckets.map(b => ({
    range: b.range,
    count: b.count,
    fill: b.color,
  }));

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">📉 Trade P&L Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="range" 
            stroke="#94a3b8"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            stroke="#94a3b8"
            label={{ value: 'Number of Trades', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`${value} trades`, 'Count']}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopWinnersLosersTable({ trades }: { trades: Trade[] }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);

  // Get top 5 winners and losers
  const sortedTrades = [...trades].sort((a, b) => b.net_pnl - a.net_pnl);
  const topWinners = sortedTrades.slice(0, 5);
  const topLosers = sortedTrades.slice(-5).reverse();

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">🏆 Top Winners & Losers</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Winners */}
        <div>
          <h4 className="text-sm font-semibold text-emerald-400 mb-3">Top 5 Winners</h4>
          <div className="space-y-2">
            {topWinners.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div>
                  <p className="font-semibold text-sm text-white">{trade.symbol}</p>
                  <p className="text-xs text-slate-400">Qty: {trade.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{formatCurrency(trade.net_pnl)}</p>
                  <p className="text-xs text-slate-400">
                    {((trade.net_pnl / trade.buy_value) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h4 className="text-sm font-semibold text-red-400 mb-3">Top 5 Losers</h4>
          <div className="space-y-2">
            {topLosers.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <p className="font-semibold text-sm text-white">{trade.symbol}</p>
                  <p className="text-xs text-slate-400">Qty: {trade.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-400">{formatCurrency(trade.net_pnl)}</p>
                  <p className="text-xs text-slate-400">
                    {((trade.net_pnl / trade.buy_value) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SymbolPerformanceTable({ trades }: { trades: Trade[] }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);

  // Aggregate by symbol
  const symbolData = new Map<string, { 
    count: number; 
    totalPnL: number; 
    wins: number; 
    losses: number;
    avgPnL: number;
  }>();

  trades.forEach(trade => {
    const existing = symbolData.get(trade.symbol) || { 
      count: 0, 
      totalPnL: 0, 
      wins: 0, 
      losses: 0,
      avgPnL: 0
    };
    existing.count += 1;
    existing.totalPnL += trade.net_pnl;
    if (trade.net_pnl > 0) existing.wins++;
    else existing.losses++;
    symbolData.set(trade.symbol, existing);
  });

  // Calculate averages and sort
  const symbolArray = Array.from(symbolData.entries())
    .map(([symbol, data]) => ({
      symbol,
      ...data,
      avgPnL: data.totalPnL / data.count,
      winRate: (data.wins / data.count) * 100,
    }))
    .sort((a, b) => b.totalPnL - a.totalPnL)
    .slice(0, 10);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">📋 Top 10 Symbols by P&L</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400">Symbol</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Trades</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Total P&L</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Avg P&L</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {symbolArray.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition">
                <td className="py-3 px-4 font-semibold text-sm">{item.symbol}</td>
                <td className="py-3 px-4 text-right text-sm text-slate-300">{item.count}</td>
                <td className={`py-3 px-4 text-right text-sm font-semibold ${
                  item.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatCurrency(item.totalPnL)}
                </td>
                <td className={`py-3 px-4 text-right text-sm ${
                  item.avgPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatCurrency(item.avgPnL)}
                </td>
                <td className="py-3 px-4 text-right text-sm">
                  <span className={`px-2 py-1 rounded ${
                    item.winRate >= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.winRate.toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TradeHeatmap({ trades }: { trades: Trade[] }) {
  // This is a simplified heatmap showing winning/losing days
  const dailyData = new Map<string, number>();

  trades.forEach(trade => {
    const date = trade.trade_date || '2024-01-01';
    dailyData.set(date, (dailyData.get(date) || 0) + trade.net_pnl);
  });

  const heatmapData = Array.from(dailyData.entries())
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // Last 30 trading days

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">🔥 Daily P&L Heatmap (Last 30 Days)</h3>
      
      <div className="grid grid-cols-10 gap-2">
        {heatmapData.map((day, idx) => {
          const intensity = Math.min(Math.abs(day.pnl) / 5000, 1);
          const bgColor = day.pnl >= 0 
            ? `rgba(16, 185, 129, ${intensity})` 
            : `rgba(239, 68, 68, ${intensity})`;

          return (
            <div
              key={idx}
              className="aspect-square rounded flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition group relative"
              style={{ backgroundColor: bgColor }}
              title={`${day.date}: ${new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR' 
              }).format(day.pnl)}`}
            >
              <span className="opacity-0 group-hover:opacity-100">
                {day.date.split('-')[2]}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span>Losses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500"></div>
          <span>Wins</span>
        </div>
      </div>
    </div>
  );
}