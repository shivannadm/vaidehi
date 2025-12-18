// src/app/(landing)/pnl-report/components/MetricComponents.tsx
'use client';

import React from 'react';
import type { AdvancedMetrics } from '../types/analytics.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

// Hero Stats Grid
interface HeroStatsGridProps {
  metrics: AdvancedMetrics;
}

export function HeroStatsGrid({ metrics }: HeroStatsGridProps) {
  const stats = [
    {
      label: 'Total Net P&L',
      value: formatCurrency(metrics.totalNetPnL),
      subtext: `Gross: ${formatCurrency(metrics.totalGrossPnL)}`,
      color: metrics.totalNetPnL >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: metrics.totalNetPnL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: metrics.totalNetPnL >= 0 ? 'border-green-500/30' : 'border-red-500/30',
      icon: metrics.totalNetPnL >= 0 ? '📈' : '📉',
    },
    {
      label: 'Win Rate',
      value: `${metrics.winRate}%`,
      subtext: `${metrics.winningTrades}W / ${metrics.losingTrades}L`,
      color: metrics.winRate >= 50 ? 'text-green-500' : 'text-orange-500',
      bgColor: metrics.winRate >= 50 ? 'bg-green-500/10' : 'bg-orange-500/10',
      borderColor: metrics.winRate >= 50 ? 'border-green-500/30' : 'border-orange-500/30',
      icon: '🎯',
    },
    {
      label: 'Profit Factor',
      value: metrics.profitFactor.toFixed(2),
      subtext: metrics.profitFactor > 1 ? 'Profitable' : 'Unprofitable',
      color: metrics.profitFactor > 1 ? 'text-green-500' : 'text-red-500',
      bgColor: metrics.profitFactor > 1 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: metrics.profitFactor > 1 ? 'border-green-500/30' : 'border-red-500/30',
      icon: '💰',
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpeRatio.toFixed(2),
      subtext: getRatioLabel(metrics.sharpeRatio),
      color: metrics.sharpeRatio > 1 ? 'text-blue-500' : 'text-gray-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      icon: '📊',
    },
    {
      label: 'Max Drawdown',
      value: formatCurrency(metrics.maxDrawdown),
      subtext: `${metrics.maxDrawdownPercent.toFixed(1)}%`,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: '⚠️',
    },
    {
      label: 'Expectancy',
      value: formatCurrency(metrics.expectancy),
      subtext: 'Per Trade',
      color: metrics.expectancy >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: metrics.expectancy >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: metrics.expectancy >= 0 ? 'border-green-500/30' : 'border-red-500/30',
      icon: '🔮',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-transform`}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className={`text-3xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <p className="text-slate-500 text-xs">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}

// Risk Metrics Card
export function RiskMetricsCard({ metrics }: { metrics: AdvancedMetrics }) {
  const riskMetrics = [
    { label: 'Sharpe Ratio', value: metrics.sharpeRatio.toFixed(2), subtext: getRatioLabel(metrics.sharpeRatio) },
    { label: 'Sortino Ratio', value: metrics.sortinoRatio.toFixed(2), subtext: getRatioLabel(metrics.sortinoRatio) },
    { label: 'Calmar Ratio', value: metrics.calmarRatio.toFixed(2), subtext: 'Return/Max DD' },
    { label: 'Omega Ratio', value: metrics.omegaRatio.toFixed(2), subtext: 'Gain/Loss Ratio' },
    { label: 'Recovery Factor', value: metrics.recoveryFactor.toFixed(2), subtext: 'Recovery Strength' },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>⚡</span> Risk-Adjusted Returns
      </h3>
      <div className="space-y-3">
        {riskMetrics.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-slate-300">{item.label}</div>
              <div className="text-xs text-slate-500">{item.subtext}</div>
            </div>
            <div className="text-xl font-bold text-indigo-400">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Drawdown Analysis Card
export function DrawdownCard({ metrics }: { metrics: AdvancedMetrics }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>📉</span> Drawdown Analysis
      </h3>
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Max Drawdown</div>
          <div className="text-3xl font-bold text-red-500">
            {formatCurrency(metrics.maxDrawdown)}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {metrics.maxDrawdownPercent.toFixed(2)}% of peak
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Duration: {metrics.maxDrawdownDuration} days
          </div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Current Drawdown</div>
          <div className="text-2xl font-bold text-orange-500">
            {formatCurrency(metrics.currentDrawdown)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Win/Loss Analysis Card
export function WinLossCard({ metrics }: { metrics: AdvancedMetrics }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>💹</span> Win/Loss Analysis
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">Avg Win</div>
          <div className="text-xl font-bold text-green-500">
            {formatCurrency(metrics.avgWin)}
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">Avg Loss</div>
          <div className="text-xl font-bold text-red-500">
            {formatCurrency(metrics.avgLoss)}
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">Largest Win</div>
          <div className="text-lg font-bold text-green-500">
            {formatCurrency(metrics.largestWin)}
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">Largest Loss</div>
          <div className="text-lg font-bold text-red-500">
            {formatCurrency(metrics.largestLoss)}
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <div className="text-sm text-slate-400 mb-1">Payoff Ratio</div>
        <div className="text-2xl font-bold text-indigo-400">
          {metrics.payoffRatio.toFixed(2)}:1
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {metrics.payoffRatio > 1 ? 'Wins larger than losses' : 'Losses larger than wins'}
        </div>
      </div>
    </div>
  );
}

// Streak Analysis Card
export function StreakCard({ metrics }: { metrics: AdvancedMetrics }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🔥</span> Streak Analysis
      </h3>
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${
          metrics.currentStreak > 0 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className="text-sm text-slate-400 mb-1">Current Streak</div>
          <div className={`text-3xl font-bold ${
            metrics.currentStreak > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {Math.abs(metrics.currentStreak)} {metrics.currentStreak > 0 ? 'Wins' : 'Losses'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Longest Win</div>
            <div className="text-2xl font-bold text-green-500">{metrics.longestWinStreak}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Longest Loss</div>
            <div className="text-2xl font-bold text-red-500">{metrics.longestLossStreak}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Best/Worst Days Card
export function BestWorstCard({ metrics }: { metrics: AdvancedMetrics }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>📅</span> Best & Worst Days
      </h3>
      <div className="space-y-3">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Best Day</div>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(metrics.bestDay)}
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Worst Day</div>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(metrics.worstDay)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Trade Duration Card
export function TradeDurationCard({ metrics }: { metrics: AdvancedMetrics }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>⏱️</span> Trade Duration & Patterns
      </h3>
      <div className="space-y-4">
        <div className="p-4 bg-slate-900/50 rounded-lg">
          <div className="text-sm text-slate-400 mb-1">Avg Trade Duration</div>
          <div className="text-2xl font-bold text-indigo-400">
            {metrics.avgTradeDuration.toFixed(1)} days
          </div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-lg">
          <div className="text-sm text-slate-400 mb-1">Longest Trade</div>
          <div className="text-2xl font-bold text-indigo-400">
            {metrics.longestTrade} days
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Intraday Trades</div>
          <div className="text-2xl font-bold text-purple-400">
            {metrics.intradayPercent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// Kelly Criterion Card
export function KellyCard({ metrics }: { metrics: AdvancedMetrics }) {
  const recommendation = getKellyRecommendation(metrics.kellyCriterion / 100);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🎲</span> Kelly Criterion
      </h3>
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
        <div className="text-sm text-slate-400 mb-2">Optimal Position Size</div>
        <div className="text-4xl font-bold text-indigo-400 mb-3">{metrics.kellyCriterion.toFixed(2)}%</div>
        <div className="text-sm text-slate-300 bg-slate-900/50 rounded p-3">
          <div className="font-semibold mb-1">Recommendation:</div>
          <div className="text-xs text-slate-400">{recommendation}</div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getRatioLabel(value: number): string {
  if (value > 2) return 'Excellent';
  if (value > 1) return 'Good';
  if (value > 0) return 'Fair';
  return 'Poor';
}

function getKellyRecommendation(kelly: number): string {
  if (kelly <= 0) return 'Do not trade this strategy. Negative edge.';
  if (kelly > 0.25) return 'Risk very high. Consider max 25% of Kelly or use Half-Kelly.';
  if (kelly > 0.15) return 'Moderate risk. Consider using Half-Kelly (50% of this value).';
  return 'Conservative Kelly suggests this position size. Consider using Half-Kelly for safety.';
}