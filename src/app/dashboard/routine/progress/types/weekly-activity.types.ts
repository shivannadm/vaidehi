// src/app/dashboard/routine/progress/types/weekly-activity.types.ts

/**
 * Types for Weekly Activity Trend Component
 */

export interface DayActivity {
  date: string;
  dayName: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  healthCompleted: boolean;
  habitsCompleted: number;
  overallScore: number;
}

export interface WeeklyTrendData {
  day: string;
  morning: number;
  evening: number;
  health: number;
  habits: number;
  overall: number;
}

export interface TrendAnalysis {
  currentWeekAvg: number;
  trend: number;
  trendDirection: "up" | "down" | "stable";
  message: string;
}

// Helper function to calculate trend
export function calculateTrend(data: WeeklyTrendData[]): TrendAnalysis {
  const currentWeekAvg = Math.round(
    data.reduce((sum, d) => sum + d.overall, 0) / data.length
  );

  const firstHalf = data.slice(0, 3);
  const secondHalf = data.slice(4, 7);
  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.overall, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.overall, 0) / secondHalf.length;
  const trend = secondHalfAvg - firstHalfAvg;

  let trendDirection: "up" | "down" | "stable";
  let message: string;

  if (trend > 5) {
    trendDirection = "up";
    message = "You're getting stronger! Keep it up.";
  } else if (trend < -5) {
    trendDirection = "down";
    message = "Let's turn this around together.";
  } else {
    trendDirection = "stable";
    message = "Consistency is key. Stay steady!";
  }

  return {
    currentWeekAvg,
    trend,
    trendDirection,
    message,
  };
}