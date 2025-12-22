// src/app/(landing)/pnl-report/components/AnalyticsDashboard.tsx
'use client';

import type { AdvancedMetrics } from '../types/analytics.types';

interface AnalyticsDashboardProps {
  metrics: AdvancedMetrics;
  onReset: () => void;
}

export default function AnalyticsDashboard({ metrics, onReset }: AnalyticsDashboardProps) {
  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(n);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
              <p className="text-xs text-slate-400">{metrics.totalTrades} Trades Analyzed</p>
            </div>
          </div>
          <button 
            onClick={onReset} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
          >
            New Analysis
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Metrics - 4 Main KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Total Net P&L" 
            value={fmt(metrics.totalNetPnL)} 
            sub={`Gross: ${fmt(metrics.totalGrossPnL)}`} 
            color={metrics.totalNetPnL >= 0 ? 'emerald' : 'red'} 
            icon={metrics.totalNetPnL >= 0 ? '📈' : '📉'} 
          />
          <MetricCard 
            label="Win Rate" 
            value={`${metrics.winRate}%`} 
            sub={`${metrics.winningTrades}W / ${metrics.losingTrades}L`} 
            color="blue" 
            icon="🎯" 
          />
          <MetricCard 
            label="Profit Factor" 
            value={metrics.profitFactor.toFixed(2)} 
            sub={metrics.profitFactor > 1 ? 'Profitable ✓' : 'Unprofitable ✗'} 
            color="purple" 
            icon="💰" 
          />
          <MetricCard 
            label="Sharpe Ratio" 
            value={metrics.sharpeRatio.toFixed(2)} 
            sub={metrics.sharpeRatio > 2 ? 'Excellent' : metrics.sharpeRatio > 1 ? 'Good' : 'Fair'} 
            color="indigo" 
            icon="📊" 
          />
        </div>

        {/* Risk-Adjusted Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk-Adjusted Returns */}
          <Card title="⚡ Risk-Adjusted Returns">
            <MetricRow label="Sharpe Ratio" value={metrics.sharpeRatio.toFixed(2)} />
            <MetricRow label="Sortino Ratio" value={metrics.sortinoRatio.toFixed(2)} />
            <MetricRow label="Calmar Ratio" value={metrics.calmarRatio.toFixed(2)} />
            <MetricRow label="Omega Ratio" value={metrics.omegaRatio.toFixed(2)} />
            <MetricRow label="Recovery Factor" value={metrics.recoveryFactor.toFixed(2)} />
          </Card>

          {/* Drawdown Analysis */}
          <Card title="📉 Drawdown Analysis">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-3">
              <p className="text-xs text-slate-400 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-400">{fmt(metrics.maxDrawdown)}</p>
              <p className="text-xs text-slate-500 mt-1">{metrics.maxDrawdownPercent.toFixed(2)}% of peak</p>
              <p className="text-xs text-slate-500">Duration: {metrics.maxDrawdownDuration} days</p>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Current Drawdown</p>
              <p className="text-xl font-bold text-orange-400">{fmt(metrics.currentDrawdown)}</p>
            </div>
          </Card>

          {/* Win/Loss Analysis */}
          <Card title="💹 Win/Loss Analysis">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Avg Win</p>
                <p className="text-lg font-bold text-emerald-400">{fmt(metrics.avgWin)}</p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Avg Loss</p>
                <p className="text-lg font-bold text-red-400">{fmt(metrics.avgLoss)}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Best</p>
                <p className="text-sm font-bold text-emerald-400">{fmt(metrics.largestWin)}</p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Worst</p>
                <p className="text-sm font-bold text-red-400">{fmt(metrics.largestLoss)}</p>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Payoff Ratio</p>
              <p className="text-xl font-bold text-indigo-400">{metrics.payoffRatio.toFixed(2)}:1</p>
            </div>
          </Card>
        </div>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak Analysis */}
          <Card title="🔥 Streak Analysis">
            <div className={`p-4 rounded-lg mb-3 ${
              metrics.currentStreak > 0 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <p className="text-xs text-slate-400 mb-1">Current Streak</p>
              <p className={`text-2xl font-bold ${
                metrics.currentStreak > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {Math.abs(metrics.currentStreak)} {metrics.currentStreak > 0 ? 'Wins' : 'Losses'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Longest Win</p>
                <p className="text-xl font-bold text-emerald-400">{metrics.longestWinStreak}</p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Longest Loss</p>
                <p className="text-xl font-bold text-red-400">{metrics.longestLossStreak}</p>
              </div>
            </div>
          </Card>

          {/* Best & Worst */}
          <Card title="📅 Best & Worst Days">
            <div className="space-y-3">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Best Day</p>
                <p className="text-xl font-bold text-emerald-400">{fmt(metrics.bestDay)}</p>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Worst Day</p>
                <p className="text-xl font-bold text-red-400">{fmt(metrics.worstDay)}</p>
              </div>
            </div>
          </Card>

          {/* Duration & Kelly */}
          <Card title="⏱️ Duration & Kelly">
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Avg Duration</p>
                <p className="text-xl font-bold text-indigo-400">{metrics.avgTradeDuration.toFixed(1)} days</p>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Intraday %</p>
                <p className="text-xl font-bold text-purple-400">{metrics.intradayPercent.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Kelly Criterion</p>
                <p className="text-xl font-bold text-indigo-400">{metrics.kellyCriterion.toFixed(2)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card title="📋 Performance Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryBox label="Total Trades" value={metrics.totalTrades.toString()} />
            <SummaryBox label="Charges" value={fmt(metrics.totalCharges)} color="text-orange-400" />
            <SummaryBox label="Expectancy" value={fmt(metrics.expectancy)} color="text-indigo-400" />
            <SummaryBox 
              label="Date Range" 
              value={`${metrics.startDate || 'N/A'} → ${metrics.endDate || 'N/A'}`} 
              small 
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <button 
            onClick={onReset} 
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition"
          >
            Analyze Another File
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium transition shadow-lg">
            Export Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, color, icon }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30',
    red: 'bg-red-500/10 border-red-500/30',
    blue: 'bg-blue-500/10 border-blue-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    indigo: 'bg-indigo-500/10 border-indigo-500/30',
  };
  const textColors: any = {
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400',
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-6 hover:scale-[1.02] transition-transform`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold mb-1 ${textColors[color]}`}>{value}</div>
      <p className="text-slate-500 text-xs">{sub}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-lg font-bold text-indigo-400">{value}</span>
    </div>
  );
}

function SummaryBox({ label, value, color = 'text-white', small = false }: any) {
  return (
    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`${small ? 'text-xs' : 'text-2xl'} font-bold ${color}`}>{value}</p>
    </div>
  );
}