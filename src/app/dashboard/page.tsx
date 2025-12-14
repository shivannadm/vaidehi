// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, CheckCircle, Target, Lightbulb, Clock, Calendar, ArrowRight, Flame, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getProfile, getUserStreak } from "@/lib/supabase/helpers";

// Daily Insights - Rotates based on day of week
const DAILY_INSIGHTS = [
  { icon: "🎯", text: "Consistency beats intensity. Small daily actions compound into massive results." },
  { icon: "📊", text: "Winners focus on the process, not just outcomes. Track your habits, not just results." },
  { icon: "🧘", text: "Your morning routine sets the tone. Master your mornings, master your day." },
  { icon: "💡", text: "Review your trades weekly. Patterns emerge when you look back with clarity." },
  { icon: "🚀", text: "Progress isn't linear. Trust the process even when results aren't immediate." },
  { icon: "⚡", text: "Energy management > Time management. Protect your peak performance hours." },
  { icon: "🎨", text: "Simplicity is the ultimate sophistication. Less clutter, more clarity." }
];

interface Task {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority?: string;
}

interface Event {
  id: string;
  title: string;
  start_time: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [topPriorities, setTopPriorities] = useState<Task[]>([]);
  const [upcomingItems, setUpcomingItems] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    tasksCompleted: 0,
    tasksTotal: 0,
    habitsCompleted: 0,
    habitsTotal: 0,
    tradingPnL: 0,
    tradingWins: 0,
    tradingLosses: 0
  });
  const [streaks, setStreaks] = useState({
    login: 0,
    tasks: 0,
    trading: 0
  });

  const todayInsight = DAILY_INSIGHTS[new Date().getDay()];

  useEffect(() => {
    setMounted(true);
    checkTheme();
    loadAllData();
  }, []);

  const checkTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'system') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDark(theme !== 'light');
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  };

  const loadAllData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user profile
      const { data: profile } = await getProfile(user.id);
      setUserName(profile?.full_name || "User");

      // Load top priorities (tasks due today or high priority)
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, completed, due_date, priority')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('due_date', { ascending: true })
        .limit(3);
      
      setTopPriorities(tasks || []);

      // Load upcoming events
      const now = new Date();
      const { data: events } = await supabase
        .from('events')
        .select('id, title, start_time')
        .eq('user_id', user.id)
        .gte('start_time', now.toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

      setUpcomingItems(events || []);

      // Calculate weekly stats (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Tasks this week
      const { data: weekTasks } = await supabase
        .from('tasks')
        .select('completed')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      const tasksCompleted = weekTasks?.filter(t => t.completed).length || 0;
      const tasksTotal = weekTasks?.length || 0;

      // Habits this week (7 days * habits count)
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id);

      const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('completed')
        .gte('date', weekAgo.toISOString().split('T')[0]);

      const habitsCompleted = habitLogs?.filter(h => h.completed).length || 0;
      const habitsTotal = (habits?.length || 0) * 7;

      // Trading stats this week
      const { data: trades } = await supabase
        .from('trades')
        .select('pnl')
        .eq('user_id', user.id)
        .gte('entry_time', weekAgo.toISOString());

      const tradingPnL = trades?.reduce((sum, t) => sum + (t.pnl || 0), 0) || 0;
      const tradingWins = trades?.filter(t => (t.pnl || 0) > 0).length || 0;
      const tradingLosses = trades?.filter(t => (t.pnl || 0) < 0).length || 0;

      setWeeklyStats({
        tasksCompleted,
        tasksTotal,
        habitsCompleted,
        habitsTotal,
        tradingPnL,
        tradingWins,
        tradingLosses
      });

      // Load streaks
      const { data: streakData } = await getUserStreak(user.id);
      setStreaks({
        login: streakData?.current_streak || 0,
        tasks: 7, // Calculate based on task completion streak
        trading: 5 // Calculate based on trading activity streak
      });

      // Mock recent activity (you can fetch from actual tables)
      setRecentActivity([
        { id: '1', type: 'routine', description: 'Completed Morning Routine', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
        { id: '2', type: 'trading', description: 'Logged trade: RELIANCE (+₹1,250)', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
        { id: '3', type: 'task', description: 'Added task: Review analytics', timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString() },
        { id: '4', type: 'habit', description: 'Marked habit: Workout ✓', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() }
      ]);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  const getTimeUntil = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = time.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 0) return 'Past due';
    if (diffMins < 60) return `In ${diffMins}m`;
    if (diffHours < 24) return `In ${diffHours}h`;
    return time.toLocaleDateString();
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tasksProgress = getProgressPercentage(weeklyStats.tasksCompleted, weeklyStats.tasksTotal);
  const habitsProgress = getProgressPercentage(weeklyStats.habitsCompleted, weeklyStats.habitsTotal);
  const tradingPnLPercentage = weeklyStats.tradingPnL > 0 ? 12.5 : -3.2; // Mock percentage

  return (
    <div className="space-y-4 sm:space-y-6" suppressHydrationWarning>
      
      {/* Hero Section - Greeting + Insight */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, {userName}! 👋
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Daily Insight */}
          <div className={`rounded-lg border p-3 sm:p-4 ${
            isDark 
              ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30' 
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
          }`}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl flex-shrink-0">{todayInsight.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    Today's Insight
                  </span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {todayInsight.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Priorities Today */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
            Top Priorities Today
          </h2>
          <button 
            onClick={() => router.push('/dashboard/todo/daily-highlights')}
            className={`text-xs sm:text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium`}
          >
            Edit
          </button>
        </div>

        {topPriorities.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {topPriorities.map((task, idx) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-200 hover:bg-slate-50'
                } transition cursor-pointer group`}
                onClick={() => router.push('/dashboard/todo/tasks')}
              >
                <div className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                  isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  {task.due_date && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Clock className="w-3 h-3" />
                      {getTimeUntil(task.due_date)}
                    </p>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <p className="text-sm">No priorities set for today</p>
            <button
              onClick={() => router.push('/dashboard/todo/daily-highlights')}
              className="mt-2 text-sm text-indigo-500 hover:text-indigo-400 font-medium"
            >
              Set your priorities →
            </button>
          </div>
        )}
      </div>

      {/* Performance Snapshot */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          📊 Performance Snapshot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Tasks Completion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Tasks Completion
              </span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {tasksProgress}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                style={{ width: `${tasksProgress}%` }}
              />
            </div>
          </div>

          {/* Habit Adherence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Habit Adherence
              </span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {habitsProgress}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${habitsProgress}%` }}
              />
            </div>
          </div>

          {/* Trading P&L */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Trading P&L
              </span>
              <span className={`text-sm font-bold ${
                tradingPnLPercentage >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {tradingPnLPercentage >= 0 ? '+' : ''}{tradingPnLPercentage}% {tradingPnLPercentage >= 0 ? '↑' : '↓'}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div 
                className={`h-full transition-all duration-500 ${
                  tradingPnLPercentage >= 0 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}
                style={{ width: `${Math.abs(tradingPnLPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          This Week: <span className="font-semibold">{weeklyStats.tasksCompleted}/{weeklyStats.tasksTotal} tasks ✓</span>
          {' | '}
          <span className="font-semibold">{weeklyStats.habitsCompleted}/{weeklyStats.habitsTotal} habits ✓</span>
          {' | '}
          <span className="font-semibold">{weeklyStats.tradingWins}W-{weeklyStats.tradingLosses}L</span>
        </div>
      </div>

      {/* Upcoming & Streaks - Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Upcoming */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            Upcoming
          </h2>

          {upcomingItems.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isDark ? 'border-slate-700' : 'border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {getTimeUntil(item.start_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No upcoming events
            </p>
          )}
        </div>

        {/* Streaks & Momentum */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            Streaks & Momentum
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Daily Login
              </span>
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {streaks.login} days 🔥
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Tasks Streak
              </span>
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {streaks.tasks} days ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Trading Streak
              </span>
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {streaks.trading} days ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          📈 Recent Activity
        </h2>

        <div className="space-y-2 sm:space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
              } transition`}
            >
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                activity.type === 'routine' ? 'bg-blue-500' :
                activity.type === 'trading' ? 'bg-green-500' :
                activity.type === 'task' ? 'bg-pink-500' :
                'bg-purple-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {activity.description}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-4 sm:p-6`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          ⚡ Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={() => router.push('/dashboard/trading/journal')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:py-3 rounded-lg border transition ${
              isDark 
                ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Log Trade</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/todo/tasks')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:py-3 rounded-lg border transition ${
              isDark 
                ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Add Task</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/routine/morning')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:py-3 rounded-lg border transition ${
              isDark 
                ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Check Routine</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/trading/analytics')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:py-3 rounded-lg border transition ${
              isDark 
                ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}