# Vaidehi - Advanced Personal Productivity & Routine Management System

<div align="center">
  <img src="public/assets/logo/logo.png" alt="Vaidehi Logo" width="50"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
</div>

## 🎯 Overview

**Vaidehi** is an entrepreneur-level productivity management system designed to help individuals organize their daily tasks, routines, health tracking, and trading activities. Built with Next.js 14+, it provides a comprehensive suite of tools for personal development, time management, and goal achievement.

The platform emphasizes:
- **Daily Task Management** with time tracking
- **Routine Building** (Morning, Evening, Health tracking)
- **Habit Formation** with streak tracking
- **Trading Journal** for traders
- **Project Management** with Kanban boards
- **Analytics & Progress Tracking**

## ✨ Features

### 📝 Task Management
- **Visual Task Board** with drag-and-drop functionality(Project)
- **Real-time Timer** - Track time spent on each task
- **Tag System** - Organize tasks with color-coded tags
- **Daily Timeline** - Visualize your day with time blocks
- **Task Reports** - View completion rates and focus time
- **Day Notes** - Add context and insights for each day
- **Recurring Tasks** - Automatically carry over incomplete tasks

### 🌅 Routine Management

#### Morning Routine
- Wake time tracking
- Meditation & exercise logging
- Energy level assessment
- Custom habit fields
- Streak tracking

#### Evening Routine
- Shutdown time tracking
- Screen time & reading time
- Reflection rating (1-10)
- Tomorrow's top 3 priorities
- Gratitude journal (3 items)

#### Health Tracking
- Sleep quality & duration
- Hydration monitoring (water intake)
- Nutrition tracking (meals, protein, calories)
- Physical activity (steps, workout minutes)
- Vitals (heart rate, HRV, blood pressure)
- Mental wellness (mood, stress, anxiety levels)
- Body metrics (weight, temperature)

### 🎯 Daily Highlights
- Set one key task per day
- Select reason: Urgency, Satisfaction, or Joy
- Yesterday's reflection
- Tomorrow's preview
- Completion tracking

### 🗒️ Notes System
- Color-coded notes
- Label management
- Pin important notes
- Archive old notes
- Full-text search

### 📊 Projects
- Project cards with status badges
- Kanban board view
- Progress tracking
- Timeline visualization
- Task assignment to projects
- Milestone tracking

### 📅 Schedule
- Monthly calendar view
- Event type categorization (Trading, Project, Routine, etc.)
- Time conflict detection
- Recurring events
- Event color coding

### 📈 Trends & Analytics
- Focus time bar charts
- Project distribution (donut chart)
- Pomodoro session timeline
- Goal achievement calendar
- Weekly/monthly summaries
- Completion rate statistics

### 🎲 Habits
- Daily habit tracking
- Streak counter (current & best)
- Weekly progress visualization
- Habit categories
- Completion heatmap

### 📓 Key Notes
- Capture insights & lessons
- Link to specific dates
- Action items with deadlines
- Review count tracking
- Note categories (Personal, Work, Health, Finance, etc.)

### 💹 Trading Journal (Advanced)
- Trade logging with P&L calculation
- Strategy management
- Trading rules adherence
- Backtest results
- Performance analytics
- Quick notes (pre-market, post-market)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, storage
- **Row Level Security (RLS)** - Data protection

### State Management
- React Context API
- Custom hooks

### Charts & Visualization
- Recharts (for analytics)
- Custom SVG components

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/shivannadm/vaidehi.git
cd vaidehi
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase**

