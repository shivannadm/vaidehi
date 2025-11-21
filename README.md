# Project Structure

```
VAIDEHI/
├── .next/
├── node_modules/
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
│   │   │   │   │   ├── routine/
│   │   │   │   │   ├── todo/
│   │   │   │   │   ├── trading/
│   │   │   │   │   └── Sidebar.tsx
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   └── theme-script.tsx
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
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── types/
│   │   └── database.ts
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```