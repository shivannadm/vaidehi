// src/app/dashboard/todo/trends/hooks/useTrendsFilters.ts
"use client";

import { useState, useMemo } from "react";

export function useTrendsFilters() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: Date;

    switch (timeRange) {
      case 'daily':
        start = new Date(now);
        start.setDate(now.getDate() - 30); // Last 30 days
        break;
      case 'weekly':
        start = new Date(now);
        start.setDate(now.getDate() - 90); // Last ~13 weeks
        break;
      case 'monthly':
        start = new Date(now);
        start.setMonth(now.getMonth() - 12); // Last 12 months
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  }, [timeRange]);

  return {
    timeRange,
    setTimeRange,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    startDate,
    endDate,
  };
}