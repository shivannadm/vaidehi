// ============================================
// FILE: src/app/dashboard/page.tsx
// ✅ FIXED: Proper theme detection
// ============================================

"use client";
import { useState, useEffect } from "react";
import { 
  BookOpen, Zap, MessageCircle, HelpCircle, 
  TrendingUp, Target, Sparkles, ArrowRight,
  CheckCircle, Calendar, Activity
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardHome() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userName, setUserName] = useState("Friend");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Theme detection
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

  // Fetch user info
  useEffect(() => {
    if (!mounted) return;

    const fetchUserInfo = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get full name from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]); // First name only
        } else {
          // Fallback to email username
          const emailName = user.email?.split('@')[0] || "Friend";
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
    };

    fetchUserInfo();
  }, [mounted]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950'}`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className={`text-sm font-medium ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
              Your Personal Growth Platform
            </span>
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {getGreeting()}, <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              {userName}
            </span>
            ! 👋
          </h1>

          <p className={`text-xl sm:text-2xl lg:text-3xl font-medium mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Master Your Routine and Trading. Build Better Habits.
          </p>
          <p className={`text-lg sm:text-xl ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-3xl mx-auto`}>
            Track every trade, optimize your routine, and unlock your full potential with data-driven insights.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Docs Button */}
          <a
            href="/dashboard/docs"
            className={`group relative overflow-hidden ${isLight ? 'bg-white border-slate-200 hover:border-blue-300' : 'bg-slate-800 border-slate-700 hover:border-blue-600'} border-2 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Documentation
              </h3>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mb-4`}>
                Complete guides for every feature
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Go Pro Button */}
          <a
            href="/dashboard/go-pro"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-orange-500/25"
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Go Pro
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Unlock unlimited features & power
              </p>
              <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                <span>Upgrade Now</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Feedback Button */}
          <a
            href="/dashboard/support?tab=feedback"
            className={`group relative overflow-hidden ${isLight ? 'bg-white border-slate-200 hover:border-purple-300' : 'bg-slate-800 border-slate-700 hover:border-purple-600'} border-2 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Feedback
              </h3>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mb-4`}>
                Share your thoughts with us
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>Send</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Help Button */}
          <a
            href="/dashboard/support?tab=help"
            className={`group relative overflow-hidden ${isLight ? 'bg-white border-slate-200 hover:border-green-300' : 'bg-slate-800 border-slate-700 hover:border-green-600'} border-2 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Get Help
              </h3>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mb-4`}>
                We're here to support you
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                <span>Contact</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Quick Access Section */}
        <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-slate-200' : 'bg-slate-800/80 backdrop-blur-sm border-slate-700'} border rounded-3xl p-8 sm:p-10 mb-16`}>
          <h2 className={`text-3xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-3`}>
            <Activity className="w-8 h-8 text-indigo-600" />
            Quick Access
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <a
              href="/dashboard/todo/tasks"
              className={`group p-6 rounded-xl ${isLight ? 'bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100' : 'bg-gradient-to-br from-pink-900/20 to-rose-900/20 hover:from-pink-900/30 hover:to-rose-900/30'} transition-all duration-300 hover:scale-105`}
            >
              <CheckCircle className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Tasks</h3>
              <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Manage your to-dos</p>
            </a>

            <a
              href="/dashboard/todo/schedule"
              className={`group p-6 rounded-xl ${isLight ? 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100' : 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 hover:from-blue-900/30 hover:to-cyan-900/30'} transition-all duration-300 hover:scale-105`}
            >
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Schedule</h3>
              <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Plan your day</p>
            </a>

            <a
              href="/dashboard/routine/habits"
              className={`group p-6 rounded-xl ${isLight ? 'bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100' : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 hover:from-purple-900/30 hover:to-indigo-900/30'} transition-all duration-300 hover:scale-105`}
            >
              <Target className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Habits</h3>
              <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Build consistency</p>
            </a>

            <a
              href="/dashboard/trading/dashboard"
              className={`group p-6 rounded-xl ${isLight ? 'bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100' : 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 hover:from-green-900/30 hover:to-emerald-900/30'} transition-all duration-300 hover:scale-105`}
            >
              <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
              <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Trading</h3>
              <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>View dashboard</p>
            </a>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className={`text-center ${isLight ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200' : 'bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20 border-indigo-700'} border rounded-2xl p-10`}>
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className={`text-2xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Today's Insight
          </h3>
          <p className={`text-lg italic ${isLight ? 'text-slate-700' : 'text-slate-300'} max-w-2xl mx-auto`}>
            "Success is the sum of small efforts repeated day in and day out. Your consistency today builds your excellence tomorrow."
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}