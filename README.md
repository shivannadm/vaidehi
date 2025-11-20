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
│   │   │   ├── login/
│   │   │   ├── reset-password/
│   │   │   ├── signup/
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
│   │   │       └── route.ts
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
│   │   │   │   └── DashboardShell.tsx
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

