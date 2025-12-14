// src/app/dashboard/docs/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
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
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-4xl mx-auto ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 sm:p-8 lg:p-12`}>
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            🚀 Welcome to Vaidehi
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
            Your all-in-one platform for productivity, routine optimization, and trading excellence.
          </p>
        </div>

        {/* TO DO Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            📋 TO DO Features
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tasks
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Create, organize, and track your daily tasks with priorities, due dates, and tags. Stay on top of your workload with a clean, intuitive task manager.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Schedule
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Manage your calendar with time-blocked events, reminders, and notifications. Never miss an important meeting or deadline.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Daily Highlights
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Define your 3 most important tasks each day. Focus on what matters most and build momentum toward your goals.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Projects
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Break down big goals into manageable milestones. Track progress with kanban boards, timelines, and detailed task lists.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ToDo Notes
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Quick capture for ideas, reference materials, and meeting notes. Color-code and organize your thoughts effortlessly.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trends
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Visualize your productivity patterns over time with charts and analytics. Understand when you're most productive and optimize your schedule.
              </p>
            </div>
          </div>
        </section>

        {/* ROUTINE Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            🏋️ ROUTINE Features
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Morning & Evening Routines
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Structured checklists to bookend your day. Build consistent habits by starting and ending each day with intention.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Habits
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Track daily habits with streak counting, completion rates, and detailed analytics. Build the life you want, one habit at a time.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Health Tracking
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Log workouts, meals, sleep quality, and wellness metrics. Monitor your physical and mental health in one place.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Key Notes
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Capture learnings, reflections, and insights from your daily routine. Build a personal knowledge base.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Progress Dashboard
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Comprehensive dashboards showing your consistency, habit heatmaps, health trends, and routine adherence over time.
              </p>
            </div>
          </div>
        </section>

        {/* TRADING Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            📊 TRADING Features
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trading Dashboard
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Real-time P&L tracking, win rate statistics, equity curves, and performance metrics. Get a complete overview of your trading at a glance.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trading Journal
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Log every trade with entry price, exit price, strategy used, emotional state, and detailed notes. Review and learn from every position.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trading Rules
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Define your trading rules and track adherence. Build discipline by measuring how well you follow your own guidelines.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Strategies
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Document your trading strategies with entry/exit criteria, risk management rules, and backtesting results. Refine what works.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Backtest
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Test your strategies against historical data. Validate your ideas before risking real capital.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Analytics
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Deep dive into your trading performance with advanced charts, risk metrics, time-based analysis, and strategy comparisons.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Quick Notes
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                Rapid capture for market observations, trading ideas, and lessons learned. Keep your thoughts organized and accessible.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className={`pt-8 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Need help? Have questions? Contact support or join our community.
          </p>
        </div>
      </div>
    </div>
  );
}