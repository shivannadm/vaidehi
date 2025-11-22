// src/app/dashboard/todo/tasks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateToString } from "@/types/database";

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string | null>(null);

  // Get current theme from document
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Get user
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();

    // Check theme
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };
    checkTheme();

    // Watch theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Loading state
  if (!mounted || !userId) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const dateString = formatDateToString(selectedDate);
  const isToday = dateString === formatDateToString(new Date());

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Page Header */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} px-6 py-4 sticky top-0 z-10`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Task
          </h1>
          
          {/* Timer Display (Placeholder) */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isDark 
                ? 'bg-slate-700 border-slate-600' 
                : 'bg-white border-slate-300'
            }`}>
              <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </button>
              <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className={`text-3xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              00:00
            </div>
          </div>
        </div>
      </div>

      {/* Date Roller */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} px-6 py-3`}>
        <div className="flex items-center justify-between max-w-md">
          <button
            onClick={() => {
              const prev = new Date(selectedDate);
              prev.setDate(prev.getDate() - 1);
              setSelectedDate(prev);
            }}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>

          <button
            onClick={() => {
              const next = new Date(selectedDate);
              next.setDate(next.getDate() + 1);
              setSelectedDate(next);
            }}
            className={`p-2 rounded-lg transition ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            disabled={!isToday}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="ml-4 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Today
            </button>
          )}

          <button className={`p-2 rounded-lg transition ${
            isDark 
              ? 'hover:bg-slate-700 text-slate-300' 
              : 'hover:bg-slate-100 text-slate-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - Task Lists */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Task to Complete */}
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Task to complete
              </h2>

              <div className="space-y-2">
                {/* Add Task Button */}
                <button className={`w-full text-left px-3 py-2 rounded-lg border-2 border-dashed transition ${
                  isDark 
                    ? 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300' 
                    : 'border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600'
                }`}>
                  + Add task
                </button>

                {/* Placeholder Task Item */}
                <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <div className="flex-1">
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Sample Task
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    #learning
                  </span>
                  <span className="text-yellow-500">⭐</span>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Completed tasks
              </h2>
              <p className={`text-sm text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No completed tasks yet
              </p>
            </div>
          </div>

          {/* CENTER COLUMN - Timeline */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Today's Task time Record
              </h2>
              <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <p className="text-sm">No time records yet</p>
                <p className="text-xs mt-2">Start a task timer to see it here</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Extras */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tags */}
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                <button className={`px-3 py-1 rounded-full text-sm transition ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}>
                  + Add
                </button>
              </div>
            </div>

            {/* Task Report */}
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Task Report
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Task Completed:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>0</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Task in progress:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>0</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Total focused time:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>0h 0m</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Day focus goal:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>7h</span>
                </div>
              </div>
            </div>

            {/* Day Note */}
            <div className={`rounded-xl border p-5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Day Note
              </h2>
              <textarea
                placeholder="Add your day key insights here...."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}