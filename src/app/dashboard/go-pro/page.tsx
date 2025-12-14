// src/app/dashboard/go-pro/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Zap, Check, ArrowRight } from "lucide-react";

export default function GoProPage() {
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

  const features = [
    "Unlimited tasks, projects, and notes",
    "Advanced analytics and insights",
    "Priority customer support",
    "Export data in multiple formats",
    "Custom themes and personalization",
    "AI-powered suggestions (coming soon)",
    "Cloud backup and sync",
    "Remove all limits and unlock full potential"
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/30">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Upgrade to Pro
          </h1>
          <p className={`text-lg sm:text-xl ${isDark ? 'text-slate-300' : 'text-slate-700'} max-w-2xl mx-auto`}>
            Unlock the full power of Vaidehi and take your productivity, routine, and trading to the next level.
          </p>
        </div>

        {/* Pricing Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl p-8 sm:p-10 mb-8 shadow-xl`}>
          
          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-5xl sm:text-6xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $9.99
              </span>
              <span className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                /month
              </span>
            </div>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              or $99/year (save 17%)
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg font-semibold rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group">
            <span>Subscribe Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>

          <p className={`text-center mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Cancel anytime. No questions asked.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className={`${isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'} border rounded-xl p-6 text-center`}>
          <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            🚀 Coming Soon
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            We're currently finalizing our Pro subscription plans. Check back soon for the official launch!
          </p>
        </div>
      </div>
    </div>
  );
}