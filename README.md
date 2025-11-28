vaidehi/
├── .gitignore (file)
├── README.md (file)
├── eslint.config.mjs (file)
├── middleware.ts (file)
├── next.config.ts (file)
├── package-lock.json (file)
├── package.json (file)
├── postcss.config.mjs (file)
├── public/
│   ├── file.svg (file)
│   ├── globe.svg (file)
│   ├── images/
│   │   ├── l3.png (file)
│   │   └── testimony/
│   │       ├── person1.jpg (file)
│   │       ├── person2.jpg (file)
│   │       ├── person3.jpg (file)
│   │       └── person4.jpg (file)
│   └── window.svg (file)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── callback/
│   │   │   │   └── route.ts (file)
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx (file)
│   │   │   ├── layout.tsx (file)
│   │   │   ├── login/
│   │   │   │   └── page.tsx (file)
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx (file)
│   │   │   └── signup/
│   │   │       └── page.tsx (file)
│   │   ├── (landing)/
│   │   │   ├── components/
│   │   │   │   ├── AnimatedBackground.tsx (file)
│   │   │   │   ├── FinalCTA.tsx (file)
│   │   │   │   ├── Footer.tsx (file)
│   │   │   │   ├── Header.tsx (file)
│   │   │   │   ├── Hero.tsx (file)
│   │   │   │   ├── HeroMockup.tsx (file)
│   │   │   │   ├── HowItWorks.tsx (file)
│   │   │   │   ├── Pricing.tsx (file)
│   │   │   │   └── TypeRotator.tsx (file)
│   │   │   └── page.tsx (file)
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardShell.tsx (file)
│   │   │   │   ├── header/
│   │   │   │   │   ├── NotificationDropdown.tsx (file)
│   │   │   │   │   ├── ProfileDropdown.tsx (file)
│   │   │   │   │   ├── StreakCounter.tsx (file)
│   │   │   │   │   └── TopHeader.tsx (file)
│   │   │   │   ├── modals/
│   │   │   │   │   ├── ProfileModal.tsx (file)
│   │   │   │   │   └── SettingsModal.tsx (file)
│   │   │   │   ├── sidebar/
│   │   │   │   │   └── Sidebar.tsx (file)
│   │   │   │   └── theme-script.tsx (file)
│   │   │   ├── layout.tsx (file)
│   │   │   ├── page.tsx (file)
│   │   │   ├── routine/
│   │   │   │   ├── evening/
│   │   │   │   │   └── page.tsx (file)
│   │   │   │   └── morning/
│   │   │   │       ├── components/
│   │   │   │       │   └── MorningForm.tsx (file)
│   │   │   │       ├── hooks/
│   │   │   │       │   └── useMorningRoutine.ts (file)
│   │   │   │       └── page.tsx (file)
│   │   │   └── todo/
│   │   │       ├── daily-highlights/
│   │   │       │   ├── components/
│   │   │       │   │   ├── HighlightInput.tsx (file)
│   │   │       │   │   ├── ReasonSelector.tsx (file)
│   │   │       │   │   ├── StatsCard.tsx (file)
│   │   │       │   │   ├── TomorrowCard.tsx (file)
│   │   │       │   │   └── YesterdayCard.tsx (file)
│   │   │       │   └── page.tsx (file)
│   │   │       ├── notes/
│   │   │       │   ├── components/
│   │   │       │   │   ├── ColorPicker.tsx (file)
│   │   │       │   │   ├── LabelManager.tsx (file)
│   │   │       │   │   ├── NoteCard.tsx (file)
│   │   │       │   │   ├── NoteEditor.tsx (file)
│   │   │       │   │   ├── NoteGrid.tsx (file)
│   │   │       │   │   └── SearchBar.tsx (file)
│   │   │       │   ├── hooks/
│   │   │       │   │   └── useNotes.ts (file)
│   │   │       │   └── page.tsx (file)
│   │   │       ├── projects/
│   │   │       │   ├── [id]/
│   │   │       │   │   └── page.tsx (file)
│   │   │       │   ├── components/
│   │   │       │   │   ├── KanbanBoard.tsx (file)
│   │   │       │   │   ├── MilestoneSection.tsx (file)
│   │   │       │   │   ├── ProgressBar.tsx (file)
│   │   │       │   │   ├── ProjectCard.tsx (file)
│   │   │       │   │   ├── ProjectDetailView.tsx (file)
│   │   │       │   │   ├── ProjectEditor.tsx (file)
│   │   │       │   │   ├── ProjectTaskList.tsx (file)
│   │   │       │   │   └── TimelineView.tsx (file)
│   │   │       │   ├── hooks/
│   │   │       │   │   ├── useProjectProgress.ts (file)
│   │   │       │   │   ├── useProjectTasks.ts (file)
│   │   │       │   │   └── useProjects.ts (file)
│   │   │       │   └── page.tsx (file)
│   │   │       ├── schedule/
│   │   │       │   ├── components/
│   │   │       │   │   ├── AddEventModal.tsx (file)
│   │   │       │   │   ├── DayEventsList.tsx (file)
│   │   │       │   │   ├── EventCard.tsx (file)
│   │   │       │   │   ├── ScheduleCalendar.tsx (file)
│   │   │       │   │   └── UpcomingEvents.tsx (file)
│   │   │       │   ├── hooks/
│   │   │       │   │   ├── useEventActions.ts (file)
│   │   │       │   │   ├── useSchedule.ts (file)
│   │   │       │   │   └── useScheduleNotifications.ts (file)
│   │   │       │   └── page.tsx (file)
│   │   │       ├── tasks/
│   │   │       │   ├── components/
│   │   │       │   │   ├── AddTaskModal.tsx (file)
│   │   │       │   │   ├── EditTaskModal.tsx (file)
│   │   │       │   │   ├── TagManager.tsx (file)
│   │   │       │   │   ├── TaskItem.tsx (file)
│   │   │       │   │   └── Timeline.tsx (file)
│   │   │       │   ├── hooks/
│   │   │       │   │   └── useTaskTimer.ts (file)
│   │   │       │   └── page.tsx (file)
│   │   │       └── trends/
│   │   │           ├── components/
│   │   │           │   ├── FocusGoalCalendar.tsx (file)
│   │   │           │   ├── FocusTimeChart.tsx (file)
│   │   │           │   ├── PomodoroChart.tsx (file)
│   │   │           │   ├── ProjectDistribution.tsx (file)
│   │   │           │   ├── StatsCards.tsx (file)
│   │   │           │   └── TimeRangeSelector.tsx (file)
│   │   │           ├── hooks/
│   │   │           │   ├── useTrendsData.ts (file)
│   │   │           │   └── useTrendsFilters.ts (file)
│   │   │           └── page.tsx (file)
│   │   ├── favicon.ico (file)
│   │   └── globals.css (file)
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts (file)
│   │       ├── helpers.ts (file)
│   │       ├── highlight-helpers.ts (file)
│   │       ├── middleware.ts (file)
│   │       ├── project-helpers.ts (file)
│   │       ├── routine-helpers.ts (file)
│   │       ├── schedule-helpers.ts (file)
│   │       ├── server.ts (file)
│   │       ├── task-helpers.ts (file)
│   │       └── trends-helpers.ts (file)
│   └── types/
│       └── database.ts (file)
└── tailwind.config.ts (file)
└── tsconfig.json (file)