// src/app/dashboard/trading/analytics/components/PerformanceMetrics.tsx
"use client";

import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Zap, Activity, Shield } from "lucide-react";

interface PerformanceMetricsProps {
  avgWin: number;
  avgLoss: number;
  winLossRatio: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  maxDrawdown: number;
  recoveryFactor: number;
  largestWin: number;
  largestLoss: number;
  avgRiskPerTrade: number;
  isDark: boolean;
}

export default function PerformanceMetrics({
  avgWin,
  avgLoss,
  winLossRatio,
  maxConsecutiveWins,
  maxConsecutiveLosses,
  maxDrawdown,
  recoveryFactor,
  largestWin,
  largestLoss,
  avgRiskPerTrade,
  isDark,
}: PerformanceMetricsProps) {
  const metrics = [
    {
      label: "Avg Win",
      value: `$${avgWin.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "emerald",
    },
    {
      label: "Avg Loss",
      value: `$${avgLoss.toLocaleString()}`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: "red",
    },
    {
      label: "Win/Loss Ratio",
      value: winLossRatio.toFixed(2),
      icon: <Target className="w-5 h-5" />,
      color: winLossRatio >= 2 ? "emerald" : winLossRatio >= 1 ? "blue" : "orange",
    },
    {
      label: "Max Consecutive Wins",
      value: maxConsecutiveWins,
      icon: <Award className="w-5 h-5" />,
      color: "purple",
    },
    {
      label: "Max Consecutive Losses",
      value: maxConsecutiveLosses,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "orange",
    },
    {
      label: "Max Drawdown",
      value: `$${maxDrawdown.toLocaleString()}`,
      icon: <Activity className="w-5 h-5" />,
      color: "red",
    },
    {
      label: "Recovery Factor",
      value: recoveryFactor.toFixed(2),
      icon: <Zap className="w-5 h-5" />,
      color: recoveryFactor >= 2 ? "emerald" : recoveryFactor >= 1 ? "blue" : "orange",
    },
    {
      label: "Largest Win",
      value: `$${largestWin.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "emerald",
    },
    {
      label: "Largest Loss",
      value: `$${Math.abs(largestLoss).toLocaleString()}`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: "red",
    },
    {
      label: "Avg Risk/Trade",
      value: avgRiskPerTrade > 0 ? `$${avgRiskPerTrade.toLocaleString()}` : "N/A",
      icon: <Shield className="w-5 h-5" />,
      color: "blue",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      emerald: {
        bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
        text: isDark ? "text-emerald-400" : "text-emerald-600",
        icon: isDark ? "text-emerald-400" : "text-emerald-600",
      },
      red: {
        bg: isDark ? "bg-red-500/10" : "bg-red-50",
        text: isDark ? "text-red-400" : "text-red-600",
        icon: isDark ? "text-red-400" : "text-red-600",
      },
      blue: {
        bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
        text: isDark ? "text-blue-400" : "text-blue-600",
        icon: isDark ? "text-blue-400" : "text-blue-600",
      },
      orange: {
        bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
        text: isDark ? "text-orange-400" : "text-orange-600",
        icon: isDark ? "text-orange-400" : "text-orange-600",
      },
      purple: {
        bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
        text: isDark ? "text-purple-400" : "text-purple-600",
        icon: isDark ? "text-purple-400" : "text-purple-600",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        
        return (
          <div
            key={index}
            className={`rounded-xl p-4 border transition-all hover:scale-105 ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            } shadow-lg`}
          >
            <div className={`inline-flex p-2 rounded-lg mb-3 ${colors.bg}`}>
              <div className={colors.icon}>{metric.icon}</div>
            </div>
            
            <div className={`text-2xl font-bold mb-1 ${colors.text}`}>
              {metric.value}
            </div>
            
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {metric.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}