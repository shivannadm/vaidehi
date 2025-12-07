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

// Indian currency formatter
function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const [intPart, decPart] = absAmount.toFixed(2).split('.');

  let formatted = '';
  let count = 0;

  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      formatted = ',' + formatted;
    }
    formatted = intPart[i] + formatted;
    count++;
  }

  return `${isNegative ? '-' : ''}₹${formatted}.${decPart}`;
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
      value: formatINR(avgWin),
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "emerald",
    },
    {
      label: "Avg Loss",
      value: formatINR(avgLoss),
      icon: <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "red",
    },
    {
      label: "Win/Loss Ratio",
      value: winLossRatio.toFixed(2),
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: winLossRatio >= 2 ? "emerald" : winLossRatio >= 1 ? "blue" : "orange",
    },
    {
      label: "Max Consecutive Wins",
      value: maxConsecutiveWins,
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "purple",
    },
    {
      label: "Max Consecutive Losses",
      value: maxConsecutiveLosses,
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "orange",
    },
    {
      label: "Max Drawdown",
      value: formatINR(maxDrawdown),
      icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "red",
    },
    {
      label: "Recovery Factor",
      value: recoveryFactor.toFixed(2),
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: recoveryFactor >= 2 ? "emerald" : recoveryFactor >= 1 ? "blue" : "orange",
    },
    {
      label: "Largest Win",
      value: formatINR(largestWin),
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "emerald",
    },
    {
      label: "Largest Loss",
      value: formatINR(Math.abs(largestLoss)),
      icon: <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "red",
    },
    {
      label: "Avg Risk/Trade",
      value: avgRiskPerTrade > 0 ? formatINR(avgRiskPerTrade) : "N/A",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        
        return (
          <div
            key={index}
            className={`rounded-xl p-3 sm:p-4 border transition-all hover:scale-105 ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            } shadow-lg`}
          >
            <div className={`inline-flex p-1.5 sm:p-2 rounded-lg mb-2 sm:mb-3 ${colors.bg}`}>
              <div className={colors.icon}>{metric.icon}</div>
            </div>
            
            <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 break-words ${colors.text}`}>
              {metric.value}
            </div>
            
            <div className={`text-xs leading-tight ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {metric.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}