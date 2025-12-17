// ============================================
// FILE: src/app/dashboard/docs/page.tsx
// ✅ FIXED: Proper theme detection
// ============================================

"use client";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-4xl mx-auto ${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg p-6 sm:p-8 lg:p-12`}>

        <div className="mb-8 sm:mb-12">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            🚀 Welcome to Vaidehi
          </h1>
          <p className={`text-base sm:text-lg ${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
            Your all-in-one platform for productivity, routine optimization, and trading excellence.
          </p>
        </div>

        {/* TO DO Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
            📋 TO DO Features
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Tasks
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Create, organize, and track your daily tasks with priorities, due dates, and tags. Stay on top of your workload with a clean, intuitive task manager.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Projects
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Break down big goals into manageable milestones. Track progress with kanban boards, timelines, and detailed task lists.
              </p>
            </div>
          </div>
        </section>

        {/* ROUTINE Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
            🏋️ ROUTINE Features
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Morning & Evening Routines
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Structured checklists to bookend your day. Build consistent habits by starting and ending each day with intention.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Habits
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Track daily habits with streak counting, completion rates, and detailed analytics.
              </p>
            </div>
          </div>
        </section>

        {/* TRADING Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${isLight ? 'text-green-600' : 'text-green-400'}`}>
            📊 TRADING Features
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Trading Dashboard
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Real-time P&L tracking, win rate statistics, equity curves, and performance metrics.
              </p>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Trading Journal
              </h3>
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                Log every trade with detailed notes, strategies, and emotional states. Learn from every position.
              </p>
              <a href="/docs" className="text-center text-indigo-600 hover:text-indigo-700">
                more
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className={`pt-8 border-t ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
          <p className={`text-center text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Need help? Have questions? Contact support or join our community.{" "} 
            <a href="/docs" className="text-indigo-600 hover:text-indigo-700">
               More
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}