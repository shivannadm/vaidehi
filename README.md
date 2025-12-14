# 📁 Vaidehi – Complete Project Structure


```txt
vaidehi/
├── .next/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── auth-code-error/page.tsx
│   │   │   ├── callback/route.ts
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (landing)/
│   │   │   ├── components/
│   │   │   │   ├── AnimatedBackground.tsx
│   │   │   │   ├── FinalCTA.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── HeroMockup.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── Pricing.tsx
│   │   │   │   └── TypeRotator.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── cron/daily-habit-check/route.ts
│   │   │   ├── zerodha/
│   │   │   └── auth/callback/route.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   │   ├── NotificationDropdown.tsx
│   │   │   │   │   ├── ProfileDropdown.tsx
│   │   │   │   │   ├── StreakCounter.tsx
│   │   │   │   │   └── TopHeader.tsx
│   │   │   │   ├── modals/
│   │   │   │   │   ├── ProfileModal.tsx
│   │   │   │   │   └── SettingsModal.tsx
│   │   │   │   ├── sidebar/Sidebar.tsx
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   ├── theme-script.tsx
│   │   │   │   └── TimerContext.tsx
│   │   │   └── layout.tsx
│   │   ├── routine/
│   │   │   ├── morning/components/MorningForm.tsx
│   │   │   ├── morning/hooks/useMorningRoutine.ts
│   │   │   ├── morning/page.tsx
│   │   │   ├── evening/components/EveningForm.tsx
│   │   │   ├── evening/hooks/useEveningRoutine.ts
│   │   │   ├── evening/page.tsx
│   │   │   ├── habits/components/
│   │   │   │   ├── AddHabitModal.tsx
│   │   │   │   ├── HabitCard.tsx
│   │   │   │   ├── HabitDetailsModal.tsx
│   │   │   │   ├── HabitInsightsModal.tsx
│   │   │   │   └── WeeklyProgress.tsx
│   │   │   ├── habits/hooks/useHabits.ts
│   │   │   ├── habits/page.tsx
│   │   │   ├── health/components/HealthForm.tsx
│   │   │   ├── health/hooks/useHealthTracking.ts
│   │   │   ├── health/page.tsx
│   │   │   ├── keynotes/components/NoteCard.tsx
│   │   │   ├── keynotes/components/NoteEditor.tsx
│   │   │   ├── keynotes/hooks/useKeyNotes.ts
│   │   │   ├── keynotes/page.tsx
│   │   │   ├── progress/components/
│   │   │   │   ├── HabitHeatmap.tsx
│   │   │   │   ├── HealthTrends.tsx
│   │   │   │   ├── InsightsPanel.tsx
│   │   │   │   ├── OverviewStats.tsx
│   │   │   │   ├── RoutineConsistency.tsx
│   │   │   │   ├── WeeklyActivityTrend.tsx
│   │   │   │   └── WeeklySummary.tsx
│   │   │   └── progress/page.tsx
│   │   ├── todo/
│   │   │   ├── daily-highlights/components/
│   │   │   │   ├── HighlightInput.tsx
│   │   │   │   ├── ReasonSelector.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── TomorrowCard.tsx
│   │   │   │   └── YesterdayCard.tsx
│   │   │   ├── daily-highlights/page.tsx
│   │   │   ├── notes/components/
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   ├── NoteCard.tsx
│   │   │   │   └── NoteEditor.tsx
│   │   │   ├── notes/hooks/useNotes.ts
│   │   │   ├── notes/page.tsx
│   │   │   ├── projects/components/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── MilestoneSection.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectDetailView.tsx
│   │   │   │   ├── ProjectEditor.tsx
│   │   │   │   ├── ProjectTaskList.tsx
│   │   │   │   └── TimelineView.tsx
│   │   │   ├── projects/hooks/
│   │   │   │   ├── useProjectProgress.ts
│   │   │   │   ├── useProjects.ts
│   │   │   │   └── useProjectTasks.ts
│   │   │   ├── projects/[id]/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── schedule/components/
│   │   │   │   ├── AddEventModal.tsx
│   │   │   │   ├── DayEventsList.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── ScheduleCalendar.tsx
│   │   │   │   └── UpcomingEvents.tsx
│   │   │   ├── schedule/hooks/
│   │   │   │   ├── useEventActions.ts
│   │   │   │   ├── useSchedule.ts
│   │   │   │   └── useScheduleNotifications.ts
│   │   │   ├── schedule/page.tsx
│   │   │   ├── tasks/components/
│   │   │   │   ├── AddTaskModal.tsx
│   │   │   │   ├── EditTaskModal.tsx
│   │   │   │   ├── TagManager.tsx
│   │   │   │   ├── TaskItem.tsx
│   │   │   │   └── Timeline.tsx
│   │   │   ├── tasks/hooks/useTaskTimer.ts
│   │   │   ├── tasks/page.tsx
│   │   │   ├── trends/components/
│   │   │   │   ├── FocusGoalCalendar.tsx
│   │   │   │   ├── FocusTimeChart.tsx
│   │   │   │   ├── PomodoroChart.tsx
│   │   │   │   ├── ProjectDistribution.tsx
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   └── TimeRangeSelector.tsx
│   │   │   ├── trends/hooks/
│   │   │   │   ├── useTrendsData.ts
│   │   │   │   └── useTrendsFilters.ts
│   │   │   └── trends/page.tsx
│   │   ├── trading/
│   │   │   ├── analytics/components/
│   │   │   │   ├── CumulativePnLChart.tsx
│   │   │   │   ├── PerformanceMetrics.tsx
│   │   │   │   ├── PnLHistogram.tsx
│   │   │   │   ├── RiskMetrics.tsx
│   │   │   │   ├── StrategyComparison.tsx
│   │   │   │   ├── TimeAnalysis.tsx
│   │   │   │   ├── TradeDistribution.tsx
│   │   │   │   └── WinRateTrend.tsx
│   │   │   ├── analytics/hooks/useAnalytics.ts
│   │   │   ├── analytics/page.tsx
│   │   │   ├── backtest/components/
│   │   │   │   ├── BacktestCard.tsx
│   │   │   │   ├── BacktestForm.tsx
│   │   │   │   └── BacktestResults.tsx
│   │   │   ├── backtest/hooks/useBacktest.ts
│   │   │   ├── backtest/page.tsx
│   │   │   ├── dashboard/components/
│   │   │   │   ├── CalendarHeatmap.tsx
│   │   │   │   ├── EquityCurve.tsx
│   │   │   │   ├── HeroStats.tsx
│   │   │   │   ├── MonthlyPnLChart.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   ├── TopStrategies.tsx
│   │   │   │   └── WinLossDonut.tsx
│   │   │   ├── dashboard/hooks/useDashboardData.ts
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── journal/components/
│   │   │   │   ├── AddTradeModal.tsx
│   │   │   │   ├── CloseTradeModal.tsx
│   │   │   │   ├── DailyTradeRow.tsx
│   │   │   │   ├── DayDetailView.tsx
│   │   │   │   ├── EditTradeModal.tsx
│   │   │   │   ├── InsightsView.tsx
│   │   │   │   ├── MiniCalendar.tsx
│   │   │   │   ├── NetPnlCard.tsx
│   │   │   │   ├── TradeCalendar.tsx
│   │   │   │   ├── TradeCard.tsx
│   │   │   │   ├── TradeDetails.tsx
│   │   │   │   ├── TradeFilters.tsx
│   │   │   │   ├── TradeListItem.tsx
│   │   │   │   ├── TradeRow.tsx
│   │   │   │   └── WinLossChart.tsx
│   │   │   ├── journal/hooks/useTrades.ts
│   │   │   ├── journal/page.tsx
│   │   │   ├── quick-notes/components/
│   │   │   │   ├── AddNoteModal.tsx
│   │   │   │   ├── NoteCard.tsx
│   │   │   │   └── NoteFilters.tsx
│   │   │   ├── quick-notes/hooks/useQuickNotes.ts
│   │   │   └── quick-notes/page.tsx
│   │   ├── rules/components/
│   │   │   ├── AddRuleModal.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── EditRuleModal.tsx
│   │   │   ├── RuleCard.tsx
│   │   │   ├── hooks/useRules.ts
│   │   │   └── page.tsx
│   │   ├── strategies/components/
│   │   │   ├── AddStrategyModal.tsx
│   │   │   ├── EditStrategyModal.tsx
│   │   │   ├── StrategyCard.tsx
│   │   │   ├── StrategyDetails.tsx
│   │   │   ├── StrategyFilters.tsx
│   │   │   ├── hooks/useStrategies.ts
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── middleware.ts
│   │   │   ├── helpers.ts
│   │   │   ├── habits-helpers.ts
│   │   │   ├── evening-helpers.ts
│   │   │   ├── health-helpers.ts
│   │   │   ├── keynotes-helpers.ts
│   │   │   ├── highlights-helpers.ts
│   │   │   ├── progress-helpers.ts
│   │   │   ├── project-helpers.ts
│   │   │   ├── routine-helpers.ts
│   │   │   ├── schedule-helpers.ts
│   │   │   ├── task-helpers.ts
│   │   │   ├── trading-helpers.ts
│   │   │   └── trends-helpers.ts
│   │   ├── utils/
│   │   │   ├── exportUtils.ts
│   │   │   ├── progressExportUtils.ts
│   │   │   ├── tradingDashboardUtils.ts
│   │   │   └── tradingExportUtils.ts
│   │   └── metrics.ts
│   └── types/
│       ├── database.ts
│       └── dom-to-image-more.d.ts
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

