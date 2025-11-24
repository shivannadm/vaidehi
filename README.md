# Project Structure

```
VAIDEHI/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
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
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── rout.ts
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
│   │   │   │   ├── sidebar/
│   │   │   │   │   └── Sidebar.tsx
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   └── theme-script.tsx
│   │   │   ├── routine/
│   │   │   │   └── page.tsx
│   │   │   ├── todo/
│   │   │   │   ├── schedule/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── AddEventModal.tsx
│   │   │   │   │   │   ├── DayEventsList.tsx
│   │   │   │   │   │   ├── EventCard.tsx
│   │   │   │   │   │   ├── ScheduleCalendar.tsx
│   │   │   │   │   │   └── UpcomingEvents.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   ├── useEventActions.ts
│   │   │   │   │   │   ├── useSchedule.ts
│   │   │   │   │   │   └── useScheduleNotifications.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── AddTaskModal.tsx
│   │   │   │   │   │   ├── EditTaskModal.tsx
│   │   │   │   │   │   ├── TagManager.tsx
│   │   │   │   │   │   ├── TaskItem.tsx
│   │   │   │   │   │   └── Timeline.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useTaskTimer.ts
│   │   │   │   │   └── page.tsx
│   │   │   ├── trading/
│   │   │   │   ├── layout.tsx(not yet)
│   │   │   │   └── page.tsxnot (yet)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── helpers.ts
│   │       ├── schedule-helpers.ts
│   │       ├── task-helpers.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── types/
│   │   └── database.ts
├── README.md
├── globals.css
├── layout.tsx
├── package.json
├── package-lock.json
├── tailwind.config.ts
└── tsconfig.json
```