Run the SQL scripts (Based on supabase/database.ts and helpers) to create the necessary tables:
- profiles
- tasks
- task_sessions
- tags
- daily_goals
- day_notes
- projects
- schedule_events
- daily_highlights
- notes
- habits
- habit_completions
- morning_routine_entries
- evening_routine_entries
- health_entries
- key_notes
- trading_rules, strategies, trades (optional for traders)

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
- Main file structure(for deep file structure, follow nested file-git repo)
```
vaidehi/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (landing)/                # Landing page
│   │   └── dashboard/                # Main application
│   │       ├── components/           # Shared components
│   │       │   ├── header/
│   │       │   ├── sidebar/
│   │       │   └── modals/
│   │       ├── todo/                 # Task management
│   │       │   ├── tasks/
│   │       │   ├── daily-highlights/
│   │       │   ├── notes/
│   │       │   ├── projects/
│   │       │   ├── schedule/
│   │       │   └── trends/
│   │       ├── routine/              # Routine management
│   │       │   ├── morning/
│   │       │   ├── evening/
│   │       │   ├── health/
│   │       │   ├── habits/
│   │       │   ├── keynotestests/
│   │       │   └── progress/
│   │       └── trading/
│   │           ├── dashboard
│   │           ├── rules 
│   │           ├── journal
│   │           ├── backtest
│   │           ├── strategies
│   │           ├── quick-notes
│   │           └── performance
│   │     
│   ├── lib/
│   │   ├── supabase/                 # Database helpers
│   │   │   ├── client.ts
│   │   │   ├── task-helpers.ts
│   │   │   ├── project-helpers.ts
│   │   │   ├── schedule-helpers.ts
│   │   │   ├── routine-helpers.ts
│   │   │   ├── habits-helpers.ts
│   │   │   ├── health-helpers.ts
│   │   │   └── trends-helpers.ts
│   │   └── utils/                    # Utility functions
│   └── types/
│       └── database.ts               # TypeScript types
├── public/
│   └── images/
└── middleware.ts                     # Next.js middleware
```

## 🔄 Workflow

### Daily Workflow

1. **Morning Start**
   - Log in to your dashboard
   - Check your streak counter
   - Review yesterday's highlights
   - Set today's highlight (one key task)
   - Log morning routine (wake time, meditation, exercise)

2. **Task Management**
   - View tasks on the task board
   - Create new tasks with tags
   - Start timer when working on a task
   - Timer tracks time automatically
   - Complete tasks and see them move to "Completed"

3. **Throughout the Day**
   - Check schedule for events
   - Log health metrics (water intake, meals)
   - Take notes as needed
   - Track project progress

4. **Evening Wind-down**
   - Complete evening routine (shutdown time, reflection)
   - Mark habits as completed
   - Review today's timeline
   - Check task completion report
   - Add day notes for insights

5. **Weekly Review**
   - Check trends page for analytics
   - Review habit streaks
   - Analyze focus time distribution
   - Adjust goals for next week

### Task Timer Workflow

```
[Create Task] → [Start Timer] → [Work on Task] → [Stop Timer] → [Mark Complete]
     ↓              ↓                ↓                ↓               ↓
  Add to       Logs start       Time blocks      Calculates       Moves to
  todo list      time           appear in        total time       completed
                               timeline view                       section
```

### Project Workflow

```
[Create Project] → [Add Tasks] → [Assign Tags] → [Track Progress] → [Complete]
       ↓               ↓              ↓                ↓                 ↓
   Set status     Link tasks    Color coding    Visual progress    Mark as
   & priority    to project                        bar             completed
```

## 📸 Screenshots

### Task Management
![Tasks Page](./docs/screenshots/tasks.png)
*Task board with timer, tags, and timeline view*

### Routine Tracking
![Morning Routine](./docs/screenshots/morning.png)
*Morning routine entry with streak tracking*

### Analytics Dashboard
![Trends](./docs/screenshots/trends.png)
*Focus time analytics and project distribution*

### Projects
![Projects](./docs/screenshots/projects.png)
*Project cards with progress tracking*

## 🎨 Key Features Explained

### Real-time Task Timer
- Click play button to start tracking time
- Timer runs in background (persists across page navigation)
- Automatic pause detection
- Midnight crossing support (splits sessions across days)
- Visual time blocks in timeline

### Tag System
- Create unlimited color-coded tags
- Filter tasks by tag
- Quick tag assignment
- Tag usage analytics

### Streak Counter
- Tracks consecutive days of activity
- Displayed in header (🔥 15 Streaks)
- Motivational gamification element
- Resets if day is missed

### Goal Progress
- Set daily focus time goal (default 7 hours)
- Real-time progress tracking
- Visual percentage display (48% in example)
- Color-coded achievement status

### Timeline View
- Hourly breakdown (08:00 - 13:00 shown)
- Color-coded task blocks
- Task duration displayed (1h, 1h 4m, 1h 11m)
- Current time indicator (red line)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Maintain file structure
- Follow TypeScript best practices
- Add comments for complex logic
- Test thoroughly before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Shivanna DM**
- GitHub: [@shivannadm](https://github.com/shivannadm)
- Project: [Vaidehi](https://github.com/shivannadm/vaidehi)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- All contributors and users

## 📞 Support

For support, email shivannadm16@gmail.com or open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by Shivanna DM
  
  ⭐ Star this repository if you find it helpful!
</div>
