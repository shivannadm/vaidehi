## in progress
## Project file structure
```
vaidehi/
├── .gitignore
├── README.md
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── images/
│   │   ├── l3.png
│   │   └── testimony/
│   │       ├── person1.jpg
│   │       ├── person2.jpg
│   │       ├── person3.jpg
│   │       └── person4.jpg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
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
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   ├── TimerContext.tsx
│   │   │   │   ├── theme-script.tsx
│   │   │   │   ├── header/
│   │   │   │   │   ├── NotificationDropdown.tsx
│   │   │   │   │   ├── ProfileDropdown.tsx
│   │   │   │   │   ├── StreakCounter.tsx
│   │   │   │   │   └── TopHeader.tsx
│   │   │   │   ├── modals/
│   │   │   │   │   ├── ProfileModal.tsx
│   │   │   │   │   └── SettingsModal.tsx
│   │   │   │   └── sidebar/
│   │   │   │       └── Sidebar.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── routine/
│   │   │   │   ├── evening/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   └── AddModal.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useEveningRoutine.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── habits/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── AddHabitModal.tsx
│   │   │   │   │   │   ├── HabitCard.tsx
│   │   │   │   │   │   └── WeeklyProgress.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useHabits.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── health/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   └── HealthForm.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useHealthTracking.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── keynotestests/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   └── NoteCard.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useKeyNotes.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── morning/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── HabitHeatmap.tsx
│   │   │   │   │   │   ├── HealthTrend.tsx
│   │   │   │   │   │   ├── InsightsPanel.tsx
│   │   │   │   │   │   ├── MonthlySummary.tsx
│   │   │   │   │   │   ├── OverviewStats.tsx
│   │   │   │   │   │   ├── RoutineConsistency.tsx
│   │   │   │   │   │   └── WeeklyActivityTrend.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useProgressData.ts
│   │   │   │   │   ├── types/
│   │   │   │   │   │   └── activity.types.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   └── progress/
│   │   │   │       ├── components/
│   │   │   │       │   ├── HabitHeatmap.tsx
│   │   │   │       │   ├── HealthTrend.tsx
│   │   │   │       │   ├── MonthlySummary.tsx
│   │   │   │       │   ├── OverviewStats.tsx
│   │   │   │       │   ├── RoutineConsistency.tsx
│   │   │   │       │   └── WeeklyActivityTrend.tsx
│   │   │   │       ├── hooks/
│   │   │   │       │   └── useWeeklyActivity.ts
│   │   │   │       ├── types/
│   │   │   │       │   └── activity.types.ts
│   │   │   │       └── page.tsx
│   │   │   └── todo/
│   │   │       ├── daily-highlights/
│   │   │       │   ├── components/
│   │   │       │   │   ├── HighlightInput.tsx
│   │   │       │   │   ├── ReasonSelector.tsx
│   │   │       │   │   ├── StatsCard.tsx
│   │   │       │   │   ├── TomorrowCard.tsx
│   │   │       │   │   └── YesterdayCard.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── notes/
│   │   │       │   ├── components/
│   │   │       │   │   ├── ColorPicker.tsx
│   │   │       │   │   ├── LabelManager.tsx
│   │   │       │   │   ├── NoteCard.tsx
│   │   │       │   │   ├── NoteEditor.tsx
│   │   │       │   │   ├── NoteGrid.tsx
│   │   │       │   │   └── SearchBar.tsx
│   │   │       │   ├── hooks/
│   │   │       │   │   └── useNotes.ts
│   │   │       │   └── page.tsx
│   │   │       ├── projects/
│   │   │       │   ├── [id]/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── components/
│   │   │       │   │   ├── KanbanBoard.tsx
│   │   │       │   │   ├── MilestoneSection.tsx
│   │   │       │   │   ├── ProgressBar.tsx
│   │   │       │   │   ├── ProjectCard.tsx
│   │   │       │   │   ├── ProjectDetailView.tsx
│   │   │       │   │   ├── ProjectEditor.tsx
│   │   │       │   │   ├── ProjectTaskList.tsx
│   │   │       │   │   └── TimelineView.tsx
│   │   │       │   ├── hooks/
│   │   │       │   │   ├── useProjectProgress.ts
│   │   │       │   │   ├── useProjectTasks.ts
│   │   │       │   │   └── useProjects.ts
│   │   │       │   └── page.tsx
│   │   │       ├── schedule/
│   │   │       │   ├── components/
│   │   │       │   │   ├── AddEventModal.tsx
│   │   │       │   │   ├── DayEventsList.tsx
│   │   │       │   │   ├── EventCard.tsx
│   │   │       │   │   ├── ScheduleCalendar.tsx
│   │   │       │   │   └── UpcomingEvents.tsx
│   │   │       │   ├── hooks/
│   │   │       │   │   ├── useEventActions.ts
│   │   │       │   │   ├── useSchedule.ts
│   │   │       │   │   └── useScheduleNotifications.ts
│   │   │       │   └── page.tsx
│   │   │       ├── tasks/
│   │   │       │   ├── components/
│   │   │       │   │   ├── AddTaskModal.tsx
│   │   │       │   │   ├── EditTaskModal.tsx
│   │   │       │   │   ├── TagManager.tsx
│   │   │       │   │   ├── TaskItem.tsx
│   │   │       │   │   └── Timeline.tsx
│   │   │       │   ├── hooks/
│   │   │       │   │   └── useTaskTimer.ts
│   │   │       │   └── page.tsx
│   │   │       └── trends/
│   │   │           ├── components/
│   │   │           │   ├── FocusGoalCalendar.tsx
│   │   │           │   ├── FocusTimeChart.tsx
│   │   │           │   ├── PomodoroChart.tsx
│   │   │           │   ├── ProjectDistribution.tsx
│   │   │           │   ├── StatsCards.tsx
│   │   │           │   └── TimeRangeSelector.tsx
│   │   │           ├── hooks/
│   │   │           │   ├── useTrendsData.ts
│   │   │           │   └── useTrendsFilters.ts
│   │   │           └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── evening-helpers.ts
│   │   │   ├── habits-helpers.ts
│   │   │   ├── health-helpers.ts
│   │   │   ├── helpers.ts
│   │   │   ├── highlight-helpers.ts
│   │   │   ├── keynotes-helpers.ts
│   │   │   ├── middleware.ts
│   │   │   ├── progress-helpers.ts
│   │   │   ├── project-helpers.ts
│   │   │   ├── routine-helpers.ts
│   │   │   ├── schedule-helpers.ts
│   │   │   ├── server.ts
│   │   │   ├── task-helpers.ts
│   │   │   └── trends-helpers.ts
│   │   └── utils/
│   │       ├── exportUtils.ts (file-todo/trends)
│   │       └── progressExportUtils.ts (file-routine/progress)
│   └── types/
│       └── database.ts (file)
├── tailwind.config.ts (file)
└── tsconfig.json (file)

```